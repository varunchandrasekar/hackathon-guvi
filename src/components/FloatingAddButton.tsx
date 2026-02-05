import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FloatingAddButtonProps {
  onClick: () => void;
}

const FloatingAddButton = ({ onClick }: FloatingAddButtonProps) => {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-primary shadow-primary transition-shadow hover:shadow-xl md:bottom-8 md:right-8 md:h-16 md:w-16"
    >
      <Plus className="h-6 w-6 text-primary-foreground md:h-7 md:w-7" />
    </motion.button>
  );
};

export default FloatingAddButton;
