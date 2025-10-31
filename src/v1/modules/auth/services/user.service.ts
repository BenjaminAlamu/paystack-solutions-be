import { injectable } from "tsyringe";
import UserRepo from "../repositories/user.repo";
import UserFactory from "../factories/user.factory";
import { PaystackHttpClient } from "@shared/http-client/paystack.http-client";
import { UserDto } from "../dtos/user.dto";
import InvalidRequestError from "@shared/error/invalid-request.error";
import LoginService from "../services/login.service";
import { UserType } from "../enums/user-type.enum";
@injectable()
class UserService {
  constructor(
    private readonly userRepo: UserRepo,
    private readonly loginService: LoginService,
    private readonly paystackClient: PaystackHttpClient
  ) {}
  async createUser(data: UserDto) {
  
      const alreadyExists = await this.userRepo.findByEmail(data.email);
      if (alreadyExists) throw new InvalidRequestError("Email already exists");
      const user = await UserFactory.createUser({...data, userType: UserType.USER});
      const createdUser = await this.userRepo.save(user);
      const paystackCustomerDetails = await this.paystackClient.createCustomer(
        data
      );
      const updatedUser = UserFactory.setPaystackCustomerId(
        paystackCustomerDetails.customer_code
      );
      const newUser = await this.userRepo.updateById(createdUser.id, updatedUser);
      const userDetails  = this.loginService.extractUserDetailsForTokenGeneration(newUser)
      const accessToken = await this.loginService.generateAccessToken((userDetails))
      return {user: newUser, accessToken};

  }
}
export default UserService;
