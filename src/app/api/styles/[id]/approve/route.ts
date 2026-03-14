import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/database/prismaClient';
import { awardCredits } from '@/lib/services/creditService';

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

    const styleId = params.id;

    // Verify ownership
    const style = await prisma.style.findUnique({
      where: { id: styleId }
    });

    if (!style || style.owner_id !== user.id) {
      return NextResponse.json({ message: 'Style not found' }, { status: 404 });
    }

    // Mark as ready
    await prisma.style.update({
      where: { id: styleId },
      data: { training_status: 'ready' }
    });

    // Award bonus for training style
    await awardCredits({
      profileId: user.id,
      amount: 20,
      sourceType: 'style_training_bonus',
      sourceId: styleId
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Approve style error:', error);
    return NextResponse.json({ message: 'Failed to approve style' }, { status: 500 });
  }
}
