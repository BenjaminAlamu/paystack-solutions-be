import { injectable } from "tsyringe";
import { IUser, User } from "../models/user.model";
import { BaseRepository } from "@shared/repositories/base.repo";

@injectable()
class UserRepo extends BaseRepository<IUser, User> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string, relations: string[] = []) {
    const userQuery = User.query();

    for (const relation of relations) {
      userQuery.withGraphFetched(relation);
    }

    return await userQuery.findOne({ email: email.toLowerCase() });
  }
}

export default UserRepo;
