import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ChartData {
  day: string
  alerts: number
  reports: number
  predictions: number
}

const chartData: ChartData[] = [
  { day: 'Mon', alerts: 12, reports: 8, predictions: 15 },
  { day: 'Tue', alerts: 8, reports: 12, predictions: 18 },
  { day: 'Wed', alerts: 15, reports: 6, predictions: 12 },
  { day: 'Thu', alerts: 6, reports: 14, predictions: 20 },
  { day: 'Fri', alerts: 18, reports: 10, predictions: 16 },
  { day: 'Sat', alerts: 10, reports: 16, predictions: 14 },
  { day: 'Sun', alerts: 14, reports: 9, predictions: 17 }
]

const InteractiveChart = () => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<'alerts' | 'reports' | 'predictions'>('alerts')

  const maxValue = Math.max(...chartData.map(d => Math.max(d.alerts, d.reports, d.predictions)))

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'alerts': return 'bg-red-500'
      case 'reports': return 'bg-blue-500'
      case 'predictions': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'alerts': return <TrendingUp className="w-4 h-4" />
      case 'reports': return <TrendingDown className="w-4 h-4" />
      case 'predictions': return <Minus className="w-4 h-4" />
      default: return <Minus className="w-4 h-4" />
    }
  }

  const getTotalChange = () => {
    const firstDay = chartData[0][selectedMetric]
    const lastDay = chartData[chartData.length - 1][selectedMetric]
    const change = ((lastDay - firstDay) / firstDay) * 100
    return change
  }

  return (
    <div className="h-64 bg-white rounded-lg p-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Weekly Trends</h3>
          <p className="text-sm text-gray-600">Last 7 days activity</p>
        </div>
        
        {/* Metric Selector */}
        <div className="flex space-x-2">
          {(['alerts', 'reports', 'predictions'] as const).map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                selectedMetric === metric
                  ? `${getMetricColor(metric)} text-white`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Stats */}
      <div className="flex items-center space-x-6 mb-4">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${getMetricColor(selectedMetric)}`}>
            {getMetricIcon(selectedMetric)}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {chartData.reduce((sum, day) => sum + day[selectedMetric], 0)}
            </p>
            <p className="text-sm text-gray-600">Total {selectedMetric}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            getTotalChange() >= 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {getTotalChange() >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{Math.abs(getTotalChange()).toFixed(1)}%</span>
          </div>
          <span className="text-sm text-gray-600">vs last week</span>
        </div>
      </div>

      {/* Chart Bars */}
      <div className="flex items-end justify-between h-32 space-x-2">
        {chartData.map((day, index) => {
          const value = day[selectedMetric]
          const height = (value / maxValue) * 100
          const isHovered = hoveredBar === index
          
          return (
            <motion.div 
              key={day.day} 
              className="flex-1 flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                initial={{ height: 0, scaleY: 0 }}
                animate={{ height: `${height}%`, scaleY: 1 }}
                transition={{ 
                  delay: index * 0.1, 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                whileHover={{ 
                  scaleY: 1.05,
                  transition: { duration: 0.2 }
                }}
                className={`w-full ${getMetricColor(selectedMetric)} rounded-t-lg relative cursor-pointer transition-all duration-300 ${
                  isHovered ? 'opacity-90 shadow-lg' : 'opacity-100'
                }`}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Value Tooltip */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -5, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10"
                  >
                    {value}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
                  </motion.div>
                )}
              </motion.div>
              
              {/* Day Label */}
              <motion.span 
                className="text-xs text-gray-600 mt-2 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                {day.day}
              </motion.span>
            </motion.div>
          )
        })}
      </div>

      {/* Chart Legend */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="flex justify-center space-x-6 mt-4"
      >
        {(['alerts', 'reports', 'predictions'] as const).map((metric, index) => (
          <motion.div 
            key={metric} 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4 + index * 0.1 }}
            whileHover={{ scale: 1.1 }}
          >
            <motion.div 
              className={`w-3 h-3 rounded ${getMetricColor(metric)}`}
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.2 }}
            />
            <span className="text-xs text-gray-600 capitalize">{metric}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default InteractiveChart
