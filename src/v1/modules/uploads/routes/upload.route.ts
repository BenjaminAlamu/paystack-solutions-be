import express, { Request, Response } from "express";
import multer from "multer";
import { container } from "tsyringe";
import UploadController from "../controllers/upload.controller";

import { fileToReqBodyMiddleware } from "@shared/middlewares/file-upload-to-bucket";
const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadController = container.resolve(UploadController);
const router = express.Router();

router.post(
  "/",
  upload.single("file"),
  fileToReqBodyMiddleware,
  (req: Request, res: Response, next) =>
    uploadController.uploadDocument(req, res).catch((e) => next(e))
);

export default router;
