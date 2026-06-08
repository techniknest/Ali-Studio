import { v2 as cloudinary } from "cloudinary";
import { getConfig } from "@/lib/config";

export async function getCloudinaryClient() {
  const cloud_name = await getConfig("CLOUDINARY_CLOUD_NAME");
  const api_key = await getConfig("CLOUDINARY_API_KEY");
  const api_secret = await getConfig("CLOUDINARY_API_SECRET");

  if (!cloud_name || !api_key || !api_secret) {
    throw new Error("Cloudinary is not configured");
  }

  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  return cloudinary;
}

export async function testCloudinaryConnection(
  cloud_name: string,
  api_key: string,
  api_secret: string
): Promise<{ success: boolean; error?: string }> {
  try {
    cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
    await cloudinary.api.ping();
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Invalid credentials",
    };
  }
}
