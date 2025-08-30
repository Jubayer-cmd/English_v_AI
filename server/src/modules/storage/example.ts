/**
 * Example usage of Cloudflare R2 storage functions
 * This file demonstrates how to use the storage service functions
 */

import {
  uploadFile,
  updateFile,
  deleteFile,
  getFileInfo,
  getDownloadUrl,
} from "./storage.service";

// Example: Upload a file from a form input
export const handleFileUpload = async (
  fileInput: HTMLInputElement,
  userId: string,
) => {
  const file = fileInput.files?.[0];
  if (!file) {
    console.error("No file selected");
    return;
  }

  const result = await uploadFile(file, {
    folder: "uploads",
    userId: userId,
  });

  if (result.success) {
    console.log("File uploaded successfully!");
    console.log("File URL:", result.url);
    console.log("File Key:", result.key);
    return result;
  } else {
    console.error("Upload failed:", result.error);
    return null;
  }
};

// Example: Update an existing file
export const handleFileUpdate = async (
  fileKey: string,
  newFile: File,
  userId: string,
) => {
  const result = await updateFile(fileKey, newFile, userId);

  if (result.success) {
    console.log("File updated successfully!");
    console.log("New file URL:", result.url);
    return result;
  } else {
    console.error("Update failed:", result.error);
    return null;
  }
};

// Example: Delete a file
export const handleFileDelete = async (fileKey: string, userId: string) => {
  const result = await deleteFile(fileKey, userId);

  if (result.success) {
    console.log("File deleted successfully!");
    return true;
  } else {
    console.error("Delete failed:", result.error);
    return false;
  }
};

// Example: Get file information
export const handleGetFileInfo = async (fileKey: string) => {
  const result = await getFileInfo(fileKey);

  if (result.success) {
    console.log("File info:", result.data);
    return result.data;
  } else {
    console.error("Failed to get file info:", result.error);
    return null;
  }
};

// Example: Get download URL for a file
export const handleGetDownloadUrl = async (
  fileKey: string,
  expiresInSeconds: number = 3600,
) => {
  const result = await getDownloadUrl(fileKey, expiresInSeconds);

  if (result.success) {
    console.log("Download URL:", result.data.url);
    console.log("Expires at:", result.data.expiresAt);
    return result.data;
  } else {
    console.error("Failed to generate download URL:", result.error);
    return null;
  }
};
