import express, { Request, Response } from "express";
import { container } from "tsyringe";
import OrderController from "../controllers/order.controller";
import authMiddleware from "@shared/middlewares/auth.middleware";
// import validate from "@shared/middlewares/validator.middleware";
// import { createProduct } from "../validations/product.validator";


const orderController = container.resolve(OrderController);
const router = express.Router();


router.post(
  "/paystack/callback",
  (req: Request, res: Response, next) =>
  orderController.paystackCallback(req, res).catch((e) => next(e))
);

router.post(
  "/dva",
  (req: Request, res: Response, next) =>
  orderController.attachDynamicVirtualAccount(req, res).catch((e) => next(e))
);

router.post(
  "/mock/callback",
  (req: Request, res: Response, next) =>
  orderController.mockCallback(req, res).catch((e) => next(e))
);

router.get(
  "/:code",
  (req: Request, res: Response, next) =>
  orderController.getByCode(req, res).catch((e) => next(e))
);


router.post(
  "/",
  authMiddleware,
//   validate(createProduct),
  (req: Request, res: Response, next) =>
  orderController.createOrder(req, res).catch((e) => next(e))
);

router.get(
  "/",
  (req: Request, res: Response, next) =>
  orderController.getAll(req, res).catch((e) => next(e))
);

export default router;
