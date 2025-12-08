'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { SideMenu } from './SideMenu';

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
`;

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const sideMenuWidth = isMenuCollapsed ? 60 : 280;

  return (
    <LayoutContainer>
      <SideMenu isCollapsed={isMenuCollapsed} onToggle={setIsMenuCollapsed} />
      <MainContent $sideMenuWidth={sideMenuWidth}>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};
