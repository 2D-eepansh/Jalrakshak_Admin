import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { useAutoTranslation, SUPPORTED_LANGUAGES } from '../hooks/useAutoTranslation'
import type { Language } from '../hooks/useAutoTranslation'

const AutoLanguageSelector = () => {
  const { currentLanguage, changeLanguage, availableLanguages } = useAutoTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguageName = SUPPORTED_LANGUAGES[currentLanguage]

  const handleLanguageChange = (newLanguage: Language) => {
    changeLanguage(newLanguage)
    setIsOpen(false)
  }

  const getFlag = (code: string) => {
    const flags: Record<string, string> = {
      en: '🇺🇸',
      hi: '🇮🇳',
      bn: '🇧🇩',
      ta: '🇮🇳',
      te: '🇮🇳',
      mr: '🇮🇳',
      gu: '🇮🇳',
      kn: '🇮🇳',
      ml: '🇮🇳',
      or: '🇮🇳',
      pa: '🇮🇳',
      as: '🇮🇳',
    }
    return flags[code] || '🌍'
  }

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-label={`Current language: ${currentLanguageName}. Click to change language.`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline font-medium">
          {currentLanguageName}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3 h-3" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20"
              role="listbox"
              aria-label="Language selection"
            >
              {availableLanguages.map((lang, index) => (
                <motion.button
                  key={lang.code}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50 ${
                    currentLanguage === lang.code ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                  role="option"
                  aria-selected={currentLanguage === lang.code}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {getFlag(lang.code)}
                    </span>
                    <span>{lang.name}</span>
                  </div>
                  {currentLanguage === lang.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <Check className="w-4 h-4 text-blue-600" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AutoLanguageSelector
