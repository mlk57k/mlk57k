import { redirect } from "next/navigation";

// Ancienne page héritée de Glowy — les formules se trouvent sur /abonnement
// (et le paywall in-app sur /paywall). Redirection permanente.
export default function CheckoutPage() {
  redirect("/abonnement");
}
