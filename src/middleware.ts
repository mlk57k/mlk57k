import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);

  // Tracking influenceurs : ?ref=code → cookie 30 jours. On garde le PREMIER
  // code vu (premier influenceur crédité), on ne l'écrase pas ensuite.
  const ref = request.nextUrl.searchParams.get("ref");
  if (ref && /^[a-zA-Z0-9_.-]{1,40}$/.test(ref) && !request.cookies.get("ancrage_ref")) {
    response.cookies.set("ancrage_ref", ref, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax",
      httpOnly: true,
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Toutes les routes sauf : fichiers statiques, images Next, favicon.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
