"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowLeftRight, ChevronRight, ChevronLeft, X, HelpCircle, Settings, Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import { TransactionLog, Task, DailyWorkRecord, SettingsSection, SettingsData } from '@/types'
import { dummyTransactions } from '@/lib/supabase/dummy/transactions'
import { dummyTasks } from '@/lib/supabase/dummy/tasks'
import { formatDate, getNextSunday } from '@/lib/date-utils'
import { calculateCompoundInterest } from '@/lib/financial-utils'

// コンポーネント一覧
// - AnimatedReward: アニメーション付きの報酬表示コンポーネント（お仕事セクション）
// - QuestBoard: クエストボードコンポーネント（クエストセクション）
// - TransactionPopup: 取引ポップアップコンポーネント（入出金ポップアップ）
// - ConfirmationDialog: 確認ダイアログコンポーネント（クエストボードでのクエスト完了確認）
// - TransactionHistory: 取引履歴コンポーネント（通帳セクション）
// - CustomTooltip: カスタムツールチップコンポーネント（残高概要セクション）
// - OkaneNote: メインのOkaneNoteコンポーネント

// アニメーション付きの報酬表示コンポーネント（お仕事セクション）
function AnimatedReward({ reward, isCompleted, isAnimating, isQuest }: { reward: number; isCompleted: boolean; isAnimating: boolean; isQuest: boolean }) {
  return (
    <span
      className={`
        inline-block ml-2 font-bold
        transition-opacity duration-300 ease-in-out
        ${isCompleted ? 'opacity-100' : 'opacity-0'}
        ${isAnimating ? 'animate-reward-appear' : ''}
        ${isQuest ? 'text-green-600' : 'text-blue-600'}
      `}
      aria-live="polite"
      aria-atomic="true"
    >
      {isQuest ? `+${reward}円` : 'CLEAR!'}
    </span>
  );
}

// QuestBoardコンポーネント（クエストボード）
function QuestBoard({ tasks, onToggleTask, onBack }: { tasks: Task[], onToggleTask: (id: number) => void, onBack: () => void }) {
  const quests = tasks.filter(task => task.category === 'クエスト' && task.isValid);

  return (
    <Card>
      <CardHeader>
        <CardTitle>クエストボード</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {quests.map(quest => (
            <li key={quest.id} className="flex items-center space-x-2">
              <Checkbox
                id={`quest-${quest.id}`}
                checked={quest.completed}
                onCheckedChange={() => onToggleTask(quest.id)}
                disabled={quest.completed}
              />
              <label
                htmlFor={`quest-${quest.id}`}
                className={`flex-grow ${quest.completed ? 'font-bold text-foreground' : 'text-muted-foreground'}`}
              >
                {quest.title}
                <AnimatedReward
                  reward={quest.reward}
                  isCompleted={quest.completed}
                  isAnimating={false}
                  isQuest={true}
                />
              </label>
            </li>
          ))}
        </ul>
        <Button variant="link" className="p-0 h-auto mt-4" onClick={onBack}>
          <ChevronLeft className="h-4 w-4 mr-1" /> お仕事リストに戻る
        </Button>
      </CardContent>
    </Card>
  )
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

// 確認ダイアログコンポーネント（クエストボードでのクエスト完了確認）
function ConfirmationDialog({ isOpen, onClose, onConfirm, title, message }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p>{message}</p>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">キャンセル</Button>
          <Button onClick={onConfirm}>OK</Button>
        </DialogFooter>
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

// メインのOkaneNoteコンポーネント
export function OkaneNote() {
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [showQuestBoard, setShowQuestBoard] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [animatingTaskId, setAnimatingTaskId] = useState<number | null>(null);
  const [transactionPopup, setTransactionPopup] = useState<{ isOpen: boolean; type: 'deposit' | 'withdrawal' } | null>(null);
  const [transactionLogs, setTransactionLogs] = useState<TransactionLog[]>(dummyTransactions);
  const [isWorkDayCompleted, setIsWorkDayCompleted] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState<{ isOpen: boolean; taskId: number | null }>({ isOpen: false, taskId: null });
  const [isCalculating, setIsCalculating] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Initial value is now false
  const [settingsData, setSettingsData] = useState<SettingsData>({
    compoundInterest: {
      checkbox1: false,
      checkbox2: false,
      radio: "option1",
      textField: "",
      selectField: "1"
    },
    workList: {
      checkbox1: false,
      checkbox2: false,
      radio: "option1",
      textField: "",
      selectField: "1"
    },
    questBoard: {
      checkbox1: false,
      checkbox2: false,
      radio: "option1",
      textField: "",
      selectField: "1"
    }
  });
  const lastSavedDate = useRef(new Date().toDateString());

  const today = new Date();
  const formattedDate = formatDate(today);
  const latestBalance = transactionLogs[transactionLogs.length - 1].balance;
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
    setTransactionPopup({ isOpen: true, type });
  };

  const closeTransactionPopup = () => {
    setTransactionPopup(null);
  };

  const addTransaction = (newTransaction: Omit<TransactionLog, 'id' | 'timestamp' | 'balance' | 'isValid'>) => {
    setIsCalculating(true);
    setTimeout(() => {
      const lastBalance = transactionLogs[transactionLogs.length - 1]?.balance || 0;
      const newBalance = newTransaction.category === 'income'
        ? lastBalance + newTransaction.amount
        : lastBalance - newTransaction.amount;

      const transaction: TransactionLog = {
        ...newTransaction,
        id: transactionLogs.length + 1,
        timestamp: new Date().toISOString(),
        balance: newBalance,
        isValid: true,
      };

      setTransactionLogs(prevLogs => [...prevLogs, transaction]);
      setIsCalculating(false);
    }, 1000);
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newCompleted = !task.completed;
        if (newCompleted) {
          setAnimatingTaskId(id);
          setTimeout(() => setAnimatingTaskId(null), 500);
        }
        return { ...task, completed: newCompleted };
      }
      return task;
    }));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe || isRightSwipe) {
      setShowQuestBoard(prev => !prev);
    }
  }

  const saveDailyWorkRecord = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const completedTasks = tasks.filter(task => task.completed && task.category === 'お仕事');
      const dailyRecord: DailyWorkRecord = {
        id: Date.now(),
        userId: 1, // 仮のユーザーID
        date: new Date().toISOString().split('T')[0],
        scheduledTasksCount: tasks.filter(task => task.category === 'お仕事').length,
        completedTasksCount: completedTasks.length,
        maxPossibleReward: tasks.filter(task => task.category === 'お仕事').reduce((sum, task) => sum + task.reward, 0),
        scheduledTasks: tasks.filter(task => task.category === 'お仕事').map(({ id, title, reward }) => ({ id, title, reward })),
        completedTasks: completedTasks.map(({ id, title, reward }) => ({ id, title, reward })),
      };
      console.log('Daily work record saved:', dailyRecord);
      setIsWorkDayCompleted(true);
      setIsCalculating(false);
    }, 1000);
  };

  const handleQuestCompletion = (taskId: number) => {
    setConfirmationDialog({ isOpen: true, taskId });
  };

  const confirmQuestCompletion = () => {
    if (confirmationDialog.taskId !== null) {
      const quest = tasks.find(task => task.id === confirmationDialog.taskId);
      if (quest) {
        toggleTask(quest.id);
        addTransaction({
          amount: quest.reward,
          title: `クエスト報酬: ${quest.title}`,
          note: '',
          category: 'income',
        });
      }
    }
    setConfirmationDialog({ isOpen: false, taskId: null });
  };

  const handleEditModeToggle = (checked: boolean) => { // Updated handleEditModeToggle function
    if (checked && !isEditMode) {
      const enteredPassword = prompt("パスワードを入力してください:");
      if (enteredPassword === "1234") {
        setIsEditMode(true);
      } else {
        alert("パスワードが間違っています。");
      }
    } else {
      setIsEditMode(checked);
    }
  };

  const handleSettingsChange = (section: keyof SettingsData, field: keyof SettingsSection, value: string | boolean) => {
    setSettingsData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // ここで設定を保存する処理を実装
    console.log("Settings saved:", settingsData);
    setIsEditMode(false);
  };

  useEffect(() => {
    const handleDateChange = () => {
      const currentDate = new Date().toDateString();
      if (currentDate !== lastSavedDate.current) {
        const daysBetween = Math.floor((new Date(currentDate).getTime() - new Date(lastSavedDate.current).getTime()) / (1000 * 3600 * 24));

        if (daysBetween <= 7) {
          // 7日以内の場合、全ての日のログを作成
          for (let i = 1; i <= daysBetween; i++) {
            const date = new Date(lastSavedDate.current);
            date.setDate(date.getDate() + i);
            saveDailyWorkRecord();
          }
        } else {
          // 8日以上の場合、直近7日分のみログを作成
          for (let i = 6; i >= 0; i--) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - i);
            saveDailyWorkRecord();
          }
        }

        lastSavedDate.current = currentDate;
        setIsWorkDayCompleted(false);
        // タスクのリセット処理をここに追加
        setTasks(dummyTasks.map(task => ({ ...task, completed: false })));
      }
    };

    handleDateChange();
    const intervalId = setInterval(handleDateChange, 60000); // 1分ごとにチェック

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        setShowQuestBoard(prev => !prev);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  return (
    <div
      className="max-w-md mx-auto p-4 space-y-4"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <style jsx global>{`
        @keyframes rewardAppear {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-reward-appear {
          animation: rewardAppear 0.5s ease-out;
        }
      `}</style>
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => setShowHelpPopup(true)}>
          <HelpCircle className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Okane note</h1>
        <Button variant="ghost" size="icon" onClick={() => setShowSettingsPopup(true)}>
          <Settings className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex justify-between space-x-4 mb-4">
        <Button onClick={() => openTransactionPopup('deposit')} className="flex-1 text-lg py-6">入金</Button>
        <Button onClick={() => openTransactionPopup('withdrawal')} className="flex-1 text-lg py-6">出金</Button>
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

      {showQuestBoard ? (
        <QuestBoard
          tasks={tasks}
          onToggleTask={handleQuestCompletion}
          onBack={() => setShowQuestBoard(false)}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>今日のおしごとリスト</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tasks.filter(task => (task.category === 'お仕事' && task.isValid) || (task.category === 'クエスト' && task.completed)).map(task => (
                <li key={task.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => task.category === 'クエスト' ? null : toggleTask(task.id)}
                    disabled={isWorkDayCompleted || task.category === 'クエスト'}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`flex-grow ${task.completed ? 'font-bold text-foreground' : 'text-muted-foreground'}`}
                  >
                    {task.title}
                    {task.category === 'クエスト' && (
                      <span className="ml-1 text-sm text-muted-foreground">(クエスト)</span>
                    )}
                    <AnimatedReward
                      reward={task.reward}
                      isCompleted={task.completed}
                      isAnimating={animatingTaskId === task.id}
                      isQuest={task.category === 'クエスト'}
                    />
                  </label>
                </li>
              ))}
            </ul>
            <div className="flex justify-end mt-4">
              <Button variant="link" className="p-0 h-auto" onClick={() => setShowQuestBoard(true)}>
                クエストボード <ChevronRight className="h-4 w-4"  />
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={saveDailyWorkRecord}
              disabled={isWorkDayCompleted}
              className="w-full"
            >
              今日のおしごと完了
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="text-center text-sm text-muted-foreground">
        <ArrowLeftRight className="inline mr-1" size={16} />
        左右スワイプで臨時仕事とお仕事リストを切り替え
      </div>

      <TransactionPopup
        isOpen={transactionPopup?.isOpen ?? false}
        onClose={closeTransactionPopup}
        type={transactionPopup?.type ?? 'deposit'}
        onSubmit={addTransaction}
      />

      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() => setConfirmationDialog({ isOpen: false, taskId: null })}
        onConfirm={confirmQuestCompletion}
        title="クエスト完了"
        message="このクエストを完了しますか？"
      />

      {showHistory && (
        <TransactionHistory
          transactions={transactionLogs}
          onClose={() => setShowHistory(false)}
        />
      )}

      {isCalculating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-lg font-bold">報酬計算中...</p>
          </div>
        </div>
      )}

      <Dialog open={showHelpPopup} onOpenChange={setShowHelpPopup}>
        <DialogContent className="w-full h-[80vh] max-w-md mx-auto overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ヘルプ</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {/* ヘルプの内容をここに追加 */}
            <p>ここにヘルプの内容が表示されます。</p>
            <p>スクロールして全ての情報を確認できます。</p>
            {/* 長いコンテンツをシミュレートするためのダミーテキスト */}
            {Array(20).fill(0).map((_, i) => (
              <p key={i}>これはダミーテキストです。実際のヘルプコンテンツに置き換えてください。</p>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSettingsPopup} onOpenChange={setShowSettingsPopup}>
        <DialogContent className="w-full h-[80vh] max-w-md mx-auto overflow-y-auto">
          <DialogHeader>
            <DialogTitle>設定</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-mode" className="flex items-center space-x-2">
                <span>編集モード</span>
                {isEditMode ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </Label>
              <Switch // Updated Switch component
                id="edit-mode"
                checked={isEditMode}
                onCheckedChange={handleEditModeToggle}
              />
            </div>

            {['compoundInterest', 'workList', 'questBoard'].map((section) => (
              <div key={section}>
                <h3 className="text-lg font-semibold mb-2">
                  {section === 'compoundInterest' ? '複利に関する設定' :
                   section === 'workList' ? 'お仕事リスト関係の設定' :
                   'クエストボード関係の設定'}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${section}-checkbox1`}
                      checked={settingsData[section as keyof SettingsData].checkbox1}
                      onCheckedChange={(checked) => handleSettingsChange(section as keyof SettingsData, 'checkbox1', checked)}
                      disabled={!isEditMode}
                    />
                    <Label htmlFor={`${section}-checkbox1`}>チェックボックス1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`${section}-checkbox2`}
                      checked={settingsData[section as keyof SettingsData].checkbox2}
                      onCheckedChange={(checked) => handleSettingsChange(section as keyof SettingsData, 'checkbox2', checked)}
                      disabled={!isEditMode}
                    />
                    <Label htmlFor={`${section}-checkbox2`}>チェックボックス2</Label>
                  </div>
                  <RadioGroup
                    value={settingsData[section as keyof SettingsData].radio}
                    onValueChange={(value) => handleSettingsChange(section as keyof SettingsData, 'radio', value)}
                    disabled={!isEditMode}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option1"                       id={`${section}-radio1`} />
                      <Label htmlFor={`${section}-radio1`}>オプション1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option2" id={`${section}-radio2`} />
                      <Label htmlFor={`${section}-radio2`}>オプション2</Label>
                    </div>
                  </RadioGroup>
                  <Input
                    placeholder="テキストフィールド"
                    value={settingsData[section as keyof SettingsData].textField}
                    onChange={(e) => handleSettingsChange(section as keyof SettingsData, 'textField', e.target.value)}
                    disabled={!isEditMode}
                  />
                  <Select
                    value={settingsData[section as keyof SettingsData].selectField}
                    onValueChange={(value) => handleSettingsChange(section as keyof SettingsData, 'selectField', value)}
                    disabled={!isEditMode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="数字を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({length: 30}, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}

            {isEditMode && (
              <Button onClick={handleSaveSettings} className="w-full">
                変更を反映
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
