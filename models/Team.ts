import mongoose, { Schema, models, model } from "mongoose";

export interface ITeam {
  name: string;
  designation: string;
  imageUrl: string;
  position: 'left' | 'right';
  order: number;
  visible: boolean;
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    position: { type: String, enum: ['left', 'right'], default: 'left' },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Team = models.Team || model<ITeam>("Team", TeamSchema);

export default Team;
