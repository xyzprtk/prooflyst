import { cookies } from "next/headers";

const COOKIE_NAME = "pl_admin_key";

export async function getAdminKey(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value ?? null;
}

export async function setAdminKey(key: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, key, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearAdminKey() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
