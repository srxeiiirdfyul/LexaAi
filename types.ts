
export enum UserTier {
  GUEST = 'guest',
  FREE = 'free',
  PRO = 'pro',
}

export interface User {
  isLoggedIn: boolean;
  tier: UserTier;
}

export enum ChatMessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system',
}

export interface ChatMessage {
  role: ChatMessageRole;
  text: string;
  images?: string[];
}
