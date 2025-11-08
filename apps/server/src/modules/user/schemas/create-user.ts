import { addressSchema } from 'src/modules/user/schemas/address';
import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phoneNumber: z.string().min(10).max(15),
  addresses: z.array(addressSchema).min(1).max(2),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
