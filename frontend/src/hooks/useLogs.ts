import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export const useLogs = (filter: string = 'all') => {
  return useQuery({
    queryKey: ['logs', filter],
    queryFn: async () => {
      try {
        let query = supabase.from('admin_logs').select('*').order('created_at', { ascending: false })
        
        if (filter !== 'all') {
          query = query.eq('action', filter)
        }
        
        const { data, error } = await query
        
        if (error) {
          console.warn('Could not fetch logs:', error)
          return []
        }
        return data || []
      } catch (error) {
        console.warn('Logs fetch failed:', error)
        return []
      }
    },
    refetchInterval: false, // Disable auto-refetch to prevent issues
    retry: false, // Don't retry failed requests
  })
}
