"use server";

import { requireAuth } from "@/lib/auth-helpers";
import { connectDB, connectDBWithUri } from "@/lib/mongodb";
import Config from "@/models/Config";
import Settings, { type ISettings } from "@/models/Settings";
import { encrypt } from "@/lib/encryption";
import { clearConfigCache, refreshConfigCache } from "@/lib/config";
import { testMongoConnection } from "@/lib/mongodb";
import { testCloudinaryConnection } from "@/lib/cloudinary";
import {
  mongoConfigSchema,
  cloudinaryConfigSchema,
  smtpConfigSchema,
  studioInfoSchema,
} from "@/lib/validators/config";
import { getConfig } from "@/lib/config";
import { auth } from "@/lib/auth";
import { seedBootstrapAdmin } from "@/lib/bootstrap";

async function saveConfigEntry(
  key: string,
  value: string,
  category: "mongodb" | "cloudinary" | "resend" | "smtp"
) {
  const encrypted = encrypt(value);
  await Config.findOneAndUpdate(
    { key },
    { key, value: encrypted, category },
    { upsert: true, new: true }
  );
  clearConfigCache();
}

export async function testMongoUri(uri: string) {
  await requireAuth();
  const parsed = mongoConfigSchema.safeParse({ mongodbUri: uri });
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }
  return testMongoConnection(uri);
}

export async function saveMongoConfig(uri: string) {
  await requireAuth();
  const test = await testMongoConnection(uri);
  if (!test.success) return { success: false, error: test.error };

  await connectDBWithUri(uri);
  await saveConfigEntry("MONGODB_URI", uri, "mongodb");
  await refreshConfigCache();
  await seedBootstrapAdmin(uri);
  return { success: true };
}

export async function testCloudinaryConfig(data: {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}) {
  await requireAuth();
  const parsed = cloudinaryConfigSchema.safeParse({
    cloudName: data.cloudName,
    apiKey: data.apiKey,
    apiSecret: data.apiSecret,
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }
  return testCloudinaryConnection(
    data.cloudName,
    data.apiKey,
    data.apiSecret
  );
}

export async function saveCloudinaryConfig(data: {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}) {
  await requireAuth();
  const test = await testCloudinaryConfig(data);
  if (!test.success) return { success: false, error: test.error };

  await connectDB();
  await saveConfigEntry("CLOUDINARY_CLOUD_NAME", data.cloudName, "cloudinary");
  await saveConfigEntry("CLOUDINARY_API_KEY", data.apiKey, "cloudinary");
  await saveConfigEntry("CLOUDINARY_API_SECRET", data.apiSecret, "cloudinary");
  await refreshConfigCache();
  return { success: true };
}

export async function testSmtpConfig(data: {
  user: string;
  pass: string;
}) {
  await requireAuth();
  const parsed = smtpConfigSchema.safeParse({
    user: data.user,
    pass: data.pass,
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  const session = await auth();
  const toEmail = session?.user?.email;
  if (!toEmail) return { success: false, error: "No admin email in session" };

  try {
    const nodemailer = (await import("nodemailer")).default;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data.user,
        pass: data.pass,
      },
    });
    
    await transporter.verify();

    await transporter.sendMail({
      from: data.user,
      to: toEmail,
      subject: "Ali Studio — Test Email",
      html: "<p>Your SMTP configuration is working correctly.</p>",
    });
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to send test email",
    };
  }
}

export async function saveSmtpConfig(data: {
  user: string;
  pass: string;
}) {
  await requireAuth();
  const test = await testSmtpConfig(data);
  if (!test.success) return { success: false, error: test.error };

  await connectDB();
  await saveConfigEntry("SMTP_USER", data.user, "smtp");
  await saveConfigEntry("SMTP_PASS", data.pass, "smtp");
  await refreshConfigCache();
  return { success: true };
}

export async function saveStudioInfo(data: {
  studioName: string;
  tagline?: string;
  phone?: string;
  whatsappNumber: string;
  email: string;
}) {
  await requireAuth();
  const parsed = studioInfoSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  await connectDB();
  await Settings.findOneAndUpdate(
    {},
    {
      ...parsed.data,
      setupCompleted: true,
    },
    { upsert: true, new: true }
  );
  return { success: true };
}

export async function getInfrastructureStatus() {
  await requireAuth();

  const mongoUri = await getConfig("MONGODB_URI");
  let mongoStatus = false;
  if (mongoUri) {
    const test = await testMongoConnection(mongoUri);
    mongoStatus = test.success;
  }

  const cloudName = await getConfig("CLOUDINARY_CLOUD_NAME");
  const apiKey = await getConfig("CLOUDINARY_API_KEY");
  const apiSecret = await getConfig("CLOUDINARY_API_SECRET");
  let cloudinaryStatus = false;
  if (cloudName && apiKey && apiSecret) {
    const test = await testCloudinaryConnection(cloudName, apiKey, apiSecret);
    cloudinaryStatus = test.success;
  }

  const smtpUser = await getConfig("SMTP_USER");
  const smtpPass = await getConfig("SMTP_PASS");
  const emailStatus = Boolean(smtpUser && smtpPass);

  return { mongoStatus, cloudinaryStatus, emailStatus };
}

export async function checkSetupRequired() {
  try {
    await connectDB();
    const configCount = await Config.countDocuments();
    const settings = (await Settings.findOne().lean().exec()) as ISettings | null;
    if (configCount === 0 || !settings?.setupCompleted) {
      return { required: true };
    }
    return { required: false };
  } catch {
    return { required: true };
  }
}
