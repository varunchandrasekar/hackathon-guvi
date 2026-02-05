import { useState } from 'react';
import { format, differenceInHours } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Clock, Building2, User } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { getCategoryById, EDIT_WINDOW_HOURS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  canEdit: (transaction: Transaction) => boolean;
}

const TransactionList = ({ transactions, onEdit, onDelete, canEdit }: TransactionListProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTimeRemaining = (transaction: Transaction) => {
    const hoursElapsed = differenceInHours(new Date(), transaction.createdAt);
    const hoursRemaining = EDIT_WINDOW_HOURS - hoursElapsed;
    if (hoursRemaining <= 0) return null;
    return `${hoursRemaining}h left to edit`;
  };

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground">
          No transactions yet
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Click the + button to add your first transaction
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        <AnimatePresence>
          {transactions.map((transaction, index) => {
            const category:any = getCategoryById(transaction.category);
            const isEditable = canEdit(transaction);
            const timeRemaining = getTimeRemaining(transaction);

            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="group rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                        transaction.type === 'income' ? 'bg-income-light' : 'bg-expense-light'
                      )}
                    >
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: category?.color }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground truncate">
                          {transaction.description}
                        </h4>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                            transaction.division === 'office'
                              ? 'bg-office-light text-office'
                              : 'bg-personal-light text-personal'
                          )}
                        >
                          {transaction.division === 'office' ? (
                            <Building2 className="h-3 w-3" />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                          {transaction.division}
                        </span>
                      </div>
                      
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{category?.name}</span>
                        <span>•</span>
                        <span>{format(new Date(transaction.createdAt), 'MMM d, yyyy h:mm a')}</span>
                        {isEditable && timeRemaining && (
                          <>
                            <span>•</span>
                            <span className="text-primary">{timeRemaining}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'font-display text-lg font-bold',
                        transaction.type === 'income' ? 'text-income' : 'text-expense'
                      )}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </span>

                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      {isEditable && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit(transaction)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(transaction.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionList;
