import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-05-27.dahlia",
    });
  }
  return _stripe;
}

// Alias for convenience where stripe is always available at runtime
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as never)[prop as keyof Stripe];
  },
});
