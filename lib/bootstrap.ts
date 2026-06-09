import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";
import Config from "@/models/Config";
import Settings from "@/models/Settings";
import Service from "@/models/Service";
import Team from "@/models/Team";
import Portfolio from "@/models/Portfolio";
import { connectDB, connectDBWithUri } from "@/lib/mongodb";
import { encrypt } from "@/lib/encryption";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

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
        { key: "MONGODB_URI", value: process.env.MONGODB_URI || "", category: "mongodb" },
        { key: "CLOUDINARY_CLOUD_NAME", value: process.env.CLOUDINARY_CLOUD_NAME || "", category: "cloudinary" },
        { key: "CLOUDINARY_API_KEY", value: process.env.CLOUDINARY_API_KEY || "", category: "cloudinary" },
        { key: "CLOUDINARY_API_SECRET", value: process.env.CLOUDINARY_API_SECRET || "", category: "cloudinary" },
        { key: "SMTP_USER", value: process.env.EMAIL_USER || "", category: "smtp" },
        { key: "SMTP_PASS", value: process.env.EMAIL_PASS || "", category: "smtp" },
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

    // Hardcoded dummy data seeding has been completely removed!
    // Settings, Services, Team, and Portfolio will no longer be auto-populated with dummy data.
    // You can now set them up cleanly through the Admin Dashboard.

  } catch (e) {
    console.error("Bootstrap error:", e);
  }
}
