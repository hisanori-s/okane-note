import { dummyTransactions } from '../dummy-db/transactions'
import { dummySettings } from '../dummy-db/settings'
import { dummyWorks, dummyWorkSettings } from '../dummy-db/works'
import { dummyQuests } from '../dummy-db/quests'
import type { TransactionLog, Settings, Work, WorkSettings, Quest } from '@/types'

export const initializeSupabase = () => {
    // 現時点では何もしない
    return false
}

export const getTransactions = async (): Promise<TransactionLog[]> => {
    // Supabase接続がない場合は常にダミーデータを返す
    return dummyTransactions
}

export const getSettings = async (): Promise<Settings> => {
    // Supabase接続がない場合は常にダミーデータを返す
    return dummySettings
}

export const getWorks = async (): Promise<Work[]> => {
    // Supabase接続がない場合は常にダミーデータを返す
    return dummyWorks
}

export const getWorkSettings = async (): Promise<WorkSettings> => {
    // Supabase接続がない場合は常にダミーデータを返す
    return dummyWorkSettings
}

export const getQuests = async (): Promise<Quest[]> => {
    // Supabase接続がない場合は常にダミーデータを返す
    return dummyQuests
}
