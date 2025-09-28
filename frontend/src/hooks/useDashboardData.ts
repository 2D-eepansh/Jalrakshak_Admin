import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard-data'],
    queryFn: async () => {
      // For now, return mock data to prevent navigation issues
      // TODO: Enable real data fetching when database is properly set up
      console.log('Dashboard data fetch - using mock data')
      
      return {
        stats: {
          totalReports: 0,
          pendingReports: 0,
          verifiedReports: 0,
          criticalReports: 0,
          totalAlerts: 0,
          activeAlerts: 0,
          predictions: 156,
          coverage: 89
        },
        recentReports: [],
        locationData: []
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: false, // Disable auto-refetch to prevent issues
    retry: false, // Don't retry failed requests
  })
}
