export function formatJobStatus(status: string): string {
  switch (status) {
    case 'queued': return 'Waiting in queue...';
    case 'processing': return 'In progress...';
    case 'completed': return 'Finished successfully!';
    case 'failed': return 'Something went wrong.';
    case 'cancelled': return 'Job cancelled.';
    default: return status;
  }
}

export function formatProgressMessage(percent: number, message?: string): string {
  if (message) return message;
  return `Processing... ${Math.round(percent)}%`;
}

export function formatEta(seconds?: number): string {
  if (!seconds) return 'Calculating...';
  if (seconds < 60) return `${seconds} seconds`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}
