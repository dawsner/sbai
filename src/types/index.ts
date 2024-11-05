export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  industryType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold';
  startDate: Date;
  endDate: Date;
  budget: number;
}

export interface Task {
  id: string;
  projectId: string;
  parentTaskId?: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  deadline: Date;
  assignedTo: string;
  aiGenerated: boolean;
}

export interface Document {
  id: string;
  clientId: string;
  projectId: string;
  type: 'quote' | 'invoice' | 'contract';
  title: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  amount: number;
  createdAt: Date;
  validUntil: Date;
  items: DocumentItem[];
}

export interface DocumentItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Payment {
  id: string;
  documentId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: 'credit_card' | 'bank_transfer' | 'paypal';
  date: Date;
  reference: string;
}

export interface UserSettings {
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    desktop: boolean;
    documents: boolean;
    payments: boolean;
    tasks: boolean;
  };
  currency: string;
  language: string;
  timeZone: string;
}

export interface Notification {
  id: string;
  type: 'document' | 'payment' | 'task' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  link?: string;
}