import { NextResponse } from 'next/server';
import { getServerSession } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/database/prismaClient';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: session.user.id }
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check onboarding steps completion
    const universeCount = await prisma.universe.count({
      where: { owner_id: session.user.id }
    });

    const styleCount = await prisma.style.count({
      where: { owner_id: session.user.id }
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
    return NextResponse.json({ error: 'Failed to fetch onboarding status' }, { status: 500 });
  }
}
