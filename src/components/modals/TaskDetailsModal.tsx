import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { ModalOverlay, ModalContent, ModalHeader, ModalTitle, ModalCloseButton, ModalBody, ModalFooter } from '../ui/Modal';
import { FormGroup, Label, Input, Button, Select, Badge } from '../ui';
import { useTaskStore } from '@/store/tasks';
import { useTagStore } from '@/store/tags';
import type { Task, Tag } from '@/types/store';

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
  min-height: 150px;
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
  min-height: 150px;
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
    font-family: 'Courier New', monospace;
  }
  
  blockquote {
    border-left: 4px solid ${({ theme }) => theme.colors.primary.main};
    padding-left: ${({ theme }) => theme.spacing.md};
    margin: ${({ theme }) => theme.spacing.md} 0;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const TagsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TagBadge = styled(Badge)<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ $color }) => $color || '#e5e7eb'};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  
  &:hover {
    color: ${({ theme }) => theme.colors.error.main};
  }
`;

const AddTagSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-end;
`;

const AvailableTagsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const AvailableTagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const AvailableTagChip = styled.button<{ $color: string }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ $color }) => $color};
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const EmptyTagsMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: 0;
`;

const SubTasksSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const SubTasksList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const SubTaskItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const SubTaskCheckbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const SubTaskTitle = styled.span<{ $completed: boolean }>`
  flex: 1;
  color: ${({ theme, $completed }) => $completed ? theme.colors.text.tertiary : theme.colors.text.primary};
  text-decoration: ${({ $completed }) => $completed ? 'line-through' : 'none'};
`;

const DeleteSubTaskButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  
  &:hover {
    color: ${({ theme }) => theme.colors.error.main};
  }
`;

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ isOpen, onClose, task }) => {
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [editedPriority, setEditedPriority] = useState(task.priority);
  const [editedDueDate, setEditedDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  
  // Tags state
  const [selectedTags, setSelectedTags] = useState<Tag[]>(task.tags || []);
  
  // SubTasks state
  const [newSubTaskTitle, setNewSubTaskTitle] = useState('');
  
  const updateTask = useTaskStore((state) => state.updateTask);
  const addSubTask = useTaskStore((state) => state.addSubTask);
  const toggleSubTask = useTaskStore((state) => state.toggleSubTask);
  const deleteSubTask = useTaskStore((state) => state.deleteSubTask);
  const allTags = useTagStore((state) => state.tags);
  
  // Get available tags (not already selected)
  const availableTags = allTags.filter(
    (tag) => !selectedTags.some((selectedTag) => selectedTag.id === tag.id)
  );

  const handleSave = () => {
    let adjustedDueDate = editedDueDate;
    if (editedDueDate) {
      const date = new Date(editedDueDate);
      const offset = date.getTimezoneOffset();
      date.setMinutes(date.getMinutes() + offset);
      adjustedDueDate = date.toISOString();
    }

    updateTask(task.id, {
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority,
      dueDate: adjustedDueDate,
      tags: selectedTags,
      updatedAt: new Date().toISOString(),
    });
    
    onClose();
  };

  const handleAddTag = (tag: Tag) => {
    setSelectedTags([...selectedTags, tag]);
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  const handleAddSubTask = () => {
    if (!newSubTaskTitle.trim()) return;
    
    addSubTask(task.id, newSubTaskTitle);
    setNewSubTaskTitle('');
  };

  const handleToggleSubTask = (subTaskId: string) => {
    toggleSubTask(task.id, subTaskId);
  };

  const handleDeleteSubTask = (subTaskId: string) => {
    deleteSubTask(task.id, subTaskId);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <ModalHeader>
          <ModalTitle>Task Details</ModalTitle>
          <ModalCloseButton onClick={onClose}>&times;</ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Task title"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="task-description">Description</Label>
            <TabContainer>
              <Tab
                $active={activeTab === 'write'}
                onClick={() => setActiveTab('write')}
                type="button"
              >
                Write
              </Tab>
              <Tab
                $active={activeTab === 'preview'}
                onClick={() => setActiveTab('preview')}
                type="button"
              >
                Preview
              </Tab>
            </TabContainer>
            
            {activeTab === 'write' ? (
              <TextArea
                id="task-description"
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Add description (Markdown supported)..."
              />
            ) : (
              <MarkdownPreview>
                {editedDescription ? (
                  <ReactMarkdown>{editedDescription}</ReactMarkdown>
                ) : (
                  <span style={{ color: '#9ca3af' }}>Nothing to preview</span>
                )}
              </MarkdownPreview>
            )}
          </FormGroup>

          <FormGroup style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <Label htmlFor="task-priority">Priority</Label>
              <Select
                id="task-priority"
                value={editedPriority}
                onChange={(e) => setEditedPriority(e.target.value as Task['priority'])}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            </div>

            <div style={{ flex: 1 }}>
              <Label htmlFor="task-due-date">Due Date</Label>
              <Input
                id="task-due-date"
                type="date"
                value={editedDueDate}
                onChange={(e) => setEditedDueDate(e.target.value)}
              />
            </div>
          </FormGroup>

          <TagsSection>
            <Label>Tags</Label>
            {selectedTags.length > 0 && (
              <TagsList>
                {selectedTags.map((tag) => (
                  <TagBadge key={tag.id} $color={tag.color}>
                    {tag.name}
                    <RemoveTagButton onClick={() => handleRemoveTag(tag.id)}>
                      ✕
                    </RemoveTagButton>
                  </TagBadge>
                ))}
              </TagsList>
            )}
            
            {availableTags.length > 0 ? (
              <AvailableTagsSection>
                <Label style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Tags Disponibles</Label>
                <AvailableTagsList>
                  {availableTags.map((tag) => (
                    <AvailableTagChip
                      key={tag.id}
                      $color={tag.color}
                      onClick={() => handleAddTag(tag)}
                    >
                      {tag.name}
                    </AvailableTagChip>
                  ))}
                </AvailableTagsList>
              </AvailableTagsSection>
            ) : (
              <EmptyTagsMessage>
                No hay más tags disponibles. Crea nuevos tags desde el menú del tablero.
              </EmptyTagsMessage>
            )}
          </TagsSection>

          <SubTasksSection>
            <Label>Subtasks</Label>
            {task.subTasks.length > 0 && (
              <SubTasksList>
                {task.subTasks.map((subTask) => (
                  <SubTaskItem key={subTask.id}>
                    <SubTaskCheckbox
                      type="checkbox"
                      checked={subTask.completed}
                      onChange={() => handleToggleSubTask(subTask.id)}
                    />
                    <SubTaskTitle $completed={subTask.completed}>
                      {subTask.title}
                    </SubTaskTitle>
                    <DeleteSubTaskButton onClick={() => handleDeleteSubTask(subTask.id)}>
                      🗑️
                    </DeleteSubTaskButton>
                  </SubTaskItem>
                ))}
              </SubTasksList>
            )}
            
            <AddTagSection>
              <FormGroup style={{ flex: 1, margin: 0 }}>
                <Input
                  type="text"
                  value={newSubTaskTitle}
                  onChange={(e) => setNewSubTaskTitle(e.target.value)}
                  placeholder="Add a subtask"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubTask();
                    }
                  }}
                />
              </FormGroup>
              
              <Button variant="outline" onClick={handleAddSubTask}>
                Add Subtask
              </Button>
            </AddTagSection>
          </SubTasksSection>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TaskDetailsModal;