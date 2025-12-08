'use client';

import { useState, memo } from 'react';
import styled from 'styled-components';
// import ReactMarkdown from 'react-markdown';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Badge } from '@/components/ui';
import { getPriorityColor, getPriorityLabel } from '@/utils/priority';
import type { Task } from '@/types/store';
import { useTaskStore } from '@/store/tasks';
import TaskDetailsModal from './modals/TaskDetailsModal';
import DeleteConfirmationModal from './modals/DeleteConfirmationModal';

// Styled Components
const CardWrapper = styled.div`
  position: relative;
  
  &:hover .delete-button {
    opacity: 1;
  }
`;

const TaskCard = styled(Card)`
  cursor: pointer;
  user-select: none;
  
  &:active {
    cursor: grabbing;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.error.main};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity ${({ theme }) => theme.transitions.duration.fast} ${({ theme }) => theme.transitions.easing.default};
  z-index: 10;
  font-size: 16px;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.error.dark};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const TaskHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TaskTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
`;

const TaskFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border.light};
`;

const TagList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const TagBadge = styled.span<{ $color?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background-color: ${({ $color }) => $color || '#e5e7eb'};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  line-height: 1;
`;

// Component Props
interface SortableTaskCardProps {
  task: Task;
}

export const SortableTaskCard = memo(function SortableTaskCard({ task }: SortableTaskCardProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleCardClick = () => {
    // Solo abrir modal si no se está arrastrando
    if (!isDragging) {
      setIsDetailsModalOpen(true);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteTask(task.id);
  };

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <CardWrapper data-testid="task-card">
          <DeleteButton className="delete-button" onClick={handleDeleteClick}>
            🗑️
          </DeleteButton>
          <TaskCard $hoverable padding="md" onClick={handleCardClick}>
          <TaskHeader>
            <div style={{ flex: 1 }}>
              <TaskTitle>{task.title}</TaskTitle>
              <Badge
                variant={getPriorityColor(task.priority)}
                size="sm"
              >
                {getPriorityLabel(task.priority)}
              </Badge>
            </div>
          </TaskHeader>

          {task.tags && task.tags.length > 0 && (
            <TagList>
              {task.tags.map((tag) => (
                <TagBadge key={tag.id} $color={tag.color}>
                  {tag.name}
                </TagBadge>
              ))}
            </TagList>
          )}

          <TaskFooter>
            {task.dueDate && (
              <Badge variant="default" size="sm">
                📅 {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Badge>
            )}
          </TaskFooter>
        </TaskCard>
        </CardWrapper>
      </div>
      
      <TaskDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        task={task}
      />
      
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
      />
    </>
  );
}, (prevProps, nextProps) => {
  // Only re-render if task data actually changed
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.updatedAt === nextProps.task.updatedAt
  );
});

// Component for DragOverlay (non-sortable version)
interface TaskCardOverlayProps {
  task: Task;
}

export const TaskCardOverlay = memo(function TaskCardOverlay({ task }: TaskCardOverlayProps) {
  return (
    <TaskCard $hoverable padding="md" style={{ opacity: 0.9, cursor: 'grabbing' }}>
      <TaskHeader>
        <div style={{ flex: 1 }}>
          <TaskTitle>{task.title}</TaskTitle>
          <Badge
            variant={getPriorityColor(task.priority)}
            size="sm"
          >
            {getPriorityLabel(task.priority)}
          </Badge>
        </div>
      </TaskHeader>

      {task.tags && task.tags.length > 0 && (
        <TagList>
          {task.tags.map((tag) => (
            <TagBadge key={tag.id} $color={tag.color}>
              {tag.name}
            </TagBadge>
          ))}
        </TagList>
      )}

      <TaskFooter>
        {task.dueDate && (
          <Badge variant="default" size="sm">
            📅 {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Badge>
        )}
      </TaskFooter>
    </TaskCard>
  );
});
