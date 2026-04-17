// src/contexts/LanguageContext.js
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar');
  const [translations, setTranslations] = useState({});
  const [direction, setDirection] = useState('rtl');

  // 1. أنماط CSS للخطوط باستخدام useMemo لتجنب إعادة الإنشاء
  const fontStyles = useMemo(() => ({
    ar: `
      html[lang="ar"] body {
        font-family: 'Noto Naskh Arabic', serif;
        line-height: 1.85;
        letter-spacing: 0;
      }
      
      html[lang="ar"] h1,
      html[lang="ar"] h2,
      html[lang="ar"] h3,
      html[lang="ar"] h4,
      html[lang="ar"] h5,
      html[lang="ar"] h6 {
        font-family: 'Noto Serif Arabic', serif;
        font-weight: 600;
        line-height: 1.45;
      }
      
      html[lang="ar"] .font-special {
        font-family: 'Noto Naskh Arabic', serif;
        font-weight: 500;
      }
      
      html[lang="ar"] button,
      html[lang="ar"] .btn {
        font-family: 'Noto Naskh Arabic', serif;
        font-weight: 500;
      }
      
      html[lang="ar"] nav a {
        font-family: 'Noto Naskh Arabic', serif;
        font-weight: 500;
      }
    `,
    en: `
      html[lang="en"] body {
        font-family: 'Manrope', sans-serif;
        line-height: 1.7;
        letter-spacing: -0.005em;
      }
      
      html[lang="en"] h1,
      html[lang="en"] h2,
      html[lang="en"] h3,
      html[lang="en"] h4,
      html[lang="en"] h5,
      html[lang="en"] h6 {
        font-family: 'Cormorant Garamond', serif;
        font-weight: 600;
        line-height: 1.15;
        letter-spacing: -0.01em;
      }
      
      html[lang="en"] .font-special {
        font-family: 'Manrope', sans-serif;
        font-weight: 500;
        letter-spacing: -0.005em;
      }
      
      html[lang="en"] button,
      html[lang="en"] .btn {
        font-family: 'Manrope', sans-serif;
        font-weight: 500;
        letter-spacing: 0.02em;
      }
      
      html[lang="en"] nav a {
        font-family: 'Manrope', sans-serif;
        font-weight: 500;
      }
    `
  }), []);

  // 2. دالة لتحميل الترجمات المضمنة مباشرة
  const getBuiltInTranslations = useCallback((lang) => {
    if (lang === 'ar') {
      return {
        nav: {
          home: "الرئيسية",
          about: "عنّا",
          services: "خدماتنا",
          portfolio: "أعمالنا",
          testimonials: "آراء العملاء",
          contact: "اتصل بنا",
          requestQuote: "اطلب عرض سعر",
          adminLogin: "دخول الإدارة"
        },
        testimonials: {
          heroTitle: "آراء عملائنا",
          heroSubtitle: "ثقة عملائنا هي شهادتنا الحقيقية... استمع إلى تجاربهم معنا",
          sectionTitle: "ماذا يقول عملاؤنا؟",
          sectionSubtitle: "تجارب حقيقية من عملاء كرمونا بثقتهم... هذه قصص نجاحنا المشتركة",
          ctaTitle: "انضم إلى عملائنا السعداء",
          ctaSubtitle: "دعنا نبدأ رحلة تحويل مساحتك إلى تحفة فنية تعكس شخصيتك وأسلوبك",
          averageRating: "تقييم متوسط",
          testimonialsCount: "رأي مقدم",
          recommendationRate: "يرشحوننا",
          satisfactionRate: "رضا العملاء",
          shareExperience: "شاركنا تجربتك مع ديمور",
          shareDescription: "آراؤكم تهمنا وتساعد الآخرين في اتخاذ القرار المناسب. شاركنا تجربتك ودع الآخرين يستفيدون من خبرتك.",
          addTestimonial: "أضف رأيك وتجربتك",
          allServices: "جميع الخدمات",
          commercial: "التصميم التجاري",
          generalService: "خدمة عامة",
          loading: "جاري تحميل آراء العملاء...",
          clientInitial: "ك",
          client: "عميل",
          noTestimonials: "لا توجد آراء في هذا القسم",
          noTestimonialsDescription: "لا توجد آراء حالياً في هذا التصنيف. جرب تصنيفاً آخر أو كن أول من يشارك تجربته!",
          beFirst: "كن أول من يشارك تجربته",
          city: "مدينتك",
          cityPlaceholder: "المدينة",
          serviceType: "نوع الخدمة",
          selectService: "اختر نوع الخدمة",
          projectType: "نوع المشروع (اختياري)",
          projectPlaceholder: "مثال: تصميم شقة، ديكور مطبخ...",
          yourRating: "تقييمك",
          outOf5: "من 5 نجوم",
          yourExperience: "رأيك وتجربتك",
          commentPlaceholder: "شاركنا تجربتك مع ديمور...",
          minCharacters: "يجب أن يكون الرأي 10 أحرف على الأقل",
          sending: "جاري الإرسال...",
          submitTestimonial: "إرسال الرأي",
          successMessage: "شكراً لك! تم إرسال رأيك بنجاح وتمت إضافته إلى آراء العملاء.",
          errorMessage: "حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.",
          validationError: "يرجى ملء جميع الحقول الإلزامية بشكل صحيح.",
          commentTooShort: "الرأي يجب أن يكون 10 أحرف على الأقل.",
          startProject: "ابدأ مشروعك الآن",
          viewPortfolio: "شاهد المزيد من الأعمال"
        }
        // ... إضافة بقية الترجمات العربية
      };
    } else {
      return {
        nav: {
          home: "Home",
          about: "About",
          services: "Services",
          portfolio: "Portfolio",
          testimonials: "Testimonials",
          contact: "Contact",
          requestQuote: "Get Quote",
          adminLogin: "Admin Login"
        },
        testimonials: {
          heroTitle: "Our Clients' Reviews",
          heroSubtitle: "Our clients' trust is our true testimony... Listen to their experiences with us",
          sectionTitle: "What Our Clients Say?",
          sectionSubtitle: "Real experiences from clients who honored us with their trust... These are our shared success stories",
          ctaTitle: "Join Our Happy Clients",
          ctaSubtitle: "Let's start the journey of transforming your space into a masterpiece that reflects your personality and style",
          averageRating: "Average Rating",
          testimonialsCount: "Testimonials",
          recommendationRate: "Recommend Us",
          satisfactionRate: "Client Satisfaction",
          shareExperience: "Share Your Experience with DEMORE",
          shareDescription: "Your opinions matter to us and help others make the right decision. Share your experience and let others benefit from your expertise.",
          addTestimonial: "Add Your Review & Experience",
          allServices: "All Services",
          commercial: "Commercial Design",
          generalService: "General Service",
          loading: "Loading client reviews...",
          clientInitial: "C",
          client: "Client",
          noTestimonials: "No reviews in this section",
          noTestimonialsDescription: "There are currently no reviews in this category. Try another category or be the first to share your experience!",
          beFirst: "Be the first to share",
          city: "Your City",
          cityPlaceholder: "City",
          serviceType: "Service Type",
          selectService: "Select Service Type",
          projectType: "Project Type (Optional)",
          projectPlaceholder: "Example: Apartment design, kitchen decor...",
          yourRating: "Your Rating",
          outOf5: "out of 5 stars",
          yourExperience: "Your Opinion & Experience",
          commentPlaceholder: "Share your experience with DEMORE...",
          minCharacters: "Review must be at least 10 characters",
          sending: "Sending...",
          submitTestimonial: "Submit Review",
          successMessage: "Thank you! Your review has been sent successfully and added to client reviews.",
          errorMessage: "An error occurred while sending. Please try again.",
          validationError: "Please fill all required fields correctly.",
          commentTooShort: "Review must be at least 10 characters.",
          startProject: "Start Your Project Now",
          viewPortfolio: "View More Works"
        }
        // ... إضافة بقية الترجمات الإنجليزية
      };
    }
  }, []);

  // 3. تعريف loadTranslations مع إضافة getBuiltInTranslations كاعتمادية
  const loadTranslations = useCallback(async (lang) => {
    try {
      // محاولة جلب الترجمات من ملفات JSON
      const translationModule = await import(`../locales/${lang}.json`);
      setTranslations(translationModule.default);
    } catch (error) {
      console.error('Error loading translations:', error);
      // استخدام الترجمات المضمنة إذا فشل تحميل الملفات
      const builtInTranslations = getBuiltInTranslations(lang);
      setTranslations(builtInTranslations);
    }
  }, [getBuiltInTranslations]);

  // 4. تعريف applyCustomFonts
  const applyCustomFonts = useCallback((lang) => {
    const styleId = 'language-fonts-style';
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = fontStyles[lang];
  }, [fontStyles]);

  // 5. تعريف applyLanguageStyles
  const applyLanguageStyles = useCallback((lang) => {
    // تحديث اتجاه الصفحة وسمة اللغة
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    
    // إضافة فئات الخطوط إلى body
    if (lang === 'ar') {
      document.body.classList.add('rtl', 'arabic-font');
      document.body.classList.remove('ltr', 'english-font');
    } else {
      document.body.classList.add('ltr', 'english-font');
      document.body.classList.remove('rtl', 'arabic-font');
    }
    
    // تطبيق خطوط مخصصة
    applyCustomFonts(lang);
  }, [applyCustomFonts]);

  // 6. استخدام useEffect بعد تعريف جميع الدوال
  useEffect(() => {
    // جلب اللغة من localStorage إذا موجودة
    const savedLanguage = localStorage.getItem('language') || 'ar';
    setLanguage(savedLanguage);
    setDirection(savedLanguage === 'ar' ? 'rtl' : 'ltr');
    loadTranslations(savedLanguage);
    applyLanguageStyles(savedLanguage);
  }, [loadTranslations, applyLanguageStyles]);

  // 7. دوال مساعدة للخطوط
  const getFontClass = useCallback((type = 'body') => {
    const fontClasses = {
      ar: {
        heading: 'font-arabic-heading',
        body: 'font-arabic',
        accent: 'font-arabic-elegant',
        button: 'font-arabic-elegant',
        hero: 'hero-title-ar'
      },
      en: {
        heading: 'font-english-heading',
        body: 'font-english',
        accent: 'font-english-elegant',
        button: 'font-english-elegant',
        hero: 'hero-title-en'
      }
    };
    
    return fontClasses[language]?.[type] || fontClasses.ar[type];
  }, [language]);

  // 8. دالة الترجمة
  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // البحث في الترجمات المضمنة إذا لم توجد في الترجمات المحملة
        const builtInTranslations = getBuiltInTranslations(language);
        let builtInValue = builtInTranslations;
        for (const k2 of keys) {
          builtInValue = builtInValue?.[k2];
          if (builtInValue === undefined) return key;
        }
        return builtInValue || key;
      }
    }
    
    return value || key;
  }, [translations, language, getBuiltInTranslations]);

  // 9. دوال تغيير اللغة
  const changeLanguage = useCallback((lang) => {
    setLanguage(lang);
    setDirection(lang === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('language', lang);
    loadTranslations(lang);
    applyLanguageStyles(lang);
    
    // إرسال حدث لتحديث الخطوط في المكونات الأخرى
    window.dispatchEvent(new Event('languageChange'));
  }, [loadTranslations, applyLanguageStyles]);

  // 10. قيمة context باستخدام useMemo لتحسين الأداء
  const contextValue = useMemo(() => ({
    language,
    direction,
    changeLanguage,
    t,
    getFontClass
  }), [language, direction, changeLanguage, t, getFontClass]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
