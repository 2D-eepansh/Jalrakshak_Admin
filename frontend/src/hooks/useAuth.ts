import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { logAdminAction } from './useAdminLogging'

// Define our own User type to avoid import issues
type User = {
  id: string
  email?: string
  user_metadata?: Record<string, any>
  app_metadata?: Record<string, any>
  aud: string
  created_at: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        console.log('Initial session:', session?.user?.email)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email)
      if (mounted) {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    // Log successful login
    if (data.user && !error) {
      logAdminAction('login', {
        user_id: data.user.id,
        email: data.user.email,
        ip_address: 'unknown', // Could be enhanced with real IP detection
        user_agent: navigator.userAgent
      })
    }
    
    return { data, error }
  }

  const signOut = async () => {
    // Log logout before signing out
    if (user) {
      logAdminAction('logout', {
        user_id: user.id,
        email: user.email
      })
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const isAdmin = () => {
    const adminUserId = import.meta.env.VITE_ADMIN_USER_ID
    // If no admin user ID is set, allow any authenticated user for now
    if (!adminUserId || adminUserId.trim() === '') {
      console.log('No admin user ID set, allowing any authenticated user:', !!user)
      return !!user
    }
    const isAdminUser = user?.id === adminUserId
    console.log('Admin check:', { userId: user?.id, adminUserId, isAdminUser })
    return isAdminUser
  }

  return {
    user,
    loading,
    signIn,
    signOut,
    isAdmin,
  }
}
