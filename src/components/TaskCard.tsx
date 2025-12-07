'use client';

import { useState } from 'react';
import styled from 'styled-components';
// import ReactMarkdown from 'react-markdown';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Badge } from '@/components/ui';
import { getPriorityColor, getPriorityLabel } from '@/utils/priority';
import type { Task } from '@/store/boardStore';
import TaskDetailsModal from './modals/TaskDetailsModal';

// Styled Components
const TaskCard = styled(Card)`
  cursor: pointer;
  user-select: none;
  
  &:active {
    cursor: grabbing;
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

// const TaskDescription = styled.div`
//   font-size: ${({ theme }) => theme.typography.fontSizes.sm};
//   color: ${({ theme }) => theme.colors.text.secondary};
//   margin: 0 0 ${({ theme }) => theme.spacing.md};
//   line-height: ${({ theme }) => theme.typography.lineHeights.normal};
  
//   /* Markdown styles */
//   p {
//     margin: 0 0 ${({ theme }) => theme.spacing.xs};
//   }
  
//   p:last-child {
//     margin-bottom: 0;
//   }
  
//   strong {
//     font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
//     color: ${({ theme }) => theme.colors.text.primary};
//   }
  
//   em {
//     font-style: italic;
//   }
  
//   code {
//     background-color: ${({ theme }) => theme.colors.neutral[100]};
//     padding: 2px 4px;
//     border-radius: ${({ theme }) => theme.borderRadius.sm};
//     font-family: monospace;
//     font-size: 0.9em;
//   }
  
//   ul, ol {
//     margin: ${({ theme }) => theme.spacing.xs} 0;
//     padding-left: ${({ theme }) => theme.spacing.lg};
//   }
  
//   li {
//     margin-bottom: ${({ theme }) => theme.spacing.xs};
//   }
  
//   h1, h2, h3, h4, h5, h6 {
//     font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
//     color: ${({ theme }) => theme.colors.text.primary};
//     margin: ${({ theme }) => theme.spacing.sm} 0 ${({ theme }) => theme.spacing.xs};
//     font-size: ${({ theme }) => theme.typography.fontSizes.sm};
//   }
  
//   blockquote {
//     border-left: 2px solid ${({ theme }) => theme.colors.primary.light};
//     padding-left: ${({ theme }) => theme.spacing.sm};
//     margin: ${({ theme }) => theme.spacing.xs} 0;
//     color: ${({ theme }) => theme.colors.text.tertiary};
//   }
// `;

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

export function SortableTaskCard({ task }: SortableTaskCardProps) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
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

  return (
    <>
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
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

          {/* {task.description && (
            <TaskDescription>
              <ReactMarkdown>{task.description}</ReactMarkdown>
            </TaskDescription>
          )} */}

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
      </div>
      
      <TaskDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        task={task}
      />
    </>
  );
}

// Component for DragOverlay (non-sortable version)
interface TaskCardOverlayProps {
  task: Task;
}

export function TaskCardOverlay({ task }: TaskCardOverlayProps) {
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

      {/* {task.description && (
        <TaskDescription>
          <ReactMarkdown>{task.description}</ReactMarkdown>
        </TaskDescription>
      )} */}

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
}
