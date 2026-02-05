import { useState, useEffect, useMemo } from 'react';
import { Transaction, Transfer, Account, PeriodFilter, Division, DateRange } from '@/types/transaction';
import { DEFAULT_ACCOUNTS, EDIT_WINDOW_HOURS } from '@/lib/constants';
import {
  startOfDay, endOfDay, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, startOfYear, endOfYear,
  isWithinInterval, differenceInHours
} from 'date-fns';
import transactionService from '@/service/transactionService';
import { log } from 'console';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'money-manager-data';

interface StoredData {
  transactions: Transaction[];
  transfers: Transfer[];
  accounts: Account[];
}

const loadFromStorage = (): StoredData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        transactions: data.transactions.map((t: Transaction) => ({
          ...t,
          date: new Date(t.date),
          createdAt: new Date(t.createdAt),
        })),
        transfers: data.transfers.map((t: Transfer) => ({
          ...t,
          date: new Date(t.transactionDate),
        })),
        accounts: data.accounts || DEFAULT_ACCOUNTS,
      };
    }
  } catch (e) {
    console.error('Error loading data:', e);
  }
  return { transactions: [], transfers: [], accounts: DEFAULT_ACCOUNTS };
};

const saveToStorage = (data: StoredData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactionsData, setFilteredTransactionsData] = useState<Transaction[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [accounts, setAccounts] = useState<Account[]>(DEFAULT_ACCOUNTS);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('monthly');
  const [divisionFilter, setDivisionFilter] = useState<Division | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | null>(null);

  const formatDate = (date: Date): string => date.toISOString().split('T')[0];

  const calculateStartEndDate = (type: PeriodFilter) => {
    const today = new Date();

    switch (type) {
      case 'daily': {
        const date = formatDate(today);
        return { start: date, end: date };
      }
      case 'weekly': {
        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay());

        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        return { start: formatDate(start), end: formatDate(end) };
      }
      case 'monthly': {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return { start: formatDate(start), end: formatDate(end) };
      }
      case 'yearly': {
        const year = today.getFullYear();
        return { start: `${year}-01-01`, end: `${year}-12-31` };
      }
      default:
        throw new Error('Invalid range type');
    }
  };

  const loadDisplayData = async () => {
    const payload = calculateStartEndDate(periodFilter);
    try {
      const res = await transactionService.getTransactionsByDateRange(payload.start, payload.end);
      if (res && res.data) {
        setTransactions(res.data);
        setFilteredTransactionsData(res.data);
      }
      return true;
    } catch (err) {
      toast.error('Failed to load display data');
      console.error('Error loading display data', err);
      return false;
    }
  };

  useEffect(() => {
    const data = loadFromStorage();
    setTransactions(data.transactions);
    setTransfers(data.transfers);
    setAccounts(data.accounts);
  }, []);

  useEffect(() => {
    saveToStorage({ transactions, transfers, accounts });
  }, [transactions, transfers, accounts]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    try {
      await transactionService.addTransaction(transaction);
      toast.success("Transaction added successfully");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };



  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      await transactionService.updateTransaction(id, updates);
      toast.success("Transaction updated successfully");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const res = await transactionService.deleteTransaction(id);
      toast.success(res.data);
      await loadDisplayData();
      return true;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      return false;
    }
  };

  const canEditTransaction = (transaction: Transaction): boolean => {
    const hoursSinceCreation = differenceInHours(new Date(), transaction.createdAt);
    return hoursSinceCreation < EDIT_WINDOW_HOURS;
  };

  const addTransfer = async (transfer: Omit<Transfer, 'id'>) => {
    try {
      await transactionService.addTransaction(transfer);
      toast.success("Transfer added successfully");
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const filteredTransactions = useMemo(() => {

    let filtered = [...transactions];

    // Apply date filter
    if (dateRange) {
      const range = dateRange;
      filtered = filtered.filter(t =>
        isWithinInterval(new Date(t.date), { start: range.from, end: range.to })
      );
    }

    // Apply division filter
    if (divisionFilter !== 'all') {
      filtered = filtered.filter(t => t.division === divisionFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }
    const result = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setFilteredTransactionsData(result);
    return result;
  }, [divisionFilter, categoryFilter, dateRange]); // , periodFilter, divisionFilter, categoryFilter, dateRange

  const summary = useMemo(() => {
    const income = filteredTransactionsData
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = filteredTransactionsData
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryMap = new Map<string, { income: number; expense: number }>();

    const categoryTransactions = filteredTransactionsData.filter(t => t.category !== undefined);
    categoryTransactions.forEach(t => {
      const current = categoryMap.get(t.category!) || { income: 0, expense: 0 };
      if (t.type === 'income') {
        current.income += t.amount;
      } else {
        current.expense += t.amount;
      }
      categoryMap.set(t.category, current);
    });
    const result = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      ...data,
      total: data.income - data.expense,
    }));

    return {
      income,
      expense,
      balance: income - expense,
      history: filteredTransactionsData,
      category: result,
    };
  }, [transactions, filteredTransactionsData, periodFilter, divisionFilter, categoryFilter, dateRange]);

  // const categorySummary = useMemo(() => {
  //   const categoryMap = new Map<string, { income: number; expense: number }>();

  //   filteredTransactions.forEach(t => {
  //     const current = categoryMap.get(t.category) || { income: 0, expense: 0 };
  //     if (t.type === 'income') {
  //       current.income += t.amount;
  //     } else {
  //       current.expense += t.amount;
  //     }
  //     categoryMap.set(t.category, current);
  //   });

  //   return Array.from(categoryMap.entries()).map(([category, data]) => ({
  //     category,
  //     ...data,
  //     total: data.income - data.expense,
  //   }));
  // }, [filteredTransactions]);

  return {
    transactions: filteredTransactions,
    allTransactions: transactions,
    transfers,
    accounts,
    summary,
    // categorySummary,
    periodFilter,
    setPeriodFilter,
    divisionFilter,
    setDivisionFilter,
    categoryFilter,
    setCategoryFilter,
    dateRange,
    setDateRange,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    canEditTransaction,
    addTransfer,
    setTransactions,
    setFilteredTransactionsData,
    loadDisplayData
  };
};
