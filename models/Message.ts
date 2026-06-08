import mongoose, { Schema, models, model } from "mongoose";

export interface IMessage {
  name: string;
  email: string;
  phone: string;
  services: string[];
  date: Date | null;
  message: string;
  read: boolean;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    services: { type: [String], default: [] },
    date: { type: Date, default: null },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Message = models.Message || model<IMessage>("Message", MessageSchema);

export default Message;
