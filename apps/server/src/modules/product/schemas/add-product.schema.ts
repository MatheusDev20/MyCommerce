import { z } from 'zod';

export const addProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string(),
  price: z.number().positive(),
  sku: z.string().min(1).max(100),
  stockQuantity: z.number().int().min(0),
  category: z.string().max(100),
  brand: z.string().max(100).optional(),
  weight: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  length: z.number().positive().optional(),
  isActive: z.boolean().optional(),
});

export type AddProductDTO = z.infer<typeof addProductSchema>;
