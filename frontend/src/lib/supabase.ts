import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://panmgjljwrlfcfukjgez.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhbm1namxqd3JsZmNmdWtqZ2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNDcyMzIsImV4cCI6MjA3NDYyMzIzMn0.8uM5Z2Dem8W0Bn3siuWEfM7xMHCpB9usRN-wuGDnECA'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface FloodReport {
  id: string
  user_id: string
  user_name: string
  user_email: string
  title: string
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  location: {
    state: string
    district: string
    lat: number
    lon: number
  }
  images: string[]
  status: 'pending' | 'verified' | 'resolved' | 'false_alarm'
  created_at: string
  updated_at: string
}

export interface AdminAlert {
  id: string
  admin_user_id: string
  title: string
  message: string
  severity: 'yellow' | 'orange' | 'red'
  target_location: {
    state: string
    district: string
    bbox?: number[]
  }
  channels: string[]
  created_at: string
}

export interface AdminLog {
  id: string
  admin_user_id: string
  action: string
  details: Record<string, any>
  created_at: string
}

export interface LocationData {
  id: string
  state: string
  district: string
  lat: number
  lon: number
  population: number
  created_at: string
}
