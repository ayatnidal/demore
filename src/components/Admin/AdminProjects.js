import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useState, useEffect, useCallback } from "react";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { IconTag, IconImage } from "../Icons";

export default function AdminProjects() {
  const { language } = useLanguage();
  const isRTL = language === 'ar';
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب صلاحية المستخدم من localStorage
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  // المحتوى حسب اللغة
  const content = {
    title: {
      ar: "المشاريع",
      en: "Projects"
    },

    backToAdmin: {
      ar: "العودة للوحة التحكم",
      en: "Back to Dashboard"
    },
    backToHome: {
      ar: "العودة للرئيسية",
      en: "Back to Home"
    },
    refresh: {
      ar: "تحديث",
      en: "Refresh"
    },
    area: {
      ar: "المساحة",
      en: "Area"
    },
    location: {
      ar: "الموقع",
      en: "Location"
    },
    year: {
      ar: "السنة",
      en: "Year"
    },
    tags: {
      ar: "الوسوم",
      en: "Tags"
    },
    noTags: {
      ar: "لا توجد وسوم",
      en: "No tags"
    },
    colors: {
      ar: "الألوان",
      en: "Colors"
    },
    viewProject: {
      ar: "عرض التفاصيل",
      en: "View Details"
    },
    active: {
      ar: "نشط",
      en: "Active"
    },
    inactive: {
      ar: "غير نشط",
      en: "Inactive"
    },
    featured: {
      ar: "مميز",
      en: "Featured"
    },
    noProjects: {
      ar: "لا توجد مشاريع",
      en: "No Projects"
    },
    error: {
      ar: "حدث خطأ",
      en: "Error"
    },
    tryAgain: {
      ar: "حاول مرة أخرى",
      en: "Try Again"
    }
  };

  // دالة آمنة لعرض النصوص
  const safeStringify = useCallback((value, fallback = '') => {
    if (value === undefined || value === null) return fallback;
    
    if (typeof value === 'string') {
      if (value === '' || value === '{"en":"","ar":""}' || value === '{}') return fallback;
      return value;
    }
    
    if (typeof value === 'number') return String(value);
    
    if (typeof value === 'object') {
      try {
        // التحقق من الكائن الفارغ
        if (Object.keys(value).length === 0) return fallback;
        
        // التحقق من الكائنات ثنائية اللغة
        if (value.en === '' && value.ar === '') return fallback;
        if (value.en === '' && !value.ar) return fallback;
        if (value.ar === '' && !value.en) return fallback;
        
        // عرض النص حسب اللغة
        if (language === 'ar' && value.ar && value.ar !== '') return value.ar;
        if (language === 'en' && value.en && value.en !== '') return value.en;
        
        // إذا لم تكن هناك ترجمة للغة الحالية
        if (value.ar && value.ar !== '') return value.ar;
        if (value.en && value.en !== '') return value.en;
        
        // محاولة الحصول على أي خاصية نصية
        if (value.title) return safeStringify(value.title, fallback);
        if (value.name) return safeStringify(value.name, fallback);
        
        // تحويل الكائن إلى نص إذا كان يحتوي على خصائص
        const str = JSON.stringify(value);
        if (str === '{}' || str === '{"en":"","ar":""}') return fallback;
        return str.length > 50 ? str.substring(0, 50) + '...' : str;
      } catch (e) {
        return fallback;
      }
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return fallback;
      return value.join(', ');
    }
    
    return String(value);
  }, [language]);

  // جلب المشاريع التي تم إضافتها للإدارة فقط (pageType = "admin")
  const fetchProjects = useCallback(async () => {
    try {
        setLoading(true);
        setError(null);
        
        console.log("جاري جلب المشاريع من Firebase...");
        
        const projectsRef = collection(db, "portfolioProjects");
        
        // قم بإزالة orderBy مؤقتاً حتى يتم إنشاء الفهرس
        const q = query(
        projectsRef, 
        where("pageType", "==", "admin")
        // orderBy("createdAt", "desc")  // علّق هذا السطر مؤقتاً
        );
        
        const querySnapshot = await getDocs(q);
        const projectsData = [];
        
        querySnapshot.forEach((doc) => {
        const data = doc.data();
        projectsData.push({ 
            id: doc.id, 
            ...data,
            createdAt: data.createdAt || new Date()
        });
        });
        
        // قم بالترتيب يدوياً في JavaScript بدلاً من Firestore
        projectsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB - dateA;
        });
        
        console.log(`تم جلب ${projectsData.length} مشروع من نوع admin`);
        setProjects(projectsData);
        
    } catch (error) {
        console.error("خطأ في جلب المشاريع:", error);
        setError(error.message || "حدث خطأ أثناء جلب المشاريع");
    } finally {
        setLoading(false);
    }
  }, []);

  // دالة إعادة تحميل المشاريع يدوياً
  const refreshProjects = useCallback(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // دالة عرض الوسوم
  const renderTags = useCallback((tags) => {
    if (!tags) return null;
    
    if (Array.isArray(tags) && tags.length === 0) return null;
    
    if (typeof tags === 'object' && tags !== null && !Array.isArray(tags)) {
      const arabicTags = tags.ar || [];
      const englishTags = tags.en || [];
      
      if (arabicTags.length === 0 && englishTags.length === 0) return null;
      
      const allTags = [...arabicTags, ...englishTags].slice(0, 4);
      
      return allTags.map((tag, idx) => (
        <span 
          key={`tag-${idx}`} 
          className="bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 text-xs px-2 py-1 rounded-full border border-orange-200"
          title={tag}
        >
          {tag}
        </span>
      ));
    }
    
    if (Array.isArray(tags)) {
      if (tags.length === 0) return null;
      return tags.slice(0, 4).map((tag, idx) => (
        <span 
          key={idx} 
          className="bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 text-xs px-2 py-1 rounded-full border border-orange-200"
          title={tag}
        >
          {tag}
        </span>
      ));
    }
    
    if (typeof tags === 'string') {
      if (tags === '' || tags === '{"en":"","ar":""}' || tags === '[]') return null;
      
      try {
        const parsed = JSON.parse(tags);
        if (Array.isArray(parsed)) {
          if (parsed.length === 0) return null;
          return parsed.slice(0, 4).map((tag, idx) => (
            <span 
              key={idx} 
              className="bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 text-xs px-2 py-1 rounded-full border border-orange-200"
              title={tag}
            >
              {tag}
            </span>
          ));
        }
      } catch (e) {
        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        if (tagsArray.length === 0) return null;
        return tagsArray.slice(0, 4).map((tag, idx) => (
          <span 
            key={idx} 
            className="bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 text-xs px-2 py-1 rounded-full border border-orange-200"
            title={tag}
          >
            {tag}
          </span>
        ));
      }
    }
    
    return null;
  }, []);

  // دالة عرض الألوان - تم إصلاح مشكلة missing dependency
  const renderColors = useCallback((colors) => {
    if (!colors || !Array.isArray(colors) || colors.length === 0) return null;
    
    return (
      <div className="flex items-center mb-4">
        <span className="text-xs text-slate-600 ml-2">{content.colors[language]}:</span>
        <div className="flex gap-2 flex-wrap">
          {colors.slice(0, 6).map((color, idx) => (
            <div 
              key={idx}
              className="w-6 h-6 rounded-full border border-slate-200 shadow-sm transition-transform hover:scale-110 cursor-pointer"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
          {colors.length > 6 && (
            <span className="text-xs text-slate-500 flex items-center">
              +{colors.length - 6}
            </span>
          )}
        </div>
      </div>
    );
  }, [language, content.colors]); // ✅ تم إضافة content.colors إلى مصفوفة الاعتماديات

  // دالة للذهاب لصفحة عرض المشروع
  const handleViewProject = useCallback((projectId) => {
    navigate(`/admin/project-photo/${projectId}`);
  }, [navigate]);

  // العودة للوحة التحكم
  const handleBackToAdmin = useCallback(() => {
    navigate('/admin');
  }, [navigate]);

  // العودة للصفحة الرئيسية
  const handleBackToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Animation variants
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

  // عرض حالة التحميل
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcf9f7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">{isRTL ? "جاري التحميل..." : "Loading..."}</p>
        </div>
      </div>
    );
  }

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

      {/* === أزرار العودة والتحديث === */}
      <div className="relative z-50 flex justify-between items-center mb-4 md:mb-6 top-10">
        <div className="flex gap-3">
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

          {/* زر تحديث المشاريع */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            onClick={refreshProjects}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 px-3 md:px-4 py-2 bg-white/80 backdrop-blur-sm text-[#4a3f36] rounded-full text-xs md:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 border border-[#4a3f36]/20"
          >
            <svg 
              className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:rotate-180" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{content.refresh[language]}</span>
          </motion.button>
        </div>

        {/* زر العودة للصفحة الرئيسية (يظهر دائماً) */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onClick={handleBackToHome}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-2 px-3 md:px-4 py-2 bg-white/80 backdrop-blur-sm text-[#4a3f36] rounded-full text-xs md:text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 border border-[#4a3f36]/20"
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
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-slate-600 mt-4 text-sm md:text-base"
        >
            ({projects.length} {language === 'ar' ? 'مشروع' : 'projects'})
        </motion.p>
      </div>

      {/* === منطقة المحتوى الرئيسية === */}
      <div className="relative z-10 max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        {/* عرض حالة الخطأ */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-red-800">{content.error[language]}</h4>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
              <button
                onClick={refreshProjects}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                {content.tryAgain[language]}
              </button>
            </div>
          </div>
        )}

        {/* عرض المشاريع */}
        {projects.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {projects.map((project) => {
              const projectName = safeStringify(project.projectName || project.title, language === 'ar' ? ' ' : ' ');
              const description = safeStringify(project.briefDescription || project.description, '');
              const mainImage = project.coverImage || project.mainImage || "https://via.placeholder.com/400x250?text=No+Image";
              const area = project.projectArea || project.area || (language === 'ar' ? "غير محدد" : "Not specified");
              const year = project.projectYear || project.year || (language === 'ar' ? "بدون تاريخ" : "No date");
              const location = project.projectLocation || project.location || (language === 'ar' ? "غير محدد" : "Not specified");
              
              return (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group"
                  onClick={() => handleViewProject(project.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={mainImage} 
                      alt={projectName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x250?text=No+Image";
                      }}
                    />
                    
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-wrap gap-2">
                          {project.isFeatured && (
                            <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
                              {content.featured[language]}
                            </span>
                          )}
                          {project.isActive !== false ? (
                            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                              {content.active[language]}
                            </span>
                          ) : (
                            <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-3 py-1 rounded-full shadow-md">
                              {content.inactive[language]}
                            </span>
                          )}
                        </div>
                        <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-xs px-3 py-1 rounded-full font-medium shadow-md">
                          {year}
                        </span>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white font-bold text-lg truncate">
                        {projectName}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {description && (
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                        {description}
                      </p>
                    )}
                    
                    {/* عرض الوسوم */}
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <IconTag className="w-4 h-4 ml-2 text-slate-400" />
                        <span className="text-xs text-slate-600 font-medium">{content.tags[language]}:</span>
                      </div>
                      <div className="flex flex-wrap gap-2 min-h-[28px]">
                        {renderTags(project.tags) || (
                          <span className="text-xs text-slate-400 italic">{content.noTags[language]}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* عرض الألوان */}
                    {renderColors(project.selectedColors)}
                    
                    {/* معلومات المشروع */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-slate-50 rounded-lg p-2.5 transition-colors hover:bg-slate-100">
                        <div className="text-xs text-slate-500 mb-1">{content.area[language]}</div>
                        <div className="text-sm font-medium text-slate-900">
                          {area}
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2.5 transition-colors hover:bg-slate-100">
                        <div className="text-xs text-slate-500 mb-1">{content.location[language]}</div>
                        <div className="text-sm font-medium text-slate-900 truncate" title={location}>
                          {location}
                        </div>
                      </div>
                    </div>
                    
                    {/* زر عرض التفاصيل */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProject(project.id);
                      }}
                      className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                    >
                      {content.viewProject[language]}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <IconImage className="w-20 h-20 mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              {content.noProjects[language]}
            </h3>
            <p className="text-slate-500">
              {language === 'ar' 
                ? 'لم يتم العثور على أي مشاريع من نوع admin' 
                : 'No admin projects found'}
            </p>
            <button
              onClick={refreshProjects}
              className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              {content.tryAgain[language]}
            </button>
          </div>
        )}
      </div>

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
    </div>
  );
}