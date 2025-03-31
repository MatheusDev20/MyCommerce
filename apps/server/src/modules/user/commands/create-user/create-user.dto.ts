import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAddressDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  readonly street: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  readonly city: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  readonly state: string;

  @IsNotEmpty()
  // @Matches(/^\d{5}(-\d{4})?$/)
  readonly zipCode: string;
}

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
  @ValidateNested()
  @Type(() => CreateAddressDTO)
  readonly shippingAddress: CreateAddressDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDTO)
  readonly billingAddress: CreateAddressDTO;

  @IsNotEmpty()
  @IsBoolean()
  readonly isShippingAddressSameAsBilling: boolean;
}
