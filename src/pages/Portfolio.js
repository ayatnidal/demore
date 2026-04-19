import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import WatermarkedImage from "../components/WatermarkedImage";

// ============== Custom Icons ==============
const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const StarIcon = ({ filled = false, className = "w-5 h-5" }) => (
  <svg className={`${className} ${filled ? 'text-amber-500' : 'text-gray-300'}`} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const CloseIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ArrowRight = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const CalendarIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const BedIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ChildIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LivingRoomIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
  </svg>
);

const OfficeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const KitchenIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2M6 19v2M5 9h14l1 12H4L5 9z" />
  </svg>
);

const BathroomIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const AllProjectsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const CheckIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const MasterBedroomIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 15h6M9 11h6" />
  </svg>
);

const GirlsBedroomIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16v12H4z" />
    <circle cx="8" cy="12" r="2" fill="currentColor" />
    <circle cx="16" cy="12" r="2" fill="currentColor" />
  </svg>
);

const BoysBedroomIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16v12H4z" />
    <rect x="7" y="10" width="2" height="4" fill="currentColor" />
    <rect x="15" y="10" width="2" height="4" fill="currentColor" />
  </svg>
);

const SalonIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
  </svg>
);

const FullProjectsIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const DressingRoomIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const LaundryRoomIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v16h16V4H4zm2 4h12v10H6V8zm2 2v6h8v-6H8z" />
    <circle cx="12" cy="13" r="2" fill="currentColor" />
  </svg>
);

const StorageRoomIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

// ============== Animation Variants ==============
const cinematicVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// ============== Floating Particles Component ==============
const FloatingParticles = ({ count = 25 }) => {
  const particles = Array.from({ length: count });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-r from-white/5 to-white/10"
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: Math.random() * 15 + 8,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
};

// ============== Base Category Definitions (without filtering) ==============
const allDesignCategories = [
  // Residential categories
  { 
    id: "residential", 
    name: { ar: "سكني", en: "Residential" },
    subcategories: [
      { id: "all", name: { ar: "الكل", en: "All" } },
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
      { id: "all", name: { ar: "الكل", en: "All" } },
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
  // Interior Rooms - First option is "Full Projects"
  { 
    id: "interior_rooms", 
    name: { ar: "الغرف الداخلية", en: "Interior Rooms" },
    subcategories: [
      { id: "full_projects", name: { ar: "مشاريع كاملة", en: "Full Projects" } },
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
      { id: "dressing_room", name: { ar: "غرفة ملابس", en: "Dressing Room" } },
      { id: "laundry_room", name: { ar: "غرفة غسيل", en: "Laundry Room" } },
      { id: "storage_room", name: { ar: "غرفة تخزين", en: "Storage Room" } }
    ]
  },
];

// ============== Main Category Data ==============
const mainCategories = [
  { 
    id: "all", 
    name: { ar: "جميع المشاريع", en: "All Projects" },
    description: { 
      ar: "استعرض جميع مشاريعنا بكل فئاتها",
      en: "Browse all our projects across all categories"
    },
    color: "from-gray-900 to-black",
    icon: AllProjectsIcon
  },
  { 
    id: "residential", 
    name: { ar: "سكني", en: "Residential" },
    description: { 
      ar: "تصاميم سكنية فريدة تناسب أسلوب حياتك",
      en: "Unique residential designs for your lifestyle"
    },
    color: "from-blue-600 to-blue-800",
    icon: BedIcon
  },
  { 
    id: "commercial", 
    name: { ar: "تجاري", en: "Commercial" },
    description: { 
      ar: "حلول تجارية مبتكرة تزيد من إنتاجيتك",
      en: "Innovative commercial solutions to boost productivity"
    },
    color: "from-emerald-600 to-emerald-800",
    icon: OfficeIcon
  }
];

// ============== Quick Filter Categories (will be filtered dynamically) ==============
const allQuickFilterCategories = [
  { 
    id: "featured", 
    name: { ar: "مميزة", en: "Featured" },
    icon: StarIcon,
    color: "from-amber-500 to-amber-600",
    type: "featured",
    value: "featured"
  },
  { 
    id: "bathroom", 
    name: { ar: "حمامات", en: "Bathrooms" },
    icon: BathroomIcon,
    color: "from-cyan-500 to-cyan-600",
    type: "interiorRooms",
    value: "bathroom"
  },
  { 
    id: "kitchen", 
    name: { ar: "مطابخ", en: "Kitchens" },
    icon: KitchenIcon,
    color: "from-amber-500 to-amber-600",
    type: "interiorRooms",
    value: "kitchen"
  },
  { 
    id: "salon_room", 
    name: { ar: "صالون", en: "Salon" },
    icon: SalonIcon,
    color: "from-purple-500 to-purple-600",
    type: "interiorRooms",
    value: "salon_room"
  },
  { 
    id: "living_room", 
    name: { ar: "غرفة معيشة", en: "Living Room" },
    icon: LivingRoomIcon,
    color: "from-blue-500 to-blue-600",
    type: "interiorRooms",
    value: "living_room"
  },
  { 
    id: "master_bedroom", 
    name: { ar: "غرف نوم رئيسية", en: "Master Bedrooms" },
    icon: MasterBedroomIcon,
    color: "from-indigo-500 to-indigo-600",
    type: "interiorRooms",
    value: "master_bedroom"
  },
  { 
    id: "children_room", 
    name: { ar: "غرف نوم اطفال", en: "Children's Rooms" },
    icon: ChildIcon,
    color: "from-pink-500 to-pink-600",
    type: "interiorRooms",
    value: "children_room"
  },
  { 
    id: "Girls_Bedroom", 
    name: { ar: "غرف نوم بنات", en: "Girls' Bedrooms" },
    icon: GirlsBedroomIcon,
    color: "from-rose-500 to-rose-600",
    type: "interiorRooms",
    value: "Girls_Bedroom"
  },
  { 
    id: "Boys_Bedroom", 
    name: { ar: "غرف نوم اولاد", en: "Boys' Bedrooms" },
    icon: BoysBedroomIcon,
    color: "from-sky-500 to-sky-600",
    type: "interiorRooms",
    value: "Boys_Bedroom"
  },
  { 
    id: "full_projects", 
    name: { ar: "مشاريع كاملة", en: "Full Projects" },
    icon: FullProjectsIcon,
    color: "from-purple-500 to-purple-600",
    type: "interiorRooms",
    value: "full_projects"
  },
    { 
    id: "dressing_room", 
    name: { ar: "غرفة ملابس", en: "Dressing Room" },
    icon: DressingRoomIcon,
    color: "from-teal-500 to-teal-600",
    type: "interiorRooms",
    value: "dressing_room"
  },
  { 
    id: "laundry_room", 
    name: { ar: "غرفة غسيل", en: "Laundry Room" },
    icon: LaundryRoomIcon,
    color: "from-slate-500 to-slate-600",
    type: "interiorRooms",
    value: "laundry_room"
  },
  { 
    id: "storage_room", 
    name: { ar: "غرفة تخزين", en: "Storage Room" },
    icon: StorageRoomIcon,
    color: "from-stone-500 to-stone-600",
    type: "interiorRooms",
    value: "storage_room"
  }
];

// ============== Helper function to filter categories based on projects ==============
const filterCategoriesByProjects = (projects, categories) => {
  if (!projects || projects.length === 0) return [];
  
  // Get all unique values from projects
  const availableMainCategories = new Set();
  const availableSubCategories = new Map(); // Map<mainCategoryId, Set<subCategoryId>>
  const availableSpecializations = new Set();
  const availableInteriorRooms = new Set();
  
  projects.forEach(project => {
    if (project.category) {
      // Main categories
      if (project.category.mainCategory) {
        availableMainCategories.add(project.category.mainCategory);
      }
      
      // Sub categories
      if (project.category.mainCategory && project.category.subCategory) {
        if (!availableSubCategories.has(project.category.mainCategory)) {
          availableSubCategories.set(project.category.mainCategory, new Set());
        }
        availableSubCategories.get(project.category.mainCategory).add(project.category.subCategory);
      }
      
      // Specializations
      if (project.category.specialization) {
        availableSpecializations.add(project.category.specialization);
      }
      
      // Interior rooms
      if (project.category.interiorRooms && Array.isArray(project.category.interiorRooms)) {
        project.category.interiorRooms.forEach(room => {
          if (room) availableInteriorRooms.add(room);
        });
      }
    }
  });
  
  // Filter design categories
  const filteredCategories = categories.map(category => {
    if (category.id === "specializations") {
      // Filter specializations
      const filteredSubs = category.subcategories.filter(sub => 
        sub.id === "all" || availableSpecializations.has(sub.id)
      );
      return { ...category, subcategories: filteredSubs };
    }
    else if (category.id === "interior_rooms") {
      // Filter interior rooms
      const filteredSubs = category.subcategories.filter(sub => 
        sub.id === "full_projects" || availableInteriorRooms.has(sub.id)
      );
      return { ...category, subcategories: filteredSubs };
    }
    else {
      // Filter residential/commercial subcategories
      const filteredSubs = category.subcategories.filter(sub => {
        if (sub.id === "all") return true;
        const availableForCategory = availableSubCategories.get(category.id);
        return availableForCategory && availableForCategory.has(sub.id);
      });
      return { ...category, subcategories: filteredSubs };
    }
  });
  
  // Only keep categories that have at least one subcategory (besides "all")
  const finalCategories = filteredCategories.filter(category => {
    if (category.id === "specializations") {
      return category.subcategories.length > 0;
    }
    if (category.id === "interior_rooms") {
      return category.subcategories.length > 0;
    }
    // For residential/commercial, keep if there's at least one subcategory besides "all" or if the main category exists in projects
    const hasValidSubs = category.subcategories.some(sub => sub.id !== "all");
    const mainCategoryExists = availableMainCategories.has(category.id);
    return hasValidSubs || mainCategoryExists;
  });
  
  return finalCategories;
};

const filterQuickFiltersByProjects = (projects, quickFilters) => {
  if (!projects || projects.length === 0) return [];
  
  const availableInteriorRooms = new Set();
  let hasFeatured = false;
  
  projects.forEach(project => {
    if (project.isFeatured) hasFeatured = true;
    
    if (project.category && project.category.interiorRooms && Array.isArray(project.category.interiorRooms)) {
      project.category.interiorRooms.forEach(room => {
        if (room) availableInteriorRooms.add(room);
      });
    }
  });
  
  // Filter quick filters
  const filteredFilters = quickFilters.filter(filter => {
    if (filter.type === "featured") {
      return hasFeatured;
    }
    if (filter.type === "interiorRooms") {
      return availableInteriorRooms.has(filter.value);
    }
    return false;
  });
  
  return filteredFilters;
};

// ============== Sort Options ==============
const sortOptions = [
  { id: "newest", name: { ar: "الأحدث أولاً", en: "Newest First" } },
  { id: "oldest", name: { ar: "الأقدم أولاً", en: "Oldest First" } },
  { id: "featured", name: { ar: "المميزة أولاً", en: "Featured First" } },
  { id: "name_asc", name: { ar: "الأبجدي (أ-ي)", en: "Alphabetical (A-Z)" } },
  { id: "name_desc", name: { ar: "الأبجدي (ي-أ)", en: "Alphabetical (Z-A)" } },
  { id: "year_desc", name: { ar: "أحدث سنة أولاً", en: "Newest Year First" } },
  { id: "year_asc", name: { ar: "أقدم سنة أولاً", en: "Oldest Year First" } },
  { id: "featured_only", name: { ar: "المشاريع المميزة فقط", en: "Featured Only" } }
];

// ============== Helper function to get subcategory name ==============
const getSubcategoryName = (subCategoryId, mainCategoryId, language, designCategories) => {
  if (!subCategoryId || !mainCategoryId) return '';
  const mainCategory = designCategories.find(cat => cat.id === mainCategoryId);
  if (mainCategory) {
    const subCat = mainCategory.subcategories?.find(sub => sub.id === subCategoryId);
    return subCat?.name[language] || subCat?.name.en || subCategoryId;
  }
  return subCategoryId;
};

// ============== Enhanced normalize value function with full search support ==============
const normalizeValue = (value) => {
  if (!value) return "";
  
  const valueStr = String(value).toLowerCase().trim();
  
  if (valueStr === "") return "";
  
  // Comprehensive Arabic to English mapping
  const arabicToEnglishMap = {
      // Main categories
      "سكني": "residential",
      "تجاري": "commercial",
      
      // Residential subcategories
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
      
      // Commercial subcategories
      "مكاتب": "offices",
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
      "فنادق": "hotels",
      "فندق": "hotels",
      "صالات رياضية": "gyms",
      "صالة رياضية": "gyms",
      "مدارس": "schools",
      "مدرسة": "schools",
      
      // Specializations
      "داخلي": "interior",
      "خارجي": "exterior", 
      "تنسيق حدائق": "landscape",
      "لاندسكيب": "landscape",
      "داخلي وخارجي": "both",
      
      // Interior Rooms - Full support for all search terms
      "غرفة المعيشة": "living_room",
      "غرفة معيشة": "living_room",
      "معيشة": "living_room",
      "ليفينج": "living_room",
      "صالون": "salon_room",
      "صالة": "salon_room",
      "مطبخ": "kitchen",
      "مطابخ": "kitchen",
      "كيتشن": "kitchen",
      "غرفة الطعام": "dining_room",
      "طعام": "dining_room",
      "دينينج": "dining_room",
      "حمام": "bathroom",
      "حمامات": "bathroom",
      "بانيو": "bathroom",
      "مكتب منزلي": "home_office",
      "غرفة نوم رئيسية": "master_bedroom",
      "غرفة نوم رئيسي": "master_bedroom",
      "غرف نوم رئيسية": "master_bedroom",
      "ماستر": "master_bedroom",
      "غرفة أطفال": "children_room",
      "غرف نوم اطفال": "children_room",
      "اطفال": "children_room",
      "غرفة ضيوف": "guest_room",
      "ضيوف": "guest_room",
      "مكتبة": "library",
      "غرفة نوم الاولاد": "Boys_Bedroom",
      "غرف نوم اولاد": "Boys_Bedroom",
      "اولاد": "Boys_Bedroom",
      "غرفة نوم البنات": "Girls_Bedroom",
      "غرف نوم بنات": "Girls_Bedroom",
      "بنات": "Girls_Bedroom",
      "غرفة نوم ثانوية": "Second_Bedroom",
      "غرفة نوم ثاني": "Second_Bedroom",
      "ثانوي": "Second_Bedroom",
      "غرفة صلاة": "prayer_room",
      "صلاة": "prayer_room",
      "مشاريع كاملة": "full_projects",
      "مشروع كامل": "full_projects",
      "كامل": "full_projects",
      "الكل": "all",
      "كل": "all",
      "غرفة ملابس": "dressing_room",
      "غرف ملابس": "dressing_room",
      "ملابس": "dressing_room",
      "دريسنج": "dressing_room",
      "غرفة غسيل": "laundry_room",
      "غرف غسيل": "laundry_room",
      "غسيل": "laundry_room",
      "لاندرى": "laundry_room",
      "لاندروم": "laundry_room",
      "غرفة تخزين": "storage_room",
      "غرف تخزين": "storage_room",
      "تخزين": "storage_room",
      "ستوريج": "storage_room",
  };
  
  const englishNormalizationMap = {
      // Residential
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
      "studio": "studios",
      "studios": "studios",
      "chalet": "chalets",
      "chalets": "chalets",
      "cabin": "cabin",
      "roof": "roof",
      "dressing room": "dressing_room",
      "dressing_room": "dressing_room",
      "walk in closet": "dressing_room",
      "laundry room": "laundry_room",
      "laundry_room": "laundry_room",
      "storage room": "storage_room",
      "storage_room": "storage_room",
      "storeroom": "storage_room",
      
      // Commercial
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
      
      // Specializations
      "interior": "interior",
      "exterior": "exterior", 
      "landscape": "landscape",
      "both": "both",
      "interior & exterior": "both",
      
      // Interior Rooms
      "living room": "living_room",
      "living_room": "living_room",
      "salon_room": "salon_room",
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
      "boys bedroom": "Boys_Bedroom",
      "boys_bedroom": "Boys_Bedroom",
      "girls bedroom": "Girls_Bedroom",
      "girls_bedroom": "Girls_Bedroom",
      "prayer room": "prayer_room",
      "prayer_room": "prayer_room",
      "full projects": "full_projects",
      "full_projects": "full_projects",
      "second bedroom": "Second_Bedroom",
      "second_bedroom": "Second_Bedroom",
      "all": "all"
  };
    
  // First check direct mapping
  if (englishNormalizationMap[valueStr]) {
    return englishNormalizationMap[valueStr];
  }
  
  // Then check Arabic mapping
  if (arabicToEnglishMap[valueStr]) {
    return arabicToEnglishMap[valueStr];
  }
  
  // Check for partial matches
  for (const [arabic, english] of Object.entries(arabicToEnglishMap)) {
    if (valueStr.includes(arabic) || arabic.includes(valueStr)) {
      return english;
    }
  }
  
  // Clean and try again
  const cleanedValue = valueStr.replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  if (englishNormalizationMap[cleanedValue]) {
    return englishNormalizationMap[cleanedValue];
  }
  
  // Special handling for common search terms
  if (valueStr.includes("حمام") || valueStr.includes("بانيو") || valueStr === "bath" || valueStr === "bathroom") {
    return "bathroom";
  }
  if (valueStr.includes("مطبخ") || valueStr === "kitchen") {
    return "kitchen";
  }
  if (valueStr.includes("نوم") || valueStr.includes("bedroom") || valueStr === "bed") {
    if (valueStr.includes("رئيس") || valueStr.includes("master")) return "master_bedroom";
    if (valueStr.includes("اطفال") || valueStr.includes("children") || valueStr.includes("kids")) return "children_room";
    if (valueStr.includes("اولاد") || valueStr.includes("boys")) return "Boys_Bedroom";
    if (valueStr.includes("بنات") || valueStr.includes("girls")) return "Girls_Bedroom";
    return "master_bedroom";
  }
  if (valueStr.includes("living") || valueStr === "liv") {
    return "living_room";
  }
  if (valueStr === "salon" || valueStr === "salons") {
    return "salon_room";
  }
  
  return cleanedValue || valueStr;
};

// ============== Enhanced filter matching function ==============
const projectMatchesFilter = (project, filter, quickFilters, sortOption) => {
  // If no active filters, show all projects
  const hasActiveFilters = filter?.mainCategory !== "all" || 
                          (filter?.subCategories?.length > 0 && !filter?.subCategories?.includes("all")) ||
                          (filter?.specializations?.length > 0) ||
                          (filter?.interiorRooms?.length > 0) ||
                          (filter?.exteriorAreas?.length > 0) ||
                          (quickFilters?.length > 0) ||
                          sortOption === "featured_only";
  
  if (!hasActiveFilters) {
    return true;
  }
  
  if (!project.category) {
    return false;
  }
  
  // Check featured only first
  if (sortOption === "featured_only") {
    if (!project.isFeatured) return false;
    if (!hasActiveFilters || (filter?.mainCategory === "all" && !filter?.subCategories?.length && !filter?.specializations?.length && !filter?.interiorRooms?.length && !filter?.exteriorAreas?.length && !quickFilters?.length)) {
      return true;
    }
  }
  
  // Check quick filters first - they take priority
  if (quickFilters && quickFilters.length > 0) {
    return quickFilters.some(qf => {
      const qfValue = normalizeValue(qf.value);
      const qfType = qf.type;
      
      if (qfType === "interiorRooms") {
        const projectRooms = project.category.interiorRooms || [];
        
        // Normalize all project rooms
        const normalizedProjectRooms = projectRooms.map(room => {
          let normalized = normalizeValue(room);
          if (normalized === "salon" || normalized === "salons") {
            normalized = "salon_room";
          }
          return normalized;
        });
        
        const normalizedQfValue = normalizeValue(qfValue);
        
        return normalizedProjectRooms.includes(normalizedQfValue);
      }
      
      if (qfType === "featured") {
        return project.isFeatured === true;
      }
      
      return false;
    });
  }
  
  // No quick filters, check detailed filters
  const { mainCategory, subCategory, specialization, interiorRooms = [] } = project.category;
  
  // Check main category
  if (filter?.mainCategory && filter.mainCategory !== "all") {
    const normalizedProjectMain = normalizeValue(mainCategory);
    const normalizedFilterMain = normalizeValue(filter.mainCategory);
    
    if (normalizedProjectMain !== normalizedFilterMain) {
      return false;
    }
  }
  
  // Check sub categories - handle "all" selection
  if (filter?.subCategories && filter.subCategories.length > 0) {
    // If "all" is selected in subcategories, show all projects regardless of subcategory
    if (filter.subCategories.includes("all")) {
      // Skip subcategory filtering
    } else {
      if (!subCategory || subCategory === "") {
        return false;
      }
      
      const normalizedProjectSub = normalizeValue(subCategory);
      const normalizedFilterSubs = filter.subCategories.map(normalizeValue);
      
      if (!normalizedFilterSubs.includes(normalizedProjectSub)) {
        return false;
      }
    }
  }
  
  // Check specializations
  if (filter?.specializations && filter.specializations.length > 0) {
    if (specialization) {
      const normalizedProjectSpec = normalizeValue(specialization);
      const normalizedFilterSpecs = filter.specializations.map(normalizeValue);
      
      if (!normalizedFilterSpecs.includes(normalizedProjectSpec)) {
        return false;
      }
    } else {
      return false;
    }
  }
  
  // Check interior rooms
  if (filter?.interiorRooms && filter.interiorRooms.length > 0) {
    // Check if the selected specialization is interior or both
    const selectedSpecializations = filter.specializations || [];
    const hasInteriorSpec = selectedSpecializations.some(spec => 
      normalizeValue(spec) === "interior" || normalizeValue(spec) === "both"
    );
    
    // If no specialization selected, or if interior/both is selected, then apply interior rooms filter
    if (selectedSpecializations.length === 0 || hasInteriorSpec) {
      if (!Array.isArray(interiorRooms) || interiorRooms.length === 0) {
        return false;
      }
      
      const normalizedFilterRooms = filter.interiorRooms.map(normalizeValue);
      const normalizedProjectRooms = interiorRooms.map(room => {
        let normalized = normalizeValue(room);
        if (normalized === "salon" || normalized === "salons") {
          normalized = "salon_room";
        }
        return normalized;
      });
      
      const hasMatch = normalizedFilterRooms.some(filterRoom => 
        normalizedProjectRooms.includes(filterRoom)
      );
      
      if (!hasMatch) {
        return false;
      }
    }
  }
  
  return true;
};

// ============== Get category names helper ==============
const getCategoryNames = (categoryIds, categoryType, language, designCategories) => {
  if (!categoryIds || !Array.isArray(categoryIds)) return [];
  
  const categoryData = designCategories.find(cat => cat.id === categoryType);
  if (!categoryData || !categoryData.subcategories) return [];
  
  return categoryIds.map(id => {
    const item = categoryData.subcategories.find(sub => sub.id === id);
    return item ? item.name[language] : id;
  });
};

// ============== Sort Dropdown Component ==============
const SortDropdown = React.memo(({ 
  language, 
  selectedSort, 
  onSortChange 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = sortOptions.find(option => option.id === selectedSort) || sortOptions[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSortSelect = (sortId) => {
    onSortChange(sortId);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full sm:w-auto min-w-[200px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl hover:border-amber-500 transition-all duration-300 text-gray-700"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {selectedSort === "featured_only" ? (
            <StarIcon filled={true} className="w-4 h-4 text-amber-500 flex-shrink-0" />
          ) : (
            <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
          )}
          <span className="font-medium truncate">{selectedOption.name[language]}</span>
        </div>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
          >
            <div className="py-1 max-h-60 overflow-y-auto custom-scrollbar">
              {sortOptions.map((option) => {
                const isFeaturedOption = option.id === "featured_only";
                const isSelected = selectedSort === option.id;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSortSelect(option.id)}
                    className={`w-full px-4 py-3 text-right hover:bg-gray-50 transition-colors flex items-center justify-between ${
                      isSelected ? 'text-amber-600 bg-amber-50' : 'text-gray-700'
                    } ${isFeaturedOption ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {isFeaturedOption && (
                        <StarIcon 
                          filled={isSelected} 
                          className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-amber-500' : 'text-gray-400'}`} 
                        />
                      )}
                      <span className="truncate">{option.name[language]}</span>
                    </div>
                    {isSelected && (
                      <CheckIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

SortDropdown.displayName = 'SortDropdown';

// ============== Quick Filter Bar Component ==============
const QuickFilterBar = React.memo(({
  language,
  selectedQuickFilters,
  onQuickFilterToggle,
  onClearQuickFilters,
  selectedSort,
  onSortChange,
  availableQuickFilters
}) => {
  const scrollContainerRef = useRef(null);

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

  const handleFilterClick = (filter) => {
    if (filter.type === "featured") {
      onSortChange(selectedSort === "featured_only" ? "year_desc" : "featured_only");
      return;
    }
    onQuickFilterToggle(filter);
  };

  const isFeaturedSelected = selectedSort === "featured_only";

  // Only show available quick filters
  const filteredQuickFilters = availableQuickFilters;

  if (filteredQuickFilters.length === 0 && !isFeaturedSelected && selectedQuickFilters.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-xs xs:text-sm font-medium text-gray-700 whitespace-nowrap">
          {language === 'ar' ? 'فلترة سريعة:' : 'Quick Filter:'}
        </h3>
        
        {selectedQuickFilters.length > 0 && (
          <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-hide">
            {selectedQuickFilters.map((filter) => (
              <div
                key={filter.id}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-2xs font-medium bg-gradient-to-r ${filter.color} text-white whitespace-nowrap`}
              >
                {filter.icon && <filter.icon className="w-3 h-3" />}
                <span>{filter.name[language]}</span>
                <button
                  onClick={() => handleFilterClick(filter)}
                  className="ml-1 hover:text-white/80"
                >
                  <CloseIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {isFeaturedSelected && (
          <div className="flex items-center gap-1">
            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-2xs font-medium bg-gradient-to-r from-amber-500 to-amber-600 text-white whitespace-nowrap">
              <StarIcon filled={true} className="w-3 h-3" />
              <span>{language === 'ar' ? 'مميزة' : 'Featured'}</span>
              <button
                onClick={() => onSortChange("year_desc")}
                className="ml-1 hover:text-white/80"
              >
                <CloseIcon className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {(selectedQuickFilters.length > 0 || isFeaturedSelected) && (
          <button
            onClick={() => {
              onClearQuickFilters();
              if (isFeaturedSelected) {
                onSortChange("year_desc");
              }
            }}
            className="text-2xs xs:text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 whitespace-nowrap flex-shrink-0 ml-auto"
          >
            <CloseIcon className="w-3 h-3" />
            <span>{language === 'ar' ? 'مسح الكل' : 'Clear All'}</span>
          </button>
        )}
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide gap-1.5 xs:gap-2 pb-3 -mb-3 px-0.5"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {filteredQuickFilters.map((filter) => {
          const Icon = filter.icon;
          const isSelected = filter.type === "featured" 
            ? selectedSort === "featured_only"
            : selectedQuickFilters.some(f => f.id === filter.id);
          
          return (
            <motion.button
              key={filter.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleFilterClick(filter)}
              className={`relative flex-shrink-0 px-2 xs:px-3 py-1.5 xs:py-2 rounded-full text-2xs xs:text-xs font-medium transition-all duration-300 flex items-center gap-1 ${
                isSelected
                  ? `bg-gradient-to-r ${filter.color} text-white shadow-md`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {Icon && <Icon className={`w-3 h-3 xs:w-3.5 xs:h-3.5 ${isSelected ? 'text-white' : 'text-gray-600'}`} />}
              <span>{filter.name[language]}</span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-sm"
                >
                  <CheckIcon className="w-2 h-2 text-green-500" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});

QuickFilterBar.displayName = 'QuickFilterBar';

// ============== Flexible Filter Modal Component ==============
const FlexibleFilterModal = React.memo(({ 
  language, 
  currentFilters, 
  onApplyFilters, 
  onClose,
  availableCategories
}) => {
  const [selectedMainCategory, setSelectedMainCategory] = useState(currentFilters.mainCategory || "all");
  const [selectedSubCategories, setSelectedSubCategories] = useState(currentFilters.subCategories || []);
  const [selectedSpecializations, setSelectedSpecializations] = useState(currentFilters.specializations || []);
  const [selectedInteriorRooms, setSelectedInteriorRooms] = useState(currentFilters.interiorRooms || []);

  const handleMainCategorySelect = (categoryId) => {
    setSelectedMainCategory(categoryId);
    setSelectedSubCategories([]);
  };

  const handleSubCategoryToggle = (subCategoryId) => {
    setSelectedSubCategories(prev => {
      if (prev.includes(subCategoryId)) {
        return prev.filter(id => id !== subCategoryId);
      } else {
        return [...prev, subCategoryId];
      }
    });
  };

  const handleSpecializationToggle = (specializationId) => {
    setSelectedSpecializations(prev => {
      if (prev.includes(specializationId)) {
        return prev.filter(id => id !== specializationId);
      } else {
        return [...prev, specializationId];
      }
    });
  };

  const handleInteriorRoomToggle = (roomId) => {
    setSelectedInteriorRooms(prev => {
      if (prev.includes(roomId)) {
        return prev.filter(id => id !== roomId);
      } else {
        return [...prev, roomId];
      }
    });
  };

  const handleApply = () => {
    onApplyFilters({
      mainCategory: selectedMainCategory,
      subCategories: selectedSubCategories,
      specializations: selectedSpecializations,
      interiorRooms: selectedInteriorRooms,
      exteriorAreas: []
    });
    onClose();
  };

  const getCurrentSubCategories = () => {
    if (!selectedMainCategory || selectedMainCategory === "all") return [];
    const category = availableCategories.find(cat => cat.id === selectedMainCategory);
    return category ? category.subcategories : [];
  };

  const showInteriorRooms = () => {
    if (selectedMainCategory === "commercial") return false;
    if (selectedMainCategory === "all") return false;
    if (selectedSpecializations.length === 0) return false;
    
    return selectedSpecializations.some(spec => 
      normalizeValue(spec) === "interior" 
    );
  };

  const getAvailableSpecializations = () => {
    const specCat = availableCategories.find(cat => cat.id === "specializations");
    return specCat ? specCat.subcategories : [];
  };

  const getAvailableInteriorRooms = () => {
    const roomCat = availableCategories.find(cat => cat.id === "interior_rooms");
    return roomCat ? roomCat.subcategories : [];
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {language === 'ar' ? 'فلترة المشاريع' : 'Filter Projects'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <CloseIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {language === 'ar' ? 'الفئة الرئيسية' : 'Main Category'}
            </h3>
            <div className="flex flex-wrap gap-3">
              {mainCategories.map((category) => {
                const Icon = category.icon;
                const isSelected = selectedMainCategory === category.id;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => handleMainCategorySelect(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span className="font-medium">{category.name[language]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedMainCategory !== "all" && getCurrentSubCategories().length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {language === 'ar' ? 'الأنواع الفرعية' : 'Sub Categories'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {getCurrentSubCategories().map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleSubCategoryToggle(sub.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedSubCategories.includes(sub.id)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sub.name[language]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {getAvailableSpecializations().length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {language === 'ar' ? 'التخصصات' : 'Specializations'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {getAvailableSpecializations().map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => handleSpecializationToggle(spec.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedSpecializations.includes(spec.id)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {spec.name[language]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {showInteriorRooms() && getAvailableInteriorRooms().length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {language === 'ar' ? 'الغرف الداخلية' : 'Interior Rooms'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {getAvailableInteriorRooms().map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handleInteriorRoomToggle(room.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                      selectedInteriorRooms.includes(room.id)
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {room.name[language]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {language === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-md"
          >
            {language === 'ar' ? 'تطبيق' : 'Apply'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
});

FlexibleFilterModal.displayName = 'FlexibleFilterModal';

// ============== Search Component ==============
const SearchComponent = React.memo(({ 
  searchTerm, 
  onSearch, 
  onClear, 
  language, 
  placeholder,
  showClear = true 
}) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef(null);
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
    <div 
      ref={searchRef}
      className={`relative w-full transition-all duration-300 ${
        isFocused ? 'ring-2 ring-amber-500/20' : ''
      }`}
    >
      <div className="relative">
        <div className={`absolute inset-y-0 ${language === 'ar' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
          <SearchIcon className={`w-4 h-4 xs:w-5 xs:h-5 transition-colors duration-300 ${
            isFocused ? 'text-amber-500' : 'text-gray-400'
          }`} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || (language === 'ar' ? 'ابحث في المشاريع...' : 'Search projects...')}
          className={`w-full ${language === 'ar' ? 'pr-3 pl-9 xs:pl-10' : 'pl-3 pr-9 xs:pr-10'} py-2 xs:py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-amber-500 transition-all duration-300 text-gray-900 placeholder-gray-500 outline-none text-xs xs:text-sm sm:text-base`}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          aria-label={language === 'ar' ? 'بحث المشاريع' : 'Search projects'}
        />
        
        {showClear && localSearch && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClearSearch}
            className={`absolute inset-y-0 ${language === 'ar' ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200`}
            aria-label={language === 'ar' ? 'مسح البحث' : 'Clear search'}
          >
            <CloseIcon className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
          </motion.button>
        )}
      </div>
    </div>
  );
});

SearchComponent.displayName = 'SearchComponent';

// ============== Project Card Component ==============
const ProjectCard = React.memo(({ project, language, index, designCategories }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const getDisplayImage = () => {
    if (project.coverImage) return project.coverImage;
    if (project.afterImages?.length > 0) return project.afterImages[0];
    if (project.galleryImages?.length > 0) return project.galleryImages[0];
    if (project.beforeImages?.length > 0) return project.beforeImages[0];
    return "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80";
  };

  const getProjectName = () => {
    if (!project.projectName) return "";
    
    if (typeof project.projectName === 'object') {
      return project.projectName[language] || project.projectName.ar || project.projectName.en || " ";
    }
    
    const nameStr = String(project.projectName);
    if (nameStr.startsWith(" ") && nameStr.length > 20) {
      return language === 'ar' ? " " : " ";
    }
    
    return project.projectName;
  };

  const getCategoryBadges = () => {
    if (!project.category) return null;
    
    const badges = [];
    const { mainCategory, subCategory, specialization } = project.category;
    
    if (mainCategory) {
      badges.push({
        id: "main",
        text: mainCategory === "residential" 
          ? (language === 'ar' ? 'سكني' : 'Residential')
          : (language === 'ar' ? 'تجاري' : 'Commercial'),
        color: mainCategory === "residential" 
          ? "from-blue-100 to-blue-200 text-blue-700"
          : "from-emerald-100 to-emerald-200 text-emerald-700"
      });
    }
    
    if (subCategory) {
      badges.push({
        id: "sub",
        text: getSubcategoryName(subCategory, mainCategory, language, designCategories),
        color: "from-purple-100 to-purple-200 text-purple-700"
      });
    }
    
    if (specialization && specialization !== "both") {
      const specCat = designCategories.find(cat => cat.id === "specializations");
      const spec = specCat?.subcategories?.find(sub => sub.id === specialization);
      badges.push({
        id: "spec",
        text: spec?.name[language] || specialization,
        color: "from-amber-100 to-amber-200 text-amber-700"
      });
    }
    
    return badges;
  };

  const getRoomAndAreaBadges = () => {
    if (!project.category) return [];
    
    const { interiorRooms = [] } = project.category;
    const badges = [];
    
    const roomNames = getCategoryNames(interiorRooms, "interior_rooms", language, designCategories);
    
    roomNames.forEach((name, index) => {
      badges.push({
        id: `room-${index}`,
        text: name,
        color: "from-cyan-100 to-cyan-200 text-cyan-700",
        type: "room"
      });
    });
    
    return badges;
  };

  const getBriefDescription = () => {
    if (!project.briefDescription) return "";
    
    if (typeof project.briefDescription === 'object') {
      return project.briefDescription[language] || project.briefDescription.ar || project.briefDescription.en || "";
    }
    
    return project.briefDescription;
  };

  const handleCardClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    navigate(`/project/${project.id}`);
  }, [project.id, navigate]);

  const categoryBadges = getCategoryBadges();
  const roomAreaBadges = getRoomAndAreaBadges();
  
  const roomBadges = roomAreaBadges.filter(b => b.type === "room");

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={cinematicVariants}
      custom={index}
      className="group h-full"
    >
      <motion.div
        whileHover={{ y: -5 }}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-white rounded-xl xs:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 h-full cursor-pointer flex flex-col"
      >
        <div className="relative h-40 xs:h-44 sm:h-48 md:h-56 lg:h-64 xl:h-72 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
          <WatermarkedImage
            src={getDisplayImage()}
            alt={getProjectName()}
            className="w-full h-full object-cover transition-transform duration-700"
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            mode="centered-bottom"
            watermarkText="DEMORE"
            opacity={0.2}
            preserveAspectRatio={true}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {project.isFeatured && (
            <div className="absolute top-2 xs:top-3 right-2 xs:right-3 z-10">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-amber-600 to-amber-500 text-white px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 rounded-full text-2xs xs:text-xs font-bold shadow-lg flex items-center gap-0.5 xs:gap-1"
              >
                <StarIcon filled={true} className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
                <span className="hidden xs:inline">{language === 'ar' ? 'مميز' : 'Featured'}</span>
              </motion.div>
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            className="absolute bottom-2 xs:bottom-3 right-2 xs:right-3"
          >
            <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </div>
          </motion.div>
        </div>
        
        <div className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 flex-1 flex flex-col">
          <div className="flex flex-wrap gap-0.5 xs:gap-1 mb-1.5 xs:mb-2 sm:mb-3">
            {categoryBadges?.map((badge) => (
              <span
                key={badge.id}
                className={`inline-block px-1 xs:px-1.5 sm:px-2.5 py-0.25 xs:py-0.5 sm:py-1 rounded-full text-2xs xs:text-xs font-medium bg-gradient-to-r ${badge.color}`}
              >
                {badge.text}
              </span>
            ))}
          </div>
          
          <h3 className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-1 xs:mb-1.5 sm:mb-2 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
            {getProjectName()}
          </h3>
          
          {roomBadges.length > 0 && (
            <div className="mb-1 xs:mb-1.5 sm:mb-2 md:mb-3">
              <div className="flex items-center gap-0.5 xs:gap-1 mb-0.5 xs:mb-1">
                <BedIcon className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-blue-500 flex-shrink-0" />
                <span className="text-2xs xs:text-xs font-medium text-gray-700">
                  {language === 'ar' ? 'الغرف:' : 'Rooms:'}
                </span>
              </div>
              <div className="flex flex-wrap gap-0.5 xs:gap-1">
                {roomBadges.slice(0, 3).map((badge) => (
                  <span
                    key={badge.id}
                    className={`inline-flex items-center px-1 xs:px-1.5 sm:px-2 py-0.25 xs:py-0.5 rounded-full text-2xs xs:text-xs font-medium bg-gradient-to-r ${badge.color}`}
                  >
                    {badge.text}
                  </span>
                ))}
                {roomBadges.length > 3 && (
                  <span className="text-2xs xs:text-xs text-gray-500">+{roomBadges.length - 3}</span>
                )}
              </div>
            </div>
          )}
          
          <p className="text-2xs xs:text-xs sm:text-sm text-gray-600 mb-2 xs:mb-2.5 sm:mb-3 line-clamp-2 sm:line-clamp-3 leading-relaxed flex-1">
            {getBriefDescription()}
          </p>
          
          <div className="flex items-center justify-between mt-auto pt-1.5 xs:pt-2 border-t border-gray-100">
            {project.projectYear && (
              <div className="flex items-center text-gray-500 text-2xs xs:text-xs">
                <CalendarIcon className="w-2.5 h-2.5 xs:w-3 xs:h-3 ml-0.5 xs:ml-1 flex-shrink-0" />
                <span className="truncate">{project.projectYear}</span>
              </div>
            )}
            
            <span className="text-amber-600 hover:text-amber-700 font-medium text-2xs xs:text-xs flex items-center gap-0.5 xs:gap-1">
              {language === 'ar' ? 'التفاصيل' : 'Details'}
              <ArrowRight className="w-2.5 h-2.5 xs:w-3 xs:h-3" />
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

// ============== Active Filters Display ==============
const ActiveFiltersDisplay = React.memo(({ 
  language, 
  selectedCategory,
  selectedQuickFilters,
  selectedSort,
  onClearFilters,
  onRemoveFilter,
  onSortChange,
  onRemoveQuickFilter,
  onOpenFilterModal,
  designCategories
}) => {
  const hasActiveFilters = (selectedCategory?.mainCategory !== "all" && selectedCategory?.mainCategory) ||
                          selectedCategory?.subCategories?.length > 0 ||
                          selectedCategory?.specializations?.length > 0 ||
                          selectedCategory?.interiorRooms?.length > 0 ||
                          selectedCategory?.exteriorAreas?.length > 0 ||
                          selectedQuickFilters?.length > 0 ||
                          selectedSort === "featured_only";

  if (!hasActiveFilters) {
    return null;
  }

  const getFilterDisplay = () => {
    const filters = [];
    
    if (selectedSort === "featured_only") {
      filters.push({
        type: 'featured',
        id: 'featured',
        text: language === 'ar' ? 'المشاريع المميزة' : 'Featured Projects',
        color: 'from-amber-100 to-amber-200 text-amber-700'
      });
    }
    
    if (selectedQuickFilters && selectedQuickFilters.length > 0) {
      selectedQuickFilters.forEach(qf => {
        filters.push({
          type: 'quick',
          id: qf.id,
          text: qf.name[language],
          color: qf.color,
          isQuick: true
        });
      });
    }
    
    const mainCategory = mainCategories.find(c => c.id === selectedCategory?.mainCategory);
    if (mainCategory && selectedCategory?.mainCategory !== "all") {
      filters.push({
        type: 'main',
        id: 'main',
        text: mainCategory.name[language],
        color: 'from-blue-100 to-blue-200 text-blue-700'
      });
    }
    
    if (selectedCategory?.subCategories?.length > 0) {
      const mainCatData = designCategories.find(cat => cat.id === selectedCategory.mainCategory);
      const subCats = mainCatData ? mainCatData.subcategories : [];
      selectedCategory.subCategories.forEach(subId => {
        const sub = subCats.find(s => s.id === subId);
        if (sub && sub.id !== "all") {
          filters.push({
            type: 'sub',
            id: subId,
            text: sub.name[language],
            color: 'from-purple-100 to-purple-200 text-purple-700'
          });
        }
      });
    }
    
    if (selectedCategory?.specializations?.length > 0) {
      const specCat = designCategories.find(cat => cat.id === "specializations");
      const specs = specCat ? specCat.subcategories : [];
      selectedCategory.specializations.forEach(specId => {
        const spec = specs.find(s => s.id === specId);
        if (spec) {
          filters.push({
            type: 'spec',
            id: specId,
            text: spec.name[language],
            color: 'from-amber-100 to-amber-200 text-amber-700'
          });
        }
      });
    }
    
    if (selectedCategory?.interiorRooms?.length > 0) {
      const roomCat = designCategories.find(cat => cat.id === "interior_rooms");
      const rooms = roomCat ? roomCat.subcategories : [];
      selectedCategory.interiorRooms.forEach(roomId => {
        const room = rooms.find(r => r.id === roomId);
        if (room) {
          filters.push({
            type: 'room',
            id: roomId,
            text: room.name[language],
            color: 'from-cyan-100 to-cyan-200 text-cyan-700'
          });
        }
      });
    }
    
    return filters;
  };

  const filters = getFilterDisplay();

  if (filters.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-5 xs:mb-6 sm:mb-8 md:mb-10 p-4 xs:p-5 sm:p-6 md:p-8 bg-gradient-to-b from-white to-gray-50 rounded-xl sm:rounded-2xl border border-gray-200 shadow-lg"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 xs:gap-4 sm:gap-6 mb-3 xs:mb-4 sm:mb-5">
        <div>
          <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            {language === 'ar' ? 'التصفيات النشطة' : 'Active Filters'}
          </h3>
          <p className="text-xs xs:text-sm sm:text-base text-gray-600 mt-1">
            {language === 'ar' 
              ? 'المشاريع المعروضة بناءً على اختيارك'
              : 'Projects displayed based on your selection'
            }
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={onOpenFilterModal}
            className="text-xs xs:text-sm sm:text-base text-amber-600 hover:text-amber-700 font-medium px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-lg hover:bg-amber-50 transition-colors border border-amber-200"
          >
            {language === 'ar' ? 'تعديل' : 'Edit'}
          </button>
          
          <button
            onClick={() => {
              onClearFilters();
              if (selectedSort === "featured_only") {
                onSortChange("year_desc");
              }
            }}
            className="text-xs xs:text-sm sm:text-base text-gray-600 hover:text-gray-900 font-medium px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300"
          >
            {language === 'ar' ? 'مسح الكل' : 'Clear All'}
          </button>
        </div>
      </div>

      <div className="mt-3 xs:mt-4 sm:mt-5 pt-3 xs:pt-4 sm:pt-5 border-t border-gray-100">
        <div className="flex flex-wrap gap-2 xs:gap-2.5 sm:gap-3">
          {filters.map((filter, index) => (
            <div 
              key={`${filter.type}-${filter.id}-${index}`} 
              className={`inline-flex items-center px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 bg-gradient-to-r ${filter.color} rounded-full text-xs xs:text-sm sm:text-base font-medium`}
            >
              <span className="truncate max-w-[120px] xs:max-w-[150px] sm:max-w-[200px]">{filter.text}</span>
              <button
                onClick={() => {
                  if (filter.type === 'featured') {
                    onSortChange("year_desc");
                  } else if (filter.isQuick) {
                    onRemoveQuickFilter(filter);
                  } else {
                    onRemoveFilter(filter.type, filter.id);
                  }
                }}
                className="ml-1.5 xs:ml-2 sm:ml-3 hover:opacity-75"
                aria-label={language === 'ar' ? 'إزالة الفلتر' : 'Remove filter'}
              >
                <CloseIcon className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

ActiveFiltersDisplay.displayName = 'ActiveFiltersDisplay';

// ============== Main Portfolio Component ==============
export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [displayedProjects, setDisplayedProjects] = useState([]);
  const [projectsToShow, setProjectsToShow] = useState(8);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [availableCategories, setAvailableCategories] = useState(allDesignCategories);
  const [availableQuickFilters, setAvailableQuickFilters] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const savedFilter = localStorage.getItem('portfolioFilter');
    if (savedFilter) {
      try {
        const parsed = JSON.parse(savedFilter);
        return parsed;
      } catch (e) {
        return {
          mainCategory: "all",
          subCategories: [],
          specializations: [],
          interiorRooms: [],
          exteriorAreas: []
        };
      }
    }
    return {
      mainCategory: "all",
      subCategories: [],
      specializations: [],
      interiorRooms: [],
      exteriorAreas: []
    };
  });
  const [selectedQuickFilters, setSelectedQuickFilters] = useState(() => {
    const savedQuickFilters = localStorage.getItem('portfolioQuickFilters');
    if (savedQuickFilters) {
      try {
        return JSON.parse(savedQuickFilters);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem('portfolioSearchTerm') || "";
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sortOption, setSortOption] = useState(() => {
    return localStorage.getItem('portfolioSortOption') || "year_desc";
  });
  
  const { language, direction } = useLanguage();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  // Reset pagination when filters/search/sort change
  useEffect(() => {
    setProjectsToShow(8);
    setHasMore(true);
  }, [selectedCategory, selectedQuickFilters, searchTerm, sortOption]);

  // Update displayed projects when filteredProjects or projectsToShow changes
  useEffect(() => {
    const newDisplayedProjects = filteredProjects.slice(0, projectsToShow);
    setDisplayedProjects(newDisplayedProjects);
    setHasMore(newDisplayedProjects.length < filteredProjects.length);
  }, [filteredProjects, projectsToShow]);

  // Load more projects
  const loadMoreProjects = useCallback(() => {
    setProjectsToShow(prev => prev + 8);
  }, []);

  useEffect(() => {
    localStorage.setItem('portfolioFilter', JSON.stringify(selectedCategory));
  }, [selectedCategory]);

  useEffect(() => {
    localStorage.setItem('portfolioQuickFilters', JSON.stringify(selectedQuickFilters));
  }, [selectedQuickFilters]);

  useEffect(() => {
    localStorage.setItem('portfolioSearchTerm', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    localStorage.setItem('portfolioSortOption', sortOption);
  }, [sortOption]);

  const heroImages = [
    "/images/services_hero.jpg",
    "/images/services_hero1.jpg",
    "/images/services_hero2.jpg",
    "/images/services_hero3.jpg"
  ];

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
      setShowBackToTop(winScroll > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const fetchProjectsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const projectsRef = collection(db, "portfolioProjects");
      const allProjectsQuery = query(projectsRef);
      const allProjectsSnapshot = await getDocs(allProjectsQuery);
      
      const allProjects = [];
      
      allProjectsSnapshot.forEach((doc) => {
        const data = doc.data();
        const pageType = data.pageType || "";
        
        if (pageType !== "admin") {
          allProjects.push({ id: doc.id, ...data });
        }
      });
      
      if (allProjects.length === 0) {
        console.log("No projects found (excluding admin projects)");
        setProjects([]);
        setFilteredProjects([]);
        setLoading(false);
        return;
      }
      
      console.log(`Fetched ${allProjects.length} projects (excluding admin)`);
      
      const projectsData = allProjects.map((data) => {
        const docId = data.id;
        
        let processedCategory = {
          mainCategory: "",
          subCategory: "",
          specialization: "",
          interiorRooms: [],
          exteriorAreas: []
        };
        
        if (data.category && typeof data.category === 'object') {
          processedCategory = {
            mainCategory: data.category.mainCategory || "",
            subCategory: data.category.subCategory || "",
            specialization: data.category.specialization || "",
            interiorRooms: Array.isArray(data.category.interiorRooms) 
              ? data.category.interiorRooms 
              : (data.category.interiorRoom ? [data.category.interiorRoom] : []),
            exteriorAreas: Array.isArray(data.category.exteriorAreas) 
              ? data.category.exteriorAreas 
              : (data.category.exteriorArea ? [data.category.exteriorArea] : [])
          };
        } else {
          if (data.projectType) {
            if (data.projectType.includes("سكني") || data.projectType.includes("residential")) {
              processedCategory.mainCategory = "residential";
            } else if (data.projectType.includes("تجاري") || data.projectType.includes("commercial")) {
              processedCategory.mainCategory = "commercial";
            }
          }
          
          if (data.subType) {
            processedCategory.subCategory = data.subType;
          }
          
          if (data.specialization) {
            processedCategory.specialization = data.specialization;
          }
          
          if (data.interiorRoom) {
            processedCategory.interiorRooms = Array.isArray(data.interiorRoom) 
              ? data.interiorRoom 
              : [data.interiorRoom];
          }
          
          if (data.exteriorArea) {
            processedCategory.exteriorAreas = Array.isArray(data.exteriorArea) 
              ? data.exteriorArea 
              : [data.exteriorArea];
          }
        }
        
        processedCategory.mainCategory = normalizeValue(processedCategory.mainCategory);
        processedCategory.subCategory = normalizeValue(processedCategory.subCategory);
        processedCategory.specialization = normalizeValue(processedCategory.specialization);
        
        if (Array.isArray(processedCategory.interiorRooms)) {
          processedCategory.interiorRooms = processedCategory.interiorRooms.map(room => normalizeValue(room));
        }
        
        if (Array.isArray(processedCategory.exteriorAreas)) {
          processedCategory.exteriorAreas = processedCategory.exteriorAreas.map(area => normalizeValue(area));
        }
        
        let projectName = data.projectName || data.title || data.name || "";
        if (projectName && typeof projectName === 'string' && projectName.startsWith("Project ") && projectName.length > 20) {
          projectName = language === 'ar' ? "" : "";
        } else if (!projectName || projectName === "") {
          projectName = language === 'ar' ? "" : "";
        }
        
        if (typeof projectName === 'object') {
          projectName = projectName[language] || projectName.ar || projectName.en || "";
        }
        
        let createdAt = null;
        if (data.createdAt) {
          if (data.createdAt instanceof Date) {
            createdAt = data.createdAt;
          } else if (data.createdAt.seconds) {
            createdAt = new Date(data.createdAt.seconds * 1000);
          } else if (data.createdAt.toDate) {
            createdAt = data.createdAt.toDate();
          } else {
            createdAt = new Date(data.createdAt);
          }
        } else {
          createdAt = new Date();
        }
        
        let updatedAt = null;
        if (data.updatedAt) {
          if (data.updatedAt instanceof Date) {
            updatedAt = data.updatedAt;
          } else if (data.updatedAt.seconds) {
            updatedAt = new Date(data.updatedAt.seconds * 1000);
          } else if (data.updatedAt.toDate) {
            updatedAt = data.updatedAt.toDate();
          } else {
            updatedAt = new Date(data.updatedAt);
          }
        } else {
          updatedAt = createdAt;
        }
        
        const processedData = {
          id: docId,
          projectName: projectName,
          projectLocation: data.projectLocation || data.location || "",
          projectYear: data.projectYear || data.year || "",
          projectArea: data.projectArea || data.area || "",
          briefDescription: data.briefDescription || data.description || data.shortDescription || "",
          detailedDescription: data.detailedDescription || data.fullDescription || "",
          coverImage: data.coverImage || data.mainImage || data.featuredImage || data.image || "",
          beforeImages: data.beforeImages || [],
          afterImages: data.afterImages || [],
          featuredImage: data.featuredImage || "",
          galleryImages: data.galleryImages || data.additionalImages || data.images || [],
          isFeatured: Boolean(data.isFeatured || data.featured),
          isActive: data.isActive !== false,
          order: data.order || 999,
          duration: data.duration || "",
          budget: data.budget || "",
          createdAt: createdAt,
          updatedAt: updatedAt,
          createdBy: data.createdBy || "admin",
          pageType: data.pageType || "portfolio",
          category: processedCategory
        };
        
        return processedData;
      });
      
      projectsData.sort((a, b) => (a.order || 999) - (b.order || 999));
      
      const activeProjects = projectsData.filter(project => project.isActive !== false);
      
      console.log(`Processed ${activeProjects.length} active projects (excluding admin)`);
      
      setProjects(activeProjects);
      setFilteredProjects(activeProjects);
      
      // Filter categories based on actual projects
      const filteredCategories = filterCategoriesByProjects(activeProjects, allDesignCategories);
      setAvailableCategories(filteredCategories);
      
      // Filter quick filters based on actual projects
      const filteredQuickFilters = filterQuickFiltersByProjects(activeProjects, allQuickFilterCategories);
      setAvailableQuickFilters(filteredQuickFilters);
      
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError(language === 'ar' 
        ? 'حدث خطأ في تحميل المشاريع' 
        : 'Error loading projects'
      );
      setProjects([]);
      setFilteredProjects([]);
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchProjectsData();
  }, [fetchProjectsData]);

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

  const searchFilterAndSortProjects = useMemo(() => {
    return (projectsArray, searchValue, category, sortBy, quickFilters) => {
      let filtered = [...projectsArray];
      
      filtered = filtered.filter(project => 
        projectMatchesFilter(project, category, quickFilters, sortBy)
      );
      
      if (searchValue.trim() !== "") {
        const searchLower = searchValue.toLowerCase().trim();
        
        filtered = filtered.filter(project => {
          const normalizedSearch = normalizeValue(searchLower);
          
          const textFieldsMatch = [
            safeToLowerCase(project.projectName),
            safeToLowerCase(project.briefDescription),
            safeToLowerCase(project.detailedDescription),
            safeToLowerCase(project.projectLocation),
            safeToLowerCase(project.projectYear)
          ].some(field => field && field.includes(searchLower));
          
          if (textFieldsMatch) return true;
          
          if (project.category) {
            if (project.category.mainCategory) {
              const mainCatName = project.category.mainCategory === 'residential' 
                ? (language === 'ar' ? 'سكني' : 'residential')
                : (language === 'ar' ? 'تجاري' : 'commercial');
              if (mainCatName.toLowerCase().includes(searchLower)) return true;
              
              const normalizedMain = normalizeValue(project.category.mainCategory);
              if (normalizedMain.includes(normalizedSearch)) return true;
            }
            
            if (project.category.subCategory) {
              const mainCatData = availableCategories.find(cat => cat.id === project.category.mainCategory);
              const subCategories = mainCatData ? mainCatData.subcategories : [];
              const subCat = subCategories.find(s => s.id === project.category.subCategory);
              if (subCat) {
                const subNameAr = subCat.name.ar.toLowerCase();
                const subNameEn = subCat.name.en.toLowerCase();
                if (subNameAr.includes(searchLower) || subNameEn.includes(searchLower)) return true;
              }
              
              const normalizedSub = normalizeValue(project.category.subCategory);
              if (normalizedSub.includes(normalizedSearch)) return true;
            }
            
            if (project.category.specialization) {
              const specCat = availableCategories.find(cat => cat.id === "specializations");
              const specializations = specCat ? specCat.subcategories : [];
              const spec = specializations.find(s => s.id === project.category.specialization);
              if (spec) {
                const specNameAr = spec.name.ar.toLowerCase();
                const specNameEn = spec.name.en.toLowerCase();
                if (specNameAr.includes(searchLower) || specNameEn.includes(searchLower)) return true;
              }
              
              const normalizedSpec = normalizeValue(project.category.specialization);
              if (normalizedSpec.includes(normalizedSearch)) return true;
            }
            
            if (project.category.interiorRooms && Array.isArray(project.category.interiorRooms)) {
              const roomCat = availableCategories.find(cat => cat.id === "interior_rooms");
              const rooms = roomCat ? roomCat.subcategories : [];
              const roomMatch = project.category.interiorRooms.some(roomId => {
                const room = rooms.find(r => r.id === roomId || normalizeValue(r.id) === normalizeValue(roomId));
                if (room) {
                  const roomNameAr = room.name.ar.toLowerCase();
                  const roomNameEn = room.name.en.toLowerCase();
                  if (roomNameAr.includes(searchLower) || roomNameEn.includes(searchLower)) return true;
                }
                
                const normalizedRoom = normalizeValue(roomId);
                if (normalizedRoom.includes(normalizedSearch)) return true;
                
                return String(roomId).toLowerCase().includes(searchLower);
              });
              if (roomMatch) return true;
            }
          }
          
          return false;
        });
      }
      
      if (sortBy !== "featured_only") {
        filtered.sort((a, b) => {
          switch (sortBy) {
            case "newest":
              const yearA = parseInt(a.projectYear) || 0;
              const yearB = parseInt(b.projectYear) || 0;
              return yearB - yearA;
              
            case "oldest":
              const yearAOld = parseInt(a.projectYear) || 9999;
              const yearBOld = parseInt(b.projectYear) || 9999;
              return yearAOld - yearBOld;
              
            case "year_desc":
              const yearADesc = parseInt(a.projectYear) || 0;
              const yearBDesc = parseInt(b.projectYear) || 0;
              return yearBDesc - yearADesc;
              
            case "year_asc":
              const yearAAsc = parseInt(a.projectYear) || 9999;
              const yearBAsc = parseInt(b.projectYear) || 9999;
              return yearAAsc - yearBAsc;
              
            case "featured":
              if (a.isFeatured && !b.isFeatured) return -1;
              if (!a.isFeatured && b.isFeatured) return 1;
              return 0;
              
            case "name_asc":
              const nameAAsc = String(a.projectName || "").toLowerCase();
              const nameBAsc = String(b.projectName || "").toLowerCase();
              return nameAAsc.localeCompare(nameBAsc);
              
            case "name_desc":
              const nameADesc = String(a.projectName || "").toLowerCase();
              const nameBDesc = String(b.projectName || "").toLowerCase();
              return nameBDesc.localeCompare(nameADesc);
              
            case "created_at_desc":
              const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return timeB - timeA;
              
            case "created_at_asc":
              const timeAOldest = a.createdAt ? new Date(a.createdAt).getTime() : 9999999999999;
              const timeBOldest = b.createdAt ? new Date(b.createdAt).getTime() : 9999999999999;
              return timeAOldest - timeBOldest;
              
            default:
              const orderA = parseInt(a.order) || 999;
              const orderB = parseInt(b.order) || 999;
              return orderA - orderB;
          }
        });
      }
      
      return filtered;
    };
  }, [safeToLowerCase, language, availableCategories]);

  useEffect(() => {
    const newFilteredProjects = searchFilterAndSortProjects(
      projects, 
      searchTerm, 
      selectedCategory, 
      sortOption,
      selectedQuickFilters
    );
    setFilteredProjects(newFilteredProjects);
  }, [selectedCategory, searchTerm, projects, sortOption, selectedQuickFilters, searchFilterAndSortProjects]);

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  const handleApplyFilters = useCallback((filters) => {
    setSelectedCategory(filters);
    setSelectedQuickFilters([]);
    setSortOption("year_desc");
    setShowFilterModal(false);
    
    setTimeout(() => {
      const element = document.getElementById('projects-grid');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, []);

  const handleOpenFilterModal = useCallback(() => {
    setShowFilterModal(true);
  }, []);

  const handleCloseFilterModal = useCallback(() => {
    setShowFilterModal(false);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedCategory({ 
      mainCategory: "all",
      subCategories: [],
      specializations: [],
      interiorRooms: [],
      exteriorAreas: []
    });
    setSelectedQuickFilters([]);
    setSearchTerm("");
    setSortOption("year_desc");
  }, []);

  const handleRemoveFilter = useCallback((type, id) => {
    setSelectedCategory(prev => {
      const newCategory = { ...prev };
      
      switch(type) {
        case 'main':
          return {
            mainCategory: "all",
            subCategories: [],
            specializations: [],
            interiorRooms: [],
            exteriorAreas: []
          };
        case 'sub':
          newCategory.subCategories = prev.subCategories.filter(item => item !== id);
          break;
        case 'spec':
          newCategory.specializations = prev.specializations.filter(item => item !== id);
          break;
        case 'room':
          newCategory.interiorRooms = prev.interiorRooms.filter(item => item !== id);
          break;
        default:
          break;
      }
      
      return newCategory;
    });
  }, []);

  const handleQuickFilterToggle = useCallback((filter) => {
    if (filter.type === "featured") {
      setSortOption(prev => prev === "featured_only" ? "year_desc" : "featured_only");
      return;
    }
    
    setSelectedQuickFilters(prev => {
      if (prev.some(f => f.id === filter.id)) {
        return prev.filter(f => f.id !== filter.id);
      } else {
        setSelectedCategory({
          mainCategory: "all",
          subCategories: [],
          specializations: [],
          interiorRooms: [],
          exteriorAreas: []
        });
        return [...prev, filter];
      }
    });
  }, []);

  const handleRemoveQuickFilter = useCallback((filter) => {
    setSelectedQuickFilters(prev => prev.filter(f => f.id !== filter.id));
  }, []);

  const handleClearQuickFilters = useCallback(() => {
    setSelectedQuickFilters([]);
  }, []);

  const handleSortChange = useCallback((sortId) => {
    setSortOption(sortId);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getCurrentCategoryTitle = () => {
    if (sortOption === "featured_only") {
      return language === 'ar' ? 'المشاريع المميزة' : 'Featured Projects';
    }
    
    if (selectedQuickFilters.length > 0) {
      const filterNames = selectedQuickFilters.map(f => f.name[language]).join(' • ');
      return filterNames;
    }
    
    if (!selectedCategory || selectedCategory.mainCategory === "all") {
      return language === 'ar' ? 'جميع المشاريع' : 'All Projects';
    }
    
    let title = "";
    
    const mainCat = mainCategories.find(c => c.id === selectedCategory.mainCategory);
    if (mainCat) {
      title = mainCat.name[language];
    }
    
    const parts = [];
    
    if (selectedCategory.subCategories?.length > 0) {
      const mainCatData = availableCategories.find(cat => cat.id === selectedCategory.mainCategory);
      const subCats = mainCatData ? mainCatData.subcategories : [];
      const names = selectedCategory.subCategories
        .filter(id => id !== "all")
        .map(id => subCats.find(s => s.id === id)?.name[language])
        .filter(Boolean);
      if (names.length > 0) {
        parts.push(names.join('، '));
      }
    }
    
    if (selectedCategory.specializations?.length > 0) {
      const specCat = availableCategories.find(cat => cat.id === "specializations");
      const specs = specCat ? specCat.subcategories : [];
      const names = selectedCategory.specializations
        .map(id => specs.find(s => s.id === id)?.name[language])
        .filter(Boolean);
      if (names.length > 0) {
        parts.push(names.join('، '));
      }
    }
    
    if (selectedCategory.interiorRooms?.length > 0) {
      const roomCat = availableCategories.find(cat => cat.id === "interior_rooms");
      const rooms = roomCat ? roomCat.subcategories : [];
      const names = selectedCategory.interiorRooms
        .map(id => rooms.find(r => r.id === id)?.name[language])
        .filter(Boolean);
      if (names.length > 0) {
        parts.push(names.join('، '));
      }
    }
    
    if (parts.length > 0) {
      title += ` - ${parts.join(' • ')}`;
    }
    
    return title || (language === 'ar' ? 'المشاريع المصفاة' : 'Filtered Projects');
  };

  const getFilteredCount = () => {
    const baseText = language === 'ar' ? 'عرض' : 'Showing';
    
    if (sortOption === "featured_only") {
      const featuredCount = filteredProjects.length;
      return `${baseText} ${featuredCount} ${language === 'ar' ? 'مشروع مميز' : 'featured project'}${featuredCount !== 1 ? (language === 'ar' ? '' : 's') : ''}`;
    }
    
    const countText = language === 'ar' 
      ? `مشروع${filteredProjects.length !== 1 ? 'ات' : ''}`
      : `project${filteredProjects.length !== 1 ? 's' : ''}`;
    return `${baseText} ${filteredProjects.length} ${countText}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-3 xs:p-4" dir={direction}>
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 border-4 border-gray-200 rounded-full"></div>
            <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 border-4 border-amber-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-3 xs:mt-4 sm:mt-5 md:mt-6 lg:mt-8 text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 font-medium">
            {language === 'ar' ? 'جاري تحميل المشاريع...' : 'Loading projects...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50" dir={direction} ref={containerRef}>
      <div 
        className="fixed top-0 left-0 h-0.5 xs:h-1 bg-gradient-to-r from-amber-500 to-amber-600 z-50 shadow-lg"
        style={{ width: `${scrollProgress}%` }}
      />

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-3 xs:bottom-4 right-3 xs:right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-40 w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          aria-label={language === 'ar' ? 'العودة للأعلى' : 'Back to top'}
        >
          <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      <AnimatePresence>
        {showFilterModal && (
          <FlexibleFilterModal
            language={language}
            currentFilters={selectedCategory}
            onApplyFilters={handleApplyFilters}
            onClose={handleCloseFilterModal}
            availableCategories={availableCategories}
          />
        )}
      </AnimatePresence>

      <section className="relative min-h-[40vh] xs:min-h-[45vh] sm:min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] overflow-hidden">
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
                scale: { duration: 8, ease: "easeInOut", repeat: Infinity }
              }}
            >
              <WatermarkedImage
                src={img}
                alt="Architectural Background"
                className="w-full h-full object-cover"
                mode="centered-bottom"
                watermarkText="DEMORE"
                opacity={0.18}
                preserveAspectRatio={true}
              />
            </motion.div>
          ))}
          
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/60 to-white"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/30"></div>
          
          <FloatingParticles count={15} />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 xl:py-24 h-full flex items-center">
          <div className="w-full">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="mb-4 xs:mb-5 sm:mb-6 md:mb-8"
              >
                <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-1 xs:mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-tight">
                  <span className="block bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-1 xs:mb-2">
                    {getCurrentCategoryTitle()}
                  </span>
                  <span className="block text-gray-700 text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light">
                    {language === 'ar' ? 'تصاميمنا الساحرة' : 'Our Mesmerizing Designs'}
                  </span>
                </h1>
                
                <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-2 xs:px-3 sm:px-4">
                  {language === 'ar' 
                    ? 'مجموعة مختارة من أبرز مشاريعنا حيث يلتقي الإبداع بالدقة لخلق مساحات استثنائية'
                    : 'A curated selection of our most prominent projects where creativity meets precision to create exceptional spaces'
                  }
                </p>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="mt-4 xs:mt-5 sm:mt-6 md:mt-8 lg:mt-10 cursor-pointer"
                onClick={() => document.getElementById('projects-grid')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <div className="text-gray-500 text-2xs xs:text-xs sm:text-sm font-medium mb-0.5 xs:mb-1">
                  {language === 'ar' ? 'تصفح المشاريع' : 'Explore Projects'}
                </div>
                <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 mx-auto text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm py-2 xs:py-3 sm:py-4 md:py-6 -mt-8 xs:-mt-10 sm:-mt-12 md:-mt-16 lg:-mt-20"
        id="projects-grid"
      >
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 xs:gap-4 sm:gap-6 mb-3 xs:mb-4">
            <div className="w-full sm:w-64 md:w-80 lg:w-96">
              <SearchComponent
                searchTerm={searchTerm}
                onSearch={handleSearch}
                onClear={handleClearSearch}
                language={language}
                placeholder={language === 'ar' ? 'ابحث في المشاريع...' : 'Search projects...'}
                showClear={true}
              />
            </div>
            
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-3">
              <SortDropdown
                language={language}
                selectedSort={sortOption}
                onSortChange={handleSortChange}
              />
              
              <button
                onClick={handleOpenFilterModal}
                className="text-xs xs:text-sm sm:text-base text-gray-600 hover:text-gray-900 font-medium flex items-center justify-center hover:bg-gray-100 px-3 xs:px-4 py-2 xs:py-2.5 rounded-xl transition-all duration-300 border border-gray-200 hover:border-gray-300"
              >
                <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 ml-1.5 xs:ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="hidden xs:inline">{language === 'ar' ? 'فلترة متقدمة' : 'Advanced Filter'}</span>
              </button>
            </div>
          </div>
          
          <QuickFilterBar
            language={language}
            selectedQuickFilters={selectedQuickFilters}
            onQuickFilterToggle={handleQuickFilterToggle}
            onClearQuickFilters={handleClearQuickFilters}
            selectedSort={sortOption}
            onSortChange={handleSortChange}
            availableQuickFilters={availableQuickFilters}
          />
        </div>
      </motion.div>

      <section className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 py-6 xs:py-8 sm:py-10 md:py-12">
        <ActiveFiltersDisplay
          language={language}
          selectedCategory={selectedCategory}
          selectedQuickFilters={selectedQuickFilters}
          selectedSort={sortOption}
          onClearFilters={handleClearFilters}
          onRemoveFilter={handleRemoveFilter}
          onRemoveQuickFilter={handleRemoveQuickFilter}
          onSortChange={handleSortChange}
          onOpenFilterModal={handleOpenFilterModal}
          designCategories={availableCategories}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 xs:gap-3 sm:gap-4 mb-4 xs:mb-5 sm:mb-6 md:mb-8 lg:mb-10">
          <div>
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-0.5 xs:mb-1 sm:mb-2">
              {getCurrentCategoryTitle()}
            </h2>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600">
              {getFilteredCount()}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8 p-3 xs:p-4 sm:p-5 md:p-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl sm:rounded-2xl">
            <div className="flex items-center">
              <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-red-500 ml-1.5 xs:ml-2 sm:ml-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-xs xs:text-sm sm:text-base text-red-600">{error}</p>
            </div>
          </div>
        )}

        {displayedProjects.length === 0 ? (
          <div className="text-center py-8 xs:py-10 sm:py-12 md:py-16">
            <div className="inline-flex items-center justify-center w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-3 xs:mb-4 sm:mb-5 md:mb-6 border border-gray-300">
              <SearchIcon className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-1 xs:mb-2 sm:mb-3">
              {language === 'ar' ? 'لم يتم العثور على مشاريع' : 'No projects found'}
            </h3>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 max-w-md mx-auto mb-4 xs:mb-5 sm:mb-6 md:mb-8 px-3 xs:px-4">
              {language === 'ar' 
                ? searchTerm || selectedQuickFilters.length > 0 || sortOption === "featured_only"
                  ? 'عذراً، لم نتمكن من العثور على مشاريع تطابق بحثك'
                  : 'لا توجد مشاريع متاحة حالياً. يرجى التحقق لاحقاً.'
                : searchTerm || selectedQuickFilters.length > 0 || sortOption === "featured_only"
                  ? 'Sorry, we couldn\'t find any projects matching your search'
                  : 'No projects available at the moment. Please check back later.'
              }
            </p>
            <button
              onClick={handleClearFilters}
              className="px-4 xs:px-5 sm:px-6 py-2 xs:py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg border border-amber-600 text-xs xs:text-sm sm:text-base"
            >
              {language === 'ar' ? 'عرض جميع المشاريع' : 'View All Projects'}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8">
              {displayedProjects.map((project, index) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  language={language}
                  index={index}
                  designCategories={availableCategories}
                />
              ))}
            </div>
            
            {hasMore && (
              <div className="flex justify-center mt-8 xs:mt-10 sm:mt-12 md:mt-16">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loadMoreProjects}
                  className="px-6 xs:px-8 sm:px-10 py-2.5 xs:py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-xs xs:text-sm sm:text-base"
                >
                  <span>{language === 'ar' ? 'عرض المزيد' : 'Load More'}</span>
                  <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>
              </div>
            )}
            
            {!hasMore && displayedProjects.length > 0 && (
              <div className="text-center mt-8 xs:mt-10 sm:mt-12 md:mt-16">
                <p className="text-xs xs:text-sm sm:text-base text-gray-500">
                  {language === 'ar' ? 'لقد وصلت إلى نهاية القائمة' : 'You\'ve reached the end of the list'}
                </p>
              </div>
            )}
          </>
        )}
      </section>

      <section className="relative py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="absolute inset-0">
          <div className="absolute -top-20 xs:-top-30 sm:-top-40 -right-20 xs:-right-30 sm:-right-40 w-40 xs:w-48 sm:w-56 md:w-64 lg:w-80 xl:w-96 h-40 xs:h-48 sm:h-56 md:h-64 lg:h-80 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl xs:blur-3xl"></div>
          <div className="absolute -bottom-20 xs:-bottom-30 sm:-bottom-40 -left-20 xs:-left-30 sm:-left-40 w-40 xs:w-48 sm:w-56 md:w-64 lg:w-80 xl:w-96 h-40 xs:h-48 sm:h-56 md:h-64 lg:h-80 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-2xl xs:blur-3xl"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 text-center">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl xs:rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 shadow-xl border border-gray-200">
            <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 xs:mb-3 sm:mb-4">
              {language === 'ar' ? 'مستعد لبدء مشروعك؟' : 'Ready to Start Your Project?'}
            </h2>
            
            <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 mb-4 xs:mb-5 sm:mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2 xs:px-3 sm:px-4">
              {language === 'ar' 
                ? 'لنبدأ رحلة تصميم فريدة معاً. تواصل معنا الآن وكن على بعد خطوة من المساحة التي تحلم بها.'
                : 'Let\'s start a unique design journey together. Contact us now and be one step away from the space you dream of.'
              }
            </p>
            
            <div className="flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4 justify-center px-2 xs:px-3 sm:px-4">
              <button
                onClick={() => navigate('/contact')}
                className="group relative px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 text-xs xs:text-sm sm:text-base"
              >
                <span className="relative z-10 flex items-center justify-center gap-1 xs:gap-2">
                  {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
                  <ArrowRight className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
              
              <button
                onClick={handleOpenFilterModal}
                className="group relative px-4 xs:px-5 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 text-xs xs:text-sm sm:text-base"
              >
                <span className="relative z-10 flex items-center justify-center gap-1 xs:gap-2">
                  {language === 'ar' ? 'تخصيص البحث' : 'Customize Search'}
                  <ArrowRight className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx="true">{`
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
          .px-3 {
            padding-left: 0.6rem;
            padding-right: 0.6rem;
          }
          .py-2 {
            padding-top: 0.4rem;
            padding-bottom: 0.4rem;
          }
        }

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
          .px-2 {
            padding-left: 0.4rem;
            padding-right: 0.4rem;
          }
          .py-1 {
            padding-top: 0.2rem;
            padding-bottom: 0.2rem;
          }
        }

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
        
        .line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(245, 158, 11, 0.3) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.3);
          border-radius: 2px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.5);
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
          background: rgba(245, 158, 11, 0.3);
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.5);
        }
        
        ::selection {
          background: rgba(245, 158, 11, 0.2);
          color: #1f2937;
        }
        
        input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }
        
        .overflow-hidden {
          overflow: hidden !important;
        }
        
        @media (max-width: 480px) {
          .xs\\:inline {
            display: inline;
          }
          .xs\\:flex-row {
            flex-direction: row;
          }
          .xs\\:items-center {
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}