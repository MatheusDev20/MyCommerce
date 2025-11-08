import { User } from '../../domain/user.entity';

export interface UserRepositoryPort {
  persist(user: User): Promise<{ id: string }>;
}
