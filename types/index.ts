export interface TransactionLog {
  id: number;
  timestamp: string;
  amount: number;
  balance: number;
  title: string;
  note: string;
  category: 'income' | 'expense';
  isValid: boolean;
}

export interface DailyWorkRecord {
  id: number;
  userId: number;
  date: string;
  scheduledTasksCount: number;
  completedTasksCount: number;
  maxPossibleReward: number;
  scheduledTasks: {
    id: number;
    title: string;
    reward: number;
  }[];
  completedTasks: {
    id: number;
    title: string;
    reward: number;
  }[];
}

export interface Task {
  id: number;
  category: 'お仕事' | 'クエスト';
  isValid: boolean;
  title: string;
  note: string;
  reward: number;
  completed: boolean;
}

export interface SettingsSection {
  interestRate?: string;
  paymentSpan?: string;
  paymentDay?: string;
  paymentDate?: string;
  checkbox1?: boolean;
  checkbox2?: boolean;
}

export interface Settings {
  compoundInterest: SettingsSection;
  workList: SettingsSection;
  questBoard: SettingsSection;
}

export type ExecutionSpan = 'weekly' | 'monthly';

export interface Work {
  id: number;
  title: string;
  executionSpan: ExecutionSpan;
  executionDays: number[]; // 週の場合は0-6（日-土）、月の場合は1-31
  reward: number;
  isValid: boolean;
  note: string;
  completed?: boolean; // この行を追加
}

export interface WorkSettings {
  paymentSpan: ExecutionSpan;
  paymentDay: number; // 週の場合は0-6、月の場合は1-31
}

export type QuestFrequency = 'weekly' | 'monthly';

export interface Quest {
  id: number;
  title: string;
  frequency: QuestFrequency;
  executionDays: number[]; // 週の場合は0-6（日-土）、月の場合は1-31
  description: string;
  reward: number;
  isValid: boolean;
}
