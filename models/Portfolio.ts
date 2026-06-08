import mongoose, { Schema, models, model } from "mongoose";

export type PortfolioCategory =
  | "Wedding"
  | "Event"
  | "Commercial"
  | "Portrait"
  | "Drone"
  | "Other";

export interface IPortfolio {
  title: string;
  category: PortfolioCategory;
  description: string;
  images: string[];
  videoUrl: string;
  featured: boolean;
  visible: boolean;
  order: number;
  createdAt: Date;
}

const PortfolioSchema = new Schema<IPortfolio>(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["Wedding", "Event", "Commercial", "Portrait", "Drone", "Other"],
      default: "Wedding",
    },
    description: { type: String, default: "" },
    images: [{ type: String }],
    videoUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Portfolio =
  models.Portfolio || model<IPortfolio>("Portfolio", PortfolioSchema);

export default Portfolio;
