import { container } from "tsyringe";
import UserController from "../controllers/user.controller";
import validate from "@shared/middlewares/validator.middleware";
// import authMiddleware from "@shared/middlewares/auth.middleware";
import express, { Request, Response } from "express";
import { createUser } from "../validators/user.validator";

const userController = container.resolve(UserController);

const userRoutes = express.Router();

userRoutes.post("/", validate(createUser), (req: Request, res: Response, next) =>
userController.create(req, res).catch((e) => next(e))
);



// authRoutes.delete("/auth/logout", authMiddleware, (req: Request, res: Response, next) =>
//   logoutController.logout(req, res).catch((e) => next(e))
// );



export default userRoutes;
