import mongoose, { Schema, models, model } from "mongoose";

export interface IAdmin {
  email: string;
  passwordHash: string;
  loginAttempts?: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
  },
  { timestamps: true }
);

const Admin = models.Admin || model<IAdmin>("Admin", AdminSchema);

export default Admin;
