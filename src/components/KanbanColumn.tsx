'use client';

import { useState, useRef, useEffect, memo } from 'react';
import styled from 'styled-components';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui';
import { SortableTaskCard } from '@/components/TaskCard';
import type { Task } from '@/types/store';

// Styled Components
const KanbanColumnContainer = styled.div`
  min-width: 320px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ColumnHeader = styled.div<{ $isDraggable?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border-top: 3px solid var(--column-color);
  cursor: ${({ $isDraggable }) => $isDraggable ? 'grab' : 'default'};
  
  &:active {
    cursor: ${({ $isDraggable }) => $isDraggable ? 'grabbing' : 'default'};
  }
`;

const ColumnTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--column-color);
  }
`;

const ColumnTitleInput = styled.input`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  background: transparent;
  border: none;
  outline: none;
  padding: 2px 4px;
  margin: -2px -4px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  width: 100%;
  
  &:focus {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    border: 1px solid ${({ theme }) => theme.colors.primary.main};
    padding: 1px 3px;
  }
`;

const TaskCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.neutral[200]};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  min-height: 200px;
  padding: ${({ theme }) => theme.spacing.xs};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-align: center;
  
  svg {
    width: 48px;
    height: 48px;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    opacity: 0.5;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.xs};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  line-height: 1;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing.xs};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 180px;
  z-index: 1000;
  display: ${({ $isOpen }) => $isOpen ? 'block' : 'none'};
  overflow: hidden;
`;

const DropdownItem = styled.button<{ $variant?: 'default' | 'danger' }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: ${({ theme, $variant }) => 
    $variant === 'danger' ? theme.colors.error.main : theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme, $variant }) => 
      $variant === 'danger' ? theme.colors.error.bg : theme.colors.background.secondary};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  }
`;

// Component Props
interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  onAddTask?: () => void;
  onEditColumn?: (id: string, newTitle: string) => void;
  onDeleteColumn?: (id: string) => void;
  isFixed?: boolean;
}

function DroppableTaskList({ columnId, tasks, children }: { columnId: string; tasks: Task[]; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  });

  return (
    <div ref={setNodeRef}>
      <TaskList
        style={{
          minHeight: tasks.length === 0 ? '200px' : '100px',
          backgroundColor: isOver ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
          transition: 'background-color 0.2s ease',
        }}
      >
        {children}
      </TaskList>
    </div>
  );
}

export function KanbanColumn({ id, title, color, tasks, onAddTask, onEditColumn, onDeleteColumn, isFixed = false }: KanbanColumnProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: id,
    data: {
      type: 'column',
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Focus input cuando entra en modo edición
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setIsDropdownOpen(false);
  };

  const handleSaveEdit = () => {
    if (editedTitle.trim() && editedTitle !== title && onEditColumn) {
      onEditColumn(id, editedTitle.trim());
    } else {
      setEditedTitle(title); // Revertir si está vacío
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleDeleteColumn = () => {
    if (isFixed) {
      alert('Cannot delete fixed columns');
      return;
    }
    
    if (confirm(`Are you sure you want to delete the column "${title}"? All tasks will be moved to "To Do".`)) {
      if (onDeleteColumn) {
        onDeleteColumn(id);
      }
    }
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div ref={setNodeRef} style={style}>
      <KanbanColumnContainer style={{ '--column-color': color } as React.CSSProperties}>
        <ColumnHeader $isDraggable={true} {...attributes} {...listeners}>
          <ColumnTitle>
            {isEditing ? (
              <ColumnTitleInput
                ref={inputRef}
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              title
            )}
            <TaskCount>{tasks.length}</TaskCount>
          </ColumnTitle>
          <HeaderActions>
            <Button variant="ghost" size="sm" onClick={(e) => {
              e.stopPropagation();
              onAddTask?.();
            }}>
              <span>➕</span>
            </Button>
            <DropdownContainer ref={dropdownRef}>
              <DropdownButton onClick={toggleDropdown}>
                ⋮
              </DropdownButton>
              <DropdownMenu $isOpen={isDropdownOpen}>
                <DropdownItem onClick={handleStartEdit}>
                  ✏️ Edit Column
                </DropdownItem>
                <DropdownItem 
                  $variant="danger" 
                  onClick={handleDeleteColumn}
                  disabled={isFixed}
                >
                  🗑️ Delete Column
                </DropdownItem>
              </DropdownMenu>
            </DropdownContainer>
          </HeaderActions>
        </ColumnHeader>

        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <DroppableTaskList columnId={id} tasks={tasks}>
            {tasks.length === 0 ? (
              <EmptyState>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p>No tasks</p>
              </EmptyState>
            ) : (
              // Optimized rendering with React.memo on TaskCard
              tasks.map((task) => (
                <SortableTaskCard key={task.id} task={task} />
              ))
            )}
          </DroppableTaskList>
        </SortableContext>
      </KanbanColumnContainer>
    </div>
  );
}
