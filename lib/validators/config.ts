import { z } from "zod";

export const mongoConfigSchema = z.object({
  mongodbUri: z.string().min(1, "MongoDB URI is required"),
});

export const cloudinaryConfigSchema = z.object({
  cloudName: z.string().min(1, "Cloud name is required"),
  apiKey: z.string().min(1, "API key is required"),
  apiSecret: z.string().min(1, "API secret is required"),
});

export const smtpConfigSchema = z.object({
  user: z.string().min(1, "SMTP user is required"),
  pass: z.string().min(1, "SMTP password is required"),
});

export const studioInfoSchema = z.object({
  studioName: z.string().min(1, "Studio name is required"),
  tagline: z.string().optional(),
  phone: z.string().optional(),
  whatsappNumber: z.string().min(1, "WhatsApp number is required"),
  email: z.string().email("Valid email is required"),
});
