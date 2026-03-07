import { prisma } from '@/lib/database/prismaClient';
import { awardCredits } from './creditService';

export async function trackActivity(
  profileId: string,
  activityType: string,
  metadata?: any
): Promise<any> {
  const activity = await prisma.creditEarningActivity.findFirst({
    where: { profile_id: profileId, activity_type: activityType, is_active: true }
  });

  if (!activity) return null;

  // Verify requirements (simplified for V1)
  const isEligible = await verifyRequirements(profileId, activity, metadata);

  if (isEligible) {
    return await awardCredits({
      profileId,
      amount: activity.credit_reward,
      sourceType: activityType,
      sourceId: metadata?.sourceId
    });
  }

  return null;
}

async function verifyRequirements(
  profileId: string,
  activity: any,
  metadata?: any
): Promise<boolean> {
  // Simplified verification logic
  switch (activity.activity_type) {
    case 'daily_writing':
      return (metadata?.wordCount || 0) >= 500;
    case 'style_training':
      return metadata?.styleTrained === true;
    case 'first_generation':
      return metadata?.chapterGenerated === true;
    default:
      return true;
  }
}
