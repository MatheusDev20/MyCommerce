import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { Address } from '../../domain/address.entity';

@CommandHandler(CreateUserCommand)
export class CreateUserService implements ICommandHandler<CreateUserCommand> {
  constructor() {}
  async execute(command: CreateUserCommand): Promise<void> {
    const { billingAddress, shippingAddress, isShippingAddressSameAsBilling } =
      command;

    const shipping = Address.create({
      city: shippingAddress.city,
      country: 'USA',
      state: shippingAddress.state,
      street: shippingAddress.street,
      zipCode: shippingAddress.zipCode,
    });

    if (!isShippingAddressSameAsBilling && billingAddress) {
      const billing = Address.create({
        city: billingAddress.city,
        country: 'USA',
        state: billingAddress.state,
        street: billingAddress.street,
        zipCode: billingAddress.zipCode,
      });
    }
    // persistance
    console.log('Address', shipping);
    console.log('Command Executed', command);

    // Create the entity
  }
}
