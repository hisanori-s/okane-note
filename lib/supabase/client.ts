import { dummyTransactions } from '../dummy-db/transactions'
import { dummyTasks } from '../dummy-db/tasks'
import { dummySettings } from '../dummy-db/settings'
import type { TransactionLog, Task, Settings } from '@/types'

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
