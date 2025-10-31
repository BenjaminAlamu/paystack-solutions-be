import express, { Request, Response } from "express";
import { container } from "tsyringe";
import ProductController from "../controllers/product.controller";
import authMiddleware from "@shared/middlewares/auth.middleware";
import validate from "@shared/middlewares/validator.middleware";
import { createProduct } from "../validations/product.validator";


const productController = container.resolve(ProductController);
const router = express.Router();


router.get(
  "/featured",
  (req: Request, res: Response, next) =>
  productController.getFeaturedProducts(req, res).catch((e) => next(e))
);

router.post(
  "/",
  authMiddleware,
  validate(createProduct),
  (req: Request, res: Response, next) =>
  productController.createProduct(req, res).catch((e) => next(e))
);

router.get(
  "/",
  (req: Request, res: Response, next) =>
  productController.getAll(req, res).catch((e) => next(e))
);

export default router;
