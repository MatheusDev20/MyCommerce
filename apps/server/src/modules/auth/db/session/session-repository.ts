import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/user/domain/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(refreshToken: string, user: User) {
    const toPersistance = {
      token: refreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    };
    console.log(this.prisma.refreshToken);
    await this.prisma.refreshToken.create({
      data: { ...toPersistance, user: { connect: { id: user._id } } },
    });
  }
}
