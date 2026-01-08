import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EditProductCommand } from './command';
import { Inject, NotFoundException } from '@nestjs/common';
import { ProductRepository } from 'src/libs/ports/repository.port';
import { Product } from '../../domain/product.entity';

@CommandHandler(EditProductCommand)
export class EditProductHandler implements ICommandHandler<EditProductCommand> {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: EditProductCommand): Promise<{ id: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { productId, metadata, ...updateData } = command;

    const existingProduct = await this.productRepository.findUnique({
      id: productId,
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    const currentProps = existingProduct.getProps();

    // SKU is immutable - cannot be changed after product creation

    // Create updated product entity by rehydrating with merged data
    const updatedProduct = Product.rehydrate({
      id: currentProps.id,
      createdAt: currentProps.createdAt,
      updatedAt: new Date(),
      name: updateData.name ?? currentProps.name,
      description: updateData.description ?? currentProps.description,
      price: updateData.price ?? currentProps.price,
      sku: currentProps.sku.getValue(), // SKU remains unchanged
      stockQuantity: updateData.stockQuantity ?? currentProps.stockQuantity,
      category: updateData.category ?? currentProps.category,
      brand:
        updateData.brand !== undefined ? updateData.brand : currentProps.brand,
      weight:
        updateData.weight !== undefined
          ? updateData.weight
          : currentProps.weight,
      width:
        updateData.width !== undefined ? updateData.width : currentProps.width,
      height:
        updateData.height !== undefined
          ? updateData.height
          : currentProps.height,
      length:
        updateData.length !== undefined
          ? updateData.length
          : currentProps.length,
      isActive: updateData.isActive ?? currentProps.isActive,
    });

    await this.productRepository.update(updatedProduct);

    return { id: productId };
  }
}
