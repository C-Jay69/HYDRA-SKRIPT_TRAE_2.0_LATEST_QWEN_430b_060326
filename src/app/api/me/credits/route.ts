import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCreditContext } from '@/lib/services/creditService';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ message: 'Please sign in to continue' }, { status: 401 });
    }

    const context = await getCreditContext(user.id);

    // Add estimated costs for common operations
    const extendedContext = {
      ...context,
      estimatedCosts: {
        chapterGeneration: (wordCount: number) => 10 + Math.ceil(wordCount / 500),
        styleTraining: 15,
        continuityScan: 3,
        audiobookGeneration: (wordCount: number) => 50 + Math.ceil(wordCount / 1000)
      }
    };

    return NextResponse.json(extendedContext);
  } catch (error) {
    console.error('Get credit context error:', error);
    return NextResponse.json({ message: 'Failed to fetch credit context' }, { status: 500 });
  }
}
