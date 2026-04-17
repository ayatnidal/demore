import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("home");
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showContactOptions, setShowContactOptions] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const mainMenuRef = useRef(null);
  const contactOptionsRef = useRef(null);
  const navigate = useNavigate();
  
  const { language, changeLanguage } = useLanguage();

  // معلومات الاتصال
  const contactInfo = {
    phone: "+970 538 506 023",
    email: "info@demoreps.com",
    whatsapp: "https://wa.link/j862lk",
    facebook: "https://www.facebook.com/share/1C6SKhXQds/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/demore_co?igsh=MTcyYTcxNGo1bXRsag==",
  };

  // روابط القائمة الرئيسية
  const MAIN_MENU_LINKS = [
    { id: 0, name: { ar: "الرئيسية", en: "Home" }, path: "/" },
    { id: 1, name: { ar: "الخدمات", en: "Services" }, path: "/services" },
    { id: 2, name: { ar: "أعمالنا", en: "Our Works" }, path: "/portfolio" },
    { id: 3, name: { ar: "عن ديمور", en: "About Demore" }, path: "/about" },
    { id: 4, name: { ar: "تواصل معنا", en: "Contact Us" }, path: "/contact" },
  ];

  // دالة للحصول على النص حسب اللغة
  const getText = (textObject) => {
    if (!textObject) return "";
    
    if (typeof textObject === 'object' && textObject !== null) {
      return textObject[language] || textObject.en || textObject.ar || "";
    }
    
    return textObject || "";
  };

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contactOptionsRef.current && !contactOptionsRef.current.contains(event.target)) {
        setShowContactOptions(false);
      }
      if (mainMenuRef.current && !mainMenuRef.current.contains(event.target)) {
        setShowMainMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // تتبع التمرير
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);

      // تحديد القسم النشط بناءً على الموقع
      const sections = ['home', 'projects', 'services', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // التنقل إلى قسم
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  // دالة للعودة إلى الصفحة الرئيسية
  const handleHomeClick = () => {
    navigate('/');
    window.scrollTo(0, 0);
    setShowMainMenu(false);
  };

  // دالة للانتقال إلى صفحة تسجيل الدخول
  const handleLoginClick = () => {
    navigate('/login');
    window.scrollTo(0, 0);
  };

  // دالة للنقر على رابط القائمة
  const handleMenuLinkClick = (path) => {
    navigate(path);
    setShowMainMenu(false);
    window.scrollTo(0, 0);
  };

  // معالجة اختيار خيار الاتصال
  const handleContactClick = (option) => {
    setShowContactOptions(false);
    
    switch(option) {
      case 'whatsapp':
        window.open(contactInfo.whatsapp, '_blank');
        break;
      case 'phone':
        window.open(`tel:${contactInfo.phone.replace(/\s/g, '')}`);
        break;
      case 'email':
        window.location.href = `mailto:${contactInfo.email}`;
        break;
      case 'contact-page':
        navigate('/contact');
        break;
      case 'facebook':
        window.open(contactInfo.facebook, '_blank');
        break;
      case 'instagram':
        window.open(contactInfo.instagram, '_blank');
        break;
      default:
        break;
    }
  };

  // التنقل حسب المسار الحالي
  const handleNavigationClick = (section) => {
    const currentPath = window.location.pathname;
    
    if (currentPath === '/') {
      // إذا كنا في الصفحة الرئيسية، استخدم التمرير
      scrollToSection(section);
    } else {
      // إذا كنا في صفحة أخرى، انتقل إلى الصفحة الرئيسية ثم قم بالتمرير
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          setTimeout(() => scrollToSection(section), 100);
        }
      }, 100);
    }
  };

  // ================== Floating Controls ==================
  const renderFloatingControls = () => (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 1 }}
      className="fixed top-6 z-50 flex justify-between items-center w-full px-6"
      style={{ direction: 'ltr' }}
    >
      {/* Language Toggle و Login Button معاً في مجموعة */}
      <div className="flex items-center gap-3" style={{ order: 1, marginLeft: 0, marginRight: 'auto' }}>
        {/* Login Button - زر تسجيل الدخول */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLoginClick}
          className="group relative px-4 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center gap-2"
          title={language === 'ar' ? 'تسجيل الدخول' : 'Login'}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <svg 
            className="w-5 h-5 text-white" 
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
          <span className="hidden sm:inline text-white font-medium tracking-wider">
            {language === 'ar' ? 'تسجيل دخول' : 'Login'}
          </span>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.button>

        {/* Language Toggle - زر اللغة */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => changeLanguage(language === 'ar' ? 'en' : 'ar')}
          className="group relative px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 hover:border-white/40 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative text-black font-medium tracking-wider text-lg">
            {language === 'ar' ? 'EN' : 'العربية'}
          </span>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.button>
      </div>

      {/* Main Menu Button - زر القائمة الرئيسية */}
      <div className="relative" ref={mainMenuRef} style={{ order: 2, marginLeft: 'auto', marginRight: 0 }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowMainMenu(!showMainMenu)}
          className="group relative px-4 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-black/20 hover:border-white/40 transition-all duration-300 flex items-center gap-2"
        >
          <div className="absolute inset-0 bg-gradient-to-l from-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {/* Hamburger Icon */}
          <div className="flex flex-col gap-1.5 p-1">
            <motion.span
              animate={showMainMenu ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-black rounded-full"
            />
            <motion.span
              animate={showMainMenu ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-0.5 bg-black rounded-full"
            />
            <motion.span
              animate={showMainMenu ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-black rounded-full"
            />
          </div>
        </motion.button>

        {/* Main Menu Dropdown */}
        {showMainMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-3 w-72 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
          >
            <div className="p-4">
              <div className="mb-4">
                <h4 className="text-white font-semibold text-lg mb-2">
                  {language === 'ar' ? 'تصفح الموقع' : 'Browse the site'}
                </h4>
                <div className="w-12 h-0.5 bg-gradient-to-r from-white/50 to-transparent"></div>
              </div>
              
              <div className="space-y-2">
                {MAIN_MENU_LINKS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuLinkClick(item.path)}
                    className="group flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-all duration-300 w-full text-left"
                  >
                    <span className="text-white/80 group-hover:text-white text-base">
                      {item.name[language]}
                    </span>
                    <svg 
                      className={`w-5 h-5 text-white/40 group-hover:text-white/70 transition-colors ${language === 'ar' ? 'rotate-180' : ''}`} 
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
      </div>
    </motion.div>
  );

  // ================== Main Navigation ==================
  const renderMainNavigation = () => (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl"
    >
      <div className="bg-white/80 backdrop-blur-md rounded-full px-6 py-3 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHomeClick}
            className="cursor-pointer font-light tracking-wider text-sm uppercase text-gray-900"
          >
            {language === 'ar' ? 'ديمور' : 'DEMORE'}
          </motion.div>

          <div className="flex items-center space-x-1">
            {[
              { id: 'home', label: { en: 'Home', ar: 'الرئيسية' } },
              { id: 'projects', label: { en: 'Projects', ar: 'المشاريع' } },
              { id: 'services', label: { en: 'Services', ar: 'الخدمات' } },
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigationClick(item.id)}
                className={`relative px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                  activeSection === item.id 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {getText(item.label)}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-full border border-gray-900"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );

  // ================== Progress Bar ==================
  const renderProgressBar = () => (
    <motion.div 
      className="fixed top-0 left-0 h-0.5 bg-gray-900 z-[9998]"
      style={{ width: `${scrollProgress}%` }}
      transition={{ duration: 0.1 }}
    />
  );

  return (
    <>
      {renderProgressBar()}
      {renderFloatingControls()}
      {renderMainNavigation()}
    </>
  );
}