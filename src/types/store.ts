// Central type definitions for all stores

export interface Column {
  id: string;
  title: string;
  status: string;
  color: string;
  order: number;
  isFixed: boolean;
  boardId: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  tasksCount: {
    total: number;
    completed: number;
    inProgress: number;
  };
  lastUpdated: string;
  isStarred?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  tags?: Tag[];
  status: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  subTasks: SubTask[];
  stimatedTime?: number;
  boardId: string;
  statusHistory?: { status: string; timestamp: string }[];
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export type SortOption = 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortDirection = 'asc' | 'desc';

export interface TaskFilters {
  searchQuery?: string;
  boardId?: string;
  priority?: Task['priority'];
  tagIds?: string[];
  dueDateRange?: {
    start?: string;
    end?: string;
  };
  assigneeId?: string;
  sortBy?: SortOption;
  sortDirection?: SortDirection;
}
