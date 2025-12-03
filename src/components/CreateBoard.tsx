import React from 'react';
import styled from 'styled-components';
import { Card } from '@/components/ui';

const CreateBoardCard = styled(Card)`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  border: 2px dashed ${({ theme }) => theme.colors.border.main};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  transition: all ${({ theme }) => `${theme.transitions.duration.normal} ${theme.transitions.easing.smooth}`};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.main};
    background-color: ${({ theme }) => theme.colors.primary.main}10;
    transform: scale(1.02);
  }
`;

const CreateText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

interface CreateBoardProps {
  setIsCreateModalOpen: (isOpen: boolean) => void;
}

const CreateBoard = ({ setIsCreateModalOpen }: CreateBoardProps) => {
  return (
    <CreateBoardCard onClick={() => setIsCreateModalOpen(true)}>
      <CreateText>Create New Board</CreateText>
    </CreateBoardCard>
  )
}

export default CreateBoard