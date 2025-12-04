import React from 'react';
import styled from 'styled-components';

const AddColumnStyleButton = styled.button`
  min-width: 320px;
  max-width: 320px;
  height: 66px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 2px dashed ${({ theme }) => theme.colors.neutral[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border-color: ${({ theme }) => theme.colors.primary.main};
    color: ${({ theme }) => theme.colors.primary.main};
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const AddColumnButton = ({ onAddColumn }: { onAddColumn: () => void }) => {

    const handleAddColumn = () => {
        // Logic to add a new column to the board with id `boardId`
       onAddColumn();
    }

    return (
        <AddColumnStyleButton onClick={handleAddColumn}>
            <span>+ Add Column</span>
        </AddColumnStyleButton>
    )
}

export default AddColumnButton