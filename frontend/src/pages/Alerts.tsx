import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  Send, 
  MapPin, 
  Users,
  Mail,
  MessageSquare,
  Bell
} from 'lucide-react'
import { useAlerts, useSendAlert } from '../hooks/useAlerts'
import { useAutoTranslation } from '../hooks/useAutoTranslation'

const Alerts = () => {
  const { t } = useAutoTranslation()
  const [showSendModal, setShowSendModal] = useState(false)
  const [alertForm, setAlertForm] = useState({
    title: '',
    message: '',
    severity: 'yellow' as 'yellow' | 'orange' | 'red',
    state: '',
    district: '',
    channels: ['email']
  })

  const { data: recentAlerts = [], isLoading, error } = useAlerts()
  const sendAlert = useSendAlert()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'red': return 'text-red-600 bg-red-50 border-red-200'
      case 'orange': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'yellow': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const handleSendAlert = async () => {
    try {
      await sendAlert.mutateAsync({
        title: alertForm.title,
        message: alertForm.message,
        severity: alertForm.severity,
        target_location: {
          state: alertForm.state,
          district: alertForm.district
        },
        channels: alertForm.channels
      })
      
      setShowSendModal(false)
      setAlertForm({
        title: '',
        message: '',
        severity: 'yellow',
        state: '',
        district: '',
        channels: ['email']
      })
    } catch (error) {
      console.error('Failed to send alert:', error)
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Alerts
            </h1>
            <p className="text-gray-600 mt-2 text-lg">{t('Send flood warnings and emergency notifications')}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSendModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{t('Send New Alert')}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Alert Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Total Sent</p>
              <p className="text-2xl font-bold text-text-primary">156</p>
            </div>
            <Bell className="w-8 h-8 text-brand" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Active Alerts</p>
              <p className="text-2xl font-bold text-orange-600">23</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Recipients</p>
              <p className="text-2xl font-bold text-green-600">4,295</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Delivery Rate</p>
              <p className="text-2xl font-bold text-blue-600">98.5%</p>
            </div>
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </motion.div>

      {/* Recent Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="card p-6"
      >
        <h2 className="text-xl font-semibold text-text-primary mb-6">{t('Recent Alerts')}</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading alerts...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600">Failed to load alerts</p>
              <p className="text-gray-500 text-sm mt-1">Please check your connection</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAlerts.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No alerts sent yet</p>
                <p className="text-gray-400 text-sm">Send your first alert using the button above</p>
              </div>
            ) : (
              recentAlerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{alert.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{alert.target_location?.state}, {alert.target_location?.district}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{alert.channels.join(', ')}</span>
                        </div>
                        <span>{new Date(alert.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </motion.div>

      {/* Send Alert Modal */}
      {showSendModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-text-primary mb-4">Send Alert</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Title</label>
                <input
                  type="text"
                  value={alertForm.title}
                  onChange={(e) => setAlertForm({...alertForm, title: e.target.value})}
                  className="input"
                  placeholder="Alert title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Message</label>
                <textarea
                  value={alertForm.message}
                  onChange={(e) => setAlertForm({...alertForm, message: e.target.value})}
                  className="input h-24 resize-none"
                  placeholder="Alert message"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Severity</label>
                <select
                  value={alertForm.severity}
                  onChange={(e) => setAlertForm({...alertForm, severity: e.target.value})}
                  className="input"
                >
                  <option value="yellow">Yellow - Watch</option>
                  <option value="orange">Orange - Warning</option>
                  <option value="red">Red - Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Channels</label>
                <div className="space-y-2">
                  {['email', 'sms', 'inapp'].map((channel) => (
                    <label key={channel} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={alertForm.channels.includes(channel)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAlertForm({...alertForm, channels: [...alertForm.channels, channel]})
                          } else {
                            setAlertForm({...alertForm, channels: alertForm.channels.filter(c => c !== channel)})
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-text-primary capitalize">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowSendModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSendAlert}
                className="btn-primary"
              >
                Send Alert
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Alerts
