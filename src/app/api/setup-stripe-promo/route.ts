import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// One-time endpoint: creates the BEESSAP coupon + promotion code in Stripe.
// Safe to call multiple times (idempotent).
export async function GET() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "STRIPE_SECRET_KEY not set." }, { status: 500 });
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2025-04-30.basil" });

  try {
    // Check if the promo code already exists
    const existing = await stripe.promotionCodes.list({ code: "BEESSAP", limit: 1 });
    if (existing.data.length > 0) {
      return NextResponse.json({
        message: "Promo code BEESSAP already exists.",
        id: existing.data[0].id,
        active: existing.data[0].active,
      });
    }

    // Create a 100% off, forever coupon limited to 3 redemptions total
    const coupon = await stripe.coupons.create({
      percent_off: 100,
      duration: "forever",
      name: "Accès à vie Glowy — beessap",
      max_redemptions: 3,
    });

    // Create the BEESSAP promotion code tied to that coupon
    const promoCode = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code: "BEESSAP",
      max_redemptions: 3,
    });

    return NextResponse.json({
      success: true,
      coupon_id: coupon.id,
      promo_code_id: promoCode.id,
      code: promoCode.code,
      max_redemptions: promoCode.max_redemptions,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
