export interface Profile {
  id: string;
  subscription_tier: 'starter' | 'author' | 'pro';
  credit_balance: number;
  onboarding_completed: boolean;
  default_style_id?: string;
}

export interface Universe {
  id: string;
  owner_id: string;
  title: string;
  description?: string;
  genre?: string;
  tone?: string;
  global_lore?: any;
  global_characters?: any;
}

export interface Book {
  id: string;
  universe_id: string;
  title: string;
  status: 'planning' | 'drafting' | 'revising' | 'completed';
}

export interface Chapter {
  id: string;
  book_id: string;
  index: number;
  title?: string;
  content?: string;
  word_count: number;
}

export interface Style {
  id: string;
  owner_id: string;
  name: string;
  training_status: 'pending' | 'training' | 'ready' | 'failed';
}

export interface Job {
  id: string;
  owner_id: string;
  type: 'chapter_generation' | 'style_training' | 'continuity_check' | 'audiobook_generation';
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress_percent: number;
  progress_context_message?: string;
}
