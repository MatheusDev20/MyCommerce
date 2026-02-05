import { CommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './command';
import { UserRepository } from 'src/libs/ports/repository.port';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { Hashing } from '../../ports/hashing.port';
import { JWTTools } from '../../infra/jwt/jwt';
import { CookieService } from '../../infra/cookies/cookies';
import { User } from 'src/modules/user/domain/user.entity';
import { SessionRepository } from '../../db/session/session-repository';

@CommandHandler(LoginCommand)
export class LoginHandler {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('Hashing') private readonly hasher: Hashing,
    private readonly cookiesService: CookieService,
    private readonly jwtTools: JWTTools,
    @Inject('SessionRepository')
    private readonly sessionRepository: SessionRepository,
  ) {}

  async execute(command: LoginCommand): Promise<{ user: User }> {
    const { email, password, res } = command;
    const user = await this.userRepository.findUnique({ email });

    if (!user) throw new UnauthorizedException();
    const props = user.getProps();

    const isValid = await this.hasher.compare(password, props.password);
    if (!isValid) throw new UnauthorizedException();

    const { access_token } = await this.jwtTools.generate({
      id: props.id,
      properties: { name: props.firstName, role: props.role },
    });

    const { refresh_token } = await this.jwtTools.generateRefreshToken();

    const hashedToken = await this.hasher.hash(refresh_token, 'refreshToken');
    await this.sessionRepository.save(hashedToken, user);

    this.cookiesService.setAccessToken(res, access_token);
    this.cookiesService.setRefreshToken(res, refresh_token);

    return { user: user };
  }
}
