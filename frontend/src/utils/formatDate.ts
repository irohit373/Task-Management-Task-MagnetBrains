import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy hh:mm a');
};

export const formatRelative = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const isTaskOverdue = (dueDate: string): boolean => {
  return isPast(new Date(dueDate));
};

export const getDueDateLabel = (dueDate: string): string => {
  const date = new Date(dueDate);
  
  if (isToday(date)) return 'Due today';
  if (isTomorrow(date)) return 'Due tomorrow';
  if (isPast(date)) return 'Overdue';
  
  return `Due ${formatDate(date)}`;
};