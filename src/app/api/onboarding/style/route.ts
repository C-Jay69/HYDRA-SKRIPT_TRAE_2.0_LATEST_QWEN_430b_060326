import { NextResponse } from 'next/server';
import { getServerSession } from '@supabase/auth-helpers-nextjs';
import { prisma } from '@/lib/database/prismaClient';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { styleName, styleDescription } = await request.json();

    // Create style record
    const style = await prisma.style.create({
      data: {
        owner_id: session.user.id,
        name: styleName,
        description: styleDescription,
        training_status: 'pending'
      }
    });

    // Generate mock upload URLs (would be real R2 URLs in production)
    const uploadUrls = Array.from({ length: 3 }, (_, i) => ({
      id: uuidv4(),
      url: `https://mock-r2.example.com/upload/${style.id}/sample${i + 1}.txt`,
      fields: { key: `style-training-samples/${style.id}/sample${i + 1}.txt` }
    }));

    return NextResponse.json({
      styleId: style.id,
      uploadUrls
    });
  } catch (error) {
    console.error('Create style error:', error);
    return NextResponse.json({ error: 'Failed to create style' }, { status: 500 });
  }
}
