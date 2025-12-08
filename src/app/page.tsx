'use client';

import styled from 'styled-components';
import { useBoardStore } from '@/store/boards';
import { useTaskStore } from '@/store/tasks';
import { useColumnStore } from '@/store/columns';
import type { Task } from '@/types/store';
import { useMemo, useState, lazy, Suspense } from 'react';
import Header from '@/components/Header';

// Lazy load chart components for better initial load performance
const TasksOverviewChart = lazy(() => import('@/components/charts/TasksOverviewChart').then(m => ({ default: m.TasksOverviewChart })));
const BoardsComparisonChart = lazy(() => import('@/components/charts/BoardsComparisonChart').then(m => ({ default: m.BoardsComparisonChart })));
const PriorityChart = lazy(() => import('@/components/charts/PriorityChart').then(m => ({ default: m.PriorityChart })));
const ActivityChart = lazy(() => import('@/components/charts/ActivityChart').then(m => ({ default: m.ActivityChart })));
const TasksByStatusChart = lazy(() => import('@/components/charts/TasksByStatusChart').then(m => ({ default: m.TasksByStatusChart })));
const AverageTimeInColumnChart = lazy(() => import('@/components/charts/AverageTimeInColumnChart').then(m => ({ default: m.AverageTimeInColumnChart })));
const ProductivityMetrics = lazy(() => import('@/components/ProductivityMetrics').then(m => ({ default: m.ProductivityMetrics })));
const DashboardFilters = lazy(() => import('@/components/DashboardFilters').then(m => ({ default: m.DashboardFilters })));

const DashboardContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  min-height: calc(100vh - 70px); /* Ajustar para el header */
`;

const DashboardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xxxl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const WideChartContainer = styled.div`
  grid-column: 1 / -1;
`;

const LoadingPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSizes.md};
`;

export default function Home() {
  // Select only the IDs to minimize re-renders, then derive boards in useMemo
  const boardsNormalized = useBoardStore((state) => state.boards);
  const boards = useMemo(() => {
    const { byId, allIds } = boardsNormalized;
    return allIds.map((id) => byId[id]);
  }, [boardsNormalized]);
  
  const allTasks = useTaskStore((state) => state.getAllTasks());
  const columns = useColumnStore((state) => state.columns);

  // Filter states
  const [selectedBoard, setSelectedBoard] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  // Filter tasks based on selected board and date range
  const filteredTasks = useMemo(() => {
    let filtered = allTasks;

    // Filter by board
    if (selectedBoard !== 'all') {
      filtered = filtered.filter((t: Task) => t.boardId === selectedBoard);
    }

    // Filter by date range
    if (dateRange.start) {
      filtered = filtered.filter((t: Task) => t.createdAt >= dateRange.start);
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((t: Task) => t.createdAt <= endDate.toISOString());
    }

    return filtered;
  }, [allTasks, selectedBoard, dateRange]);

  // Calculate overall statistics
  const stats = useMemo(() => {
    const totalTasks = filteredTasks.filter((t: Task) => t.status !== 'archive').length;
    const completedTasks = filteredTasks.filter((t: Task) => t.status === 'done').length;
    const inProgressTasks = filteredTasks.filter(
      (t: Task) => t.status !== 'todo' && t.status !== 'done' && t.status !== 'archive'
    ).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalBoards: boards.length,
      totalTasks,
      completedTasks,
      inProgressTasks,
      completionRate,
    };
  }, [boards, filteredTasks]);

  // Productivity metrics
  const productivityMetrics = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Start of week (Monday)
    const startOfWeek = new Date(now);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const completedToday = filteredTasks.filter((t: Task) => 
      t.completedAt && t.completedAt.startsWith(today)
    ).length;

    const completedThisWeek = filteredTasks.filter((t: Task) => 
      t.completedAt && new Date(t.completedAt) >= startOfWeek
    ).length;

    // Calculate average per day (last 7 days)
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const completedLast7Days = filteredTasks.filter((t: Task) => 
      t.completedAt && new Date(t.completedAt) >= sevenDaysAgo
    ).length;
    const averagePerDay = completedLast7Days / 7;

    // Overdue tasks
    const overdueTasks = filteredTasks.filter((t: Task) => 
      t.dueDate && 
      new Date(t.dueDate) < now && 
      t.status !== 'done' &&
      t.status !== 'archive'
    ).length;

    // Velocity (tasks with time estimates completed per week)
    const tasksWithEstimates = filteredTasks.filter((t: Task) => 
      t.completedAt && 
      new Date(t.completedAt) >= startOfWeek &&
      t.stimatedTime
    );
    const velocity = tasksWithEstimates.length > 0 
      ? tasksWithEstimates.reduce((sum: number, t: Task) => sum + (t.stimatedTime || 0), 0) / tasksWithEstimates.length
      : undefined;

    return {
      completedToday,
      completedThisWeek,
      averagePerDay,
      overdueTasks,
      velocity,
    };
  }, [filteredTasks]);

  // Priority data
  const priorityData = useMemo(() => {
    const activeTasks = filteredTasks.filter((t: Task) => t.status !== 'archive');
    return {
      low: activeTasks.filter((t: Task) => t.priority === 'low').length,
      medium: activeTasks.filter((t: Task) => t.priority === 'medium').length,
      high: activeTasks.filter((t: Task) => t.priority === 'high').length,
      urgent: activeTasks.filter((t: Task) => t.priority === 'urgent').length,
    };
  }, [filteredTasks]);

  // Tasks by status
  const tasksByStatus = useMemo(() => {
    const boardColumns = selectedBoard === 'all' 
      ? columns 
      : columns.filter((c) => c.boardId === selectedBoard);

    const statusMap = new Map<string, { count: number; color: string; title: string }>();

    boardColumns.forEach((col) => {
      const count = filteredTasks.filter((t: Task) => t.status === col.status).length;
      if (count > 0) {
        statusMap.set(col.status, {
          count,
          color: col.color,
          title: col.title,
        });
      }
    });

    return Array.from(statusMap.values()).map((item) => ({
      status: item.title,
      count: item.count,
      color: item.color,
    }));
  }, [filteredTasks, columns, selectedBoard]);

  // Average time in column
  const averageTimeInColumn = useMemo(() => {
    const boardColumns = selectedBoard === 'all' 
      ? columns 
      : columns.filter((c) => c.boardId === selectedBoard);

    return boardColumns.map((col) => {
      const tasksInColumn = filteredTasks.filter((t: Task) => 
        t.statusHistory && t.statusHistory.some((h) => h.status === col.status)
      );

      if (tasksInColumn.length === 0) {
        return {
          column: col.title,
          averageHours: 0,
          color: col.color,
        };
      }

      const totalTime = tasksInColumn.reduce((sum: number, task: Task) => {
        if (!task.statusHistory) return sum;

        const statusEntries = task.statusHistory.filter((h) => h.status === col.status);
        if (statusEntries.length === 0) return sum;

        // Find when task entered and left this status
        const entryIndex = task.statusHistory.findIndex((h) => h.status === col.status);
        const entryTime = new Date(task.statusHistory[entryIndex].timestamp);
        
        let exitTime: Date;
        if (entryIndex < task.statusHistory.length - 1) {
          exitTime = new Date(task.statusHistory[entryIndex + 1].timestamp);
        } else {
          exitTime = new Date(); // Still in this status
        }

        const timeInMs = exitTime.getTime() - entryTime.getTime();
        const timeInHours = timeInMs / (1000 * 60 * 60);
        
        return sum + timeInHours;
      }, 0);

      return {
        column: col.title,
        averageHours: totalTime / tasksInColumn.length,
        color: col.color,
      };
    }).filter((item) => item.averageHours > 0);
  }, [filteredTasks, columns, selectedBoard]);

  // Boards comparison data
  const boardsData = useMemo(() => {
    return boards.map((board) => ({
      name: board.name,
      total: board.tasksCount.total,
      completed: board.tasksCount.completed,
    }));
  }, [boards]);

  // Activity data for last 7 days
  const activityData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map((date) => {
      const created = filteredTasks.filter((t: Task) => t.createdAt?.startsWith(date)).length;
      const completed = filteredTasks.filter((t: Task) => t.completedAt?.startsWith(date)).length;
      
      // Format date for display
      const displayDate = new Date(date).toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
      });

      return {
        date: displayDate,
        created,
        completed,
      };
    });
  }, [filteredTasks]);

  const handleResetFilters = () => {
    setSelectedBoard('all');
    setDateRange({ start: '', end: '' });
  };

  return (
    <>
    <Header />
    <DashboardContainer>
      
      <DashboardHeader>
        <Title>Dashboard</Title>
        <Subtitle>Resumen general de tus proyectos y tareas</Subtitle>
      </DashboardHeader>

      <Suspense fallback={<LoadingPlaceholder>Cargando filtros...</LoadingPlaceholder>}>
        <DashboardFilters
          boards={boards}
          selectedBoard={selectedBoard}
          onBoardChange={setSelectedBoard}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onReset={handleResetFilters}
        />
      </Suspense>

      <StatsGrid>
        <StatCard>
          <StatValue>{stats.totalBoards}</StatValue>
          <StatLabel>Tableros</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.totalTasks}</StatValue>
          <StatLabel>Tareas Totales</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.completedTasks}</StatValue>
          <StatLabel>Tareas Completadas</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.completionRate}%</StatValue>
          <StatLabel>Tasa de Completado</StatLabel>
        </StatCard>
      </StatsGrid>

      <Suspense fallback={<LoadingPlaceholder>Cargando métricas...</LoadingPlaceholder>}>
        <WideChartContainer>
          <ProductivityMetrics
            completedToday={productivityMetrics.completedToday}
            completedThisWeek={productivityMetrics.completedThisWeek}
            averagePerDay={productivityMetrics.averagePerDay}
            overdueTasks={productivityMetrics.overdueTasks}
            velocity={productivityMetrics.velocity}
          />
        </WideChartContainer>
      </Suspense>

      <Suspense fallback={<LoadingPlaceholder>Cargando gráficos...</LoadingPlaceholder>}>
        <ChartsGrid>
          <TasksOverviewChart
            total={stats.totalTasks}
            completed={stats.completedTasks}
            inProgress={stats.inProgressTasks}
          />
          <PriorityChart data={priorityData} />
        </ChartsGrid>

        <ChartsGrid>
          {tasksByStatus.length > 0 && (
            <TasksByStatusChart data={tasksByStatus} />
          )}
          {averageTimeInColumn.length > 0 && (
            <AverageTimeInColumnChart data={averageTimeInColumn} />
          )}
        </ChartsGrid>

        <ChartsGrid>
          <WideChartContainer>
            <ActivityChart data={activityData} />
          </WideChartContainer>
        </ChartsGrid>

        {selectedBoard === 'all' && boardsData.length > 0 && (
          <ChartsGrid>
            <WideChartContainer>
              <BoardsComparisonChart boards={boardsData} />
            </WideChartContainer>
          </ChartsGrid>
        )}
      </Suspense>
    </DashboardContainer>
    </>
  );
}
