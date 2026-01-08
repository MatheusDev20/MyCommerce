export interface ProductDTO {
  id: string;
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
  createdAt: Date;
  updatedAt: Date;
}
