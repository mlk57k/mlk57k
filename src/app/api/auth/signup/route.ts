import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Champs manquants." }, { status: 400 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("already registered") || msg.includes("already been registered")) {
      // User exists — confirm email + update password (handles unconfirmed accounts)
      const { data: listData } = await admin.auth.admin.listUsers();
      const existing = listData?.users?.find((u) => u.email === email);
      if (existing) {
        const { error: updateError } = await admin.auth.admin.updateUserById(
          existing.id,
          { email_confirm: true, password }
        );
        if (!updateError) {
          // Ensure profile exists
          await admin.from("profiles").upsert({ id: existing.id, email }, { onConflict: "id" });
          return NextResponse.json({ userId: existing.id });
        }
      }
      return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Ensure profile exists (in case trigger didn't fire)
  await admin.from("profiles").upsert(
    { id: data.user.id, email },
    { onConflict: "id" }
  );

  return NextResponse.json({ userId: data.user.id });
}
