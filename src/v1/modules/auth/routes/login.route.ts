import { container } from "tsyringe";
import LoginController from "../controllers/login.controller";
// import { createMerchant } from "../validators/merchant.validator";
import validate from "@shared/middlewares/validator.middleware";
// import authMiddleware from "@shared/middlewares/auth.middleware";
import express, { Request, Response } from "express";
import { login } from "../validators/login.validator";

const loginController = container.resolve(LoginController);

const loginRoutes = express.Router();

loginRoutes.post("/", validate(login), (req: Request, res: Response, next) =>
loginController.create(req, res).catch((e) => next(e))
);



// loginRoutes.delete("/auth/logout", authMiddleware, (req: Request, res: Response, next) =>
//   logoutController.logout(req, res).catch((e) => next(e))
// );12



export default loginRoutes;
