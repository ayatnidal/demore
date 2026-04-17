// src/pages/About.js - نسخة متجاوبة بالكامل مع جميع أحجام الشاشات
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useLanguage } from "../contexts/LanguageContext";

// Animations Constants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const slideInFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const slideInFromRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// SVG Icons
const IconShield = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const IconStar = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const IconCheck = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IconAward = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const IconHeart = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const IconTarget = () => (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

export default function About() {
  const [aboutContent, setAboutContent] = useState({});
  const [loading, setLoading] = useState(true);
  const { language, direction } = useLanguage();

  // ============== UPDATED: Hero Image with Local Path ==============
  const heroImages = [
    "/images/services_hero3.jpg"
  ];

  const fetchAboutData = useCallback(async () => {
    try {
      setLoading(true);
      const aboutDoc = await getDoc(doc(db, "pageContent", "about"));
      if (aboutDoc.exists()) {
        setAboutContent(aboutDoc.data());
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAboutData();
  }, [fetchAboutData]);

  const getContent = useCallback((content, fallback = "") => {
    if (!content) return fallback;
    
    if (typeof content === 'object') {
      if (language === 'ar' && content.ar) return content.ar;
      if (language === 'en' && content.en) return content.en;
      return content.ar || content.en || fallback;
    }
    
    return content;
  }, [language]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4"
        dir={direction}
      >
        <div className="text-center">
          <div className="relative mb-6 sm:mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-gray-200 rounded-full"></div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-amber-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <h3 className="text-lg sm:text-xl font-light text-gray-600 mb-2 sm:mb-3">
            {language === 'ar' ? "جاري التحميل" : "Loading"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400">
            {language === 'ar' ? "يرجى الانتظار..." : "Please wait..."}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-x-hidden"
      dir={direction}
    >
      
      {/* Hero Section - Responsive with Local Image */}
      <section className="relative h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] overflow-hidden">
        {/* Animated Background Image */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            transition={{
              scale: { duration: 20, ease: "easeInOut", repeat: Infinity }
            }}
          >
            <img
              src={heroImages[0]}
              alt="Architectural Background"
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Bright Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/95"></div>
          
          {/* Subtle Grid */}
          <div className="absolute inset-0 hidden sm:block">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={`grid-h-${i}`}
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200/20 to-transparent"
                style={{ top: `${(i + 1) * 5}%` }}
                animate={{
                  opacity: [0.1, 0.2, 0.1],
                }}
                transition={{
                  duration: 4 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Hero Content - Responsive */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            className="text-center"
          >
            <motion.div
              variants={scaleIn}
              className="mb-12 sm:mb-16"
            >
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-4 sm:mb-6 md:mb-8 leading-tight tracking-tight"
              >
                <span className="block">DEMORE</span>
                <span className="block text-amber-600 text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-2">
                  {language === 'ar' ? "من نحن" : "About Us"}
                </span>
              </motion.h1>
              
              <motion.p
                variants={fadeInUp}
                className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4"
              >
                {getContent(aboutContent.heroSubtitle, 
                  language === 'ar' 
                    ? "شركة متخصصة في التصميم الداخلي والديكور، نتميز بتقديم حلول إبداعية تجمع بين الجمال والوظائفية، مع الحفاظ على أعلى معايير الجودة والاحترافية." 
                    : "A specialized interior design and decoration company, distinguished by providing creative solutions that combine beauty and functionality, while maintaining the highest standards of quality and professionalism."
                )}
              </motion.p>
            </motion.div>
            
            {/* Scroll Indicator - Responsive */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2"
            >
              <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-gray-300 rounded-full flex justify-center">
                <div className="w-1 h-2 sm:h-3 bg-amber-600 rounded-full mt-2"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Our Philosophy Section - Responsive */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-white">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerChildren}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center"
          >
            <motion.div variants={slideInFromLeft} className={`order-2 lg:order-1 ${direction === 'rtl' ? 'lg:text-right' : 'lg:text-left'} text-center lg:text-left`}>
              <motion.span 
                variants={fadeInUp}
                className="inline-block text-amber-600 font-medium text-xs sm:text-sm tracking-wider uppercase mb-3 sm:mb-4"
              >
                {language === 'ar' ? "فلسفتنا" : "Our Philosophy"}
              </motion.span>
              
              <motion.h2 
                variants={fadeInUp}
                className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4 sm:mb-6 leading-tight"
              >
                {language === 'ar' ? "إبداع في كل تفصيل" : "Creativity in Every Detail"}
              </motion.h2>
              
              <motion.div variants={staggerChildren} className="space-y-4 sm:space-y-6">
                <motion.p 
                  variants={fadeInUp}
                  className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed"
                >
                  {language === 'ar' 
                    ? "نؤمن في DEMORE أن التصميم الجيد ليس مجرد مظهر خارجي، بل هو تجربة شاملة تلامس المشاعر وتعزز جودة الحياة. كل مشروع يمثل قصة فريدة ننسجها بتأنٍ وإبداع."
                    : "At DEMORE, we believe that good design is not just an appearance, but a comprehensive experience that touches emotions and enhances quality of life. Each project represents a unique story we weave with care and creativity."
                  }
                </motion.p>
                <motion.p 
                  variants={fadeInUp}
                  className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed"
                >
                  {language === 'ar' 
                    ? "نحن لا نصنع مساحات فقط، بل نخلق بيئات تعكس شخصية أصحابها وتلهمهم يومياً. الجمع بين الجمالية والوظائفية هو جوهر عملنا."
                    : "We don't just create spaces, we craft environments that reflect their owners' personality and inspire them daily. Combining aesthetics with functionality is the essence of our work."
                  }
                </motion.p>
              </motion.div>
            </motion.div>
            
            <motion.div variants={slideInFromRight} className="order-1 lg:order-2">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                <div className="relative bg-white p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-2xl shadow-amber-600/5">
                  <div className="aspect-square rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-50 to-white flex items-center justify-center p-6 sm:p-8 md:p-12 border border-amber-100">
                    <div className="text-center">
                      <h3 className="text-xl sm:text-2xl font-light text-gray-900 mb-3 sm:mb-4">
                        DEMORE
                      </h3>
                      
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision - Responsive Cards */}
      <section className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-b from-amber-50/30 to-white">
        <div className="absolute inset-0 hidden sm:block">
          <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent"></div>
          <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-200 to-transparent"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <motion.span 
              className="inline-block text-amber-600 font-medium text-xs sm:text-sm tracking-wider uppercase mb-3 sm:mb-4"
            >
              {language === 'ar' ? "أساسياتنا" : "Our Foundations"}
            </motion.span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4 sm:mb-6">
              {language === 'ar' ? "الرسالة والرؤية" : "Mission & Vision"}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {/* Mission Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInFromLeft}
              whileHover={{ y: -5, x: -5 }}
              className="group relative"
            >
              <div className="relative bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="p-6 sm:p-8 md:p-10">
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 md:gap-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex-shrink-0 mx-auto sm:mx-0"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-amber-50 rounded-xl sm:rounded-2xl flex items-center justify-center border border-amber-100">
                        <IconTarget />
                      </div>
                    </motion.div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 mb-3 sm:mb-4 md:mb-6">
                        {language === 'ar' ? "رسالتنا" : "Our Mission"}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                        {language === 'ar' 
                          ? "تقديم حلول تصميمية استثنائية تجمع بين الإبداع والوظائفية، مع التركيز على تفاصيل العملاء وتحقيق رؤيتهم بأعلى معايير الجودة والاحترافية."
                          : "Deliver exceptional design solutions that combine creativity with functionality, focusing on client details and realizing their vision with the highest standards of quality and professionalism."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideInFromRight}
              whileHover={{ y: -5, x: 5 }}
              className="group relative"
            >
              <div className="relative bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="p-6 sm:p-8 md:p-10">
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 md:gap-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex-shrink-0 mx-auto sm:mx-0"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-amber-50 rounded-xl sm:rounded-2xl flex items-center justify-center border border-amber-100">
                        <IconStar />
                      </div>
                    </motion.div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 mb-3 sm:mb-4 md:mb-6">
                        {language === 'ar' ? "رؤيتنا" : "Our Vision"}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                        {language === 'ar' 
                          ? "أن نكون المرجع الأول في التصميم الداخلي والديكور في المنطقة، من خلال الابتكار المستمر والتميز في التنفيذ وبناء شراكات طويلة الأمد."
                          : "To be the primary reference in interior design and decoration in the region, through continuous innovation, excellence in execution, and building long-term partnerships."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Responsive Cards */}
      <section className="relative py-16 sm:py-20 md:py-24 bg-white">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <motion.span 
              className="inline-block text-amber-600 font-medium text-xs sm:text-sm tracking-wider uppercase mb-3 sm:mb-4"
            >
              {language === 'ar' ? "مميزاتنا" : "Our Advantages"}
            </motion.span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-3 sm:mb-4 md:mb-6">
              {language === 'ar' ? "لماذا تختار DEMORE؟" : "Why Choose DEMORE?"}
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              {language === 'ar' 
                ? "نحن نقدم تجربة تصميم استثنائية تتميز بالاحترافية والجودة" 
                : "We offer an exceptional design experience characterized by professionalism and quality"}
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
          >
            {[
              {
                icon: <IconAward />,
                title: language === 'ar' ? "تصميم مخصص" : "Custom Design",
                description: language === 'ar' 
                  ? "حلول تصميمية فريدة مصممة خصيصاً لتلائم شخصيتك وتطلعاتك"
                  : "Unique design solutions custom-made to suit your personality and aspirations"
              },
              {
                icon: <IconCheck />,
                title: language === 'ar' ? "جودة عالية" : "High Quality",
                description: language === 'ar' 
                  ? "استخدام أفضل المواد والتقنيات الحديثة لضمان نتائج متميزة"
                  : "Using the best materials and modern techniques to ensure outstanding results"
              },
              {
                icon: <IconHeart />,
                title: language === 'ar' ? "اهتمام بالتفاصيل" : "Attention to Detail",
                description: language === 'ar' 
                  ? "تركيز دقيق على كل التفاصيل لضمان الحصول على نتائج متكاملة"
                  : "Careful focus on every detail to ensure comprehensive results"
              },
              {
                icon: <IconShield />,
                title: language === 'ar' ? "التسليم في الوقت" : "Timely Delivery",
                description: language === 'ar' 
                  ? "التزام تام بالمواعيد المتفق عليها مع متابعة مستمرة للمشروع"
                  : "Full commitment to agreed deadlines with continuous project follow-up"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group relative"
              >
                <div className="relative bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-amber-50 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 border border-amber-100 mx-auto sm:mx-0"
                  >
                    <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-amber-600">
                      {item.icon}
                    </div>
                  </motion.div>
                  <h3 className="text-base sm:text-lg md:text-xl font-light text-gray-900 mb-2 sm:mb-3 md:mb-4 text-center sm:text-left">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed text-center sm:text-left">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Values Section - Responsive */}
      <section className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-amber-50/30 overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16 md:mb-20"
          >
            <motion.span 
              className="inline-block text-amber-600 font-medium text-xs sm:text-sm tracking-wider uppercase mb-3 sm:mb-4"
            >
              {language === 'ar' ? "قيمنا" : "Our Values"}
            </motion.span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4 sm:mb-6">
              {language === 'ar' ? "المبادئ التي ترشدنا" : "Guiding Principles"}
            </h2>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          >
            {[
              {
                symbol: "✓",
                title: language === 'ar' ? "التميز" : "Excellence",
                description: language === 'ar' 
                  ? "نسعى لتحقيق التميز في كل مشروع ننفذه، بتركيز دائم على الجودة والإتقان"
                  : "We strive for excellence in every project we execute, with constant focus on quality and mastery"
              },
              {
                symbol: "↔",
                title: language === 'ar' ? "الشفافية" : "Transparency",
                description: language === 'ar' 
                  ? "علاقات واضحة وصادقة مع عملائنا، مع تواصل مفتوح في كل مراحل المشروع"
                  : "Clear and honest relationships with our clients, with open communication at every project stage"
              },
              {
                symbol: "⚡",
                title: language === 'ar' ? "الابتكار" : "Innovation",
                description: language === 'ar' 
                  ? "تبني أحدث التقنيات والأفكار الإبداعية لتحقيق نتائج متميزة وفريدة"
                  : "Adopting the latest technologies and creative ideas to achieve outstanding and unique results"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="relative bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 text-center border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-amber-50 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 md:mb-8 border border-amber-100"
                  >
                    <span className="text-xl sm:text-2xl text-amber-600">{value.symbol}</span>
                  </motion.div>
                  <h3 className="text-base sm:text-lg md:text-xl font-light text-gray-900 mb-3 sm:mb-4 md:mb-6">
                    {value.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final Section - Responsive */}
      <section className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] overflow-hidden bg-gradient-to-b from-amber-50/30 to-white">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 mb-4 sm:mb-6 md:mb-8 tracking-tight px-4"
            >
              {language === 'ar' 
                ? "نحو مستقبل أكثر إبداعاً" 
                : "Towards a More Creative Future"}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed px-4"
            >
              {language === 'ar' 
                ? 'في DEMORE، نؤمن بأن كل مساحة تحكي قصة، وكل تصميم يعكس شخصية. نحن هنا لنساعدك في تحويل رؤيتك إلى واقع ملموس، بلمسة من الإبداع والاحترافية.'
                : 'At DEMORE, we believe that every space tells a story, and every design reflects a personality. We are here to help you transform your vision into tangible reality, with a touch of creativity and professionalism.'
              }
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-white shadow-lg rounded-xl border border-gray-200 hover:border-amber-600 transition-all duration-500 mx-4"
            >
              <span className="text-lg sm:text-xl md:text-2xl font-light text-gray-900 tracking-wide">DEMORE</span>
              <span className="hidden sm:inline text-gray-300">|</span>
              
            </motion.div>
          </motion.div>
        </div>
        
        {/* Floating Quote - Responsive */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-6 sm:bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 text-center px-4"
        >
          <p className="text-xs sm:text-sm text-gray-400 font-light tracking-widest uppercase">
            {language === 'ar' ? "التصميم هو الفن الذي يجعل الحياة أكثر جمالاً" : "Design is the art that makes life more beautiful"}
          </p>
        </motion.div>
      </section>

      {/* Custom Styles */}
      <style jsx="true">{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        
        /* Selection Color */
        ::selection {
          background: #f59e0b20;
          color: #1f2937;
        }
        
        /* Smooth Scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Responsive Text Adjustments */
        @media (max-width: 640px) {
          h1, h2, h3 {
            word-break: break-word;
          }
        }

        /* Better Touch Targets for Mobile */
        @media (max-width: 768px) {
          button, a, [role="button"] {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>
    </motion.div>
  );
}