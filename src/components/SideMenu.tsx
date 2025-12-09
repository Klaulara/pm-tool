'use client';

import { useState, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styled from 'styled-components';
import { useBoardStore } from '@/store/boards';
import { useEscapeKey } from '@/hooks/useKeyboardNavigation';

const SideMenuContainer = styled.aside<{ $isCollapsed: boolean; $isMobileOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${({ $isCollapsed }) => $isCollapsed ? '60px' : '280px'};
  background: linear-gradient(180deg, ${({ theme }) => theme.colors.background.secondary} 0%, ${({ theme }) => theme.colors.background.tertiary} 100%);
  border-right: 1px solid ${({ theme }) => theme.colors.border.light};
  transition: transform 0.3s ease, width 0.3s ease;
  z-index: ${({ theme }) => theme.zIndex.modal};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    transform: translateY(${({ $isMobileOpen }) => $isMobileOpen ? '0' : '-100%'});
    width: 100%;
    height: auto;
    max-height: 90vh;
    left: 0;
    right: 0;
    z-index: ${({ theme }) => theme.zIndex.modal + 10};
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  }
`;

const MobileOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${({ $isOpen }) => $isOpen ? 1 : 0};
  visibility: ${({ $isOpen }) => $isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: ${({ theme }) => theme.zIndex.modal + 5};
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

const HamburgerButton = styled.button`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: ${({ theme }) => theme.zIndex.modal + 11};
  background-color: ${({ theme }) => theme.colors.primary.main};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.dark};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const HamburgerIcon = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 20px;

  span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: white;
    border-radius: 2px;
    transition: all 0.3s ease;
  }
`;

const MenuHeader = styled.div<{ $isCollapsed: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  display: flex;
  align-items: center;
  justify-content: ${({ $isCollapsed }) => $isCollapsed ? 'center' : 'space-between'};
  min-height: 70px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    justify-content: center;
  }
`;

const Logo = styled.div<{ $isCollapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
  opacity: ${({ $isCollapsed }) => $isCollapsed ? 0 : 1};
  visibility: ${({ $isCollapsed }) => $isCollapsed ? 'hidden' : 'visible'};
  position: ${({ $isCollapsed }) => $isCollapsed ? 'absolute' : 'relative'};
  transition: opacity 0.3s ease, visibility 0.3s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    opacity: 1;
    visibility: visible;
    position: relative;
  }
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
  color: ${({ theme }) => theme.colors.text.secondary};
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
    background-color: ${({ theme }) => theme.colors.background.tertiary};
    color: ${({ theme }) => theme.colors.text.primary};
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
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
    background: ${({ theme }) => theme.colors.border.main};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    
    &:hover {
      background: ${({ theme }) => theme.colors.border.dark};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    overflow-y: auto;
    display: block;
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
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: ${({ $isCollapsed }) => $isCollapsed ? 0 : 1};
  visibility: ${({ $isCollapsed }) => $isCollapsed ? 'hidden' : 'visible'};
  height: ${({ $isCollapsed }) => $isCollapsed ? '0' : 'auto'};
  overflow: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease, height 0.3s ease;
  white-space: nowrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    opacity: 1;
    visibility: visible;
    height: auto;
  }
`;

const MenuItem = styled.button<{ $active?: boolean; $isCollapsed: boolean }>`
  width: 100%;
  padding: ${({ theme, $isCollapsed }) => $isCollapsed ? theme.spacing.sm : `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: ${({ $active, theme }) => $active ? theme.colors.primary.main + '26' : 'none'};
  border: none;
  border-left: 3px solid ${({ $active, theme }) => $active ? theme.colors.primary.main : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.primary.main : theme.colors.text.secondary};
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
    background-color: ${({ theme }) => theme.colors.background.tertiary};
    color: ${({ theme }) => theme.colors.text.primary};
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

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    opacity: 1;
    visibility: visible;
    width: auto;
  }
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

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    opacity: 1;
  }
`;

const StarIcon = styled.span<{ $isCollapsed: boolean }>`
  color: #fbbf24;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  opacity: ${({ $isCollapsed }) => $isCollapsed ? 0 : 1};
  transition: opacity 0.3s ease;
`;

const MenuFooter = styled.div<{ $isCollapsed: boolean }>`
  margin-top: auto;
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  background: ${({ theme }) => theme.colors.background.tertiary};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }) => theme.colors.border.light};
  }
`;

interface SideMenuProps {
  isCollapsed?: boolean;
  onToggle?: (collapsed: boolean) => void;
}

export const SideMenu = ({ isCollapsed: controlledCollapsed, onToggle }: SideMenuProps) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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

  const handleMobileToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleMobileClose = () => {
    setIsMobileOpen(false);
  };

  // Close mobile menu on Escape key
  useEscapeKey(handleMobileClose, isMobileOpen);

  const handleNavigate = (path: string) => {
    router.push(path);
    handleMobileClose(); // Close mobile menu on navigation
  };

  const isActive = (path: string) => pathname === path;
  const isBoardActive = (boardId: string) => pathname === `/boards/${boardId}`;

  // Separate starred and regular boards
  const starredBoards = boards.filter((board) => board.isStarred);
  const regularBoards = boards.filter((board) => !board.isStarred);

  return (
    <>
      <HamburgerButton onClick={handleMobileToggle} aria-label="Toggle menu">
        <HamburgerIcon>
          <span />
          <span />
          <span />
        </HamburgerIcon>
      </HamburgerButton>

      <MobileOverlay 
        $isOpen={isMobileOpen} 
        onClick={handleMobileClose}
        aria-hidden="true"
      />

      <SideMenuContainer 
        $isCollapsed={isCollapsed} 
        $isMobileOpen={isMobileOpen}
        role="navigation"
        aria-label="Main navigation"
      >
        <MenuHeader $isCollapsed={isCollapsed}>
        <Logo $isCollapsed={isCollapsed}>
          <LogoIcon aria-hidden="true">📋</LogoIcon>
          Task Manager
        </Logo>
        <ToggleButton 
          onClick={handleToggle} 
          $isCollapsed={isCollapsed} 
          aria-label={isCollapsed ? 'Expand menu' : 'Collapse menu'}
          aria-expanded={!isCollapsed}
        >
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
            <MenuText $isCollapsed={isCollapsed}>All Boards</MenuText>
            {!isCollapsed && <BoardCount $isCollapsed={isCollapsed}>{boards.length}</BoardCount>}
          </MenuItem>

          <MenuItem
            $active={isActive('/tasks')}
            $isCollapsed={isCollapsed}
            onClick={() => handleNavigate('/tasks')}
            role="menuitem"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNavigate('/tasks');
              }
            }}
          >
            <MenuIcon aria-hidden="true">✅</MenuIcon>
            <MenuText $isCollapsed={isCollapsed}>All Tasks</MenuText>
          </MenuItem>
        </MenuSection>

        {starredBoards.length > 0 && (
          <MenuSection 
            $isCollapsed={isCollapsed}
            role="menu"
            aria-label="Favorite boards"
          >
            <SectionTitle $isCollapsed={isCollapsed}>Favorites</SectionTitle>
            {starredBoards.map((board) => (
              <MenuItem
                key={board.id}
                $active={isBoardActive(board.id)}
                $isCollapsed={isCollapsed}
                onClick={() => handleNavigate(`/boards/${board.id}`)}
                role="menuitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleNavigate(`/boards/${board.id}`);
                  }
                }}
                aria-label={`${board.name} board (favorite)`}
              >
                <MenuIcon aria-hidden="true">📋</MenuIcon>
                <MenuText $isCollapsed={isCollapsed}>{board.name}</MenuText>
                {!isCollapsed && <StarIcon $isCollapsed={isCollapsed} aria-label="Starred">⭐</StarIcon>}
              </MenuItem>
            ))}
          </MenuSection>
        )}

        {regularBoards.length > 0 && (
          <MenuSection $isCollapsed={isCollapsed}>
            <SectionTitle $isCollapsed={isCollapsed}>Boards</SectionTitle>
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

      <MenuFooter $isCollapsed={isCollapsed}>
        <MenuItem
            $active={isActive('/settings')}
            $isCollapsed={isCollapsed}
            onClick={() => handleNavigate('/settings')}
          >
            <MenuIcon>⚙️</MenuIcon>
            <MenuText $isCollapsed={isCollapsed}>Settings</MenuText>
          </MenuItem>
      </MenuFooter>
    </SideMenuContainer>
    </>
  );
};
