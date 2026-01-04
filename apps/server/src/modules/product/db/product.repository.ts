import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Product } from '../domain/product.entity';
import { ProductRepository } from 'src/libs/ports/repository.port';
import { ProductMapper } from '../product.mapper';
import { Prisma } from '@repo/db';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: ProductMapper,
  ) {}

  async insert(product: Product): Promise<Product> {
    const record = this.mapper.toPersistence(product);

    const createdProduct = await this.prisma.product.create({
      data: record,
    });

    return this.mapper.toDomain(createdProduct);
  }

  async findUnique(
    where: Prisma.ProductWhereUniqueInput,
  ): Promise<Product | null> {
    const entity = await this.prisma.product.findUnique({
      where,
    });

    return entity ? this.mapper.toDomain(entity) : null;
  }
}
