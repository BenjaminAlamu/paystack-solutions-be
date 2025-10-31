import { injectable } from "tsyringe";
import UserRepo from "../repositories/user.repo";
import MerchantRepo from "../repositories/merchant.repo";
import { LoginDto, UserDto } from "../dtos/user.dto";
import NotFoundError from "@shared/error/not-found.error";
import { bcryptCompareHashedString } from "@shared/utils/hash.util";
import InvalidRequestError from "@shared/error/invalid-request.error";
import { v4 as uuidv4 } from "uuid";
import appConfig from "@config/app.config";
import jwt from "jsonwebtoken";
import { UserType } from "../enums/user-type.enum";
import { MerchantDto } from "../dtos/merchant.dto";

@injectable()
class LoginService {
  constructor(private readonly userRepo: UserRepo,
    private readonly merchantRepo: MerchantRepo) {}
  async login({ email, password }: LoginDto) {
    const user = await this.userRepo.findByEmail(email);
    let merchant;
    if (!user) throw new NotFoundError("User not found");

    if ((await bcryptCompareHashedString(password, user.password)) === false) {
      throw new InvalidRequestError("Your credential is invalid");
    }

    if(user.userType === UserType.MERCHANT){
       merchant = await this.merchantRepo.findByUserId(user.id);
    }
    const accessToken = await this.generateAccessToken(this.extractUserDetailsForTokenGeneration(user), merchant)
    return {user, accessToken};
  }

   extractUserDetailsForTokenGeneration(user: any) {
    return {
      id: user.id,
      email: user.email,
      name: user.firstName,
      userType: user.userType
    };
  }

  async generateAccessToken(user: Partial<UserDto>, merchant?: Partial<MerchantDto>){
    const jwtid = uuidv4();
    const expiresIn = appConfig.jwt.webExpiry;

    const accessToken = jwt.sign({ user, merchant }, appConfig.jwt.secret, {
      algorithm: "HS256",
      expiresIn,
      notBefore: "0ms",
      jwtid,
    });


    return accessToken
  }
}
export default LoginService;
