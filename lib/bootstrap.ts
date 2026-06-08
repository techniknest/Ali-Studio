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

    // Configure Cloudinary
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
    }

    const uploadImage = async (filename: string, folder: string) => {
      try {
        const imgPath = path.join(process.cwd(), "pictures", filename);
        if (fs.existsSync(imgPath)) {
          const res = await cloudinary.uploader.upload(imgPath, { folder: `ali_studio/${folder}` });
          return res.secure_url;
        }
      } catch (err) {
        console.error("Cloudinary upload failed for", filename, err);
      }
      return null;
    };

    // Seed Settings
    const existingSettings = await Settings.findOne();
    if (!existingSettings) {
      const logoUrl = await uploadImage("logo.png", "logo") || "";
      const aboutImageUrl = await uploadImage("image.jpeg", "about") || "";

      await Settings.create({
        studioName: "Ali Studio",
        tagline: "Cinematic Stories, Timeless Memories",
        whatsappNumber: "+92 336 5653867",
        email: "najmalistudio@gmail.com",
        mapsEmbedUrl: "https://maps.app.goo.gl/E1nscrnkbRBc5mAQ9",
        instagram: "https://www.instagram.com/najm.shahbaz.5?utm_source=qr&igsh=bThlbWp3aGNhNzYw",
        tiktok: "https://www.tiktok.com/@muhammad.najmuddi60?_r=1&_t=ZS-96tWXWgmfGn",
        facebook: "https://facebook.com",
        aboutText: "Welcome to Ali Studio, where every frame tells a story. Since 2020, we have curated annual photo and video projects focusing on timeless elegance and authentic emotions. We specialize in bringing your cinematic dreams to life.",
        setupCompleted: true,
        logoUrl,
        aboutImageUrl
      });
      console.log("Settings seeded");
    }

    // Seed Services
    const existingServices = await Service.countDocuments();
    if (existingServices === 0 && process.env.CLOUDINARY_CLOUD_NAME) {
      const servicesData = [
        { title: "Event Coverage", imgs: ["event-cverage.png"] },
        { title: "Bridal Shoot", imgs: ["Indian Grooms Wedding Outfit, White Kurta Mens….jpeg", "Discover stylish and elegant groom poses for….jpeg"] },
        { title: "Drone Coverage", imgs: ["drone-coverage.png"] },
        { title: "Indoor & Outdoor Shoots", imgs: ["indoor-outdoor-shoots.png", "indoor-outdoor-shoots-2.png"] },
        { title: "Album Designing", imgs: ["album-design.png", "album-design-2.png", "Luxury Wedding Albums Get Your Amazing Customized….jpeg", "Discover premium canvera printing at optimum….jpeg"] },
        { title: "Commercial Advertisements", imgs: ["commercial-advertisement.png", "commercial-advertisement-2.png"] },
        { title: "Premium Video Editing", imgs: ["vedio-editing.png"] },
        { title: "Podcast Recording & Production", imgs: ["podcast.png"] },
        { title: "Fashion Photography", imgs: ["fashion-photography.png"] },
      ];

      for (let i = 0; i < servicesData.length; i++) {
        const s = servicesData[i];
        const uploadedUrls = [];
        for (const img of s.imgs) {
          const url = await uploadImage(img, "services");
          if (url) uploadedUrls.push(url);
        }

        await Service.create({
          title: s.title,
          shortDescription: `Professional ${s.title} services.`,
          images: uploadedUrls,
          order: i,
        });
      }
      console.log("Services seeded");
    }

    // Seed Team
    const existingTeam = await Team.countDocuments();
    if (existingTeam === 0 && process.env.CLOUDINARY_CLOUD_NAME) {
      const teamUrl = await uploadImage("team image 1.jpeg", "team");
      await Team.create({
        name: "Ali",
        designation: "Owner",
        imageUrl: teamUrl || "",
        position: 'left',
        order: 0,
      });
      console.log("Team seeded");
    }

    // Seed Portfolio
    const existingPortfolio = await Portfolio.countDocuments();
    if (existingPortfolio === 0 && process.env.CLOUDINARY_CLOUD_NAME) {
      const portfolioImages = [
        "1407443627733410.jpeg", "2111131070684447.jpeg", "27866091440059521.jpeg",
        "31454897393603774.jpeg", "321937073383741471.jpeg", "384987468167813598.jpeg",
        "465edabc05b57e80cf91a66772632730.jpg", "54535845481009050.jpeg", "55591376643252626.jpeg",
        "578853358400275469.jpeg", "941463497119032367.jpeg", "We Are Glad To Announce A Huge Discounts On….jpeg",
        "WhatsApp Image 2026-06-03 at 10.35.30 AM.jpeg", "WhatsApp Image 2026-06-03 at 10.35.32 AM.jpeg",
        "WhatsApp Image 2026-06-03 at 10.36.04 AM.jpeg", "Since 2020, l’ve curated annual photo & video….jpeg"
      ];

      for (let i = 0; i < portfolioImages.length; i++) {
        const url = await uploadImage(portfolioImages[i], "portfolio");
        if (url) {
          await Portfolio.create({
            title: `Portfolio Piece ${i+1}`,
            category: "Other",
            images: [url],
            featured: true,
            visible: true,
            order: i
          });
        }
      }
      console.log("Portfolio seeded");
    }

  } catch (e) {
    console.error("Bootstrap error:", e);
  }
}
