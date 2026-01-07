import { addressSchema } from 'src/modules/user/schemas/address';
import { z } from 'zod';

export const editUserSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  addresses: z.array(addressSchema).min(1).max(2).optional(),
});

export type EditUserDTO = z.infer<typeof editUserSchema>;
