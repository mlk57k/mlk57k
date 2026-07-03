import { redirect } from "next/navigation";

// Page fusionnée avec le paywall pour une expérience pricing unique.
export default function AbonnementPage() {
  redirect("/paywall");
}
