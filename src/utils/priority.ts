export type PriorityVariant = 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'urgent';

export const getPriorityColor = (priority: string): PriorityVariant => {
  switch (priority) {
    case 'urgent':
      return 'urgent';
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'default';
  }
};

export const getPriorityLabel = (priority: string): string => {
  switch (priority) {
    case 'urgent':
      return 'Urgente';
    case 'high':
      return 'Alta';
    case 'medium':
      return 'Media';
    case 'low':
      return 'Baja';
    default:
      return priority;
  }
};
