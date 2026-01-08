import { Injectable } from '@nestjs/common';
import {
  Prisma,
  Product as PrismaProduct,
} from '@repo/db/generated/prisma/client';
import { Product } from './domain/product.entity';

@Injectable()
export class ProductMapper {
  toPersistence(entity: Product): Prisma.ProductCreateInput {
    const props = entity.getProps();
    console.log(
      'Mapping Product entity to persistence format:',
      props.sku.getValue(),
    );
    return {
      id: props.id,
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
    };
  }

  toDomain(record: PrismaProduct): Product {
    return Product.rehydrate({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      name: record.name,
      description: record.description,
      price: record.price as unknown as number,
      sku: record.sku,
      stockQuantity: record.stockQuantity,
      category: record.category,
      brand: record.brand,
      weight: record.weight,
      width: record.width,
      height: record.height,
      length: record.length,
      isActive: record.isActive,
    });
  }
}
