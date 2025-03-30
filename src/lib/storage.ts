
import { AppData, Task, Note, Expense, AppSettings } from './types';
import { toast } from "sonner";

// Initial data
const defaultData: AppData = {
  tasks: [],
  notes: [],
  expenses: [],
  settings: {
    theme: 'system'
  }
};

const LOCAL_STORAGE_KEY = 'fgexpensivibe_data';

// Helper to generate unique IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Load data from localStorage
export const loadData = (): AppData => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : defaultData;
  } catch (error) {
    console.error('Failed to load data:', error);
    return defaultData;
  }
};

// Save data to localStorage
export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
    toast.error("Failed to save data");
  }
};

// Tasks
export const getTasks = (): Task[] => {
  return loadData().tasks;
};

export const addTask = (task: Omit<Task, 'id' | 'createdAt'>): Task => {
  const data = loadData();
  const newTask: Task = {
    id: generateId(),
    ...task,
    createdAt: new Date().toISOString()
  };
  data.tasks.push(newTask);
  saveData(data);
  return newTask;
};

export const updateTask = (task: Task): Task => {
  const data = loadData();
  const index = data.tasks.findIndex(t => t.id === task.id);
  if (index !== -1) {
    data.tasks[index] = task;
    saveData(data);
  }
  return task;
};

export const deleteTask = (id: string): void => {
  const data = loadData();
  data.tasks = data.tasks.filter(task => task.id !== id);
  saveData(data);
};

// Notes
export const getNotes = (): Note[] => {
  return loadData().notes;
};

export const addNote = (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
  const data = loadData();
  const now = new Date().toISOString();
  const newNote: Note = {
    id: generateId(),
    ...note,
    createdAt: now,
    updatedAt: now
  };
  data.notes.push(newNote);
  saveData(data);
  return newNote;
};

export const updateNote = (note: Note): Note => {
  const data = loadData();
  const index = data.notes.findIndex(n => n.id === note.id);
  if (index !== -1) {
    data.notes[index] = {
      ...note,
      updatedAt: new Date().toISOString()
    };
    saveData(data);
  }
  return note;
};

export const deleteNote = (id: string): void => {
  const data = loadData();
  data.notes = data.notes.filter(note => note.id !== id);
  saveData(data);
};

// Expenses
export const getExpenses = (): Expense[] => {
  return loadData().expenses;
};

export const addExpense = (expense: Omit<Expense, 'id'>): Expense => {
  const data = loadData();
  const newExpense: Expense = {
    id: generateId(),
    ...expense
  };
  data.expenses.push(newExpense);
  saveData(data);
  return newExpense;
};

export const updateExpense = (expense: Expense): Expense => {
  const data = loadData();
  const index = data.expenses.findIndex(e => e.id === expense.id);
  if (index !== -1) {
    data.expenses[index] = expense;
    saveData(data);
  }
  return expense;
};

export const deleteExpense = (id: string): void => {
  const data = loadData();
  data.expenses = data.expenses.filter(expense => expense.id !== id);
  saveData(data);
};

// Settings
export const getSettings = (): AppSettings => {
  return loadData().settings;
};

export const updateSettings = (settings: AppSettings): AppSettings => {
  const data = loadData();
  data.settings = settings;
  saveData(data);
  return settings;
};

// Data management
export const clearAllData = (): void => {
  saveData(defaultData);
  toast.success("All data has been cleared");
};

export const exportData = (): string => {
  return JSON.stringify(loadData(), null, 2);
};

export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    saveData(data);
    return true;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ms-MY', {
    style: 'currency',
    currency: 'MYR',
    minimumFractionDigits: 2
  }).format(amount);
};
