'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { SideMenu } from './SideMenu';

const SkipLink = styled.a`
  position: absolute;
  top: -40px;
  left: 0;
  background: ${({ theme }) => theme.colors.primary.main};
  color: white;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.md} 0;
  z-index: 10000;
  font-weight: 600;

  &:focus {
    top: 0;
  }
`;

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const MainContent = styled.main<{ $sideMenuWidth: number }>`
  flex: 1;
  margin-left: ${({ $sideMenuWidth }) => $sideMenuWidth}px;
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-left: 0;
  }
`;

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const sideMenuWidth = isMenuCollapsed ? 60 : 280;

  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <LayoutContainer>
        <SideMenu isCollapsed={isMenuCollapsed} onToggle={setIsMenuCollapsed} />
        <MainContent 
          id="main-content"
          $sideMenuWidth={sideMenuWidth}
          role="main"
          aria-label="Main content"
        >
          {children}
        </MainContent>
      </LayoutContainer>
    </>
  );
};
