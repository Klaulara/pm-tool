
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Flex, Button } from './ui';
import { ThemeToggle } from './ThemeToggle';

const BoardHeader = styled.header`
  padding: ${({ theme }) => theme.spacing.lg} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  background-color: ${({ theme }) => theme.colors.background.primary};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  backdrop-filter: blur(8px);
  background-color: ${({ theme }) => theme.colors.background.primary}e6;
`;

const BoardTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const BoardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  line-height: 1;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
    border-color: ${({ theme }) => theme.colors.border.main};
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 220px;
  z-index: 1000;
  display: ${({ $isOpen }) => $isOpen ? 'block' : 'none'};
  overflow: hidden;
`;

const DropdownItem = styled.button<{ $variant?: 'default' | 'danger' }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: ${({ theme, $variant }) => 
    $variant === 'danger' ? theme.colors.error.main : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    background-color: ${({ theme, $variant }) => 
      $variant === 'danger' ? theme.colors.error.bg : theme.colors.background.secondary};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  }
`;

interface HeaderBoardsProps {
  board?: {
    name: string;
    description?: string;
  };
  setIsCreateModalOpen: (isOpen: boolean) => void;
  setBoardConfigurationModalOpen: (isOpen: boolean) => void;
  setIsManageTagsModalOpen: (isOpen: boolean) => void;
  setIsDeleteBoardModalOpen: (isOpen: boolean) => void;
}

const HeaderBoards = ({ 
  board, 
  setIsCreateModalOpen, 
  setBoardConfigurationModalOpen,
  setIsManageTagsModalOpen,
  setIsDeleteBoardModalOpen
}: HeaderBoardsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOpenCreateTaskModal = () => {
    setIsCreateModalOpen(true);
  }

  const handleOpenBoardConfigurationModal = () => {
    setBoardConfigurationModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleOpenManageTagsModal = () => {
    setIsManageTagsModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleOpenDeleteBoardModal = () => {
    setIsDeleteBoardModalOpen(true);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <BoardHeader>
            <Container maxWidth="full">
                <Flex justify="between" align="center">
                  <div>
                    <BoardTitle>{board?.name || 'Tablero de Proyectos'}</BoardTitle>
                    <BoardDescription>
                      {board?.description || 'Gestiona tus tareas de forma visual y eficiente'}
                    </BoardDescription>
                  </div>
                  <Flex gap="md" align="center">
                    <DropdownContainer ref={dropdownRef}>
                      <DropdownButton onClick={toggleDropdown}>
                        <span>⋮</span>
                      </DropdownButton>
                      <DropdownMenu $isOpen={isDropdownOpen}>
                        <DropdownItem onClick={handleOpenBoardConfigurationModal}>
                          ⚙️ Configurar Tablero
                        </DropdownItem>
                        <DropdownItem onClick={handleOpenManageTagsModal}>
                          🏷️ Administrar Tags
                        </DropdownItem>
                        <DropdownItem onClick={handleOpenDeleteBoardModal} $variant="danger">
                          🗑️ Eliminar Tablero
                        </DropdownItem>
                      </DropdownMenu>
                    </DropdownContainer>
                    <Button variant="primary" size="md"
                      onClick={handleOpenCreateTaskModal}>
                      <span>➕</span> Nueva Tarea
                    </Button>
                    <ThemeToggle />
                  </Flex>
                </Flex>
            </Container>
          </BoardHeader>
  )
}

export { HeaderBoards }