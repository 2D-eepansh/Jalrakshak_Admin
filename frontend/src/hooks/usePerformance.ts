import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage?: number
}

export const usePerformance = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0
  })

  useEffect(() => {
    const startTime = performance.now()
    
    // Measure component render time
    const measureRender = () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      setMetrics(prev => ({
        ...prev,
        renderTime: Math.round(renderTime)
      }))
    }

    // Measure memory usage if available
    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
        }))
      }
    }

    // Run measurements
    measureRender()
    measureMemory()

    // Log performance in development
    if (import.meta.env.DEV) {
      console.log(`🚀 ${componentName} Performance:`, {
        renderTime: `${metrics.renderTime}ms`,
        memoryUsage: metrics.memoryUsage ? `${metrics.memoryUsage}MB` : 'N/A'
      })
    }
  }, [componentName])

  return metrics
}

// Hook for measuring page load performance
export const usePageLoadPerformance = () => {
  const [loadTime, setLoadTime] = useState(0)

  useEffect(() => {
    const measureLoadTime = () => {
      if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
        setLoadTime(loadTime)
        
        if (import.meta.env.DEV) {
          console.log(`📊 Page Load Time: ${loadTime}ms`)
        }
      }
    }

    // Measure after page is fully loaded
    if (document.readyState === 'complete') {
      measureLoadTime()
    } else {
      window.addEventListener('load', measureLoadTime)
      return () => window.removeEventListener('load', measureLoadTime)
    }
  }, [])

  return loadTime
}
