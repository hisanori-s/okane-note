import type { Task } from '@/types'

export const dummyTasks: Task[] = [
  { id: 1, category: 'お仕事', isValid: true, title: "お風呂を洗う", note: "毎日の習慣づけ", reward: 10, completed: false },
  { id: 2, category: 'お仕事', isValid: true, title: "食器を片付けた後のテーブルを拭く", note: "食事の後片付け", reward: 10, completed: false },
  { id: 3, category: 'クエスト', isValid: true, title: "台所の拭き掃除", note: "特別な掃除タスク", reward: 20, completed: false },
  { id: 4, category: 'クエスト', isValid: true, title: "玄関の掃き掃除", note: "外回りの掃除", reward: 20, completed: false },
  { id: 5, category: 'クエスト', isValid: true, title: "肩たたき", note: "家族のケア", reward: 10, completed: false },
  // ... 他のダミーデータ
]
