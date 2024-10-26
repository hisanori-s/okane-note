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

export type SettingsSection = {
  checkbox1: boolean;
  checkbox2: boolean;
  radio: string;
  textField: string;
  selectField: string;
};

export type SettingsData = {
  compoundInterest: SettingsSection;
  workList: SettingsSection;
  questBoard: SettingsSection;
};
