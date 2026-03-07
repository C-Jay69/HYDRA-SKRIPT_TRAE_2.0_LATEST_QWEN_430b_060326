import { NextResponse } from 'next/server';
import { getServerSession } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/database/prismaClient';
import { generateValidationSample } from '@/lib/services/styleTrainingService';

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

    // Generate validation sample
    const sample = await generateValidationSample(styleId, 500);

    return NextResponse.json({ sample });
  } catch (error) {
    console.error('Validate style error:', error);
    return NextResponse.json({ error: 'Failed to generate validation sample' }, { status: 500 });
  }
}
