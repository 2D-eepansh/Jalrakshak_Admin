import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, AlertTriangle } from 'lucide-react'

interface SessionWarningModalProps {
  isOpen: boolean
  timeRemaining: number
  onExtend: () => void
  onLogout: () => void
}

const SessionWarningModal: React.FC<SessionWarningModalProps> = ({
  isOpen,
  timeRemaining,
  onExtend,
  onLogout
}) => {
  const [countdown, setCountdown] = useState(timeRemaining)

  useEffect(() => {
    setCountdown(timeRemaining)
  }, [timeRemaining])

  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          onLogout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen, onLogout])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Session Timeout Warning</h2>
                  <p className="text-sm text-gray-600">Your session will expire soon</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <span className="text-2xl font-bold text-orange-600">
                    {formatTime(countdown)}
                  </span>
                </div>
                <p className="text-center text-gray-600">
                  You will be automatically logged out due to inactivity.
                  <br />
                  Click "Stay Logged In" to extend your session.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onLogout}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Logout Now
                </button>
                <button
                  onClick={onExtend}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Stay Logged In
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SessionWarningModal
