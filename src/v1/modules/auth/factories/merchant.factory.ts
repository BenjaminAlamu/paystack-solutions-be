
import { MerchantDto, MerchantPaystackDetailsDto } from "../dtos/merchant.dto";
import { IMerchant } from "../models/merchant.model";

class MerchantFactory {
  static async createMerchant(data: MerchantDto, userId: string, paystackDetails: MerchantPaystackDetailsDto) {
    const merchant = {} as IMerchant;
    merchant.businessName = data.businessName;
    merchant.bankCode = data.bankCode;
    merchant.userId = userId;
    merchant.bankAccountNumber = data.bankAccountNumber;
    merchant.paystackSubaccountCode = paystackDetails.paystackSubaccountCode;
    merchant.paystackSplitCode = paystackDetails.paystackSplitCode;
    return merchant;
  }

  static setPaystackDetails(data: MerchantPaystackDetailsDto) {
    const merchantDetails = {} as IMerchant;
    merchantDetails.paystackSubaccountCode = data.paystackSubaccountCode;
    merchantDetails.paystackSplitCode = data.paystackSplitCode;
    return merchantDetails;
  }
}

export default MerchantFactory;
