import { NextResponse } from 'next/server';
import { getServerSession } from '@supabase/auth-helpers-nextjs';
import { applyContinuityFix } from '@/lib/services/continuityGuardService';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const issueId = params.id;
    const { selectedFix } = await request.json();

    // Apply the fix
    const result = await applyContinuityFix(
      session.user.id,
      issueId,
      selectedFix
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Apply continuity fix error:', error);
    return NextResponse.json({ error: 'Failed to apply continuity fix' }, { status: 500 });
  }
}
