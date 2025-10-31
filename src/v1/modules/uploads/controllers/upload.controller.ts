import { SuccessResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import { injectable } from "tsyringe";
import httpStatus from "http-status";
import FileUploadService  from "../services/upload.service";

@injectable()
class UploadController {
  constructor(private readonly uploadService: FileUploadService) {}

  uploadDocument = async (req: Request, res: Response) => {
    const data = await this.uploadService.uploadDocument(req.body);
    res
      .status(httpStatus.CREATED)
      .send(SuccessResponse("Operation successful", data));
  };
}

export default UploadController;
