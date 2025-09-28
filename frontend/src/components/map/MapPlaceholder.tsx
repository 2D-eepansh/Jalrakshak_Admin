import { motion } from 'framer-motion'
import { MapPin, AlertTriangle } from 'lucide-react'

const MapPlaceholder = () => {
  const markers = [
    { lat: 19.0760, lng: 72.8777, severity: 'high', city: 'Mumbai' },
    { lat: 18.5204, lng: 73.8567, severity: 'medium', city: 'Pune' },
    { lat: 12.9716, lng: 77.5946, severity: 'critical', city: 'Bangalore' },
    { lat: 13.0827, lng: 80.2707, severity: 'low', city: 'Chennai' },
    { lat: 22.5726, lng: 88.3639, severity: 'medium', city: 'Kolkata' },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="relative w-full h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg overflow-hidden">
      {/* Map Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230066cc' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Map Title */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
          <h3 className="text-sm font-medium text-text-primary">India Flood Risk Map</h3>
          <p className="text-xs text-text-muted">Real-time monitoring</p>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
          <h4 className="text-xs font-medium text-text-primary mb-2">Risk Levels</h4>
          <div className="space-y-1">
            {[
              { color: 'bg-red-500', label: 'Critical' },
              { color: 'bg-orange-500', label: 'High' },
              { color: 'bg-yellow-500', label: 'Medium' },
              { color: 'bg-green-500', label: 'Low' },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-xs text-text-muted">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Markers */}
      {markers.map((marker, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1,
            type: 'spring',
            stiffness: 200
          }}
          whileHover={{ scale: 1.2 }}
          className="absolute z-20"
          style={{
            left: `${(marker.lng + 180) / 360 * 100}%`,
            top: `${(90 - marker.lat) / 180 * 100}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            <div className={`w-4 h-4 rounded-full ${getSeverityColor(marker.severity)} shadow-lg`} />
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-2 py-1 shadow-sm opacity-0 hover:opacity-100 transition-opacity">
              <p className="text-xs font-medium text-text-primary">{marker.city}</p>
              <p className="text-xs text-text-muted capitalize">{marker.severity} risk</p>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Water Animation */}
      <motion.div
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          repeatType: 'reverse',
          ease: 'linear'
        }}
        className="absolute inset-0 opacity-10"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(0, 102, 204, 0.3) 50%, transparent 70%)',
          backgroundSize: '200% 200%'
        }}
      />

      {/* Loading Indicator */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-3 h-3 border-2 border-brand border-t-transparent rounded-full"
          />
          <span className="text-xs text-text-muted">Updating...</span>
        </div>
      </div>
    </div>
  )
}

export default MapPlaceholder
