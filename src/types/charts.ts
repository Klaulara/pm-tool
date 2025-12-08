export interface ActivityData {
  date: string;
  created: number;
  completed: number;
}

export interface ColumnTimeData {
  column: string;
  averageHours: number;
  color: string;
}

export interface BoardData {
  name: string;
  total: number;
  completed: number;
}

export interface PriorityData {
  low: number;
  medium: number;
  high: number;
  urgent: number;
}

export interface StatusData {
  status: string;
  count: number;
  color: string;
}