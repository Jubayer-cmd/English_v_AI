// import { S3Client } from "bun";

// // Cloudflare R2 Configuration
// const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
// const R2_SECRET_ACCESS_KEY = process.env.R2_SPACES_SECRET;
// const R2_BUCKET = process.env.R2_BUCKET || "English-ai";
// const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID; // You may need to add this

// // Validate required environment variables
// if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ACCOUNT_ID) {
//   throw new Error(
//     "Missing required R2 environment variables: R2_ACCESS_KEY_ID, R2_SPACES_SECRET, R2_ACCOUNT_ID",
//   );
// }

// // Initialize R2 S3 Client
// const r2Client = new S3Client({
//   accessKeyId: R2_ACCESS_KEY_ID,
//   secretAccessKey: R2_SECRET_ACCESS_KEY,
//   bucket: R2_BUCKET,
//   endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
// });

// // Types for storage operations
// export interface FileUploadOptions {
//   folder?: string;
//   metadata?: Record<string, any>;
//   userId?: string;
// }

// export interface FileUploadResult {
//   success: boolean;
//   key: string;
//   url: string;
//   size: number;
//   type: string;
//   name: string;
//   uploadedBy?: string;
//   uploadedAt: string;
//   error?: string;
// }

// export interface FileUpdateResult {
//   success: boolean;
//   key: string;
//   url: string;
//   size: number;
//   type: string;
//   name: string;
//   updatedBy?: string;
//   updatedAt: string;
//   error?: string;
// }

// export interface FileDeleteResult {
//   success: boolean;
//   key: string;
//   deletedBy?: string;
//   deletedAt: string;
//   error?: string;
// }

// // Generate unique file key
// const generateFileKey = (
//   originalName: string,
//   folder: string = "uploads",
// ): string => {
//   const timestamp = Date.now();
//   const randomId = Math.random().toString(36).substring(2, 15);
//   const extension = originalName.split(".").pop();
//   return `${folder}/${timestamp}-${randomId}.${extension}`;
// };

// /**
//  * Upload a file to Cloudflare R2
//  */
// export const uploadFile = async (
//   file: File,
//   options: FileUploadOptions = {},
// ): Promise<FileUploadResult> => {
//   try {
//     const { folder = "uploads", metadata, userId } = options;

//     if (!file) {
//       return {
//         success: false,
//         key: "",
//         url: "",
//         size: 0,
//         type: "",
//         name: "",
//         uploadedAt: new Date().toISOString(),
//         error: "No file provided",
//       };
//     }

//     // Validate file size (e.g., 10MB limit)
//     const maxSize = 10 * 1024 * 1024; // 10MB
//     if (file.size > maxSize) {
//       return {
//         success: false,
//         key: "",
//         url: "",
//         size: 0,
//         type: "",
//         name: "",
//         uploadedAt: new Date().toISOString(),
//         error: "File size exceeds 10MB limit",
//       };
//     }

//     // Generate unique key for the file
//     const fileKey = generateFileKey(file.name, folder);

//     // Convert file to buffer
//     const fileBuffer = await file.arrayBuffer();
//     const fileUint8Array = new Uint8Array(fileBuffer);

//     // Upload to R2
//     await r2Client.write(fileKey, fileUint8Array, {
//       type: file.type,
//     });

//     // Generate public URL (if bucket is public)
//     const publicUrl = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${fileKey}`;

//     return {
//       success: true,
//       key: fileKey,
//       url: publicUrl,
//       size: file.size,
//       type: file.type,
//       name: file.name,
//       uploadedBy: userId,
//       uploadedAt: new Date().toISOString(),
//     };
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     return {
//       success: false,
//       key: "",
//       url: "",
//       size: 0,
//       type: "",
//       name: "",
//       uploadedAt: new Date().toISOString(),
//       error: `Failed to upload file: ${
//         error instanceof Error ? error.message : "Unknown error"
//       }`,
//     };
//   }
// };

// /**
//  * Update/Replace a file in Cloudflare R2
//  */
// export const updateFile = async (
//   fileKey: string,
//   file: File,
//   userId?: string,
// ): Promise<FileUpdateResult> => {
//   try {
//     if (!file) {
//       return {
//         success: false,
//         key: "",
//         url: "",
//         size: 0,
//         type: "",
//         name: "",
//         updatedAt: new Date().toISOString(),
//         error: "No file provided",
//       };
//     }

//     if (!fileKey) {
//       return {
//         success: false,
//         key: "",
//         url: "",
//         size: 0,
//         type: "",
//         name: "",
//         updatedAt: new Date().toISOString(),
//         error: "File key is required",
//       };
//     }

//     // Validate file size (e.g., 10MB limit)
//     const maxSize = 10 * 1024 * 1024; // 10MB
//     if (file.size > maxSize) {
//       return {
//         success: false,
//         key: "",
//         url: "",
//         size: 0,
//         type: "",
//         name: "",
//         updatedAt: new Date().toISOString(),
//         error: "File size exceeds 10MB limit",
//       };
//     }

//     // Check if file exists first
//     try {
//       await r2Client.exists(fileKey);
//     } catch (error) {
//       return {
//         success: false,
//         key: "",
//         url: "",
//         size: 0,
//         type: "",
//         name: "",
//         updatedAt: new Date().toISOString(),
//         error: "File not found",
//       };
//     }

//     // Convert file to buffer
//     const fileBuffer = await file.arrayBuffer();
//     const fileUint8Array = new Uint8Array(fileBuffer);

//     // Update file in R2
//     await r2Client.write(fileKey, fileUint8Array, {
//       type: file.type,
//     });

//     // Generate public URL
//     const publicUrl = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${fileKey}`;

//     return {
//       success: true,
//       key: fileKey,
//       url: publicUrl,
//       size: file.size,
//       type: file.type,
//       name: file.name,
//       updatedBy: userId,
//       updatedAt: new Date().toISOString(),
//     };
//   } catch (error) {
//     console.error("Error updating file:", error);
//     return {
//       success: false,
//       key: "",
//       url: "",
//       size: 0,
//       type: "",
//       name: "",
//       updatedAt: new Date().toISOString(),
//       error: `Failed to update file: ${
//         error instanceof Error ? error.message : "Unknown error"
//       }`,
//     };
//   }
// };

// /**
//  * Delete a file from Cloudflare R2
//  */
// export const deleteFile = async (
//   fileKey: string,
//   userId?: string,
// ): Promise<FileDeleteResult> => {
//   try {
//     if (!fileKey) {
//       return {
//         success: false,
//         key: "",
//         deletedAt: new Date().toISOString(),
//         error: "File key is required",
//       };
//     }

//     // Check if file exists
//     try {
//       await r2Client.exists(fileKey);
//     } catch (error) {
//       return {
//         success: false,
//         key: "",
//         deletedAt: new Date().toISOString(),
//         error: "File not found",
//       };
//     }

//     // Delete file from R2
//     await r2Client.delete(fileKey);

//     return {
//       success: true,
//       key: fileKey,
//       deletedBy: userId,
//       deletedAt: new Date().toISOString(),
//     };
//   } catch (error) {
//     console.error("Error deleting file:", error);
//     return {
//       success: false,
//       key: "",
//       deletedAt: new Date().toISOString(),
//       error: `Failed to delete file: ${
//         error instanceof Error ? error.message : "Unknown error"
//       }`,
//     };
//   }
// };

// /**
//  * Get file info from Cloudflare R2
//  */
// export const getFileInfo = async (fileKey: string) => {
//   try {
//     if (!fileKey) {
//       return { success: false, error: "File key is required" };
//     }

//     // Get file info from R2
//     const fileInfo = await r2Client.stat(fileKey);

//     if (!fileInfo) {
//       return { success: false, error: "File not found" };
//     }

//     // Generate public URL
//     const publicUrl = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${fileKey}`;

//     return {
//       success: true,
//       data: {
//         key: fileKey,
//         url: publicUrl,
//         size: fileInfo.size,
//         type: fileInfo.type,
//         lastModified: fileInfo.lastModified,
//       },
//     };
//   } catch (error) {
//     console.error("Error getting file info:", error);
//     return {
//       success: false,
//       error: `Failed to get file info: ${
//         error instanceof Error ? error.message : "Unknown error"
//       }`,
//     };
//   }
// };

// /**
//  * List files in a folder from Cloudflare R2
//  * Note: This is a simplified version due to Bun S3Client API limitations
//  */
// export const listFiles = async (
//   folder: string = "uploads",
//   limit: number = 100,
// ) => {
//   try {
//     // List files from R2 with prefix
//     const files = await r2Client.list({
//       prefix: folder + "/",
//     });

//     // For now, return a simplified response
//     // In a production environment, you might want to implement a more robust file listing
//     return {
//       success: true,
//       data: {
//         message:
//           "File listing available via R2 dashboard or alternative implementation",
//         folder: folder,
//         limit: limit,
//         note: "Use getFileInfo() for individual file information",
//       },
//     };
//   } catch (error) {
//     console.error("Error listing files:", error);
//     return {
//       success: false,
//       error: `Failed to list files: ${
//         error instanceof Error ? error.message : "Unknown error"
//       }`,
//     };
//   }
// };

// /**
//  * Generate a signed URL for downloading a file from Cloudflare R2
//  */
// export const getDownloadUrl = async (
//   fileKey: string,
//   expiresIn: number = 3600,
// ) => {
//   try {
//     if (!fileKey) {
//       return { success: false, error: "File key is required" };
//     }

//     // Check if file exists first
//     try {
//       await r2Client.exists(fileKey);
//     } catch (error) {
//       return { success: false, error: "File not found" };
//     }

//     // Generate public URL (if bucket is public)
//     const publicUrl = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET}/${fileKey}`;

//     return {
//       success: true,
//       data: {
//         url: publicUrl,
//         expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
//       },
//     };
//   } catch (error) {
//     console.error("Error generating download URL:", error);
//     return {
//       success: false,
//       error: `Failed to generate download URL: ${
//         error instanceof Error ? error.message : "Unknown error"
//       }`,
//     };
//   }
// };
