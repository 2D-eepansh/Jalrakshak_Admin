import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Brain, 
  AlertTriangle, 
  FileText, 
  History,
  Droplets,
  Menu,
  X
} from 'lucide-react'
import { useAutoTranslation } from '../hooks/useAutoTranslation'
const navigation = [
  { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
  { name: 'Prediction', id: 'prediction', icon: Brain },
  { name: 'Alerts', id: 'alerts', icon: AlertTriangle },
  { name: 'Reports', id: 'reports', icon: FileText },
  { name: 'Logs', id: 'logs', icon: History },
]

interface SimpleNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const SimpleNavigation = ({ activeTab, onTabChange, isCollapsed = false, onToggleCollapse }: SimpleNavigationProps) => {
  const { t, forceUpdate } = useAutoTranslation()
  
  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <motion.button
          onClick={onToggleCollapse}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle navigation menu"
        >
          {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Sidebar */}
      <motion.div 
        className={`
          ${isCollapsed ? 'hidden lg:block' : 'block'}
          lg:w-64 w-full lg:relative fixed lg:top-0 top-0 left-0 z-40
          bg-white border-r border-gray-200 shadow-sm h-full lg:h-auto
        `}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div 
          className="p-4 border-b border-gray-200"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <motion.div 
                className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Droplets className="w-5 h-5 text-white" />
              </motion.div>
              <motion.span 
                className="text-lg font-bold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                JalRakshak
              </motion.span>
            </div>
            
            {/* Mobile close button */}
            <button
              onClick={onToggleCollapse}
              className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      
            <nav className="p-4 space-y-2">
              {navigation.map((item, index) => {
                const Icon = item.icon
                const isActive = activeTab === item.id
                
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onTabChange(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onTabChange(item.id)
                      }
                    }}
                    aria-label={`Navigate to ${t(item.name)}`}
                    aria-current={isActive ? 'page' : undefined}
                    role="tab"
                    tabIndex={0}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <motion.div
                      whileHover={{ rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                    </motion.div>
                    <span>{t(item.name)}</span>
                    {isActive && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-white rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </nav>
      </motion.div>
    </>
  )
}

export default SimpleNavigation

