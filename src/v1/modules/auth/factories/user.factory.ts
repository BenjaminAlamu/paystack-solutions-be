
import { UserDto } from "../dtos/user.dto";
import { UserType } from "../enums/user-type.enum";
import { IUser } from "../models/user.model";
import { bcryptHashString } from "@shared/utils/hash.util";

class UserFactory {
  static async createUser(data: UserDto) {
    const user = {} as IUser;
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.email = data.email;
    user.password =  await bcryptHashString(data.password);
    user.userType = data.userType as UserType;
    return user;
  }

  static setPaystackCustomerId(customerId: string) {
    const user = {} as IUser;
    user.paystackCustomerId = customerId;
    return user;
  }
}

export default UserFactory;
