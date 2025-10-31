export interface UploadFileDto {
    documentType: string;
    bucketName: string;
    file: any;
    fileName: string;
    mimeType: string;
    fileBuffer: any;
  }