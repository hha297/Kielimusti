import { toast } from "sonner";

import { signOut } from "@/lib/auth-client";

/**
 * Client-only sign-out: clears session via Better Auth, then hard-navigates so
 * cookies and RSC cache stay in sync (avoids flaky client router-only redirects).
 */
export async function performSignOut(): Promise<void> {
  await signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.assign("/sign-in");
      },
      onError: (ctx) => {
        const msg =
          ctx && typeof ctx === "object" && "error" in ctx && ctx.error && typeof ctx.error === "object"
            ? "message" in ctx.error && typeof ctx.error.message === "string"
              ? ctx.error.message
              : null
            : null;
        toast.error(msg ?? "Could not sign out. Try again.");
      },
    },
  });
}
