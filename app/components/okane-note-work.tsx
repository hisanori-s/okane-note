import { useState, useEffect, useRef, useCallback } from "react"
import { ArrowLeftRight, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

import { TransactionLog, Task, DailyWorkRecord } from '@/types'
import { dummyTasks } from '@/lib/supabase/dummy/tasks'

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







// お仕事セクション
export function OkaneNoteWork({ addTransaction }: { addTransaction: (newTransaction: Omit<TransactionLog, 'id' | 'timestamp' | 'balance' | 'isValid'>) => void }) {
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [showQuestBoard, setShowQuestBoard] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [animatingTaskId, setAnimatingTaskId] = useState<number | null>(null);
  const [isWorkDayCompleted, setIsWorkDayCompleted] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState<{ isOpen: boolean; taskId: number | null }>({ isOpen: false, taskId: null });
  const [isCalculating, setIsCalculating] = useState(false);
  const lastSavedDate = useRef(new Date().toDateString()); // この行を追加

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

  const saveDailyWorkRecord = useCallback(() => {
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
  }, [tasks]); // tasks を依存配列に追加

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
  }, [saveDailyWorkRecord]); // saveDailyWorkRecord を依存配列に追加

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
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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

      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() => setConfirmationDialog({ isOpen: false, taskId: null })}
        onConfirm={confirmQuestCompletion}
        title="クエスト完了"
        message="このクエストを完了しますか？"
      />

      {isCalculating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-lg font-bold">報酬計算中...</p>
          </div>
        </div>
      )}
    </div>
  );
}
