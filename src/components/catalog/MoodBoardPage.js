import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useState, useEffect, useCallback } from "react";

export default function MoodBoardPage() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // المحتوى حسب اللغة
  const content = {
    title: {
      ar: "معرض الإلهام",
      en: "Inspiration Gallery"
    },
    subtitle: {
      ar: "استكشف مجموعة من أفكار التصميم الملهمة",
      en: "Explore a collection of inspiring design ideas"
    },
    backToCatalog: {
      ar: "العودة للكتالوج",
      en: "Back to Catalog"
    },
    close: {
      ar: "إغلاق",
      en: "Close"
    }
  };

  useEffect(() => {
    const loadImages = () => {
      const imageList = [];
      for (let i = 1; i <= 11; i++) {
        imageList.push({
          id: i,
          src: `/images/moodboard/moodboard${i}.jpg`,
          alt: `Mood Board ${i}`,
          title: `Mood Board ${i}`
        });
      }
      setImages(imageList);
      setLoading(false);
    };

    loadImages();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  // دالة لفتح الصورة بتكبير
  const openImage = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  // دالة لإغلاق الصورة المكبرة
  const closeImage = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  // دالة للانتقال للصورة التالية
  const nextImage = useCallback(() => {
    if (selectedImage) {
      const currentIndex = images.findIndex(img => img.id === selectedImage.id);
      const nextIndex = (currentIndex + 1) % images.length;
      setSelectedImage(images[nextIndex]);
    }
  }, [selectedImage, images]);

  // دالة للانتقال للصورة السابقة
  const prevImage = useCallback(() => {
    if (selectedImage) {
      const currentIndex = images.findIndex(img => img.id === selectedImage.id);
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      setSelectedImage(images[prevIndex]);
    }
  }, [selectedImage, images]);

  // التعامل مع ضغط键盘
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImage) {
        if (e.key === 'Escape') {
          closeImage();
        } else if (e.key === 'ArrowRight') {
          nextImage();
        } else if (e.key === 'ArrowLeft') {
          prevImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, nextImage, prevImage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcf9f7] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#4a3f36] border-t-transparent"></div>
          <p className="mt-4 text-[#4a3f36]">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen w-full overflow-x-hidden bg-[#fcf9f7] p-4 md:p-6 lg:p-8"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* === DECORATIVE BACKGROUND === */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[40vw] h-[40vw] min-w-[400px] min-h-[400px] bg-[#e9dfd7] rounded-full -right-48 md:-right-96 -top-20 md:-top-40 opacity-50" />
        <div className="absolute w-[30vw] h-[30vw] min-w-[300px] min-h-[300px] bg-[#d6ccc2] rounded-full -left-20 md:-left-40 -bottom-16 md:-bottom-32 opacity-50" />
        <div className="absolute w-[20vw] h-[20vw] min-w-[200px] min-h-[200px] bg-[#b7b1a5] rounded-full left-1/4 top-20 opacity-20 blur-3xl" />
        <div className="absolute w-[25vw] h-[25vw] min-w-[250px] min-h-[250px] bg-[#c9bcb0] rounded-full right-1/4 bottom-20 opacity-20 blur-2xl" />
      </div>

      {/* === زر العودة === */}
      <div className="relative z-20 mb-6 md:mb-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate('/catalog-moodboard')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm text-[#4a3f36] rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 border border-[#4a3f36]/20"
        >
          <svg 
            className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${isRTL ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{content.backToCatalog[language]}</span>
        </motion.button>
      </div>

      {/* === HEADER === */}
      <div className="relative z-10 text-center mb-10 md:mb-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.15em] md:tracking-[0.25em] text-[#4a3f36] font-light uppercase mb-4"
        >
          {content.title[language]}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[#6b5e54] text-sm md:text-base max-w-2xl mx-auto"
        >
          {content.subtitle[language]}
        </motion.p>
      </div>

      {/* === GRID عرض الصور === */}
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              variants={itemVariants}
              custom={index}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              className="group cursor-pointer"
              onClick={() => openImage(image)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300">
                <motion.img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 md:h-72 lg:h-80 object-cover transform transition-transform duration-500 group-hover:scale-110"
                  whileTap={{ scale: 0.98 }}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
                
                {/* Overlay عند الـ hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="bg-white/90 backdrop-blur-sm text-[#4a3f36] px-4 py-2 rounded-full text-sm font-medium"
                  >
                    <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m-3-3h6" />
                    </svg>
                    {language === 'ar' ? 'تكبير' : 'Expand'}
                  </motion.div>
                </div>

                {/* إطار زخرفي */}
                <div className="absolute inset-0 border-2 border-white/20 rounded-2xl pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* === Modal لتكبير الصورة === */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 md:p-8"
            onClick={closeImage}
          >
            {/* زر الإغلاق */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 transition-all duration-300"
              onClick={closeImage}
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* زر السابق */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-4 md:left-8 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 md:p-3 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            {/* زر التالي */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-4 md:right-8 z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 md:p-3 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>

            {/* الصورة المكبرة */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl shadow-2xl"
              />
              
              {/* عنوان الصورة */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm"
              >
                {selectedImage.title}
              </motion.div>
            </motion.div>

            {/* مؤشر رقم الصورة */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs md:text-sm"
            >
              {images.findIndex(img => img.id === selectedImage.id) + 1} / {images.length}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* عناصر زخرفية */}
      <motion.div 
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 0.1, rotate: 12 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute top-20 right-1/4 text-6xl md:text-8xl z-0 text-[#c9bcb0] pointer-events-none"
      >
        ✦
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 0.1, rotate: -12 }}
        transition={{ duration: 1.5, delay: 0.7 }}
        className="absolute bottom-20 left-1/4 text-5xl md:text-7xl z-0 text-[#b7b1a5] pointer-events-none"
      >
        ✧
      </motion.div>
    </div>
  );
}