import { z } from 'zod';

export const editProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  // SKU is auto-generated and cannot be changed
  stockQuantity: z.number().int().min(0).optional(),
  category: z.string().max(100).optional(),
  brand: z.string().max(100).optional(),
  weight: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  length: z.number().positive().optional(),
  isActive: z.boolean().optional(),
});

export type EditProductDTO = z.infer<typeof editProductSchema>;
