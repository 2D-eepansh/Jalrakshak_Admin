// Input validation and sanitization utilities

export interface ValidationResult {
  isValid: boolean
  error?: string
  sanitizedValue?: string
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' }
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }
  
  return { 
    isValid: true, 
    sanitizedValue: email.toLowerCase().trim() 
  }
}

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' }
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' }
  }
  
  return { 
    isValid: true, 
    sanitizedValue: password 
  }
}

// Text input sanitization
export const sanitizeText = (text: string, maxLength?: number): ValidationResult => {
  if (!text) {
    return { isValid: false, error: 'This field is required' }
  }
  
  // Remove potentially dangerous characters
  let sanitized = text
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
  
  if (maxLength && sanitized.length > maxLength) {
    return { 
      isValid: false, 
      error: `Text must be less than ${maxLength} characters` 
    }
  }
  
  return { 
    isValid: true, 
    sanitizedValue: sanitized 
  }
}

// Number validation
export const validateNumber = (value: string, min?: number, max?: number): ValidationResult => {
  const num = parseFloat(value)
  
  if (isNaN(num)) {
    return { isValid: false, error: 'Please enter a valid number' }
  }
  
  if (min !== undefined && num < min) {
    return { isValid: false, error: `Value must be at least ${min}` }
  }
  
  if (max !== undefined && num > max) {
    return { isValid: false, error: `Value must be at most ${max}` }
  }
  
  return { 
    isValid: true, 
    sanitizedValue: num.toString() 
  }
}

// URL validation
export const validateUrl = (url: string): ValidationResult => {
  if (!url.trim()) {
    return { isValid: false, error: 'URL is required' }
  }
  
  try {
    const urlObj = new URL(url)
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' }
    }
    
    return { 
      isValid: true, 
      sanitizedValue: urlObj.toString() 
    }
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' }
  }
}

// Phone number validation (basic)
export const validatePhone = (phone: string): ValidationResult => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  
  if (!phone.trim()) {
    return { isValid: false, error: 'Phone number is required' }
  }
  
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  
  if (!phoneRegex.test(cleaned)) {
    return { isValid: false, error: 'Please enter a valid phone number' }
  }
  
  return { 
    isValid: true, 
    sanitizedValue: cleaned 
  }
}

// Generic form validation
export const validateForm = (data: Record<string, any>, rules: Record<string, (value: any) => ValidationResult>) => {
  const errors: Record<string, string> = {}
  const sanitizedData: Record<string, any> = {}
  
  for (const [field, value] of Object.entries(data)) {
    const rule = rules[field]
    if (rule) {
      const result = rule(value)
      if (!result.isValid) {
        errors[field] = result.error || 'Invalid value'
      } else {
        sanitizedData[field] = result.sanitizedValue || value
      }
    } else {
      sanitizedData[field] = value
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  }
}
