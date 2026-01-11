/**
 * Type definitions for the Scheduler Sidebar feature
 * Following Google TypeScript Style Guide
 */

export interface Task {
  readonly id: string;
  title: string;
  description?: string;
  date: Date;
  completed: boolean;
}

export interface TimelineNodeProps {
  readonly task: Task;
  readonly index: number;
  onClick?: (task: Task) => void;
}

export interface TimelineProps {
  readonly tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

export interface CalendarWidgetProps {
  selectedDate: Date;
  tasks: Task[];
  onDateSelect: (date: Date) => void;
}

export interface TaskFormProps {
  selectedDate: Date;
  onTaskAdd: (task: Omit<Task, 'id'>) => void;
}
