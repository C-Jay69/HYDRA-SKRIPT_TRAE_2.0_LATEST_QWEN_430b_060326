import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/database/prismaClient';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: 'Please sign in to continue' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.id }
    });

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    // Check onboarding steps completion
    const universeCount = await prisma.universe.count({
      where: { owner_id: user.id }
    });

    const styleCount = await prisma.style.count({
      where: { owner_id: user.id }
    });

    const checklist = {
      completed: profile.onboarding_completed,
      steps: {
        profileCreated: !!profile,
        universeCreated: universeCount > 0,
        styleTrained: styleCount > 0,
        firstChapterWritten: false // Would check for actual chapters
      }
    };

    return NextResponse.json(checklist);
  } catch (error) {
    console.error('Get onboarding status error:', error);
    return NextResponse.json({ message: 'Failed to fetch onboarding status' }, { status: 500 });
  }
}
