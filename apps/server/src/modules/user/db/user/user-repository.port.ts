export interface UserRepositoryPort {
  persist(user: any): Promise<void>;
}
