import { Sku } from './domain/vo/sku';

export type CreateProductProps = {
  name: string;
  description: string;
  price: number;
  sku: Sku;
  stockQuantity: number;
  category: string;
  brand?: string | undefined;
  weight?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
  length?: number | undefined;
  isActive?: boolean | undefined;
};
