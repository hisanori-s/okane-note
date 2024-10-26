import type { Work, WorkSettings } from '@/types'

export const dummyWorks: Work[] = [
  {
    id: 1,
    title: "洗濯物をタンスに入れる",
    executionSpan: 'weekly',
    executionDays: [1, 2, 3, 4, 5], // 平日
    reward: 60,
    isValid: true,
    note: "自分のじゃなくても片付ける",
    completed: false
  },
  {
    id: 2,
    title: "靴を揃える",
    executionSpan: 'weekly',
    executionDays: [0, 1, 2, 3, 4, 5, 6], // 日曜から土曜まで毎日
    reward: 80,
    isValid: true,
    note: "自分のじゃなくても片付けよう",
    completed: false
  },
  {
    id: 3,
    title: "お風呂掃除",
    executionSpan: 'weekly',
    executionDays: [6, 0], // 土曜と日曜
    reward: 30,
    isValid: true,
    note: "お風呂の水を抜くだけ",
    completed: false
  }
]

export const dummyWorkSettings: WorkSettings = {
  paymentSpan: 'weekly',
  paymentDay: 0, // 日曜日
}
