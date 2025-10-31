import { injectable } from "tsyringe";
import { UploadFileDto } from "../dtos/upload.dto";
// import { uploadMultipart } from "@utils/file-upload-to-bucket";
// import { v4 as uuidv4 } from "uuid";

import { validateDocumentFileType } from "@utils/document-upload-validation";
import UnprocessableError from "@shared/error/unprocessible.error";
import appConfig from "@config/app.config";
import { uploadBufferToCloudinary } from "@shared/utils/cloudinary";

@injectable()
class UploadService {
  constructor() {}

  async uploadDocument(body: UploadFileDto) {
    const { mimeType, fileName, bucketName } = body;
    validateDocumentFileType(mimeType, fileName);

    body.bucketName = bucketName || appConfig.cloudinary.cloudName;
    const imageUrl = await this.uploadFile(body);

    return { imageUrl };
  }

  async uploadFile(data: UploadFileDto) {
    const { mimeType, fileName, fileBuffer, bucketName } = data;

    if (!fileName || !mimeType) {
      throw new UnprocessableError("Invalid file passed");
    }

    return await  uploadBufferToCloudinary(fileBuffer, bucketName)

    // const objectKey = `${uuidv4()}.${fileName.split(".").pop()}`;
    // return await uploadMultipart(bucketName, objectKey, fileBuffer, mimeType);
  }
}

export default UploadService;
