import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddProductCommand } from './command';
import { ConflictException, Inject, Logger } from '@nestjs/common';
import { Product } from '../../domain/product.entity';
import { ProductRepository } from 'src/libs/ports/repository.port';
import { SkuGeneratorService } from '../../services/sku-generator.service';
import { Sku } from '../../domain/vo/sku';

@CommandHandler(AddProductCommand)
export class AddProductHandler implements ICommandHandler<AddProductCommand> {
  private readonly logger = new Logger(AddProductHandler.name);

  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly skuGenerator: SkuGeneratorService,
  ) {}

  async execute(command: AddProductCommand): Promise<{ id: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { metadata, ...productData } = command;

    this.logger.log('Add Product Command received:');
    this.logger.log(JSON.stringify(productData, null, 2));

    // Auto-generate SKU from product name
    const maxAttempts = 10;
    let attempts = 0;
    let sku: Sku | null = null;

    while (attempts < maxAttempts) {
      sku = this.skuGenerator.generate(productData.name);
      const existingProduct = await this.productRepository.findBySku(
        sku.getValue(),
      );

      if (!existingProduct) {
        break; // SKU is unique
      }

      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new ConflictException(
        'Unable to generate unique SKU after multiple attempts.',
      );
    }

    this.logger.log(`Auto-generated SKU: ${sku!.getValue()}`);

    const product = Product.create({
      ...productData,
      sku: sku!,
    });

    this.logger.log('Product entity created successfully');
    this.logger.log(`Product SKU: ${product.getProps().sku.getValue()}`);

    // Persist to database
    const savedProduct = await this.productRepository.insert(product);

    this.logger.log('Product persisted to database successfully');
    this.logger.log(`Saved Product ID: ${savedProduct._id}`);

    return { id: savedProduct._id };
  }
}
