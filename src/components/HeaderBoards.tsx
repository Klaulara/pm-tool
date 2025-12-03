
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

interface HeaderBoardsProps {
  board?: {
    name: string;
    description?: string;
  };
  setIsCreateModalOpen: (isOpen: boolean) => void;
  setBoardConfigurationModalOpen: (isOpen: boolean) => void;
}

const HeaderBoards = ({ 
  board, 
  setIsCreateModalOpen, 
  setBoardConfigurationModalOpen 
}: HeaderBoardsProps) => {

  const handleOpenCreateTaskModal = () => {
    setIsCreateModalOpen(true);
  }

  const handleOpenBoardConfigurationModal = () => {
    setBoardConfigurationModalOpen(true);
  };

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
                    <Button variant="outline" size="md"
                      onClick={handleOpenBoardConfigurationModal}>
                      <span>⚙️</span> Configurar
                    </Button>
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