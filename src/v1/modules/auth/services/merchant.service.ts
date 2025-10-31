import { injectable } from "tsyringe";
import MerchantRepo from "../repositories/merchant.repo";
import UserRepo from "../repositories/user.repo";
import UserFactory from "../factories/user.factory";
import MerchantFactory from "../factories/merchant.factory";
import ServiceUnavailableError from "@shared/error/service-unavailable.error";
import logger from "@shared/utils/logger";
import NotFoundError from "@shared/error/not-found.error";
import { PaystackHttpClient } from "@shared/http-client/paystack.http-client";
import { UserMerchantDto } from "../dtos/merchant.dto";
import {
  PAYSTACK_CHARGE,
  PAYSTACK_CURRENCY,
  PAYSTACK_SPLIT_BEARER_TYPE,
  PAYSTACK_SPLIT_CHARGE_TYPE,
} from "@shared/enums/paystack.enum";
import { UserType } from "../enums/user-type.enum";
import InvalidRequestError from "@shared/error/invalid-request.error";
@injectable()
class RelationshipManagerService {
  constructor(
    private readonly merchantRepo: MerchantRepo,
    private readonly userRepo: UserRepo,
    private readonly paystackClient: PaystackHttpClient
  ) {}
  async createMerchant(data: UserMerchantDto) {
    const alreadyExists = await this.userRepo.findByEmail(data.email);
    if (alreadyExists) throw new InvalidRequestError("Email already exists");
    const user = await UserFactory.createUser({
      ...data,
      userType: UserType.MERCHANT,
    });
    const createdUser = await this.userRepo.save(user);

    const paystackSubAccount = await this.paystackClient.createSubaccount({
      settlement_bank: data.bankCode,
      business_name: data.businessName,
      account_number: data.bankAccountNumber,
      percentage_charge: PAYSTACK_CHARGE.PERCENTAGE_CHARGE,
      currency: PAYSTACK_CURRENCY.NAIRA,
    });

    const transactionSplit = await this.paystackClient.createTransactionSplit({
      name: `${data.businessName}-Transaction Split`,
      type: PAYSTACK_SPLIT_CHARGE_TYPE.PERCENTAGE,
      currency: PAYSTACK_CURRENCY.NAIRA,
      bearer_subaccount: paystackSubAccount.subaccount_code,
      bearer_type: PAYSTACK_SPLIT_BEARER_TYPE.SUBACCOUNT,
      subaccounts: [
        {
          subaccount: paystackSubAccount.subaccount_code,
          share: PAYSTACK_CHARGE.SUBACCOUNT_SHARE,
        },
      ],
    });

    const merchant = await MerchantFactory.createMerchant(
      data,
      createdUser.id,
      {
        paystackSubaccountCode: paystackSubAccount.subaccount_code,
        paystackSplitCode: transactionSplit.split_code,
      }
    );
    const createdMerchant = await this.merchantRepo.save(merchant);
    return createdMerchant;
  }

  async findMerchantById(id: string) {
    const merchant = await this.merchantRepo.findById(id, ["user"]);
    if (!merchant) {
      throw new NotFoundError("Merchant not found");
    }
    return merchant;
  }

  async getAll(query: PaginationQuery) {
    const { search, page = 1, perPage = 10 } = query;
    const queryData: PaginationQuery = {
      page: page as number,
      perPage: perPage as number,
    };
    if (search) {
      queryData.search = { name: search };
    }
    return await this.merchantRepo
      .getAll(queryData, ["user"])
      .catch((error) => {
        logger.error({ error }, "Merchant[getAll]: Error occured");
        throw new ServiceUnavailableError("An error occurred.");
      });
  }
}
export default RelationshipManagerService;
