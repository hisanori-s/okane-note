import { useState, useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import { TransactionLog } from '@/types'
import { formatDate, getNextSunday } from '@/lib/date-utils'
import { calculateCompoundInterest } from '@/lib/financial-utils'

// OkaneNoteBalanceProps インターフェースを追加
interface OkaneNoteBalanceProps {
  transactionLogs: TransactionLog[];
  addTransaction: (newTransaction: Omit<TransactionLog, 'id' | 'timestamp' | 'balance' | 'isValid'>) => void;
}

// TransactionPopupPropsの定義を追加（入出金ポップアップ）
interface TransactionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdrawal';
  onSubmit: (transaction: Omit<TransactionLog, 'id' | 'timestamp' | 'balance' | 'isValid'>) => void;
}




// TransactionPopupコンポーネントを統合（入出金ポップアップ）
function TransactionPopup({ isOpen, onClose, type, onSubmit }: TransactionPopupProps) {
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






// 取引履歴コンポーネント（通帳セクション）
function TransactionHistory({ transactions, onClose }: { transactions: TransactionLog[], onClose: () => void }) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isRightSwipe = distance < -50;
    if (isRightSwipe) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 bg-background z-50 p-4 overflow-auto"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Button onClick={onClose} className="absolute top-4 right-4" variant="ghost" size="icon">
        <X className="h-4 w-4" />
      </Button>
      <h2 className="text-2xl font-bold mb-4">おかね通帳</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">日付</th>
            <th className="text-left">タイトル</th>
            <th className="text-right">金額</th>
            <th className="text-right">残高</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{new Date(transaction.timestamp).toLocaleDateString()}</td>
              <td>{transaction.title}</td>
              <td className={`text-right ${transaction.category === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.category === 'income' ? '+' : '-'}{transaction.amount.toLocaleString()}円
              </td>
              <td className="text-right">{transaction.balance.toLocaleString()}円</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


// カスタムツールチップコンポーネント（残高概要セクション）
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow">
        <p className="text-sm">{`日付: ${new Date(label as string).toLocaleDateString()}`}</p>
        <p className="text-sm">{`残高: ${(payload[0].value as number).toLocaleString()}円`}</p>
        {payload[1] && <p className="text-sm text-green-600">{`入金: ${(payload[1].value as number).toLocaleString()}円`}</p>}
        {payload[2] && <p className="text-sm text-red-600">{`出金: ${(payload[2].value as number).toLocaleString()}円`}</p>}
      </div>
    );
  }
  return null;
};

// 残高概要セクション
export function OkaneNoteBalance({ transactionLogs, addTransaction }: OkaneNoteBalanceProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const today = new Date();
  const formattedDate = formatDate(today);
  const latestBalance = transactionLogs.length > 0 ? transactionLogs[transactionLogs.length - 1].balance : 0;
  const nextSunday = getNextSunday(today);
  const nextInterestAmount = calculateCompoundInterest(latestBalance, 0.005) - latestBalance;

  const getLast30DaysData = () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const filteredLogs = transactionLogs.filter(log => new Date(log.timestamp) >= thirtyDaysAgo);

    // lastBalanceを削除し、直接filteredLogsを使用
    return filteredLogs.map(log => ({
      date: log.timestamp,
      balance: log.balance,
      income: log.category === 'income' ? log.amount : 0,
      expense: log.category === 'expense' ? log.amount : 0
    }));
  };

  const chartData = getLast30DaysData();

  const openTransactionPopup = (type: 'deposit' | 'withdrawal') => {
    setTransactionType(type === 'deposit' ? 'income' : 'expense');
    setIsDialogOpen(true);
  };

  const closeTransactionPopup = () => {
    setIsDialogOpen(false);
  };

  const handleAddTransaction = (newTransaction: Omit<TransactionLog, 'id' | 'timestamp' | 'balance' | 'isValid'>) => {
    setIsCalculating(true);
    addTransaction(newTransaction);
    setTimeout(() => {
      setIsCalculating(false);
    }, 1000);
  };

  return (
    <>
      <div className="flex justify-between space-x-4 mb-4">
        <Button
          onClick={() => openTransactionPopup('deposit')}
          className="flex-1 text-lg py-6"
          disabled={isCalculating}
        >
          入金
        </Button>
        <Button
          onClick={() => openTransactionPopup('withdrawal')}
          className="flex-1 text-lg py-6"
          disabled={isCalculating}
        >
          出金
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground" aria-label="今日の日付">今日：{formattedDate}</span>
          </div>
          <CardTitle className="text-right">残高 {latestBalance.toLocaleString()}円</CardTitle>
          <p className="text-sm text-right text-muted-foreground" aria-label="次回の複利入金予定">
            [複利予定] {formatDate(nextSunday)} +{nextInterestAmount}円
          </p>
        </CardHeader>
        <CardContent>
          {isCalculating && (
            <div className="text-center text-sm text-muted-foreground mb-2">
              計算中...
            </div>
          )}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" hide={true} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" fill="#4CAF50" />
                <Bar dataKey="expense" fill="#F44336" />
                <Line type="monotone" dataKey="balance" stroke="#2196F3" dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-2">
            <Button variant="outline" size="sm" onClick={() => setShowHistory(true)}>通帳を見る</Button>
          </div>
        </CardContent>
      </Card>

      <TransactionPopup
        isOpen={isDialogOpen}
        onClose={closeTransactionPopup}
        type={transactionType === 'income' ? 'deposit' : 'withdrawal'}
        onSubmit={handleAddTransaction}
      />

      {showHistory && (
        <TransactionHistory
          transactions={transactionLogs}
          onClose={() => setShowHistory(false)}
        />
      )}
    </>
  );
}
