import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { logAdminAction } from './useAdminLogging'

export const useAlerts = () => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('admin_alerts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)
        
        if (error) {
          console.warn('Could not fetch alerts:', error)
          return []
        }
        return data || []
      } catch (error) {
        console.warn('Alerts fetch failed:', error)
        return []
      }
    },
    refetchInterval: false, // Disable auto-refetch to prevent issues
    retry: false, // Don't retry failed requests
  })
}

export const useSendAlert = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (alertData: {
      title: string
      message: string
      severity: 'yellow' | 'orange' | 'red'
      target_location: {
        state: string
        district: string
      }
      channels: string[]
    }) => {
      try {
        // For now, we'll just insert into the database
        // Later we can add edge function for actual sending
        const { data, error } = await supabase
          .from('admin_alerts')
          .insert({
            admin_user_id: 'temp-admin-id', // Will be replaced with real admin ID
            ...alertData
          })
          .select()
          .single()
        
        if (error) {
          console.warn('Could not send alert:', error)
          // Return mock data for now
          return {
            id: Date.now().toString(),
            ...alertData,
            admin_user_id: 'temp-admin-id',
            created_at: new Date().toISOString()
          }
        }
        return data
      } catch (error) {
        console.warn('Send alert failed:', error)
        // Return mock data for now
        return {
          id: Date.now().toString(),
          ...alertData,
          admin_user_id: 'temp-admin-id',
          created_at: new Date().toISOString()
        }
      }
    },
    onSuccess: (data, variables) => {
      // Log admin action
      logAdminAction('send_alert', {
        alert_id: data.id,
        title: variables.title,
        severity: variables.severity,
        target_location: variables.target_location,
        channels: variables.channels
      })
      
      // Invalidate and refetch alerts
      queryClient.invalidateQueries({ queryKey: ['alerts'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] })
    },
  })
}
