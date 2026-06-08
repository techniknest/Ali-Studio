import mongoose, { Schema, models, model } from "mongoose";

export interface ISettings {
  studioName: string;
  tagline: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroVideoUrl: string;
  heroImageUrl: string;
  logoUrl: string;
  faviconUrl: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  mapsEmbedUrl: string;
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  instagramEnabled: boolean;
  facebookEnabled: boolean;
  youtubeEnabled: boolean;
  tiktokEnabled: boolean;
  statsYearsExp: number;
  statsProjectsDone: number;
  statsHappyClients: number;
  aboutText: string;
  aboutImageUrl: string;
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  accentColor: string;
  footerText: string;
  setupCompleted: boolean;
}

const SettingsSchema = new Schema<ISettings>(
  {
    studioName: { type: String, default: "Ali Studio" },
    tagline: { type: String, default: "Cinematic Stories, Timeless Memories" },
    heroHeadline: { type: String, default: "We Capture Your Story" },
    heroSubheadline: {
      type: String,
      default: "Premium wedding films & creative videography",
    },
    heroVideoUrl: { type: String, default: "" },
    heroImageUrl: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsappNumber: { type: String, default: "923001234567" },
    email: { type: String, default: "hello@alistudio.com" },
    address: { type: String, default: "" },
    mapsEmbedUrl: { type: String, default: "" },
    instagram: { type: String, default: "" },
    facebook: { type: String, default: "" },
    youtube: { type: String, default: "" },
    tiktok: { type: String, default: "" },
    instagramEnabled: { type: Boolean, default: true },
    facebookEnabled: { type: Boolean, default: true },
    youtubeEnabled: { type: Boolean, default: true },
    tiktokEnabled: { type: Boolean, default: false },
    statsYearsExp: { type: Number, default: 10 },
    statsProjectsDone: { type: Number, default: 250 },
    statsHappyClients: { type: Number, default: 200 },
    aboutText: { type: String, default: "" },
    aboutImageUrl: { type: String, default: "" },
    metaTitle: { type: String, default: "Ali Studio | Cinematic Videography" },
    metaDescription: {
      type: String,
      default: "Professional wedding films, event shoots, and creative productions.",
    },
    ogImageUrl: { type: String, default: "" },
    accentColor: { type: String, default: "#C9A84C" },
    footerText: { type: String, default: "" },
    setupCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Settings =
  models.Settings || model<ISettings>("Settings", SettingsSchema);

export default Settings;

export const defaultSettings: Partial<ISettings> = {
  studioName: "Ali Studio",
  tagline: "Cinematic Stories, Timeless Memories",
  heroHeadline: "We Capture Your Story",
  heroSubheadline: "Premium wedding films & creative videography",
  whatsappNumber: "923001234567",
  email: "hello@alistudio.com",
  statsYearsExp: 10,
  statsProjectsDone: 250,
  statsHappyClients: 200,
  accentColor: "#C9A84C",
  setupCompleted: false,
};
