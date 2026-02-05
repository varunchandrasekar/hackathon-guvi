import { Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-primary">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold tracking-tight text-foreground">
              Money Manager
            </h1>
            <p className="text-xs text-muted-foreground">Track your finances</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-income-light">
            <div className="h-2 w-2 rounded-full bg-income" />
            <span className="text-xs font-medium text-income">Income</span>
          </div>
          <div className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-expense-light">
            <div className="h-2 w-2 rounded-full bg-expense" />
            <span className="text-xs font-medium text-expense">Expense</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
