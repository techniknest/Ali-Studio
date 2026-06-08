import mongoose, { Schema, models, model } from "mongoose";

export interface IService {
  title: string;
  shortDescription: string;
  longDescription: string;
  iconName: string;
  images: string[];
  priceRange: string;
  order: number;
  visible: boolean;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    longDescription: { type: String, default: "" },
    iconName: { type: String, default: "Video" },
    images: { type: [String], default: [] },
    priceRange: { type: String, default: "" },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Service = models.Service || model<IService>("Service", ServiceSchema);

export default Service;
