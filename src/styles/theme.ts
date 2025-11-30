export const typography = {
  // Font Families
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'Fira Code', 'Courier New', monospace",
  },
  
  // Font Sizes - Typography Scale
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
    display1: '40px',
    display2: '48px',
    display3: '56px',
  },
  
  // Font Weights
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
} as const;

export const colors = {
  // Light Theme Colors
  light: {
    // Primary Colors
    primary: {
      main: '#4F46E5', // Indigo
      light: '#818CF8',
      dark: '#3730A3',
      contrast: '#FFFFFF',
    },
    
    // Secondary Colors
    secondary: {
      main: '#06B6D4', // Cyan
      light: '#67E8F9',
      dark: '#0891B2',
      contrast: '#FFFFFF',
    },
    
    // Neutral Colors
    neutral: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
    
    // Semantic Colors
    success: {
      main: '#10B981',
      light: '#6EE7B7',
      dark: '#047857',
      bg: '#D1FAE5',
    },
    
    error: {
      main: '#EF4444',
      light: '#FCA5A5',
      dark: '#B91C1C',
      bg: '#FEE2E2',
    },
    
    warning: {
      main: '#F59E0B',
      light: '#FCD34D',
      dark: '#D97706',
      bg: '#FEF3C7',
    },
    
    info: {
      main: '#3B82F6',
      light: '#93C5FD',
      dark: '#1D4ED8',
      bg: '#DBEAFE',
    },
    
    // Background Colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    
    // Text Colors
    text: {
      primary: '#111827',
      secondary: '#6B7280',
      tertiary: '#9CA3AF',
      disabled: '#D1D5DB',
      inverse: '#FFFFFF',
    },
    
    // Border Colors
    border: {
      light: '#E5E7EB',
      main: '#D1D5DB',
      dark: '#9CA3AF',
      focus: '#4F46E5',
    },
    
    // Task Status Colors
    task: {
      todo: '#3B82F6',
      inProgress: '#F59E0B',
      review: '#8B5CF6',
      done: '#10B981',
      blocked: '#EF4444',
    },
  },
  
  // Dark Theme Colors
  dark: {
    // Primary Colors
    primary: {
      main: '#818CF8',
      light: '#A5B4FC',
      dark: '#6366F1',
      contrast: '#111827',
    },
    
    // Secondary Colors
    secondary: {
      main: '#22D3EE',
      light: '#67E8F9',
      dark: '#06B6D4',
      contrast: '#111827',
    },
    
    // Neutral Colors
    neutral: {
      50: '#1F2937',
      100: '#374151',
      200: '#4B5563',
      300: '#6B7280',
      400: '#9CA3AF',
      500: '#D1D5DB',
      600: '#E5E7EB',
      700: '#F3F4F6',
      800: '#F9FAFB',
      900: '#FFFFFF',
    },
    
    // Semantic Colors
    success: {
      main: '#34D399',
      light: '#6EE7B7',
      dark: '#10B981',
      bg: '#064E3B',
    },
    
    error: {
      main: '#F87171',
      light: '#FCA5A5',
      dark: '#EF4444',
      bg: '#7F1D1D',
    },
    
    warning: {
      main: '#FBBF24',
      light: '#FCD34D',
      dark: '#F59E0B',
      bg: '#78350F',
    },
    
    info: {
      main: '#60A5FA',
      light: '#93C5FD',
      dark: '#3B82F6',
      bg: '#1E3A8A',
    },
    
    // Background Colors
    background: {
      primary: '#111827',
      secondary: '#1F2937',
      tertiary: '#374151',
      overlay: 'rgba(0, 0, 0, 0.7)',
    },
    
    // Text Colors
    text: {
      primary: '#F9FAFB',
      secondary: '#D1D5DB',
      tertiary: '#9CA3AF',
      disabled: '#6B7280',
      inverse: '#111827',
    },
    
    // Border Colors
    border: {
      light: '#374151',
      main: '#4B5563',
      dark: '#6B7280',
      focus: '#818CF8',
    },
    
    // Task Status Colors
    task: {
      todo: '#60A5FA',
      inProgress: '#FBBF24',
      review: '#A78BFA',
      done: '#34D399',
      blocked: '#F87171',
    },
  },
} as const;

export interface Theme {
  colors: typeof colors.light | typeof colors.dark;
  typography: typeof typography;
  breakpoints: typeof breakpoints;
}

// Create theme objects
export const lightTheme: Theme = {
  colors: colors.light,
  typography,
  breakpoints,
};

export const darkTheme: Theme = {
  colors: colors.dark,
  typography,
  breakpoints,
};