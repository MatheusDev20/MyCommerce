import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from './command';
import { Inject, NotFoundException } from '@nestjs/common';
import { ProductRepository } from 'src/libs/ports/repository.port';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler
  implements ICommandHandler<DeleteProductCommand>
{
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: DeleteProductCommand): Promise<{ id: string }> {
    const { productId } = command;

    const existingProduct = await this.productRepository.findUnique({
      id: productId,
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    await this.productRepository.delete(productId);

    return { id: productId };
  }
}
