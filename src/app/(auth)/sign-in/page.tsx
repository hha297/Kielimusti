"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInFormSchema, type SignInFormValues } from "@/lib/auth-forms";
import { signIn } from "@/lib/auth-client";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next");
  const next =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.includes(":")
      ? rawNext
      : null;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { emailOrUsername: "", password: "" },
  });

  async function onSubmit(values: SignInFormValues) {
    const identifier = values.emailOrUsername.trim();
    const password = values.password;

    const isEmail = identifier.includes("@");
    const result = isEmail
      ? await signIn.email({ email: identifier, password })
      : await signIn.username({ username: identifier.toLowerCase(), password });

    if (result.error) {
      toast.error(result.error.message ?? "Sign-in failed");
      return;
    }

    router.push(next ?? "/dashboard");
    router.refresh();
  }

  return (
    <Card className="border-border/80 bg-card/60 shadow-none backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">Sign in</CardTitle>
        <CardDescription className="text-muted-foreground">
          Use your email or username with your password.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emailOrUsername">Email or username</Label>
            <Input
              id="emailOrUsername"
              autoComplete="username"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.emailOrUsername)}
              {...register("emailOrUsername")}
            />
            {errors.emailOrUsername ? (
              <p className="text-sm text-destructive">{errors.emailOrUsername.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 mt-8">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link href="/sign-up" className="text-foreground underline-offset-4 hover:underline">
              Create one
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <Card className="border-border/80 bg-card/60 shadow-none backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold tracking-tight">Sign in</CardTitle>
            <CardDescription className="text-muted-foreground">Loading…</CardDescription>
          </CardHeader>
        </Card>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
