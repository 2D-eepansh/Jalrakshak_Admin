import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

const ChartPlaceholder = () => {
  const data = [
    { day: 'Mon', alerts: 12, reports: 8 },
    { day: 'Tue', alerts: 15, reports: 12 },
    { day: 'Wed', alerts: 8, reports: 6 },
    { day: 'Thu', alerts: 22, reports: 18 },
    { day: 'Fri', alerts: 18, reports: 14 },
    { day: 'Sat', alerts: 25, reports: 20 },
    { day: 'Sun', alerts: 16, reports: 11 },
  ]

  const maxValue = Math.max(...data.map(d => Math.max(d.alerts, d.reports)))

  return (
    <div className="w-full h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-xs text-text-muted">Alerts</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-xs text-text-muted">Reports</span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-green-600">
          <TrendingUp className="w-3 h-3" />
          <span className="text-xs font-medium">+12%</span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="relative h-40">
        {/* Grid Lines */}
        <div className="absolute inset-0">
          {[0, 25, 50, 75, 100].map((percent, index) => (
            <div
              key={index}
              className="absolute w-full border-t border-gray-200"
              style={{ top: `${percent}%` }}
            />
          ))}
        </div>

        {/* Chart Bars */}
        <div className="absolute inset-0 flex items-end justify-between px-2">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="flex flex-col items-center space-y-1 flex-1 mx-1"
            >
              {/* Alerts Bar */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ 
                  height: `${(item.alerts / maxValue) * 100}%` 
                }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                className="w-full bg-red-500 rounded-t-sm relative group"
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.alerts}
                </div>
              </motion.div>

              {/* Reports Bar */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ 
                  height: `${(item.reports / maxValue) * 100}%` 
                }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                className="w-full bg-blue-500 rounded-b-sm relative group"
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.reports}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* X-axis Labels */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2">
          {data.map((item, index) => (
            <span key={index} className="text-xs text-text-muted">
              {item.day}
            </span>
          ))}
        </div>
      </div>

      {/* Chart Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-text-primary">156</p>
          <p className="text-xs text-text-muted">Total Alerts</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-text-primary">89</p>
          <p className="text-xs text-text-muted">Total Reports</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">+12%</p>
          <p className="text-xs text-text-muted">vs Last Week</p>
        </div>
      </div>

      {/* Animated Background */}
      <motion.div
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          repeatType: 'reverse',
          ease: 'linear'
        }}
        className="absolute inset-0 opacity-5 rounded-lg"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(0, 102, 204, 0.3) 50%, transparent 70%)',
          backgroundSize: '200% 200%'
        }}
      />
    </div>
  )
}

export default ChartPlaceholder
