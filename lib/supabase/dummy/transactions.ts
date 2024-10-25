import type { TransactionLog } from '@/types'

export const dummyTransactions: TransactionLog[] = [
  { id: 1, timestamp: "2024-01-01T12:00:00Z", amount: 10000, balance: 10000, title: "お小遣い", note: "初期入金", category: "income", isValid: true },
  { id: 2, timestamp: "2024-10-01T09:00:00Z", amount: 120, balance: 10120, title: "お仕事報酬", note: "", category: "income", isValid: true },
  { id: 3, timestamp: "2024-10-05T14:30:00Z", amount: 220, balance: 9900, title: "おかし", note: "", category: "expense", isValid: true },
  { id: 4, timestamp: "2024-10-10T10:15:00Z", amount: 130, balance: 10030, title: "お仕事報酬", note: "追加タスク", category: "income", isValid: true },
  { id: 5, timestamp: "2024-10-15T16:45:00Z", amount: 330, balance: 9700, title: "おもちゃ", note: "", category: "expense", isValid: true },
  // ... 他のダミーデータ
]
