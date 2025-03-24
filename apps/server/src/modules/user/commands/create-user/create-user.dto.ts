import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;

  @IsNotEmpty()
  @MaxLength(36)
  @MinLength(2)
  readonly firstName: string;

  @IsNotEmpty()
  @MaxLength(36)
  @MinLength(2)
  readonly lastName: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\(\w{2}\)\d{8}$/)
  readonly phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  readonly shippingAddress: string;

  @IsNotEmpty()
  @IsBoolean()
  readonly isShippingAddressSameAsBilling: boolean;
}
