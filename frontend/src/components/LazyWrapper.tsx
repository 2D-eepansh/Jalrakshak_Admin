import React, { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'

// Lazy load components
const SimpleDashboard = lazy(() => import('../pages/SimpleDashboard'))
const Prediction = lazy(() => import('../pages/Prediction'))
const Alerts = lazy(() => import('../pages/Alerts'))
const Reports = lazy(() => import('../pages/Reports'))
const Logs = lazy(() => import('../pages/Logs'))

interface LazyWrapperProps {
  component: string
}

const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center justify-center h-64"
  >
    <div className="text-center">
      <motion.div
        className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-gray-600">Loading...</p>
    </div>
  </motion.div>
)

const LazyWrapper: React.FC<LazyWrapperProps> = ({ component }) => {
  const renderComponent = () => {
    switch (component) {
      case 'dashboard':
        return <SimpleDashboard />
      case 'prediction':
        return <Prediction />
      case 'alerts':
        return <Alerts />
      case 'reports':
        return <Reports />
      case 'logs':
        return <Logs />
      default:
        return <SimpleDashboard />
    }
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {renderComponent()}
    </Suspense>
  )
}

export default LazyWrapper
