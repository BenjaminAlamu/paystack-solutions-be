import { SuccessResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import LoginService from "../services/login.service";
import httpStatus from "http-status";


@injectable()
class LoginController  {
  constructor(
    private readonly loginService: LoginService
  ) {

  }

  create = async (req: Request, res: Response) => {
    const merchant =
      await this.loginService.login(req.body);
    res
      .status(httpStatus.CREATED)
      .json(
        SuccessResponse(
          "Login successful",
          merchant
        )
      );
  };

//   getSingle = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const relationshipManager =
//       await this.relationshipManagerService.findRelationshipManagerById(id);

//     this.trackAction(
//       AuditTrailModuleType.RELATIONSHIP_MANAGER,
//       req.user,
//       `View Relationship Manager`,
//       {
//         response: relationshipManager,
//       },
//       req
//     );

//     return res
//       .status(httpStatus.OK)
//       .json(
//         SuccessResponse(
//           "Relationship Manager fetched successfully.",
//           relationshipManager
//         )
//       );
//   };

//   get = async (req: Request, res: Response) => {
//     const query = req.query as unknown as PaginationQuery;
//     let relationshipManagers = await this.relationshipManagerService.getAll(
//       query
//     );
//     return res
//       .status(httpStatus.OK)
//       .json(
//         SuccessResponse(
//           "Relationship Managers fetched successfully.",
//           relationshipManagers
//         )
//       );
//   };
}

export default LoginController;
