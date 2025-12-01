// Design System Theme Configuration

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
} as const;

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

export const shadows = {
  light: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  dark: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
    xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
  },
} as const;

export const borderRadius = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  xxl: '24px',
  full: '9999px',
} as const;

export const transitions = {
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },
  
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'cubic-bezier(0.4, 0, 0.6, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// Animation Keyframes
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  
  slideInUp: {
    from: { 
      transform: 'translateY(20px)', 
      opacity: 0 
    },
    to: { 
      transform: 'translateY(0)', 
      opacity: 1 
    },
  },
  
  slideInDown: {
    from: { 
      transform: 'translateY(-20px)', 
      opacity: 0 
    },
    to: { 
      transform: 'translateY(0)', 
      opacity: 1 
    },
  },
  
  slideInLeft: {
    from: { 
      transform: 'translateX(-20px)', 
      opacity: 0 
    },
    to: { 
      transform: 'translateX(0)', 
      opacity: 1 
    },
  },
  
  slideInRight: {
    from: { 
      transform: 'translateX(20px)', 
      opacity: 0 
    },
    to: { 
      transform: 'translateX(0)', 
      opacity: 1 
    },
  },
  
  scaleIn: {
    from: { 
      transform: 'scale(0.95)', 
      opacity: 0 
    },
    to: { 
      transform: 'scale(1)', 
      opacity: 1 
    },
  },
  
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.5 },
  },
  
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
  },
  
  rotate: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
} as const;

// Theme Type Definition
export interface Theme {
  colors: typeof colors.light | typeof colors.dark;
  spacing: typeof spacing;
  typography: typeof typography;
  breakpoints: typeof breakpoints;
  shadows: typeof shadows.light | typeof shadows.dark;
  borderRadius: typeof borderRadius;
  transitions: typeof transitions;
  zIndex: typeof zIndex;
  animations: typeof animations;
}

// Create theme objects
export const lightTheme: Theme = {
  colors: colors.light,
  spacing,
  typography,
  breakpoints,
  shadows: shadows.light,
  borderRadius,
  transitions,
  zIndex,
  animations,
};

export const darkTheme: Theme = {
  colors: colors.dark,
  spacing,
  typography,
  breakpoints,
  shadows: shadows.dark,
  borderRadius,
  transitions,
  zIndex,
  animations,
};
