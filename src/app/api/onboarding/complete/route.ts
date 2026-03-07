import { NextResponse } from 'next/server';
import { getServerSession } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/database/prismaClient';
import { awardCredits } from '@/lib/services/creditService';

export async function POST() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mark onboarding as completed
    await prisma.profile.update({
      where: { id: session.user.id },
      data: { onboarding_completed: true }
    });

    // Award welcome credits
    await awardCredits({
      profileId: session.user.id,
      amount: 100,
      sourceType: 'welcome_bonus'
    });

    return NextResponse.json({
      success: true,
      message: 'Welcome to HydraSkript!'
    });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    return NextResponse.json({ error: 'Failed to complete onboarding' }, { status: 500 });
  }
}
