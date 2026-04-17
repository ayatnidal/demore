import { useState, useEffect, useRef, useCallback } from "react";
import { db } from "../firebase";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

export default function Home() {
  // States
  const [, setPortfolioProjects] = useState([]);
  const [, setShowMainMenu] = useState(false);
  const [, setShowSplash] = useState(true);
  const [, setMousePosition] = useState({ x: 0, y: 0 });
  const [, setHeroImageLoaded] = useState(false);
  
  // Hooks & Context
  const location = useLocation();
  const { language } = useLanguage();
  
  // Refs
  const mainMenuRef = useRef(null);
  
  // تحديث MAIN_MENU_LINKS لإضافة زر الرئيسية في الأعلى

  // Animation Variants

  // Fetch portfolio projects
  const fetchPortfolioProjects = useCallback(async () => {
    try {
      console.log(language === 'ar' ? "جاري تحميل بيانات الصفحة الرئيسية..." : "Loading homepage data...");

      const projectsQuery = query(
        collection(db, "portfolioProjects"),
        orderBy("createdAt", "desc"),
        limit(3)
      );
      
      const projectsSnapshot = await getDocs(projectsQuery);
      const projectsData = [];
      
      projectsSnapshot.forEach((doc) => {
        const projectData = doc.data();
        if (projectData.isActive !== false) {
          projectsData.push({
            id: doc.id,
            ...projectData
          });
        }
      });
      
      setPortfolioProjects(projectsData);
      console.log(language === 'ar' ? `تم تحميل ${projectsData.length} مشروع` : `Loaded ${projectsData.length} projects`);
      
    } catch (projectsError) {
      console.error(language === 'ar' ? "خطأ في جلب المشاريع:" : "Error loading projects:", projectsError);
    }
  }, [language]);

  // Effects
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const preloadImage = new Image();
    preloadImage.src = "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80";
    preloadImage.onload = () => setHeroImageLoaded(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mainMenuRef.current && !mainMenuRef.current.contains(event.target)) {
        setShowMainMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    fetchPortfolioProjects();
  }, [fetchPortfolioProjects]);

  // Functions

  // دالة للانتقال إلى صفحة تسجيل الدخول

  // دالة للعودة إلى الصفحة الرئيسية





  return (
    <>

      {/* Main Content */}
      
    </>
  );
}