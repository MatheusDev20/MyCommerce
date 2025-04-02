/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from './user-repository.port';
import { PrismaService } from 'src/libs/prisma/service';

@Injectable()
export class UserRepository implements UserRepositoryPort {
  constructor(private prisma: PrismaService) {}

  async persist(user: any): Promise<any> {
    return this.prisma.user.create({
      data: user,
    });
  }
}
