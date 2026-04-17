// src/pages/Contact.js
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useLanguage } from "../contexts/LanguageContext";

// ============== Custom Icons ==============
const WhatsAppIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.077 4.928C17.191 3.041 14.683 2 12.006 2c-5.35 0-9.71 4.34-9.715 9.69-.002 1.71.446 3.38 1.298 4.848L2.3 21.2l4.76-1.245c1.41.772 3 1.18 4.63 1.181h.004c5.348 0 9.71-4.34 9.715-9.69.002-2.59-1.005-5.026-2.892-6.912zM12.02 19.167h-.003c-1.44 0-2.85-.387-4.074-1.115l-.292-.174-2.827.74.755-2.756-.19-.302c-.8-1.27-1.224-2.74-1.223-4.252.004-4.425 3.605-8.02 8.04-8.02 2.147 0 4.164.838 5.68 2.358 1.517 1.52 2.352 3.54 2.348 5.686-.004 4.426-3.605 8.02-8.04 8.02zm4.405-6.072c-.242-.12-1.43-.706-1.652-.786-.22-.08-.38-.12-.54.12-.16.24-.625.787-.766.948-.14.16-.28.18-.52.06-.242-.12-1.02-.376-1.944-1.2-.718-.64-1.202-1.43-1.343-1.672-.14-.24-.015-.37.106-.49.108-.108.24-.282.36-.423.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.195-.48-.39-.4-.52-.4-.135 0-.29-.02-.445-.02-.155 0-.406.06-.62.3-.213.24-.814.796-.814 1.94 0 1.145.832 2.25.948 2.406.116.156 1.616 2.522 3.99 3.432 2.374.91 2.374.606 2.803.568.43-.038 1.385-.566 1.58-1.113.196-.547.196-1.015.137-1.113-.06-.098-.22-.157-.462-.277z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const MapIcon = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const ChevronIcon = ({ isExpanded }) => (
  <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
);

// ============== Animation Variants ==============
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const slideInFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// ============== Floating Particles ==============
const FloatingParticles = ({ count = 20, light = false }) => {
  const [particleCount, setParticleCount] = useState(count);
  
  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth < 640) setParticleCount(10);
      else if (window.innerWidth < 1024) setParticleCount(15);
      else setParticleCount(count);
    };
    
    updateCount();
    window.addEventListener('resize', updateCount);
    return () => window.removeEventListener('resize', updateCount);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${light ? 'bg-gray-300/20' : 'bg-white/5'}`}
          style={{
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
          animate={{
            y: [0, Math.random() * 50 - 25, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: Math.random() * 15 + 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// ============== Interactive Contact Card ==============
const InteractiveContactCard = ({ 
  icon: Icon, 
  title, 
  subtitle, 
  details, 
  color, 
  onClick,
  delay = 0,
  light = false
}) => {
  const [, setIsHovered] = useState(false);
  
  const colorClasses = {
    amber: light 
      ? 'from-amber-100 to-amber-50 border-amber-200' 
      : 'from-amber-500/20 to-amber-600/20 border-amber-500/30',
    blue: light 
      ? 'from-blue-100 to-blue-50 border-blue-200'
      : 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
    purple: light 
      ? 'from-purple-100 to-purple-50 border-purple-200'
      : 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    green: light 
      ? 'from-green-100 to-green-50 border-green-200'
      : 'from-green-500/20 to-green-600/20 border-green-500/30'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.01, y: -2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div className={`relative bg-gradient-to-br ${colorClasses[color]} rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border backdrop-blur-sm overflow-hidden transition-all duration-300 h-full ${light ? 'shadow-md hover:shadow-lg' : ''}`}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`absolute inset-0 bg-gradient-to-br ${light ? 'from-white/20 to-transparent' : 'from-white/5 to-transparent'}`}></div>
        </div>
        
        <div className="relative z-10 flex items-start gap-3 sm:gap-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${colorClasses[color].replace('/20', '/40').replace('/30', '/50')} rounded-lg sm:rounded-xl flex items-center justify-center border ${light ? 'border-white/30' : ''} flex-shrink-0`}>
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${light ? 'text-gray-700' : 'text-white'}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-base sm:text-lg font-semibold mb-1 group-hover:text-amber-600 transition-colors duration-300 truncate ${light ? 'text-gray-800' : 'text-white'}`}>
              {title}
            </h3>
            {subtitle && (
              <p className={`text-xs sm:text-sm mb-1 ${light ? 'text-gray-600' : 'text-gray-300'} truncate`}>{subtitle}</p>
            )}
            {details && (
              <p className={`text-xs sm:text-sm ${light ? 'text-gray-900 font-medium' : 'text-white font-medium'} break-words`}>{details}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============== Multi Phone Contact Card ==============
const MultiPhoneContactCard = ({ 
  title, 
  phones, 
  color, 
  delay = 0,
  light = false,
  language = 'ar'
}) => {
  const [selectedPhone, setSelectedPhone] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const colorClasses = {
    blue: light 
      ? 'from-blue-100 to-blue-50 border-blue-200' 
      : 'from-blue-500/20 to-blue-600/20 border-blue-500/30'
  };

  const handlePhoneClick = (phone, index) => {
    setSelectedPhone(index);
    window.open(`tel:${phone.replace(/\s/g, '').replace('+', '')}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative group"
    >
      <div className={`relative bg-gradient-to-br ${colorClasses[color]} rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border backdrop-blur-sm overflow-hidden transition-all duration-300 h-full ${light ? 'shadow-md hover:shadow-lg' : ''}`}>
        
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`absolute inset-0 bg-gradient-to-br ${light ? 'from-white/20 to-transparent' : 'from-white/5 to-transparent'}`}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${colorClasses[color].replace('/20', '/40').replace('/30', '/50')} rounded-lg sm:rounded-xl flex items-center justify-center border ${light ? 'border-white/30' : ''} flex-shrink-0`}>
              <PhoneIcon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${light ? 'text-gray-700' : 'text-white'}`} />
            </div>
            <h3 className={`text-base sm:text-lg font-semibold group-hover:text-blue-600 transition-colors duration-300 ${light ? 'text-gray-800' : 'text-white'}`}>
              {title}
            </h3>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handlePhoneClick(phones[selectedPhone], selectedPhone)}
              className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl flex items-center justify-between ${
                light 
                  ? 'bg-white border border-blue-200 hover:border-blue-300 hover:bg-blue-50/50' 
                  : 'bg-gray-900/50 border border-gray-800 hover:border-gray-700'
              } transition-all duration-300`}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  light ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-white'
                }`}>
                  <PhoneIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className={`text-xs ${light ? 'text-gray-500' : 'text-gray-400'} truncate`}>
                    {language === 'ar' ? 'اضغط للاتصال' : 'Tap to call'}
                  </div>
                  <div className={`text-sm sm:text-base font-medium ${light ? 'text-gray-900' : 'text-white'} truncate`}>
                    {phones[selectedPhone]}
                  </div>
                </div>
              </div>
              <div className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg flex-shrink-0 ${
                light ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-white'
              }`}>
                {language === 'ar' ? 'اتصال' : 'Call'}
              </div>
            </motion.button>
            
            {phones.length > 1 && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-full py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg flex items-center justify-between ${
                  light 
                    ? 'hover:bg-gray-100/50 text-gray-600 hover:text-gray-900' 
                    : 'hover:bg-gray-800/50 text-gray-400 hover:text-white'
                } transition-all duration-300`}
              >
                <span className="text-xs sm:text-sm font-medium">
                  {isExpanded 
                    ? (language === 'ar' ? 'إخفاء' : 'Hide')
                    : (language === 'ar' ? `+${phones.length - 1}` : `+${phones.length - 1}`)
                  }
                </span>
                <ChevronIcon isExpanded={isExpanded} />
              </motion.button>
            )}
            
            <AnimatePresence>
              {isExpanded && phones.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5 sm:space-y-2 overflow-hidden"
                >
                  {phones.map((phone, index) => (
                    index !== selectedPhone && (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ x: 2 }}
                        onClick={() => handlePhoneClick(phone, index)}
                        className={`w-full py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg flex items-center justify-between ${
                          light 
                            ? 'hover:bg-gray-50 text-gray-600 hover:text-gray-900' 
                            : 'hover:bg-gray-800/50 text-gray-400 hover:text-white'
                        } transition-all duration-300`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            light ? 'bg-gray-100' : 'bg-gray-800'
                          }`}>
                            <PhoneIcon className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${light ? 'text-gray-700' : 'text-gray-300'}`} />
                          </div>
                          <span className={`text-xs sm:text-sm truncate ${light ? 'text-gray-900 font-medium' : 'text-white font-medium'}`}>
                            {phone}
                          </span>
                        </div>
                        <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded flex-shrink-0 ${
                          light ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-blue-500/20 text-white font-medium'
                        }`}>
                          {language === 'ar' ? 'اتصال' : 'Call'}
                        </span>
                      </motion.button>
                    )
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============== Multi WhatsApp Contact Card ==============
const MultiWhatsAppContactCard = ({ 
  title, 
  whatsappLinks, 
  whatsappNumbers,
  color, 
  delay = 0,
  light = false,
  language = 'ar'
}) => {
  const [selectedWhatsApp, setSelectedWhatsApp] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const colorClasses = {
    green: light 
      ? 'from-green-100 to-green-50 border-green-200' 
      : 'from-green-500/20 to-green-600/20 border-green-500/30'
  };

  const handleWhatsAppClick = (link, index) => {
    setSelectedWhatsApp(index);
    window.open(link, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative group"
    >
      <div className={`relative bg-gradient-to-br ${colorClasses[color]} rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border backdrop-blur-sm overflow-hidden transition-all duration-300 h-full ${light ? 'shadow-md hover:shadow-lg' : ''}`}>
        
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className={`absolute inset-0 bg-gradient-to-br ${light ? 'from-white/20 to-transparent' : 'from-white/5 to-transparent'}`}></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${colorClasses[color].replace('/20', '/40').replace('/30', '/50')} rounded-lg sm:rounded-xl flex items-center justify-center border ${light ? 'border-white/30' : ''} flex-shrink-0`}>
              <WhatsAppIcon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${light ? 'text-gray-700' : 'text-white'}`} />
            </div>
            <h3 className={`text-base sm:text-lg font-semibold group-hover:text-green-600 transition-colors duration-300 ${light ? 'text-gray-800' : 'text-white'}`}>
              {title}
            </h3>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleWhatsAppClick(whatsappLinks[selectedWhatsApp], selectedWhatsApp)}
              className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg sm:rounded-xl flex items-center justify-between ${
                light 
                  ? 'bg-white border border-green-200 hover:border-green-300 hover:bg-green-50/50' 
                  : 'bg-gray-900/50 border border-gray-800 hover:border-gray-700'
              } transition-all duration-300`}
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  light ? 'bg-green-100 text-green-600' : 'bg-green-500/20 text-white'
                }`}>
                  <WhatsAppIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <div className="text-left min-w-0 flex-1">
                  <div className={`text-xs ${light ? 'text-gray-500' : 'text-gray-400'} truncate`}>
                    {language === 'ar' ? 'اضغط للمراسلة' : 'Tap to message'}
                  </div>
                  <div className={`text-sm sm:text-base font-medium ${light ? 'text-gray-900' : 'text-white'} truncate`}>
                    {whatsappNumbers[selectedWhatsApp]}
                  </div>
                </div>
              </div>
              <div className={`text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg flex-shrink-0 ${
                light ? 'bg-green-100 text-green-700' : 'bg-green-500/20 text-white'
              }`}>
                {language === 'ar' ? 'واتساب' : 'WhatsApp'}
              </div>
            </motion.button>
            
            {whatsappLinks.length > 1 && (
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-full py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg flex items-center justify-between ${
                  light 
                    ? 'hover:bg-gray-100/50 text-gray-600 hover:text-gray-900' 
                    : 'hover:bg-gray-800/50 text-gray-400 hover:text-white'
                } transition-all duration-300`}
              >
                <span className="text-xs sm:text-sm font-medium">
                  {isExpanded 
                    ? (language === 'ar' ? 'إخفاء' : 'Hide')
                    : (language === 'ar' ? `+${whatsappLinks.length - 1}` : `+${whatsappLinks.length - 1}`)
                  }
                </span>
                <ChevronIcon isExpanded={isExpanded} />
              </motion.button>
            )}
            
            <AnimatePresence>
              {isExpanded && whatsappLinks.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1.5 sm:space-y-2 overflow-hidden"
                >
                  {whatsappLinks.map((link, index) => (
                    index !== selectedWhatsApp && (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ x: 2 }}
                        onClick={() => handleWhatsAppClick(link, index)}
                        className={`w-full py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg flex items-center justify-between ${
                          light 
                            ? 'hover:bg-gray-50 text-gray-600 hover:text-gray-900' 
                            : 'hover:bg-gray-800/50 text-gray-400 hover:text-white'
                        } transition-all duration-300`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            light ? 'bg-gray-100' : 'bg-gray-800'
                          }`}>
                            <WhatsAppIcon className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${light ? 'text-gray-700' : 'text-gray-300'}`} />
                          </div>
                          <span className={`text-xs sm:text-sm truncate ${light ? 'text-gray-900 font-medium' : 'text-white font-medium'}`}>
                            {whatsappNumbers[index]}
                          </span>
                        </div>
                        <span className={`text-xs px-1.5 sm:px-2 py-0.5 rounded flex-shrink-0 ${
                          light ? 'bg-green-100 text-green-700 font-medium' : 'bg-green-500/20 text-white font-medium'
                        }`}>
                          {language === 'ar' ? 'مراسلة' : 'Message'}
                        </span>
                      </motion.button>
                    )
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ============== Animated Input Field ==============
const AnimatedInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  required = false, 
  placeholder = "",
  delay = 0,
  icon: Icon,
  light = false,
  isTextarea = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const inputClasses = light
    ? `w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border ${
        isFocused 
          ? 'border-amber-500 ring-2 ring-amber-500/20' 
          : 'border-gray-200 hover:border-gray-300'
      } rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-300 text-sm sm:text-base text-gray-900 placeholder-gray-400`
    : `w-full px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-br from-gray-900/50 to-black/50 border ${
        isFocused 
          ? 'border-amber-500/50 ring-2 ring-amber-500/20' 
          : 'border-gray-800 hover:border-gray-700'
      } rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-300 text-sm sm:text-base text-white placeholder-gray-600`;

  const Component = isTextarea ? 'textarea' : 'input';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative group"
    >
      <label className={`block text-xs sm:text-sm font-medium mb-2 sm:mb-3 pl-1 ${light ? 'text-gray-700' : 'text-gray-300'}`}>
        {label} {required && <span className="text-amber-500">*</span>}
      </label>
      
      <div className="relative">
        {Icon && (
          <div className={`absolute ${isTextarea ? 'top-4' : 'top-1/2 transform -translate-y-1/2'} right-3 sm:right-4 ${light ? 'text-gray-400 group-hover:text-gray-600' : 'text-gray-500 group-hover:text-gray-400'} transition-colors duration-300`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
        
        <Component
          type={!isTextarea ? type : undefined}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className={inputClasses + (isTextarea ? ' min-h-[100px] sm:min-h-[120px] resize-none' : '')}
          placeholder={placeholder}
          rows={isTextarea ? 4 : undefined}
        />
        
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

// ============== Animated Select Field ==============
const AnimatedSelect = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options, 
  required = false,
  delay = 0,
  placeholder,
  light = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const selectClasses = light
    ? `w-full px-4 sm:px-5 py-3 sm:py-4 bg-white border ${
        isFocused 
          ? 'border-amber-500 ring-2 ring-amber-500/20' 
          : 'border-gray-200 hover:border-gray-300'
      } rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-300 text-sm sm:text-base text-gray-900 appearance-none cursor-pointer`
    : `w-full px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-br from-gray-900/50 to-black/50 border ${
        isFocused 
          ? 'border-amber-500/50 ring-2 ring-amber-500/20' 
          : 'border-gray-800 hover:border-gray-700'
      } rounded-xl sm:rounded-2xl focus:outline-none transition-all duration-300 text-sm sm:text-base text-white appearance-none cursor-pointer`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative group"
    >
      <label className={`block text-xs sm:text-sm font-medium mb-2 sm:mb-3 pl-1 ${light ? 'text-gray-700' : 'text-gray-300'}`}>
        {label} {required && <span className="text-amber-500">*</span>}
      </label>
      
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          className={selectClasses}
        >
          <option value="" className={light ? "bg-white text-gray-900" : "bg-gray-900 text-white"}>{placeholder}</option>
          {options.map((option, index) => (
            <option 
              key={index} 
              value={typeof option === 'object' ? option.value : option}
              className={light ? "bg-white text-gray-900" : "bg-gray-900 text-white"}
            >
              {typeof option === 'object' ? option.label : option}
            </option>
          ))}
        </select>
        
        <div className={`absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 ${light ? 'text-gray-400' : 'text-gray-500'} pointer-events-none`}>
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  );
};

// ============== Main Component ==============
export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    message: "",
    projectType: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const { language } = useLanguage();
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const formRef = useRef(null);
  const successRef = useRef(null);

  // Hero background images - Updated with local paths
  const heroImages = [
    "/images/services_hero.jpg",
    "/images/services_hero1.jpg", 
    "/images/services_hero2.jpg",
    "/images/services_hero3.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const contactInfo = {
    phones: [ "00970566498382","00970538506023"],
    whatsappLinks: ["https://wa.link/j862lk", "https://wa.link/h7mmst"],
    whatsappNumbers: ["00970538506023", "00970566498382"],
    email: "info@demoreps.com",
    address: language === 'ar' 
      ? "فلسطين - بيت جالا\nشارع النزهة، مقابل دخلة الجمعية العربية"
      : "Palestine - Beit Jala\nAl Nuzha Street, opposite Al Jamia Al Arabia entrance",
    workingHours: language === 'ar' 
      ? "السبت - الخميس: 9:00 ص - 5:00 م\nالجمعة : مغلق"
      : "Saturday - Thursday: 9:00 AM - 5:00 PM\nFriday: Closed",
    facebook: "https://www.facebook.com/share/1C6SKhXQds/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/demore_co?igsh=MTcyYTcxNGo1bXRsag==",
    mapLocation: "31.71613276227327, 35.18031132181027"
  };

  const services = language === 'ar' ? [
    { value: "living_room", label: "تصميم غرف المعيشة" },
    { value: "kitchen", label: "تصميم المطابخ" },
    { value: "bedroom", label: "تصميم غرف النوم" },
    { value: "bathroom", label: "ديكور الحمامات" },
    { value: "office", label: "تصميم المكاتب" },
    { value: "restaurant", label: "تصميم المطاعم" },
    { value: "store", label: "تصميم المتاجر" },
    { value: "complete", label: "التصميم الداخلي الشامل" }
  ] : [
    { value: "living_room", label: "Living Room Design" },
    { value: "kitchen", label: "Kitchen Design" },
    { value: "bedroom", label: "Bedroom Design" },
    { value: "bathroom", label: "Bathroom Decor" },
    { value: "office", label: "Office Design" },
    { value: "restaurant", label: "Restaurant Design" },
    { value: "store", label: "Store Design" },
    { value: "complete", label: "Complete Interior Design" }
  ];

  const budgetRanges = language === 'ar' ? [
    "أقل من 5,000 ₪",
    "5,000 - 10,000 ₪", 
    "10,000 - 20,000 ₪",
    "20,000 - 50,000 ₪",
    "أكثر من 50,000 ₪"
  ] : [
    "Less than 5,000 ₪",
    "5,000 - 10,000 ₪",
    "10,000 - 20,000 ₪",
    "20,000 - 50,000 ₪",
    "More than 50,000 ₪"
  ];

  const projectTypes = language === 'ar' ? [
    { value: "residential", label: "سكني" },
    { value: "commercial", label: "تجاري" },
    { value: "both", label: "كلاهما" }
  ] : [
    { value: "residential", label: "Residential" },
    { value: "commercial", label: "Commercial" },
    { value: "both", label: "Both" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);

    try {
      await addDoc(collection(db, "contactMessages"), {
        ...formData,
        status: "new",
        read: false,
        createdAt: serverTimestamp(),
        language: language
      });

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        budget: "",
        message: "",
        projectType: ""
      });

      setTimeout(() => {
        successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);

    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setLoading(false);
    }
  };


  const handleEmailClick = () => {
    window.open(`mailto:${contactInfo.email}`);
  };

  const handleFacebookClick = () => {
    window.open(contactInfo.facebook, '_blank');
  };

  const handleInstagramClick = () => {
    window.open(contactInfo.instagram, '_blank');
  };

  const handleMapClick = () => {
    const mapsUrl = `https://www.google.com/maps?q=${contactInfo.mapLocation}`;
    window.open(mapsUrl, '_blank');
  };

  const getMapEmbedUrl = () => {
    const [lat, lng] = contactInfo.mapLocation.split(',');
    return `https://maps.google.com/maps?q=${lat},${lng}&z=17&output=embed&hl=${language}`;
  };

  const textContent = {
    heroTitle: language === 'ar' ? "لنبدأ رحلة تصميم فريدة معاً" : "Let's Start a Unique Design Journey Together",
    heroSubtitle: language === 'ar' 
      ? "نحن هنا لتحويل رؤيتك إلى واقع."
      : "We're here to turn your vision into reality.",
    formTitle: language === 'ar' ? "أخبرنا عن مشروعك" : "Tell Us About Your Project",
    formSubtitle: language === 'ar'
      ? "املأ النموذج وسنرد عليك خلال 24 ساعة"
      : "Fill out the form and we'll get back to you within 24 hours",
    locationTitle: language === 'ar' ? "زورونا في مكتبنا" : "Visit Our Studio",
    locationSubtitle: language === 'ar' ? "نرحب بكم دائماً" : "We always welcome you",
    hoursTitle: language === 'ar' ? "ساعات العمل" : "Working Hours",
    followUs: language === 'ar' ? "تابعونا" : "Follow Us",
    followDescription: language === 'ar' ? "ابق على اطلاع بأحدث أعمالنا" : "Stay updated with our latest works",
    fullName: language === 'ar' ? "الاسم الكامل" : "Full Name",
    namePlaceholder: language === 'ar' ? "أدخل اسمك" : "Enter your name",
    email: language === 'ar' ? "البريد الإلكتروني" : "Email",
    phone: language === 'ar' ? "رقم الهاتف" : "Phone Number",
    phonePlaceholder: language === 'ar' ? "أدخل رقم هاتفك" : "Enter your phone",
    service: language === 'ar' ? "نوع الخدمة" : "Service Type",
    selectService: language === 'ar' ? "اختر الخدمة" : "Select service",
    projectType: language === 'ar' ? "نوع المشروع" : "Project Type",
    selectProjectType: language === 'ar' ? "اختر نوع المشروع" : "Select project type",
    budget: language === 'ar' ? "الميزانية" : "Budget",
    selectBudget: language === 'ar' ? "اختر الميزانية" : "Select budget",
    projectDetails: language === 'ar' ? "تفاصيل المشروع" : "Project Details",
    messagePlaceholder: language === 'ar' ? "أخبرنا عن مشروعك..." : "Tell us about your project...",
    callUs: language === 'ar' ? "اتصل بنا" : "Call Us",
    messageUs: language === 'ar' ? "راسلنا على واتساب" : "Message us on WhatsApp",
    ourAddress: language === 'ar' ? "عنواننا" : "Our Address",
    openInMaps: language === 'ar' ? "فتح في الخريطة" : "Open in Maps",
    city: language === 'ar' ? "بيت جالا" : "Beit Jala",
    country: language === 'ar' ? "فلسطين" : "Palestine",
    location: language === 'ar' ? "الموقع" : "Location",
    whatsapp: language === 'ar' ? "واتساب" : "WhatsApp",
    address: language === 'ar' ? "العنوان" : "Address",
    sendInquiry: language === 'ar' ? "إرسال" : "Send",
    sending: language === 'ar' ? "جاري الإرسال..." : "Sending...",
    successMessage: language === 'ar' 
      ? "تم الإرسال بنجاح! سنتواصل معك قريباً"
      : "Sent successfully! We'll contact you soon",
    errorMessage: language === 'ar'
      ? "حدث خطأ. حاول مرة أخرى"
      : "An error occurred. Please try again",
    allRightsReserved: language === 'ar' ? "جميع الحقوق محفوظة" : "All rights reserved"
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 overflow-hidden"
    >
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          {heroImages.map((img, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: index === 0 ? 1 : 0 }}
              animate={{ opacity: heroImageIndex === index ? 1 : 0 }}
              transition={{ opacity: { duration: 2, ease: "easeInOut" } }}
            >
              <img
                src={img}
                alt={`Contact Hero ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
          
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/70 to-white/90"></div>
          <FloatingParticles count={20} light={true} />
        </div>
        
        <div className="relative top-12 z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="text-center"
          >
            <motion.h1
              variants={fadeInUp}
              className=" text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 mb-4 sm:mb-6 lg:mb-8 leading-tight px-4"
            >
              <span className="block">{textContent.heroTitle}</span>
              <span className="block text-gray-600 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mt-1">
                {language === 'ar' ? "مع DEMORE" : "With DEMORE"}
              </span>
            </motion.h1>
            
            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed px-4"
            >
              {textContent.heroSubtitle}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative -mt-10 sm:-mt-16 lg:-mt-20 z-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            
            {/* Contact Information */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="space-y-4 sm:space-y-5 lg:space-y-6"
            >
              <MultiPhoneContactCard
                title={textContent.callUs}
                phones={contactInfo.phones}
                color="blue"
                delay={0.1}
                light={true}
                language={language}
              />
              
              <MultiWhatsAppContactCard
                title={textContent.whatsapp}
                whatsappLinks={contactInfo.whatsappLinks}
                whatsappNumbers={contactInfo.whatsappNumbers}
                color="green"
                delay={0.2}
                light={true}
                language={language}
              />
              
              <InteractiveContactCard
                icon={EmailIcon}
                title={textContent.email}
                details={contactInfo.email}
                color="purple"
                onClick={handleEmailClick}
                delay={0.3}
                light={true}
              />
              
              <InteractiveContactCard
                icon={LocationIcon}
                title={textContent.address}
                subtitle={textContent.city}
                color="amber"
                onClick={handleMapClick}
                delay={0.4}
                light={true}
              />
              
              {/* Social Media */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200 shadow-md"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                  {textContent.followUs}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4">
                  {textContent.followDescription}
                </p>
                <div className="flex gap-3 sm:gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFacebookClick}
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center border border-blue-200 hover:border-blue-300 transition-all duration-300"
                  >
                    <FacebookIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleInstagramClick}
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg sm:rounded-xl flex items-center justify-center border border-purple-200 hover:border-purple-300 transition-all duration-300"
                  >
                    <InstagramIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gradient-to-br from-purple-600 to-pink-600" />
                  </motion.button>
                  
                </div>
              </motion.div>
              
              {/* Map Section */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200 shadow-md"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-100 to-amber-50 rounded-lg sm:rounded-xl flex items-center justify-center border border-amber-200 flex-shrink-0">
                    <LocationIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                      {textContent.locationTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {textContent.locationSubtitle}
                    </p>
                  </div>
                </div>
                
                <div className="rounded-lg sm:rounded-xl overflow-hidden border border-gray-300 mb-4">
                  <iframe
                    src={getMapEmbedUrl()}
                    width="100%"
                    height="160"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    className="grayscale"
                    title={textContent.locationTitle}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <LocationIcon className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs sm:text-sm text-gray-800 font-medium mb-0.5">
                        {textContent.ourAddress}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {contactInfo.address}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <ClockIcon className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs sm:text-sm text-gray-800 font-medium mb-0.5">
                        {textContent.hoursTitle}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                        {contactInfo.workingHours}
                      </div>
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleMapClick}
                  className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <MapIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  {textContent.openInMaps}
                </motion.button>
              </motion.div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInFromRight}
            >
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 border border-gray-200 shadow-xl">
                <div className="mb-6 sm:mb-8 lg:mb-10">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-1 h-6 sm:h-8 lg:h-10 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                      {textContent.formTitle}
                    </h2>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">
                    {textContent.formSubtitle}
                  </p>
                </div>
                
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 lg:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                    <AnimatedInput
                      label={textContent.fullName}
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={true}
                      placeholder={textContent.namePlaceholder}
                      delay={0.1}
                      light={true}
                    />
                    
                    <AnimatedInput
                      label={textContent.email}
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      type="email"
                      placeholder="example@email.com"
                      delay={0.2}
                      light={true}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                    <AnimatedInput
                      label={textContent.phone}
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required={true}
                      placeholder={textContent.phonePlaceholder}
                      delay={0.3}
                      light={true}
                    />
                    
                    <AnimatedSelect
                      label={textContent.service}
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      options={services}
                      placeholder={textContent.selectService}
                      delay={0.4}
                      light={true}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                    <AnimatedSelect
                      label={textContent.projectType}
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      options={projectTypes}
                      placeholder={textContent.selectProjectType}
                      delay={0.5}
                      light={true}
                    />
                    
                    <AnimatedSelect
                      label={textContent.budget}
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      options={budgetRanges}
                      placeholder={textContent.selectBudget}
                      delay={0.6}
                      light={true}
                    />
                  </div>
                  
                  <AnimatedInput
                    label={textContent.projectDetails}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required={true}
                    placeholder={textContent.messagePlaceholder}
                    delay={0.7}
                    light={true}
                    isTextarea={true}
                  />
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full group relative overflow-hidden mt-4 sm:mt-5 lg:mt-6"
                    disabled={loading}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 w-full py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 text-white font-semibold text-sm sm:text-base">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          {textContent.sending}
                        </>
                      ) : (
                        <>
                          <SendIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          {textContent.sendInquiry}
                        </>
                      )}
                    </div>
                  </motion.button>
                  
                  <AnimatePresence>
                    {submitStatus === "success" && (
                      <motion.div
                        ref={successRef}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center border border-green-200 flex-shrink-0">
                            <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                          </div>
                          <p className="text-xs sm:text-sm text-green-800 font-medium">
                            {textContent.successMessage}
                          </p>
                        </div>
                      </motion.div>
                    )}
                    
                    {submitStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4"
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center border border-red-200 flex-shrink-0">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </div>
                          <p className="text-xs sm:text-sm text-red-800 font-medium">
                            {textContent.errorMessage}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 sm:mt-16 lg:mt-20 py-4 sm:py-6 lg:py-8 px-4 border-t border-gray-200"
      >
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            © {new Date().getFullYear()} DEMORE Design. {textContent.allRightsReserved}
          </p>
        </div>
      </motion.footer>
      
      <style jsx="true">{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
        
        ::selection {
          background: rgba(245, 158, 11, 0.3);
          color: #1f2937;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
        
        @media (max-width: 640px) {
          .text-gradient {
            background-size: 100% 100%;
          }
        }
      `}</style>
    </motion.div>
  );
}