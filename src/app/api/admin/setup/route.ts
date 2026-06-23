import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const MIGRATION_SQL = `
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS addiction_type TEXT,
  ADD COLUMN IF NOT EXISTS severity TEXT,
  ADD COLUMN IF NOT EXISTS triggers TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS motivation TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS frequency TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS duration_label TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trial',
  ADD COLUMN IF NOT EXISTS subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_addiction_type_check') THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_addiction_type_check CHECK (addiction_type IN ('cannabis', 'porn', 'both'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_severity_check') THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_severity_check CHECK (severity IN ('light', 'moderate', 'severe'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_subscription_status_check') THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_status_check CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'past_due'));
  END IF;
END $$;

DROP POLICY IF EXISTS "profiles_own" ON profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = id);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS messages_user_created ON messages(user_id, created_at);

CREATE TABLE IF NOT EXISTS streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  days INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS streaks_user ON streaks(user_id);

CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  situation TEXT NOT NULL,
  emotion TEXT NOT NULL,
  craving_level INTEGER NOT NULL CHECK (craving_level BETWEEN 1 AND 10),
  resisted BOOLEAN NOT NULL,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS journal_user ON journal_entries(user_id);

CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content JSONB NOT NULL DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_own" ON messages;
DROP POLICY IF EXISTS "streaks_own" ON streaks;
DROP POLICY IF EXISTS "journal_entries_own" ON journal_entries;
DROP POLICY IF EXISTS "plans_own" ON plans;

DROP POLICY IF EXISTS "messages_own" ON messages;
CREATE POLICY "messages_own" ON messages FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "streaks_own" ON streaks;
CREATE POLICY "streaks_own" ON streaks FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "journal_entries_own" ON journal_entries;
CREATE POLICY "journal_entries_own" ON journal_entries FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "plans_own" ON plans;
CREATE POLICY "plans_own" ON plans FOR ALL USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, COALESCE(NEW.email, ''), COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
`;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (token !== "libero-migrate-setup-2024") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

  if (!supabaseUrl || !accessToken) {
    return NextResponse.json(
      {
        error: "Missing env vars",
        need: "SUPABASE_ACCESS_TOKEN (personal token from supabase.com/dashboard/account/tokens) and NEXT_PUBLIC_SUPABASE_URL",
        supabaseUrlSet: !!supabaseUrl,
        accessTokenSet: !!accessToken,
      },
      { status: 500 }
    );
  }

  // Extract project ref from URL: https://[ref].supabase.co
  const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!match) {
    return NextResponse.json({ error: "Invalid SUPABASE_URL format" }, { status: 500 });
  }
  const projectRef = match[1];

  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: MIGRATION_SQL }),
  });

  const body = await res.text();

  if (!res.ok) {
    return NextResponse.json(
      { error: "Migration failed", status: res.status, detail: body },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: "Migration completed! Libero is ready.", project: projectRef });
}
