import { Response, NextFunction } from "express";

export const fileToReqBodyMiddleware = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file attached" });
  }

  req.body.fileBuffer = req.file.buffer;
  req.body.fileName = req.file.originalname;
  req.body.mimeType = req.file.mimetype;
  next();
};


