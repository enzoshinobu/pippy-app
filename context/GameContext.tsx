import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  WalletState, 
  ShopState, 
  StreakData, 
  PippyState, 
  Achievement,
  Quest,
  DailyGift,
} from '../types';
import { ACHIEVEMENTS, DAILY_QUESTS, REWARDS, LEVEL_THRESHOLDS } from '../constants/shopData';

const STORAGE_KEYS = {
  WALLET: 'pippy_wallet',
  SHOP: 'pippy_shop',
  STREAK: 'pippy_streak',
  PIPPY: 'pippy_state',
  ACHIEVEMENTS: 'pippy_achievements',
  QUESTS: 'pippy_quests',
  DAILY_GIFT: 'pippy_daily_gift',
};

const getTodayString = () => new Date().toISOString().split('T')[0];

const defaultWallet: WalletState = {
  starGems: 100, // Starting bonus
  totalEarned: 100,
  lastDailyBonus: undefined,
};

const defaultShop: ShopState = {
  ownedOutfits: [],
  ownedRoomItems: [],
  ownedBackgrounds: ['bg_bedroom'], // Default background
  equippedOutfit: undefined,
  equippedBackground: 'bg_bedroom',
  placedRoomItems: [],
};

const defaultStreak: StreakData = {
  current: 0,
  longest: 0,
  lastCheckIn: undefined,
  freezesAvailable: 1,
  isFrozen: false,
};

const defaultPippy: PippyState = {
  name: 'Pippy',
  stage: 'baby',
  experience: 0,
  level: 1,
  happiness: 80,
  energy: 100,
  currentMood: 'happy',
  currentAdventure: undefined,
};

interface GameContextType {
  // Wallet
  wallet: WalletState;
  addStarGems: (amount: number, source?: string) => void;
  spendStarGems: (amount: number) => boolean;
  claimDailyBonus: () => number;
  
  // Shop
  shop: ShopState;
  purchaseItem: (type: 'outfit' | 'roomItem' | 'background', itemId: string, price: number) => boolean;
  equipOutfit: (outfitId: string | undefined) => void;
  setBackground: (backgroundId: string) => void;
  placeRoomItem: (itemId: string, x: number, y: number) => void;
  
  // Streak
  streak: StreakData;
  checkInToday: () => void;
  useStreakFreeze: () => boolean;
  
  // Pippy
  pippy: PippyState;
  addExperience: (amount: number) => void;
  updateHappiness: (delta: number) => void;
  setPippyMood: (mood: PippyState['currentMood']) => void;
  
  // Achievements
  unlockedAchievements: string[];
  checkAchievement: (category: Achievement['category'], value: number) => Achievement | null;
  
  // Quests
  dailyQuests: Quest[];
  updateQuestProgress: (type: Quest['requirements'][0]['type'], value: number) => void;
  claimQuestReward: (questId: string) => number;
  
  // Loading
  isLoading: boolean;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>(defaultWallet);
  const [shop, setShop] = useState<ShopState>(defaultShop);
  const [streak, setStreak] = useState<StreakData>(defaultStreak);
  const [pippy, setPippy] = useState<PippyState>(defaultPippy);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [dailyQuests, setDailyQuests] = useState<Quest[]>(DAILY_QUESTS);
  const [isLoading, setIsLoading] = useState(true);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  // Save data when it changes
  useEffect(() => {
    if (!isLoading) saveAllData();
  }, [wallet, shop, streak, pippy, unlockedAchievements, dailyQuests, isLoading]);

  const loadAllData = async () => {
    try {
      const [walletData, shopData, streakData, pippyData, achieveData, questData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.WALLET),
        AsyncStorage.getItem(STORAGE_KEYS.SHOP),
        AsyncStorage.getItem(STORAGE_KEYS.STREAK),
        AsyncStorage.getItem(STORAGE_KEYS.PIPPY),
        AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS),
        AsyncStorage.getItem(STORAGE_KEYS.QUESTS),
      ]);

      if (walletData) setWallet(JSON.parse(walletData));
      if (shopData) setShop(JSON.parse(shopData));
      if (streakData) setStreak(JSON.parse(streakData));
      if (pippyData) setPippy(JSON.parse(pippyData));
      if (achieveData) setUnlockedAchievements(JSON.parse(achieveData));
      
      // Reset quests if it's a new day
      if (questData) {
        const savedQuests = JSON.parse(questData) as Quest[];
        const today = getTodayString();
        if (savedQuests[0]?.expiresAt !== today) {
          // New day, reset quests
          setDailyQuests(DAILY_QUESTS.map(q => ({
            ...q,
            expiresAt: today,
            completedAt: undefined,
            requirements: q.requirements.map(r => ({ ...r, current: 0 })),
          })));
        } else {
          setDailyQuests(savedQuests);
        }
      }
    } catch (error) {
      console.error('Failed to load game data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAllData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(wallet)),
        AsyncStorage.setItem(STORAGE_KEYS.SHOP, JSON.stringify(shop)),
        AsyncStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak)),
        AsyncStorage.setItem(STORAGE_KEYS.PIPPY, JSON.stringify(pippy)),
        AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(unlockedAchievements)),
        AsyncStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(dailyQuests)),
      ]);
    } catch (error) {
      console.error('Failed to save game data:', error);
    }
  };

  // ===== WALLET FUNCTIONS =====
  const addStarGems = (amount: number, source?: string) => {
    setWallet(prev => ({
      ...prev,
      starGems: prev.starGems + amount,
      totalEarned: prev.totalEarned + amount,
    }));
    // Also add experience when earning gems
    addExperience(Math.floor(amount / 2));
  };

  const spendStarGems = (amount: number): boolean => {
    if (wallet.starGems < amount) return false;
    setWallet(prev => ({
      ...prev,
      starGems: prev.starGems - amount,
    }));
    return true;
  };

  const claimDailyBonus = (): number => {
    const today = getTodayString();
    if (wallet.lastDailyBonus === today) return 0;
    
    const bonus = REWARDS.DAILY_LOGIN + (streak.current * REWARDS.STREAK_BONUS_PER_DAY);
    addStarGems(bonus, 'daily_login');
    setWallet(prev => ({ ...prev, lastDailyBonus: today }));
    return bonus;
  };

  // ===== SHOP FUNCTIONS =====
  const purchaseItem = (type: 'outfit' | 'roomItem' | 'background', itemId: string, price: number): boolean => {
    if (!spendStarGems(price)) return false;
    
    setShop(prev => {
      const key = type === 'outfit' ? 'ownedOutfits' : 
                  type === 'roomItem' ? 'ownedRoomItems' : 'ownedBackgrounds';
      return {
        ...prev,
        [key]: [...prev[key], itemId],
      };
    });
    
    // Check first purchase achievement
    if (type === 'outfit' && shop.ownedOutfits.length === 0) {
      checkAchievement('special', 1);
    }
    
    return true;
  };

  const equipOutfit = (outfitId: string | undefined) => {
    setShop(prev => ({ ...prev, equippedOutfit: outfitId }));
  };

  const setBackground = (backgroundId: string) => {
    setShop(prev => ({ ...prev, equippedBackground: backgroundId }));
  };

  const placeRoomItem = (itemId: string, x: number, y: number) => {
    setShop(prev => ({
      ...prev,
      placedRoomItems: [
        ...prev.placedRoomItems.filter(i => i.itemId !== itemId),
        { itemId, x, y },
      ],
    }));
  };

  // ===== STREAK FUNCTIONS =====
  const checkInToday = () => {
    const today = getTodayString();
    if (streak.lastCheckIn === today) return;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    let newStreak = streak.current;
    if (streak.lastCheckIn === yesterdayStr || streak.isFrozen) {
      newStreak += 1;
    } else if (streak.lastCheckIn !== today) {
      newStreak = 1; // Streak broken, start fresh
    }
    
    setStreak(prev => ({
      ...prev,
      current: newStreak,
      longest: Math.max(prev.longest, newStreak),
      lastCheckIn: today,
      isFrozen: false,
    }));
    
    // Check streak achievements
    checkAchievement('streak', newStreak);
  };

  const useStreakFreeze = (): boolean => {
    if (streak.freezesAvailable <= 0) return false;
    setStreak(prev => ({
      ...prev,
      freezesAvailable: prev.freezesAvailable - 1,
      isFrozen: true,
    }));
    return true;
  };

  // ===== PIPPY FUNCTIONS =====
  const addExperience = (amount: number) => {
    setPippy(prev => {
      const newExp = prev.experience + amount;
      let newLevel = prev.level;
      
      // Check for level up
      while (newLevel < LEVEL_THRESHOLDS.length && newExp >= LEVEL_THRESHOLDS[newLevel]) {
        newLevel++;
      }
      
      // Determine stage based on level
      let newStage = prev.stage;
      if (newLevel >= 20) newStage = 'adult';
      else if (newLevel >= 10) newStage = 'teen';
      else if (newLevel >= 5) newStage = 'child';
      
      return {
        ...prev,
        experience: newExp,
        level: newLevel,
        stage: newStage,
      };
    });
  };

  const updateHappiness = (delta: number) => {
    setPippy(prev => ({
      ...prev,
      happiness: Math.max(0, Math.min(100, prev.happiness + delta)),
    }));
  };

  const setPippyMood = (mood: PippyState['currentMood']) => {
    setPippy(prev => ({ ...prev, currentMood: mood }));
  };

  // ===== ACHIEVEMENT FUNCTIONS =====
  const checkAchievement = (category: Achievement['category'], value: number): Achievement | null => {
    const newAchievements = ACHIEVEMENTS.filter(a => 
      a.category === category && 
      a.requirement <= value && 
      !unlockedAchievements.includes(a.id)
    );
    
    if (newAchievements.length > 0) {
      const earned = newAchievements[newAchievements.length - 1]; // Highest tier
      setUnlockedAchievements(prev => [...prev, ...newAchievements.map(a => a.id)]);
      
      // Award gems for achievement
      newAchievements.forEach(a => addStarGems(a.reward, `achievement_${a.id}`));
      
      return earned;
    }
    return null;
  };

  // ===== QUEST FUNCTIONS =====
  const updateQuestProgress = (type: Quest['requirements'][0]['type'], value: number) => {
    setDailyQuests(prev => prev.map(quest => ({
      ...quest,
      requirements: quest.requirements.map(req => 
        req.type === type ? { ...req, current: Math.max(req.current, value) } : req
      ),
    })));
  };

  const claimQuestReward = (questId: string): number => {
    const quest = dailyQuests.find(q => q.id === questId);
    if (!quest || quest.completedAt) return 0;
    
    const allComplete = quest.requirements.every(r => r.current >= r.target);
    if (!allComplete) return 0;
    
    setDailyQuests(prev => prev.map(q => 
      q.id === questId ? { ...q, completedAt: new Date().toISOString() } : q
    ));
    
    addStarGems(quest.reward, `quest_${questId}`);
    return quest.reward;
  };

  return (
    <GameContext.Provider value={{
      wallet,
      addStarGems,
      spendStarGems,
      claimDailyBonus,
      shop,
      purchaseItem,
      equipOutfit,
      setBackground,
      placeRoomItem,
      streak,
      checkInToday,
      useStreakFreeze,
      pippy,
      addExperience,
      updateHappiness,
      setPippyMood,
      unlockedAchievements,
      checkAchievement,
      dailyQuests,
      updateQuestProgress,
      claimQuestReward,
      isLoading,
    }}>
      {children}
    </GameContext.Provider>
  );
};
