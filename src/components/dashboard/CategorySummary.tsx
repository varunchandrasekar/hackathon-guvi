import { motion } from 'framer-motion';
import { getCategoryById, getCategoryColor } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface CategoryData {
  category: string;
  income: number;
  expense: number;
  total: number;
}

interface CategorySummaryProps {
  data: CategoryData[];
}

const CategorySummary = ({ data }: CategorySummaryProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  const totalExpense = data.reduce((sum, d) => sum + d.expense, 0);

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">
          Category Summary
        </h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          No transactions in this period
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-2xl border border-border bg-card p-6"
    >
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">
        Category Summary
      </h3>
      
      <div className="space-y-4">
        {data
          .filter(d => d.expense > 0)
          .sort((a, b) => b.expense - a.expense)
          .map((item, index) => {
            const category = getCategoryById(item.category);
            const percentage = totalExpense > 0 ? (item.expense / totalExpense) * 100 : 0;
            
            return (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: getCategoryColor(item.category) }}
                    />
                    <span className="text-sm font-medium text-foreground">
                      {category?.name || item.category}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-expense">
                    {formatCurrency(item.expense)}
                  </span>
                </div>
                
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.2 + 0.1 * index, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: getCategoryColor(item.category) }}
                  />
                </div>
              </motion.div>
            );
          })}
      </div>
    </motion.div>
  );
};

export default CategorySummary;
