import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, AlertTriangle, Droplets, Thermometer } from 'lucide-react'

interface MapLocation {
  id: string
  name: string
  lat: number
  lng: number
  risk: 'low' | 'medium' | 'high' | 'critical'
  waterLevel: number
  temperature: number
  rainfall: number
}

const mapLocations: MapLocation[] = [
  {
    id: '1',
    name: 'Alappuzha',
    lat: 9.4981,
    lng: 76.3388,
    risk: 'high',
    waterLevel: 2.3,
    temperature: 28,
    rainfall: 45
  },
  {
    id: '2',
    name: 'Ernakulam',
    lat: 9.9816,
    lng: 76.2999,
    risk: 'medium',
    waterLevel: 1.8,
    temperature: 29,
    rainfall: 32
  },
  {
    id: '3',
    name: 'Thrissur',
    lat: 10.5276,
    lng: 76.2144,
    risk: 'critical',
    waterLevel: 3.1,
    temperature: 27,
    rainfall: 67
  },
  {
    id: '4',
    name: 'Kochi',
    lat: 9.9312,
    lng: 76.2673,
    risk: 'low',
    waterLevel: 1.2,
    temperature: 30,
    rainfall: 18
  }
]

const InteractiveMap = () => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getRiskTextColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="relative h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-8 grid-rows-6 h-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <motion.div 
              key={i} 
              className="border border-blue-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.01, duration: 0.5 }}
            />
          ))}
        </div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Map Locations */}
      <div className="relative h-full p-4">
        {mapLocations.map((location, index) => (
          <motion.div
            key={location.id}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ 
              delay: index * 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            whileHover={{ 
              scale: 1.3,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.9 }}
            className={`absolute w-4 h-4 ${getRiskColor(location.risk)} rounded-full cursor-pointer shadow-lg transition-all duration-300`}
            style={{
              left: `${20 + (index * 20)}%`,
              top: `${30 + (index % 2) * 30}%`
            }}
            onClick={() => setSelectedLocation(location)}
          >
            <motion.div 
              className="w-full h-full rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {/* Ripple effect */}
            <motion.div
              className={`absolute inset-0 ${getRiskColor(location.risk)} rounded-full`}
              animate={{ 
                scale: [1, 2],
                opacity: [0.3, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </motion.div>
        ))}

        {/* Map Legend */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3"
        >
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Risk Levels</h4>
          <div className="space-y-1">
            {[
              { color: 'bg-red-500', label: 'Critical' },
              { color: 'bg-orange-500', label: 'High' },
              { color: 'bg-yellow-500', label: 'Medium' },
              { color: 'bg-green-500', label: 'Low' }
            ].map((item, index) => (
              <motion.div 
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="flex items-center space-x-2"
              >
                <motion.div 
                  className={`w-3 h-3 ${item.color} rounded-full`}
                  whileHover={{ scale: 1.2 }}
                  transition={{ duration: 0.2 }}
                />
                <span className="text-xs text-gray-600">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Location Info Panel */}
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
            className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{selectedLocation.name}</h3>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Risk Level:</span>
                <span className={`text-sm font-medium ${getRiskTextColor(selectedLocation.risk)}`}>
                  {selectedLocation.risk.toUpperCase()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Water Level:</span>
                <span className="text-sm font-medium text-blue-600">
                  {selectedLocation.waterLevel}m
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Temperature:</span>
                <span className="text-sm font-medium text-red-600">
                  {selectedLocation.temperature}°C
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rainfall (24h):</span>
                <span className="text-sm font-medium text-blue-600">
                  {selectedLocation.rainfall}mm
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default InteractiveMap
