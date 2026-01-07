import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/domain/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { REFRESH_TOKEN_CONSTANTS } from '../../infra/jwt/constants';

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(refreshToken: string, user: User) {
    const toPersistance = {
      token: refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_CONSTANTS.expirationTime),
    };

    await this.prisma.refreshToken.create({
      data: { ...toPersistance, user: { connect: { id: user._id } } },
    });
  }

  async findByToken(hashedToken: string) {
    return await this.prisma.refreshToken.findFirst({
      where: {
        token: hashedToken,
      },
      include: {
        user: {
          include: {
            addresses: true,
          },
        },
      },
    });
  }

  async deleteByToken(hashedToken: string) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        token: hashedToken,
      },
    });
  }
}
