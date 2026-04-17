// components/FloatingControls.js
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function FloatingControls() {
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const mainMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { language, changeLanguage } = useLanguage();

  // ✅ التحقق مما إذا كنا في صفحة الكتالوج مودبورد
  const isCatalogMoodboard = location.pathname === '/catalog-moodboard';

  // التحقق من حجم الشاشة
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mainMenuRef.current && !mainMenuRef.current.contains(event.target)) {
        setShowMainMenu(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔥 إغلاق القائمة عند السكرول
  useEffect(() => {
    const handleScroll = () => {
      if (showMainMenu) {
        setShowMainMenu(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showMainMenu]);

  // 🔥 إغلاق القائمة عند النقر على الشاشة
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (showMainMenu && mainMenuRef.current && !mainMenuRef.current.contains(event.target)) {
        setShowMainMenu(false);
      }
    };

    document.addEventListener('click', handleDocumentClick);
    
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [showMainMenu]);

  // روابط القائمة الرئيسية
  const MAIN_MENU_LINKS = [
    { id: 0, name: { ar: "الرئيسية", en: "Home" }, path: "/" },
    { id: 1, name: { ar: "الخدمات", en: "Services" }, path: "/services" },
    { id: 2, name: { ar: "أعمالنا", en: "Our Works" }, path: "/portfolio" },
    { id: 3, name: { ar: "عن ديمور", en: "About Demore" }, path: "/about" },
    { id: 4, name: { ar: "تواصل معنا", en: "Contact Us" }, path: "/contact" },
  ];

  // دالة للانتقال إلى صفحة تسجيل الدخول
  const handleLoginClick = () => {
    navigate('/login');
    window.scrollTo(0, 0);
    setShowMainMenu(false);
  };

  // دالة للنقر على رابط القائمة
  const handleMenuLinkClick = (path) => {
    navigate(path);
    setShowMainMenu(false);
    window.scrollTo(0, 0);
  };

  // أيقونة الـ Hamburger المعدلة
  const HamburgerIcon = () => (
    <div className="flex flex-col items-center justify-center gap-1 sm:gap-1.5 p-1">
      <motion.span
        animate={showMainMenu ? { rotate: 45, y: isMobile ? 5 : 6 } : { rotate: 0, y: 0 }}
        className="block w-5 sm:w-6 h-0.5 bg-black rounded-full"
      />
      <motion.span
        animate={showMainMenu ? { opacity: 0, width: 0 } : { opacity: 1, width: isMobile ? 17 : 24 }}
        className="block w-5 sm:w-6 h-0.5 bg-black rounded-full"
        style={{ width: isMobile ? 20 : 24 }}
      />
      <motion.span
        animate={showMainMenu ? { rotate: -45, y: isMobile ? -5 : -6 } : { rotate: 0, y: 0 }}
        className="block w-5 sm:w-6 h-0.5 bg-black rounded-full"
      />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-3 sm:top-4 md:top-6 z-[99999] flex justify-between items-center w-full px-3 sm:px-4 md:px-6 pointer-events-none"
      style={{ direction: 'ltr' }}
    >
      {/* Language Toggle و Login Button معاً في مجموعة - متجاوب */}
      <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto" style={{ order: 1, marginLeft: 0, marginRight: 'auto' }}>
        
        {/* ✅ Login Button - يظهر فقط إذا لم نكن في صفحة الكتالوج مودبورد */}
        {!isCatalogMoodboard && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLoginClick}
            className="group relative px-3 sm:px-4 py-2 sm:py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center gap-1 sm:gap-2 cursor-pointer"
            title={language === 'ar' ? 'تسجيل الدخول' : 'Login'}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg 
              className="w-4 h-4 sm:w-5 sm:h-5 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.8} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
            <span className="hidden sm:inline text-white text-xs sm:text-sm font-medium tracking-wider">
              {language === 'ar' ? 'تسجيل دخول' : 'Login'}
            </span>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 sm:w-8 h-0.5 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        )}

        {/* Language Toggle - زر اللغة - يظهر دائماً في جميع الصفحات */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => changeLanguage(language === 'ar' ? 'en' : 'ar')}
          className="group relative px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative text-black text-sm sm:text-base md:text-lg font-medium tracking-wider">
            {language === 'ar' ? 'EN' : 'العربية'}
          </span>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 sm:w-8 h-0.5 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.button>
      </div>

      {/* Main Menu Button - زر القائمة الرئيسية - يظهر فقط إذا لم نكن في صفحة الكتالوج مودبورد */}
      {!isCatalogMoodboard && (
        <div className="relative pointer-events-auto" ref={mainMenuRef} style={{ order: 2, marginLeft: 'auto', marginRight: 0 }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMainMenu(!showMainMenu)}
            className="group relative px-3 sm:px-4 py-2 sm:py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center gap-1 sm:gap-2 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-l from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {/* Hamburger Icon - متجاوب */}
            <HamburgerIcon />
          </motion.button>

          {/* Main Menu Dropdown - متجاوب مع الشاشات */}
          <AnimatePresence>
            {showMainMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`absolute ${isMobile ? 'top-full right-0 mt-2 w-64' : 'top-full right-0 mt-3 w-72'} bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden`}
                style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
              >
                <div className="p-3 sm:p-4">
                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-white font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                      {language === 'ar' ? 'تصفح الموقع' : 'Browse the site'}
                    </h4>
                    <div className="w-10 sm:w-12 h-0.5 bg-gradient-to-r from-white/50 to-transparent"></div>
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    {MAIN_MENU_LINKS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleMenuLinkClick(item.path)}
                        className="group flex items-center justify-between p-2 sm:p-3 rounded-xl hover:bg-white/10 transition-all duration-300 w-full text-left cursor-pointer"
                      >
                        <span className="text-white/80 group-hover:text-white text-sm sm:text-base">
                          {item.name[language]}
                        </span>
                        <svg 
                          className={`w-4 h-4 sm:w-5 sm:h-5 text-white/40 group-hover:text-white/70 transition-colors ${language === 'ar' ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ✅ في صفحة الكتالوج مودبورد، نضيف مساحة فارغة لموازنة التصميم */}
      {isCatalogMoodboard && (
        <div className="pointer-events-none" style={{ order: 2, marginLeft: 'auto', marginRight: 0, width: '48px' }} />
      )}
    </motion.div>
  );
}