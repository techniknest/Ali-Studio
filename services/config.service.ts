import fs from "fs";
import path from "path";
import { configRepository } from "@/repositories/config.repository";
import { encrypt } from "@/lib/encryption";
import { clearConfigCache, refreshConfigCache, getConfig } from "@/lib/config";
import { connectDBWithUri, testMongoConnection, connectDB } from "@/lib/mongodb";
import { testCloudinaryConnection } from "@/lib/cloudinary";
import { seedBootstrapAdmin } from "@/lib/bootstrap";
import { settingsRepository } from "@/repositories/settings.repository";

export class ConfigService {
  async saveConfigEntry(
    key: string,
    value: string,
    category: "mongodb" | "cloudinary" | "resend" | "smtp"
  ) {
    const encrypted = encrypt(value);
    const result = await configRepository.save(key, encrypted, category);
    clearConfigCache();
    return result;
  }

  async testMongoUri(uri: string) {
    return testMongoConnection(uri);
  }

  async saveMongoConfig(uri: string) {
    const test = await testMongoConnection(uri);
    if (!test.success) throw new Error(test.error || "MongoDB connection failed");

    await connectDBWithUri(uri);
    await this.saveConfigEntry("MONGODB_URI", uri, "mongodb");
    await refreshConfigCache();
    await seedBootstrapAdmin(uri);

    try {
      const envPath = path.join(process.cwd(), ".env.local");
      const content = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
      if (!content.includes("MONGODB_URI=")) {
        fs.appendFileSync(envPath, `\nMONGODB_URI="${uri}"\n`);
      } else {
        const newContent = content.replace(/MONGODB_URI=.*/g, `MONGODB_URI="${uri}"`);
        fs.writeFileSync(envPath, newContent);
      }
    } catch (err) {
      // Ignore in serverless
    }

    return true;
  }

  async testCloudinaryConfig(data: { cloudName: string; apiKey: string; apiSecret: string }) {
    return testCloudinaryConnection(data.cloudName, data.apiKey, data.apiSecret);
  }

  async saveCloudinaryConfig(data: { cloudName: string; apiKey: string; apiSecret: string }) {
    const test = await this.testCloudinaryConfig(data);
    if (!test.success) throw new Error(test.error || "Cloudinary connection failed");

    await connectDB();
    await this.saveConfigEntry("CLOUDINARY_CLOUD_NAME", data.cloudName, "cloudinary");
    await this.saveConfigEntry("CLOUDINARY_API_KEY", data.apiKey, "cloudinary");
    await this.saveConfigEntry("CLOUDINARY_API_SECRET", data.apiSecret, "cloudinary");
    await refreshConfigCache();
    return true;
  }

  async testSmtpConfig(data: { user: string; pass: string }, toEmail: string) {
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
    return true;
  }

  async saveSmtpConfig(data: { user: string; pass: string }, adminEmail: string) {
    try {
      await this.testSmtpConfig(data, adminEmail);
    } catch (err: any) {
      throw new Error(err.message || "Failed to verify SMTP config");
    }

    await connectDB();
    await this.saveConfigEntry("SMTP_USER", data.user, "smtp");
    await this.saveConfigEntry("SMTP_PASS", data.pass, "smtp");
    await refreshConfigCache();
    return true;
  }

  async saveStudioInfo(data: any) {
    await settingsRepository.update({ ...data, setupCompleted: true });
    return true;
  }

  async getInfrastructureStatus() {
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

  async checkSetupRequired() {
    try {
      // If env vars provide all necessary config, setup is not required
      const hasEnvConfig = Boolean(
        process.env.MONGODB_URI &&
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      );
      if (hasEnvConfig) {
        return { required: false };
      }

      const configCount = await configRepository.count();
      const settings = await settingsRepository.get();
      if (configCount === 0 || !settings?.setupCompleted) {
        return { required: true };
      }
      return { required: false };
    } catch {
      // If we can't even check, see if env vars cover us
      const hasEnvConfig = Boolean(
        process.env.MONGODB_URI &&
        process.env.CLOUDINARY_CLOUD_NAME
      );
      return { required: !hasEnvConfig };
    }
  }
}

export const configService = new ConfigService();
