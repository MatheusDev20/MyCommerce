import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductQuery } from './command';
import { Inject, NotFoundException } from '@nestjs/common';
import { ProductRepository } from 'src/libs/ports/repository.port';
import { ProductDTO } from '../../schemas/product.dto';

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(query: GetProductQuery): Promise<ProductDTO> {
    const product = await this.productRepository.findUnique({
      id: query.productId,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const props = product.getProps();

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
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }
}
