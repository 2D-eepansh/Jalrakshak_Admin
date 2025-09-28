import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logAdminAction } from './useAdminLogging'

export const useRunPrediction = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (predictionData: {
      model_version: string
      confidence: number
      water_level: number
      risk_level: string
    }) => {
      // Simulate prediction API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      return {
        id: Date.now().toString(),
        ...predictionData,
        created_at: new Date().toISOString()
      }
    },
    onSuccess: (data, variables) => {
      // Log admin action
      logAdminAction('run_prediction', {
        prediction_id: data.id,
        model_version: variables.model_version,
        confidence: variables.confidence,
        water_level: variables.water_level,
        risk_level: variables.risk_level
      })
      
      // Invalidate dashboard data to refresh stats
      queryClient.invalidateQueries({ queryKey: ['dashboard-data'] })
    },
  })
}
