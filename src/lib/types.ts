
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  category: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
}

export interface AppData {
  tasks: Task[];
  notes: Note[];
  expenses: Expense[];
  settings: AppSettings;
}
