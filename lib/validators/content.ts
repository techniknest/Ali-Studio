import { z } from "zod";

export const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.enum([
    "Wedding",
    "Event",
    "Commercial",
    "Portrait",
    "Drone",
    "Other",
  ]),
  description: z.string().optional(),
  images: z.array(z.string()).default([]),
  videoUrl: z.string().optional(),
  featured: z.boolean().default(false),
  visible: z.boolean().default(true),
  order: z.number().default(0),
});

export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  iconName: z.string().default("Video"),
  images: z.array(z.string()).default([]),
  priceRange: z.string().optional(),
  order: z.number().default(0),
  visible: z.boolean().default(true),
});

export const reviewSchema = z.object({
  clientName: z.string().min(1, "Name is required"),
  clientPhoto: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, "Comment is required"),
  projectType: z.string().optional(),
  approved: z.boolean().default(false),
});

export const publicReviewSchema = z.object({
  clientName: z.string().min(1, "Name is required"),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters"),
  projectType: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  services: z.array(z.string()).optional(),
  date: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const settingsSchema = z.object({
  studioName: z.string().min(1),
  tagline: z.string().optional(),
  heroHeadline: z.string().optional(),
  heroSubheadline: z.string().optional(),
  heroVideoUrl: z.string().optional(),
  heroImageUrl: z.string().optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  phone: z.string().optional(),
  whatsappNumber: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  mapsEmbedUrl: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
  instagramEnabled: z.boolean().optional(),
  facebookEnabled: z.boolean().optional(),
  youtubeEnabled: z.boolean().optional(),
  tiktokEnabled: z.boolean().optional(),
  statsYearsExp: z.coerce.number().optional(),
  statsProjectsDone: z.coerce.number().optional(),
  statsHappyClients: z.coerce.number().optional(),
  aboutText: z.string().optional(),
  aboutImageUrl: z.string().optional(),
  philosophyImageUrl: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImageUrl: z.string().optional(),
  accentColor: z.string().optional(),
  footerText: z.string().optional(),
});
