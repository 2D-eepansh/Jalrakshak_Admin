import { useMutation } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export const useAdminLogging = () => {
  return useMutation({
    mutationFn: async (logData: {
      action: string
      details: Record<string, any>
    }) => {
      const { data, error } = await supabase
        .from('admin_logs')
        .insert({
          admin_user_id: 'temp-admin-id', // Will be replaced with real admin ID
          action: logData.action,
          details: logData.details
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
  })
}

// Helper function to log admin actions
export const logAdminAction = async (action: string, details: Record<string, any> = {}) => {
  try {
    // For now, just log to console until database is set up
    console.log('Admin Action:', action, details)
    
    // TODO: Uncomment when database is ready
    // const { data, error } = await supabase
    //   .from('admin_logs')
    //   .insert({
    //     admin_user_id: 'temp-admin-id', // Will be replaced with real admin ID
    //     action,
    //     details
    //   })
    
    // if (error) {
    //   console.error('Failed to log admin action:', error)
    // }
  } catch (error) {
    console.error('Failed to log admin action:', error)
  }
}
