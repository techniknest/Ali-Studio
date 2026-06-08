import { connectDB } from "./lib/mongodb";
import Settings from "./models/Settings";
import Service from "./models/Service";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

async function updateDb() {
  await connectDB();
  
  // 1. Update Settings with about text
  console.log("Updating Settings...");
  const settings = await Settings.findOne();
  if (settings) {
    if (!settings.aboutText) {
      settings.aboutText = "Welcome to Ali Studio, where every frame tells a story. Since 2020, we have curated annual photo and video projects focusing on timeless elegance and authentic emotions. We specialize in bringing your cinematic dreams to life, whether it's your big day or a premium commercial shoot. Our passion is perfection.";
      await settings.save();
      console.log("Added aboutText to Settings");
    } else {
      console.log("Settings already has aboutText");
    }
    
    // Ensure logo is uploaded if missing
    if (!settings.logoUrl && process.env.CLOUDINARY_CLOUD_NAME) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      const imgPath = path.join(process.cwd(), "pictures", "logo.png");
      if (fs.existsSync(imgPath)) {
        const res = await cloudinary.uploader.upload(imgPath, { folder: "ali_studio/logo" });
        settings.logoUrl = res.secure_url;
        await settings.save();
        console.log("Uploaded and set logoUrl");
      }
    }
  }

  // 2. Add new Service
  console.log("Updating Services...");
  const serviceTitle = "Maternity & Newborn Shoots";
  const existingService = await Service.findOne({ title: serviceTitle });
  if (!existingService && process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    let secure_url = "";
    const imgPath = path.join(process.cwd(), "pictures", "image.jpeg");
    if (fs.existsSync(imgPath)) {
        const res = await cloudinary.uploader.upload(imgPath, { folder: "ali_studio/services" });
        secure_url = res.secure_url;
    }
    
    const count = await Service.countDocuments();
    await Service.create({
        title: serviceTitle,
        shortDescription: `Professional ${serviceTitle} services.`,
        imageUrl: secure_url,
        order: count,
    });
    console.log("Added new service: " + serviceTitle);
  } else {
    console.log("Service already exists or Cloudinary not configured");
  }

  console.log("Update complete.");
  process.exit(0);
}

updateDb().catch(console.error);
