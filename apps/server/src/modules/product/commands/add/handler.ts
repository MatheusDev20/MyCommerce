import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddProductCommand } from './command';
import { Inject, Logger } from '@nestjs/common';
import { Product } from '../../domain/product.entity';
import { ProductRepository } from 'src/libs/ports/repository.port';

@CommandHandler(AddProductCommand)
export class AddProductHandler implements ICommandHandler<AddProductCommand> {
  private readonly logger = new Logger(AddProductHandler.name);

  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: AddProductCommand): Promise<{ id: string }> {
    const { metadata, ...productData } = command;

    this.logger.log('Add Product Command received:');
    this.logger.log(JSON.stringify(productData, null, 2));

    // Create product domain entity (enforces invariants)
    const product = Product.create(productData);

    this.logger.log('Product entity created successfully');
    this.logger.log(`Product ID: ${product._id}`);

    // Persist to database
    const savedProduct = await this.productRepository.insert(product);

    this.logger.log('Product persisted to database successfully');
    this.logger.log(`Saved Product ID: ${savedProduct._id}`);

    return { id: savedProduct._id };
  }
}
