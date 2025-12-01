'use client';

import styled, { DefaultTheme } from 'styled-components';

interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

const badgeVariants = {
  default: `
    background-color: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
    --bg: ${({ theme }: { theme: DefaultTheme }) => theme.colors.neutral[100]};
    --text: ${({ theme }: { theme: DefaultTheme }) => theme.colors.text.primary};
    --border: ${({ theme }: { theme: DefaultTheme }) => theme.colors.border.main};
  `,
  primary: `
    background-color: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
    --bg: ${({ theme }: { theme: DefaultTheme }) => theme.colors.primary.main}20;
    --text: ${({ theme }: { theme: DefaultTheme }) => theme.colors.primary.dark};
    --border: ${({ theme }: { theme: DefaultTheme }) => theme.colors.primary.main};
  `,
  secondary: `
    background-color: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
    --bg: ${({ theme }: { theme: DefaultTheme }) => theme.colors.secondary.main}20;
    --text: ${({ theme }: { theme: DefaultTheme }) => theme.colors.secondary.dark};
    --border: ${({ theme }: { theme: DefaultTheme }) => theme.colors.secondary.main};
  `,
  success: `
    background-color: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
    --bg: ${({ theme }: { theme: DefaultTheme }) => theme.colors.success.bg};
    --text: ${({ theme }: { theme: DefaultTheme }) => theme.colors.success.dark};
    --border: ${({ theme }: { theme: DefaultTheme }) => theme.colors.success.main};
  `,
  error: `
    background-color: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
    --bg: ${({ theme }: { theme: DefaultTheme }) => theme.colors.error.bg};
    --text: ${({ theme }: { theme: DefaultTheme }) => theme.colors.error.dark};
    --border: ${({ theme }: { theme: DefaultTheme }) => theme.colors.error.main};
  `,
  warning: `
    background-color: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
    --bg: ${({ theme }: { theme: DefaultTheme }) => theme.colors.warning.bg};
    --text: ${({ theme }: { theme: DefaultTheme }) => theme.colors.warning.dark};
    --border: ${({ theme }: { theme: DefaultTheme }) => theme.colors.warning.main};
  `,
  info: `
    background-color: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
    --bg: ${({ theme }: { theme: DefaultTheme }) => theme.colors.info.bg};
    --text: ${({ theme }: { theme: DefaultTheme }) => theme.colors.info.dark};
    --border: ${({ theme }: { theme: DefaultTheme }) => theme.colors.info.main};
  `,
};

const badgeSizes = {
  sm: `
    padding: 2px 8px;
    font-size: ${({ theme }: { theme: DefaultTheme }) => theme.typography.fontSizes.xs};
  `,
  md: `
    padding: 4px 12px;
    font-size: ${({ theme }: { theme: DefaultTheme }) => theme.typography.fontSizes.sm};
  `,
  lg: `
    padding: 6px 16px;
    font-size: ${({ theme }: { theme: DefaultTheme }) => theme.typography.fontSizes.md};
  `,
};

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  white-space: nowrap;
  transition: all ${({ theme }) => theme.transitions.duration.fast}
    ${({ theme }) => theme.transitions.easing.default}

  ${({ variant = 'default' }) => badgeVariants[variant]}
  ${({ size = 'md' }) => badgeSizes[size]}
`;

export const TaskStatusBadge = styled(Badge)<{ status: 'todo' | 'inProgress' | 'review' | 'done' | 'blocked' }>`
  ${({ status, theme }) => {
    const colors = {
      todo: theme.colors.task.todo,
      inProgress: theme.colors.task.inProgress,
      review: theme.colors.task.review,
      done: theme.colors.task.done,
      blocked: theme.colors.task.blocked,
    };
    
    return `
      background-color: ${colors[status]}20;
      color: ${colors[status]};
      border: 1px solid ${colors[status]};
    `;
  }}
`;
