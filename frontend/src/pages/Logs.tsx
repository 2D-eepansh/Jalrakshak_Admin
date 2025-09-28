import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  History, 
  Download, 
  Search, 
  Filter,
  User,
  Send,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react'
import { useLogs } from '../hooks/useLogs'
import { useAutoTranslation } from '../hooks/useAutoTranslation'

const Logs = () => {
  const { t } = useAutoTranslation()
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: logs = [], isLoading, error } = useLogs(filter)

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'send_alert': return <Send className="w-4 h-4" />
      case 'verify_report': return <CheckCircle className="w-4 h-4" />
      case 'run_prediction': return <AlertTriangle className="w-4 h-4" />
      case 'login': return <User className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'send_alert': return 'text-blue-600 bg-blue-50'
      case 'verify_report': return 'text-green-600 bg-green-50'
      case 'run_prediction': return 'text-purple-600 bg-purple-50'
      case 'login': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50'
      case 'partial': return 'text-yellow-600 bg-yellow-50'
      case 'error': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.admin_user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Action', 'Admin User ID', 'Details', 'Status']
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        `"${new Date(log.created_at).toLocaleString()}"`,
        `"${log.action.replace('_', ' ').toUpperCase()}"`,
        `"${log.admin_user_id}"`,
        `"${JSON.stringify(log.details).replace(/"/g, '""')}"`,
        '"success"'
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `jalrakshak_admin_logs_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Admin Logs
            </h1>
            <p className="text-gray-600 mt-2 text-lg">{t('Track all administrative actions and system events')}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('Search logs')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-64"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input w-32"
            >
              <option value="all">All Actions</option>
              <option value="send_alert">Send Alert</option>
              <option value="verify_report">Verify Report</option>
              <option value="resolve_report">Resolve Report</option>
              <option value="false_alarm_report">False Alarm</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToCSV}
              className="btn-primary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Total Actions</p>
              <p className="text-2xl font-bold text-text-primary">{logs.length}</p>
            </div>
            <History className="w-8 h-8 text-brand" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Alerts Sent</p>
              <p className="text-2xl font-bold text-blue-600">
                {logs.filter(l => l.action === 'send_alert').length}
              </p>
            </div>
            <Send className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Reports Verified</p>
              <p className="text-2xl font-bold text-green-600">
                {logs.filter(l => l.action === 'verify_report').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Predictions Run</p>
              <p className="text-2xl font-bold text-purple-600">
                {logs.filter(l => l.action === 'run_prediction').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="card p-6"
      >
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder={t('Search logs')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input w-48"
          >
            <option value="all">All Actions</option>
            <option value="send_alert">Send Alert</option>
            <option value="verify_report">Verify Report</option>
            <option value="run_prediction">Run Prediction</option>
            <option value="login">Login</option>
          </select>
        </div>
      </motion.div>

      {/* Logs Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="card p-6"
      >
        <h2 className="text-xl font-semibold text-text-primary mb-6">Activity Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left py-3 px-4 font-medium text-text-muted">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Action</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Admin</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Details</th>
                <th className="text-left py-3 px-4 font-medium text-text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3"></div>
                      <span className="text-gray-600">Loading logs...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    <div className="text-center">
                      <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                      <p className="text-red-600">Failed to load logs</p>
                      <p className="text-gray-500 text-sm">Please check your connection</p>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">
                    <div className="text-center">
                      <History className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No logs found</p>
                      <p className="text-gray-400 text-sm">Admin actions will appear here</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {getActionIcon(log.action)}
                        <span className="capitalize">{log.action.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{log.admin_user_id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                      {JSON.stringify(log.details)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('success')}`}>
                        success
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
      </motion.div>
    </div>
  )
}

export default Logs
