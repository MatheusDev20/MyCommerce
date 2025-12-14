import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type JWTGeneratePayload = {
  access_token: string;
};

type JWTInput<T> = {
  id: string;
  properties: T;
};

@Injectable()
export class JWTTools {
  constructor(private readonly jwtService: JwtService) {}

  async generate<T>(payload: JWTInput<T>): Promise<JWTGeneratePayload> {
    const data = { sub: payload.id, ...payload.properties };

    const token = await this.jwtService.signAsync(data);

    return { access_token: token };
  }
}
