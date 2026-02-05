import { Category, Account } from '@/types/transaction';

export const CATEGORIES: Category[] = [
  { id: 'fuel', name: 'Fuel', icon: 'Fuel', color: 'hsl(25 85% 55%)' },
  { id: 'food', name: 'Food', icon: 'UtensilsCrossed', color: 'hsl(35 90% 50%)' },
  { id: 'movie', name: 'Entertainment', icon: 'Film', color: 'hsl(280 65% 55%)' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', color: 'hsl(330 70% 55%)' },
  { id: 'medical', name: 'Medical', icon: 'Heart', color: 'hsl(0 70% 55%)' },
  { id: 'loan', name: 'Loan', icon: 'Landmark', color: 'hsl(220 70% 55%)' },
  { id: 'transport', name: 'Transport', icon: 'Car', color: 'hsl(200 65% 50%)' },
  { id: 'utilities', name: 'Utilities', icon: 'Zap', color: 'hsl(45 90% 50%)' },
  { id: 'salary', name: 'Salary', icon: 'Wallet', color: 'hsl(152 60% 42%)' },
  { id: 'investment', name: 'Investment', icon: 'TrendingUp', color: 'hsl(185 60% 40%)' },
  { id: 'freelance', name: 'Freelance', icon: 'Briefcase', color: 'hsl(260 55% 55%)' },
  { id: 'gift', name: 'Gift', icon: 'Gift', color: 'hsl(340 75% 55%)' },
  { id: 'other', name: 'Other', icon: 'MoreHorizontal', color: 'hsl(220 15% 50%)' },
];

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'cash', name: 'Cash', balance: 0, color: 'hsl(152 60% 42%)' },
  { id: 'bank', name: 'Bank Account', balance: 0, color: 'hsl(220 70% 55%)' },
  { id: 'credit', name: 'Credit Card', balance: 0, color: 'hsl(12 76% 61%)' },
];

export const EDIT_WINDOW_HOURS = 12;

export const getCategoryById = (id: string): Category | undefined => {
  return CATEGORIES.find(cat => cat.id === id);
};

export const getCategoryColor = (id: string): string => {
  return getCategoryById(id)?.color || 'hsl(220 15% 50%)';
};
