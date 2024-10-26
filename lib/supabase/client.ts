import { dummyTransactions } from './dummy/transactions'
import { dummyTasks } from './dummy/tasks'
import { dummySettings } from './dummy/settings'
import type { TransactionLog, Task, Settings } from '@/types'

// Supabase関連のコードをコメントアウト
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// let supabaseClient: ReturnType<typeof createClient> | null = null

export const initializeSupabase = () => {
    // 現時点では何もしない
    return false
}

export const getTransactions = async (): Promise<TransactionLog[]> => {
    // Supabase接続がない場合は常にダミーデータを返す
    return dummyTransactions
}

export const getTasks = async (): Promise<Task[]> => {
    // Supabase接続がない場合は常にダミーデータを返す
    return dummyTasks
}

export const getSettings = async (): Promise<Settings> => {
    // Supabase接続がない場合は常にダミーデータを返す
    return dummySettings
}
