import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import MainMenu from "../components/MainMenu";

export default function Home() {
  const { language, direction } = useLanguage();

  const [showSplash, setShowSplash] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const heroRef = useRef(null);

  /* ================= SPLASH SCREEN ================= */
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  /* ================= IMAGE PRELOAD ================= */
  useEffect(() => {
    const img = new Image();
    img.src = "/images/header.jpg";
    img.onload = () => setIsLoaded(true);
  }, []);

  /* ================= SCROLL DETECTION ================= */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ================= SPLASH ================= */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              initial={{ opacity: 0, letterSpacing: "0.3em", y: 20 }}
              animate={{ opacity: 1, letterSpacing: "0.05em", y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-white text-6xl md:text-7xl font-light"
            >
              DEMORE
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MAIN ================= */}
      <main
        dir={direction}
        className={`min-h-screen bg-neutral-950 transition-opacity duration-1000 ${
          showSplash ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* ================= MENU ================= */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={`fixed top-0 inset-x-0 z-40 ${
            isScrolled
              ? "bg-neutral-950/90 backdrop-blur-sm"
              : "bg-transparent"
          }`}
        >
          <MainMenu />
        </motion.div>

        {/* ================= HERO ================= */}
        <section ref={heroRef} className="relative h-screen overflow-hidden">
          {/* Background Motion */}
          <motion.div
            className="absolute inset-0"
            animate={{
              x: ["0%", "-2%", "0%", "2%", "0%"],
              scale: [1.1, 1.12, 1.1],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src="/images/header.jpg"
              alt="Demore Interior Design"
              className={`w-full h-full object-cover transition-opacity duration-1000 ${
                isLoaded ? "opacity-100" : "opacity-0"
              }`}
              style={{
                filter: "brightness(0.6) contrast(1.1)",
              }}
            />
          </motion.div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

          {/* Content */}
          <div className="relative z-10 h-full flex items-center justify-center px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-5xl"
            >
              <h1 className="text-white text-6xl md:text-8xl font-light mb-6">
                DEMORE
              </h1>

              <p className="text-neutral-200 text-lg md:text-2xl max-w-2xl mx-auto mb-10">
                {language === "ar"
                  ? "نصنع المساحات بهدوء، ونترك للتفاصيل أن تتحدث"
                  : "We craft spaces quietly, letting details speak"}
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full border border-white/30 text-white hover:bg-white/10 transition"
              >
                {language === "ar" ? "استكشف المشاريع" : "Explore Projects"}
              </motion.button>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
            animate={{ y: [0, 10, 0], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="flex flex-col items-center">
              <div className="w-px h-16 bg-white/50 mb-2" />
              <span className="text-white/70 text-xs tracking-widest">
                {language === "ar" ? "تمرير" : "SCROLL"}
              </span>
            </div>
          </motion.div>
        </section>
      </main>
    </>
  );
}
