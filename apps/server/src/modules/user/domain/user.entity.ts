import { v4 } from 'uuid';
import { CreateUserProps } from './user.type';

export class UserEntity {
  static create(create: CreateUserProps) {
    const id = v4();
  }
}
