import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()
  
  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Topbar />
          
          {/* Page Content */}
          <main className="flex-1 p-6">
            <div key={location.pathname} className="h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Layout
