import type { Work, WorkSettings } from '@/types'

export const dummyWorks: Work[] = [
  {
    id: 1,
    title: "週末の大掃除",
    executionSpan: 'weekly',
    executionDays: [6], // 土曜日
    reward: 30,
    isValid: true,
    note: "週末の大掃除タスク"
  },
  {
    id: 2,
    title: "月初めの部屋の整理",
    executionSpan: 'monthly',
    executionDays: [1], // 毎月1日
    reward: 50,
    isValid: true,
    note: "月初めの大掃除"
  },
  {
    id: 3,
    title: "靴を揃える",
    executionSpan: 'weekly',
    executionDays: [0, 1, 2, 3, 4, 5, 6], // 日曜から土曜まで毎日
    reward: 10,
    isValid: true,
    note: "毎日の習慣づけ"
  },
  {
    id: 4,
    title: "お風呂掃除",
    executionSpan: 'weekly',
    executionDays: [6, 0], // 土曜と日曜
    reward: 20,
    isValid: true,
    note: "週末のお風呂掃除"
  }
]

export const dummyWorkSettings: WorkSettings = {
  paymentSpan: 'weekly',
  paymentDay: 0, // 日曜日
}
