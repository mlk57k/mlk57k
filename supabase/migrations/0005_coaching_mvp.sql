-- Coaching SaaS MVP schema

-- Profiles table (auto-created by trigger on auth.users insert)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL DEFAULT '',
  full_name TEXT DEFAULT '',
  addiction_type TEXT CHECK (addiction_type IN ('cannabis', 'porn', 'both')),
  severity TEXT CHECK (severity IN ('light', 'moderate', 'severe')),
  triggers TEXT[] DEFAULT '{}',
  motivation TEXT DEFAULT '',
  frequency TEXT DEFAULT '',
  duration_label TEXT DEFAULT '',
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'trial'
    CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'past_due')),
  subscription_id TEXT,
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS messages_user_created ON messages(user_id, created_at);

-- Streaks
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

-- Journal entries
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

-- Personalized plans
CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content JSONB NOT NULL DEFAULT '{}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_own" ON profiles;
DROP POLICY IF EXISTS "messages_own" ON messages;
DROP POLICY IF EXISTS "streaks_own" ON streaks;
DROP POLICY IF EXISTS "journal_entries_own" ON journal_entries;
DROP POLICY IF EXISTS "plans_own" ON plans;

CREATE POLICY "profiles_own" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "messages_own" ON messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "streaks_own" ON streaks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "journal_entries_own" ON journal_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "plans_own" ON plans FOR ALL USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
