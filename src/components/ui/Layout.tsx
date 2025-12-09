'use client';

import styled from 'styled-components';

export const Container = styled.div<{ $maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full' }>`
  width: 100%;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};

  @media (min-width: 768px) {
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }

  max-width: ${({ $maxWidth = 'xl' }) => {
    const widths = {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      full: '100%',
    };
    return widths[$maxWidth];
  }};
`;

export const Grid = styled.div<{
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
  $responsive?: boolean;
}>`
  display: grid;
  gap: ${({ theme, gap = 'md' }) => {
    const gaps = {
      sm: theme.spacing.sm,
      md: theme.spacing.md,
      lg: theme.spacing.lg,
    };
    return gaps[gap];
  }};

  ${({ columns = 1, $responsive }) => {
    if ($responsive) {
      return `
        grid-template-columns: 1fr;
        
        @media (min-width: 640px) {
          grid-template-columns: repeat(2, 1fr);
        }
        
        @media (min-width: 1024px) {
          grid-template-columns: repeat(${Math.min(columns, 3)}, 1fr);
        }
        
        @media (min-width: 1440px) {
          grid-template-columns: repeat(${columns}, 1fr);
        }
      `;
    }
    return `grid-template-columns: repeat(${columns}, 1fr);`;
  }}
`;

export const Flex = styled.div<{
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 'sm' | 'md' | 'lg';
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${({ direction = 'row' }) => direction};
  align-items: ${({ align = 'stretch' }) => {
    const alignments = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch',
    };
    return alignments[align];
  }};
  justify-content: ${({ justify = 'start' }) => {
    const justifications = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly',
    };
    return justifications[justify];
  }};
  gap: ${({ theme, gap = 'md' }) => {
    const gaps = {
      sm: theme.spacing.sm,
      md: theme.spacing.md,
      lg: theme.spacing.lg,
    };
    return gaps[gap];
  }};
  flex-wrap: ${({ wrap }) => (wrap ? 'wrap' : 'nowrap')};
`;

export const Stack = styled.div<{ spacing?: 'sm' | 'md' | 'lg' }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme, spacing = 'md' }) => {
    const spacings = {
      sm: theme.spacing.sm,
      md: theme.spacing.md,
      lg: theme.spacing.lg,
    };
    return spacings[spacing];
  }};
`;
