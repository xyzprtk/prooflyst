import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";
import { hashKey } from "@/lib/keys";
import { getLocalSiteByAdminHash } from "@/lib/local-store";
import { setAdminKey } from "@/lib/session";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body?.key || !body.key.startsWith("pl_admin_")) {
      return NextResponse.json(
        { error: { message: "Invalid admin key format" } },
        { status: 400 }
      );
    }

    const hashed = hashKey(body.key);
    let site: { id: string } | undefined;
    try {
      [site] = await db
        .select({ id: sites.id })
        .from(sites)
        .where(eq(sites.adminKey, hashed))
        .limit(1);
    } catch {
      const local = await getLocalSiteByAdminHash(hashed);
      if (local) {
        site = { id: local.id };
      }
    }

    if (!site) {
      return NextResponse.json(
        { error: { message: "Admin key not found" } },
        { status: 401 }
      );
    }

    await setAdminKey(body.key);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login route failed:", error);
    return NextResponse.json(
      { error: { message: "Could not reach the database. Please try again." } },
      { status: 500 }
    );
  }
}
