import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllProductsQuery } from './command';
import { Inject } from '@nestjs/common';
import { ProductRepository } from 'src/libs/ports/repository.port';
import { ProductDTO } from '../../schemas/product.dto';

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsHandler
  implements IQueryHandler<GetAllProductsQuery>
{
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(): Promise<ProductDTO[]> {
    const products = await this.productRepository.findMany();

    return products.map((product) => {
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
    });
  }
}
