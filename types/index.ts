// ============================================
// PIPPY APP - COMPLETE TYPE DEFINITIONS
// ============================================

// ---- Core Types ----
export type PippyMood = 'happy' | 'sleepy' | 'proud' | 'worried' | 'excited' | 'cozy' | 'sad';

export type PippyOutfit = {
  id: string;
  name: string;
  image: any; // require() image
  price: number;
  category: 'hat' | 'accessory' | 'costume' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string; // date string if owned
};

export type RoomItem = {
  id: string;
  name: string;
  image: any;
  price: number;
  category: 'furniture' | 'decoration' | 'plant' | 'lighting';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  position?: { x: number; y: number };
  unlockedAt?: string;
};

export type Background = {
  id: string;
  name: string;
  image: any;
  price: number;
  theme: 'cozy' | 'nature' | 'night' | 'seasonal' | 'special';
  unlockedAt?: string;
};

// ---- Daily State ----
export interface DailyState {
  date: string;
  water: number;
  ironTaken: boolean;
  pillDismissed: boolean;
  moodCheckin?: MoodCheckin;
  journalEntry?: string;
  completedQuests: string[];
}

export interface MoodCheckin {
  mood: 1 | 2 | 3 | 4 | 5; // 1 = terrible, 5 = great
  feelings: string[];
  note?: string;
  timestamp: string;
}

// ---- User Settings ----
export interface UserSettings {
  name: string;
  waterGoal: number;
  pillReminderTime: string;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

// ---- Currency & Shop ----
export interface WalletState {
  starGems: number; // Primary currency
  totalEarned: number;
  lastDailyBonus?: string; // date string
}

export interface ShopState {
  ownedOutfits: string[]; // outfit IDs
  ownedRoomItems: string[];
  ownedBackgrounds: string[];
  equippedOutfit?: string;
  equippedBackground: string;
  placedRoomItems: { itemId: string; x: number; y: number }[];
}

// ---- Achievements & Progress ----
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'water' | 'iron' | 'pill' | 'streak' | 'social' | 'special';
  requirement: number;
  reward: number; // star gems
  unlockedAt?: string;
}

export interface StreakData {
  current: number;
  longest: number;
  lastCheckIn?: string;
  freezesAvailable: number;
  isFrozen: boolean;
}

// ---- Quests & Adventures ----
export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'daily' | 'weekly' | 'special';
  requirements: QuestRequirement[];
  reward: number;
  expiresAt?: string;
  completedAt?: string;
}

export interface QuestRequirement {
  type: 'water' | 'iron' | 'pill' | 'mood' | 'journal' | 'streak';
  target: number;
  current: number;
}

export interface Adventure {
  id: string;
  name: string;
  description: string;
  image: any;
  duration: number; // minutes
  rewards: { starGems: number; item?: string };
  requiredLevel: number;
  startedAt?: string;
  completedAt?: string;
}

// ---- Pippy Growth ----
export type PippyStage = 'baby' | 'child' | 'teen' | 'adult';

export interface PippyState {
  name: string;
  stage: PippyStage;
  experience: number;
  level: number;
  happiness: number; // 0-100
  energy: number; // 0-100
  currentMood: PippyMood;
  currentAdventure?: Adventure;
}

// ---- Stats ----
export interface WeeklyStats {
  date: string;
  water: number;
  ironTaken: boolean;
  pillDismissed: boolean;
  mood?: number;
  questsCompleted: number;
  starGemsEarned: number;
}

// ---- Gift Box ----
export interface DailyGift {
  id: string;
  day: number; // 1-7 for weekly cycle
  reward: {
    type: 'starGems' | 'outfit' | 'item' | 'freeze';
    value: number | string;
  };
  claimed: boolean;
}

// ---- Reflection Prompts ----
export interface ReflectionPrompt {
  id: string;
  category: 'gratitude' | 'growth' | 'selfcare' | 'mindfulness';
  prompt: string;
  followUp?: string;
}
