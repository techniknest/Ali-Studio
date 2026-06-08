"use server";

import bcrypt from "bcryptjs";
import { signOut } from "@/lib/auth";
import { requireAuth } from "@/lib/auth-helpers";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import {
  changeEmailSchema,
  changePasswordSchema,
} from "@/lib/validators/auth";

export async function changeAdminEmail(data: {
  newEmail: string;
  currentPassword: string;
}) {
  const session = await requireAuth();
  const parsed = changeEmailSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  await connectDB();
  const admin = await Admin.findOne({ email: session.user.email.toLowerCase() });
  if (!admin) return { success: false, error: "Admin not found" };

  const valid = await bcrypt.compare(
    parsed.data.currentPassword,
    admin.passwordHash
  );
  if (!valid) return { success: false, error: "Incorrect password" };

  const exists = await Admin.findOne({
    email: parsed.data.newEmail.toLowerCase(),
    _id: { $ne: admin._id },
  });
  if (exists) return { success: false, error: "Email already in use" };

  admin.email = parsed.data.newEmail.toLowerCase();
  await admin.save();
  await signOut({ redirect: true, redirectTo: "/admin/login" });
  return { success: true };
}

export async function changeAdminPassword(data: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  const session = await requireAuth();
  const parsed = changePasswordSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message };
  }

  await connectDB();
  const admin = await Admin.findOne({ email: session.user.email.toLowerCase() });
  if (!admin) return { success: false, error: "Admin not found" };

  const valid = await bcrypt.compare(
    parsed.data.currentPassword,
    admin.passwordHash
  );
  if (!valid) return { success: false, error: "Incorrect current password" };

  admin.passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await admin.save();
  await signOut({ redirect: true, redirectTo: "/admin/login" });
  return { success: true };
}
