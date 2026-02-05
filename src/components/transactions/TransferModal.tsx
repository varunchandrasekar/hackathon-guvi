import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Transfer, Account } from '@/types/transaction';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TransferModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transfer: Omit<Transfer, 'id'>) => void;
  accounts: Account[];
}

const TransferModal = ({ open, onClose, onSubmit, accounts }: TransferModalProps) => {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAccount || !toAccount || !amount || fromAccount === toAccount) return;

    onSubmit({
      fromAccountId: fromAccount,
      toAccountId: toAccount,
      amount: parseFloat(amount),
      description: description || `Transfer from ${accounts.find(a => a.id === fromAccount)?.name} to ${accounts.find(a => a.id === toAccount)?.name}`,
      date: new Date(),
    });

    setFromAccount('');
    setToAccount('');
    setAmount('');
    setDescription('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Transfer Money</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-2">
              <Label>From</Label>
              <Select value={fromAccount} onValueChange={setFromAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: acc.color }}
                        />
                        {acc.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground mt-6" />

            <div className="flex-1 space-y-2">
              <Label>To</Label>
              <Select value={toAccount} onValueChange={setToAccount}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts
                    .filter((acc) => acc.id !== fromAccount)
                    .map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        <span className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: acc.color }}
                          />
                          {acc.name}
                        </span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 text-xl font-display font-bold h-12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Input
              placeholder="Add a note..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full h-11 gradient-primary shadow-primary font-semibold">
            Transfer
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransferModal;
