import mongoose, { Schema, models, model } from "mongoose";

export interface IReview {
  clientName: string;
  clientPhoto: string;
  rating: number;
  comment: string;
  projectType: string;
  approved: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    clientName: { type: String, required: true },
    clientPhoto: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    projectType: { type: String, default: "" },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
