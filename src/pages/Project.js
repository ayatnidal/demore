// src/pages/Project.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import WatermarkedImage from "../components/WatermarkedImage";

// ============================================
// بيانات التصنيفات - مطابقة لتصنيفات البورتفوليو
// ============================================

// نفس بيانات التصنيفات الموجودة في Portfolio.js
const designCategories = [
  // Residential categories
  { 
    id: "residential", 
    name: { ar: "سكني", en: "Residential" },
    subcategories: [
      { id: "apartments", name: { ar: "شقق", en: "Apartments" } },
      { id: "villas", name: { ar: "فلل", en: "Villas" } },
      { id: "duplex", name: { ar: "دوبلكس", en: "Duplex" } },
      { id: "townhouse", name: { ar: "تاون هاوس", en: "Townhouse" } },
      { id: "penthouse", name: { ar: "بنتهاوس", en: "Penthouse" } },
      { id: "chalets", name: { ar: "شاليهات", en: "Chalets" } },
      { id: "cabin", name: { ar: "كوخ", en: "Cabin" } },
      { id: "roof", name: { ar: "روف", en: "Roof" } },
    ]
  },
  // Commercial categories
  { 
    id: "commercial", 
    name: { ar: "تجاري", en: "Commercial" },
    subcategories: [
      { id: "offices", name: { ar: "مكاتب", en: "Offices" } },
      { id: "stores", name: { ar: "متاجر", en: "Stores" } },
      { id: "restaurants", name: { ar: "مطاعم", en: "Restaurants" } },
      { id: "cafes", name: { ar: "مقاهي", en: "Cafes" } },
      { id: "showrooms", name: { ar: "معارض", en: "Showrooms" } },
      { id: "clinics", name: { ar: "عيادات", en: "Clinics" } },
      { id: "salons", name: { ar: "صالونات", en: "Salons" } },
      { id: "hotels", name: { ar: "فنادق", en: "Hotels" } },
      { id: "gyms", name: { ar: "صالات رياضية", en: "Gyms" } },
      { id: "schools", name: { ar: "مدارس", en: "Schools" } }
    ]
  },
  // Specializations
  { 
    id: "specializations", 
    name: { ar: "التخصصات", en: "Specializations" },
    subcategories: [
      { id: "interior", name: { ar: "داخلي", en: "Interior" } },
      { id: "exterior", name: { ar: "خارجي", en: "Exterior" } },
      { id: "landscape", name: { ar: "تنسيق حدائق", en: "Landscape" } },
      { id: "both", name: { ar: "داخلي وخارجي", en: "Interior & Exterior" } }
    ]
  },
  // Interior Rooms
  { 
    id: "interior_rooms", 
    name: { ar: "الغرف الداخلية", en: "Interior Rooms" },
    subcategories: [
      { id: "living_room", name: { ar: "غرفة المعيشة", en: "Living Room" } },
      { id: "salon_room", name: { ar: "صالون", en: "Salon" } },
      { id: "kitchen", name: { ar: "مطبخ", en: "Kitchen" } },
      { id: "dining_room", name: { ar: "غرفة الطعام", en: "Dining Room" } },
      { id: "bathroom", name: { ar: "حمام", en: "Bathroom" } },
      { id: "home_office", name: { ar: "مكتب منزلي", en: "Home Office" } },
      { id: "master_bedroom", name: { ar: "غرفة نوم رئيسية", en: "Master Bedroom" } },
      { id: "children_room", name: { ar: "غرفة أطفال", en: "Children's Room" } },
      { id: "guest_room", name: { ar: "غرفة ضيوف", en: "Guest Room" } },
      { id: "library", name: { ar: "مكتبة", en: "Library" } },
      { id: "Boys_Bedroom", name: { ar: "غرفة نوم الاولاد", en: "Boys' Bedroom" } },
      { id: "Girls_Bedroom", name: { ar: "غرفة نوم البنات", en: "Girls' Bedroom" } },
      { id: "Second_Bedroom", name: { ar: "غرفة نوم ثانوية", en: "Second Bedroom" } },
      { id: "prayer_room", name: { ar: "غرفة صلاة", en: "Prayer Room" } },
      { id: "full_projects", name: { ar: "مشاريع كاملة", en: "Full Projects" } }
    ]
  },
];

// ============================================
// دالة توحيد القيم (مطابقة لصفحة البورتفوليو)
// ============================================
const normalizeValue = (value) => {
  if (!value) return "";
  
  const valueStr = String(value).toLowerCase().trim();
  
  const arabicToEnglishMap = {
    "سكني": "residential",
    "تجاري": "commercial",
    "شقق": "apartments",
    "شقة": "apartments",
    "شقه": "apartments",
    "فلل": "villas",
    "فلة": "villas",
    "فله": "villas", 
    "دوبلكس": "duplex",
    "تاون هاوس": "townhouse",
    "بنتهاوس": "penthouse",
    "شاليهات": "chalets",
    "شاليه": "chalets",
    "كوخ": "cabin",
    "روف": "roof",
    "مكاتب": "offices",
    "مكتب": "offices",
    "متاجر": "stores",
    "متجر": "stores",
    "مطاعم": "restaurants",
    "مطعم": "restaurants", 
    "مقاهي": "cafes",
    "مقهى": "cafes",
    "مقهي": "cafes",
    "معارض": "showrooms",
    "معرض": "showrooms",
    "عيادات": "clinics",
    "عيادة": "clinics",
    "صالونات": "salons",
    "صالون": "salons",
    "فنادق": "hotels",
    "فندق": "hotels",
    "صالات رياضية": "gyms",
    "صالة رياضية": "gyms",
    "مدارس": "schools",
    "مدرسة": "schools",
    "داخلي": "interior",
    "خارجي": "exterior", 
    "تنسيق حدائق": "landscape",
    "لاندسكيب": "landscape",
    "داخلي وخارجي": "both",
    "غرفة المعيشة": "living_room",
    "غرفة معيشة": "living_room",
    "معيشة": "living_room",
    "مطبخ": "kitchen",
    "مطابخ": "kitchen",
    "غرفة الطعام": "dining_room",
    "حمام": "bathroom",
    "حمامات": "bathroom",
    "مكتب منزلي": "home_office",
    "غرفة نوم رئيسية": "master_bedroom",
    "غرفة نوم رئيسي": "master_bedroom",
    "غرف نوم رئيسية": "master_bedroom",
    "غرفة أطفال": "children_room",
    "غرف نوم اطفال": "children_room",
    "غرفة ضيوف": "guest_room",
    "مكتبة": "library",
    "غرفة نوم الاولاد": "Boys_Bedroom",
    "غرف نوم اولاد": "Boys_Bedroom",
    "غرفة نوم البنات": "Girls_Bedroom",
    "غرف نوم بنات": "Girls_Bedroom",
    "غرفة صلاة": "prayer_room",
    "مشاريع كاملة": "full_projects",
    "غرفة نوم ثانوية": "Second_Bedroom"
  };
  
  const englishNormalizationMap = {
    "residential": "residential",
    "commercial": "commercial",
    "apartment": "apartments",
    "apartments": "apartments",
    "villa": "villas",
    "villas": "villas", 
    "duplex": "duplex",
    "duplexes": "duplex",
    "townhouse": "townhouse",
    "townhouses": "townhouse",
    "penthouse": "penthouse",
    "penthouses": "penthouse",
    "chalet": "chalets",
    "chalets": "chalets",
    "cabin": "cabin",
    "roof": "roof",
    "office": "offices",
    "offices": "offices",
    "store": "stores",
    "stores": "stores",
    "restaurant": "restaurants",
    "restaurants": "restaurants", 
    "cafe": "cafes",
    "cafes": "cafes",
    "showroom": "showrooms",
    "showrooms": "showrooms",
    "clinic": "clinics",
    "clinics": "clinics",
    "salon": "salons",
    "salons": "salons",
    "hotel": "hotels",
    "hotels": "hotels",
    "gym": "gyms",
    "gyms": "gyms",
    "school": "schools",
    "schools": "schools",
    "interior": "interior",
    "exterior": "exterior", 
    "landscape": "landscape",
    "both": "both",
    "living room": "living_room",
    "living_room": "living_room",
    "kitchen": "kitchen",
    "dining room": "dining_room",
    "dining_room": "dining_room",
    "bathroom": "bathroom",
    "bathrooms": "bathroom",
    "home office": "home_office",
    "home_office": "home_office",
    "master bedroom": "master_bedroom",
    "master_bedroom": "master_bedroom",
    "children room": "children_room",
    "children_room": "children_room",
    "guest room": "guest_room",
    "guest_room": "guest_room",
    "library": "library",
    "boys_bedroom": "Boys_Bedroom",
    "boys bedroom": "Boys_Bedroom",
    "Boys_Bedroom": "Boys_Bedroom",
    "girls bedroom": "Girls_Bedroom",
    "girls_bedroom": "Girls_Bedroom",
    "Girls_Bedroom": "Girls_Bedroom",
    "prayer room": "prayer_room",
    "prayer_room": "prayer_room",
    "full projects": "full_projects",
    "full_projects": "full_projects",
    "second bedroom": "Second_Bedroom",
    "second_bedroom": "Second_Bedroom",
    "Second_Bedroom": "Second_Bedroom"
  };
  
  if (englishNormalizationMap[valueStr]) {
    return englishNormalizationMap[valueStr];
  }
  
  if (arabicToEnglishMap[valueStr]) {
    return arabicToEnglishMap[valueStr];
  }
  
  const cleanedValue = valueStr.replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  if (englishNormalizationMap[cleanedValue]) {
    return englishNormalizationMap[cleanedValue];
  }
  
  if (valueStr === "salon" || valueStr === "salons" || valueStr === "صالون" || valueStr === "صالونات") {
    return "salon_room";
  }
  
  return cleanedValue || valueStr;
};

// ============================================
// دالة الحصول على اسم التصنيف - محسنة بالكامل
// ============================================

const getCategoryName = (categoryId, language) => {
  if (!categoryId) return language === 'ar' ? "غير محدد" : "Uncategorized";
  
  // دالة مساعدة للبحث في التصنيفات
  const findCategoryName = (id) => {
    // البحث في جميع التصنيفات
    for (const cat of designCategories) {
      // البحث في التصنيف الرئيسي
      if (normalizeValue(cat.id) === normalizeValue(id)) {
        return cat.name[language];
      }
      
      // البحث في التصنيفات الفرعية
      if (cat.subcategories) {
        for (const sub of cat.subcategories) {
          if (normalizeValue(sub.id) === normalizeValue(id)) {
            return sub.name[language];
          }
        }
      }
    }
    
    return null;
  };
  
  // محاولة البحث بالمعرف الطبيعي
  let found = findCategoryName(categoryId);
  if (found) return found;
  
  // إذا كان categoryId كائناً
  if (typeof categoryId === 'object') {
    // محاولة الحصول على mainCategory أولاً
    if (categoryId.mainCategory) {
      const mainName = findCategoryName(categoryId.mainCategory);
      
      // إذا كان هناك subCategory، أضفه
      if (categoryId.subCategory) {
        const subName = findCategoryName(categoryId.subCategory);
        if (mainName && subName) {
          return `${mainName} - ${subName}`;
        }
      }
      
      return mainName || categoryId.mainCategory;
    }
    
    // البحث عن أي معرف في الكائن
    for (const key in categoryId) {
      if (typeof categoryId[key] === 'string') {
        const val = findCategoryName(categoryId[key]);
        if (val) return val;
      }
    }
  }
  
  // إذا كان نصاً، حاول التوحيد والبحث مرة أخرى
  if (typeof categoryId === 'string') {
    const normalized = normalizeValue(categoryId);
    const normalizedName = findCategoryName(normalized);
    if (normalizedName) return normalizedName;
    
    // قائمة بالتصنيفات الإضافية للتعامل مع الحالات الخاصة
    const extraCategories = {
      "all": { ar: "جميع الأعمال", en: "All Works" },
      "full_projects": { ar: "مشاريع كاملة", en: "Full Projects" },
      "living-room": { ar: "غرف المعيشة", en: "Living Rooms" },
      "bedroom": { ar: "غرف النوم", en: "Bedrooms" },
      "modern": { ar: "حديث", en: "Modern" },
      "classic": { ar: "كلاسيكي", en: "Classic" },
      "minimalist": { ar: "مينيماليست", en: "Minimalist" },
      "contemporary": { ar: "معاصر", en: "Contemporary" },
      "luxury": { ar: "فاخر", en: "Luxury" },
      "traditional": { ar: "تقليدي", en: "Traditional" },
      "renovation": { ar: "تجديد", en: "Renovation" },
      "new-construction": { ar: "بناء جديد", en: "New Construction" }
    };
    
    if (extraCategories[normalized]) {
      return extraCategories[normalized][language];
    }
    
    if (extraCategories[categoryId]) {
      return extraCategories[categoryId][language];
    }
    
    return categoryId;
  }
  
  return language === 'ar' ? "غير محدد" : "Uncategorized";
};

// ============================================
// Helper function to safely extract text with fallbacks
// ============================================

const getText = (obj, lang) => {
  if (!obj) return lang === 'ar' ? "لا توجد معلومات" : "No information";
  
  if (typeof obj === 'string') return obj;
  
  if (typeof obj === 'number') return obj.toString();
  
  if (Array.isArray(obj)) {
    return obj.map(item => getText(item, lang)).join(', ');
  }
  
  if (typeof obj === 'object') {
    if (obj[lang]) {
      return getText(obj[lang], lang);
    }
    
    const otherLang = lang === 'ar' ? 'en' : 'ar';
    if (obj[otherLang]) {
      return getText(obj[otherLang], lang);
    }
    
    for (const key in obj) {
      if (typeof obj[key] === 'string' && (key.includes('name') || key.includes('title') || key.includes('text'))) {
        return obj[key];
      }
    }
    
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        return obj[key];
      }
    }
    
    try {
      return JSON.stringify(obj);
    } catch {
      return lang === 'ar' ? "كائن معقد" : "Complex object";
    }
  }
  
  return String(obj) || (lang === 'ar' ? "لا توجد معلومات" : "No information");
};

// ============================================
// SVG Icons Components
// ============================================

const IconStar = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const IconChevronLeft = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const IconChevronRight = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const IconDesign = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const IconChallenge = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const IconSolution = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconResults = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const IconPhone = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const IconWhatsApp = ({ className = "w-5 h-5" }) => (
  <svg 
    className={className} 
    fill="currentColor" 
    viewBox="0 0 24 24" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.077 4.928C17.191 3.041 14.683 2 12.006 2 6.798 2 2.533 6.264 2.53 11.472c0 1.671.436 3.304 1.266 4.744L2 22l5.878-1.537c1.386.756 2.945 1.154 4.534 1.155h.004c5.205 0 9.47-4.265 9.473-9.474 0-2.529-.985-4.906-2.812-6.69zm-7.071 14.53h-.003c-1.438-.001-2.847-.387-4.074-1.116l-.292-.173-3.486.914.93-3.399-.19-.302a8.144 8.144 0 0 1-1.255-4.367c.002-4.479 3.645-8.122 8.127-8.122 2.17 0 4.208.845 5.741 2.38a8.058 8.058 0 0 1 2.375 5.746c-.002 4.48-3.645 8.124-8.124 8.124zm4.457-6.087c-.245-.122-1.45-.715-1.675-.797-.225-.081-.389-.122-.553.122-.164.245-.637.797-.781.96-.144.163-.288.184-.533.061-.245-.122-1.034-.381-1.969-1.216-.728-.65-1.22-1.453-1.363-1.698-.143-.245-.016-.378.107-.5.111-.111.245-.29.368-.434.122-.144.163-.245.245-.408.082-.163.041-.306-.02-.428-.061-.122-.553-1.333-.757-1.825-.2-.48-.403-.416-.553-.424-.143-.008-.306-.008-.47-.008-.163 0-.428.061-.652.306-.224.245-.856.837-.856 2.042 0 1.205.877 2.369 1 2.532.122.163 1.725 2.636 4.18 3.696.584.252 1.04.403 1.396.516.587.187 1.12.16 1.542.097.47-.07 1.45-.593 1.654-1.166.204-.573.204-1.064.143-1.166-.061-.102-.224-.163-.47-.286z" />
  </svg>
);

const IconCalendar = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconLocation = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconShare = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const IconZoom = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
  </svg>
);

const IconClose = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconUser = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

// ============================================
// Image Lightbox Component with WatermarkedImage - NO ZOOM
// ============================================

const ImageLightbox = ({ 
  images, 
  initialIndex, 
  onClose, 
  language 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isDownloading, setIsDownloading] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  
  const imageRef = useRef(null);
  const thumbnailsRef = useRef(null);
  const thumbnailRefs = useRef([]);

  // دالة حساب الحجم المناسب للصورة
  const calculateImageSize = useCallback(() => {
    if (!imageRef.current) return;
    
    const img = imageRef.current;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    const availableHeight = viewportHeight - 160;
    const availableWidth = viewportWidth - 80;
    
    const imgNaturalWidth = img.naturalWidth;
    const imgNaturalHeight = img.naturalHeight;
    
    if (imgNaturalWidth && imgNaturalHeight) {
      const widthRatio = availableWidth / imgNaturalWidth;
      const heightRatio = availableHeight / imgNaturalHeight;
      const fitRatio = Math.min(widthRatio, heightRatio, 1);
      
      setImageSize({
        width: imgNaturalWidth * fitRatio,
        height: imgNaturalHeight * fitRatio
      });
    }
  }, []);

  // تمرير شريط المصغرات إلى الصورة النشطة
  const scrollToActiveThumbnail = useCallback(() => {
    if (thumbnailsRef.current && thumbnailRefs.current[currentIndex]) {
      const thumbnail = thumbnailRefs.current[currentIndex];
      const container = thumbnailsRef.current;
      
      if (thumbnail && container) {
        const thumbnailLeft = thumbnail.offsetLeft;
        const thumbnailWidth = thumbnail.offsetWidth;
        const containerWidth = container.offsetWidth;
        
        const targetScrollLeft = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
        
        container.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  const downloadImageWithWatermark = useCallback(async () => {
    const currentImage = images[currentIndex];
    if (!currentImage) return;

    setIsDownloading(true);
    
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = currentImage;
      });
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0, img.width, img.height);
      
      const watermarkText = "DEMORE";
      const fontSize = Math.min(img.width, img.height) * 0.05;
      const padding = fontSize * 0.5;
      
      ctx.font = `${fontSize}px "Arial", "Helvetica", sans-serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      
      const x = canvas.width / 2;
      const y = canvas.height - padding;
      
      ctx.fillText(watermarkText, x, y);
      
      ctx.font = `${fontSize * 0.7}px "Arial", "Helvetica", sans-serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.textAlign = "right";
      ctx.fillText(watermarkText, canvas.width - padding, canvas.height - padding);
      
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `demore_${language === 'ar' ? 'صورة' : 'image'}_${currentIndex + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        const message = language === 'ar' ? '✅ تم حفظ الصورة مع العلامة المائية' : '✅ Image saved with watermark';
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(0,0,0,0.8)';
        toast.style.color = 'white';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '8px';
        toast.style.zIndex = '1000';
        toast.style.fontSize = '14px';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
      }, 'image/jpeg', 0.95);
      
    } catch (error) {
      console.error("Error downloading image:", error);
      const errorMessage = language === 'ar' ? '❌محتوى محمي' : '❌ Protected Content';
      const toast = document.createElement('div');
      toast.textContent = errorMessage;
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.backgroundColor = 'rgba(220, 38, 38, 0.9)';
      toast.style.color = 'white';
      toast.style.padding = '12px 24px';
      toast.style.borderRadius = '8px';
      toast.style.zIndex = '1000';
      toast.style.fontSize = '14px';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } finally {
      setIsDownloading(false);
    }
  }, [currentIndex, images, language]);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // تحديث حجم الصورة عند تحميلها أو تغيير حجم النافذة
  useEffect(() => {
    if (imageRef.current) {
      if (imageRef.current.complete) {
        calculateImageSize();
      } else {
        imageRef.current.onload = calculateImageSize;
      }
    }
    
    window.addEventListener('resize', calculateImageSize);
    return () => window.removeEventListener('resize', calculateImageSize);
  }, [calculateImageSize, currentIndex]);

  // تمرير المصغرات عند تغيير الصورة
  useEffect(() => {
    scrollToActiveThumbnail();
  }, [currentIndex, scrollToActiveThumbnail]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowRight':
          if (language === 'ar') {
            nextImage();
          } else {
            prevImage();
          }
          break;
        case 'ArrowLeft':
          if (language === 'ar') {
            prevImage();
          } else {
            nextImage();
          }
          break;
        case 'Escape':
          onClose();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          if (!isDownloading) {
            downloadImageWithWatermark();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextImage, prevImage, onClose, language, downloadImageWithWatermark, isDownloading]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const currentImage = images[currentIndex];

  return (
    <div 
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex flex-col"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Top Bar - Close Button on Right, Download on Left */}
      <div className="absolute top-0 right-0 z-20 p-4">
        <button
          onClick={onClose}
          className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
        >
          <IconClose className="w-6 h-6" />
        </button>
      </div>

      {/* Image Container with proper sizing */}
      <div 
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        style={{ minHeight: 0 }}
      >
        <div className="flex items-center justify-center">
          <WatermarkedImage
            ref={imageRef}
            src={currentImage}
            alt={`${language === 'ar' ? 'صورة' : 'Image'} ${currentIndex + 1}`}
            className="block select-none"
            style={{
              width: imageSize.width ? `${imageSize.width}px` : 'auto',
              height: imageSize.height ? `${imageSize.height}px` : 'auto',
              maxWidth: 'calc(100vw - 80px)',
              maxHeight: 'calc(100vh - 160px)',
              objectFit: 'contain',
            }}
            mode="centered-bottom"
            watermarkText="DEMORE"
            opacity={0.25}
            preserveDimensions={true}
          />
        </div>
      </div>

      {/* Navigation Buttons - Left and Right */}
      {images.length > 1 && (
        <>
          <button
            onClick={language === 'ar' ? prevImage : nextImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 z-20 hover:scale-110 transition-transform"
            aria-label={language === 'ar' ? 'الصورة السابقة' : 'Previous image'}
          >
            <IconChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={language === 'ar' ? nextImage : prevImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-20 hover:scale-110"
            aria-label={language === 'ar' ? 'الصورة التالية' : 'Next image'}
          >
            <IconChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Keyboard Shortcuts Hint */}
      <div className="absolute bottom-4 right-4 text-white/40 text-xs bg-black/30 rounded-lg p-2 backdrop-blur-sm">
        <div className="flex gap-3">
          <span>← →</span>
          <span>|</span>
          <span className="font-mono bg-white/20 px-1 rounded">S</span>
          <span>{language === 'ar' ? 'لتحميل الصورة' : 'to save'}</span>
        </div>
      </div>

      {/* Thumbnails Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent pt-4 pb-2">
        <div className="max-w-full mx-auto px-3">
          <div 
            ref={thumbnailsRef}
            className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.2) transparent',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {images.map((image, index) => (
              <button
                key={index}
                ref={(el) => (thumbnailRefs.current[index] = el)}
                onClick={() => {
                  setCurrentIndex(index);
                }}
                className={`flex-shrink-0 transition-all duration-300 rounded-md overflow-hidden ${
                  index === currentIndex
                    ? "ring-2 ring-amber-500 ring-offset-1 ring-offset-black scale-105"
                    : "opacity-70 hover:opacity-100"
                }`}
                style={{
                  width: '60px',
                  height: '60px'
                }}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Similar Project Request Modal Component
// ============================================

const SimilarProjectRequestModal = ({ project, language, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    contactMethod: 'whatsapp',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const modalRef = useRef();

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
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const projectRequest = {
        projectId: project.id,
        projectName: getText(project.title, language),
        projectType: typeof project.category === 'object' ? JSON.stringify(project.category) : (project.category || 'uncategorized'),
        category: getCategoryName(project.category, language),
        customerName: formData.name,
        customerPhone: formData.phone,
        contactMethod: formData.contactMethod,
        message: formData.message || '',
        requestType: 'similar_project',
        status: 'pending',
        timestamp: new Date(),
        language: language,
        viewed: false,
        source: 'project_page'
      };
      
      await addDoc(collection(db, "projectRequests"), projectRequest);
      
      setSubmitSuccess(true);
      
      setTimeout(() => {
        onSubmit();
      }, 3000);
      
    } catch (error) {
      console.error("Error submitting project request:", error);
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

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !submitSuccess) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !submitSuccess) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [submitSuccess, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (submitSuccess) {
    return (
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleOverlayClick}
        ref={modalRef}
      >
        <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl transform transition-all duration-300 scale-100">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {language === 'ar' ? 'تم استلام طلبك' : 'Request Received'}
            </h3>
            
            <p className="text-gray-600 mb-6">
              {language === 'ar' 
                ? `شكراً لك ${formData.name}، سنتواصل معك قريباً عبر ${formData.contactMethod === 'whatsapp' ? 'واتساب' : 'الهاتف'}`
                : `Thank you ${formData.name}, we'll contact you soon via ${formData.contactMethod === 'whatsapp' ? 'WhatsApp' : 'phone'}`
              }
            </p>
            
            <div className="w-full bg-gray-50 rounded-xl p-4 mb-6">
              <div className="text-sm text-gray-500 mb-2">
                {language === 'ar' ? 'المشروع المطلوب' : 'Requested Project'}
              </div>
              <div className="font-semibold text-gray-900">
                {getText(project.title, language)}
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              {language === 'ar' 
                ? 'رقم المرجع: ' + Date.now().toString().slice(-6)
                : 'Reference: #' + Date.now().toString().slice(-6)
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
      ref={modalRef}
    >
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {language === 'ar' ? 'طلب مشروع مماثل' : 'Similar Project Request'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {getText(project.title, language)}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
          >
            <IconClose className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'الاسم الكامل' : 'Full Name'} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors`}
                placeholder={language === 'ar' ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {language === 'ar' ? 'طريقة التواصل المفضلة' : 'Preferred Contact Method'} *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="relative">
                  <input
                    type="radio"
                    name="contactMethod"
                    value="whatsapp"
                    checked={formData.contactMethod === 'whatsapp'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`
                    flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${formData.contactMethod === 'whatsapp' 
                      ? `border-green-500 bg-green-50` 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}>
                    <IconWhatsApp className={`w-5 h-5 ${formData.contactMethod === 'whatsapp' ? 'text-green-600' : 'text-gray-500'}`} />
                    <span className={`mr-2 text-sm font-medium ${formData.contactMethod === 'whatsapp' ? 'text-green-600' : 'text-gray-700'}`}>
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
                    className="sr-only"
                  />
                  <div className={`
                    flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${formData.contactMethod === 'phone' 
                      ? `border-blue-500 bg-blue-50` 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}>
                    <IconPhone className={`w-5 h-5 ${formData.contactMethod === 'phone' ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className={`mr-2 text-sm font-medium ${formData.contactMethod === 'phone' ? 'text-blue-600' : 'text-gray-700'}`}>
                      {language === 'ar' ? 'اتصال' : 'Phone Call'}
                    </span>
                  </div>
                </label>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
                placeholder={language === 'ar' ? 'أي ملاحظات إضافية أو متطلبات خاصة...' : 'Any additional notes or special requirements...'}
              />
            </div>
            
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                </>
              ) : (
                language === 'ar' ? 'إرسال الطلب' : 'Submit Request'
              )}
            </button>
            
            <p className="text-center text-xs text-gray-500 mt-3">
              {language === 'ar' 
                ? 'سنرد على طلبك خلال 24 ساعة عمل'
                : 'We\'ll respond to your request within 24 working hours'
              }
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

// ============================================
// Main Project Component
// ============================================

export default function Project() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("after");
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [showSimilarProjectModal, setShowSimilarProjectModal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { language, direction } = useLanguage();
  const galleryRef = useRef(null);
  const headerRef = useRef(null);

  const handleBack = () => {
    navigate("/portfolio");
  };

  const handleBackToPortfolio = () => {
    navigate("/portfolio");
  };

  const getActiveImages = useCallback(() => {
    if (!project) return [];
    
    let images = [];
    
    if (activeTab === "before" && project.beforeImages?.length > 0) {
      images = project.beforeImages;
    } else if (activeTab === "gallery" && project.galleryImages?.length > 0) {
      images = project.galleryImages;
    } else if (project.afterImages?.length > 0) {
      images = project.afterImages;
    } else if (project.galleryImages?.length > 0) {
      images = project.galleryImages;
    } else if (project.mainImage) {
      images = [project.mainImage];
    }
    
    return images.filter(img => img && typeof img === 'string');
  }, [project, activeTab]);

  const nextImage = useCallback(() => {
    const images = getActiveImages();
    if (images.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % images.length);
    }
  }, [getActiveImages]);

  const prevImage = useCallback(() => {
    const images = getActiveImages();
    if (images.length > 0) {
      setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  }, [getActiveImages]);

  const openLightbox = useCallback((index = 0, images = null) => {
    const imagesToShow = images || getActiveImages();
    if (imagesToShow.length > 0) {
      setLightboxImages(imagesToShow);
      setLightboxIndex(index);
      setShowLightbox(true);
    }
  }, [getActiveImages]);

  const closeLightbox = useCallback(() => {
    setShowLightbox(false);
  }, []);

  const handleSimilarProjectClick = () => {
    setShowSimilarProjectModal(true);
  };

  const closeSimilarProjectModal = useCallback(() => {
    setShowSimilarProjectModal(false);
  }, []);

  const handleSimilarProjectSubmit = useCallback(() => {
    setShowSimilarProjectModal(false);
  }, []);

  const handleShareProject = async () => {
    const shareData = {
      title: getText(project?.title || '', language),
      text: getText(project?.description || '', language).substring(0, 200) + '...',
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('مشاركة ملغاة:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert(language === 'ar' ? '✅ تم نسخ رابط المشروع' : '✅ Project link copied');
      } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert(language === 'ar' ? '✅ تم نسخ رابط المشروع' : '✅ Project link copied');
      }
    }
  };

  const scrollToGallery = () => {
    if (galleryRef.current) {
      galleryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        const projectDoc = await getDoc(doc(db, "portfolioProjects", id));
        
        if (projectDoc.exists()) {
          const projectData = projectDoc.data();
          
          let projectCategory = projectData.category || projectData.projectType || "uncategorized";
          
          const projectTitle = projectData.title || projectData.projectName || { 
            ar: " ", 
            en: " " 
          };
          
          const projectDescription = projectData.description || projectData.briefDescription || { 
            ar: " ", 
            en: " " 
          };
          
          const fullDescription = projectData.fullDescription || projectData.detailedDescription || { 
            ar: " ", 
            en: " " 
          };
          
          const projectLocation = projectData.location || projectData.projectLocation || "";
          const projectYear = projectData.year || projectData.projectYear || new Date().getFullYear().toString();
          const projectArea = projectData.area || projectData.projectArea || "";
          
          const mainImage = projectData.mainImage || 
                           projectData.coverImage || 
                           projectData.featuredImage || 
                           projectData.thumbnail || 
                           "";
          
          const galleryImages = Array.isArray(projectData.images) ? projectData.images : 
                               Array.isArray(projectData.galleryImages) ? projectData.galleryImages : 
                               Array.isArray(projectData.afterImages) ? projectData.afterImages : 
                               [];
          
          const beforeImages = Array.isArray(projectData.beforeImages) ? projectData.beforeImages : [];
          const afterImages = Array.isArray(projectData.afterImages) ? projectData.afterImages : [];
          
          const colors = Array.isArray(projectData.colors) ? projectData.colors : 
                        Array.isArray(projectData.selectedColors) ? projectData.selectedColors : [];
          
          const challengesList = Array.isArray(projectData.challenges) ? projectData.challenges : [];
          const designSolutions = Array.isArray(projectData.designSolutions) ? projectData.designSolutions : 
                                 Array.isArray(projectData.designSolution) ? projectData.designSolution : [];
          
          const resultsList = Array.isArray(projectData.results) ? projectData.results : [];
          const featuresList = Array.isArray(projectData.features) ? projectData.features : [];
          
          const workDetails = projectData.workDetails || { ar: "", en: "" };
          
          setProject({
            id: projectDoc.id,
            title: projectTitle,
            description: projectDescription,
            fullDescription: fullDescription,
            category: projectCategory,
            location: projectLocation,
            year: projectYear,
            area: projectArea,
            mainImage: mainImage,
            galleryImages: galleryImages,
            beforeImages: beforeImages,
            afterImages: afterImages,
            duration: projectData.duration || "",
            budget: projectData.budget || "",
            features: featuresList,
            colors: colors,
            challenges: challengesList,
            designSolutions: designSolutions,
            results: resultsList,
            projectType: projectCategory,
            clientName: projectData.clientName || "",
            city: projectData.city || projectData.location || "",
            workDetails: workDetails,
            isActive: projectData.isActive !== false,
            isFeatured: projectData.isFeatured || false,
            order: projectData.order || 0,
            createdAt: projectData.createdAt || new Date(),
            updatedAt: projectData.updatedAt || new Date()
          });
          
        } else {
          navigate("/portfolio");
        }
      } catch (error) {
        console.error("خطأ في جلب المشروع:", error);
        navigate("/portfolio");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [id, navigate]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showSimilarProjectModal) closeSimilarProjectModal();
        if (showLightbox) closeLightbox();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showSimilarProjectModal, showLightbox, closeSimilarProjectModal, closeLightbox]);

  useEffect(() => {
    const handleImageClick = (e) => {
      if (e.target.classList.contains('gallery-image')) {
        const index = parseInt(e.target.dataset.index) || 0;
        openLightbox(index);
      }
    };

    document.addEventListener('click', handleImageClick);
    return () => document.removeEventListener('click', handleImageClick);
  }, [openLightbox]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center" dir={direction}>
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <IconDesign className="w-10 h-10 md:w-12 md:h-12 text-amber-600" />
            </div>
          </div>
          <p className="text-gray-600 text-base md:text-lg mt-4 animate-pulse">
            {language === 'ar' ? 'جاري تحميل تفاصيل المشروع...' : 'Loading project details...'}
          </p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center" dir={direction}>
        <div className="text-center">
          <div className="text-6xl mb-4 text-amber-400">🏗️</div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            {language === 'ar' ? 'المشروع غير موجود' : 'Project not found'}
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            {language === 'ar' 
              ? 'عذراً، لم نتمكن من العثور على المشروع المطلوب. قد يكون قد تم نقله أو حذفه.'
              : 'Sorry, we couldn\'t find the requested project. It may have been moved or deleted.'
            }
          </p>
          <button 
            onClick={handleBack}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {language === 'ar' ? 'العودة إلى المعرض' : 'Back to Portfolio'}
          </button>
        </div>
      </div>
    );
  }

  const activeImages = getActiveImages();
  const categoryDisplayName = getCategoryName(project.category, language);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/50 to-gray-100/30" dir={direction}>
      <header 
        ref={headerRef}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100/80 shadow-lg transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center space-x-4">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBackToPortfolio}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-white text-gray-700 rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-amber-500 transition-all duration-300 group"
                aria-label={language === 'ar' ? 'العودة للمشاريع' : 'Back to projects'}
              >
                <span className="font-medium text-sm md:text-base group-hover:text-gray-900 transition-colors duration-300">
                  {language === 'ar' ? ' → العودة للمشاريع' : '← Back to projects '}
                </span>
              </motion.button>
              
              <div className="max-w-xs md:max-w-md lg:max-w-lg">
                <h1 className="text-sm md:text-lg font-bold text-gray-900 truncate">
                  {getText(project.title, language)}
                </h1>
              </div>
            </div>
          </div>
          
          <div className="py-3 md:py-4 border-t border-gray-100/80">
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-amber-100/50 px-3 py-1.5 rounded-full border border-amber-200/50">
                <IconDesign className="w-4 h-4 text-amber-600" />
                <span className="text-xs md:text-sm font-medium text-amber-800">
                  {categoryDisplayName}
                </span>
              </div>
              
              {project.isFeatured && (
                <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1.5 rounded-full shadow-sm">
                  <IconStar className="w-4 h-4" />
                  <span className="text-xs md:text-sm font-medium">
                    {language === 'ar' ? 'مميز' : 'Featured'}
                  </span>
                </div>
              )}
              
              {project.location && (
                <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                  <IconLocation className="w-4 h-4 text-gray-500" />
                  <span className="text-xs md:text-sm">{project.location}</span>
                </div>
              )}
              
              {project.year && (
                <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                  <IconCalendar className="w-4 h-4 text-gray-500" />
                  <span className="text-xs md:text-sm">{project.year}</span>
                </div>
              )}
              
              {project.area && (
                <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                  <span className="text-xs md:text-sm font-medium">{project.area}</span>
                  <span className="text-xs text-gray-500">{language === 'ar' ? 'م²' : 'm²'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="py-6 md:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Project Hero Section */}
          <div className="mb-8 md:mb-12" ref={galleryRef}>
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-gray-100/50">
              <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] bg-gradient-to-br from-gray-50 to-gray-100">
                {activeImages.length > 0 ? (
                  <>
                    <div 
                      className="w-full h-full cursor-pointer"
                      onClick={() => openLightbox(activeImageIndex)}
                    >
                      <WatermarkedImage 
                        src={activeImages[activeImageIndex]} 
                        alt={getText(project.title, language)}
                        className="w-full h-full object-contain"
                        style={{ objectFit: 'contain' }}
                        mode="centered-bottom"
                        watermarkText="DEMORE"
                        opacity={0.2}
                        preserveAspectRatio={true}
                      />
                    </div>
                    
                    {activeImages.length > 1 && (
                      <>
                        <button
                          onClick={language === 'ar' ? nextImage : prevImage}
                          className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-full p-3 md:p-4 hover:bg-white transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-110"
                          aria-label={language === 'ar' ? 'صورة سابقة' : 'Previous image'}
                        >
                          <IconChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
                        </button>
                        <button
                          onClick={language === 'ar' ? prevImage : nextImage}
                          className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-full p-3 md:p-4 hover:bg-white transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-110"
                          aria-label={language === 'ar' ? 'صورة تالية' : 'Next image'}
                        >
                          <IconChevronRight className="w-6 h-6 md:w-7 md:h-7" />
                        </button>
                        
                        <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 bg-black/70 text-white px-4 py-2 rounded-full text-sm md:text-base font-medium backdrop-blur-sm shadow-lg">
                          {activeImageIndex + 1} / {activeImages.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-amber-50/50 to-amber-100/30 flex items-center justify-center flex-col p-8">
                    <IconDesign className="w-20 h-20 md:w-24 md:h-24 text-amber-300 mb-6" />
                    <p className="text-amber-600 font-medium text-lg md:text-xl text-center">
                      {language === 'ar' ? 'لا توجد صور للمشروع' : 'No project images available'}
                    </p>
                    <p className="text-amber-500 text-sm mt-2 text-center">
                      {language === 'ar' 
                        ? 'سيتم إضافة الصور قريباً'
                        : 'Images will be added soon'
                      }
                    </p>
                  </div>
                )}
              </div>
              
              {(project.beforeImages?.length > 0 || project.afterImages?.length > 0 || project.galleryImages?.length > 0) && (
                <div className="border-t border-gray-100 p-4 md:p-6 bg-gray-50/50">
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {project.afterImages?.length > 0 && (
                      <button
                        onClick={() => {
                          setActiveTab("after");
                          setActiveImageIndex(0);
                        }}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap text-sm md:text-base flex items-center gap-2 ${
                          activeTab === "after"
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${activeTab === "after" ? "bg-white" : "bg-green-500"}`}></div>
                        {language === 'ar' ? 'بعد التنفيذ' : 'After'}
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                          {project.afterImages.length}
                        </span>
                      </button>
                    )}
                    {project.beforeImages?.length > 0 && (
                      <button
                        onClick={() => {
                          setActiveTab("before");
                          setActiveImageIndex(0);
                        }}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap text-sm md:text-base flex items-center gap-2 ${
                          activeTab === "before"
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${activeTab === "before" ? "bg-white" : "bg-red-500"}`}></div>
                        {language === 'ar' ? 'قبل التنفيذ' : 'Before'}
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                          {project.beforeImages.length}
                        </span>
                      </button>
                    )}
                    {project.galleryImages?.length > 0 && (
                      <button
                        onClick={() => {
                          setActiveTab("gallery");
                          setActiveImageIndex(0);
                        }}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap text-sm md:text-base flex items-center gap-2 ${
                          activeTab === "gallery"
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${activeTab === "gallery" ? "bg-white" : "bg-blue-500"}`}></div>
                        {language === 'ar' ? 'معرض الصور' : 'Gallery'}
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                          {project.galleryImages.length}
                        </span>
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
                    {activeImages.slice(0, 16).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setActiveImageIndex(index);
                          openLightbox(index);
                        }}
                        className={`relative rounded-lg md:rounded-xl overflow-hidden border-2 transition-all duration-300 group ${
                          activeImageIndex === index 
                            ? 'border-amber-500 shadow-lg scale-[1.02]' 
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                        aria-label={`${getText(project.title, language)} ${index + 1}`}
                      >
                        <WatermarkedImage 
                          src={image} 
                          alt={`${getText(project.title, language)} ${index + 1}`}
                          className="w-full h-20 md:h-24 object-cover group-hover:scale-110 transition-transform duration-300"
                          mode="centered-bottom"
                          watermarkText="DEMORE"
                          opacity={0.2}
                          preserveAspectRatio={true}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 text-white px-2 py-1 rounded text-xs">
                            {language === 'ar' ? 'تكبير' : 'Zoom'}
                          </div>
                        </div>
                        {activeImageIndex === index && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-amber-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                    {activeImages.length > 16 && (
                      <button
                        onClick={() => openLightbox(0, activeImages)}
                        className="rounded-lg md:rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 hover:border-amber-300 flex flex-col items-center justify-center p-4 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="text-2xl text-gray-400 mb-1">+</div>
                        <span className="text-xs md:text-sm text-gray-600 font-medium">
                          +{activeImages.length - 16}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {language === 'ar' ? 'عرض الكل' : 'View all'}
                        </span>
                      </button>
                    )}
                  </div>
                  
                  {activeImages.length > 8 && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => openLightbox(0, activeImages)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                      >
                        <IconZoom className="w-5 h-5" />
                        {language === 'ar' 
                          ? `عرض جميع الصور (${activeImages.length})`
                          : `View All Images (${activeImages.length})`
                        }
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* Project Description */}
              <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100/50">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl">
                      <IconDesign className="w-6 h-6 md:w-7 md:h-7 text-amber-700" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                        {language === 'ar' ? 'وصف المشروع' : 'Project Description'}
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">
                        {language === 'ar' ? 'التفاصيل الكاملة للمشروع' : 'Complete project details'}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                    {language === 'ar' ? 'مفصل' : 'Detailed'}
                  </div>
                </div>
                <div className="prose prose-sm md:prose-lg max-w-none">
                  <div className="text-gray-700 leading-relaxed text-base md:text-lg lg:text-xl whitespace-pre-line bg-gradient-to-b from-gray-900 to-gray-800 bg-clip-text text-transparent">
                    {getText(project.fullDescription, language)}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-amber-50 rounded-xl">
                      <div className="text-2xl md:text-3xl font-bold text-amber-700 mb-1">
                        {activeImages.length}
                      </div>
                      <div className="text-xs md:text-sm text-amber-600">
                        {language === 'ar' ? 'صورة' : 'Images'}
                      </div>
                    </div>
                    
                    {project.year && (
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <div className="text-2xl md:text-3xl font-bold text-blue-700 mb-1">
                          {project.year}
                        </div>
                        <div className="text-xs md:text-sm text-blue-600">
                          {language === 'ar' ? 'سنة التنفيذ' : 'Year'}
                        </div>
                      </div>
                    )}
                    
                    {project.area && (
                      <div className="text-center p-4 bg-green-50 rounded-xl">
                        <div className="text-2xl md:text-3xl font-bold text-green-700 mb-1">
                          {project.area}
                        </div>
                        <div className="text-xs md:text-sm text-green-600">
                          {language === 'ar' ? 'متر مربع' : 'Square Meters'}
                        </div>
                      </div>
                    )}
                    
                    {project.duration && (
                      <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <div className="text-2xl md:text-3xl font-bold text-purple-700 mb-1">
                          {project.duration}
                        </div>
                        <div className="text-xs md:text-sm text-purple-600">
                          {language === 'ar' ? 'مدة التنفيذ' : 'Duration'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Before/After Comparison */}
              {project.beforeImages?.length > 0 && project.afterImages?.length > 0 && (
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl">
                        <div className="flex gap-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                          {language === 'ar' ? 'مقارنة قبل وبعد' : 'Before & After Comparison'}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {language === 'ar' 
                            ? 'شاهد عملية التحول الكاملة للمساحة'
                            : 'Witness the complete transformation of the space'
                          }
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                      className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base font-medium w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                      {showBeforeAfter 
                        ? (language === 'ar' ? 'إخفاء المقارنة' : 'Hide Comparison')
                        : (language === 'ar' ? 'عرض المقارنة' : 'Show Comparison')
                      }
                    </button>
                  </div>
                  
                  {showBeforeAfter && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                              <h4 className="text-base md:text-lg font-semibold text-gray-800">
                                {language === 'ar' ? 'قبل التنفيذ' : 'Before'}
                              </h4>
                            </div>
                            <span className="text-xs text-gray-500 bg-red-50 px-2 py-1 rounded">
                              {project.beforeImages.length} {language === 'ar' ? 'صورة' : 'images'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {project.beforeImages.slice(0, 4).map((image, index) => (
                              <div key={index} className="overflow-hidden rounded-lg group">
                                <WatermarkedImage 
                                  src={image} 
                                  alt={`${language === 'ar' ? 'قبل' : 'Before'} ${index + 1}`}
                                  className="w-full h-40 object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                                  onClick={() => openLightbox(index, project.beforeImages)}
                                  mode="centered-bottom"
                                  watermarkText="DEMORE"
                                  opacity={0.2}
                                  preserveAspectRatio={true}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <h4 className="text-base md:text-lg font-semibold text-gray-800">
                                {language === 'ar' ? 'بعد التنفيذ' : 'After'}
                              </h4>
                            </div>
                            <span className="text-xs text-gray-500 bg-green-50 px-2 py-1 rounded">
                              {project.afterImages.length} {language === 'ar' ? 'صورة' : 'images'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {project.afterImages.slice(0, 4).map((image, index) => (
                              <div key={index} className="overflow-hidden rounded-lg group">
                                <WatermarkedImage 
                                  src={image} 
                                  alt={`${language === 'ar' ? 'بعد' : 'After'} ${index + 1}`}
                                  className="w-full h-40 object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                                  onClick={() => openLightbox(index, project.afterImages)}
                                  mode="centered-bottom"
                                  watermarkText="DEMORE"
                                  opacity={0.2}
                                  preserveAspectRatio={true}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-amber-50 to-amber-100/30 rounded-xl p-6 border border-amber-200/50">
                        <h5 className="font-semibold text-amber-800 mb-3">
                          {language === 'ar' ? 'ملخص التحول' : 'Transformation Summary'}
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-amber-700">100%</div>
                            <div className="text-xs text-amber-600">{language === 'ar' ? 'رضا العملاء' : 'Client Satisfaction'}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-amber-700">
                              {project.beforeImages.length + project.afterImages.length}
                            </div>
                            <div className="text-xs text-amber-600">{language === 'ar' ? 'صور وثائقية' : 'Documentary Images'}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-amber-700">
                              {project.duration || '3 شهور'}
                            </div>
                            <div className="text-xs text-amber-600">{language === 'ar' ? 'مدة التحول' : 'Transformation Period'}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-amber-700">👍</div>
                            <div className="text-xs text-amber-600">{language === 'ar' ? 'نتائج مذهلة' : 'Amazing Results'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Work Details */}
              {project.workDetails && getText(project.workDetails, language) && (
                <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100/50">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6">
                    {language === 'ar' ? 'تفاصيل العمل' : 'Work Details'}
                  </h3>
                  <div className="space-y-4">
                    {getText(project.workDetails, language).split('\n').filter(line => line.trim()).map((line, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-amber-200 transition-all duration-300 group">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                          {index + 1}
                        </div>
                        <span className="text-gray-700 text-base pt-1">{line.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Challenges, Solutions & Results */}
              {(project.challenges?.length > 0 || project.designSolutions?.length > 0 || project.results?.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {project.challenges?.length > 0 && (
                    <div className="bg-gradient-to-br from-red-50/50 to-white rounded-2xl shadow-xl p-5 md:p-6 border border-red-100/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-xl">
                          <IconChallenge className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-bold text-red-800">
                            {language === 'ar' ? 'التحديات' : 'Challenges'}
                          </h3>
                          <p className="text-red-600/70 text-xs">
                            {language === 'ar' ? 'العقبات التي تم تجاوزها' : 'Overcome obstacles'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {project.challenges.map((challenge, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-100 hover:border-red-200 transition-colors">
                            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-red-700 text-sm md:text-base">{challenge}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {project.designSolutions?.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-50/50 to-white rounded-2xl shadow-xl p-5 md:p-6 border border-blue-100/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                          <IconSolution className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-bold text-blue-800">
                            {language === 'ar' ? 'الحلول' : 'Solutions'}
                          </h3>
                          <p className="text-blue-600/70 text-xs">
                            {language === 'ar' ? 'أفكار وتصاميم مبتكرة' : 'Innovative ideas & designs'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {project.designSolutions.map((solution, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-blue-700 text-sm md:text-base">{solution}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {project.results?.length > 0 && (
                    <div className="bg-gradient-to-br from-green-50/50 to-white rounded-2xl shadow-xl p-5 md:p-6 border border-green-100/50">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                          <IconResults className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-base md:text-lg font-bold text-green-800">
                            {language === 'ar' ? 'النتائج' : 'Results'}
                          </h3>
                          <p className="text-green-600/70 text-xs">
                            {language === 'ar' ? 'إنجازات ملموسة' : 'Tangible achievements'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {project.results.map((result, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-100 hover:border-green-200 transition-colors">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-green-700 text-sm md:text-base">{result}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6 md:space-y-8">
              {/* Project Info Card */}
              <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-5 md:p-6 border border-gray-100/50 sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                      <IconCalendar className="w-5 h-5 text-gray-700" />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">
                      {language === 'ar' ? 'معلومات المشروع' : 'Project Information'}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {language === 'ar' ? 'ثابتة' : 'Fixed'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {project.clientName && (
                    <div className="col-span-2 bg-gray-50/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <IconUser className="w-4 h-4 text-gray-500" />
                        <div className="text-xs text-gray-500">
                          {language === 'ar' ? 'العميل' : 'Client'}
                        </div>
                      </div>
                      <div className="font-bold text-gray-900 text-sm truncate" title={project.clientName}>
                        {project.clientName}
                      </div>
                    </div>
                  )}
                  
                  {project.city && (
                    <div className="bg-blue-50/50 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <IconLocation className="w-3 h-3 text-blue-500" />
                        <div className="text-xs text-blue-600">
                          {language === 'ar' ? 'المدينة' : 'City'}
                        </div>
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {project.city}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-amber-50/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <IconDesign className="w-3 h-3 text-amber-500" />
                      <div className="text-xs text-amber-600">
                        {language === 'ar' ? 'التصنيف' : 'Category'}
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {categoryDisplayName}
                    </div>
                  </div>
                  
                  {project.area && (
                    <div className="bg-green-50/50 rounded-xl p-3">
                      <div className="text-xs text-green-600 mb-1">
                        {language === 'ar' ? 'المساحة' : 'Area'}
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {project.area} {language === 'ar' ? 'م²' : 'm²'}
                      </div>
                    </div>
                  )}
                  
                  {project.year && (
                    <div className="bg-purple-50/50 rounded-xl p-3">
                      <div className="text-xs text-purple-600 mb-1">
                        {language === 'ar' ? 'السنة' : 'Year'}
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {project.year}
                      </div>
                    </div>
                  )}
                  
                  {project.duration && (
                    <div className="bg-cyan-50/50 rounded-xl p-3">
                      <div className="text-xs text-cyan-600 mb-1">
                        {language === 'ar' ? 'المدة' : 'Duration'}
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">
                        {project.duration}
                      </div>
                    </div>
                  )}
                  
                  {project.budget && (
                    <div className="col-span-2 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 mt-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-green-600 mb-1">
                            {language === 'ar' ? 'الميزانية' : 'Budget'}
                          </div>
                          <div className="font-bold text-gray-900">
                            {project.budget}
                          </div>
                        </div>
                        <div className="text-2xl">💰</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="col-span-2 mt-2 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-white p-3 rounded-xl">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          {language === 'ar' ? 'حالة المشروع' : 'Project Status'}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-green-700 font-semibold text-sm">
                            {language === 'ar' ? 'مشروع مكتمل' : 'Project Completed'}
                          </span>
                        </div>
                      </div>
                      <div className="text-2xl">✅</div>
                    </div>
                    
                    {project.updatedAt && (
                      <div className="text-xs text-gray-500 text-center mt-3">
                        {language === 'ar' ? 'آخر تحديث' : 'Last updated'}: {
                          project.updatedAt.toDate ? 
                            project.updatedAt.toDate().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }) : 
                            new Date(project.updatedAt.seconds * 1000).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                        }
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="sticky top-[400px] space-y-4">
                {project.features && project.features.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg">
                        <IconStar className="w-5 h-5 text-amber-700" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {language === 'ar' ? 'الميزات' : 'Features'}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {project.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-amber-50/30 rounded-lg">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                      {project.features.length > 3 && (
                        <div className="text-center text-xs text-amber-600 mt-2">
                          +{project.features.length - 3} {language === 'ar' ? 'ميزة أخرى' : 'more features'}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {project.colors && project.colors.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100/50">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {language === 'ar' ? 'الألوان' : 'Colors'}
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                      {project.colors.slice(0, 5).map((color, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: color }}
                            title={color}
                          ></div>
                        </div>
                      ))}
                      {project.colors.length > 5 && (
                        <div className="flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-xs text-gray-600">+{project.colors.length - 5}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="sticky bottom-6 mt-4">
                  <button 
                    onClick={handleSimilarProjectClick}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] text-sm md:text-base"
                  >
                    {language === 'ar' ? ' اطلب مشروع مماثل' : ' Request Similar Project'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <button
          onClick={handleShareProject}
          className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-3 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 group"
          aria-label={language === 'ar' ? 'مشاركة' : 'Share'}
          title={language === 'ar' ? 'مشاركة المشروع' : 'Share project'}
        >
          <IconShare className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        </button>
        
        <button
          onClick={scrollToGallery}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-3 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 group"
          aria-label={language === 'ar' ? 'المعرض' : 'Gallery'}
          title={language === 'ar' ? 'انتقل إلى المعرض' : 'Go to gallery'}
        >
          <IconZoom className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
          language={language}
        />
      )}

      {/* Similar Project Request Modal */}
      {showSimilarProjectModal && project && (
        <SimilarProjectRequestModal
          project={project}
          language={language}
          onClose={closeSimilarProjectModal}
          onSubmit={handleSimilarProjectSubmit}
        />
      )}

      <style jsx="true">{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.3);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.5);
        }

        ::selection {
          background: rgba(245, 158, 11, 0.2);
        }
        
        /* تخصيص شريط التمرير للمصغرات */
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>    
    </div>
  );
}