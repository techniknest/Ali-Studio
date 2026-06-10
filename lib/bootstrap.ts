import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";
import Config from "@/models/Config";
import Settings from "@/models/Settings";
import { connectDB, connectDBWithUri } from "@/lib/mongodb";
import { encrypt } from "@/lib/encryption";

export async function seedBootstrapAdmin(mongoUri?: string): Promise<void> {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL || "najmalistudio@gmail.com";
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD || "Ali@123456";

  try {
    if (mongoUri) await connectDBWithUri(mongoUri);
    else await connectDB();
    
    // Seed Admin
    const existingAdmin = await Admin.findOne();
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(password, 12);
      await Admin.create({ email: email.toLowerCase(), passwordHash });
      console.log("Admin seeded");
    }

    // Seed Config
    const existingConfig = await Config.findOne();
    if (!existingConfig) {
      const configsToSeed = [
        { key: "MONGODB_URI", value: process.env.MONGODB_URI || "", category: "mongodb" as const },
        { key: "CLOUDINARY_CLOUD_NAME", value: process.env.CLOUDINARY_CLOUD_NAME || "", category: "cloudinary" as const },
        { key: "CLOUDINARY_API_KEY", value: process.env.CLOUDINARY_API_KEY || "", category: "cloudinary" as const },
        { key: "CLOUDINARY_API_SECRET", value: process.env.CLOUDINARY_API_SECRET || "", category: "cloudinary" as const },
        { key: "SMTP_USER", value: process.env.SMTP_USER || process.env.EMAIL_USER || "", category: "smtp" as const },
        { key: "SMTP_PASS", value: process.env.SMTP_PASS || process.env.EMAIL_PASS || "", category: "smtp" as const },
      ];

      for (const c of configsToSeed) {
        if (c.value) {
          await Config.create({
            key: c.key,
            value: encrypt(c.value),
            category: c.category
          });
        }
      }
      console.log("Config seeded");
    }

    // Seed Settings with setupCompleted = true so the setup wizard is skipped
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      await Settings.create({ setupCompleted: true });
      console.log("Settings seeded with setupCompleted: true");
    } else if (!existingSettings.setupCompleted) {
      await Settings.updateOne({}, { setupCompleted: true });
      console.log("Settings updated: setupCompleted set to true");
    }

  } catch (e) {
    console.error("Bootstrap error:", e);
  }
}
