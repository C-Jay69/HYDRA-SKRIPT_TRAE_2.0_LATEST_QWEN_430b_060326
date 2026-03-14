import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

/**
 * Creates a Supabase admin client for server-side operations
 * that bypass RLS policies (using service role key).
 */
export function getServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Creates a Supabase client scoped to a specific user
 * for operations that should respect RLS policies.
 */
export function getUserScopedClient(accessToken: string) {
  return createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '', {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

/**
 * SQL for RLS policies - to be run during initial setup.
 * These ensure data isolation between users.
 */
export const RLS_POLICIES = `
-- Enable RLS on all tables
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Job" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CreditTransaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Universe" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Book" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Chapter" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Style" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "StyleTrainingJob" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContinuityEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContinuityIssue" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CreditEarningActivity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChapterRevision" ENABLE ROW LEVEL SECURITY;

-- Profile: users can only see/edit their own profile
CREATE POLICY "profiles_own" ON "Profile"
  FOR ALL USING (id = auth.uid()::text);

-- Jobs: users can only see their own jobs
CREATE POLICY "jobs_own" ON "Job"
  FOR ALL USING (owner_id = auth.uid()::text);

-- CreditTransactions: users can only see their own
CREATE POLICY "credit_tx_own" ON "CreditTransaction"
  FOR ALL USING (profile_id = auth.uid()::text);

-- Universes: own or public
CREATE POLICY "universes_own_or_public" ON "Universe"
  FOR SELECT USING (owner_id = auth.uid()::text OR is_public = true);
CREATE POLICY "universes_own_write" ON "Universe"
  FOR ALL USING (owner_id = auth.uid()::text);

-- Books: users can only see their own
CREATE POLICY "books_own" ON "Book"
  FOR ALL USING (owner_id = auth.uid()::text);

-- Chapters: users can only see their own
CREATE POLICY "chapters_own" ON "Chapter"
  FOR ALL USING (owner_id = auth.uid()::text);

-- Styles: users can only see their own
CREATE POLICY "styles_own" ON "Style"
  FOR ALL USING (owner_id = auth.uid()::text);
`;
