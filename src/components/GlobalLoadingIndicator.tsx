'use client';

import { useUIStore } from '@/store/ui';
import styled from 'styled-components';

const LoadingOverlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: ${({ $show }) => ($show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: white;
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: 500;
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

export const GlobalLoadingIndicator = () => {
  const loading = useUIStore((state) => state.loading);
  const isGlobalLoading = Object.values(loading).some((value) => value === true);

  return (
    <>
      {/* Screen reader announcement */}
      <ScreenReaderOnly
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {isGlobalLoading ? 'Loading content, please wait' : ''}
      </ScreenReaderOnly>

      {/* Visual loading overlay */}
      <LoadingOverlay
        $show={isGlobalLoading}
        role="progressbar"
        aria-busy={isGlobalLoading}
        aria-label="Loading content"
      >
        <div style={{ textAlign: 'center' }}>
          <LoadingSpinner aria-hidden="true" />
          <LoadingText>Loading...</LoadingText>
        </div>
      </LoadingOverlay>
    </>
  );
};
