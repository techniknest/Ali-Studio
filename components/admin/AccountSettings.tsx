"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeEmailSchema, changePasswordSchema } from "@/lib/validators/auth";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MaskedInput } from "@/components/admin/MaskedInput";
import { changeAdminEmail, changeAdminPassword, requestPasswordChangeOtpAction } from "@/actions/auth.actions";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

type EmailForm = z.infer<typeof changeEmailSchema>;
type PasswordForm = z.infer<typeof changePasswordSchema>;

export function AccountSettings({ currentEmail }: { currentEmail: string }) {
  const [pending, setPending] = useState(false);
  
  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && otpSent) {
      setOtpSent(false);
      toast.error("OTP expired. Please request a new one.");
    }
  }, [timeLeft, otpSent]);

  const emailForm = useForm<EmailForm>({ resolver: zodResolver(changeEmailSchema) });
  const passwordForm = useForm<PasswordForm>({ resolver: zodResolver(changePasswordSchema) });

  const onEmailSubmit = async (data: EmailForm) => {
    setPending(true);
    const result = await changeAdminEmail(data);
    setPending(false);
    if (result.success) {
      toast.success("Email updated. Please sign in again.");
      await signOut({ callbackUrl: "/admin/login" });
    } else toast.error(result.error);
  };

  const onRequestOtp = async () => {
    const isValid = await passwordForm.trigger(["currentPassword", "newPassword", "confirmPassword"]);
    if (!isValid) return;

    setPending(true);
    const result = await requestPasswordChangeOtpAction(passwordForm.getValues());
    setPending(false);

    if (result.success) {
      toast.success("OTP sent to your email! It expires in 60 seconds.");
      setOtpSent(true);
      setTimeLeft(60);
    } else {
      toast.error(result.error);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    setPending(true);
    const result = await changeAdminPassword(data);
    setPending(false);
    if (result.success) {
      toast.success("Password updated. Please sign in again.");
      await signOut({ callbackUrl: "/admin/login" });
    } else toast.error(result.error);
  };

  const newPassword = passwordForm.watch("newPassword");
  const strength =
    !newPassword ? 0 : newPassword.length < 8 ? 1 : /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword) ? 3 : 2;

  return (
    <div className="max-w-md space-y-12">
      <div>
        <p className="text-sm text-[var(--text-secondary)]">Current email</p>
        <p className="font-mono">{currentEmail}</p>
      </div>

      <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
        <h2 className="text-lg font-medium">Change Email</h2>
        <div>
          <Label>New Email</Label>
          <Input {...emailForm.register("newEmail")} type="email" className="mt-1" />
        </div>
        <div>
          <Label>Current Password</Label>
          <MaskedInput {...emailForm.register("currentPassword")} className="mt-1" />
        </div>
        <Button type="submit" disabled={pending}>Update Email</Button>
      </form>

      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
        <h2 className="text-lg font-medium">Change Password</h2>
        <div>
          <Label>Current Password</Label>
          <MaskedInput {...passwordForm.register("currentPassword")} className="mt-1" disabled={otpSent} />
        </div>
        <div>
          <Label>New Password</Label>
          <MaskedInput {...passwordForm.register("newPassword")} className="mt-1" disabled={otpSent} />
          <div className="mt-2 h-1 rounded bg-[var(--border)]">
            <div
              className="h-full rounded transition-all"
              style={{
                width: `${(strength / 3) * 100}%`,
                backgroundColor:
                  strength < 2 ? "var(--danger)" : strength < 3 ? "var(--accent-muted)" : "var(--accent)",
              }}
            />
          </div>
        </div>
        <div>
          <Label>Confirm New Password</Label>
          <MaskedInput {...passwordForm.register("confirmPassword")} className="mt-1" disabled={otpSent} />
        </div>

        {otpSent && (
          <div className="p-4 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-xl space-y-3">
            <div>
              <Label>Enter OTP</Label>
              <Input 
                {...passwordForm.register("otp")} 
                placeholder="6-digit OTP" 
                maxLength={6}
                className="mt-1" 
              />
            </div>
            <p className="text-sm text-[var(--accent)]">
              Time remaining: {timeLeft}s
            </p>
          </div>
        )}

        {!otpSent ? (
          <Button type="button" onClick={onRequestOtp} disabled={pending}>Request OTP</Button>
        ) : (
          <Button type="submit" disabled={pending || timeLeft === 0}>Verify & Update Password</Button>
        )}
      </form>
    </div>
  );
}
