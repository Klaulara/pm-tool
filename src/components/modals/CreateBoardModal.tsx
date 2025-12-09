import React from 'react';
import { ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalCloseButton, ModalBody, ModalFooter } from '../ui/Modal';
import { FormGroup, Label, Input, Button } from '../ui';
import { useFocusTrap, useEscapeKey } from '@/hooks/useKeyboardNavigation';

interface CreateBoardModalProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (isOpen: boolean) => void;
    newBoardName: string;
    setNewBoardName: (name: string) => void;
    newBoardDescription: string;
    setNewBoardDescription: (description: string) => void;
    handleCreateBoard: () => void;
}

const CreateBoardModal = ({ isCreateModalOpen, setIsCreateModalOpen, newBoardName, setNewBoardName, newBoardDescription, setNewBoardDescription, handleCreateBoard }: CreateBoardModalProps) => {
    const modalRef = useFocusTrap(isCreateModalOpen);
    
    useEscapeKey(() => setIsCreateModalOpen(false), isCreateModalOpen);

    const handleSubmit = () => {
        if (newBoardName.trim()) {
            handleCreateBoard();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && newBoardName.trim()) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <ModalOverlay 
            $isOpen={isCreateModalOpen} 
            onClick={() => setIsCreateModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-board-title"
        >
            <ModalContent 
                ref={modalRef}
                size="md" 
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyPress}
            >
                <ModalHeader>
                    <ModalTitle id="create-board-title">Create new Board</ModalTitle>
                    <ModalCloseButton 
                        onClick={() => setIsCreateModalOpen(false)}
                        aria-label="Close modal"
                    >
                        ✕
                    </ModalCloseButton>
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
                        onClick={handleCreateBoard}
                        disabled={!newBoardName.trim()}
                        type="button"
                    >
                        Create Board
                    </Button>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    )
}

export default CreateBoardModal