"use client";

import { OkaneNoteHeader, OkaneNoteBalance, OkaneNoteWork } from "@/app/components/okane-note"
import { useState } from "react"
import { TransactionLog } from '@/types'
import { dummyTransactions } from '@/lib/supabase/dummy/transactions'

export default function Page() {
  const [transactionLogs, setTransactionLogs] = useState<TransactionLog[]>(dummyTransactions);

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

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <OkaneNoteHeader />
      <OkaneNoteBalance transactionLogs={transactionLogs} setTransactionLogs={setTransactionLogs} addTransaction={addTransaction} />
      <OkaneNoteWork addTransaction={addTransaction} />
    </div>
  )
}
