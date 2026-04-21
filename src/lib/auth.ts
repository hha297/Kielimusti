/**
 * Auth wiring placeholder. NextAuth + Google OAuth will land in a follow-up step.
 */
export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
};

export async function getSession(): Promise<{ user: SessionUser } | null> {
  return null;
}
