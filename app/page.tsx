"use client";

import { useState, useEffect } from "react"
import { OkaneNoteHeader } from "@/app/components/okane-note-header"
import { OkaneNoteBalance } from "@/app/components/okane-note-balance"
import { OkaneNoteWork } from "@/app/components/okane-note-work"
import { TransactionLog, Work } from '@/types'
import { getTransactions, getWorks } from '@/lib/supabase/client'

export default function Page() {
  const [transactionLogs, setTransactionLogs] = useState<TransactionLog[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [transactions, fetchedWorks] = await Promise.all([
          getTransactions(),
          getWorks()
        ]);
        setTransactionLogs(transactions);
        setWorks(fetchedWorks);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // エラーハンドリングを行う（例：ユーザーに通知する）
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const addTransaction = (newTransaction: Omit<TransactionLog, 'id' | 'timestamp' | 'balance' | 'isValid'>) => {
    setTransactionLogs(prevLogs => {
      const lastBalance = prevLogs[prevLogs.length - 1]?.balance || 0;
      const newBalance = newTransaction.category === 'income'
        ? lastBalance + newTransaction.amount
        : lastBalance - newTransaction.amount;

      const transaction: TransactionLog = {
        ...newTransaction,
        id: prevLogs.length + 1,
        timestamp: new Date().toISOString(),
        balance: newBalance,
        isValid: true,
      };

      return [...prevLogs, transaction];
    });
  };

  if (isLoading) {
    return <div>Loading...</div>; // またはスケルトンローダーを表示
  }

  // 今日の日付を取得
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayOfMonth = today.getDate();

  // 今日のお仕事リストをフィルタリング
  const todaysWorks = works.filter(work => {
    if (work.executionSpan === 'weekly') {
      return work.executionDays.includes(dayOfWeek);
    } else if (work.executionSpan === 'monthly') {
      return work.executionDays.includes(dayOfMonth);
    }
    return false;
  });

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <OkaneNoteHeader />
      <OkaneNoteBalance
        transactionLogs={transactionLogs}
        addTransaction={addTransaction}
      />
      <OkaneNoteWork
        works={todaysWorks}
        addTransaction={addTransaction}
      />
    </div>
  )
}
