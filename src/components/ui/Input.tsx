'use client';

import styled, { css } from 'styled-components';
import { focusVisible } from '@/styles/utils';

interface InputProps {
  hasError?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const inputSizes = {
  sm: css`
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    min-height: 32px;
  `,
  md: css`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.fontSizes.md};
    min-height: 40px;
  `,
  lg: css`
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
    min-height: 48px;
  `,
};

const inputBaseStyles = css<InputProps>`
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.regular};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 2px solid ${({ theme, hasError }) =>
    hasError ? theme.colors.error.main : theme.colors.border.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => `${theme.transitions.duration.fast} ${theme.transitions.easing.default}`};   

  ${({ size = 'md' }) => inputSizes[size]}
  ${focusVisible}

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme, hasError }) =>
      hasError ? theme.colors.error.dark : theme.colors.border.dark};
  }

  &:focus {
    border-color: ${({ theme, hasError }) =>
      hasError ? theme.colors.error.main : theme.colors.border.focus};
    box-shadow: 0 0 0 3px
      ${({ theme, hasError }) =>
        hasError
          ? `${theme.colors.error.main}20`
          : `${theme.colors.primary.main}20`};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background.tertiary};
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const Input = styled.input<InputProps>`
  ${inputBaseStyles}
`;

export const TextArea = styled.textarea<InputProps>`
  ${inputBaseStyles}
  resize: vertical;
  min-height: 80px;
  line-height: ${({ theme }) => theme.typography.lineHeights.normal};
`;

export const Select = styled.select<InputProps>`
  ${inputBaseStyles}
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right ${({ theme }) => theme.spacing.md} center;
  padding-right: ${({ theme }) => theme.spacing.xl};
`;

export const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const HelperText = styled.span<{ error?: boolean }>`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme, error }) =>
    error ? theme.colors.error.main : theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const CheckboxWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  user-select: none;
`;

export const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.colors.border.main};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.background.primary};
  cursor: pointer;
  position: relative;
  transition: all ${({ theme }) => `${theme.transitions.duration.fast} ${theme.transitions.easing.default}`};

  ${focusVisible}

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.dark};
  }

  &:checked {
    background-color: ${({ theme }) => theme.colors.primary.main};
    border-color: ${({ theme }) => theme.colors.primary.main};

    &::after {
      content: '';
      position: absolute;
      left: 5px;
      top: 2px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CheckboxLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;
