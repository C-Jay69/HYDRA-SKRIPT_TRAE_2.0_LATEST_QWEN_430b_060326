import { NextResponse } from 'next/server';
import { getServerSession } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/database/prismaClient';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const styles = await prisma.style.findMany({
      where: { owner_id: session.user.id },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json(styles);
  } catch (error) {
    console.error('Get styles error:', error);
    return NextResponse.json({ error: 'Failed to fetch styles' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description } = await request.json();

    const style = await prisma.style.create({
      data: {
        owner_id: session.user.id,
        name,
        description,
        training_status: 'pending'
      }
    });

    return NextResponse.json(style);
  } catch (error) {
    console.error('Create style error:', error);
    return NextResponse.json({ error: 'Failed to create style' }, { status: 500 });
  }
}
