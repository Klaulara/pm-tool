'use client';

import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@/styles/ThemeProvider';

const SwitchContainer = styled.div`
  display: inline-flex;
  align-items: center;
`;

const SwitchButton = styled.button<{ isChecked: boolean }>`
  position: relative;
  width: 52px;
  height: 28px;
  background-color: ${({ theme, isChecked }) =>
    isChecked ? theme.colors.primary.main : theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: none;
  cursor: pointer;
  transition: background-color ${({ theme }) => `${theme.transitions.duration.normal} ${theme.transitions.easing.default}`};

  &:hover {
    background-color: ${({ theme, isChecked }) =>
      isChecked ? theme.colors.primary.dark : theme.colors.neutral[400]};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`;

const SwitchToggle = styled.span<{ isChecked: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ isChecked }) => (isChecked ? '26px' : '2px')};
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  transition: left ${({ theme }) => `${theme.transitions.duration.normal} ${theme.transitions.easing.smooth}`};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.span`
  font-size: 14px;
  line-height: 1;
`;

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SwitchContainer>
      <SwitchButton
        onClick={toggleTheme}
        isChecked={isDark}
        aria-label="Toggle theme"
        role="switch"
        aria-checked={isDark}
      >
        <SwitchToggle isChecked={isDark}>
          <IconWrapper>{isDark ? '🌙' : '☀️'}</IconWrapper>
        </SwitchToggle>
      </SwitchButton>
    </SwitchContainer>
  );
};
