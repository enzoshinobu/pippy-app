// ============================================
// PIPPY APP - DESIGN SYSTEM
// ============================================

export const Colors = {
  // Brand Colors
  primary: '#F472B6',      // Pink 400
  primaryDark: '#DB2777',  // Pink 600
  primaryLight: '#FBCFE8', // Pink 200
  primarySoft: '#FDF2F8',  // Pink 50
  
  // Secondary
  secondary: '#A78BFA',    // Violet 400
  secondaryDark: '#7C3AED',// Violet 600
  secondaryLight: '#DDD6FE',// Violet 200
  
  // Accent
  accent: '#FBBF24',       // Amber 400
  accentDark: '#D97706',   // Amber 600
  accentLight: '#FEF3C7',  // Amber 100
  
  // Background
  background: '#FFFBFC',
  backgroundAlt: '#FDF4F7',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  
  // Text
  text: '#1F2937',         // Gray 800
  textSecondary: '#4B5563',// Gray 600
  textMuted: '#9CA3AF',    // Gray 400
  textLight: '#D1D5DB',    // Gray 300
  textOnPrimary: '#FFFFFF',
  textOnDark: '#FFFFFF',
  
  // Semantic Colors
  success: '#10B981',      // Emerald 500
  successLight: '#D1FAE5', // Emerald 100
  successDark: '#059669',  // Emerald 600
  
  warning: '#F59E0B',      // Amber 500
  warningLight: '#FEF3C7', // Amber 100
  warningDark: '#D97706',  // Amber 600
  
  error: '#EF4444',        // Red 500
  errorLight: '#FEE2E2',   // Red 100
  errorDark: '#DC2626',    // Red 600
  
  info: '#3B82F6',         // Blue 500
  infoLight: '#DBEAFE',    // Blue 100
  infoDark: '#2563EB',     // Blue 600
  
  // Feature Colors
  water: '#38BDF8',        // Sky 400
  waterLight: '#E0F2FE',   // Sky 100
  waterDark: '#0284C7',    // Sky 600
  
  iron: '#F87171',         // Red 400
  ironLight: '#FEE2E2',    // Red 100
  ironDark: '#DC2626',     // Red 600
  
  pill: '#A78BFA',         // Violet 400
  pillLight: '#EDE9FE',    // Violet 100
  pillDark: '#7C3AED',     // Violet 600
  
  // Currency
  starGem: '#FBBF24',      // Amber 400
  starGemGlow: '#FEF3C7',  // Amber 100
  
  // Rarity Colors
  rarityCommon: '#9CA3AF', // Gray 400
  rarityRare: '#60A5FA',   // Blue 400
  rarityEpic: '#A78BFA',   // Violet 400
  rarityLegendary: '#FBBF24', // Amber 400
  
  // UI Elements
  border: '#F3F4F6',       // Gray 100
  borderDark: '#E5E7EB',   // Gray 200
  divider: '#E5E7EB',      // Gray 200
  
  // Mood Colors
  moodGreat: '#10B981',    // Emerald
  moodGood: '#84CC16',     // Lime
  moodOkay: '#FBBF24',     // Amber
  moodBad: '#F97316',      // Orange
  moodTerrible: '#EF4444', // Red
  
  // Shadows
  shadow: '#000000',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  
  // Navigation
  tabActive: '#DB2777',    // Pink 600
  tabInactive: '#9CA3AF',  // Gray 400
  tabBackground: '#FFFFFF',
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.25)',
  
  // Gradients (as arrays for LinearGradient)
  gradientPrimary: ['#F472B6', '#DB2777'],
  gradientSecondary: ['#A78BFA', '#7C3AED'],
  gradientSunrise: ['#FDE68A', '#F472B6'],
  gradientSunset: ['#F472B6', '#A78BFA'],
  gradientOcean: ['#38BDF8', '#3B82F6'],
  gradientForest: ['#10B981', '#059669'],
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
} as const;

export const FontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

const baseShadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  xl: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 12,
  },
};

export const Shadows = {
  ...baseShadows,
  // Aliases for backwards compatibility
  small: baseShadows.sm,
  medium: baseShadows.md,
  large: baseShadows.lg,
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  }),
  inner: {
    // Note: RN doesn't support inner shadows, use overlay instead
  },
};

export const Animations = {
  fast: 150,
  normal: 300,
  slow: 500,
  spring: {
    damping: 15,
    stiffness: 150,
  },
  bounce: {
    damping: 10,
    stiffness: 100,
  },
} as const;
