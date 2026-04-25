import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";

import { ProfileView, type ProfileUserPayload } from "./profile-view";

function toIso(value: unknown): string | null {
  if (value == null) return null;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" || typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? String(value) : d.toISOString();
  }
  return null;
}

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }

  const u = session.user;
  const username = "username" in u && typeof u.username === "string" ? u.username : null;
  const displayUsername =
    "displayUsername" in u && typeof u.displayUsername === "string" ? u.displayUsername : null;

  const payload: ProfileUserPayload = {
    name: typeof u.name === "string" ? u.name : "",
    email: u.email,
    image: typeof u.image === "string" && u.image.length > 0 ? u.image : null,
    emailVerified: Boolean(u.emailVerified),
    username,
    displayUsername,
    createdAt: toIso("createdAt" in u ? u.createdAt : undefined),
    updatedAt: toIso("updatedAt" in u ? u.updatedAt : undefined),
  };

  return <ProfileView user={payload} />;
}
