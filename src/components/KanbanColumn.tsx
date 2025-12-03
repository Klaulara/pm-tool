'use client';

import styled from 'styled-components';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui';
import { SortableTaskCard } from '@/components/TaskCard';
import type { Task } from '@/store/boardStore';

// Styled Components
const KanbanColumnContainer = styled.div`
  min-width: 320px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ColumnHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border-top: 3px solid var(--column-color);
  cursor: grab;
  
  &:active {
    cursor: grabbing;
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

// Component Props
interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  onAddTask?: () => void;
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

export function KanbanColumn({ id, title, color, tasks, onAddTask }: KanbanColumnProps) {
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

  return (
    <div ref={setNodeRef} style={style}>
      <KanbanColumnContainer style={{ '--column-color': color } as React.CSSProperties}>
        <ColumnHeader {...attributes} {...listeners}>
          <ColumnTitle>
            {title}
            <TaskCount>{tasks.length}</TaskCount>
          </ColumnTitle>
          <Button variant="ghost" size="sm" onClick={onAddTask}>
            <span>➕</span>
          </Button>
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
