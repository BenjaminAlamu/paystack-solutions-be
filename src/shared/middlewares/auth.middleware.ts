import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
// import UnauthorizedError from "@shared/error/unauthorized.error";

const authMiddleware = (req: Request, res: Response, done) => {
  try {
    const authToken = getAuthTokenFromRequestHeader(req);
    if (!authToken) {
      throw new Error();
    }

    const payload = jwt.decode(authToken);

    req.user = payload.user;
    req.merchant = payload.merchant;

    done();
  } catch (err) {
    return res.status(httpStatus.UNAUTHORIZED).send(ErrorResponse("You are unauthorized"));
  }
};

// const merchantAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//   const authToken = getAuthTokenFromRequestHeader(req);

//   try {
//     if (!authToken) {
//       return next(new UnauthorizedError("You are unauthorized. Missing authentication token."));
//     }

//     const decodedToken = jwt.decode(authToken);

//     if (!decodedToken || typeof decodedToken !== "object") {
//       return next(new UnauthorizedError("You are unauthorized. Invalid token."));
//     }

//     const userEmail = decodedToken.user.email;

//     if (!userEmail) {
//       return next(new UnauthorizedError("You are unauthorized. Invalid user email in token."));
//     }

//     const user = await userRepo.findByEmail(userEmail, ["accessGroup"]);

//     if (!user) {
//       return res.status(httpStatus.FORBIDDEN).send(ErrorResponse("You are unauthorized to access this resource."));
//     }

//     decodedToken.user.accessGroup = user.accessGroup?.slug;
//     req.user = decodedToken.user;
//     req.bearerToken = authToken;

//     const { accessGroup, ...otherUserProps } = user;
//     req.currentUser = otherUserProps as User;

//     next();
//   } catch (err: any) {
//     logger.error({ error: err }, "UserAuthMiddleware:  Error occurred.");

//     if (err instanceof UnauthorizedError || err instanceof AppError) {
//       return next(err);
//     }

//     return next(new UnauthorizedError("You are unauthorized. Token expired or invalid."));
//   }
// };

const getAuthTokenFromRequestHeader = (req: Request): string | null => {
  const authTokenSegments = (req.headers.authorization || "").split(" ");

  return authTokenSegments.length === 2 ? authTokenSegments[1] : null;
};

export default authMiddleware;
