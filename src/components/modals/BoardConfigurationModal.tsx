import React from 'react';
import { ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalCloseButton, ModalBody, ModalFooter } from '../ui/Modal';
import { FormGroup, Label, Input, Button } from '../ui'

interface CreateBoardModalProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (isOpen: boolean) => void;
    newBoardName: string;
    setNewBoardName: (name: string) => void;
    newBoardDescription: string;
    setNewBoardDescription: (description: string) => void;
    handleEditBoard: () => void;
}

const BoardConfigurationModal = ({ isCreateModalOpen, setIsCreateModalOpen, newBoardName, setNewBoardName, newBoardDescription, setNewBoardDescription, handleEditBoard }: CreateBoardModalProps) => {
    return (
        <ModalOverlay isOpen={isCreateModalOpen} onClick={() => setIsCreateModalOpen(false)}>
            <ModalContent size="md" onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>Configurar Tablero</ModalTitle>
                    <ModalCloseButton onClick={() => setIsCreateModalOpen(false)}>✕</ModalCloseButton>
                </ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <Label htmlFor="board-name">Nombre del Tablero *</Label>
                        <Input
                            id="board-name"
                            type="text"
                            placeholder="Ej: Desarrollo Web"
                            value={newBoardName}
                            onChange={(e) => setNewBoardName(e.target.value)}
                            fullWidth
                            autoFocus
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="board-description">Descripción</Label>
                        <Input
                            id="board-description"
                            type="text"
                            placeholder="Breve descripción del tablero"
                            value={newBoardDescription}
                            onChange={(e) => setNewBoardDescription(e.target.value)}
                            fullWidth
                        />
                    </FormGroup>
                </ModalBody>

                <ModalFooter>
                    <Button
                        variant="ghost"
                        onClick={() => setIsCreateModalOpen(false)}
                        type="button"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleEditBoard}
                        disabled={!newBoardName.trim()}
                        type="button"
                    >
                        Editar Tablero
                    </Button>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    )
}

export default BoardConfigurationModal