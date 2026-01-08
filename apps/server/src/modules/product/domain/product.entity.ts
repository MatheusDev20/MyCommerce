import { Entity } from 'src/libs/entity.base';
import { CreateProductProps } from '../types';
import { randomUUID } from 'crypto';
import { Sku } from './vo/sku';

type ProductProps = {
  name: string;
  description: string;
  price: number;
  sku: Sku;
  stockQuantity: number;
  category: string;
  brand: string | null;
  weight: number | null;
  width: number | null;
  height: number | null;
  length: number | null;
  isActive: boolean;
};

type RehydrateProductProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string | null;
  price: number;
  sku: string;
  stockQuantity: number;
  category: string | null;
  brand: string | null;
  weight: number | null;
  width: number | null;
  height: number | null;
  length: number | null;
  isActive: boolean;
};

export class Product extends Entity<ProductProps> {
  static create(create: CreateProductProps): Product {
    return new Product({
      id: randomUUID(),
      props: {
        name: create.name,
        description: create.description,
        price: create.price,
        sku: create.sku,
        stockQuantity: create.stockQuantity ?? 0,
        category: create.category,
        brand: create.brand ?? null,
        weight: create.weight ?? null,
        width: create.width ?? null,
        height: create.height ?? null,
        length: create.length ?? null,
        isActive: create.isActive ?? true,
      },
    });
  }

  static rehydrate(raw: RehydrateProductProps): Product {
    return new Product({
      id: raw.id,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      props: {
        name: raw.name,
        description: raw.description ?? '',
        price: Number(raw.price),
        sku: Sku.create(raw.sku),
        stockQuantity: raw.stockQuantity,
        category: raw.category ?? '',
        brand: raw.brand,
        weight: raw.weight,
        width: raw.width,
        height: raw.height,
        length: raw.length,
        isActive: raw.isActive,
      },
    });
  }

  validate(): void {
    // Invariant: Price must be positive
    if (this.props.price <= 0) {
      throw new Error('Product price must be greater than 0');
    }

    // Invariant: Name cannot be empty
    if (!this.props.name || this.props.name.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }

    // Invariant: SKU must be valid (enforced by Sku value object)

    // Invariant: Stock quantity cannot be negative
    if (this.props.stockQuantity < 0) {
      throw new Error('Product stock quantity cannot be negative');
    }

    // Invariant: Dimensions (if provided) must be positive
    if (this.props.weight !== null && this.props.weight <= 0) {
      throw new Error('Product weight must be greater than 0');
    }
    if (this.props.width !== null && this.props.width <= 0) {
      throw new Error('Product width must be greater than 0');
    }
    if (this.props.height !== null && this.props.height <= 0) {
      throw new Error('Product height must be greater than 0');
    }
    if (this.props.length !== null && this.props.length <= 0) {
      throw new Error('Product length must be greater than 0');
    }

    // Add more invariants as needed
  }
}
