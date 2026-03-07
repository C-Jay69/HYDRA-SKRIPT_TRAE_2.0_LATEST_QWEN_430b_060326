import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // Create default prompts
  await prisma.generationPrompt.createMany({
    data: [
      {
        prompt_type: 'chapter_generation',
        template: 'You are an AI writing assistant... {{context}}... {{style}}...',
        style_adaptable: true,
        is_system_default: true
      },
      {
        prompt_type: 'style_analysis',
        template: 'Analyze the following writing samples for style, tone, and patterns... {{samples}}...',
        style_adaptable: false,
        is_system_default: true
      },
      {
        prompt_type: 'continuity_check',
        template: 'Check this text for continuity errors against the following lore and character facts... {{lore}}... {{text}}...',
        style_adaptable: false,
        is_system_default: true
      }
    ]
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
