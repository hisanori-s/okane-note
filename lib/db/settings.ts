import { supabase } from '../supabase/client'
import { dummySettings } from '../supabase/dummy/settings'
import type { Settings } from '@/types'

export async function getSettings() {
  if (!supabase) return dummySettings

  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .single()

  if (error) {
    console.error('Error fetching settings:', error)
    return dummySettings
  }

  return data
}

export async function updateSettings(settings: Settings) {
  if (!supabase) return false

  const { error } = await supabase
    .from('settings')
    .upsert(settings)

  if (error) {
    console.error('Error updating settings:', error)
    return false
  }

  return true
}
