import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Brain, 
  Play, 
  Pause, 
  RotateCcw, 
  TrendingUp, 
  AlertTriangle,
  Droplets,
  Thermometer,
  Wind
} from 'lucide-react'
import { useRunPrediction } from '../hooks/usePrediction'
import { useAutoTranslation } from '../hooks/useAutoTranslation'

const Prediction = () => {
  const { t } = useAutoTranslation()
  const [predictionData, setPredictionData] = useState({
    confidence: 87,
    waterLevel: 2.3,
    riskLevel: 'high',
    nextUpdate: '15 minutes'
  })
  
  const runPrediction = useRunPrediction()

  const riskLevels = [
    { level: 'low', color: 'text-green-600 bg-green-50', threshold: 0.5 },
    { level: 'medium', color: 'text-yellow-600 bg-yellow-50', threshold: 1.5 },
    { level: 'high', color: 'text-orange-600 bg-orange-50', threshold: 2.5 },
    { level: 'critical', color: 'text-red-600 bg-red-50', threshold: 3.5 },
  ]

  const currentRisk = riskLevels.find(r => predictionData.waterLevel >= r.threshold) || riskLevels[0]

  const handleRunPrediction = async () => {
    try {
      const result = await runPrediction.mutateAsync({
        model_version: 'v2.1',
        confidence: Math.floor(Math.random() * 20) + 80,
        water_level: Math.random() * 4,
        risk_level: 'high'
      })
      
      setPredictionData(prev => ({
        ...prev,
        confidence: result.confidence,
        waterLevel: result.water_level,
        nextUpdate: '15 minutes'
      }))
    } catch (error) {
      console.error('Failed to run prediction:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t('AI Prediction')}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">{t('Flood risk assessment and early warning system')}</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRunPrediction}
              disabled={runPrediction.isPending}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {runPrediction.isPending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Pause className="w-4 h-4" />
                  </motion.div>
                  <span>{t('Running')}...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{t('Run Prediction')}</span>
                </>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('Reset')}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Prediction Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Confidence Score */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">{t('Confidence')}</h3>
            <Brain className="w-6 h-6 text-brand" />
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-bold text-brand mb-2"
            >
              {predictionData.confidence}%
            </motion.div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${predictionData.confidence}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="bg-brand h-2 rounded-full"
              />
            </div>
            <p className="text-sm text-text-muted mt-2">AI Model Accuracy</p>
          </div>
        </div>

        {/* Water Level */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">{t('Water Level')}</h3>
            <Droplets className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-4xl font-bold text-blue-600 mb-2"
            >
              {predictionData.waterLevel.toFixed(1)}m
            </motion.div>
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">+0.3m from yesterday</span>
            </div>
            <p className="text-sm text-text-muted mt-2">Current Level</p>
          </div>
        </div>

        {/* Risk Level */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">{t('Risk Level')}</h3>
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentRisk.color} mb-2`}
            >
              {t(currentRisk.level.charAt(0).toUpperCase() + currentRisk.level.slice(1))}
            </motion.div>
            <p className="text-sm text-text-muted">Flood Risk Assessment</p>
          </div>
        </div>
      </motion.div>

      {/* Prediction Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Prediction Timeline</h2>
          <div className="flex items-center space-x-2 text-sm text-text-muted">
            <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
            <span>Next update in {predictionData.nextUpdate}</span>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 relative overflow-hidden">
          {/* Chart Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230066cc' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Prediction Line */}
          <svg className="w-full h-full">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              d="M 20 200 Q 100 150 200 120 T 400 80"
              stroke="#0066cc"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
            />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.7 }}
              d="M 20 200 Q 100 150 200 120 T 400 80"
              stroke="#ef4444"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          {/* Chart Labels */}
          <div className="absolute bottom-4 left-4 text-xs text-text-muted">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-0.5 bg-brand" />
                <span>Predicted</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-0.5 bg-red-500" />
                <span>Actual</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Environmental Factors */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Thermometer className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold text-text-primary">Temperature</h3>
          </div>
          <div className="text-2xl font-bold text-text-primary mb-2">28°C</div>
          <p className="text-sm text-text-muted">Average daily temperature</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Droplets className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-text-primary">Rainfall</h3>
          </div>
          <div className="text-2xl font-bold text-text-primary mb-2">45mm</div>
          <p className="text-sm text-text-muted">Last 24 hours</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Wind className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-semibold text-text-primary">Wind Speed</h3>
          </div>
          <div className="text-2xl font-bold text-text-primary mb-2">12 km/h</div>
          <p className="text-sm text-text-muted">Current wind speed</p>
        </div>
      </motion.div>
    </div>
  )
}

export default Prediction
