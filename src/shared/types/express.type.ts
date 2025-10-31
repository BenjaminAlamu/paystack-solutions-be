import { MerchantDto } from "src/v1/modules/auth/dtos/merchant.dto";
import { UserDto } from "src/v1/modules/auth/dtos/user.dto";


declare global {
  namespace Express {
    interface Request {
      user?: UserDto;
      merchant?: MerchantDto;    }
  }
}
