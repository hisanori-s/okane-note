import type { Settings } from '@/types'

export const dummySettings: Settings = {
  compoundInterest: {
    interestRate: "0.5", // 利率の初期値
    paymentSpan: "weekly", // 支払いスパンの初期値
    paymentDay: "0" // 日曜日の初期値（0）
  },
  workList: {
    paymentSpan: "weekly",
    paymentDay: "0"
  },
  questBoard: {}
}
