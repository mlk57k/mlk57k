export async function register() {
  // Only run in the Node.js runtime on the server, not during the client build
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return;

  try {
    const Stripe = (await import("stripe")).default;
    const stripe = new Stripe(secretKey, { apiVersion: "2026-05-27.dahlia" });

    const existing = await stripe.promotionCodes.list({ code: "BEESSAP", limit: 1 });
    if (existing.data.length > 0) return;

    const coupon = await stripe.coupons.create({
      percent_off: 100,
      duration: "forever",
      name: "Accès à vie Glowy — beessap",
      max_redemptions: 3,
    });

    await stripe.promotionCodes.create({
      promotion: { type: "coupon", coupon: coupon.id },
      code: "BEESSAP",
      max_redemptions: 3,
    });
  } catch {
    // Non-fatal: promo code will be created on next restart
  }
}
