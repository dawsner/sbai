import { create } from 'zustand';
import type { Client, Project, Task, Document, Payment, UserSettings, Notification } from '../types';

interface AppState {
  clients: Client[];
  projects: Project[];
  tasks: Task[];
  documents: Document[];
  payments: Payment[];
  settings: UserSettings;
  notifications: Notification[];
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  addDocument: (document: Document) => void;
  updateDocument: (document: Document) => void;
  deleteDocument: (id: string) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (payment: Payment) => void;
  deletePayment: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const defaultSettings: UserSettings = {
  theme: 'light',
  notifications: {
    email: true,
    desktop: true,
    documents: true,
    payments: true,
    tasks: true,
  },
  currency: 'USD',
  language: 'en',
  timeZone: 'UTC',
};

// Load initial state from localStorage if available
const loadInitialState = () => {
  try {
    const savedState = localStorage.getItem('businessManagementState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      return {
        ...parsedState,
        settings: { ...defaultSettings, ...parsedState.settings },
      };
    }
  } catch (error) {
    console.error('Error loading state:', error);
  }
  return {
    clients: [],
    projects: [],
    tasks: [],
    documents: [],
    payments: [],
    notifications: [],
    settings: defaultSettings,
  };
};

export const useStore = create<AppState>((set, get) => {
  // Helper to save state to localStorage
  const saveState = (state: Partial<AppState>) => {
    try {
      localStorage.setItem('businessManagementState', JSON.stringify({
        clients: state.clients || get().clients,
        projects: state.projects || get().projects,
        tasks: state.tasks || get().tasks,
        documents: state.documents || get().documents,
        payments: state.payments || get().payments,
        notifications: state.notifications || get().notifications,
        settings: state.settings || get().settings,
      }));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  return {
    ...loadInitialState(),

    addClient: (client) =>
      set((state) => {
        const newState = { clients: [...state.clients, client] };
        saveState(newState);
        return newState;
      }),

    updateClient: (client) =>
      set((state) => {
        const newState = {
          clients: state.clients.map((c) => (c.id === client.id ? client : c)),
        };
        saveState(newState);
        return newState;
      }),

    deleteClient: (id) =>
      set((state) => {
        const newState = {
          clients: state.clients.filter((c) => c.id !== id),
        };
        saveState(newState);
        return newState;
      }),

    addProject: (project) =>
      set((state) => {
        const newState = { projects: [...state.projects, project] };
        saveState(newState);
        return newState;
      }),

    updateProject: (project) =>
      set((state) => {
        const newState = {
          projects: state.projects.map((p) => (p.id === project.id ? project : p)),
        };
        saveState(newState);
        return newState;
      }),

    deleteProject: (id) =>
      set((state) => {
        const newState = {
          projects: state.projects.filter((p) => p.id !== id),
        };
        saveState(newState);
        return newState;
      }),

    addTask: (task) =>
      set((state) => {
        const newState = { tasks: [...state.tasks, task] };
        saveState(newState);
        return newState;
      }),

    updateTask: (task) =>
      set((state) => {
        const newState = {
          tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
        };
        saveState(newState);
        return newState;
      }),

    deleteTask: (id) =>
      set((state) => {
        const newState = {
          tasks: state.tasks.filter((t) => t.id !== id),
        };
        saveState(newState);
        return newState;
      }),

    addDocument: (document) =>
      set((state) => {
        const newState = { documents: [...state.documents, document] };
        saveState(newState);
        return newState;
      }),

    updateDocument: (document) =>
      set((state) => {
        const newState = {
          documents: state.documents.map((d) => (d.id === document.id ? document : d)),
        };
        saveState(newState);
        return newState;
      }),

    deleteDocument: (id) =>
      set((state) => {
        const newState = {
          documents: state.documents.filter((d) => d.id !== id),
        };
        saveState(newState);
        return newState;
      }),

    addPayment: (payment) =>
      set((state) => {
        const newState = { payments: [...state.payments, payment] };
        saveState(newState);
        return newState;
      }),

    updatePayment: (payment) =>
      set((state) => {
        const newState = {
          payments: state.payments.map((p) => (p.id === payment.id ? payment : p)),
        };
        saveState(newState);
        return newState;
      }),

    deletePayment: (id) =>
      set((state) => {
        const newState = {
          payments: state.payments.filter((p) => p.id !== id),
        };
        saveState(newState);
        return newState;
      }),

    updateSettings: (newSettings) =>
      set((state) => {
        const settings = { ...state.settings, ...newSettings };
        saveState({ settings });
        return { settings };
      }),

    addNotification: (notification) =>
      set((state) => {
        const newNotification = {
          ...notification,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          read: false,
        };
        const newState = {
          notifications: [newNotification, ...state.notifications],
        };
        saveState(newState);
        return newState;
      }),

    markNotificationAsRead: (id) =>
      set((state) => {
        const newState = {
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        };
        saveState(newState);
        return newState;
      }),

    clearNotifications: () =>
      set((state) => {
        const newState = { notifications: [] };
        saveState(newState);
        return newState;
      }),
  };
});