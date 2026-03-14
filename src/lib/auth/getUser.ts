import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * Gets the authenticated user from the Supabase session.
 * Returns null if not authenticated.
 */
export async function getAuthUser() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Helper to return 401 response if not authenticated
 */
export async function requireAuth() {
  const user = await getAuthUser();
  if (!user) {
    return { user: null, error: new Response(JSON.stringify({ message: 'Please sign in to continue' }), { status: 401 }) };
  }
  return { user, error: null };
}
