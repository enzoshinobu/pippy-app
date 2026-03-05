import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyState, UserSettings, WeeklyStats, MoodCheckin } from '../types';
import { useGame } from './GameContext';
import { REWARDS } from '../constants/shopData';

const STORAGE_KEYS = {
  DAILY: 'pippy_daily',
  SETTINGS: 'pippy_settings',
  HISTORY: 'pippy_history',
};

const getTodayString = () => new Date().toISOString().split('T')[0];

const defaultSettings: UserSettings = {
  name: 'Friend',
  waterGoal: 8,
  pillReminderTime: '09:00',
  notificationsEnabled: true,
  theme: 'light',
  soundEnabled: true,
  hapticsEnabled: true,
};

const defaultDaily = (): DailyState => ({
  date: getTodayString(),
  water: 0,
  ironTaken: false,
  pillDismissed: false,
  moodCheckin: undefined,
  journalEntry: undefined,
  completedQuests: [],
});

interface AppContextType {
  // Daily state
  daily: DailyState;
  setWater: (count: number) => void;
  toggleIron: () => void;
  dismissPill: () => void;
  setMoodCheckin: (checkin: MoodCheckin) => void;
  setJournalEntry: (entry: string) => void;
  
  // Settings
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  
  // Stats
  weeklyStats: WeeklyStats[];
  getCompletionRate: (days: number) => { water: number; iron: number; pill: number };
  
  // Helpers
  isPerfectDay: () => boolean;
  getTodayProgress: () => number;
  
  // Loading
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProviderInner: React.FC<AppProviderProps> = ({ children }) => {
  // Get game context from GameProvider (parent in App.tsx)
  let gameContext: ReturnType<typeof useGame> | null = null;
  try {
    gameContext = useGame();
  } catch {
    // GameProvider not yet mounted, gameContext stays null
  }
  const [daily, setDaily] = useState<DailyState>(defaultDaily());
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Previous values for reward calculation
  const prevWaterRef = React.useRef(0);
  const prevIronRef = React.useRef(false);
  const prevPillRef = React.useRef(false);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Save daily state and award gems when it changes
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.DAILY, JSON.stringify(daily));
      updateHistory(daily);
      
      // Award star gems for progress (only when increasing)
      if (gameContext) {
        // Water rewards
        if (daily.water > prevWaterRef.current) {
          const newGlasses = daily.water - prevWaterRef.current;
          gameContext.addStarGems(newGlasses * REWARDS.WATER_PER_GLASS);
          gameContext.updateQuestProgress('water', daily.water);
          gameContext.checkAchievement('water', daily.water);
          
          // Bonus for completing water goal
          if (daily.water >= settings.waterGoal && prevWaterRef.current < settings.waterGoal) {
            gameContext.addStarGems(REWARDS.WATER_GOAL_COMPLETE);
          }
        }
        prevWaterRef.current = daily.water;
        
        // Iron rewards
        if (daily.ironTaken && !prevIronRef.current) {
          gameContext.addStarGems(REWARDS.IRON_TAKEN);
          gameContext.updateQuestProgress('iron', 1);
          gameContext.updateHappiness(5);
        }
        prevIronRef.current = daily.ironTaken;
        
        // Pill rewards
        if (daily.pillDismissed && !prevPillRef.current) {
          gameContext.addStarGems(REWARDS.PILL_DISMISSED);
          gameContext.updateQuestProgress('pill', 1);
        }
        prevPillRef.current = daily.pillDismissed;
        
        // Perfect day bonus
        if (isPerfectDay()) {
          // Check if we haven't already awarded this
          const perfectKey = `perfect_${daily.date}`;
          AsyncStorage.getItem(perfectKey).then(claimed => {
            if (!claimed) {
              gameContext.addStarGems(REWARDS.PERFECT_DAY_BONUS);
              AsyncStorage.setItem(perfectKey, 'true');
            }
          });
        }
      }
    }
  }, [daily, isLoading]);

  // Save settings when they change
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
  }, [settings, isLoading]);

  const loadData = async () => {
    try {
      const [dailyData, settingsData, historyData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.DAILY),
        AsyncStorage.getItem(STORAGE_KEYS.SETTINGS),
        AsyncStorage.getItem(STORAGE_KEYS.HISTORY),
      ]);

      // Check if daily data is from today, otherwise reset
      if (dailyData) {
        const parsed = JSON.parse(dailyData) as DailyState;
        if (parsed.date === getTodayString()) {
          setDaily(parsed);
          prevWaterRef.current = parsed.water;
          prevIronRef.current = parsed.ironTaken;
          prevPillRef.current = parsed.pillDismissed;
        } else {
          setDaily(defaultDaily());
        }
      }

      if (settingsData) {
        setSettings({ ...defaultSettings, ...JSON.parse(settingsData) });
      }

      if (historyData) {
        setWeeklyStats(JSON.parse(historyData));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateHistory = async (currentDaily: DailyState) => {
    try {
      const historyData = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
      let history: WeeklyStats[] = historyData ? JSON.parse(historyData) : [];
      
      const todayIndex = history.findIndex(h => h.date === currentDaily.date);
      const entry: WeeklyStats = {
        date: currentDaily.date,
        water: currentDaily.water,
        ironTaken: currentDaily.ironTaken,
        pillDismissed: currentDaily.pillDismissed,
        mood: currentDaily.moodCheckin?.mood,
        questsCompleted: currentDaily.completedQuests.length,
        starGemsEarned: 0, // Will be tracked separately
      };

      if (todayIndex >= 0) {
        history[todayIndex] = entry;
      } else {
        history.push(entry);
      }

      // Keep only last 60 days
      history = history.slice(-60);
      
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      setWeeklyStats(history);
    } catch (error) {
      console.error('Failed to update history:', error);
    }
  };

  const setWater = (count: number) => {
    setDaily(prev => ({ 
      ...prev, 
      water: Math.max(0, Math.min(count, settings.waterGoal + 4)) // Allow slight overflow
    }));
  };

  const toggleIron = () => {
    setDaily(prev => ({ ...prev, ironTaken: !prev.ironTaken }));
  };

  const dismissPill = () => {
    setDaily(prev => ({ ...prev, pillDismissed: true }));
  };

  const setMoodCheckin = (checkin: MoodCheckin) => {
    setDaily(prev => ({ ...prev, moodCheckin: checkin }));
    if (gameContext) {
      gameContext.addStarGems(REWARDS.MOOD_CHECKIN);
      gameContext.updateQuestProgress('mood', 1);
    }
  };

  const setJournalEntry = (entry: string) => {
    setDaily(prev => ({ ...prev, journalEntry: entry }));
    if (gameContext) {
      gameContext.addStarGems(REWARDS.JOURNAL_ENTRY);
      gameContext.updateQuestProgress('journal', 1);
    }
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const isPerfectDay = (): boolean => {
    return (
      daily.water >= settings.waterGoal &&
      daily.ironTaken &&
      daily.pillDismissed
    );
  };

  const getTodayProgress = (): number => {
    let completed = 0;
    let total = 3;
    
    if (daily.water >= settings.waterGoal) completed++;
    if (daily.ironTaken) completed++;
    if (daily.pillDismissed) completed++;
    
    return completed / total;
  };

  const getCompletionRate = (days: number) => {
    const recentStats = weeklyStats.slice(-days);
    if (recentStats.length === 0) return { water: 0, iron: 0, pill: 0 };
    
    const waterDays = recentStats.filter(s => s.water >= settings.waterGoal).length;
    const ironDays = recentStats.filter(s => s.ironTaken).length;
    const pillDays = recentStats.filter(s => s.pillDismissed).length;
    
    return {
      water: Math.round((waterDays / recentStats.length) * 100),
      iron: Math.round((ironDays / recentStats.length) * 100),
      pill: Math.round((pillDays / recentStats.length) * 100),
    };
  };

  return (
    <AppContext.Provider value={{
      daily,
      setWater,
      toggleIron,
      dismissPill,
      setMoodCheckin,
      setJournalEntry,
      settings,
      updateSettings,
      weeklyStats,
      getCompletionRate,
      isPerfectDay,
      getTodayProgress,
      isLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Wrapper that provides game context
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // This will be wrapped by GameProvider in App.tsx
  return <AppProviderInner>{children}</AppProviderInner>;
};
