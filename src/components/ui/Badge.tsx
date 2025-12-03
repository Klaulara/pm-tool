'use client';

import styled from 'styled-components';

interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'urgent';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  white-space: nowrap;
  transition: all ${({ theme }) => theme.transitions.duration.fast} ${({ theme }) => theme.transitions.easing.default};

  ${({ size = 'md', theme }) => {
    switch (size) {
      case 'sm':
        return `
          padding: 2px 8px;
          font-size: ${theme.typography.fontSizes.xs};
        `;
      case 'lg':
        return `
          padding: 6px 16px;
          font-size: ${theme.typography.fontSizes.md};
        `;
      default:
        return `
          padding: 4px 12px;
          font-size: ${theme.typography.fontSizes.sm};
        `;
    }
  }}

  ${({ variant = 'default', theme }) => {
    switch (variant) {
      case 'urgent':
        return `
          background-color: ${theme.colors.error.main};
          color: #FFFFFF;
          border: 1px solid ${theme.colors.error.dark};
          font-weight: ${theme.typography.fontWeights.bold};
        `;
      case 'error':
        return `
          background-color: ${theme.colors.error.bg};
          color: ${theme.colors.error.dark};
          border: 1px solid ${theme.colors.error.main};
        `;
      case 'primary':
        return `
          background-color: ${theme.colors.primary.main}20;
          color: ${theme.colors.primary.dark};
          border: 1px solid ${theme.colors.primary.main};
        `;
      case 'secondary':
        return `
          background-color: ${theme.colors.secondary.main}20;
          color: ${theme.colors.secondary.dark};
          border: 1px solid ${theme.colors.secondary.main};
        `;
      case 'success':
        return `
          background-color: ${theme.colors.success.bg};
          color: ${theme.colors.success.dark};
          border: 1px solid ${theme.colors.success.main};
        `;
      case 'warning':
        return `
          background-color: ${theme.colors.warning.bg};
          color: ${theme.colors.warning.dark};
          border: 1px solid ${theme.colors.warning.main};
        `;
      case 'info':
        return `
          background-color: ${theme.colors.info.bg};
          color: ${theme.colors.info.dark};
          border: 1px solid ${theme.colors.info.main};
        `;
      default:
        return `
          background-color: ${theme.colors.neutral[100]};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border.main};
        `;
    }
  }}
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
