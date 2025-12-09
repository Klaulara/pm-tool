import type { Task } from '@/types/store';

/**
 * Calculate task counts for a board
 * @param boardTasks - Array of tasks to count
 * @returns Object with total, completed, and inProgress counts
 */
export const calculateTaskCounts = (boardTasks: Task[]) => {
  const total = boardTasks.filter((t) => t.status !== 'archive').length;
  const completed = boardTasks.filter((t) => t.status === 'done').length;
  const inProgress = boardTasks.filter((t) => 
    t.status !== 'todo' && 
    t.status !== 'done' && 
    t.status !== 'archive'
  ).length;
  
  return { total, completed, inProgress };
};

/**
 * Helper function to determine if a status counts as "inProgress"
 */
const isInProgressStatus = (status: Task['status']) => {
  return status !== 'todo' && status !== 'done' && status !== 'archive';
};

/**
 * Calculate the delta change in task counts when a task status changes
 * @param oldStatus - Previous status of the task
 * @param newStatus - New status of the task
 * @returns Delta object for total, completed, and inProgress counts
 */
export const calculateStatusDelta = (oldStatus: Task['status'], newStatus: Task['status']) => {
  const delta: { total?: number; completed?: number; inProgress?: number } = {};
  
  // Handle archive status changes
  if (oldStatus === 'archive' && newStatus !== 'archive') {
    delta.total = 1;
  } else if (oldStatus !== 'archive' && newStatus === 'archive') {
    delta.total = -1;
  }
  
  // Handle completed status changes
  if (oldStatus === 'done' && newStatus !== 'done') {
    delta.completed = -1;
  } else if (oldStatus !== 'done' && newStatus === 'done') {
    delta.completed = 1;
  }
  
  // Handle inProgress status changes
  const wasInProgress = isInProgressStatus(oldStatus);
  const isNowInProgress = isInProgressStatus(newStatus);
  
  if (wasInProgress && !isNowInProgress) {
    delta.inProgress = -1;
  } else if (!wasInProgress && isNowInProgress) {
    delta.inProgress = 1;
  }
  
  return delta;
};
