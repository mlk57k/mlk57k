import { NextResponse } from "next/server";

export const runtime = "nodejs";

const VALID_CODES = new Set(["beessap"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code =
      typeof body.code === "string" ? body.code.trim().toLowerCase() : "";

    if (!VALID_CODES.has(code)) {
      return NextResponse.json(
        { error: "Code promo invalide." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}
