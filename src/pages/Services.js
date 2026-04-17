// src/pages/Services.js
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef, memo, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, addDoc } from "firebase/firestore";
import { useLanguage } from "../contexts/LanguageContext";
import WatermarkedImage from "../components/WatermarkedImage";

// Custom Icons Components with Motion
const SearchIcon = () => (
  <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const StarIcon = ({ filled = false }) => (
  <svg className={`w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${filled ? 'text-amber-500' : 'text-gray-400'}`} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SuccessIcon = () => (
  <svg className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SparkleIcon = () => (
  <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 448 512">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
  </svg>
);

const EmailIcon = () => (
  <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const ChevronIcon = ({ isExpanded }) => (
  <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
    <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
);

// Animations Constants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Main Services Categories
const mainServiceCategories = [
  { 
    id: "all", 
    name: { ar: "الكل", en: "All" },
    color: "from-orange-400 to-orange-600"
  },
  { 
    id: "supervision", 
    name: { ar: "إشراف", en: "Supervision" },
    color: "from-orange-400 to-orange-600"
  },
  { 
    id: "consultation", 
    name: { ar: "استشارات", en: "Consultations" },
    color: "from-orange-400 to-orange-600"
  },
  { 
    id: "interior", 
    name: { ar: "تصميم داخلي", en: "Interior Design" },
    color: "from-orange-400 to-orange-600"
  },
  { 
    id: "exterior", 
    name: { ar: "تصميم خارجي", en: "Exterior Design" },
    color: "from-orange-400 to-orange-600"
  },
  { 
    id: "landscape", 
    name: { ar: "تنسيق حدائق", en: "Landscape" },
    color: "from-orange-400 to-orange-600"
  }
];

// Service Features
const serviceFeatures = {
  supervision: {
    ar: [
      "متابعة يومية للتنفيذ",
      "مراقبة الجودة",
      "ضبط الجداول الزمنية",
      "التنسيق مع المقاولين",
      "تقارير أسبوعية مفصلة",
      "حل المشكلات التنفيذية"
    ],
    en: [
      "Daily execution follow-up",
      "Quality control",
      "Timeline management",
      "Contractor coordination",
      "Detailed weekly reports",
      "Executive problem-solving"
    ]
  },
  consultation: {
    ar: [
      "استشارات متخصصة",
      "دراسات جدوى",
      "تقييم المشاريع",
      "حلول هندسية مبتكرة",
      "تخطيط المساحات",
      "تحسين الأداء الوظيفي"
    ],
    en: [
      "Specialized consultations",
      "Feasibility studies",
      "Project evaluation",
      "Innovative engineering solutions",
      "Space planning",
      "Functional performance improvement"
    ]
  },
  interior: {
    ar: [
      "تصميم الأثاث حسب الطلب",
      "اختيار الأقمشة والمواد",
      "تصميم الإضاءة الداخلية",
      "توزيع الفراغات",
      "ديكورات جبسية",
      "أرضيات وجدران فاخرة"
    ],
    en: [
      "Custom furniture design",
      "Fabric and material selection",
      "Interior lighting design",
      "Space distribution",
      "Gypsum decorations",
      "Luxury floors and walls"
    ]
  },
  exterior: {
    ar: [
      "تصميم واجهات خارجية",
      "تشطيبات خارجية فاخرة",
      "إضاءة خارجية معمارية",
      "تصميم المداخل الرئيسية",
      "أسوار وبوابات",
      "ممرات ومساحات خارجية"
    ],
    en: [
      "Exterior facade design",
      "Luxury exterior finishes",
      "Architectural exterior lighting",
      "Main entrance design",
      "Fences and gates",
      "Walkways and outdoor spaces"
    ]
  },
  landscape: {
    ar: [
      "تصميم حدائق ومناظر طبيعية",
      "نوافير وبرك مائية",
      "أنظمة ري ذكية",
      "إضاءة خارجية للحدائق",
      "ممرات حدائق",
      "نباتات وأشجار مختارة"
    ],
    en: [
      "Garden and landscape design",
      "Fountains and water features",
      "Smart irrigation systems",
      "Garden exterior lighting",
      "Garden pathways",
      "Selected plants and trees"
    ]
  }
};

// Service Includes
const serviceIncludes = {
  supervision: {
    ar: [
      "زيارات ميدانية منتظمة",
      "تقارير مراقبة الجودة",
      "متابعة الجداول الزمنية",
      "التنسيق مع المقاولين",
      "تقرير نهائي شامل"
    ],
    en: [
      "Regular site visits",
      "Quality control reports",
      "Timeline follow-up",
      "Contractor coordination",
      "Comprehensive final report"
    ]
  },
  consultation: {
    ar: [
      "جلسات استشارية",
      "تقارير وتوصيات",
      "مراجعة التصاميم",
      "حلول مقترحة",
      "متابعة الاستشارة"
    ],
    en: [
      "Consultation sessions",
      "Reports and recommendations",
      "Design review",
      "Proposed solutions",
      "Consultation follow-up"
    ]
  },
  interior: {
    ar: [
      "مخططات تنفيذية داخلية",
      "تصاميم ثلاثية الأبعاد",
      "اختيار الأثاث",
      "تشطيبات داخلية",
      "إكسسوارات وديكور"
    ],
    en: [
      "Interior execution plans",
      "3D designs",
      "Furniture selection",
      "Interior finishes",
      "Accessories and decor"
    ]
  },
  exterior: {
    ar: [
      "مخططات واجهات",
      "تصاميم ثلاثية الأبعاد",
      "تشطيبات خارجية",
      "إضاءة خارجية",
      "عناصر معمارية"
    ],
    en: [
      "Facade plans",
      "3D designs",
      "Exterior finishes",
      "Exterior lighting",
      "Architectural elements"
    ]
  },
  landscape: {
    ar: [
      "مخططات زراعية",
      "تصاميم ثلاثية الأبعاد",
      "أنظمة الري",
      "إضاءة خارجية",
      "ممرات وتنسيق"
    ],
    en: [
      "Landscape plans",
      "3D designs",
      "Irrigation systems",
      "Exterior lighting",
      "Pathways and landscaping"
    ]
  }
};

// Default service data
const defaultServices = [
  {
    id: "supervision-service",
    category: "supervision",
    title: {
      ar: "الإشراف التنفيذي",
      en: "Executive Supervision"
    },
    shortDescription: {
      ar: "إشراف كامل على تنفيذ المشاريع لضمان الجودة والدقة",
      en: "Full supervision of project execution to ensure quality and accuracy"
    },
    fullDescription: {
      ar: "خدمات إشراف تنفيذي متكاملة نضمن من خلالها تنفيذ المشروع وفق أعلى المعايير والمواصفات، مع متابعة يومية وتقارير دورية لضمان الجودة.",
      en: "Integrated executive supervision services ensuring project execution according to the highest standards and specifications, with daily follow-up and regular reports to ensure quality."
    },
    mainImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    order: 1
  },
  {
    id: "consultation-service",
    category: "consultation",
    title: {
      ar: "استشارات هندسية متخصصة",
      en: "Specialized Engineering Consultations"
    },
    shortDescription: {
      ar: "استشارات احترافية لحلول مبتكرة وتحديات المشاريع",
      en: "Professional consultations for innovative solutions and project challenges"
    },
    fullDescription: {
      ar: "نقدم استشارات هندسية متخصصة تغطي مختلف جوانب المشاريع، من دراسات الجدوى إلى التصاميم التفصيلية، لضمان نجاح مشروعك وتحقيق أهدافك.",
      en: "We offer specialized engineering consultations covering various aspects of projects, from feasibility studies to detailed designs, ensuring your project's success and goal achievement."
    },
    mainImage: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    order: 2
  },
  {
    id: "interior-service",
    category: "interior",
    title: {
      ar: "تصميم داخلي",
      en: "Interior Design"
    },
    shortDescription: {
      ar: "تصميم داخلي أنيق وعصري يناسب ذوقك وأسلوب حياتك",
      en: "Elegant and modern interior design that suits your taste and lifestyle"
    },
    fullDescription: {
      ar: "نصمم مساحات داخلية تعكس شخصيتك وتلبي احتياجاتك، مع اختيار دقيق للألوان والخامات والأثاث لخلق بيئة مريحة وجميلة.",
      en: "We design interior spaces that reflect your personality and meet your needs, with careful selection of colors, materials, and furniture to create a comfortable and beautiful environment."
    },
    mainImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    order: 3
  },
  {
    id: "exterior-service",
    category: "exterior",
    title: {
      ar: "تصميم خارجي",
      en: "Exterior Design"
    },
    shortDescription: {
      ar: "تصميم واجهات خارجية جذابة تعكس هوية المبنى",
      en: "Attractive exterior facade design reflecting the building's identity"
    },
    fullDescription: {
      ar: "نصمم واجهات خارجية متميزة تجمع بين الجمال والوظيفة، باستخدام أفضل المواد وأحدث الأساليب المعمارية لخلق انطباع أولي لا يُنسى.",
      en: "We design distinctive exterior facades combining beauty and function, using the best materials and latest architectural methods to create an unforgettable first impression."
    },
    mainImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    order: 4
  },
  {
    id: "landscape-service",
    category: "landscape",
    title: {
      ar: "تنسيق حدائق",
      en: "Landscape Design"
    },
    shortDescription: {
      ar: "تصميم حدائق ومناظر طبيعية تتناغم مع الطبيعة وتخلق مساحات خارجية مريحة",
      en: "Garden and landscape design harmonizing with nature and creating comfortable outdoor spaces"
    },
    fullDescription: {
      ar: "نصمم حدائق ومناظر طبيعية تجمع بين الجمال والاستدامة، مع اختيار دقيق للنباتات والمواد لخلق مساحات خارجية مريحة وجذابة.",
      en: "We design gardens and landscapes combining beauty and sustainability, with careful selection of plants and materials to create comfortable and attractive outdoor spaces."
    },
    mainImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    order: 5
  }
];

// ============== Search Component ==============
const SearchComponent = memo(({ 
  searchTerm, 
  onSearch, 
  onClear, 
  language, 
  placeholder,
  showClear = true 
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  const handleSearchChange = (value) => {
    setLocalSearch(value);
    
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = setTimeout(() => {
      onSearch(value);
    }, 300);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    onSearch('');
    onClear?.();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClearSearch();
    }
    if (e.key === 'Enter') {
      onSearch(localSearch);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className={`absolute ${language === 'ar' ? 'left-2 xs:left-3 sm:left-4' : 'right-2 xs:right-3 sm:right-4'} top-1/2 -translate-y-1/2 pointer-events-none`}>
          <SearchIcon />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || (language === 'ar' ? 'ابحث في الخدمات...' : 'Search services...')}
          className={`w-full ${language === 'ar' ? 'pr-3 xs:pr-4 pl-8 xs:pl-10 sm:pl-12' : 'pl-3 xs:pl-4 pr-8 xs:pr-10 sm:pr-12'} py-2 xs:py-2.5 sm:py-3 md:py-4 bg-white border-2 border-gray-200 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all duration-300 text-xs xs:text-sm sm:text-base md:text-lg text-gray-900 placeholder-gray-500 outline-none`}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />
        
        
      </div>
    </div>
  );
});

SearchComponent.displayName = 'SearchComponent';

// Service Request Modal Component
const ServiceRequestModal = memo(({ service, language, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    contactMethod: 'whatsapp',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = language === 'ar' ? 'الاسم مطلوب' : 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = language === 'ar' ? 'رقم الهاتف مطلوب' : 'Phone number is required';
    } else if (!/^[+]?[0-9\s\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = language === 'ar' ? 'رقم هاتف غير صالح' : 'Invalid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const serviceRequest = {
        serviceId: service.id,
        serviceName: service.title?.[language] || service.title?.ar || "خدمة",
        category: service.category,
        customerName: formData.name,
        customerPhone: formData.phone,
        contactMethod: formData.contactMethod,
        message: formData.message || '',
        status: 'pending',
        timestamp: new Date(),
        language: language,
        viewed: false
      };
      
      await addDoc(collection(db, "service-requests"), serviceRequest);
      
      setSubmitSuccess(true);
      
      setTimeout(() => {
        onSubmit();
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting service request:", error);
      setErrors({ 
        submit: language === 'ar' 
          ? 'حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.' 
          : 'Error submitting request. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  if (submitSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-2 xs:p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 25 }}
          className="bg-white rounded-xl xs:rounded-2xl max-w-[90%] xs:max-w-sm sm:max-w-md w-full p-4 xs:p-5 sm:p-6 md:p-8 shadow-2xl border border-gray-100 mx-2 xs:mx-3 sm:mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-amber-50 to-amber-100 rounded-full flex items-center justify-center mb-3 xs:mb-4 sm:mb-5 md:mb-6 border border-amber-200"
            >
              <SuccessIcon />
            </motion.div>
            
            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-base xs:text-lg sm:text-xl md:text-2xl font-light text-gray-900 mb-1 xs:mb-2 sm:mb-3"
            >
              {language === 'ar' ? 'تم استلام طلبك' : 'Request Received'}
            </motion.h3>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs xs:text-sm sm:text-base text-gray-600 mb-3 xs:mb-4 sm:mb-5 md:mb-6"
            >
              {language === 'ar' 
                ? `شكراً لك ${formData.name}، سنتواصل معك قريباً`
                : `Thank you ${formData.name}, we'll contact you soon`
              }
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full bg-gray-50 rounded-lg xs:rounded-xl p-2 xs:p-3 sm:p-4 mb-3 xs:mb-4 sm:mb-5 md:mb-6 border border-gray-200"
            >
              <div className="text-2xs xs:text-xs sm:text-sm text-gray-500 mb-0.5 xs:mb-1 sm:mb-2">
                {language === 'ar' ? 'الخدمة المطلوبة' : 'Requested Service'}
              </div>
              <div className="text-xs xs:text-sm sm:text-base font-semibold text-gray-900 break-words">
                {service.title?.[language] || service.title?.ar || (language === 'ar' ? "خدمة" : "Service")}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 xs:p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        ref={modalRef}
        className="bg-white rounded-xl xs:rounded-2xl max-w-[95%] xs:max-w-md sm:max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden max-h-[95vh] xs:max-h-[90vh] overflow-y-auto mx-2 xs:mx-3 sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 p-3 xs:p-4 sm:p-5 md:p-6 flex items-center justify-between z-10">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm xs:text-base sm:text-lg md:text-xl font-light text-gray-900 truncate">
              {language === 'ar' ? 'طلب الخدمة' : 'Service Request'}
            </h3>
            <p className="text-2xs xs:text-xs sm:text-sm text-gray-500 mt-0.5 xs:mt-1 truncate">
              {service.title?.[language] || service.title?.ar}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 xs:p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2 xs:ml-3 sm:ml-4"
          >
            <CloseIcon />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-3 xs:p-4 sm:p-5 md:p-6">
          <div className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6">
            <div>
              <label className="block text-2xs xs:text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 xs:mb-1.5 sm:mb-2">
                {language === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 md:py-3 bg-gray-50 border ${errors.name ? 'border-red-300' : 'border-gray-200'} rounded-lg xs:rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-xs xs:text-sm sm:text-base text-gray-900 placeholder-gray-500`}
                placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
              />
              {errors.name && (
                <p className="mt-1 text-2xs xs:text-xs sm:text-sm text-red-500">
                  {errors.name}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-2xs xs:text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 xs:mb-1.5 sm:mb-2">
                {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 md:py-3 bg-gray-50 border ${errors.phone ? 'border-red-300' : 'border-gray-200'} rounded-lg xs:rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-xs xs:text-sm sm:text-base text-gray-900 placeholder-gray-500`}
                placeholder={language === 'ar' ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
              />
              {errors.phone && (
                <p className="mt-1 text-2xs xs:text-xs sm:text-sm text-red-500">
                  {errors.phone}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-2xs xs:text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1.5 xs:mb-2 sm:mb-2.5 md:mb-3">
                {language === 'ar' ? 'طريقة التواصل المفضلة' : 'Preferred Contact Method'} *
              </label>
              <div className="grid grid-cols-2 gap-1.5 xs:gap-2 sm:gap-3">
                <label className="relative">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="whatsapp"
                    checked={formData.contactMethod === 'whatsapp'}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className={`
                    flex items-center justify-center p-1.5 xs:p-2 sm:p-3 md:p-4 rounded-lg xs:rounded-xl border-2 cursor-pointer transition-all duration-300
                    peer-checked:border-green-500 peer-checked:bg-green-50
                    border-gray-200 hover:border-gray-300
                  `}>
                    <WhatsAppIcon className={`w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${formData.contactMethod === 'whatsapp' ? 'text-green-600' : 'text-gray-500'} ${language === 'ar' ? 'ml-1 xs:ml-1.5 sm:ml-2' : 'mr-1 xs:mr-1.5 sm:mr-2'}`} />
                    <span className={`text-2xs xs:text-xs sm:text-sm md:text-base font-medium ${formData.contactMethod === 'whatsapp' ? 'text-green-600' : 'text-gray-700'}`}>
                      {language === 'ar' ? 'واتساب' : 'WhatsApp'}
                    </span>
                  </div>
                </label>
                
                <label className="relative">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="phone"
                    checked={formData.contactMethod === 'phone'}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className={`
                    flex items-center justify-center p-1.5 xs:p-2 sm:p-3 md:p-4 rounded-lg xs:rounded-xl border-2 cursor-pointer transition-all duration-300
                    peer-checked:border-blue-500 peer-checked:bg-blue-50
                    border-gray-200 hover:border-gray-300
                  `}>
                    <PhoneIcon className={`w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${formData.contactMethod === 'phone' ? 'text-blue-600' : 'text-gray-500'} ${language === 'ar' ? 'ml-1 xs:ml-1.5 sm:ml-2' : 'mr-1 xs:mr-1.5 sm:mr-2'}`} />
                    <span className={`text-2xs xs:text-xs sm:text-sm md:text-base font-medium ${formData.contactMethod === 'phone' ? 'text-blue-600' : 'text-gray-700'}`}>
                      {language === 'ar' ? 'اتصال' : 'Phone Call'}
                    </span>
                  </div>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-2xs xs:text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 xs:mb-1.5 sm:mb-2">
                {language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                className="w-full px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-2.5 md:py-3 bg-gray-50 border border-gray-200 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-300 text-xs xs:text-sm sm:text-base text-gray-900 placeholder-gray-500 resize-none"
                placeholder={language === 'ar' ? 'أي ملاحظات إضافية...' : 'Any additional notes...'}
              />
            </div>
            
            {errors.submit && (
              <div className="p-2 xs:p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg xs:rounded-xl">
                <p className="text-2xs xs:text-xs sm:text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 xs:mt-5 sm:mt-6 md:mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg xs:rounded-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg xs:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 w-full py-2 xs:py-2.5 sm:py-3 md:py-4 rounded-lg xs:rounded-xl flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 text-white text-xs xs:text-sm sm:text-base md:text-lg font-medium">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                  </>
                ) : (
                  language === 'ar' ? 'إرسال الطلب' : 'Submit Request'
                )}
              </div>
            </button>
            
            <p className="text-center text-2xs xs:text-xs sm:text-sm text-gray-500 mt-2 xs:mt-2.5 sm:mt-3 md:mt-4">
              {language === 'ar' 
                ? 'سنرد على طلبك خلال 24 ساعة عمل'
                : 'We\'ll respond to your request within 24 working hours'
              }
            </p>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
});

ServiceRequestModal.displayName = 'ServiceRequestModal';

// Category Pills Component
const CategoryPills = memo(({ categories, activeCategory, onCategoryChange, language }) => {
  const scrollContainerRef = useRef(null);
  const { direction } = useLanguage();

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e) => {
      e.preventDefault();
      scrollContainer.scrollLeft += e.deltaY * 2;
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    return () => scrollContainer.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div 
      ref={scrollContainerRef}
      className="flex overflow-x-auto scrollbar-hide gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 pb-1 xs:pb-1.5 sm:pb-2 md:pb-3 -mb-1 xs:-mb-1.5 sm:-mb-2 md:-mb-3 px-0.5 xs:px-1"
      dir={direction}
    >
      {categories.map(category => {
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`relative flex-shrink-0 px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-1 xs:py-1.5 sm:py-2 md:py-2.5 lg:py-3 rounded-full text-2xs xs:text-xs sm:text-sm md:text-base font-medium transition-all duration-300 whitespace-nowrap ${
              isActive 
                ? `bg-gradient-to-r ${category.color} text-white shadow-lg` 
                : 'bg-white/80 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span className="flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2">
              {category.name[language]}
              {isActive && (
                <SparkleIcon className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5" />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
});

CategoryPills.displayName = 'CategoryPills';

// Service Card Component with WatermarkedImage
const ServiceCard = memo(({ service, onCardClick, onRequestClick, language }) => {
  const [, setIsHovered] = useState(false);

  const category = mainServiceCategories.find(cat => cat.id === service.category) || mainServiceCategories[0];

  const handleCardClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    onCardClick(service);
  }, [service, onCardClick]);

  const handleRequestClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    onRequestClick(service);
  }, [service, onRequestClick]);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={fadeInUp}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-lg xs:rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
        <div
          className="relative h-36 xs:h-44 sm:h-48 md:h-56 lg:h-64 cursor-pointer overflow-hidden"
          onClick={handleCardClick}
        >
          <WatermarkedImage 
            src={service.mainImage || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"}
            alt={service.title?.[language] || service.title?.ar}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            mode="centered-bottom"
            watermarkText="DEMORE"
            opacity={0.2}
            preserveAspectRatio={true}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="absolute top-1.5 xs:top-2 sm:top-2.5 md:top-3 right-1.5 xs:right-2 sm:right-2.5 md:right-3">
            <span className={`inline-flex items-center px-1.5 xs:px-2 sm:px-2.5 md:px-3 py-0.5 xs:py-1 sm:py-1 md:py-1.5 bg-gradient-to-r ${category.color} text-white rounded-full text-2xs xs:text-xs sm:text-xs md:text-sm font-medium shadow-lg`}>
              {category.name[language]}
            </span>
          </div>
          
          {service.isFeatured && (
            <div className="absolute top-1.5 xs:top-2 sm:top-2.5 md:top-3 left-1.5 xs:left-2 sm:left-2.5 md:left-3 ">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-1.5 xs:px-2 sm:px-2.5 md:px-3 py-0.5 xs:py-1 sm:py-1 md:py-1.5 rounded-full text-2xs xs:text-xs sm:text-xs md:text-sm font-bold shadow-lg flex items-center gap-0.5 xs:gap-1">
                <StarIcon filled={true} className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
                <span className="hidden xs:inline">{language === 'ar' ? 'مميز' : 'Featured'}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 flex-grow flex flex-col">
          <h3 
            className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-light text-gray-900 mb-1 xs:mb-1.5 sm:mb-2 cursor-pointer hover:text-gray-800 transition-colors line-clamp-2"
            onClick={handleCardClick}
          >
            {service.title?.[language] || service.title?.ar}
          </h3>
          
          <p className="text-2xs xs:text-xs sm:text-sm md:text-sm lg:text-base text-gray-600 mb-2 xs:mb-2.5 sm:mb-3 md:mb-4 line-clamp-2 flex-grow">
            {service.shortDescription?.[language] || service.shortDescription?.ar}
          </p>
          
          {/* Features Preview */}
          <div className="mb-2 xs:mb-2.5 sm:mb-3 md:mb-4">
            <div className="flex flex-wrap gap-0.5 xs:gap-1 sm:gap-1.5 md:gap-2">
              {(serviceFeatures[service.category]?.[language] || serviceFeatures[service.category]?.ar || []).slice(0, 2).map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-1 xs:px-1.5 sm:px-2 py-0.25 xs:py-0.5 sm:py-1 bg-gray-50 text-gray-600 rounded-lg text-2xs xs:text-xs sm:text-xs border border-gray-200"
                >
                  <CheckIcon className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 ml-0.5 xs:ml-1 text-amber-600" />
                  <span className="hidden xs:inline">{feature.length > 10 ? feature.substring(0, 10) + '...' : feature}</span>
                  <span className="xs:hidden">{feature.length > 8 ? feature.substring(0, 8) + '...' : feature}</span>
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex gap-1 xs:gap-1.5 sm:gap-2 mt-auto">
            <button
              onClick={handleCardClick}
              className="flex-1 px-1 xs:px-1.5 sm:px-2 md:px-3 py-1 xs:py-1.5 sm:py-2 md:py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 text-2xs xs:text-xs sm:text-sm md:text-sm font-medium group"
            >
              <span className="flex items-center justify-center gap-0.5 xs:gap-1">
                {language === 'ar' ? 'التفاصيل' : 'Details'}
                <ArrowIcon className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <button
              onClick={handleRequestClick}
              className="flex-1 px-1 xs:px-1.5 sm:px-2 md:px-3 py-1 xs:py-1.5 sm:py-2 md:py-2.5 bg-gradient-to-r from-orange-700 to-orange-400 text-white rounded-lg hover:from-orange-800 hover:to-orange-700 transition-all duration-300 text-2xs xs:text-xs sm:text-sm md:text-sm font-medium shadow-md hover:shadow-lg relative overflow-hidden group"
            >
              <span className="flex items-center justify-center gap-0.5 xs:gap-1">
                {language === 'ar' ? 'طلب' : 'Request'}
                <ArrowIcon className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 group-hover:rotate-90 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';

// Service Detail Modal Component with WatermarkedImage
const ServiceDetailModal = memo(({ service, language, onClose, onRequestClick }) => {
  const modalRef = useRef(null);

  const getCategoryName = (categoryId) => {
    const category = mainServiceCategories.find(cat => cat.id === categoryId);
    return category ? category.name[language] : categoryId;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  if (!service) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-2 xs:p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        ref={modalRef}
        className="bg-white rounded-xl xs:rounded-2xl w-full max-w-[95%] xs:max-w-3xl sm:max-w-4xl shadow-2xl max-h-[95vh] xs:max-h-[90vh] overflow-y-auto mx-2 xs:mx-3 sm:mx-4 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 p-3 xs:p-4 sm:p-5 md:p-6 flex items-center justify-between z-10">
          <h2 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-900 truncate pr-2 xs:pr-3 sm:pr-4">
            {service.title?.[language] || service.title?.ar}
          </h2>
          <button
            onClick={onClose}
            className="p-1 xs:p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 ml-2 xs:ml-3 sm:ml-4"
          >
            <CloseIcon />
          </button>
        </div>
        
        <div className="p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8">
          <div className="relative h-32 xs:h-40 sm:h-48 md:h-56 lg:h-64 xl:h-80 bg-gray-100 rounded-lg xs:rounded-xl sm:rounded-2xl overflow-hidden mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8">
            <WatermarkedImage 
              src={service.mainImage || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80"}
              alt={service.title?.[language] || service.title?.ar}
              className="w-full h-full object-cover"
              mode="centered-bottom"
              watermarkText="DEMORE"
              opacity={0.2}
              preserveAspectRatio={true}
            />
            
            <div className="absolute top-2 xs:top-2.5 sm:top-3 left-2 xs:left-2.5 sm:left-3">
              <span className="bg-white/90 backdrop-blur-sm px-2 xs:px-2.5 sm:px-3 md:px-4 py-1 xs:py-1.5 sm:py-2 rounded-lg xs:rounded-xl text-2xs xs:text-xs sm:text-sm md:text-base font-medium shadow-sm text-gray-900 border border-gray-200">
                {getCategoryName(service.category)}
              </span>
            </div>
          </div>
          
          <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8 lg:mb-12">
            <h3 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-light text-gray-900 mb-2 xs:mb-2.5 sm:mb-3 md:mb-4 pb-1 xs:pb-1.5 sm:pb-2 border-b border-gray-200">
              {language === 'ar' ? 'الوصف التفصيلي' : 'Detailed Description'}
            </h3>
            <p className="text-2xs xs:text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
              {service.fullDescription?.[language] || service.fullDescription?.ar || service.shortDescription?.[language] || service.shortDescription?.ar}
            </p>
          </div>
          
          {/* Features Section */}
          {serviceFeatures[service.category] && (
            <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8 lg:mb-12">
              <h3 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-light text-gray-900 mb-2 xs:mb-2.5 sm:mb-3 md:mb-4 pb-1 xs:pb-1.5 sm:pb-2 border-b border-gray-200">
                {language === 'ar' ? 'المميزات الرئيسية' : 'Key Features'}
              </h3>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3">
                {(serviceFeatures[service.category][language] || serviceFeatures[service.category].ar).map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start p-1.5 xs:p-2 sm:p-2.5 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all border border-gray-200"
                  >
                    <CheckIcon className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-amber-600 mt-0.5 ml-1 xs:ml-1.5 sm:ml-2 flex-shrink-0" />
                    <span className="text-2xs xs:text-xs sm:text-sm md:text-sm lg:text-base text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* What's Included Section */}
          {serviceIncludes[service.category] && (
            <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8 lg:mb-12">
              <h3 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-light text-gray-900 mb-2 xs:mb-2.5 sm:mb-3 md:mb-4 pb-1 xs:pb-1.5 sm:pb-2 border-b border-gray-200">
                {language === 'ar' ? 'ما يشمل' : 'What\'s Included'}
              </h3>
              <ul className="space-y-1 xs:space-y-1.5 sm:space-y-2">
                {(serviceIncludes[service.category][language] || serviceIncludes[service.category].ar).map((item, index) => (
                  <li key={index} className="flex items-start group">
                    <div className="w-1 h-1 xs:w-1.5 xs:h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full mt-1 xs:mt-1.5 sm:mt-2 ml-1.5 xs:ml-2 sm:ml-2.5 md:ml-3 flex-shrink-0"></div>
                    <span className="text-2xs xs:text-xs sm:text-sm md:text-sm lg:text-base text-gray-600 group-hover:text-gray-900 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});

ServiceDetailModal.displayName = 'ServiceDetailModal';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const { language, direction } = useLanguage();
  const navigate = useNavigate();
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [showContactOptions, setShowContactOptions] = useState(false);
  const contactOptionsRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // حالات للواتساب المتعدد والهاتف المتعدد
  const [selectedPhoneIndex, setSelectedPhoneIndex] = useState(0);
  const [selectedWhatsAppIndex, setSelectedWhatsAppIndex] = useState(0);
  const [isPhoneExpanded, setIsPhoneExpanded] = useState(false);
  const [isWhatsAppExpanded, setIsWhatsAppExpanded] = useState(false);

  // Contact Info - متعدد الأرقام
  const contactInfo = {
    phones: ["00970566498382","00970538506023"],
    whatsappLinks: ["https://wa.link/j862lk", "https://wa.link/h7mmst"],
    whatsappNumbers: ["00970538506023", "00970566498382"],
    email: "info@demoreps.com"
  };

  // Contact Options Handler - معدلة لدعم الأرقام المتعددة
  const handleContactClick = (method, index = 0) => {
    const contactTexts = {
      whatsapp: language === 'ar' ? 'مرحباً، أرغب في استفسار حول خدماتكم' : 'Hello, I would like to inquire about your services',
      emailSubject: language === 'ar' ? 'استفسار عن الخدمات' : 'Inquiry about services'
    };

    switch (method) {
      case 'whatsapp':
        window.open(`${contactInfo.whatsappLinks[index]}?text=${encodeURIComponent(contactTexts.whatsapp)}`, '_blank');
        break;
      case 'phone':
        window.location.href = `tel:${contactInfo.phones[index]}`;
        break;
      case 'email':
        window.location.href = `mailto:${contactInfo.email}?subject=${encodeURIComponent(contactTexts.emailSubject)}`;
        break;
      case 'contact-page':
        navigate('/contact');
        window.scrollTo(0, 0);
        break;
      default:
        break;
    }
    setShowContactOptions(false);
    setIsPhoneExpanded(false);
    setIsWhatsAppExpanded(false);
  };

  // Close contact options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contactOptionsRef.current && !contactOptionsRef.current.contains(event.target)) {
        setShowContactOptions(false);
        setIsPhoneExpanded(false);
        setIsWhatsAppExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // مجموعة من الصور المحلية للخلفية
  const heroImages = [
    "/images/services_hero.jpg",
    "/images/services_hero1.jpg",
    "/images/services_hero2.jpg",
    "/images/services_hero3.jpg"
  ];

  // تبديل الصور التلقائي
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // دالة مساعدة للتأكد من أن القيمة سلسلة نصية
  const safeToLowerCase = useCallback((value) => {
    if (!value) return "";
    if (typeof value === 'string') return value.toLowerCase();
    if (typeof value === 'number') return value.toString().toLowerCase();
    if (typeof value === 'boolean') return value.toString().toLowerCase();
    if (typeof value === 'object') {
      if (value[language] || value.ar || value.en) {
        const text = value[language] || value.ar || value.en || "";
        return text.toLowerCase();
      }
      return "";
    }
    return "";
  }, [language]);

  // استخدام useMemo لتحسين أداء البحث
  const searchServices = useMemo(() => {
    return (servicesList, searchValue, category) => {
      let filtered = [...servicesList];
      
      if (category !== "all") {
        filtered = filtered.filter(service => service.category === category);
      }
      
      if (searchValue.trim() !== "") {
        const searchLower = searchValue.toLowerCase().trim();
        filtered = filtered.filter(service => {
          const searchFields = [
            safeToLowerCase(service.title),
            safeToLowerCase(service.shortDescription),
            safeToLowerCase(service.fullDescription)
          ];
          
          return searchFields.some(field => field && field.includes(searchLower));
        });
      }
      
      return filtered.sort((a, b) => {
        const orderA = parseInt(a.order) || 999;
        const orderB = parseInt(b.order) || 999;
        return orderA - orderB;
      });
    };
  }, [safeToLowerCase]);

  const filteredServices = useMemo(() => {
    if (services.length === 0) return [];
    return searchServices(services, searchTerm, activeCategory);
  }, [services, searchTerm, activeCategory, searchServices]);

  // جلب الخدمات من Firebase أو استخدام البيانات الافتراضية
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const servicesQuery = query(
        collection(db, "services"),
        orderBy("order", "asc")
      );
      
      const snapshot = await getDocs(servicesQuery);
      
      if (snapshot.empty) {
        setServices(defaultServices);
        return;
      }
      
      const servicesData = snapshot.docs.map(doc => {
        const data = doc.data();
        
        return {
          id: doc.id,
          title: data.title || { ar: "بدون عنوان", en: "No title" },
          shortDescription: data.shortDescription || { ar: "لا يوجد وصف", en: "No description" },
          fullDescription: data.fullDescription || data.shortDescription || { ar: "لا يوجد وصف مفصل", en: "No detailed description" },
          category: data.category || "interior",
          mainImage: data.mainImage || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
          isActive: data.isActive !== false,
          isFeatured: data.isFeatured || false,
          order: data.order || 999
        };
      }).filter(service => service.isActive);
      
      const mergedServices = servicesData.map(service => {
        const defaultService = defaultServices.find(ds => ds.category === service.category);
        return {
          ...defaultService,
          ...service,
          title: service.title || defaultService?.title,
          shortDescription: service.shortDescription || defaultService?.shortDescription,
          fullDescription: service.fullDescription || defaultService?.fullDescription,
          mainImage: service.mainImage || defaultService?.mainImage
        };
      });
      
      const existingCategories = mergedServices.map(s => s.category);
      const missingDefaultServices = defaultServices.filter(
        ds => !existingCategories.includes(ds.category)
      );
      
      setServices([...mergedServices, ...missingDefaultServices]);
      
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices(defaultServices);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleServiceClick = useCallback((service) => {
    if (isModalOpen) return;
    
    setSelectedService(service);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, [isModalOpen]);

  const handleRequestClick = useCallback((service) => {
    if (isModalOpen) return;
    
    setSelectedService(service);
    setShowRequestModal(true);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  }, [isModalOpen]);

  const closeAllModals = useCallback(() => {
    setSelectedService(null);
    setShowRequestModal(false);
    setIsModalOpen(false);
    document.body.style.overflow = '';
  }, []);

  const closeRequestModal = useCallback(() => {
    setShowRequestModal(false);
    setSelectedService(null);
    setIsModalOpen(false);
    document.body.style.overflow = '';
  }, []);

  const handleRequestSubmit = () => {
    closeAllModals();
  };

  const getCategoryName = (categoryId) => {
    const category = mainServiceCategories.find(cat => cat.id === categoryId);
    return category ? category.name[language] : categoryId;
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" dir={direction}>
        <div className="text-center px-2 xs:px-3 sm:px-4">
          <div className="relative mx-auto">
            <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 border-4 border-gray-900 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 xs:mt-5 sm:mt-6 md:mt-8 text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 font-light">
            {language === 'ar' ? 'جاري تحميل الخدمات...' : 'Loading services...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" dir={direction}>
      {/* Hero Section with WatermarkedImage */}
      <section className="relative min-h-[40vh] xs:min-h-[45vh] sm:min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="absolute inset-0">
          {heroImages.map((img, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: index === 0 ? 1 : 0 }}
              animate={{ 
                opacity: heroImageIndex === index ? 1 : 0,
              }}
              transition={{
                opacity: { duration: 2, ease: "easeInOut" },
              }}
            >
              <WatermarkedImage
                src={img}
                alt="Architectural Background"
                className="w-full h-full object-cover opacity-20"
                mode="centered-bottom"
                watermarkText="DEMORE"
                opacity={0.18}
                preserveAspectRatio={true}
              />
            </motion.div>
          ))}
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="w-full py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-4 xs:mb-5 sm:mb-6 md:mb-8 lg:mb-10"
              >
                <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-light text-white mb-1 xs:mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-tight">
                  <span className="block">{language === 'ar' ? 'خدماتنا' : 'Our Services'}</span>
                  <span className="block text-white/70 text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl mt-0.5 xs:mt-1 sm:mt-2">
                    {language === 'ar' ? 'المتكاملة' : 'Integrated'}
                  </span>
                </h1>
                
                <p className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed px-2 xs:px-3 sm:px-4">
                  {language === 'ar' 
                    ? 'نقدم مجموعة متكاملة من الخدمات المعمارية والتصميمية لتلبية جميع احتياجاتك'
                    : 'We offer a comprehensive range of architectural and design services to meet all your needs'
                  }
                </p>
              </motion.div>
              
              {/* زر التواصل - متجاوب مع قائمة منسدلة تظهر فوق كل شيء */}
              <div className="flex justify-center mt-4 xs:mt-5 sm:mt-6 md:mt-8 lg:mt-10">
                <div className="relative inline-block" ref={contactOptionsRef}>
                  {/* الزر الرئيسي */}
                  <button
                    onClick={() => setShowContactOptions(!showContactOptions)}
                    className="group relative px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 py-2 xs:py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-orange-700 to-orange-400 text-white text-xs xs:text-sm sm:text-base md:text-lg font-medium rounded-full overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-orange-400/30 border border-orange-600 z-50"
                  >
                    <span className="relative z-10 flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                      {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                      <svg 
                        className={`w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 transition-transform duration-300 ${showContactOptions ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  
                  {/* القائمة المنسدلة - تظهر أسفل الزر مباشرة */}
                  <AnimatePresence>
                    {showContactOptions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute transform -translate-x-1/2 mt-2 w-64 xs:w-72 sm:w-80 md:w-96 z-[9999]"
                        style={{ 
                          top: '100%',
                        }}
                      >
                        <div className="bg-white rounded-xl xs:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                          {/* رأس القائمة */}
                          <div className="px-3 xs:px-4 py-2 xs:py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <p className="text-gray-700 text-xs xs:text-sm font-medium text-center">
                              {language === 'ar' ? 'اختر طريقة التواصل' : 'Choose Contact Method'}
                            </p>
                          </div>
                          
                          <div className="py-1 xs:py-2">
                            {/* قسم الواتساب المتعدد */}
                            <div className="border-b border-gray-100">
                              <div className="px-3 xs:px-4 py-1.5 xs:py-2 bg-green-50/50">
                                <p className="text-2xs xs:text-xs font-medium text-green-700">
                                  {language === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp'}
                                </p>
                              </div>
                              
                              {/* الرقم الرئيسي للواتساب */}
                              <div className="px-3 xs:px-4 py-1 xs:py-1.5">
                                <button
                                  onClick={() => handleContactClick('whatsapp', selectedWhatsAppIndex)}
                                  className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-1.5 xs:p-2 transition-all group"
                                >
                                  <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-1">
                                    <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                      <WhatsAppIcon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                                    </div>
                                    <div className="text-left min-w-0 flex-1">
                                      <p className="font-medium text-2xs xs:text-xs sm:text-sm text-gray-800 truncate">WhatsApp</p>
                                      <p className="text-2xs xs:text-xs text-gray-800 truncate">{contactInfo.whatsappNumbers[selectedWhatsAppIndex]}</p>
                                    </div>
                                  </div>
                                  {contactInfo.whatsappLinks.length > 1 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsWhatsAppExpanded(!isWhatsAppExpanded);
                                        setIsPhoneExpanded(false);
                                      }}
                                      className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                                    >
                                      <ChevronIcon isExpanded={isWhatsAppExpanded} />
                                    </button>
                                  )}
                                </button>
                                
                                {/* الأرقام البديلة للواتساب - تم تعديل لون النص إلى gray-800 */}
                                <AnimatePresence>
                                  {isWhatsAppExpanded && contactInfo.whatsappLinks.length > 1 && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="mt-1 xs:mt-2 space-y-1 overflow-hidden"
                                    >
                                      {contactInfo.whatsappNumbers.map((number, index) => (
                                        index !== selectedWhatsAppIndex && (
                                          <button
                                            key={index}
                                            onClick={() => {
                                              setSelectedWhatsAppIndex(index);
                                              handleContactClick('whatsapp', index);
                                            }}
                                            className="w-full flex items-center gap-2 xs:gap-3 px-2 xs:px-3 py-1.5 xs:py-2 hover:bg-green-50 rounded-lg transition-colors text-2xs xs:text-xs text-gray-800 hover:text-gray-900"
                                          >
                                            <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-green-400"></div>
                                            <span className="truncate font-medium">{number}</span>
                                          </button>
                                        )
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                            
                            {/* قسم الهاتف المتعدد */}
                            <div className="border-b border-gray-100">
                              <div className="px-3 xs:px-4 py-1.5 xs:py-2 bg-blue-50/50">
                                <p className="text-2xs xs:text-xs font-medium text-blue-700">
                                  {language === 'ar' ? 'اتصال هاتفي' : 'Phone Call'}
                                </p>
                              </div>
                              
                              {/* الرقم الرئيسي للهاتف */}
                              <div className="px-3 xs:px-4 py-1 xs:py-1.5">
                                <button
                                  onClick={() => handleContactClick('phone', selectedPhoneIndex)}
                                  className="w-full flex items-center justify-between hover:bg-gray-50 rounded-lg p-1.5 xs:p-2 transition-all group"
                                >
                                  <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-1">
                                    <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                      <PhoneIcon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                                    </div>
                                    <div className="text-left min-w-0 flex-1">
                                      <p className="font-medium text-2xs xs:text-xs sm:text-sm text-gray-800 truncate">
                                        {language === 'ar' ? 'اتصال هاتفي' : 'Phone Call'}
                                      </p>
                                      <p className="text-2xs xs:text-xs text-gray-800 truncate">{contactInfo.phones[selectedPhoneIndex]}</p>
                                    </div>
                                  </div>
                                  {contactInfo.phones.length > 1 && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setIsPhoneExpanded(!isPhoneExpanded);
                                        setIsWhatsAppExpanded(false);
                                      }}
                                      className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                                    >
                                      <ChevronIcon isExpanded={isPhoneExpanded} />
                                    </button>
                                  )}
                                </button>
                                
                                {/* الأرقام البديلة للهاتف - تم تعديل لون النص إلى gray-800 */}
                                <AnimatePresence>
                                  {isPhoneExpanded && contactInfo.phones.length > 1 && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="mt-1 xs:mt-2 space-y-1 overflow-hidden"
                                    >
                                      {contactInfo.phones.map((number, index) => (
                                        index !== selectedPhoneIndex && (
                                          <button
                                            key={index}
                                            onClick={() => {
                                              setSelectedPhoneIndex(index);
                                              handleContactClick('phone', index);
                                            }}
                                            className="w-full flex items-center gap-2 xs:gap-3 px-2 xs:px-3 py-1.5 xs:py-2 hover:bg-blue-50 rounded-lg transition-colors text-2xs xs:text-xs text-gray-800 hover:text-gray-900"
                                          >
                                            <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-blue-400"></div>
                                            <span className="truncate font-medium">{number}</span>
                                          </button>
                                        )
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                            
                            {/* قسم الإيميل */}
                            <div className="border-b border-gray-100">
                              <div className="px-3 xs:px-4 py-1 xs:py-1.5">
                                <button
                                  onClick={() => handleContactClick('email')}
                                  className="w-full flex items-center gap-2 xs:gap-3 hover:bg-purple-50 rounded-lg p-1.5 xs:p-2 transition-all group"
                                >
                                  <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <EmailIcon className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                                  </div>
                                  <div className="text-left min-w-0 flex-1">
                                    <p className="font-medium text-2xs xs:text-xs sm:text-sm text-gray-800 truncate">Email</p>
                                    <p className="text-2xs xs:text-xs text-gray-800 truncate">{contactInfo.email}</p>
                                  </div>
                                </button>
                              </div>
                            </div>
                            
                            {/* قسم نموذج الاتصال */}
                            <div className="px-3 xs:px-4 py-1 xs:py-1.5">
                              <button
                                onClick={() => handleContactClick('contact-page')}
                                className="w-full flex items-center gap-2 xs:gap-3 hover:bg-gray-50 rounded-lg p-1.5 xs:p-2 transition-all group"
                              >
                                <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                                  <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                  </svg>
                                </div>
                                <div className="text-left min-w-0 flex-1">
                                  <p className="font-medium text-2xs xs:text-xs sm:text-sm text-gray-800 truncate">
                                    {language === 'ar' ? 'نموذج الاتصال' : 'Contact Form'}
                                  </p>
                                  <p className="text-2xs xs:text-xs text-gray-600 truncate">
                                    {language === 'ar' ? 'ارسل رسالة مفصلة' : 'Send detailed message'}
                                  </p>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section - متجاوب مع التمرير */}
      <div className=" top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8 py-2 xs:py-3 sm:py-4 md:py-5 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-2 xs:gap-3 sm:gap-4">
            <div className="order-2 lg:order-1 lg:flex-1 overflow-hidden">
              <CategoryPills 
                categories={mainServiceCategories}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                language={language}
              />
            </div>
            
            <div className="order-1 lg:order-2 lg:w-64 xl:w-72 2xl:w-96">
              <SearchComponent
                searchTerm={searchTerm}
                onSearch={handleSearch}
                onClear={handleClearSearch}
                language={language}
                placeholder={language === 'ar' ? 'ابحث في الخدمات...' : 'Search services...'}
                showClear={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid Section */}
      <section className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 lg:px-8 py-4 xs:py-6 sm:py-8 md:py-12 lg:py-16">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-3 sm:gap-4 mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10">
          <div>
            <h2 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-900 mb-0.5 xs:mb-1">
              {activeCategory === 'all' 
                ? (language === 'ar' ? 'جميع الخدمات' : 'All Services')
                : getCategoryName(activeCategory)
              }
            </h2>
            <p className="text-2xs xs:text-xs sm:text-sm md:text-sm lg:text-base text-gray-600">
              {language === 'ar' 
                ? `عرض ${filteredServices.length} خدم${filteredServices.length !== 1 ? 'ات' : 'ة'}`
                : `Showing ${filteredServices.length} service${filteredServices.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
          
          {searchTerm && (
            <button
              onClick={() => {
                handleClearSearch();
                handleCategoryChange("all");
              }}
              className="text-gray-600 hover:text-gray-900 text-2xs xs:text-xs sm:text-sm font-medium flex items-center hover:bg-gray-100 px-2 xs:px-2.5 sm:px-3 md:px-4 py-1 xs:py-1.5 sm:py-2 rounded-lg transition-all border border-gray-300 w-fit"
            >
              <CloseIcon className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ml-0.5 xs:ml-1 sm:ml-1.5 md:ml-2" />
              {language === 'ar' ? 'مسح البحث' : 'Clear search'}
            </button>
          )}
        </div>

        {error && (
          <div className="mb-3 xs:mb-4 sm:mb-5 md:mb-6 p-2 xs:p-2.5 sm:p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg xs:rounded-xl">
            <div className="flex items-center">
              <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-red-500 ml-1 xs:ml-1.5 sm:ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-2xs xs:text-xs sm:text-sm md:text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {filteredServices.length === 0 ? (
          <div className="text-center py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20">
            <div className="inline-flex items-center justify-center w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-100 rounded-full mb-3 xs:mb-4 sm:mb-5 md:mb-6">
              <SearchIcon className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-400" />
            </div>
            <h3 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-light text-gray-900 mb-1 xs:mb-2">
              {language === 'ar' ? 'لم يتم العثور على خدمات' : 'No services found'}
            </h3>
            <p className="text-2xs xs:text-xs sm:text-sm md:text-base text-gray-600 max-w-sm mx-auto mb-3 xs:mb-4 sm:mb-5 md:mb-6 px-2 xs:px-3 sm:px-4">
              {language === 'ar' 
                ? searchTerm 
                  ? 'عذراً، لم نتمكن من العثور على خدمات تطابق بحثك'
                  : 'لا توجد خدمات متاحة حالياً. يرجى التحقق لاحقاً.'
                : searchTerm 
                  ? 'Sorry, we couldn\'t find any services matching your search'
                  : 'No services available at the moment. Please check back later.'
              }
            </p>
            <button
              onClick={() => {
                handleClearSearch();
                handleCategoryChange("all");
              }}
              className="px-3 xs:px-4 sm:px-5 md:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-orange-700 to-orange-400 text-white rounded-lg hover:from-orange-800 hover:to-orange-700 transition-all text-2xs xs:text-xs sm:text-sm md:text-base font-medium shadow-md hover:shadow-lg"
            >
              {language === 'ar' ? 'عرض جميع الخدمات' : 'View All Services'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {filteredServices.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onCardClick={handleServiceClick}
                onRequestClick={handleRequestClick}
                language={language}
              />
            ))}
          </div>
        )}
      </section>

      <AnimatePresence>
        {isModalOpen && selectedService && !showRequestModal && (
          <ServiceDetailModal
            service={selectedService}
            language={language}
            onClose={closeAllModals}
            onRequestClick={handleRequestClick}
          />
        )}
        {showRequestModal && selectedService && (
          <ServiceRequestModal
            service={selectedService}
            language={language}
            onClose={closeRequestModal}
            onSubmit={handleRequestSubmit}
          />
        )}
      </AnimatePresence>

      <style jsx="true">{`
        /* تعريف نقاط التوقف الإضافية */
        @media (min-width: 320px) and (max-width: 374px) {
          .xs\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .text-2xs {
            font-size: 0.6rem;
            line-height: 0.8rem;
          }
          .w-2 {
            width: 0.5rem;
          }
          .h-2 {
            height: 0.5rem;
          }
        }

        /* تحسينات للشاشات الصغيرة جداً */
        @media (max-width: 320px) {
          .text-2xs {
            font-size: 0.55rem;
            line-height: 0.7rem;
          }
          .gap-0\\.5 {
            gap: 0.125rem;
          }
          .p-1 {
            padding: 0.2rem;
          }
        }

        /* تحسينات للشاشات الكبيرة */
        @media (min-width: 1920px) {
          .text-2xs {
            font-size: 0.75rem;
          }
          .text-xs {
            font-size: 0.875rem;
          }
          .text-sm {
            font-size: 1rem;
          }
          .text-base {
            font-size: 1.125rem;
          }
          .text-lg {
            font-size: 1.25rem;
          }
          .text-xl {
            font-size: 1.5rem;
          }
          .text-2xl {
            font-size: 1.875rem;
          }
        }

        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }
        
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
        
        html {
          scroll-behavior: smooth;
        }

        /* تحسين ظهور القائمة المنسدلة */
        .contact-options-container {
          position: relative;
          z-index: 9999;
        }
        
        [class*="z-\\[9999\\]"] {
          z-index: 9999;
        }

        /* تحسينات للطباعة */
        @media print {
          .no-print {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}