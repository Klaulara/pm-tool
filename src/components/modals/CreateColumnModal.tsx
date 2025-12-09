import { ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalCloseButton, ModalBody, ModalFooter } from '../ui/Modal';
import { FormGroup, Label, Input, Button } from '../ui'

interface CreateColumnModalProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (isOpen: boolean) => void;
    newColumnName: string;
    setNewColumnName: (name: string) => void;
    newColumnColor: string;
    setNewColumnColor: (color: string) => void;
    handleColumnCreate: () => void;
}

const CreateColumnModal = ({ isCreateModalOpen, setIsCreateModalOpen, newColumnName, setNewColumnName, newColumnColor, setNewColumnColor, handleColumnCreate }: CreateColumnModalProps) => {
    const isValidName = newColumnName.trim().length >= 2 && newColumnName.trim().length <= 50;
    
    return (
        <ModalOverlay $isOpen={isCreateModalOpen} onClick={() => setIsCreateModalOpen(false)}>
            <ModalContent size="md" onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>Create new column</ModalTitle>
                    <ModalCloseButton onClick={() => setIsCreateModalOpen(false)}>✕</ModalCloseButton>
                </ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <Label htmlFor="column-name">Column Name *</Label>
                        <Input
                            id="column-name"
                            type="text"
                            placeholder="e.g., Development"
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                            $fullWidth
                            autoFocus
                            maxLength={50}
                        />
                        {newColumnName.trim().length > 0 && newColumnName.trim().length < 2 && (
                            <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                                Minimum 2 characters required
                            </span>
                        )}
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="column-color">Color</Label>
                        <Input
                            id="column-color"
                            type="color"
                            placeholder="Brief description of the column"
                            value={newColumnColor}
                            onChange={(e) => setNewColumnColor(e.target.value)}
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
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleColumnCreate}
                        disabled={!isValidName}
                        type="button"
                    >
                        Create Column
                    </Button>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    )
}

export default CreateColumnModal