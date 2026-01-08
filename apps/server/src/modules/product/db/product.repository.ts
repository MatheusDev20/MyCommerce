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

  async findBySku(sku: string): Promise<Product | null> {
    const entity = await this.prisma.product.findUnique({
      where: { sku },
    });

    return entity ? this.mapper.toDomain(entity) : null;
  }

  async update(product: Product): Promise<Product> {
    const props = product.getProps();

    const updatedProduct = await this.prisma.product.update({
      where: { id: props.id },
      data: {
        name: props.name,
        description: props.description,
        price: props.price,
        sku: props.sku.getValue(),
        stockQuantity: props.stockQuantity,
        category: props.category,
        brand: props.brand,
        weight: props.weight,
        width: props.width,
        height: props.height,
        length: props.length,
        isActive: props.isActive,
        updatedAt: new Date(),
      },
    });

    return this.mapper.toDomain(updatedProduct);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async findMany(): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return products.map((product) => this.mapper.toDomain(product));
  }
}
