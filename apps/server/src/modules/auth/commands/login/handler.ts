import { CommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './command';
import { UserRepository } from 'src/libs/ports/repository.port';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { Hashing } from '../../ports/hashing.port';
import { JWTTools } from '../../infra/jwt/jwt';
import { CookieService } from '../../infra/cookies/cookies';

@CommandHandler(LoginCommand)
export class LoginHandler {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('Hashing') private readonly passwordHasher: Hashing,
    private readonly cookiesService: CookieService,
    private readonly jwtTools: JWTTools,
  ) {}
  async execute(response: Response, command: LoginCommand): Promise<any> {
    const { email, password, metadata } = command;

    const user = await this.userRepository.findUnique({ email });

    if (!user) throw new UnauthorizedException();
    const props = user.getProps();

    const isValid = await this.passwordHasher.compare(password, props.password);
    if (!isValid) throw new UnauthorizedException();

    const { access_token } = await this.jwtTools.generate({
      id: props.id,
      properties: { name: props.firstName },
    });

    this.cookiesService.setAccessToken(access_token);

    return { access_token };
  }
}
