import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Building2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction, TransactionType, Division } from '@/types/transaction';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  editTransaction?: Transaction | null;
}

const AddTransactionModal = ({ open, onClose, onSubmit, editTransaction }: AddTransactionModalProps) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [division, setDivision] = useState<Division>('personal');
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmount(editTransaction.amount.toString());
      setDescription(editTransaction.description);
      setCategory(editTransaction.category);
      setDivision(editTransaction.division);
      setDate(new Date(editTransaction.createdAt));
    } else {
      resetForm();
    }
  }, [editTransaction, open]);

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setDescription('');
    setCategory('');
    setDivision('personal');
    setDate(new Date());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !category) return;

    onSubmit({
      type,
      amount: parseFloat(amount),
      description,
      category,
      division,
      date,
    });

    resetForm();
    onClose();
  };

  const convertIntoUpperCase =(data: any) =>{
    return String(data).toUpperCase();
  }

  const incomeCategories = CATEGORIES.filter(c => 
    ['salary', 'investment', 'freelance', 'gift', 'other'].includes(c.id)
  );
  const expenseCategories = CATEGORIES.filter(c => 
    !['salary', 'investment', 'freelance'].includes(c.id)
  );
  const currentCategories = type === 'income' ? incomeCategories : expenseCategories;

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-display text-xl">
            {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-6">
          {/* Type Tabs */}
          <div className="flex rounded-xl bg-secondary p-1">
            <button
              type="button"
              onClick={() => setType('income')}
              className={cn(
                'relative flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors',
                type === 'income' ? 'text-income-foreground' : 'text-muted-foreground'
              )}
            >
              {type === 'income' && (
                <motion.div
                  layoutId="type-indicator"
                  className="absolute inset-0 rounded-lg gradient-income"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">Income</span>
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={cn(
                'relative flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors',
                type === 'expense' ? 'text-expense-foreground' : 'text-muted-foreground'
              )}
            >
              {type === 'expense' && (
                <motion.div
                  layoutId="type-indicator"
                  className="absolute inset-0 rounded-lg gradient-expense"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">Expense</span>
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-2xl font-display font-bold h-14"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="grid grid-cols-4 gap-2">
              <AnimatePresence mode="popLayout">
                {currentCategories.map((cat) => (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-xl p-3 text-xs font-medium transition-all',
                      category === cat.id
                        ? 'ring-2 ring-primary bg-accent'
                        : 'bg-secondary hover:bg-secondary/80'
                    )}
                  >
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-foreground truncate w-full text-center">
                      {cat.name}
                    </span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Division */}
          <div className="space-y-2">
            <Label>Division</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDivision('personal')}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all',
                  division === 'personal'
                    ? 'bg-personal text-personal-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                )}
              >
                <User className="h-4 w-4" />
                Personal
              </button>
              <button
                type="button"
                onClick={() => setDivision('office')}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all',
                  division === 'office'
                    ? 'bg-office text-office-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                )}
              >
                <Building2 className="h-4 w-4" />
                Office
              </button>
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date & Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'PPP p')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className={cn(
              'w-full h-12 text-base font-semibold',
              type === 'income' ? 'gradient-income shadow-income' : 'gradient-expense shadow-expense'
            )}
          >
            {editTransaction ? 'Update' : 'Add'} {type === 'income' ? 'Income' : 'Expense'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionModal;
