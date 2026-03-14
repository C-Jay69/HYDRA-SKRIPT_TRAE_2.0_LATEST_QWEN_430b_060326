import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/database/prismaClient';
import { generateValidationSample } from '@/lib/services/styleTrainingService';

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

    // Generate validation sample
    const sample = await generateValidationSample(styleId, 500);

    return NextResponse.json({ sample });
  } catch (error) {
    console.error('Validate style error:', error);
    return NextResponse.json({ message: 'Failed to generate validation sample' }, { status: 500 });
  }
}
