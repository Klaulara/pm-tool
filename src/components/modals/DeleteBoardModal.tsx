'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { Button, Input } from '@/components/ui';
import { ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalCloseButton, ModalBody } from '../ui/Modal';
import { useBoardStore } from '@/store/boardStore';

const ModalContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const WarningBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error.bg};
  border: 1px solid ${({ theme }) => theme.colors.error.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-start;
`;

const WarningIcon = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxl};
  line-height: 1;
`;

const WarningText = styled.div`
  flex: 1;
`;

const WarningTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.error.main};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

const WarningDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const BoardInfoBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const BoardName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const BoardDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const BoardStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const Stat = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  
  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  }
`;

const ConfirmSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  
  strong {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const FooterWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

interface DeleteBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  boardName: string;
}

const DeleteBoardModal = ({ isOpen, onClose, boardId, boardName }: DeleteBoardModalProps) => {
  const router = useRouter();
  const deleteBoard = useBoardStore((state) => state.deleteBoard);
  const boards = useBoardStore((state) => state.boards);
  const columns = useBoardStore((state) => state.columns);
  const tasks = useBoardStore((state) => state.tasks);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const board = boards.find(b => b.id === boardId);
  
  const boardColumns = columns.filter(col => col.boardId === boardId);
  const boardTasks = tasks.filter(task => task.boardId === boardId);
  const totalTasks = boardTasks.length;
  const totalColumns = boardColumns.length;

  const canDelete = confirmText === boardName;

  const handleDelete = async () => {
    if (!canDelete) return;
    
    setIsDeleting(true);
    try {
      deleteBoard(boardId);
      // Redirect to boards list after deletion
      router.push('/boards');
    } catch (error) {
      console.error('Error deleting board:', error);
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('');
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <ModalOverlay onClick={handleClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Eliminar Tablero</ModalTitle>
              <ModalCloseButton onClick={handleClose}>×</ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <ModalContentWrapper>
        <WarningBox>
          <WarningIcon>⚠️</WarningIcon>
          <WarningText>
            <WarningTitle>¡Cuidado! Esta acción no se puede deshacer</WarningTitle>
            <WarningDescription>
              Al eliminar este tablero, se eliminarán permanentemente todas las columnas, 
              tareas y datos asociados. Esta acción es irreversible.
            </WarningDescription>
          </WarningText>
        </WarningBox>

        <BoardInfoBox>
          <BoardName>{board?.name || 'Tablero'}</BoardName>
          <BoardDescription>{board?.description || 'Sin descripción'}</BoardDescription>
          <BoardStats>
            <Stat>
              <strong>{totalColumns}</strong> columnas
            </Stat>
            <Stat>
              <strong>{totalTasks}</strong> tareas
            </Stat>
          </BoardStats>
        </BoardInfoBox>

        <ConfirmSection>
          <Label>
            Por favor, escribe <strong>{boardName}</strong> para confirmar:
          </Label>
          <Input
            type="text"
            placeholder={`Escribe "${boardName}" aquí`}
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            disabled={isDeleting}
            autoFocus
          />
        </ConfirmSection>

        <FooterWrapper>
          <Button 
            variant="outline" 
            size="md" 
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            size="md" 
            onClick={handleDelete}
            disabled={!canDelete || isDeleting}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar Tablero'}
          </Button>
        </FooterWrapper>
      </ModalContentWrapper>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export { DeleteBoardModal };
