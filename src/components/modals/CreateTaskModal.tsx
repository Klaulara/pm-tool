import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalCloseButton, ModalBody, ModalFooter } from '../ui/Modal';
import { FormGroup, Label, Input, Button, Select } from '../ui';
import type { Tags } from '@/store/boardStore';

const TabContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ $active, theme }) => $active ? theme.colors.primary.main : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.primary.main : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  resize: vertical;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.light}33;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

const MarkdownPreview = styled.div`
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  h1, h2, h3, h4, h5, h6 {
    margin-top: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  ul, ol {
    margin-left: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  code {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    padding: 2px 4px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-family: monospace;
    font-size: 0.9em;
  }
  
  pre {
    background-color: ${({ theme }) => theme.colors.neutral[100]};
    padding: ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    overflow-x: auto;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    
    code {
      background: none;
      padding: 0;
    }
  }
  
  blockquote {
    border-left: 3px solid ${({ theme }) => theme.colors.primary.main};
    padding-left: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

const EmptyPreview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-style: italic;
`;

const ErrorMessage = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.error.main};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const CharacterCount = styled.span<{ $isError?: boolean }>`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme, $isError }) => $isError ? theme.colors.error.main : theme.colors.text.tertiary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  text-align: right;
`;

const InputWrapper = styled.div<{ $hasError?: boolean }>`
  input, textarea, select {
    border-color: ${({ theme, $hasError }) => $hasError ? theme.colors.error.main : theme.colors.border.light};
    
    &:focus {
      border-color: ${({ theme, $hasError }) => $hasError ? theme.colors.error.main : theme.colors.primary.main};
      box-shadow: 0 0 0 3px ${({ theme, $hasError }) => 
        $hasError ? theme.colors.error.bg : theme.colors.primary.light}33;
    }
  }
`;

const TagsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const AvailableTagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  min-height: 40px;
  max-height: 120px;
  overflow-y: auto;
`;

const TagChip = styled.button<{ $color?: string; $selected?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background-color: ${({ $color }) => $color || '#e5e7eb'};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 2px solid ${({ $selected, theme }) => $selected ? theme.colors.primary.main : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const EmptyTagsMessage = styled.p`
  color: ${({ theme }) => theme.colors.text.tertiary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-style: italic;
  margin: 0;
`;

interface CreateBoardModalProps {
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (isOpen: boolean) => void;
    newTaskName: string;
    setNewTaskName: (name: string) => void;
    newTaskDescription: string;
    setNewTaskDescription: (description: string) => void;
    newTaskPriority: string;
    setNewTaskPriority: (priority: string) => void;
    newTaskDueDate: string;
    setNewTaskDueDate: (dueDate: string) => void;
    newTaskEstimatedHours?: number;
    setNewTaskEstimatedHours?: (hours: number) => void;
    selectedTags?: Tags[];
    setSelectedTags?: (tags: Tags[]) => void;
    availableTags?: Tags[];
    handleCreateTask: (createAnother?: boolean) => void;
}

const CreateTaskModal = ({ 
    isCreateModalOpen, 
    setIsCreateModalOpen, 
    newTaskName, 
    setNewTaskName, 
    newTaskDescription, 
    setNewTaskDescription, 
    newTaskPriority, 
    setNewTaskPriority, 
    newTaskDueDate,
    setNewTaskDueDate,
    newTaskEstimatedHours,
    setNewTaskEstimatedHours,
    selectedTags = [],
    setSelectedTags,
    availableTags = [],
    handleCreateTask }: CreateBoardModalProps) => {
    
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
    const [errors, setErrors] = useState({
        title: '',
        description: '',
        dueDate: '',
        estimatedHours: '',
    });
    const [touched, setTouched] = useState({
        title: false,
        description: false,
        dueDate: false,
        estimatedHours: false,
    });

    // Validación en tiempo real
    const validateTitle = (value: string) => {
        if (!value.trim()) {
            return 'Title is required';
        }
        if (value.trim().length < 3) {
            return 'Title must be at least 3 characters';
        }
        if (value.length > 100) {
            return 'Title cannot exceed 100 characters';
        }
        return '';
    };

    const validateDescription = (value: string) => {
        if (value.length > 1000) {
            return 'Description cannot exceed 1000 characters';
        }
        return '';
    };

    const validateDueDate = (value: string) => {
        if (!value) return ''; // Optional field
        
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            return 'Due date cannot be in the past';
        }
        return '';
    };

    const validateEstimatedHours = (value: number | undefined) => {
        if (value === undefined || value === 0) return ''; // Optional field
        
        if (value < 0) {
            return 'Estimated hours must be a positive number';
        }
        if (value > 999) {
            return 'Estimated hours seems too high (max 999)';
        }
        return '';
    };

    // Actualizar errores cuando cambian los valores
    const handleTitleChange = (value: string) => {
        setNewTaskName(value);
        if (touched.title) {
            setErrors(prev => ({ ...prev, title: validateTitle(value) }));
        }
    };

    const handleDescriptionChange = (value: string) => {
        setNewTaskDescription(value);
        if (touched.description) {
            setErrors(prev => ({ ...prev, description: validateDescription(value) }));
        }
    };

    const handleDueDateChange = (value: string) => {
        setNewTaskDueDate(value);
        if (touched.dueDate) {
            setErrors(prev => ({ ...prev, dueDate: validateDueDate(value) }));
        }
    };

    const handleEstimatedHoursChange = (value: string) => {
        const hours = value ? parseFloat(value) : 0;
        setNewTaskEstimatedHours?.(hours);
        if (touched.estimatedHours) {
            setErrors(prev => ({ ...prev, estimatedHours: validateEstimatedHours(hours) }));
        }
    };

    const handleBlur = (field: keyof typeof touched) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        
        // Validar el campo cuando pierde el foco
        switch (field) {
            case 'title':
                setErrors(prev => ({ ...prev, title: validateTitle(newTaskName) }));
                break;
            case 'description':
                setErrors(prev => ({ ...prev, description: validateDescription(newTaskDescription) }));
                break;
            case 'dueDate':
                setErrors(prev => ({ ...prev, dueDate: validateDueDate(newTaskDueDate) }));
                break;
            case 'estimatedHours':
                setErrors(prev => ({ ...prev, estimatedHours: validateEstimatedHours(newTaskEstimatedHours) }));
                break;
        }
    };

    const isFormValid = () => {
        const titleError = validateTitle(newTaskName);
        const descriptionError = validateDescription(newTaskDescription);
        const dueDateError = validateDueDate(newTaskDueDate);
        const estimatedHoursError = validateEstimatedHours(newTaskEstimatedHours);
        
        return !titleError && !descriptionError && !dueDateError && !estimatedHoursError;
    };

    const handleSubmit = (createAnother: boolean = false) => {
        // Marcar todos los campos como touched
        setTouched({
            title: true,
            description: true,
            dueDate: true,
            estimatedHours: true,
        });

        // Validar todos los campos
        const titleError = validateTitle(newTaskName);
        const descriptionError = validateDescription(newTaskDescription);
        const dueDateError = validateDueDate(newTaskDueDate);
        const estimatedHoursError = validateEstimatedHours(newTaskEstimatedHours);

        setErrors({
            title: titleError,
            description: descriptionError,
            dueDate: dueDateError,
            estimatedHours: estimatedHoursError,
        });

        // Si hay errores, no enviar
        if (titleError || descriptionError || dueDateError || estimatedHoursError) {
            return;
        }

        handleCreateTask(createAnother);
        
        // Reset errors and touched if creating another
        if (createAnother) {
            setErrors({
                title: '',
                description: '',
                dueDate: '',
                estimatedHours: '',
            });
            setTouched({
                title: false,
                description: false,
                dueDate: false,
                estimatedHours: false,
            });
        }
    };

    const handleToggleTag = (tag: Tags) => {
        if (!setSelectedTags) return;
        
        const isSelected = selectedTags.some(t => t.id === tag.id);
        if (isSelected) {
            setSelectedTags(selectedTags.filter(t => t.id !== tag.id));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };
    
    return (
        <ModalOverlay isOpen={isCreateModalOpen} onClick={() => setIsCreateModalOpen(false)}>
            <ModalContent size="md" onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>Crear Nueva Tarea</ModalTitle>
                    <ModalCloseButton onClick={() => setIsCreateModalOpen(false)}>✕</ModalCloseButton>
                </ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <Label htmlFor="task-name">Task Name *</Label>
                        <InputWrapper $hasError={touched.title && !!errors.title}>
                            <Input
                                id="task-name"
                                type="text"
                                placeholder="Enter task name (3-100 characters)"
                                value={newTaskName}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                onBlur={() => handleBlur('title')}
                                fullWidth
                                autoFocus
                            />
                        </InputWrapper>
                        {touched.title && errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
                        <CharacterCount $isError={newTaskName.length > 100}>
                            {newTaskName.length}/100
                        </CharacterCount>
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="task-description">Description (optional, supports markdown)</Label>
                        <TabContainer>
                            <Tab $active={activeTab === 'write'} onClick={() => setActiveTab('write')} type="button">
                                Write
                            </Tab>
                            <Tab $active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} type="button">
                                Preview
                            </Tab>
                        </TabContainer>
                        
                        <InputWrapper $hasError={touched.description && !!errors.description}>
                            {activeTab === 'write' ? (
                                <TextArea
                                    id="task-description"
                                    placeholder="Brief description of the task (supports markdown: **bold**, *italic*, # heading, etc.)"
                                    value={newTaskDescription}
                                    onChange={(e) => handleDescriptionChange(e.target.value)}
                                    onBlur={() => handleBlur('description')}
                                />
                            ) : (
                                <MarkdownPreview>
                                    {newTaskDescription.trim() ? (
                                        <ReactMarkdown>{newTaskDescription}</ReactMarkdown>
                                    ) : (
                                        <EmptyPreview>Nothing to preview</EmptyPreview>
                                    )}
                                </MarkdownPreview>
                            )}
                        </InputWrapper>
                        {touched.description && errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
                        <CharacterCount $isError={newTaskDescription.length > 1000}>
                            {newTaskDescription.length}/1000
                        </CharacterCount>
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="task-priority">Priority</Label>
                        <Select id="task-priority" fullWidth 
                            value={newTaskPriority} 
                            onChange={(e) => setNewTaskPriority(e.target.value)}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </Select>
                    </FormGroup>

                    <FormGroup>
                        <Label htmlFor="task-due-date">Due Date</Label>
                        <InputWrapper $hasError={touched.dueDate && !!errors.dueDate}>
                            <Input
                                id="task-due-date"
                                type="date"
                                value={newTaskDueDate}
                                onChange={(e) => handleDueDateChange(e.target.value)}
                                onBlur={() => handleBlur('dueDate')}
                                fullWidth
                            />
                        </InputWrapper>
                        {touched.dueDate && errors.dueDate && <ErrorMessage>{errors.dueDate}</ErrorMessage>}
                    </FormGroup>

                    {setNewTaskEstimatedHours && (
                        <FormGroup>
                            <Label htmlFor="task-estimated-hours">Estimated Hours</Label>
                            <InputWrapper $hasError={touched.estimatedHours && !!errors.estimatedHours}>
                                <Input
                                    id="task-estimated-hours"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    placeholder="e.g., 2.5"
                                    value={newTaskEstimatedHours || ''}
                                    onChange={(e) => handleEstimatedHoursChange(e.target.value)}
                                    onBlur={() => handleBlur('estimatedHours')}
                                    fullWidth
                                />
                            </InputWrapper>
                            {touched.estimatedHours && errors.estimatedHours && <ErrorMessage>{errors.estimatedHours}</ErrorMessage>}
                        </FormGroup>
                    )}

                    {setSelectedTags && availableTags.length > 0 && (
                        <FormGroup>
                            <Label>Tags (optional)</Label>
                            <TagsSection>
                                <AvailableTagsList>
                                    {availableTags.map((tag) => (
                                        <TagChip
                                            key={tag.id}
                                            type="button"
                                            $color={tag.color}
                                            $selected={selectedTags.some(t => t.id === tag.id)}
                                            onClick={() => handleToggleTag(tag)}
                                        >
                                            {tag.name}
                                        </TagChip>
                                    ))}
                                </AvailableTagsList>
                            </TagsSection>
                        </FormGroup>
                    )}

                    {setSelectedTags && availableTags.length === 0 && (
                        <FormGroup>
                            <Label>Tags</Label>
                            <EmptyTagsMessage>
                                No tags available. You can create tags when editing a task.
                            </EmptyTagsMessage>
                        </FormGroup>
                    )}

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
                        variant="outline"
                        onClick={() => handleSubmit(true)}
                        disabled={!isFormValid()}
                        type="button"
                    >
                        Save & Create Another
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => handleSubmit(false)}
                        disabled={!isFormValid()}
                        type="button"
                    >
                        Crear Tarea
                    </Button>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    )
}

export default CreateTaskModal