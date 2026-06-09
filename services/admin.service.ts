import bcrypt from "bcryptjs";
import { adminRepository } from "@/repositories/admin.repository";

export class AdminService {
  async changeEmail(sessionEmail: string, data: any) {
    const admin = await adminRepository.findByEmail(sessionEmail.toLowerCase());
    if (!admin) throw new Error("Admin not found");

    const valid = await bcrypt.compare(data.currentPassword, admin.passwordHash);
    if (!valid) throw new Error("Incorrect password");

    const exists = await adminRepository.findByEmailExcludingId(
      data.newEmail.toLowerCase(),
      admin._id.toString()
    );
    if (exists) throw new Error("Email already in use");

    admin.email = data.newEmail.toLowerCase();
    await admin.save();
    return true;
  }

  async changePassword(sessionEmail: string, data: any) {
    const admin = await adminRepository.findByEmail(sessionEmail.toLowerCase());
    if (!admin) throw new Error("Admin not found");

    const valid = await bcrypt.compare(data.currentPassword, admin.passwordHash);
    if (!valid) throw new Error("Incorrect current password");

    if (!admin.changePasswordOtp || !admin.changePasswordOtpExpires) {
      throw new Error("No OTP requested");
    }

    if (new Date() > admin.changePasswordOtpExpires) {
      throw new Error("OTP has expired");
    }

    if (admin.changePasswordOtp !== data.otp) {
      throw new Error("Invalid OTP");
    }

    admin.passwordHash = await bcrypt.hash(data.newPassword, 12);
    admin.changePasswordOtp = undefined;
    admin.changePasswordOtpExpires = undefined;
    await admin.save();
    return true;
  }

  async requestPasswordChangeOtp(sessionEmail: string, data: any) {
    const admin = await adminRepository.findByEmail(sessionEmail.toLowerCase());
    if (!admin) throw new Error("Admin not found");

    const valid = await bcrypt.compare(data.currentPassword, admin.passwordHash);
    if (!valid) throw new Error("Incorrect current password");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.changePasswordOtp = otp;
    admin.changePasswordOtpExpires = new Date(Date.now() + 60 * 1000); // 60 seconds
    await admin.save();

    const { sendEmail } = await import("@/lib/email");
    await sendEmail({
      to: admin.email,
      subject: "Your OTP for Password Change",
      html: `<p>Your One Time Password (OTP) to change your password is: <strong style="font-size: 24px;">${otp}</strong></p><p>This OTP is valid for 60 seconds.</p>`
    });

    return true;
  }
}

export const adminService = new AdminService();
