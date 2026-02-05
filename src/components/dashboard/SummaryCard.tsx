import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  delay?: number;
}

const SummaryCard = ({ title, amount, type, delay = 0 }: SummaryCardProps) => {
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  const getIcon = () => {
    switch (type) {
      case 'income':
        return <TrendingUp className="h-5 w-5" />;
      case 'expense':
        return <TrendingDown className="h-5 w-5" />;
      case 'balance':
        return <Wallet className="h-5 w-5" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'income':
        return {
          card: 'gradient-income shadow-income',
          text: 'text-income-foreground',
          icon: 'bg-white/20',
        };
      case 'expense':
        return {
          card: 'gradient-expense shadow-expense',
          text: 'text-expense-foreground',
          icon: 'bg-white/20',
        };
      case 'balance':
        return {
          card: 'gradient-primary shadow-primary',
          text: 'text-primary-foreground',
          icon: 'bg-white/20',
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6',
        styles.card
      )}
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-white/5" />
      
      <div className="relative z-10">
        <div className={cn('mb-4 inline-flex rounded-xl p-2.5', styles.icon)}>
          <span className={styles.text}>{getIcon()}</span>
        </div>
        
        <p className={cn('text-sm font-medium opacity-80', styles.text)}>
          {title}
        </p>
        
        <p className={cn('mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl', styles.text)}>
          {type === 'balance' && amount < 0 ? '-' : ''}
          {formatCurrency(amount)}
        </p>
      </div>
    </motion.div>
  );
};

export default SummaryCard;
