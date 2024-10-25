import { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { TransactionLog } from '@/types'

interface TransactionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdrawal';
  onSubmit: (transaction: Omit<TransactionLog, 'id' | 'timestamp' | 'balance' | 'isValid'>) => void;
}

export function TransactionPopup({ isOpen, onClose, type, onSubmit }: TransactionPopupProps) {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const amountInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && amountInputRef.current) {
      amountInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      amount: Number(amount),
      title,
      note,
      category: type === 'deposit' ? 'income' : 'expense',
    });
    setAmount('');
    setTitle('');
    setNote('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === 'deposit' ? '入金' : '出金'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              金額
            </label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              ref={amountInputRef}
              required
              min="1"
              step="1"
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              タイトル
            </label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">
              備考
            </label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button type="submit" className="w-full">
            {type === 'deposit' ? '入金' : '出金'}する
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
