import { injectable } from "tsyringe";
import { IMerchant, Merchant } from "../models/merchant.model";
import { BaseRepository } from "@shared/repositories/base.repo";

@injectable()
class MerchantRepo extends BaseRepository<IMerchant, Merchant> {
  constructor() {
    super(Merchant);
  }

  async findByUserId(userId: string) {
    const merchantQuery = Merchant.query();
    return await merchantQuery.findOne({ userId });
  }
}

export default MerchantRepo;
