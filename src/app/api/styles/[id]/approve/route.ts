import { NextResponse } from 'next/server';
import { getServerSession } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/database/prismaClient';
import { awardCredits } from '@/lib/services/creditService';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const styleId = params.id;

    // Verify ownership
    const style = await prisma.style.findUnique({
      where: { id: styleId }
    });

    if (!style || style.owner_id !== session.user.id) {
      return NextResponse.json({ error: 'Style not found' }, { status: 404 });
    }

    // Mark as ready
    await prisma.style.update({
      where: { id: styleId },
      data: { training_status: 'ready' }
    });

    // Award bonus for training style
    await awardCredits({
      profileId: session.user.id,
      amount: 20,
      sourceType: 'style_training_bonus',
      sourceId: styleId
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Approve style error:', error);
    return NextResponse.json({ error: 'Failed to approve style' }, { status: 500 });
  }
}
