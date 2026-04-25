"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PasswordField } from "@/components/password-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { changePassword } from "@/lib/auth-client";
import { changePasswordFormSchema, type ChangePasswordFormValues } from "@/lib/profile-password-schema";

export function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ChangePasswordFormValues) {
    const { error } = await changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: true,
    });
    if (error) {
      toast.error(error.message ?? "Could not update password");
      return;
    }
    toast.success("Password updated");
    reset();
  }

  return (
    <Card className="border-border/80 bg-card/60 shadow-none">
      <CardHeader>
        <CardTitle className="text-lg">Change password</CardTitle>
        <CardDescription>Use your current password, then pick a new one.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <PasswordField
              label="Current password"
              autoComplete="current-password"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.currentPassword)}
              {...register("currentPassword")}
            />
            {errors.currentPassword ? (
              <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
            ) : null}
          </div>
          <div className="space-y-1.5">
            <PasswordField
              label="New password"
              autoComplete="new-password"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.newPassword)}
              {...register("newPassword")}
            />
            {errors.newPassword ? <p className="text-sm text-destructive">{errors.newPassword.message}</p> : null}
          </div>
          <div className="space-y-1.5">
            <PasswordField
              label="Confirm new password"
              autoComplete="new-password"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.confirmPassword)}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword ? (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            ) : null}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating…" : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
