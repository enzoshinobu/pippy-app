import { PippyOutfit, RoomItem, Background, Achievement, Quest, ReflectionPrompt } from '../types';

// ============================================
// OUTFITS
// ============================================
export const OUTFITS: PippyOutfit[] = [
  // Hats
  { id: 'hat_bow', name: 'Pink Bow', image: null, price: 50, category: 'hat', rarity: 'common' },
  { id: 'hat_flower', name: 'Flower Crown', image: null, price: 100, category: 'hat', rarity: 'rare' },
  { id: 'hat_beret', name: 'Cozy Beret', image: null, price: 75, category: 'hat', rarity: 'common' },
  { id: 'hat_bunny', name: 'Bunny Ears', image: null, price: 150, category: 'hat', rarity: 'rare' },
  { id: 'hat_crown', name: 'Royal Crown', image: null, price: 500, category: 'hat', rarity: 'legendary' },
  
  // Accessories
  { id: 'acc_scarf', name: 'Warm Scarf', image: null, price: 60, category: 'accessory', rarity: 'common' },
  { id: 'acc_glasses', name: 'Round Glasses', image: null, price: 80, category: 'accessory', rarity: 'common' },
  { id: 'acc_necklace', name: 'Star Necklace', image: null, price: 120, category: 'accessory', rarity: 'rare' },
  { id: 'acc_wings', name: 'Fairy Wings', image: null, price: 300, category: 'accessory', rarity: 'epic' },
  
  // Costumes
  { id: 'costume_strawberry', name: 'Strawberry Costume', image: null, price: 200, category: 'costume', rarity: 'rare' },
  { id: 'costume_banana', name: 'Banana Costume', image: null, price: 200, category: 'costume', rarity: 'rare' },
  { id: 'costume_astronaut', name: 'Space Suit', image: null, price: 400, category: 'costume', rarity: 'epic' },
  { id: 'costume_mermaid', name: 'Mermaid Tail', image: null, price: 350, category: 'costume', rarity: 'epic' },
  
  // Special
  { id: 'special_rainbow', name: 'Rainbow Aura', image: null, price: 1000, category: 'special', rarity: 'legendary' },
  { id: 'special_sparkles', name: 'Sparkle Effect', image: null, price: 750, category: 'special', rarity: 'legendary' },
];

// ============================================
// ROOM ITEMS
// ============================================
export const ROOM_ITEMS: RoomItem[] = [
  // Furniture
  { id: 'furn_bed', name: 'Cozy Bed', image: null, price: 100, category: 'furniture', rarity: 'common' },
  { id: 'furn_chair', name: 'Bean Bag', image: null, price: 80, category: 'furniture', rarity: 'common' },
  { id: 'furn_desk', name: 'Study Desk', image: null, price: 150, category: 'furniture', rarity: 'rare' },
  { id: 'furn_bookshelf', name: 'Bookshelf', image: null, price: 120, category: 'furniture', rarity: 'common' },
  { id: 'furn_hammock', name: 'Cloud Hammock', image: null, price: 300, category: 'furniture', rarity: 'epic' },
  
  // Decorations
  { id: 'deco_poster', name: 'Cute Poster', image: null, price: 40, category: 'decoration', rarity: 'common' },
  { id: 'deco_mirror', name: 'Heart Mirror', image: null, price: 90, category: 'decoration', rarity: 'common' },
  { id: 'deco_photos', name: 'Photo Wall', image: null, price: 70, category: 'decoration', rarity: 'common' },
  { id: 'deco_rainbow', name: 'Rainbow Wall', image: null, price: 200, category: 'decoration', rarity: 'rare' },
  { id: 'deco_stars', name: 'Star Ceiling', image: null, price: 250, category: 'decoration', rarity: 'rare' },
  
  // Plants
  { id: 'plant_succulent', name: 'Succulent', image: null, price: 30, category: 'plant', rarity: 'common' },
  { id: 'plant_monstera', name: 'Monstera', image: null, price: 60, category: 'plant', rarity: 'common' },
  { id: 'plant_cherry', name: 'Cherry Blossom', image: null, price: 150, category: 'plant', rarity: 'rare' },
  { id: 'plant_magic', name: 'Magic Tree', image: null, price: 400, category: 'plant', rarity: 'epic' },
  
  // Lighting
  { id: 'light_fairy', name: 'Fairy Lights', image: null, price: 50, category: 'lighting', rarity: 'common' },
  { id: 'light_lamp', name: 'Moon Lamp', image: null, price: 80, category: 'lighting', rarity: 'common' },
  { id: 'light_aurora', name: 'Aurora Lamp', image: null, price: 200, category: 'lighting', rarity: 'rare' },
  { id: 'light_fireflies', name: 'Firefly Jar', image: null, price: 300, category: 'lighting', rarity: 'epic' },
];

// ============================================
// BACKGROUNDS
// ============================================
export const BACKGROUNDS: Background[] = [
  // Cozy
  { id: 'bg_bedroom', name: 'Cozy Bedroom', image: null, price: 0, theme: 'cozy' }, // Default, free
  { id: 'bg_cafe', name: 'Cute Cafe', image: null, price: 150, theme: 'cozy' },
  { id: 'bg_library', name: 'Library Corner', image: null, price: 200, theme: 'cozy' },
  
  // Nature
  { id: 'bg_forest', name: 'Enchanted Forest', image: null, price: 200, theme: 'nature' },
  { id: 'bg_beach', name: 'Sunny Beach', image: null, price: 250, theme: 'nature' },
  { id: 'bg_garden', name: 'Flower Garden', image: null, price: 180, theme: 'nature' },
  { id: 'bg_mountain', name: 'Mountain View', image: null, price: 300, theme: 'nature' },
  
  // Night
  { id: 'bg_stars', name: 'Starry Night', image: null, price: 200, theme: 'night' },
  { id: 'bg_city', name: 'City Lights', image: null, price: 250, theme: 'night' },
  { id: 'bg_aurora', name: 'Northern Lights', image: null, price: 400, theme: 'night' },
  
  // Seasonal
  { id: 'bg_spring', name: 'Cherry Blossoms', image: null, price: 300, theme: 'seasonal' },
  { id: 'bg_summer', name: 'Summer Sunset', image: null, price: 300, theme: 'seasonal' },
  { id: 'bg_autumn', name: 'Autumn Leaves', image: null, price: 300, theme: 'seasonal' },
  { id: 'bg_winter', name: 'Winter Wonderland', image: null, price: 300, theme: 'seasonal' },
  
  // Special
  { id: 'bg_space', name: 'Outer Space', image: null, price: 500, theme: 'special' },
  { id: 'bg_clouds', name: 'Cloud Kingdom', image: null, price: 600, theme: 'special' },
  { id: 'bg_rainbow', name: 'Rainbow Land', image: null, price: 750, theme: 'special' },
];

// ============================================
// ACHIEVEMENTS
// ============================================
export const ACHIEVEMENTS: Achievement[] = [
  // Water
  { id: 'water_first', name: 'First Sip', description: 'Drink your first glass of water', icon: '💧', category: 'water', requirement: 1, reward: 10 },
  { id: 'water_full', name: 'Fully Hydrated', description: 'Complete your water goal for a day', icon: '🌊', category: 'water', requirement: 1, reward: 25 },
  { id: 'water_week', name: 'Water Week', description: 'Complete water goal for 7 days', icon: '🐬', category: 'water', requirement: 7, reward: 100 },
  { id: 'water_month', name: 'Hydration Hero', description: 'Complete water goal for 30 days', icon: '🏊', category: 'water', requirement: 30, reward: 500 },
  
  // Iron
  { id: 'iron_first', name: 'Iron Will', description: 'Take your iron supplement', icon: '💊', category: 'iron', requirement: 1, reward: 10 },
  { id: 'iron_week', name: 'Consistent Care', description: 'Take iron for 7 days', icon: '💪', category: 'iron', requirement: 7, reward: 100 },
  { id: 'iron_month', name: 'Iron Champion', description: 'Take iron for 30 days', icon: '🏆', category: 'iron', requirement: 30, reward: 500 },
  
  // Pill
  { id: 'pill_first', name: 'Reminder Set', description: 'Dismiss your first pill reminder', icon: '🌸', category: 'pill', requirement: 1, reward: 10 },
  { id: 'pill_week', name: 'On Schedule', description: 'Dismiss reminder for 7 days', icon: '📅', category: 'pill', requirement: 7, reward: 100 },
  
  // Streak
  { id: 'streak_3', name: 'Getting Started', description: 'Reach a 3-day streak', icon: '🔥', category: 'streak', requirement: 3, reward: 30 },
  { id: 'streak_7', name: 'Week Warrior', description: 'Reach a 7-day streak', icon: '⭐', category: 'streak', requirement: 7, reward: 75 },
  { id: 'streak_14', name: 'Two Week Champion', description: 'Reach a 14-day streak', icon: '✨', category: 'streak', requirement: 14, reward: 150 },
  { id: 'streak_30', name: 'Monthly Master', description: 'Reach a 30-day streak', icon: '👑', category: 'streak', requirement: 30, reward: 500 },
  { id: 'streak_100', name: 'Legendary', description: 'Reach a 100-day streak', icon: '🌟', category: 'streak', requirement: 100, reward: 2000 },
  
  // Special
  { id: 'special_first_outfit', name: 'Fashion Forward', description: 'Buy your first outfit', icon: '👗', category: 'special', requirement: 1, reward: 25 },
  { id: 'special_decorator', name: 'Interior Designer', description: 'Buy 5 room items', icon: '🏠', category: 'special', requirement: 5, reward: 100 },
  { id: 'special_collector', name: 'Collector', description: 'Own 10 items total', icon: '📦', category: 'special', requirement: 10, reward: 200 },
];

// ============================================
// DAILY QUESTS
// ============================================
export const DAILY_QUESTS: Quest[] = [
  {
    id: 'quest_hydrate',
    title: 'Stay Hydrated',
    description: 'Drink at least 4 glasses of water',
    icon: '💧',
    type: 'daily',
    requirements: [{ type: 'water', target: 4, current: 0 }],
    reward: 15,
  },
  {
    id: 'quest_full_water',
    title: 'Hydration Hero',
    description: 'Complete your full water goal',
    icon: '🌊',
    type: 'daily',
    requirements: [{ type: 'water', target: 8, current: 0 }],
    reward: 30,
  },
  {
    id: 'quest_iron_day',
    title: 'Iron Boost',
    description: 'Take your iron supplement',
    icon: '💊',
    type: 'daily',
    requirements: [{ type: 'iron', target: 1, current: 0 }],
    reward: 20,
  },
  {
    id: 'quest_complete_all',
    title: 'Perfect Day',
    description: 'Complete all your daily tasks',
    icon: '⭐',
    type: 'daily',
    requirements: [
      { type: 'water', target: 8, current: 0 },
      { type: 'iron', target: 1, current: 0 },
      { type: 'pill', target: 1, current: 0 },
    ],
    reward: 50,
  },
  {
    id: 'quest_mood_checkin',
    title: 'Self Reflection',
    description: 'Complete a mood check-in',
    icon: '🪞',
    type: 'daily',
    requirements: [{ type: 'mood', target: 1, current: 0 }],
    reward: 15,
  },
];

// ============================================
// REFLECTION PROMPTS
// ============================================
export const REFLECTION_PROMPTS: ReflectionPrompt[] = [
  // Gratitude
  { id: 'grat_1', category: 'gratitude', prompt: 'What made you smile today?', followUp: 'Even small moments count!' },
  { id: 'grat_2', category: 'gratitude', prompt: 'Name three things you\'re grateful for right now.' },
  { id: 'grat_3', category: 'gratitude', prompt: 'Who is someone you appreciate? Why?' },
  { id: 'grat_4', category: 'gratitude', prompt: 'What\'s something simple that brought you joy recently?' },
  
  // Growth
  { id: 'grow_1', category: 'growth', prompt: 'What\'s something you learned this week?' },
  { id: 'grow_2', category: 'growth', prompt: 'What challenge helped you grow recently?' },
  { id: 'grow_3', category: 'growth', prompt: 'What\'s a small win you can celebrate?' },
  { id: 'grow_4', category: 'growth', prompt: 'What would you tell your past self from a year ago?' },
  
  // Self-care
  { id: 'self_1', category: 'selfcare', prompt: 'How did you take care of yourself today?' },
  { id: 'self_2', category: 'selfcare', prompt: 'What does your body need right now?' },
  { id: 'self_3', category: 'selfcare', prompt: 'What boundaries do you need to set?' },
  { id: 'self_4', category: 'selfcare', prompt: 'What activity recharges you?' },
  
  // Mindfulness
  { id: 'mind_1', category: 'mindfulness', prompt: 'What are you feeling right now? Just notice it.' },
  { id: 'mind_2', category: 'mindfulness', prompt: 'Take 3 deep breaths. How do you feel?' },
  { id: 'mind_3', category: 'mindfulness', prompt: 'What sounds can you hear around you?' },
  { id: 'mind_4', category: 'mindfulness', prompt: 'Describe something beautiful you saw today.' },
];

// ============================================
// LEVEL THRESHOLDS
// ============================================
export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 4000, 
  5000, 6500, 8000, 10000, 12500, 15000, 18000, 22000, 27000, 33000,
  40000, 50000, 65000, 85000, 100000
];

export const PIPPY_STAGES: { stage: string; minLevel: number }[] = [
  { stage: 'baby', minLevel: 1 },
  { stage: 'child', minLevel: 5 },
  { stage: 'teen', minLevel: 10 },
  { stage: 'adult', minLevel: 20 },
];

// ============================================
// REWARD VALUES
// ============================================
export const REWARDS = {
  WATER_PER_GLASS: 2,
  WATER_GOAL_COMPLETE: 10,
  IRON_TAKEN: 5,
  PILL_DISMISSED: 5,
  MOOD_CHECKIN: 5,
  JOURNAL_ENTRY: 10,
  DAILY_LOGIN: 5,
  STREAK_BONUS_PER_DAY: 1, // multiplier
  PERFECT_DAY_BONUS: 25,
};
