import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { Address } from '../../domain/address.entity';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler<CreateUserCommand> {
  constructor() {}
  async execute(command: CreateUserCommand): Promise<void> {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      billingAddress,
      shippingAddress,
    } = command;

    const address = Address.create({
      city: shippingAddress.city,
      country: 'USA',
      state: shippingAddress.state,
      street: shippingAddress.street,
      zipCode: shippingAddress.zipCode,
    });
    console.log('Address', address);
    console.log('Command Executed', command);

    // Create the entity
  }
}
