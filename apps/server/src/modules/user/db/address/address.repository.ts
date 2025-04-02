import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/libs/prisma/service';
import { Address } from '../../domain/address.entity';

@Injectable()
/* -> Domain -> ORM/Schema -> Domain */
export class AddressRepository {
  constructor(private prisma: PrismaService) {}

  async persist(address: Address): Promise<any> {
    const props = address.getProps();

    return this.prisma.address.create({
      data: { ...props, zipCode: props.zipCode.getValue() },
    });
  }
}
