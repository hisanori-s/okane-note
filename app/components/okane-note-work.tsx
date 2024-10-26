import { useState, useEffect, useRef, useCallback } from "react"
import { ArrowLeftRight, ChevronRight, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

import { TransactionLog, Work, DailyWorkRecord, Quest } from '@/types'
import { getWorks, getQuests } from '@/lib/supabase/client'

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
function QuestBoard({ onToggleQuest, onBack, completedQuests }: { onToggleQuest: (quest: Quest) => void, onBack: () => void, completedQuests: Quest[] }) {
  const [quests, setQuests] = useState<Quest[]>([]);

  useEffect(() => {
    const fetchQuests = async () => {
      const fetchedQuests = await getQuests();
      setQuests(fetchedQuests.filter(quest => quest.isValid));
    };
    fetchQuests();
  }, []);

  const getExecutionDaysText = (quest: Quest) => {
    if (quest.frequency === 'weekly') {
      const days = ['日', '月', '火', '水', '木', '金', '土'];
      return quest.executionDays.map(day => days[day]).join(', ');
    } else {
      return quest.executionDays.join(', ') + '日';
    }
  };

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
                checked={completedQuests.some(q => q.id === quest.id)}
                onCheckedChange={() => onToggleQuest(quest)}
              />
              <label
                htmlFor={`quest-${quest.id}`}
                className="flex-grow text-muted-foreground"
              >
                {quest.title} ({quest.frequency === 'weekly' ? '毎週' : '毎月'}: {getExecutionDaysText(quest)})
                <span className="ml-2 text-green-600">+{quest.reward}円</span>
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
  const [todaysWorks, setTodaysWorks] = useState<Work[]>([]);
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
  const [showQuestBoard, setShowQuestBoard] = useState<boolean>(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [animatingTaskId, setAnimatingTaskId] = useState<number | null>(null);
  const [isWorkDayCompleted, setIsWorkDayCompleted] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState<{ isOpen: boolean; quest: Quest | null }>({ isOpen: false, quest: null });
  const [isCalculating, setIsCalculating] = useState(false);
  const lastSavedDate = useRef(new Date().toDateString());

  const toggleTask = (id: number) => {
    setTodaysWorks(prevWorks => prevWorks.map(work => {
      if (work.id === id) {
        const newCompleted = !work.completed;
        if (newCompleted) {
          setAnimatingTaskId(id);
          setTimeout(() => setAnimatingTaskId(null), 500);
        }
        return { ...work, completed: newCompleted };
      }
      return work;
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
      const completedWorks = todaysWorks.filter(work => work.completed);
      const allCompletedTasks = [...completedWorks, ...completedQuests];
      const dailyRecord: DailyWorkRecord = {
        id: Date.now(),
        userId: 1, // 仮のユーザーID
        date: new Date().toISOString().split('T')[0],
        scheduledTasksCount: todaysWorks.length,
        completedTasksCount: allCompletedTasks.length,
        maxPossibleReward: allCompletedTasks.reduce((sum, task) => sum + task.reward, 0),
        scheduledTasks: todaysWorks.map(({ id, title, reward }) => ({ id, title, reward })),
        completedTasks: allCompletedTasks.map(({ id, title, reward }) => ({ id, title, reward })),
      };

      // TODO: 将来的にはここでデータベースに保存する処理を実装する
      console.log('Daily work record saved:', dailyRecord);
      setIsWorkDayCompleted(true);
      setIsCalculating(false);
    }, 1000);
  }, [todaysWorks, completedQuests]);

  const handleQuestCompletion = (quest: Quest) => {
    const isAlreadyCompleted = completedQuests.some(q => q.id === quest.id);
    if (isAlreadyCompleted) {
      // クエストが既に完了している場合、直接削除
      setCompletedQuests(prev => prev.filter(q => q.id !== quest.id));
      // トランザクションを削除（または負の金額で相殺）
      addTransaction({
        amount: -quest.reward,
        title: `クエスト報酬取消: ${quest.title}`,
        note: '',
        category: 'expense',
      });
    } else {
      // クエストがまだ完了していない場合、確認ダイアログを表示
      setConfirmationDialog({ isOpen: true, quest });
    }
  };

  const confirmQuestCompletion = () => {
    if (confirmationDialog.quest) {
      // クエスト達成の処理を実装
      setCompletedQuests(prev => [...prev, confirmationDialog.quest!]);

      // トランザクションを追加
      addTransaction({
        amount: confirmationDialog.quest.reward,
        title: `クエスト報酬: ${confirmationDialog.quest.title}`,
        note: '',
        category: 'income',
      });

      // 確認ダイアログを閉じる
      setConfirmationDialog({ isOpen: false, quest: null });
    }
  };

  useEffect(() => {
    const handleDateChange = async () => {
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
        setCompletedQuests([]); // 日付が変わったらクエストの達成状況をリセット

        // 仕事のリセットと今日の仕事のフィルタリング
        const fetchedWorks = await getWorks();
        filterTodaysWorks(fetchedWorks);
      }
    };

    handleDateChange();
    const intervalId = setInterval(handleDateChange, 60000); // 1分ごとにチェック

    return () => clearInterval(intervalId);
  }, [saveDailyWorkRecord]); // saveDailyWorkRecordを依存配列に追加

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

  useEffect(() => {
    const fetchWorks = async () => {
      const fetchedWorks = await getWorks();
      filterTodaysWorks(fetchedWorks);
    };
    fetchWorks();
  }, []);

  const filterTodaysWorks = (allWorks: Work[]) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayOfMonth = today.getDate();

    const filteredWorks = allWorks.filter(work => {
      if (work.executionSpan === 'weekly') {
        return work.executionDays.includes(dayOfWeek);
      } else if (work.executionSpan === 'monthly') {
        return work.executionDays.includes(dayOfMonth);
      }
      return false;
    }).map(work => ({ ...work, completed: false }));

    setTodaysWorks(filteredWorks);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {showQuestBoard ? (
        <QuestBoard
          onToggleQuest={handleQuestCompletion}
          onBack={() => setShowQuestBoard(false)}
          completedQuests={completedQuests}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>今日のおしごとリスト</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {todaysWorks.map(work => (
                <li key={work.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`work-${work.id}`}
                    checked={work.completed}
                    onCheckedChange={() => toggleTask(work.id)}
                    disabled={isWorkDayCompleted}
                  />
                  <label
                    htmlFor={`work-${work.id}`}
                    className={`flex-grow ${work.completed ? 'font-bold text-foreground' : 'text-muted-foreground'}`}
                  >
                    {work.title}
                    <AnimatedReward
                      reward={work.reward}
                      isCompleted={work.completed ?? false}
                      isAnimating={animatingTaskId === work.id}
                      isQuest={false}
                    />
                  </label>
                </li>
              ))}
              {completedQuests.map(quest => (
                <li key={quest.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`quest-${quest.id}`}
                    checked={true}
                    disabled={true}
                  />
                  <label
                    htmlFor={`quest-${quest.id}`}
                    className="flex-grow font-bold text-foreground"
                  >
                    {quest.title}
                    <AnimatedReward
                      reward={quest.reward}
                      isCompleted={true}
                      isAnimating={false}
                      isQuest={true}
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

      {confirmationDialog.quest && (
        <p className="text-sm mb-4">
          「{confirmationDialog.quest.title}」を完了しますか？
        </p>
      )}

      <ConfirmationDialog
        isOpen={confirmationDialog.isOpen}
        onClose={() => setConfirmationDialog({ isOpen: false, quest: null })}
        onConfirm={confirmQuestCompletion}
        title="クエスト完了"
        message={confirmationDialog.quest ? `「${confirmationDialog.quest.title}」を完了しますか？` : ""}
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
