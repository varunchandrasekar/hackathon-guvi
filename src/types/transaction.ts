export type TransactionType = 'income' | 'expense';
export type Division = 'office' | 'personal';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  division: Division;
  date: Date;
  createdAt: Date;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  color: string;
}

export interface Transfer {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
  transactionDate: Date;
}

export type PeriodFilter = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface DateRange {
  from: Date;
  to: Date;
}
