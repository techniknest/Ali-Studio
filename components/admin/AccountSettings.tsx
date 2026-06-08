"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeEmailSchema, changePasswordSchema } from "@/lib/validators/auth";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MaskedInput } from "@/components/admin/MaskedInput";
import { changeAdminEmail, changeAdminPassword } from "@/actions/auth.actions";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

type EmailForm = z.infer<typeof changeEmailSchema>;
type PasswordForm = z.infer<typeof changePasswordSchema>;

export function AccountSettings({ currentEmail }: { currentEmail: string }) {
  const [pending, setPending] = useState(false);

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
          <MaskedInput {...passwordForm.register("currentPassword")} className="mt-1" />
        </div>
        <div>
          <Label>New Password</Label>
          <MaskedInput {...passwordForm.register("newPassword")} className="mt-1" />
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
          <MaskedInput {...passwordForm.register("confirmPassword")} className="mt-1" />
        </div>
        <Button type="submit" disabled={pending}>Update Password</Button>
      </form>
    </div>
  );
}
