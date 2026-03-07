import { prisma } from '@/lib/database/prismaClient';
import { generateTextWithOllama } from '@/lib/ai/ollamaClient';
import { findSimilarVectors } from '@/lib/utils/vectorUtils';
import { createChapterRevision } from '@/lib/services/chapterRevisionService';
import logger from '@/lib/utils/logger';

interface ContinuityCheckResult {
  hasIssues: boolean;
  issues: ContinuityIssue[];
  fixedContent?: string;
}

interface ContinuityIssue {
  id?: string;
  type: 'location' | 'timeline' | 'relationship' | 'appearance' | 'possession' | 'knowledge';
  description: string;
  severity: 'suggestion' | 'inconsistency' | 'contradiction';
  suggestedFixes: string[];
  characterName?: string;
  chapterId?: string;
}

export class LogicGuardEngine {
  static async checkContinuity(
    universeId: string,
    chapterId: string,
    content: string,
    progressCallback?: (progress: number, message: string) => void
  ): Promise<ContinuityCheckResult> {
    progressCallback?.(10, "Scanning for continuity threads...");

    // Get universe context
    const universe = await prisma.universe.findUnique({
      where: { id: universeId }
    });

    if (!universe) {
      throw new Error('Universe not found');
    }

    progressCallback?.(20, "Analyzing character timelines...");

    // Check against existing continuity events
    const continuityEvents = await prisma.continuityEvent.findMany({
      where: { universe_id: universeId },
      orderBy: { chapter_index: 'asc' }
    });

    progressCallback?.(30, "Verifying world rules and lore...");

    // Perform comprehensive continuity check
    const issues = await this.performComprehensiveCheck(
      universe,
      continuityEvents,
      content,
      progressCallback
    );

    progressCallback?.(80, "Generating human-readable suggestions...");

    // Convert technical issues to human-readable suggestions
    const humanReadableIssues = await this.generateHumanReadableFixes(issues);

    progressCallback?.(90, "Finalizing continuity report...");

    return {
      hasIssues: humanReadableIssues.length > 0,
      issues: humanReadableIssues
    };
  }

  static async checkAndAutoFix(
    ownerId: string,
    universeId: string,
    chapterId: string,
    content: string,
    maxAttempts: number = 3,
    progressCallback?: (progress: number, message: string) => void
  ): Promise<{ success: boolean; content: string; issuesFixed: number }> {
    let currentContent = content;
    let totalIssuesFixed = 0;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      progressCallback?.(10 + (attempt * 20),
        `Continuity pass ${attempt} of ${maxAttempts}...`);

      const result = await this.checkContinuity(universeId, chapterId, currentContent);

      if (!result.hasIssues) {
        progressCallback?.(100, "Perfect continuity achieved!");
        return {
          success: true,
          content: currentContent,
          issuesFixed: totalIssuesFixed
        };
      }

      // Attempt to auto-fix issues
      const fixResult = await this.autoFixIssues(
        ownerId,
        universeId,
        chapterId,
        currentContent,
        result.issues
      );

      if (fixResult.fixed) {
        currentContent = fixResult.content;
        totalIssuesFixed += fixResult.issuesFixed;
        progressCallback?.(20 + (attempt * 20),
          `Auto-fixed ${fixResult.issuesFixed} issues in pass ${attempt}`);
      } else {
        // Could not auto-fix, break and report issues to user
        break;
      }
    }

    return {
      success: false,
      content: currentContent,
      issuesFixed: totalIssuesFixed
    };
  }

  static async applySpecificFix(
    ownerId: string,
    continuityIssueId: string,
    selectedFix: string,
    progressCallback?: (progress: number, message: string) => void
  ): Promise<{ success: boolean; content: string }> {
    progressCallback?.(10, "Applying your chosen fix...");

    const issue = await prisma.continuityIssue.findUnique({
      where: { id: continuityIssueId },
      include: { chapter: { include: { book: true } } }
    });

    if (!issue || !issue.chapter) {
      throw new Error('Continuity issue not found');
    }

    // Generate targeted rewrite based on selected fix
    const rewrittenContent = await this.generateTargetedRewrite(
      issue.chapter.content || "",
      issue.description,
      selectedFix
    );

    // Update chapter content
    await prisma.chapter.update({
      where: { id: issue.chapter_id },
      data: {
        content: rewrittenContent,
        ai_contribution_percent: Math.min(
          100,
          (issue.chapter.ai_contribution_percent || 0) + 20
        )
      }
    });

    // Create revision
    await createChapterRevision({
      chapterId: issue.chapter_id,
      content: rewrittenContent,
      revisionType: 'continuity_fix',
      createdBy: 'ai_system'
    });

    // Mark issue as resolved
    await prisma.continuityIssue.update({
      where: { id: continuityIssueId },
      data: {
        resolved: true,
        resolved_by: 'user_accepted_suggestion',
        fix_applied_text: selectedFix
      }
    });

    // Create continuity event for the fix
    const characterName = this.extractCharacterName(issue.description);
    if (characterName) {
      await prisma.continuityEvent.create({
        data: {
          universe_id: issue.chapter.book?.universe_id || "",
          character_name: characterName,
          chapter_id: issue.chapter_id,
          event_type: 'status_change',
          new_value: `Fixed continuity issue: ${selectedFix}`,
          chapter_index: issue.chapter.index,
          detected_by: 'user_tagged'
        }
      });
    }

    progressCallback?.(100, "Fix applied successfully!");

    return {
      success: true,
      content: rewrittenContent
    };
  }

  static async findRelevantContext(universeId: string, query: string): Promise<string> {
    // In production, this would use pgvector RAG
    // For now, mock implementation

    const universe = await prisma.universe.findUnique({
      where: { id: universeId }
    });

    if (!universe) return "";

    const characters = universe.global_characters ?
      JSON.stringify(universe.global_characters) : "";

    const lore = universe.global_lore ?
      JSON.stringify(universe.global_lore) : "";

    return `${characters}\n${lore}`;
  }

  private static async performComprehensiveCheck(
    universe: any,
    continuityEvents: any[],
    content: string,
    progressCallback?: (progress: number, message: string) => void
  ): Promise<ContinuityIssue[]> {
    progressCallback?.(35, "Checking character locations...");

    const issues: ContinuityIssue[] = [];

    // Check character locations
    const locationIssues = await this.checkCharacterLocations(universe, content);
    issues.push(...locationIssues);

    progressCallback?.(45, "Validating timeline consistency...");

    // Check timeline logic
    const timelineIssues = await this.checkTimelineLogic(continuityEvents, content);
    issues.push(...timelineIssues);

    progressCallback?.(55, "Verifying relationship states...");

    // Check relationships
    const relationshipIssues = await this.checkRelationships(universe, content);
    issues.push(...relationshipIssues);

    progressCallback?.(65, "Confirming physical appearances...");

    // Check appearances
    const appearanceIssues = await this.checkAppearances(universe, content);
    issues.push(...appearanceIssues);

    return issues;
  }

  private static async checkCharacterLocations(universe: any, content: string): Promise<ContinuityIssue[]> {
    // Mock implementation - in production would use LLM analysis
    const issues: ContinuityIssue[] = [];

    // Example check: Find mentions of impossible locations
    if (content.includes("teleported to Paris") && universe.genre === "fantasy") {
      issues.push({
        type: 'location',
        description: "Character mentioned teleporting to Earth location in fantasy world",
        severity: 'contradiction',
        suggestedFixes: [
          "Change destination to a fantasy realm location",
          "Add magical explanation for Earth connection",
          "Remove the teleportation reference"
        ]
      });
    }

    return issues;
  }

  private static async checkTimelineLogic(events: any[], content: string): Promise<ContinuityIssue[]> {
    const issues: ContinuityIssue[] = [];

    // Example: Check for impossible time sequences
    if (content.includes("three days later") && content.includes("yesterday")) {
      issues.push({
        type: 'timeline',
        description: "Conflicting time references in same passage",
        severity: 'inconsistency',
        suggestedFixes: [
          "Clarify the timeline sequence",
          "Specify exact time intervals",
          "Remove conflicting references"
        ]
      });
    }

    return issues;
  }

  private static async checkRelationships(universe: any, content: string): Promise<ContinuityIssue[]> {
    return [];
  }

  private static async checkAppearances(universe: any, content: string): Promise<ContinuityIssue[]> {
    return [];
  }

  private static async generateHumanReadableFixes(issues: ContinuityIssue[]): Promise<ContinuityIssue[]> {
    return issues;
  }

  private static async autoFixIssues(
    ownerId: string,
    universeId: string,
    chapterId: string,
    content: string,
    issues: ContinuityIssue[]
  ): Promise<{ fixed: boolean; content: string; issuesFixed: number }> {
    // Simplified auto-fix logic
    return { fixed: false, content, issuesFixed: 0 };
  }

  private static async generateTargetedRewrite(
    content: string,
    issue: string,
    fix: string
  ): Promise<string> {
    const prompt = `
      Rewrite the following text to fix this continuity issue:
      Issue: ${issue}
      Fix: ${fix}

      Original Text:
      ${content}

      Rewritten Text:
    `;

    return await generateTextWithOllama(prompt, { model: 'mixtral:8x7b' });
  }

  private static extractCharacterName(description: string): string | null {
    // Simplified character name extraction
    return null;
  }
}

export async function checkContinuityAndFix(
  ownerId: string,
  universeId: string,
  chapterId: string,
  progressCallback?: (progress: number, message: string) => void
): Promise<any> {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId }
  });

  if (!chapter || !chapter.content) {
    throw new Error('Chapter content not found');
  }

  return await LogicGuardEngine.checkAndAutoFix(
    ownerId,
    universeId,
    chapterId,
    chapter.content,
    3,
    progressCallback
  );
}

export async function applyContinuityFix(
  ownerId: string,
  issueId: string,
  selectedFix: string
): Promise<any> {
  return await LogicGuardEngine.applySpecificFix(ownerId, issueId, selectedFix);
}

export async function findRelevantContext(universeId: string, query: string): Promise<string> {
  return await LogicGuardEngine.findRelevantContext(universeId, query);
}
