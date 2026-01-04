export type AddressDTO = {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  type: 'BILLING' | 'SHIPPING';
  createdAt: Date;
  updatedAt: Date;
};

export type UserProfileDTO = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'ADMIN';
  avatar: string | null;
  addresses: AddressDTO[];
  createdAt: Date;
  updatedAt: Date;
};
