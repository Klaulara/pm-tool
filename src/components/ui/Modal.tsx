'use client';

import styled, { css, keyframes } from 'styled-components';
import { flexCenter } from '@/styles/utils';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

export const ModalOverlay = styled.div<{ isOpen?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.background.overlay};
  z-index: ${({ theme }) => theme.zIndex.modalBackdrop};
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  ${flexCenter}
  animation: ${fadeIn} ${({ theme }) => `${theme.transitions.duration.normal} ${theme.transitions.easing.default}`};
  backdrop-filter: blur(4px);
  overflow-y: auto;
`;

interface ModalContentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const modalSizes = {
  sm: css`
    max-width: 400px;
  `,
  md: css`
    max-width: 600px;
  `,
  lg: css`
    max-width: 800px;
  `,
  xl: css`
    max-width: 1000px;
  `,
};

export const ModalContent = styled.div<ModalContentProps>`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.xxl};
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndex.modal};
  animation: ${scaleIn} ${({ theme }) => `${theme.transitions.duration.normal} ${theme.transitions.easing.smooth}`};
  margin: auto;
  ${({ size = 'md' }) => modalSizes[size]};
`;

export const ModalHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

export const ModalCloseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all ${({ theme }) => `${theme.transitions.duration.fast} ${theme.transitions.easing.default}`};

  &:hover {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`;

export const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const ModalFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
`;
