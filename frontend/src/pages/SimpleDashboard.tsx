import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  MapPin,
  Activity,
  Users,
  Clock
} from 'lucide-react'
import InteractiveMap from '../components/InteractiveMap'
import InteractiveChart from '../components/InteractiveChart'
import { useAutoTranslation } from '../hooks/useAutoTranslation'

const SimpleDashboard = () => {
  const { t, forceUpdate } = useAutoTranslation()
  console.log('SimpleDashboard render')

  const stats = [
    {
      title: t('Total Reports'),
      value: '47',
      change: '+12%',
      changeType: 'positive' as const,
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: t('Active Alerts'),
      value: '3',
      change: '+3',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      title: t('Predictions'),
      value: '156',
      change: '+8%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: t('Coverage'),
      value: '89%',
      change: '+2%',
      changeType: 'positive' as const,
      icon: MapPin,
      color: 'text-purple-600'
    }
  ]

  const recentReports = [
    {
      id: '1',
      title: 'Flooding in Alappuzha',
      severity: 'high',
      status: 'verified',
      location: 'Kerala, Alappuzha',
      reporter: 'Rajesh Kumar',
      time: '2 hours ago',
      description: 'Water level rising rapidly in low-lying areas'
    },
    {
      id: '2',
      title: 'Heavy Rainfall Alert',
      severity: 'medium',
      status: 'pending',
      location: 'Kerala, Ernakulam',
      reporter: 'Priya Menon',
      time: '4 hours ago',
      description: 'Continuous heavy rainfall for past 6 hours'
    },
    {
      id: '3',
      title: 'River Overflow Warning',
      severity: 'critical',
      status: 'verified',
      location: 'Kerala, Thrissur',
      reporter: 'Suresh Nair',
      time: '6 hours ago',
      description: 'Periyar river water level above danger mark'
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50'
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'resolved': return 'text-blue-600 bg-blue-50'
      case 'false_alarm': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Overview of flood monitoring and alert system</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Live</span>
            </div>
            <div className="text-sm text-gray-500">
              {t('Last updated')}: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.1 + index * 0.15,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ 
                scale: 1.03, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  className={`p-3 rounded-xl ${stat.color.replace('text-', 'bg-').replace('-600', '-100')}`}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </motion.div>
                <motion.div 
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    stat.changeType === 'positive' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                >
                  {stat.change}
                </motion.div>
              </div>
              <div>
                <motion.h3 
                  className="text-3xl font-bold text-gray-900 mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                >
                  {stat.value}
                </motion.h3>
                <motion.p 
                  className="text-sm text-gray-600 font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {stat.title}
                </motion.p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{t('Flood Risk Map')}</h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Live</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <InteractiveMap />
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{t('Alert Trends')}</h2>
              <div className="text-sm text-gray-500">Last 7 days</div>
            </div>
          </div>
          <div className="p-6">
            <InteractiveChart />
          </div>
        </motion.div>
      </div>

      {/* Recent Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
            <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium">
              View All
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {recentReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-gray-900">{report.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                      {report.severity}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{report.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{report.reporter}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{report.time}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <AlertTriangle className="w-5 h-5 text-gray-400" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SimpleDashboard

