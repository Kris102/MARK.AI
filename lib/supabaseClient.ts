'use client'

import { createClient, SupabaseClient } from '@supabase/supabase-js'

export let supabase: SupabaseClient | null = null

export function getSupabase() {
  if (supabase) return supabase

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase env vars are missing at runtime')
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey)
  return supabase
}