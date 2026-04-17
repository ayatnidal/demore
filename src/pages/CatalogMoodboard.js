import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useState, useEffect } from "react";

export default function CatalogMoodboard() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  // جلب صلاحية المستخدم من localStorage
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  // المحتوى حسب اللغة
  const content = {
    title: {
      ar: "كتالوج المواد",
      en: "Material Catalog"
    },
    backToAdmin: {
      ar: "العودة للوحة التحكم",
      en: "Back to Dashboard"
    },
    backToHome: {
      ar: "العودة للرئيسية",
      en: "Back to Home"
    },
    
    paint: {
      ar: "الدهانات",
      en: "Paint"
    },
    tiles: {
      ar: "البلاط",
      en: "Tiles"
    },
    lighting: {
      ar: "الإضاءة",
      en: "Lighting"
    },
    parquet: {
      ar: "الباركيت",
      en: "Parquet"
    },
    gypsum: {
      ar: "الجبس",
      en: "Gypsum"
    },
    curtains: {
      ar: "الستائر",
      en: "Curtains"
    },
    wood: {
      ar: "الخشب",
      en: "Wood"
    },
    aluminum: {
      ar: "الألمنيوم",
      en: "Aluminum"
    },
    marble: {
      ar: "الرخام",
      en: "Marble"
    }
  };

  // عناصر الكتالوج مع مواقعها المئوية للـ Grid
  const catalogItems = [
    {
      id: 'paint',
      path: '/components/catalog/PaintPage',
      image: '/images/paint.jpg',
      gridArea: 'paint',
      labelPosition: 'top-right',
      labelBg: 'bg-white/80',
      labelTextColor: 'text-[#4a3f36]',
      imageSize: 'aspect-[3/4]'
    },
    {
      id: 'tiles',
      path: '/components/catalog/TilesPage',
      image: '/images/tiles.jpg',
      gridArea: 'tiles',
      labelPosition: 'top-right',
      labelBg: 'bg-[#4a3f36]',
      labelTextColor: 'text-white',
      imageSize: 'aspect-[3/4]'
    },
    {
      id: 'lighting',
      path: '/components/catalog/LightingPage',
      image: '/images/lighting.jpg',
      gridArea: 'lighting',
      labelPosition: 'top-right',
      labelBg: 'bg-black/70',
      labelTextColor: 'text-white',
      imageSize: 'aspect-[3/4]'
    },
    {
      id: 'parquet',
      path: '/components/catalog/ParquetPage',
      image: '/images/parquet.jpg',
      gridArea: 'parquet',
      labelPosition: 'top-right',
      labelBg: 'bg-[#a58d7b]',
      labelTextColor: 'text-white',
      imageSize: 'aspect-[4/3]'
    },
    {
      id: 'gypsum',
      path: '/components/catalog/GypsumPage',
      image: '/images/gypsum.jpg',
      gridArea: 'gypsum',
      labelPosition: 'top-right',
      labelBg: 'bg-white/90',
      labelTextColor: 'text-[#3a322b]',
      imageSize: 'aspect-square'
    },
    {
      id: 'curtains',
      path: '/components/catalog/CurtainsPage',
      image: '/images/curtains.jpg',
      gridArea: 'curtains',
      labelPosition: 'top-right',
      labelBg: 'bg-[#cab9a5]',
      labelTextColor: 'text-white',
      imageSize: 'aspect-[3/4]'
    },
    {
      id: 'wood',
      path: '/components/catalog/WoodPage',
      image: '/images/wood.jpg',
      gridArea: 'wood',
      labelPosition: 'top-right',
      labelBg: 'bg-[#685e54]',
      labelTextColor: 'text-white',
      imageSize: 'aspect-[4/3]'
    },
    {
      id: 'aluminum',
      path: '/components/catalog/AluminumPage',
      image: '/images/aluminum.jpg',
      gridArea: 'aluminum',
      labelPosition: 'top-right',
      labelBg: 'bg-white/80',
      labelTextColor: 'text-[#3e3a36]',
      imageSize: 'aspect-square'
    },
    {
      id: 'marble',
      path: '/components/catalog/MarblePage',
      image: '/images/marble.jpg',
      gridArea: 'marble',
      labelPosition: 'top-right',
      labelBg: 'bg-white/80',
      labelTextColor: 'text-[#3e3a36]',
      imageSize: 'aspect-[4/3]'
    }
  ];

  // دالة لتحديد موقع الـ label
  const getLabelPosition = (position) => {
    switch(position) {
      case 'top-left':
        return '-top-4 left-4';
      case 'top-right':
        return '-top-4 -right-2';
      case 'bottom-left':
        return '-bottom-6 left-2';
      case 'bottom-right':
        return '-bottom-6 right-2';
      case 'bottom-center':
        return '-bottom-6 left-1/2 -translate-x-1/2';
      default:
        return '-bottom-6 left-2';
    }
  };

  // دالة العودة للوحة التحكم
  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  // دالة العودة للصفحة الرئيسية
  const handleBackToHome = () => {
    navigate('/');
  };

  // Animation variants للعناصر
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full overflow-hidden bg-[#fcf9f7] p-4 md:p-6 lg:p-8"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* === DECORATIVE BACKGROUND CIRCLES === */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute w-[40vw] h-[40vw] min-w-[400px] min-h-[400px] bg-[#e9dfd7] rounded-full -right-48 md:-right-96 -top-20 md:-top-40 z-0"
      />
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        className="absolute w-[30vw] h-[30vw] min-w-[300px] min-h-[300px] bg-[#d6ccc2] rounded-full -left-20 md:-left-40 -bottom-16 md:-bottom-32 z-0"
      />
      <div className="absolute w-[20vw] h-[20vw] min-w-[200px] min-h-[200px] bg-[#b7b1a5] rounded-full left-1/4 md:left-1/3 top-20 md:top-10 opacity-20 blur-3xl z-0" />
      <div className="absolute w-[25vw] h-[25vw] min-w-[250px] min-h-[250px] bg-[#c9bcb0] rounded-full right-1/4 bottom-20 opacity-20 blur-2xl z-0" />

      {/* === أزرار العودة === */}
      <div className="relative z-50 flex justify-between items-center mb-4 md:mb-6 top-10">
        {/* زر العودة للوحة التحكم (يظهر فقط للمستخدمين المسجلين) */}
        {userRole && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onClick={handleBackToAdmin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-xs md:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <svg 
              className={`w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-1 ${isRTL ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{content.backToAdmin[language]}</span>
          </motion.button>
        )}

        {/* زر العودة للصفحة الرئيسية (يظهر دائماً) */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onClick={handleBackToHome}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`group flex items-center gap-2 px-3 md:px-4 py-2 bg-white/80 backdrop-blur-sm text-[#4a3f36] rounded-full text-xs md:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 border border-[#4a3f36]/20 ${!userRole ? 'mx-auto' : ''}`}
        >
          <svg 
            className={`w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:-translate-x-1 ${isRTL ? '' : 'rotate-180'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 12l4-4m-4 4l4 4" />
          </svg>
          <span>{content.backToHome[language]}</span>
        </motion.button>
      </div>

      {/* === العنوان الرئيسي === */}
      <div className="relative z-10 mb-8 md:mb-12 lg:mb-16 text-center pt-4 md:pt-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.15em] md:tracking-[0.25em] text-[#4a3f36] font-light uppercase"
          style={{ letterSpacing: isRTL ? 'normal' : '' }}
        >
          {content.title[language]}
        </motion.h1>
      </div>

      {/* === GRID للعناصر === */}
      <motion.div 
        className="relative z-30 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 auto-rows-min">
          
          {/* Paint - مساحة كبيرة */}
          <motion.div 
            variants={itemVariants}
            className="col-span-2 row-span-2 md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-1"
            onHoverStart={() => setHoveredItem('paint')}
            onHoverEnd={() => setHoveredItem(null)}
          >
            <CatalogItem 
              item={catalogItems[0]} 
              language={language} 
              content={content} 
              getLabelPosition={getLabelPosition} 
              isRTL={isRTL}
              isHovered={hoveredItem === 'paint'}
            />
          </motion.div>

          {/* Tiles */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 row-span-1 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1 md:col-start-4 lg:col-start-5 md:row-start-3 lg:row-start-1"
            onHoverStart={() => setHoveredItem('tiles')}
            onHoverEnd={() => setHoveredItem(null)}
          >
            <CatalogItem 
              item={catalogItems[1]} 
              language={language} 
              content={content} 
              getLabelPosition={getLabelPosition} 
              isRTL={isRTL}
              isHovered={hoveredItem === 'tiles'}
            />
          </motion.div>

          {/* Lighting */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 row-span-2 md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-1 md:col-start-4 lg:col-start-5 md:row-start-1"
            onHoverStart={() => setHoveredItem('lighting')}
            onHoverEnd={() => setHoveredItem(null)}
          >
            <CatalogItem 
              item={catalogItems[2]} 
              language={language} 
              content={content} 
              getLabelPosition={getLabelPosition} 
              isRTL={isRTL}
              isHovered={hoveredItem === 'lighting'}
            />
          </motion.div>

          {/* Parquet */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 row-span-1 md:col-span-1 md:row-span- lg:col-span-1 lg:row-span-1 md:col-start-2 lg:col-start-2 md:row-start-3 lg:row-start-1"
            onHoverStart={() => setHoveredItem('parquet')}
            onHoverEnd={() => setHoveredItem(null)}
          >
            <CatalogItem 
              item={catalogItems[3]} 
              language={language} 
              content={content} 
              getLabelPosition={getLabelPosition} 
              isRTL={isRTL}
              isHovered={hoveredItem === 'parquet'}
            />
          </motion.div>

          {/* Gypsum */}
          <motion.div 
            variants={itemVariants}
            className="col-span-2 row-span-1 md:col-span-2 md:row-span-1 lg:col-span-1 lg:row-span-1 md:col-start-2 lg:col-start-4 md:row-start-4 lg:row-start-1"
            onHoverStart={() => setHoveredItem('gypsum')}
            onHoverEnd={() => setHoveredItem(null)}
          >
            <CatalogItem 
              item={catalogItems[4]} 
              language={language} 
              content={content} 
              getLabelPosition={getLabelPosition} 
              isRTL={isRTL}
              isHovered={hoveredItem === 'gypsum'}
            />
          </motion.div>

          {/* Curtains */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 row-span-2 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-2 md:col-start-1 lg:col-start-1 md:row-start-3 lg:row-start-2"
            onHoverStart={() => setHoveredItem('curtains')}
            onHoverEnd={() => setHoveredItem(null)}
          >
            <CatalogItem 
              item={catalogItems[5]} 
              language={language} 
              content={content} 
              getLabelPosition={getLabelPosition} 
              isRTL={isRTL}
              isHovered={hoveredItem === 'curtains'}
            />
          </motion.div>

          {/* Wood */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 row-span-2 md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-1 md:col-start-3 lg:col-start-4 md:row-start-1 lg:row-start-2"
            onHoverStart={() => setHoveredItem('wood')}
            onHoverEnd={() => setHoveredItem(null)}
          >
            <CatalogItem 
              item={catalogItems[6]} 
              language={language} 
              content={content} 
              getLabelPosition={getLabelPosition} 
              isRTL={isRTL}
              isHovered={hoveredItem === 'wood'}
            />
          </motion.div>

          {/* Aluminum */}
          <motion.div 
            variants={itemVariants}
            className="col-span-1 row-span-2 md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-1 md:col-start-2 lg:col-start-2 md:row-start-1 lg:row-start-2"
            onHoverStart={() => setHoveredItem('aluminum')}
            onHoverEnd={() => setHoveredItem(null)}
          >
            <CatalogItem 
              item={catalogItems[7]} 
              language={language} 
              content={content} 
              getLabelPosition={getLabelPosition} 
              isRTL={isRTL}
              isHovered={hoveredItem === 'aluminum'}
            />
          </motion.div>

          {/* Marble */}
          <motion.div 
            variants={itemVariants}
            className="col-span-2 row-span-1 row-start-3 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-3 md:col-start-3 lg:col-start-3 md:row-start-3 lg:row-start-1"
            onHoverStart={() => setHoveredItem('marble')}
            onHoverEnd={() => setHoveredItem(null)}
          >
            <CatalogItem 
              item={catalogItems[8]} 
              language={language} 
              content={content} 
              getLabelPosition={getLabelPosition} 
              isRTL={isRTL}
              isHovered={hoveredItem === 'marble'}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* عناصر زخرفية */}
      <motion.div 
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 0.1, rotate: 12 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute top-20 right-1/4 text-6xl md:text-8xl z-20 text-[#c9bcb0] pointer-events-none"
      >
        ✦
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 0.1, rotate: -12 }}
        transition={{ duration: 1.5, delay: 0.7 }}
        className="absolute bottom-20 left-1/4 text-5xl md:text-7xl z-20 text-[#b7b1a5] pointer-events-none"
      >
        ✧
      </motion.div>

      {/* Overlay شفاف */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20 pointer-events-none z-40" />
    </div>
  );
}

// مكون عنصر الكتالوج
function CatalogItem({ item, language, content, getLabelPosition, isRTL, isHovered }) {
  return (
    <Link to={item.path}>
      <motion.div
        className="relative w-full h-full cursor-pointer group"
        whileHover={{ 
          scale: 1.03,
          transition: { type: "spring", stiffness: 400, damping: 25 }
        }}
        whileTap={{ 
          scale: 0.98,
          transition: { type: "spring", stiffness: 400, damping: 25 }
        }}
        animate={{
          y: isHovered ? -2 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative w-full h-full">
          <motion.img
            src={item.image}
            className={`w-full h-full object-cover rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg md:shadow-xl lg:shadow-2xl ${item.imageSize}`}
            alt={content[item.id][language]}
            whileHover={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              brightness: 1.05,
              transition: { duration: 0.3 }
            }}
          />
          
          <motion.div
            className={`absolute ${getLabelPosition(item.labelPosition)} ${item.labelBg} ${item.labelTextColor} px-2 md:px-3 lg:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs tracking-widest shadow-md backdrop-blur-sm z-10 whitespace-nowrap`}
            animate={{ 
              opacity: 1, 
              y: 0,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ 
              duration: 0.4,
              delay: 0.1,
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
            whileHover={{
              scale: 1.1,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
          >
            {content[item.id][language]}
          </motion.div>

          {/* Overlay effect عند الضغط */}
          <motion.div
            className="absolute inset-0 bg-black/0 rounded-xl md:rounded-2xl lg:rounded-3xl pointer-events-none"
            whileTap={{
              backgroundColor: "rgba(0,0,0,0.1)",
              transition: { duration: 0.1 }
            }}
          />
        </div>
      </motion.div>
    </Link>
  );
}