import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { QueryUserProfileCommand } from './command';
import { Inject, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/libs/ports/repository.port';
import { UserProfileDTO } from '../../schemas/user-profile';

@QueryHandler(QueryUserProfileCommand)
export class QueryUserProfileHandler
  implements IQueryHandler<QueryUserProfileCommand>
{
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async execute(query: QueryUserProfileCommand): Promise<UserProfileDTO> {
    const user = await this.userRepository.findUnique({ id: query.userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const props = user.getProps();

    return {
      id: props.id,
      email: props.email,
      firstName: props.firstName,
      lastName: props.lastName,
      role: props.role,
      avatar: null, // props.avatar when implemented
      addresses: props.addresses.map((addr) => {
        const addressProps = addr.getProps();
        return {
          id: addressProps.id,
          street: addressProps.street,
          city: addressProps.city,
          state: addressProps.state,
          country: addressProps.country,
          zipCode: addressProps.zipCode,
          type: addressProps.type,
          createdAt: addressProps.createdAt,
          updatedAt: addressProps.updatedAt,
        };
      }),
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    };
  }
}
