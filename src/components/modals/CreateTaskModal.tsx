import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalCloseButton, ModalBody, ModalFooter } from '../ui/Modal';
import { FormGroup, Label, Input, Button, Select } from '../ui'

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
    handleCreateTask: () => void;
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
    handleCreateTask }: CreateBoardModalProps) => {
    
    const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
    
    return (
        <ModalOverlay isOpen={isCreateModalOpen} onClick={() => setIsCreateModalOpen(false)}>
            <ModalContent size="md" onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>Crear Nueva Tarea</ModalTitle>
                    <ModalCloseButton onClick={() => setIsCreateModalOpen(false)}>✕</ModalCloseButton>
                </ModalHeader>

                <ModalBody>
                    <FormGroup>
                        <Label htmlFor="task-name">Task Name</Label>
                        <Input
                            id="task-name"
                            type="text"
                            placeholder="Ej: Desarrollo Web"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            fullWidth
                            autoFocus
                        />
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
                        
                        {activeTab === 'write' ? (
                            <TextArea
                                id="task-description"
                                placeholder="Brief description of the task (supports markdown: **bold**, *italic*, # heading, etc.)"
                                value={newTaskDescription}
                                onChange={(e) => setNewTaskDescription(e.target.value)}
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
                        <Input
                            id="task-due-date"
                            type="date"
                            value={newTaskDueDate}
                            onChange={(e) => setNewTaskDueDate(e.target.value)}
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
                        onClick={handleCreateTask}
                        disabled={!newTaskName.trim()}
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