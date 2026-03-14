import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial data...');

  // Seed CreditEarningActivities (system-level, no profile_id needed in V1)
  // Note: In the current schema, profile_id is required. These are templates
  // that get cloned per-user during onboarding. For seed, we create generation prompts.

  // Create default generation prompts
  await prisma.generationPrompt.upsert({
    where: { id: 'default-chapter-gen' },
    update: {},
    create: {
      id: 'default-chapter-gen',
      prompt_type: 'chapter_start',
      template: `You are an AI writing assistant helping an author continue their story.
Write in EXACTLY the same style as the author, using their unique voice.

AUTHOR'S STYLE PROFILE:
- Preferred POV: {{pov_preference}}
- Tense: {{tense_preference}}
- Average sentence length: {{sentence_length_avg}}
- Dialogue ratio: {{dialogue_ratio}}%
- Complexity level: {{complexity_score}}
- Favorite phrases: {{favorite_phrases}}

STORY CONTEXT:
{{universe_context}}

CHAPTER DIRECTION:
{{direction}}

TARGET LENGTH: Approximately {{target_word_count}} words

Begin writing now:`,
      style_adaptable: true,
      is_system_default: true,
    },
  });

  await prisma.generationPrompt.upsert({
    where: { id: 'default-chapter-continue' },
    update: {},
    create: {
      id: 'default-chapter-continue',
      prompt_type: 'chapter_continuation',
      template: `Continue this story from the last paragraph, maintaining the same style and voice:

PREVIOUS CONTENT:
{{previous_content}}

STYLE GUIDE:
{{style_guide}}

Continue naturally:`,
      style_adaptable: true,
      is_system_default: true,
    },
  });

  await prisma.generationPrompt.upsert({
    where: { id: 'default-scene-expand' },
    update: {},
    create: {
      id: 'default-scene-expand',
      prompt_type: 'scene_expansion',
      template: `Expand this scene with richer detail, maintaining the author's voice:

ORIGINAL SCENE:
{{scene_text}}

STYLE GUIDE:
{{style_guide}}

Expanded version:`,
      style_adaptable: true,
      is_system_default: true,
    },
  });

  await prisma.generationPrompt.upsert({
    where: { id: 'default-dialogue-enhance' },
    update: {},
    create: {
      id: 'default-dialogue-enhance',
      prompt_type: 'dialogue_enhancement',
      template: `Add natural, character-appropriate dialogue to this passage:

PASSAGE:
{{passage_text}}

CHARACTERS PRESENT:
{{characters}}

STYLE GUIDE:
{{style_guide}}

Enhanced with dialogue:`,
      style_adaptable: true,
      is_system_default: true,
    },
  });

  await prisma.generationPrompt.upsert({
    where: { id: 'default-description-deepen' },
    update: {},
    create: {
      id: 'default-description-deepen',
      prompt_type: 'description_deepening',
      template: `Deepen the descriptive details in this passage, engaging more senses:

PASSAGE:
{{passage_text}}

SETTING:
{{setting_context}}

STYLE GUIDE:
{{style_guide}}

Enriched description:`,
      style_adaptable: true,
      is_system_default: true,
    },
  });

  await prisma.generationPrompt.upsert({
    where: { id: 'default-style-analysis' },
    update: {},
    create: {
      id: 'default-style-analysis',
      prompt_type: 'chapter_start',
      template: `Analyze the following writing samples for:
1. Sentence structure patterns (average length, complexity, variation)
2. Vocabulary profile (richness, recurring words, sophistication level)
3. Dialogue characteristics (frequency, natural vs formal, tag usage)
4. Pacing (scene length, action vs reflection balance)
5. POV consistency
6. Tense usage
7. Paragraph structure
8. Favorite phrases or recurring stylistic elements

WRITING SAMPLES:
{{samples}}

Return a detailed JSON analysis:`,
      style_adaptable: false,
      is_system_default: true,
    },
  });

  await prisma.generationPrompt.upsert({
    where: { id: 'default-continuity-check' },
    update: {},
    create: {
      id: 'default-continuity-check',
      prompt_type: 'chapter_start',
      template: `Check this text for continuity issues against the established lore and character facts.

UNIVERSE LORE:
{{lore}}

CHARACTER FACTS:
{{characters}}

PREVIOUS EVENTS:
{{events}}

NEW TEXT TO CHECK:
{{text}}

List any inconsistencies found as JSON array with fields: type, description, severity, suggestedFixes`,
      style_adaptable: false,
      is_system_default: true,
    },
  });

  console.log('✅ Generation prompts seeded');
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
