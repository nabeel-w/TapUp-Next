import { FaFile, FaFilePdf, FaFileImage, FaFileAudio, FaFileVideo, FaFileExcel, FaFileWord } from "react-icons/fa";
import { GiFiles } from "react-icons/gi";
import { IconType } from "react-icons";



type MimeType = 
  | "application/pdf"
  | "image/jpeg"
  | "image/png"
  | "audio/mpeg"
  | "audio/wav"
  | "video/mp4"
  | "video/x-msvideo"
  | "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  | "application/vnd.ms-excel"
  | "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  | "audio/ogg"
  | "application/zip"
  | "application/octet-stream"
  | "text/plain"
  | "application/vnd.ms-powerpoint"
  | "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  | "application/x-rar-compressed";

const mimeTypeToIcon: Record<MimeType, IconType> = {
  "application/pdf": FaFilePdf,
  "image/jpeg": FaFileImage,
  "image/png": FaFileImage,
  "audio/mpeg": FaFileAudio,
  "audio/wav": FaFileAudio,
  "video/mp4": FaFileVideo,
  "video/x-msvideo": FaFileVideo,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": FaFileWord,
  "application/vnd.ms-excel": FaFileExcel,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": GiFiles,
  "audio/ogg": FaFileAudio,
  "application/zip": FaFile,
  "application/octet-stream": FaFile,
  "text/plain": FaFile,
  "application/vnd.ms-powerpoint": FaFile,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": FaFile,
  "application/x-rar-compressed": FaFile,
};

// Utility function to return an icon based on file mime type
export const getFileIcon = (mimeType: string) => {
  const IconComponent = mimeTypeToIcon[mimeType as MimeType] || FaFile; // Cast mimeType to MimeType
  return <IconComponent className="me-2 text-xl text-gray-500" />;
};
