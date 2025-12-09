'use client';

import { useUIStore } from '@/store/ui';
import styled from 'styled-components';

const ToastContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 400px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
`;

const ToastItem = styled.div<{ type: 'success' | 'error' | 'warning' | 'info' }>`
  padding: 1rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ type, theme }) => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'error':
        return '#EF4444';
      case 'warning':
        return '#F59E0B';
      case 'info':
        return theme.colors.primary.main;
      default:
        return theme.colors.primary.main;
    }
  }};
  color: white;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  animation: slideIn 0.3s ease;
  font-size: 0.875rem;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const ToastIcon = styled.span`
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const ToastMessage = styled.span`
  flex: 1;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }

  &:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }
`;

const ScreenReaderOnly = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const getToastIcon = (type: string) => {
  switch (type) {
    case 'success':
      return '✓';
    case 'error':
      return '✕';
    case 'warning':
      return '⚠';
    case 'info':
      return 'ℹ';
    default:
      return 'ℹ';
  }
};

const getAriaLabel = (type: string) => {
  switch (type) {
    case 'success':
      return 'Success notification';
    case 'error':
      return 'Error notification';
    case 'warning':
      return 'Warning notification';
    case 'info':
      return 'Information notification';
    default:
      return 'Notification';
  }
};

export const ToastNotifications = () => {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  return (
    <>
      {/* Screen reader live region */}
      <ScreenReaderOnly
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.length > 0 && toasts[toasts.length - 1]?.message}
      </ScreenReaderOnly>

      {/* Visual toast container */}
      <ToastContainer aria-label="Notifications">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            type={toast.type}
            role="alert"
            aria-label={getAriaLabel(toast.type)}
          >
            <ToastIcon aria-hidden="true">{getToastIcon(toast.type)}</ToastIcon>
            <ToastMessage>{toast.message}</ToastMessage>
            <CloseButton
              onClick={() => removeToast(toast.id)}
              aria-label={`Close ${toast.type} notification`}
            >
              ✕
            </CloseButton>
          </ToastItem>
        ))}
      </ToastContainer>
    </>
  );
};
