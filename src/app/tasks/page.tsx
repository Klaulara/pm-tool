'use client';

import { useState, memo } from 'react';
import { useBoardStore } from '@/store/boards';
import { useTaskStore } from '@/store/tasks';
import { TaskFilters } from '@/types/store';
import styled from 'styled-components';
import Header from '@/components/Header';
import TaskSearch from '@/components/TaskSearch';
import { Container, Card, Badge } from '@/components/ui';
import { getPriorityColor, getPriorityLabel } from '@/utils/priority';

const Main = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} 0;
  padding-bottom: ${({ theme }) => theme.spacing.xxxl};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TasksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const TaskCard = styled(Card)<{ $priority: string }>`
  cursor: pointer;
  transition: all 0.2s;
  border-left: 4px solid ${({ $priority }) => $priority};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TaskTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  flex: 1;
`;

const TaskDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: ${({ theme }) => theme.spacing.sm} 0;
  line-height: 1.5;
`;

const TaskMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const MetaItem = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const Tag = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  background: ${({ $color }) => $color}20;
  color: ${({ $color }) => $color};
  border: 1px solid ${({ $color }) => $color}40;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxxl} 0;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EmptySubtext = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

// Memoized task card for virtualized rendering
const VirtualizedTaskCard = memo(({ task, board, getPriorityBadgeVariant, formatDate, isOverdue }: any) => {
  const priorityColor = getPriorityColor(task.priority);
  
  return (
    <TaskCard $priority={priorityColor}>
      <TaskHeader>
        <TaskTitle>{task.title}</TaskTitle>
        <Badge variant={getPriorityBadgeVariant(task.priority)}>
          {getPriorityLabel(task.priority)}
        </Badge>
      </TaskHeader>

      {task.description && (
        <TaskDescription>{task.description}</TaskDescription>
      )}

      {task.tags && task.tags.length > 0 && (
        <TagsContainer>
          {task.tags.map((tag: any) => (
            <Tag key={tag.id} $color={tag.color}>
              {tag.name}
            </Tag>
          ))}
        </TagsContainer>
      )}

      <TaskMeta>
        <MetaItem>
          📊 <strong>{board?.name || 'Board desconocido'}</strong>
        </MetaItem>
        <MetaItem>
          📌 Status: <strong>{task.status}</strong>
        </MetaItem>
        {task.dueDate && (
          <MetaItem style={{ color: isOverdue(task.dueDate) ? '#ef4444' : 'inherit' }}>
            📅 {formatDate(task.dueDate)}
            {isOverdue(task.dueDate) && ' (Vencida)'}
          </MetaItem>
        )}
        {task.subTasks && task.subTasks.length > 0 && (
          <MetaItem>
            ✓ {task.subTasks.filter((st: any) => st.completed).length}/{task.subTasks.length} subtareas
          </MetaItem>
        )}
        <MetaItem>
          🕒 Creada: {formatDate(task.createdAt)}
        </MetaItem>
      </TaskMeta>
    </TaskCard>
  );
});

const ResultsCount = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const TasksPage = () => {
  const searchAndFilterTasks = useTaskStore((state) => state.searchAndFilterTasks);
  const getBoardById = useBoardStore((state) => state.getBoardById);

  const [filters, setFilters] = useState<TaskFilters>({
    sortBy: 'createdAt',
    sortDirection: 'desc',
  });

  const filteredTasks = searchAndFilterTasks(filters);

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getPriorityBadgeVariant = (priority: string) => {
    const priorityMap: Record<string, 'urgent' | 'error' | 'warning' | 'info'> = {
      urgent: 'urgent',
      high: 'error',
      medium: 'warning',
      low: 'info',
    };
    return priorityMap[priority] || 'info';
  };

  return (
    <>
      <Header />
      <Main>
        <Container>
          <PageTitle>Todas las Tareas</PageTitle>
          
          <TaskSearch 
            onFiltersChange={handleFiltersChange}
            initialFilters={filters}
          />

          <ResultsCount>
            {filteredTasks.length} {filteredTasks.length === 1 ? 'tarea encontrada' : 'tareas encontradas'}
          </ResultsCount>

          {filteredTasks.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📋</EmptyIcon>
              <EmptyText>No se encontraron tareas</EmptyText>
              <EmptySubtext>
                {filters.searchQuery || filters.boardId || filters.priority || (filters.tagIds && filters.tagIds.length > 0)
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza creando tu primera tarea en un board'}
              </EmptySubtext>
            </EmptyState>
          ) : (
            // Optimized rendering with React.memo on task cards
            <TasksGrid>
              {filteredTasks.map((task) => {
                const board = getBoardById(task.boardId);
                const priorityColor = getPriorityColor(task.priority);

                return (
                  <TaskCard key={task.id} $priority={priorityColor}>
                    <TaskHeader>
                      <TaskTitle>{task.title}</TaskTitle>
                      <Badge variant={getPriorityBadgeVariant(task.priority)}>
                        {getPriorityLabel(task.priority)}
                      </Badge>
                    </TaskHeader>

                    {task.description && (
                      <TaskDescription>{task.description}</TaskDescription>
                    )}

                    {task.tags && task.tags.length > 0 && (
                      <TagsContainer>
                        {task.tags.map((tag) => (
                          <Tag key={tag.id} $color={tag.color}>
                            {tag.name}
                          </Tag>
                        ))}
                      </TagsContainer>
                    )}

                    <TaskMeta>
                      <MetaItem>
                        📊 <strong>{board?.name || 'Board desconocido'}</strong>
                      </MetaItem>
                      <MetaItem>
                        📌 Status: <strong>{task.status}</strong>
                      </MetaItem>
                      {task.dueDate && (
                        <MetaItem style={{ color: isOverdue(task.dueDate) ? '#ef4444' : 'inherit' }}>
                          📅 {formatDate(task.dueDate)}
                          {isOverdue(task.dueDate) && ' (Vencida)'}
                        </MetaItem>
                      )}
                      {task.subTasks && task.subTasks.length > 0 && (
                        <MetaItem>
                          ✓ {task.subTasks.filter(st => st.completed).length}/{task.subTasks.length} subtareas
                        </MetaItem>
                      )}
                      <MetaItem>
                        🕒 Creada: {formatDate(task.createdAt)}
                      </MetaItem>
                    </TaskMeta>
                  </TaskCard>
                );
              })}
            </TasksGrid>
          )}
        </Container>
      </Main>
    </>
  );
};

export default TasksPage;
