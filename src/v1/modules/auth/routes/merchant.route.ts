import { container } from "tsyringe";
import MerchantController from "../controllers/merchant.controller";
import { createMerchant } from "../validators/merchant.validator";
import validate from "@shared/middlewares/validator.middleware";
// import authMiddleware from "@shared/middlewares/auth.middleware";
import express, { Request, Response } from "express";

const merchantController = container.resolve(MerchantController);

const authRoutes = express.Router();

authRoutes.post("/", validate(createMerchant), (req: Request, res: Response, next) =>
merchantController.create(req, res).catch((e) => next(e))
);



// authRoutes.delete("/auth/logout", authMiddleware, (req: Request, res: Response, next) =>
//   logoutController.logout(req, res).catch((e) => next(e))
// );



export default authRoutes;
