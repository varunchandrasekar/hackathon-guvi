import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, BarChart3, History } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { useTransactions } from '@/hooks/useTransactions';
import Header from '@/components/layout/Header';
import SummaryCard from '@/components/dashboard/SummaryCard';
import PeriodSelector from '@/components/dashboard/PeriodSelector';
import FilterBar from '@/components/dashboard/FilterBar';
import CategorySummary from '@/components/dashboard/CategorySummary';
import TransactionList from '@/components/transactions/TransactionList';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';
import TransferModal from '@/components/transactions/TransferModal';
import FloatingAddButton from '@/components/FloatingAddButton';
import { Button } from '@/components/ui/button';
import transactionService from '@/service/transactionService';
import toast from 'react-hot-toast';

export const Index = () => {
  const {
    accounts,
    summary,
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
    loadDisplayData,
  } = useTransactions();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (editTransaction) {
      const success = await updateTransaction(editTransaction.id, data);
      if (!success) {
        toast.error("Failed to update transaction");
      } else {
        loadDisplayData();
      }
      setEditTransaction(null);
    } else {
      const success = await addTransaction(data);
      if (!success) {
        toast.error("Failed to add transaction");
      } else {
        loadDisplayData();
      }
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditTransaction(transaction);
    setShowAddModal(true);
  };

  useEffect(() => {
    loadDisplayData();
  }, [periodFilter]);

  // loadDisplayData is provided by the `useTransactions` hook

  const formatDate = (date: Date): string =>
    date.toISOString().split("T")[0];

  const calculateStartEndDate = (
    type: "daily" | "weekly" | "monthly" | "yearly"
  ) => {
    const today = new Date();

    switch (type) {
      case "daily": {
        const date = formatDate(today);
        return { start: date, end: date };
      }

      case "weekly": {
        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay());

        const end = new Date(start);
        end.setDate(start.getDate() + 6);

        return {
          start: formatDate(start),
          end: formatDate(end),
        };
      }

      case "monthly": {
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        return {
          start: formatDate(start),
          end: formatDate(end),
        };
      }

      case "yearly": {
        const year = today.getFullYear();
        return {
          start: `${year}-01-01`,
          end: `${year}-12-31`,
        };
      }

      default:
        throw new Error("Invalid range type");
    }
  };

  const handleDownload = async () => {
    const payload = calculateStartEndDate(periodFilter);
    if (!payload.start || !payload.end) {
      alert("Please select start and end date");
      return;
    }

    try {
      setLoading(true);

      const response = await transactionService.getExcelReport(payload.start, payload.end);

      // -----------------------------
      // Create Excel file download
      // -----------------------------
      const blob = new Blob([response.data], {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `money-report_${payload.start}_to_${payload.end}.xlsx`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download report", error);
      alert("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 py-6 md:px-6 md:py-8">
        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <PeriodSelector value={periodFilter} onChange={setPeriodFilter} />

          <Button
            variant="outline"
            onClick={() => setShowTransferModal(true)}
            className="gap-2"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Transfer
          </Button>
        </motion.div>

        <button
          onClick={handleDownload}
          style={{ position: 'absolute', top: 101, right: 143 }}
          className="
        flex items-center gap-2
        px-4 py-2
        bg-white
        border border-gray-300
        rounded-lg
        shadow-sm
        hover:bg-gray-100
        hover:border-gray-400
        transition 
      "
          title="Generate Report based on periodic filter"
        >
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span className="hidden sm:inline text-sm font-medium text-gray-700">
            Reports
          </span>
        </button>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <SummaryCard
            title="Total Income"
            amount={summary.income}
            type="income"
            delay={0}
          />
          <SummaryCard
            title="Total Expenses"
            amount={summary.expense}
            type="expense"
            delay={0.1}
          />
          <SummaryCard
            title="Balance"
            amount={summary.balance}
            type="balance"
            delay={0.2}
          />
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <FilterBar
            divisionFilter={divisionFilter}
            onDivisionChange={setDivisionFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Transaction History */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mb-4 flex items-center gap-2"
            >
              <History className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-display text-lg font-semibold text-foreground">
                Transaction History
              </h2>
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {summary.history.length}
              </span>
            </motion.div>

            <TransactionList
              transactions={summary.history}
              onEdit={handleEdit}
              onDelete={deleteTransaction}
              canEdit={canEditTransaction}
            />
          </div>

          {/* Category Summary Sidebar */}
          <div className="lg:col-span-1">
            <CategorySummary data={summary.category} />
          </div>
        </div>
      </main>

      {/* Floating Add Button */}
      <FloatingAddButton onClick={() => setShowAddModal(true)} />

      {/* Modals */}
      <AddTransactionModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditTransaction(null);
        }}
        onSubmit={handleSubmit}
        editTransaction={editTransaction}
      />


      <TransferModal
        open={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onSubmit={addTransfer}
        accounts={accounts}
      />
    </div>
  );
};

export default Index;
