'use client';

import { useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styled from 'styled-components';
import { useBoardStore } from '@/store/boards';

const SideMenuContainer = styled.aside<{ $isCollapsed: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${({ $isCollapsed }) => $isCollapsed ? '60px' : '280px'};
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  transition: width 0.3s ease;
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
`;

const MenuHeader = styled.div<{ $isCollapsed: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => $isCollapsed ? 'center' : 'space-between'};
  min-height: 70px;
`;

const Logo = styled.div<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: #ffffff;
  white-space: nowrap;
  opacity: ${({ $isCollapsed }) => $isCollapsed ? 0 : 1};
  visibility: ${({ $isCollapsed }) => $isCollapsed ? 'hidden' : 'visible'};
  position: ${({ $isCollapsed }) => $isCollapsed ? 'absolute' : 'relative'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

const LogoIcon = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  min-width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ToggleButton = styled.button<{ $isCollapsed: boolean }>`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  min-width: ${({ $isCollapsed }) => $isCollapsed ? '40px' : '32px'};
  min-height: ${({ $isCollapsed }) => $isCollapsed ? '40px' : '32px'};
  z-index: 10;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: #ffffff;
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const MenuContent = styled.div<{ $isCollapsed: boolean }>`
  flex: 1;
  overflow-y: ${({ $isCollapsed }) => $isCollapsed ? 'visible' : 'auto'};
  padding: ${({ theme }) => theme.spacing.md} 0;
  display: ${({ $isCollapsed }) => $isCollapsed ? 'flex' : 'block'};
  flex-direction: ${({ $isCollapsed }) => $isCollapsed ? 'column' : 'row'};
  align-items: ${({ $isCollapsed }) => $isCollapsed ? 'center' : 'stretch'};
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: ${({ theme }) => theme.borderRadius.full};
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const MenuSection = styled.div<{ $isCollapsed?: boolean }>`
  margin-bottom: ${({ theme, $isCollapsed }) => $isCollapsed ? theme.spacing.sm : theme.spacing.lg};
  width: 100%;
`;

const SectionTitle = styled.div<{ $isCollapsed: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: ${({ $isCollapsed }) => $isCollapsed ? 0 : 1};
  visibility: ${({ $isCollapsed }) => $isCollapsed ? 'hidden' : 'visible'};
  height: ${({ $isCollapsed }) => $isCollapsed ? '0' : 'auto'};
  overflow: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease, height 0.3s ease;
  white-space: nowrap;
`;

const MenuItem = styled.button<{ $active?: boolean; $isCollapsed: boolean }>`
  width: 100%;
  padding: ${({ theme, $isCollapsed }) => $isCollapsed ? theme.spacing.sm : `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: ${({ $active }) => $active ? 'rgba(59, 130, 246, 0.15)' : 'none'};
  border: none;
  border-left: 3px solid ${({ $active }) => $active ? '#3b82f6' : 'transparent'};
  color: ${({ $active }) => $active ? '#60a5fa' : 'rgba(255, 255, 255, 0.7)'};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ $active, theme }) => $active ? theme.typography.fontWeights.semibold : theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => $isCollapsed ? 'center' : 'flex-start'};
  gap: ${({ theme }) => theme.spacing.sm};
  text-align: left;
  position: relative;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: #ffffff;
  }
`;

const MenuIcon = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  min-width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MenuText = styled.span<{ $isCollapsed: boolean }>`
  opacity: ${({ $isCollapsed }) => $isCollapsed ? 0 : 1};
  visibility: ${({ $isCollapsed }) => $isCollapsed ? 'hidden' : 'visible'};
  width: ${({ $isCollapsed }) => $isCollapsed ? 0 : 'auto'};
  transition: opacity 0.3s ease, visibility 0.3s ease, width 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const BoardCount = styled.span<{ $isCollapsed: boolean }>`
  background-color: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  opacity: ${({ $isCollapsed }) => $isCollapsed ? 0 : 1};
  transition: opacity 0.3s ease;
`;

const StarIcon = styled.span<{ $isCollapsed: boolean }>`
  color: #fbbf24;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  opacity: ${({ $isCollapsed }) => $isCollapsed ? 0 : 1};
  transition: opacity 0.3s ease;
`;

const MenuFooter = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

interface SideMenuProps {
  isCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

export const SideMenu = ({ isCollapsed: controlledCollapsed, onToggle }: SideMenuProps) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const boardsData = useBoardStore((state) => state.boards);
  const boards = useMemo(() => {
    const { byId, allIds } = boardsData;
    return allIds.map((id) => byId[id]);
  }, [boardsData]);

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  const handleToggle = () => {
    const newValue = !isCollapsed;
    if (onToggle) {
      onToggle(newValue);
    } else {
      setInternalCollapsed(newValue);
    }
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => pathname === path;
  const isBoardActive = (boardId: string) => pathname === `/boards/${boardId}`;

  // Separate starred and regular boards
  const starredBoards = boards.filter((board) => board.isStarred);
  const regularBoards = boards.filter((board) => !board.isStarred);

  return (
    <SideMenuContainer $isCollapsed={isCollapsed}>
      <MenuHeader $isCollapsed={isCollapsed}>
        <Logo $isCollapsed={isCollapsed}>
          <LogoIcon>📋</LogoIcon>
          PM Tool
        </Logo>
        <ToggleButton onClick={handleToggle} $isCollapsed={isCollapsed} title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}>
          {isCollapsed ? '»' : '«'}
        </ToggleButton>
      </MenuHeader>

      <MenuContent $isCollapsed={isCollapsed}>
        <MenuSection $isCollapsed={isCollapsed}>
          <MenuItem
            $active={isActive('/')}
            $isCollapsed={isCollapsed}
            onClick={() => handleNavigate('/')}
          >
            <MenuIcon>🏠</MenuIcon>
            <MenuText $isCollapsed={isCollapsed}>Dashboard</MenuText>
          </MenuItem>

          <MenuItem
            $active={isActive('/boards')}
            $isCollapsed={isCollapsed}
            onClick={() => handleNavigate('/boards')}
          >
            <MenuIcon>📊</MenuIcon>
            <MenuText $isCollapsed={isCollapsed}>Todos los Tableros</MenuText>
            {!isCollapsed && <BoardCount $isCollapsed={isCollapsed}>{boards.length}</BoardCount>}
          </MenuItem>

          <MenuItem
            $active={isActive('/tasks')}
            $isCollapsed={isCollapsed}
            onClick={() => handleNavigate('/tasks')}
          >
            <MenuIcon>✅</MenuIcon>
            <MenuText $isCollapsed={isCollapsed}>Todas las Tareas</MenuText>
          </MenuItem>
        </MenuSection>

        {starredBoards.length > 0 && (
          <MenuSection $isCollapsed={isCollapsed}>
            <SectionTitle $isCollapsed={isCollapsed}>Favoritos</SectionTitle>
            {starredBoards.map((board) => (
              <MenuItem
                key={board.id}
                $active={isBoardActive(board.id)}
                $isCollapsed={isCollapsed}
                onClick={() => handleNavigate(`/boards/${board.id}`)}
              >
                <MenuIcon>📋</MenuIcon>
                <MenuText $isCollapsed={isCollapsed}>{board.name}</MenuText>
                {!isCollapsed && <StarIcon $isCollapsed={isCollapsed}>⭐</StarIcon>}
              </MenuItem>
            ))}
          </MenuSection>
        )}

        {regularBoards.length > 0 && (
          <MenuSection $isCollapsed={isCollapsed}>
            <SectionTitle $isCollapsed={isCollapsed}>Tableros</SectionTitle>
            {regularBoards.slice(0, 10).map((board) => (
              <MenuItem
                key={board.id}
                $active={isBoardActive(board.id)}
                $isCollapsed={isCollapsed}
                onClick={() => handleNavigate(`/boards/${board.id}`)}
              >
                <MenuIcon>📋</MenuIcon>
                <MenuText $isCollapsed={isCollapsed}>{board.name}</MenuText>
              </MenuItem>
            ))}
          </MenuSection>
        )}
      </MenuContent>

      <MenuFooter>
        <MenuItem $isCollapsed={isCollapsed} onClick={() => {}}>
          <MenuIcon>⚙️</MenuIcon>
          <MenuText $isCollapsed={isCollapsed}>Configuración</MenuText>
        </MenuItem>
      </MenuFooter>
    </SideMenuContainer>
  );
};
