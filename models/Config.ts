import mongoose, { Schema, models, model } from "mongoose";

export interface IConfig {
  key: string;
  value: string;
  category: "mongodb" | "cloudinary" | "resend" | "smtp";
  updatedAt: Date;
}

const ConfigSchema = new Schema<IConfig>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    category: {
      type: String,
      enum: ["mongodb", "cloudinary", "resend", "smtp"],
      required: true,
    },
  },
  { timestamps: true }
);

const Config =
  models.Config || model<IConfig>("Config", ConfigSchema);

export default Config;
