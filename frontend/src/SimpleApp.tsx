import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import SimpleNavigation from './components/SimpleNavigation'
import Notifications from './components/Notifications'
import AutoLanguageSelector from './components/AutoLanguageSelector'
import SessionWarningModal from './components/SessionWarningModal'
import LazyWrapper from './components/LazyWrapper'
import Login from './pages/Login'
import { useAuth } from './hooks/useAuth'
import { useSessionManager } from './hooks/useSessionManager'
import { useRoleBasedAccess } from './hooks/useRoleBasedAccess'
import { useTouchGestures } from './hooks/useTouchGestures'
import { useRealTimeNotifications } from './hooks/useRealTimeNotifications'
import { useAutoTranslation } from './hooks/useAutoTranslation'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

const SimpleAppContent = () => {
  const { user, loading, signOut } = useAuth()
  const { t, forceUpdate } = useAutoTranslation()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showSessionWarning, setShowSessionWarning] = useState(false)

  console.log('SimpleApp render:', { user: !!user, loading, activeTab })

  // Role-based access control
  const { canAccessTab, userRole } = useRoleBasedAccess()

  // Session management
  const { extendSession, getTimeRemaining } = useSessionManager({
    timeoutMinutes: 30,
    warningMinutes: 5,
    onWarning: () => setShowSessionWarning(true),
    onTimeout: async () => {
      await signOut()
      window.location.reload()
    }
  })

  // Touch gestures for mobile
  useTouchGestures({
    onSwipeLeft: () => {
      const tabs = ['dashboard', 'prediction', 'alerts', 'reports', 'logs']
      const currentIndex = tabs.indexOf(activeTab)
      if (currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1])
      }
    },
    onSwipeRight: () => {
      const tabs = ['dashboard', 'prediction', 'alerts', 'reports', 'logs']
      const currentIndex = tabs.indexOf(activeTab)
      if (currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1])
      }
    }
  })

  // Real-time notifications
  const { isConnected } = useRealTimeNotifications({
    onNotification: (notification) => {
      console.log('New real-time notification:', notification)
    }
  })

  // Keyboard navigation support with role-based access
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      const tabs = ['dashboard', 'prediction', 'alerts', 'reports', 'logs']
      const currentIndex = tabs.indexOf(activeTab)
      
      switch (e.key) {
        case '1':
          e.preventDefault()
          if (canAccessTab('dashboard')) setActiveTab('dashboard')
          break
        case '2':
          e.preventDefault()
          if (canAccessTab('prediction')) setActiveTab('prediction')
          break
        case '3':
          e.preventDefault()
          if (canAccessTab('alerts')) setActiveTab('alerts')
          break
        case '4':
          e.preventDefault()
          if (canAccessTab('reports')) setActiveTab('reports')
          break
        case '5':
          e.preventDefault()
          if (canAccessTab('logs')) setActiveTab('logs')
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (currentIndex > 0) {
            const prevTab = tabs[currentIndex - 1]
            if (canAccessTab(prevTab)) setActiveTab(prevTab)
          }
          break
        case 'ArrowRight':
          e.preventDefault()
          if (currentIndex < tabs.length - 1) {
            const nextTab = tabs[currentIndex + 1]
            if (canAccessTab(nextTab)) setActiveTab(nextTab)
          }
          break
      }
    }
  }

  // Add keyboard event listener
  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeTab])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
        <motion.div 
          className="text-white text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Loading JalRakshak Admin Portal...
          </motion.p>
        </motion.div>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  const renderContent = () => {
    return <LazyWrapper component={activeTab} />
  }

  const pageVariants = {
    initial: { opacity: 0, x: 20, scale: 0.98 },
    in: { opacity: 1, x: 0, scale: 1 },
    out: { opacity: 0, x: -20, scale: 0.98 }
  }

  const pageTransition = {
    type: "tween" as const,
    ease: "anticipate" as const,
    duration: 0.4
  }

        return (
          <div className="min-h-screen bg-gray-50">
            <div className="flex flex-col lg:flex-row">
              {/* Sidebar */}
              <nav className="lg:w-64 w-full lg:relative lg:block" aria-label="Main navigation">
                <SimpleNavigation 
                  activeTab={activeTab} 
                  onTabChange={setActiveTab}
                  isCollapsed={sidebarCollapsed}
                  onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
              </nav>
              
              {/* Main Content */}
              <main className="flex-1 flex flex-col min-h-screen lg:min-h-0" role="main">
                {/* Topbar */}
                <div className="bg-white border-b border-gray-200 shadow-sm">
                  <div className="px-4 lg:px-6 py-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-end space-y-4 lg:space-y-0">
                      <div className="flex flex-wrap items-center gap-2 lg:gap-4">
                        <div className="text-sm text-gray-500">
                          {t('Welcome')}, {user?.email} ({userRole})
                        </div>
                        
                        {/* Connection Status */}
                        <div className="flex items-center space-x-1 text-xs">
                          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className="text-gray-500">{isConnected ? t('Live') : t('Offline')}</span>
                        </div>
                        
                        {/* Auto Language Selector */}
                        <AutoLanguageSelector />
                        
                        {/* Notifications */}
                        <Notifications />
                        
                        {/* Logout Button */}
                        <button
                          onClick={async () => {
                            await signOut()
                            window.location.reload()
                          }}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          aria-label={`${t('Logout')} from admin portal`}
                        >
                          {t('Logout')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
          
                {/* Page Content */}
                <section className="flex-1 p-4 lg:p-6" aria-label={`${activeTab} content`}>
                  <div className="h-full">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        className="h-full"
                      >
                        {renderContent()}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </section>
              </main>
            </div>

            {/* Session Warning Modal */}
            <SessionWarningModal
              isOpen={showSessionWarning}
              timeRemaining={getTimeRemaining()}
              onExtend={() => {
                extendSession()
                setShowSessionWarning(false)
              }}
              onLogout={async () => {
                await signOut()
                window.location.reload()
              }}
            />
          </div>
        )
      }

const SimpleApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleAppContent />
    </QueryClientProvider>
  )
}

export default SimpleApp
