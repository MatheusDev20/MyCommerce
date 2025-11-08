import { z } from 'zod';

export const addressSchema = z.object({
  street: z.string().min(1).max(100),
  city: z.string().min(1).max(50),
  state: z.string().max(2),
  type: z.enum(['BILLING', 'SHIPPING']),
  zipCode: z.string().min(1).max(20),
  country: z.string().min(1).max(50),
});

export type AddressDTO = z.infer<typeof addressSchema>;
