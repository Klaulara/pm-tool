'use client';

import styled, { css } from 'styled-components';

interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
}

const cardVariants = {
  default: css`
    background-color: ${({ theme }) => theme.colors.background.primary};
    border: 1px solid ${({ theme }) => theme.colors.border.light};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  `,

  elevated: css`
    background-color: ${({ theme }) => theme.colors.background.primary};
    border: none;
    box-shadow: ${({ theme }) => theme.shadows.lg};
  `,

  outlined: css`
    background-color: transparent;
    border: 2px solid ${({ theme }) => theme.colors.border.main};
    box-shadow: none;
  `,

  ghost: css`
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border: none;
    box-shadow: none;
  `,
};

const cardPadding = {
  sm: css`
    padding: ${({ theme }) => theme.spacing.md};
  `,
  md: css`
    padding: ${({ theme }) => theme.spacing.lg};
  `,
  lg: css`
    padding: ${({ theme }) => theme.spacing.xl};
  `,
};

export const Card = styled.div<CardProps>`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.duration.normal}
    ${({ theme }) => theme.transitions.easing.default}

  ${({ variant = 'default' }) => cardVariants[variant]}
  ${({ padding = 'md' }) => cardPadding[padding]}

  ${({ hoverable }) =>
    hoverable &&
    css`
      &:hover {
        transform: translateY(-2px);
        box-shadow: ${({ theme }) => theme.shadows.xl};
      }
    `}

  ${({ clickable }) =>
    clickable &&
    css`
      cursor: pointer;

      &:active {
        transform: translateY(0);
      }
    `}
`;

export const CardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

export const CardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
`;

export const CardContent = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const CardFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;
