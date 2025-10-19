import { Injectable } from '@nestjs/common';

import { Address } from '../../domain/address.entity';
import { prisma } from '@repo/db';

@Injectable()
/* -> Domain -> ORM/Schema -> Domain */
export class AddressRepository {
  constructor() {}

  // async persist(address: Address): Promise<any> {
  //   const props = address.getProps();

  //   return prisma.address.create({
  //     data: { ...props, zipCode: props.zipCode.getValue() },
  //   });
  // }
}
