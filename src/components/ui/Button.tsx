'use client';

import styled, { css } from 'styled-components';
import { focusVisible } from '@/styles/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const buttonVariants = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.contrast};
    border: 2px solid ${({ theme }) => theme.colors.primary.main};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primary.dark};
      border-color: ${({ theme }) => theme.colors.primary.dark};
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,

  secondary: css`
    background-color: ${({ theme }) => theme.colors.secondary.main};
    color: ${({ theme }) => theme.colors.secondary.contrast};
    border: 2px solid ${({ theme }) => theme.colors.secondary.main};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.secondary.dark};
      border-color: ${({ theme }) => theme.colors.secondary.dark};
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,

  outline: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primary.main};
    border: 2px solid ${({ theme }) => theme.colors.primary.main};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.primary.main}10;
      border-color: ${({ theme }) => theme.colors.primary.dark};
      color: ${({ theme }) => theme.colors.primary.dark};
    }
  `,

  ghost: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    border: 2px solid transparent;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.neutral[100]};
    }
  `,

  danger: css`
    background-color: ${({ theme }) => theme.colors.error.main};
    color: ${({ theme }) => theme.colors.primary.contrast};
    border: 2px solid ${({ theme }) => theme.colors.error.main};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.error.dark};
      border-color: ${({ theme }) => theme.colors.error.dark};
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }
  `,
};

const buttonSizes = {
  sm: css`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    min-height: 44px;
  `,

  md: css`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    min-height: 44px;
  `,

  lg: css`
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
    min-height: 48px;
  `,
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => `${theme.transitions.duration.fast} ${theme.transitions.easing.default}`};
  white-space: nowrap;
  user-select: none;

  ${({ variant = 'primary' }) => buttonVariants[variant]}
  ${({ size = 'md' }) => buttonSizes[size]}
  ${({ fullWidth }) => fullWidth && css`width: 100%;`}
  ${focusVisible}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ isLoading }) =>
    isLoading &&
    css`
      position: relative;
      color: transparent;
      pointer-events: none;

      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        top: 50%;
        left: 50%;
        margin-left: -8px;
        margin-top: -8px;
        border: 2px solid currentColor;
        border-radius: 50%;
        border-top-color: transparent;
        animation: rotate ${({ theme }) => theme.transitions.duration.slower} linear infinite;
      }

      @keyframes rotate {
        to {
          transform: rotate(360deg);
        }
      }
    `}
`;
