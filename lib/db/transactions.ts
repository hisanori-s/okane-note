import { supabase } from '../supabase/client'
import { dummyTransactions } from '../supabase/dummy/transactions'
import type { TransactionLog } from '@/types'

export async function getTransactions() {
  if (!supabase) return dummyTransactions

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('timestamp', { ascending: false })

  if (error) {
    console.error('Error fetching transactions:', error)
    return dummyTransactions
  }

  return data
}

export async function addTransaction(transaction: Omit<TransactionLog, 'id'>) {
  if (!supabase) return false

  const { error } = await supabase
    .from('transactions')
    .insert(transaction)

  if (error) {
    console.error('Error adding transaction:', error)
    return false
  }

  return true
}
