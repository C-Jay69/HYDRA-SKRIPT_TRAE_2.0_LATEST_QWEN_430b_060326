import { prisma } from '@/lib/database/prismaClient';

interface AwardCreditsInput {
  profileId: string;
  amount: number;
  sourceType: string;
  sourceId?: string;
}

export async function awardCredits(input: AwardCreditsInput): Promise<any> {
  return await prisma.$transaction(async (tx) => {
    // Get current profile
    const profile = await tx.profile.findUnique({
      where: { id: input.profileId }
    });

    if (!profile) throw new Error('Profile not found');

    // Create transaction
    const transaction = await tx.creditTransaction.create({
      data: {
        profile_id: input.profileId,
        amount: input.amount,
        source_type: input.sourceType,
        source_id: input.sourceId,
        balance_after: profile.credit_balance + input.amount
      }
    });

    // Update profile balance
    await tx.profile.update({
      where: { id: input.profileId },
      data: {
        credit_balance: { increment: input.amount },
        lifetime_credits_earned: { increment: input.amount > 0 ? input.amount : 0 }
      }
    });

    return transaction;
  });
}

export async function deductCredits(
  profileId: string,
  amount: number,
  jobId?: string
): Promise<any> {
  return await prisma.$transaction(async (tx) => {
    const profile = await tx.profile.findUnique({
      where: { id: profileId }
    });

    if (!profile) throw new Error('Profile not found');
    if (profile.credit_balance < amount) throw new Error('Insufficient credits');

    const transaction = await tx.creditTransaction.create({
      data: {
        profile_id: profileId,
        amount: -amount,
        source_type: 'job_spend',
        source_id: jobId,
        balance_after: profile.credit_balance - amount
      }
    });

    await tx.profile.update({
      where: { id: profileId },
      data: {
        credit_balance: { decrement: amount }
      }
    });

    return transaction;
  });
}

export async function refundCredits(
  profileId: string,
  amount: number,
  jobId: string
): Promise<any> {
  return await awardCredits({
    profileId,
    amount,
    sourceType: 'job_refund',
    sourceId: jobId
  });
}

export async function getCreditContext(profileId: string): Promise<any> {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId }
  });

  if (!profile) throw new Error('Profile not found');

  const recentTransactions = await prisma.creditTransaction.findMany({
    where: { profile_id: profileId },
    orderBy: { created_at: 'desc' },
    take: 20
  });

  const availableEarningActivities = await prisma.creditEarningActivity.findMany({
    where: { profile_id: profileId, is_active: true }
  });

  return {
    balance: profile.credit_balance,
    recentTransactions,
    availableEarningActivities
  };
}

export async function checkAndAwardCredits(
  profileId: string,
  activityType: string
): Promise<number> {
  const activity = await prisma.creditEarningActivity.findFirst({
    where: { profile_id: profileId, activity_type: activityType, is_active: true }
  });

  if (!activity) return 0;

  // Simplified check - in production would verify thresholds and cooldowns
  await awardCredits({
    profileId,
    amount: activity.credit_reward,
    sourceType: activityType
  });

  return activity.credit_reward;
}
