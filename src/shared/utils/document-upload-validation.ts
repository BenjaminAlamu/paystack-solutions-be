import UnprocessableError from "../error/unprocessible.error";

export function validateDocumentFileType(
  mimeType: string,
  fileName: string
) {
  const fileTypes =
    /png|jpg|jpeg/;
  const validMimetype = fileTypes.test(mimeType);
  const validExtname = fileTypes.test(
    fileName.toLowerCase().split(".").pop() || ""
  );

  if (!validMimetype || !validExtname) {
    throw new UnprocessableError(
      `Unsupported file type. Only documents with the following formats are allowed: ${fileTypes}`
    );
  }
}
