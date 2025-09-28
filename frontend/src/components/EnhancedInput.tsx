import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

interface EnhancedInputProps {
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  success?: string
  disabled?: boolean
  required?: boolean
  autoComplete?: string
  className?: string
  id?: string
  name?: string
}

const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  success,
  disabled = false,
  required = false,
  autoComplete,
  className = '',
  id,
  name
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const inputType = type === 'password' && showPassword ? 'text' : type

  const getInputClasses = () => {
    let baseClasses = 'w-full px-3 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1'
    
    if (error) {
      baseClasses += ' border-red-300 focus:ring-red-500 focus:border-red-500'
    } else if (success) {
      baseClasses += ' border-green-300 focus:ring-green-500 focus:border-green-500'
    } else if (isFocused) {
      baseClasses += ' border-blue-300 focus:ring-blue-500 focus:border-blue-500'
    } else {
      baseClasses += ' border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    }

    if (disabled) {
      baseClasses += ' bg-gray-50 cursor-not-allowed'
    } else {
      baseClasses += ' bg-white'
    }

    return baseClasses
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <motion.input
          id={id}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={getInputClasses()}
          whileFocus={{ scale: 1.01 }}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : success ? `${id}-success` : undefined}
        />
        
        {/* Password toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        
        {/* Status icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {error && <AlertCircle className="w-4 h-4 text-red-500" />}
          {success && !error && <CheckCircle className="w-4 h-4 text-green-500" />}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <motion.p
          id={`${id}-error`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center space-x-1"
          role="alert"
        >
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </motion.p>
      )}
      
      {/* Success message */}
      {success && !error && (
        <motion.p
          id={`${id}-success`}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-green-600 flex items-center space-x-1"
        >
          <CheckCircle className="w-3 h-3" />
          <span>{success}</span>
        </motion.p>
      )}
    </div>
  )
}

export default EnhancedInput
