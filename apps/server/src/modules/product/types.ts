export type CreateProductProps = {
  name: string;
  description: string;
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
  images: any[];
};
