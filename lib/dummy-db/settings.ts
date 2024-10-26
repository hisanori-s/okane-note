import type { Settings } from '@/types'

export const dummySettings: Settings = {
  compoundInterest: {
    interestRate: "0.5", // 利率の初期値
    paymentSpan: "weekly", // 支払いスパンの初期値
    paymentDay: "0" // 日曜日の初期値（0）
  },
  workList: {
    checkbox1: false,
    checkbox2: false,
    radio: "option1",
    textField: "",
    selectField: "1"
  },
  questBoard: {
    checkbox1: false,
    checkbox2: false,
    radio: "option1",
    textField: "",
    selectField: "1"
  }
}
