import { NextResponse } from "next/server";
import { clearAdminKey } from "@/lib/session";

export async function POST() {
  await clearAdminKey();
  return NextResponse.json({ success: true });
}
