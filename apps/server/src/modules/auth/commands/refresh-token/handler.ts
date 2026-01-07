import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from './command';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { Hashing } from '../../ports/hashing.port';
import { JWTTools } from '../../infra/jwt/jwt';
import { CookieService } from '../../infra/cookies/cookies';
import { SessionRepository } from '../../db/session/session-repository';
import { User } from 'src/modules/user/domain/user.entity';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    @Inject('Hashing') private readonly hasher: Hashing,
    private readonly cookiesService: CookieService,
    private readonly jwtTools: JWTTools,
    @Inject('SessionRepository')
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<void> {
    const { refreshToken, res } = command;

    // Hash the refresh token to compare with database
    const hashedToken = await this.hasher.hash(refreshToken, 'refreshToken');

    // Find the refresh token in the database
    const session = await this.sessionRepository.findByToken(hashedToken);

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token is expired
    if (session.expiresAt < new Date()) {
      // Delete expired token
      await this.sessionRepository.deleteByToken(hashedToken);
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Rehydrate user entity from database record
    const user = User.rehydrate({
      id: session.user.id,
      email: session.user.email,
      password: session.user.password,
      firstName: session.user.firstName,
      lastName: session.user.lastName,
      role: session.user.role,
      addresses: session.user.addresses,
      createdAt: session.user.createdAt,
      updatedAt: session.user.updatedAt,
    });

    const props = user.getProps();
    const { access_token } = await this.jwtTools.generate({
      id: props.id,
      properties: { name: props.firstName, role: props.role },
    });

    // Set the new access token in cookies
    this.cookiesService.setAccessToken(res, access_token);
  }
}
