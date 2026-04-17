// src/pages/Home.js
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useLanguage } from "../contexts/LanguageContext";
import WatermarkedImage from "../components/WatermarkedImage";

export default function Home() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [, setShowContactOptions] = useState(false);
  const [, setShowMainMenu] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // حالات للواتساب المتعدد والهاتف المتعدد
  const [selectedPhoneIndex, setSelectedPhoneIndex] = useState(0);
  const [selectedWhatsAppIndex, setSelectedWhatsAppIndex] = useState(0);
  const [isPhoneExpanded, setIsPhoneExpanded] = useState(false);
  const [isWhatsAppExpanded, setIsWhatsAppExpanded] = useState(false);

  const containerRef = useRef(null);
  const contactOptionsRef = useRef(null);
  const mainMenuRef = useRef(null);
  const navigate = useNavigate();

  const { language } = useLanguage();

  // معلومات الاتصال
  const contactInfo = useMemo(
    () => ({
      phones: ["00970566498382", "00970538506023"],
      whatsappLinks: ["https://wa.link/j862lk", "https://wa.link/h7mmst"],
      whatsappNumbers: ["00970538506023", "00970566498382"],
      email: "info@demoreps.com",
      address:
        language === "ar"
          ? "فلسطين - بيت جالا\nشارع النزهة، مقابل دخلة الجمعية العربية"
          : "Palestine - Beit Jala\nAl Nuzha Street, opposite Al Jamia Al Arabia entrance",
      facebook: "https://www.facebook.com/share/1C6SKhXQds/?mibextid=wwXIfr",
      instagram: "https://www.instagram.com/demore_co?igsh=MTcyYTcxNGo1bXRsag==",
      mapLocation: "31.71613276227327, 35.18031132181027",
    }),
    [language]
  );

  // صور Hero
  const heroImages = useMemo(
    () => ["/images/hero1.jpg", "/images/hero2.jpg", "/images/hero3.jpg"],
    []
  );

  // الخدمات
  const services = useMemo(
    () => [
      {
        title: {
          en: "Executive Supervision",
          ar: "الإشراف التنفيذي",
        },
        description: {
          en: "Full supervision of project execution to ensure quality and accuracy with daily follow-up and regular reports.",
          ar: "إشراف كامل على تنفيذ المشاريع لضمان الجودة والدقة، مع متابعة يومية وتقارير دورية.",
        },
        features: {
          en: [
            "Daily execution follow-up",
            "Quality control",
            "Timeline management",
            "Contractor coordination",
            "Detailed weekly reports",
          ],
          ar: [
            "متابعة يومية للتنفيذ",
            "مراقبة الجودة",
            "ضبط الجداول الزمنية",
            "التنسيق مع المقاولين",
            "تقارير أسبوعية مفصلة",
          ],
        },
        category: "supervision",
      },
      {
        title: {
          en: "Engineering Consultations",
          ar: "استشارات هندسية",
        },
        description: {
          en: "Specialized engineering consultations from feasibility studies to detailed designs, ensuring your project's success.",
          ar: "استشارات هندسية متخصصة من دراسات الجدوى إلى التصاميم التفصيلية، لضمان نجاح مشروعك.",
        },
        features: {
          en: [
            "Feasibility studies",
            "Project evaluation",
            "Space planning",
            "Innovative solutions",
            "Functional improvement",
          ],
          ar: [
            "دراسات جدوى",
            "تقييم المشاريع",
            "تخطيط المساحات",
            "حلول مبتكرة",
            "تحسين الأداء الوظيفي",
          ],
        },
        category: "consultation",
      },
      {
        title: {
          en: "Landscape Design",
          ar: "تنسيق حدائق",
        },
        description: {
          en: "Garden and landscape design combining beauty and sustainability with careful selection of plants and materials.",
          ar: "تصميم حدائق ومناظر طبيعية تجمع بين الجمال والاستدامة، مع اختيار دقيق للنباتات والمواد.",
        },
        features: {
          en: [
            "Garden design",
            "Water features",
            "Smart irrigation",
            "Garden lighting",
            "Pathways and landscaping",
          ],
          ar: [
            "تصميم حدائق",
            "نوافير وبرك مائية",
            "أنظمة ري ذكية",
            "إضاءة خارجية",
            "ممرات وتنسيق",
          ],
        },
        category: "landscape",
      },
    ],
    []
  );

  // Animation Variants
  const fadeInUp = useMemo(
    () => ({
      hidden: { opacity: 0, y: 60 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1],
        },
      },
    }),
    []
  );

  const staggerChildren = useMemo(
    () => ({
      visible: {
        transition: {
          staggerChildren: 0.2,
        },
      },
    }),
    []
  );

  const scaleIn = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 0.95 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.7,
          ease: "easeOut",
        },
      },
    }),
    []
  );

  // النص حسب اللغة
  const getText = useCallback(
    (textObject) => {
      if (!textObject) return "";
      if (typeof textObject === "object" && textObject !== null) {
        return textObject[language] || textObject.en || textObject.ar || "";
      }
      return textObject || "";
    },
    [language]
  );

  // القائمة حسب اللغة
  const getList = useCallback(
    (listObject) => {
      if (!listObject) return [];
      if (typeof listObject === "object" && listObject[language]) {
        return listObject[language];
      }
      if (Array.isArray(listObject)) {
        return listObject;
      }
      return [];
    },
    [language]
  );

  // اسم الفئة المترجم
  const getTranslatedCategory = useCallback(
    (category) => {
      if (!category) return "";
      if (typeof category === "object") {
        return getText(category);
      }
      const categoriesMap = {
        residential: { en: "Residential", ar: "سكني" },
        commercial: { en: "Commercial", ar: "تجاري" },
        gardens: { en: "Gardens", ar: "حدائق" },
        room_types: { en: "Room Types", ar: "أنواع الغرف" },
        hospitality: { en: "Hospitality", ar: "ضيافة" },
        Residential: { en: "Residential", ar: "سكني" },
        Commercial: { en: "Commercial", ar: "تجاري" },
        Gardens: { en: "Gardens", ar: "حدائق" },
        "Room Types": { en: "Room Types", ar: "أنواع الغرف" },
        Hospitality: { en: "Hospitality", ar: "ضيافة" },
        Project: { en: "Project", ar: "مشروع" },
      };
      return getText(categoriesMap[category] || category);
    },
    [getText]
  );

  // إغلاق القوائم عند الضغط خارجها
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

  // تحميل صور Hero مسبقاً
  useEffect(() => {
    const preloadImages = heroImages.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    // Preload images without using the loaded state
    preloadImages.forEach(img => {
      img.onload = () => {
        // Image loaded successfully
        console.log(`Image loaded: ${img.src}`);
      };
    });
  }, [heroImages]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // تبديل الصور تلقائياً
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // تتبع السكرول
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);

      const sections = ["home", "projects", "services", "contact"];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });

      if (current) setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // جلب المشاريع المميزة فقط
  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoadingProjects(true);
        
        // جلب المشاريع المميزة فقط (حقل isFeatured === true)
        const projectsRef = collection(db, "portfolioProjects");
        const featuredQuery = query(projectsRef, where("isFeatured", "==", true));
        const projectsSnapshot = await getDocs(featuredQuery);
        
        // تصفية المشاريع: استبعاد مشاريع الادارة (pageType === "admin")
        const validProjects = [];
        projectsSnapshot.forEach((doc) => {
          const data = doc.data();
          const pageType = data.pageType || "";
          
          // فقط المشاريع المميزة التي ليست من نوع admin
          if (pageType !== "admin") {
            validProjects.push({ id: doc.id, ...data });
          }
        });
        
        if (validProjects.length === 0) {
          setFeaturedProjects([]);
          setLoadingProjects(false);
          return;
        }
        
        // ترتيب المشاريع حسب createdAt (الأحدث أولاً)
        const sortedProjects = validProjects.sort((a, b) => {
          const getDate = (project) => {
            if (project.createdAt) {
              if (project.createdAt.seconds) {
                return project.createdAt.seconds;
              }
              if (project.createdAt.toDate) {
                return project.createdAt.toDate().getTime() / 1000;
              }
              return new Date(project.createdAt).getTime() / 1000;
            }
            return 0;
          };
          
          return getDate(b) - getDate(a);
        });
        
        // أخذ أول 4 مشاريع مميزة فقط (أو أقل إذا كان العدد أقل من 4)
        const latestFeaturedProjects = sortedProjects.slice(0, 4);

        const projectsData = latestFeaturedProjects.map((data) => {
          const getDisplayImage = () => {
            if (data.coverImage) return data.coverImage;
            if (data.afterImages?.length > 0) return data.afterImages[0];
            if (data.galleryImages?.length > 0) return data.galleryImages[0];
            if (data.beforeImages?.length > 0) return data.beforeImages[0];
            return "/images/hero1.jpg";
          };

          const getProjectName = () => {
            if (data.projectName) {
              if (typeof data.projectName === "object") {
                return (
                  data.projectName[language] ||
                  data.projectName.en ||
                  data.projectName.ar ||
                  ""
                );
              }
              return data.projectName;
            }
            return getText(data.title) || "";
          };

          const getDescription = () => {
            if (data.briefDescription) {
              if (typeof data.briefDescription === "object") {
                return (
                  data.briefDescription[language] ||
                  data.briefDescription.en ||
                  data.briefDescription.ar ||
                  ""
                );
              }
              return data.briefDescription;
            }
            return getText(data.description) || "";
          };

          const getCategory = () => {
            if (data.category) {
              if (typeof data.category === "object") {
                if (data.category.mainCategory) {
                  const categories = {
                    residential: language === "ar" ? "سكني" : "Residential",
                    commercial: language === "ar" ? "تجاري" : "Commercial",
                    gardens: language === "ar" ? "حدائق" : "Gardens",
                    room_types: language === "ar" ? "أنواع الغرف" : "Room Types",
                  };
                  return categories[data.category.mainCategory] || data.category.mainCategory;
                }
                return getText(data.category);
              }
              return getTranslatedCategory(data.category);
            }
            return language === "ar" ? "مشروع" : "Project";
          };

          const getYear = () => {
            if (data.projectYear) return data.projectYear;
            if (data.createdAt?.toDate) {
              return data.createdAt.toDate().getFullYear().toString();
            }
            if (data.createdAt?.seconds) {
              return new Date(data.createdAt.seconds * 1000).getFullYear().toString();
            }
            return "2023";
          };

          return {
            id: data.id,
            title: getProjectName(),
            category: getCategory(),
            year: getYear(),
            imageUrl: getDisplayImage(),
            description: getDescription(),
          };
        });

        setFeaturedProjects(projectsData);
      } catch (error) {
        console.error("Error fetching featured projects:", error);
        setFeaturedProjects([
          { id: 1, imageUrl: "/images/hero1.jpg", title: "Project 1", category: "Project", year: "2023", description: "" },
          { id: 2, imageUrl: "/images/hero2.jpg", title: "Project 2", category: "Project", year: "2023", description: "" },
          { id: 3, imageUrl: "/images/hero3.jpg", title: "Project 3", category: "Project", year: "2023", description: "" },
          { id: 4, imageUrl: "/images/hero1.jpg", title: "Project 4", category: "Project", year: "2023", description: "" },
        ]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchFeaturedProjects();
  }, [language, getText, getTranslatedCategory]);
  
  // خيارات الاتصال
  const handleContactClick = useCallback(
    (option, index = 0) => {
      setShowContactOptions(false);

      switch (option) {
        case "whatsapp":
          window.open(contactInfo.whatsappLinks[index], "_blank");
          break;
        case "phone":
          window.open(`tel:${contactInfo.phones[index].replace(/\s/g, "")}`);
          break;
        case "email":
          window.location.href = `mailto:${contactInfo.email}`;
          break;
        case "contact-page":
          navigate("/contact");
          break;
        case "facebook":
          window.open(contactInfo.facebook, "_blank");
          break;
        case "instagram":
          window.open(contactInfo.instagram, "_blank");
          break;
        default:
          break;
      }
    },
    [contactInfo, navigate]
  );

  // التنقل
  const scrollToSection = useCallback((id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  }, []);

  const goToProjectsPage = useCallback(() => navigate("/portfolio"), [navigate]);
  const goToServicesPage = useCallback(() => navigate("/services"), [navigate]);
  const goToProjectPage = useCallback((projectId) => navigate(`/project/${projectId}`), [navigate]);

  // العودة للرئيسية
  const handleHomeClick = useCallback(() => {
    navigate("/");
    window.scrollTo(0, 0);
  }, [navigate]);

  // Chevron
  const ChevronIcon = ({ isExpanded }) => {
    return (
      <div
        className={`transform transition-transform duration-300 ${
          isExpanded ? "rotate-180" : ""
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    );
  };

  // Icons
  const WhatsAppIcon = () => (
    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 448 512">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
    </svg>
  );

  const PhoneIcon = () => (
    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );

  const EmailIcon = () => (
    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );

  const LocationIcon = () => (
    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  const InstagramIcon = () => (
    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );

  const FacebookIcon = () => (
    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );

  // ================== Hero Section ==================
  const renderHeroSection = () => (
    <motion.section
      id="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.5 }}
      className="min-h-screen flex items-center px-4 sm:px-8 md:px-12 lg:px-20 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        {heroImages.map((img, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: index === 0 ? 1 : 0 }}
            animate={{
              opacity: heroImageIndex === index ? 1 : 0,
              scale: heroImageIndex === index ? [1, 1.03, 1] : 1,
            }}
            transition={{
              opacity: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 20, ease: "easeInOut", repeat: Infinity },
            }}
          >
            {/* استبدال img العادي بـ WatermarkedImage */}
            <WatermarkedImage
              src={img}
              alt={
                language === "ar"
                  ? `خلفية معمارية ${index + 1}`
                  : `Architecture Background ${index + 1}`
              }
              watermarkText="DEMORE"
              mode="centered-bottom"
              opacity={0.14}
              className="w-full h-full"
              imageClassName="w-full h-full object-cover"
              onError={(e) => {
                console.error(`Error loading image: ${img}`);
              }}
            />
          </motion.div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/30 to-white/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full flex justify-end items-center h-full">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="w-full flex justify-end"
        >
          {/* كتلة النص والزر كلها على اليمين */}
          <div className="flex flex-col items-end text-right w-full max-w-2xl">
            {/* النصوص نفسها بالنص تحت DEMORE - بنفس الخط للكل */}
            <div className="inline-flex flex-col items-center text-center self-end">
              <motion.div variants={fadeInUp} className="overflow-hidden">
                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-light leading-[0.85] tracking-tight text-white/85">
                  <motion.span
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.1, duration: 0.8, ease: "easeOut" }}
                    className="block font-sans"
                  >
                    DEMORE
                  </motion.span>
                </h1>
              </motion.div>

              <motion.span
                variants={fadeInUp}
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                className="block text-white/80 text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-2 sm:mt-4 font-sans"
              >
                The design and more
              </motion.span>

              <motion.div variants={fadeInUp} className="mt-4 sm:mt-6 md:mt-8">
                <p className="font-sans text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/80">
                  {language === "ar"
                    ? "نخلق مساحات تعبر عنك... حيث يلتقي الإبداع بالراحة"
                    : "We create spaces that express you... where creativity meets comfort"}
                </p>
              </motion.div>
            </div>

            {/* الزر مباشرة تحت الكلام وعلى الطرف اليمين */}
            <motion.div
              variants={fadeInUp}
              className="mt-6 sm:mt-8 md:mt-10 self-end"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection("projects")}
                className="group relative inline-flex items-center gap-2 sm:gap-4 text-xs sm:text-sm uppercase tracking-wider bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:shadow-lg transition-all duration-300"
              >
                <span className="relative overflow-hidden text-gray-900 font-sans">
                  {language === "ar" ? "استكشف أعمالنا" : "Explore Our Work"}
                  <motion.span
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    className="absolute bottom-0 left-0 h-px w-full bg-gray-900"
                    transition={{ duration: 0.3 }}
                  />
                </span>
                <motion.svg
                  animate={{ x: [0, 3, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="w-3 h-3 sm:w-4 sm:h-4 text-gray-900"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </motion.svg>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );

  return (
    <>
      {/* Main Content */}
      <div className="min-h-screen font-sans overflow-x-hidden">
        {/* Cursor Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,255,255,0.02) 0%, transparent 50%)`,
          }}
        />

        {/* Progress Line */}
        <motion.div
          className="fixed top-0 left-0 h-0.5 bg-gray-900 z-[9998]"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />

        {/* Navigation */}
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed top-3 sm:top-4 md:top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[90%] max-w-6xl"
        >
          <div className="bg-white/80 backdrop-blur-md rounded-full px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHomeClick}
                className="cursor-pointer font-light tracking-wider text-xs sm:text-sm uppercase text-gray-900 font-sans"
              >
                DEMORE
              </motion.div>

              <div className="flex items-center sm:space-x-3">
                {[
                  { id: "home", label: { en: "Home", ar: "الرئيسية" } },
                  { id: "projects", label: { en: "Projects", ar: "المشاريع" } },
                  { id: "services", label: { en: "Services", ar: "الخدمات" } },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => scrollToSection(item.id)}
                    className={`relative px-1 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm transition-all duration-300 font-sans ${
                      activeSection === item.id
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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

        {renderHeroSection()}

        <main ref={containerRef} className="bg-white text-gray-900 overflow-hidden">
          {/* ================= PROJECTS ================= */}
          <section
            id="projects"
            className="px-4 sm:px-8 md:px-12 lg:px-20 py-16 sm:py-24 md:py-32 lg:py-48 relative"
          >
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerChildren}
                className="mb-12 sm:mb-16 md:mb-20 lg:mb-32 flex flex-col md:flex-row md:items-end justify-between"
              >
                <div>
                  <motion.h2
                    variants={fadeInUp}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light font-sans"
                  >
                    {language === "ar" ? "مشاريع" : "Featured"}
                    <br />
                    <span className="text-gray-400 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                      {language === "ar" ? "مميزة" : "Projects"}
                    </span>
                  </motion.h2>
                </div>

                <motion.div variants={fadeInUp} className="mt-4 sm:mt-6 md:mt-0">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToProjectsPage}
                    className="group inline-flex items-center gap-2 sm:gap-3 text-xs sm:text-sm uppercase tracking-wider border border-gray-300 hover:border-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:shadow-md transition-all duration-300 font-sans"
                  >
                    {language === "ar" ? "جميع المشاريع" : "View All Projects"}
                    <motion.svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      initial={{ x: 0 }}
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </motion.svg>
                  </motion.button>
                </motion.div>
              </motion.div>

              {loadingProjects ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100">
                        <div className="aspect-[4/3] animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : featuredProjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-12">
                  {featuredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      variants={fadeInUp}
                      className="group cursor-pointer"
                      onClick={() => goToProjectPage(project.id)}
                    >
                      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="aspect-[4/3] relative bg-gradient-to-br from-gray-50 to-gray-100"
                        >
                          {/* استبدال img العادي بـ WatermarkedImage للمشاريع */}
                          <WatermarkedImage
                            src={project.imageUrl}
                            alt={project.title}
                            watermarkText="DEMORE"
                            mode="centered-bottom"
                            opacity={0.14}
                            className="w-full h-full"
                            imageClassName="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/images/hero1.jpg";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white pointer-events-none"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                              <div>
                                <div className="text-xs sm:text-sm uppercase tracking-widest mb-1 sm:mb-2 text-gray-300 font-sans">
                                  {project.category} • {project.year}
                                </div>
                                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-1 sm:mb-2 font-sans">
                                  {project.title}
                                </h3>
                                <p className="text-gray-300 text-xs sm:text-sm md:text-base line-clamp-2 font-sans">
                                  {project.description}
                                </p>
                              </div>
                              <motion.div
                                whileHover={{ x: 5 }}
                                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm uppercase tracking-wider text-white mt-2 sm:mt-0 font-sans"
                              >
                                {language === "ar" ? "عرض المشروع" : "View Project"}
                                <svg
                                  className="w-3 h-3 sm:w-4 sm:h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                  />
                                </svg>
                              </motion.div>
                            </div>
                          </motion.div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 font-sans">
                    {language === "ar" 
                      ? "لا توجد مشاريع مميزة حالياً" 
                      : "No featured projects available"}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ================= SERVICES ================= */}
          <section
            id="services"
            className="px-4 sm:px-8 md:px-12 lg:px-20 py-16 sm:py-24 md:py-32 lg:py-48 bg-gray-50"
          >
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerChildren}
              >
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 md:mb-20">
                  <motion.div variants={fadeInUp} className="text-center md:text-left">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light font-sans">
                      {language === "ar" ? "خدماتنا" : "Our"}
                      <br />
                      <span className="text-gray-400 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                        {language === "ar" ? "" : "Services"}
                      </span>
                    </h2>
                  </motion.div>

                  <motion.div
                    variants={fadeInUp}
                    className="mt-4 sm:mt-6 md:mt-0 flex justify-center md:justify-end"
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={goToServicesPage}
                      className="group inline-flex items-center gap-2 sm:gap-3 text-xs sm:text-sm uppercase tracking-wider border border-gray-300 hover:border-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:shadow-md transition-all duration-300 font-sans"
                    >
                      {language === "ar" ? "جميع الخدمات" : "All Services"}
                      <motion.svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </motion.svg>
                    </motion.button>
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {services.map((service, index) => (
                    <motion.div
                      key={index}
                      variants={scaleIn}
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 150, damping: 25 }}
                      className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl group cursor-pointer hover:shadow-lg transition-all duration-300"
                      onClick={goToServicesPage}
                    >
                      <div className="mb-4 sm:mb-6">
                        <div className="text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4">
                          {service.icon}
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-light mb-2 sm:mb-4 font-sans">
                          {getText(service.title)}
                        </h3>
                        <p className="text-gray-500 text-xs sm:text-sm lg:text-base mb-4 sm:mb-6 line-clamp-3 font-sans">
                          {getText(service.description)}
                        </p>
                      </div>

                      <ul className="space-y-1 sm:space-y-2">
                        {getList(service.features)
                          .slice(0, 3)
                          .map((feature, i) => (
                            <li
                              key={i}
                              className="flex items-center gap-2 sm:gap-3 text-gray-600 hover:text-gray-900 transition-colors duration-300 text-xs sm:text-sm lg:text-base font-sans"
                            >
                              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gray-300 group-hover:bg-gray-900 transition-colors duration-300"></div>
                              <span className="line-clamp-1">{feature}</span>
                            </li>
                          ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* ================= FOOTER ================= */}
          <footer className="px-4 sm:px-8 md:px-12 lg:px-20 py-8 sm:py-12 md:py-16 border-t border-gray-200 bg-white">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerChildren}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12"
              >
                <motion.div variants={fadeInUp} className="sm:col-span-2 lg:col-span-2">
                  <div className="text-xl sm:text-2xl font-light tracking-wider mb-3 sm:mb-4 font-sans">
                    DEMORE
                  </div>
                  <span className="block text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 font-sans">
                    The design and more
                  </span>
                  <p className="text-gray-500 text-xs sm:text-sm max-w-md font-sans">
                    {language === "ar"
                      ? "خلق مساحات ذات معنى من خلال العمارة والتصميم المدروس."
                      : "Creating meaningful spaces through thoughtful architecture and design."}
                  </p>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h3 className="text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 text-gray-900 font-sans">
                    {language === "ar" ? "تواصل" : "Connect"}
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    <li>
                      <button
                        onClick={() => handleContactClick("instagram")}
                        className="flex items-center gap-2 sm:gap-3 text-gray-500 hover:text-gray-900 transition-colors duration-300 w-full text-left"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center border border-purple-200 flex-shrink-0">
                          <InstagramIcon />
                        </div>
                        <span className="text-xs sm:text-sm font-sans">Instagram</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleContactClick("facebook")}
                        className="flex items-center gap-2 sm:gap-3 text-gray-500 hover:text-gray-900 transition-colors duration-300 w-full text-left"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200 flex-shrink-0">
                          <FacebookIcon />
                        </div>
                        <span className="text-xs sm:text-sm font-sans">Facebook</span>
                      </button>
                    </li>
                    <li className="relative">
                      <div className="space-y-2">
                        <button
                          onClick={() => handleContactClick("whatsapp", selectedWhatsAppIndex)}
                          className="w-full flex items-center justify-between gap-2 sm:gap-3 text-gray-500 hover:text-gray-900 transition-colors duration-300 group"
                        >
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center border border-green-200 group-hover:border-green-300 transition-colors flex-shrink-0">
                              <WhatsAppIcon />
                            </div>
                            <span className="text-xs sm:text-sm truncate font-sans">
                              {contactInfo.whatsappNumbers[selectedWhatsAppIndex]}
                            </span>
                          </div>
                          {contactInfo.whatsappLinks.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsWhatsAppExpanded(!isWhatsAppExpanded);
                              }}
                              className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                            >
                              <ChevronIcon isExpanded={isWhatsAppExpanded} />
                            </button>
                          )}
                        </button>

                        <AnimatePresence>
                          {isWhatsAppExpanded && contactInfo.whatsappLinks.length > 1 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-9 sm:pl-11 space-y-2 overflow-hidden"
                            >
                              {contactInfo.whatsappNumbers.map(
                                (number, index) =>
                                  index !== selectedWhatsAppIndex && (
                                    <motion.button
                                      key={index}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -10 }}
                                      transition={{ delay: index * 0.1 }}
                                      onClick={() => {
                                        setSelectedWhatsAppIndex(index);
                                        setIsWhatsAppExpanded(false);
                                        handleContactClick("whatsapp", index);
                                      }}
                                      className="flex items-center gap-2 sm:gap-3 text-gray-600 hover:text-gray-900 transition-colors duration-300 text-xs sm:text-sm w-full text-left"
                                    >
                                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300"></div>
                                      <span className="truncate font-sans">{number}</span>
                                    </motion.button>
                                  )
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </li>
                  </ul>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <h3 className="text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4 text-gray-900 font-sans">
                    {language === "ar" ? "اتصال" : "Contact"}
                  </h3>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="relative">
                      <div className="space-y-2">
                        <button
                          onClick={() => handleContactClick("phone", selectedPhoneIndex)}
                          className="w-full flex items-center justify-between gap-2 sm:gap-3 text-gray-500 hover:text-gray-900 transition-colors duration-300 group"
                        >
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200 group-hover:border-blue-300 transition-colors flex-shrink-0">
                              <PhoneIcon />
                            </div>
                            <span className="text-xs sm:text-sm truncate font-sans">
                              {contactInfo.phones[selectedPhoneIndex]}
                            </span>
                          </div>
                          {contactInfo.phones.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsPhoneExpanded(!isPhoneExpanded);
                              }}
                              className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                            >
                              <ChevronIcon isExpanded={isPhoneExpanded} />
                            </button>
                          )}
                        </button>

                        <AnimatePresence>
                          {isPhoneExpanded && contactInfo.phones.length > 1 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-9 sm:pl-11 space-y-2 overflow-hidden"
                            >
                              {contactInfo.phones.map(
                                (number, index) =>
                                  index !== selectedPhoneIndex && (
                                    <motion.button
                                      key={index}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: -10 }}
                                      transition={{ delay: index * 0.1 }}
                                      onClick={() => {
                                        setSelectedPhoneIndex(index);
                                        setIsPhoneExpanded(false);
                                        handleContactClick("phone", index);
                                      }}
                                      className="flex items-center gap-2 sm:gap-3 text-gray-600 hover:text-gray-900 transition-colors duration-300 text-xs sm:text-sm w-full text-left"
                                    >
                                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gray-300"></div>
                                      <span className="truncate font-sans">{number}</span>
                                    </motion.button>
                                  )
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </li>

                    <li>
                      <button
                        onClick={() => handleContactClick("email")}
                        className="flex items-center gap-2 sm:gap-3 text-gray-500 hover:text-gray-900 transition-colors duration-300 w-full text-left"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center border border-red-200 flex-shrink-0">
                          <EmailIcon />
                        </div>
                        <span className="text-xs sm:text-sm font-sans break-all">
                          {contactInfo.email}
                        </span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps?q=${contactInfo.mapLocation}`,
                            "_blank"
                          )
                        }
                        className="flex items-center gap-2 sm:gap-3 text-gray-500 hover:text-gray-900 transition-colors duration-300 w-full text-left"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-amber-100 rounded-full flex items-center justify-center border border-amber-200 flex-shrink-0">
                          <LocationIcon />
                        </div>
                        <span className="text-xs sm:text-sm font-sans">
                          {language === "ar" ? "فلسطين - بيت جالا" : "Palestine - Beit Jala"}
                        </span>
                      </button>
                    </li>
                  </ul>
                </motion.div>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-200 text-center text-xs sm:text-sm text-gray-400 font-sans"
              >
                © {new Date().getFullYear()} DEMORE Design.{" "}
                {language === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}
              </motion.div>
            </div>
          </footer>
        </main>
      </div>

      <style jsx="true">{`
        @media (max-width: 360px) {
          .text-4xl {
            font-size: 2rem;
          }
          .text-5xl {
            font-size: 2.5rem;
          }
          .px-4 {
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }

        @media (min-width: 640px) and (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1280px) {
          .container {
            max-width: 1200px;
          }
        }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }

        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }

        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .line-clamp-3 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        /* إضافة خاصية break-all لضمان ظهور الإيميل كاملاً */
        .break-all {
          word-break: break-all;
          white-space: normal;
        }

        @media (max-width: 640px) {
          .gap-2 {
            gap: 0.5rem;
          }
          .p-4 {
            padding: 1rem;
          }
          .py-16 {
            padding-top: 4rem;
            padding-bottom: 4rem;
          }
        }

        .transform {
          transition-property: transform;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }
      `}</style>
    </>
  );
}