// /src/pages/SplashScreen.js
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function SplashScreen({ onComplete }) {
  const [showSplash, setShowSplash] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (onComplete) onComplete();
    }, 4800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!showSplash) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Cinematic Zoom Animation */}
      <motion.div
        initial={{ scale: 1.15 }}
        animate={{ 
          scale: 1,
          transition: {
            duration: 4.5,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0
          }
        }}
        className="absolute inset-0"
      >
        {/* Optimized background image for mobile */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/splashscreen.jpeg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%', // Adjusted for better mobile framing
          }}
        />
        
        {/* Parallax movement - optimized for mobile */}
        <motion.div
          initial={{ x: -15, y: -8 }}
          animate={{ 
            x: 0, 
            y: 0,
            transition: {
              duration: 5,
              ease: "easeOut",
              delay: 0.2
            }
          }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/splashscreen.jpeg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 30%',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Dark Overlay with better mobile contrast */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ duration: 2, delay: 0.3 }}
        className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/50 backdrop-blur-[0.5px]"
      ></motion.div>

      {/* Background Animation Elements - Mobile Optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle grid pattern - lighter on mobile */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px] md:bg-[size:48px_48px] opacity-10 md:opacity-20"></div>
        
        <motion.div 
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ 
            duration: 3.2,
            delay: 0.5,
            ease: "easeOut"
          }}
          className="absolute top-1/3 left-1/4 w-[250px] h-[250px] md:w-[450px] md:h-[450px] bg-gradient-to-r from-white/20 to-gray-300/20 rounded-full blur-3xl"
        ></motion.div>
        
        <motion.div 
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ 
            duration: 3.2,
            delay: 0.8,
            ease: "easeOut"
          }}
          className="absolute bottom-1/3 right-1/4 w-[200px] h-[200px] md:w-[350px] md:h-[350px] bg-gradient-to-l from-white/15 to-gray-300/15 rounded-full blur-3xl"
        ></motion.div>
      </div>

      {/* Logo Container - Perfectly Centered on Mobile */}
      <motion.div
        initial={{ scale: 0.25, opacity: 0, y: 20 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: 0,
          transition: {
            scale: {
              type: "spring",
              stiffness: 85,
              damping: 15,
              duration: 2.2,
              delay: 0.6
            },
            opacity: {
              duration: 1.8,
              delay: 0.7,
              ease: "easeOut"
            },
            y: {
              duration: 1.8,
              delay: 0.6,
              ease: "easeOut"
            }
          }
        }}
        className="relative z-10 w-full max-w-[85%] sm:max-w-[80%] md:max-w-[70%] lg:max-w-[60%] mx-auto px-4"
      >
        {/* Enhanced Glow Effect - Subtle on Mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0.1, 0.25, 0.1],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            opacity: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2
            },
            scale: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.2
            }
          }}
          className="absolute -inset-8 sm:-inset-10 md:-inset-12 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-full blur-2xl"
        ></motion.div>

        {/* Main Logo */}
        <div className="relative">
          <motion.h1 
            initial={{ 
              letterSpacing: "0.4em",
              opacity: 0,
              filter: "blur(10px)",
              y: -10
            }}
            animate={{ 
              letterSpacing: "0.1em",
              opacity: 1,
              filter: "blur(0px)",
              y: 0
            }}
            transition={{
              letterSpacing: {
                duration: 2.5,
                ease: "easeOut",
                delay: 0.9
              },
              opacity: {
                duration: 2,
                delay: 1,
                ease: "easeOut"
              },
              filter: {
                duration: 1.8,
                delay: 1.1,
                ease: "easeOut"
              },
              y: {
                duration: 1.8,
                delay: 0.9,
                ease: "easeOut"
              }
            }}
            className="text-white text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-center px-2 drop-shadow-2xl"
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.2)'
            }}
          >
            DEMORE
          </motion.h1>
          
          {/* Elegant Underline */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ 
              width: "70%",
              opacity: 1
            }}
            transition={{ 
              width: {
                duration: 3,
                delay: 1.8,
                ease: "easeInOut"
              },
              opacity: {
                duration: 2,
                delay: 1.8,
                ease: "easeOut"
              }
            }}
            className="h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent mt-3 sm:mt-4 md:mt-5 mx-auto"
          />
          
          {/* Subtitle - Crisp and Clear */}
          <motion.p
            initial={{ 
              opacity: 0, 
              y: 20,
              filter: "blur(6px)"
            }}
            animate={{ 
              opacity: 1, 
              y: 0,
              filter: "blur(0px)"
            }}
            transition={{ 
              opacity: {
                duration: 1.8,
                delay: 2.2,
                ease: "easeOut"
              },
              y: {
                duration: 1.6,
                delay: 2.2,
                ease: "easeOut"
              },
              filter: {
                duration: 1.4,
                delay: 2.2,
                ease: "easeOut"
              }
            }}
            className="text-white/90 text-sm sm:text-base md:text-lg lg:text-xl font-light tracking-wider mt-3 sm:mt-4 md:mt-5 text-center px-4"
            style={{
              textShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            {language === 'ar' ? 'The design and more' : 'The design and more'}
          </motion.p>
        </div>

        {/* Loading Dots - Elegant and Smooth */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            transition: {
              opacity: {
                duration: 1.2,
                delay: 2.8
              }
            }
          }}
          className="flex justify-center mt-6 sm:mt-8 md:mt-10 space-x-2"
        >
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.1, 0.8],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                scale: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: dot * 0.2 + 3
                },
                opacity: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: dot * 0.2 + 3
                }
              }}
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}