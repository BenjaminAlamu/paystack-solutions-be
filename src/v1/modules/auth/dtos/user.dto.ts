
export type UserDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: string;
};

export type LoginDto = {
    email: string;
    password: string;
  };

export type UpdateUserDto = Partial<UserDto>;

export type PaystackCustomerDto = {
    firstName: string;
    lastName: string;
    email: string;
  };

  export type PaystackCustomerResponseDto = {
    email:  string;
    integration:  number;
    customer_code:  string;
  };

