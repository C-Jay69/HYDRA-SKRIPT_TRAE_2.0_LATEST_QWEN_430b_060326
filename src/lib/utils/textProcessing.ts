export function calculateWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function cleanText(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function extractChapterTitle(content: string): string {
  const lines = content.split('\n');
  const firstLine = lines[0].trim();
  if (firstLine.startsWith('#')) {
    return firstLine.replace(/^#+\s*/, '');
  }
  return truncateText(firstLine, 50);
}
