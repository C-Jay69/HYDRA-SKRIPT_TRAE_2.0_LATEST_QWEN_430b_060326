import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/database/prismaClient';
import { awardCredits } from '@/lib/services/creditService';

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: 'Please sign in to continue' }, { status: 401 });
    }

    // Mark onboarding as completed
    await prisma.profile.update({
      where: { id: user.id },
      data: { onboarding_completed: true }
    });

    // Award welcome credits
    await awardCredits({
      profileId: user.id,
      amount: 100,
      sourceType: 'welcome_bonus'
    });

    return NextResponse.json({
      success: true,
      message: 'Welcome to HydraSkript!'
    });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    return NextResponse.json({ message: 'Failed to complete onboarding' }, { status: 500 });
  }
}
