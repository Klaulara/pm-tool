import React from 'react';
import styled from 'styled-components';
import { ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalCloseButton, ModalBody, ModalFooter } from '../ui/Modal';
import { FormGroup, Label, Input, Button, CheckboxWrapper, CheckboxInput, CheckboxLabel } from '../ui';

const StarIcon = styled.span<{ $isStarred: boolean }>`
  font-size: 1.2em;
  margin-right: ${({ theme }) => theme.spacing.sm};
  color: ${({ $isStarred }) => ($isStarred ? '#F59E0B' : '#9CA3AF')};
`;

interface CreateBoardModalProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (isOpen: boolean) => void;
    newBoardName: string;
    setNewBoardName: (name: string) => void;
    newBoardDescription: string;
    setNewBoardDescription: (description: string) => void;
    isStarred: boolean;
    setIsStarred: (isStarred: boolean) => void;
    handleEditBoard: () => void;
}

const BoardConfigurationModal = ({ isCreateModalOpen, setIsCreateModalOpen, newBoardName, setNewBoardName, newBoardDescription, setNewBoardDescription, isStarred, setIsStarred, handleEditBoard }: CreateBoardModalProps) => {
    return (
        <ModalOverlay $isOpen={isCreateModalOpen} onClick={() => setIsCreateModalOpen(false)}>
            <ModalContent size="md" onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>Configure Board</ModalTitle>
                    <ModalCloseButton onClick={() => setIsCreateModalOpen(false)}>✕</ModalCloseButton>
                </ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <Label htmlFor="board-name">Board Name *</Label>
                        <Input
                            id="board-name"
                            type="text"
                            placeholder="E.g., Web Development"
                            value={newBoardName}
                            onChange={(e) => setNewBoardName(e.target.value)}
                            $fullWidth
                            autoFocus
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="board-description">Description</Label>
                        <Input
                            id="board-description"
                            type="text"
                            placeholder="Brief description of the board"
                            value={newBoardDescription}
                            onChange={(e) => setNewBoardDescription(e.target.value)}
                            $fullWidth
                        />
                    </FormGroup>

                    <FormGroup>
                        <CheckboxWrapper>
                            <CheckboxInput
                                id="board-starred"
                                type="checkbox"
                                checked={isStarred}
                                onChange={(e) => setIsStarred(e.target.checked)}
                            />
                            <CheckboxLabel>
                                <StarIcon $isStarred={isStarred}>⭐</StarIcon>
                                Mark as favorite
                            </CheckboxLabel>
                        </CheckboxWrapper>
                    </FormGroup>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="ghost"
                        onClick={() => setIsCreateModalOpen(false)}
                        type="button"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleEditBoard}
                        disabled={!newBoardName.trim()}
                        type="button"
                    >
                        Edit Board
                    </Button>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    )
}

export default BoardConfigurationModal