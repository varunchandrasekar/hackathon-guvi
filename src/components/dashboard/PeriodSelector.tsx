import { motion } from 'framer-motion';
import { PeriodFilter } from '@/types/transaction';
import { cn } from '@/lib/utils';

interface PeriodSelectorProps {
  value: PeriodFilter;
  onChange: (period: PeriodFilter) => void;
}

const periods: { value: PeriodFilter; label: string }[] = [
  { value: 'daily', label: 'Today' },
  { value: 'weekly', label: 'This Week' },
  { value: 'monthly', label: 'This Month' },
  { value: 'yearly', label: 'This Year' },
];

const PeriodSelector = ({ value, onChange }: PeriodSelectorProps) => {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-secondary p-1">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={cn(
            'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            value === period.value
              ? 'text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {value === period.value && (
            <motion.div
              layoutId="period-indicator"
              className="absolute inset-0 rounded-lg gradient-primary shadow-sm"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{period.label}</span>
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector;
