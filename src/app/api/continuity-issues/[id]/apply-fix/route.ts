import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { applyContinuityFix } from '@/lib/services/continuityGuardService';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: 'Please sign in to continue' }, { status: 401 });
    }

    const issueId = params.id;
    const { selectedFix } = await request.json();

    // Apply the fix
    const result = await applyContinuityFix(
      user.id,
      issueId,
      selectedFix
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Apply continuity fix error:', error);
    return NextResponse.json({ message: 'Failed to apply continuity fix' }, { status: 500 });
  }
}
