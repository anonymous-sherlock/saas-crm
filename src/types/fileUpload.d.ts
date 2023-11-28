// Interface for an error response
export interface FileUploadError {
  success: false;
  status: "validation error" | "multer error" | "unauthorized error" | "error";
  message: string;
}

export interface FileData {
  originalFileName: string;
  fileName: string;
  uplaodPath: null | string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  markedForDeletion: boolean;
  uploadFailed: boolean;
  createdAt: number;
  status: fileStatus;
}

export interface FilesUploadResponse {
  userMeta: object | null
  files: Partial<FileData>[];
}
type fileStatus = null | "error" | "processing" | "done";