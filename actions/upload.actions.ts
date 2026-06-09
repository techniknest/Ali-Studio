"use server";

import { requireAuth } from "@/lib/auth-helpers";
import { getCloudinaryClient } from "@/lib/cloudinary";

export async function uploadToCloudinary(formData: FormData, folder: string): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    await requireAuth();

    const file = formData.get("file") as File;
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    const cloudinary = await getCloudinaryClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: `ali_studio/${folder}` },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const url = (result as any).secure_url as string;
    
    return { success: true, url };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: error.message || "Failed to upload image" };
  }
}
