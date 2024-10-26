import type { Quest } from '@/types'

export const dummyQuests: Quest[] = [
  {
    id: 1,
    title: "台所の拭き掃除",
    frequency: 'weekly',
    executionDays: [0, 1, 2, 3, 4, 5, 6], // 日曜から土曜まで毎日
    description: "台所全体をきれいに拭き掃除する",
    reward: 20,
    isValid: true
  },
  {
    id: 2,
    title: "肩叩き",
    frequency: 'weekly',
    executionDays: [0, 1, 2, 3, 4, 5, 6], // 日曜から土曜まで毎日
    description: "家族の肩を叩いてマッサージする",
    reward: 10,
    isValid: true
  }
]
