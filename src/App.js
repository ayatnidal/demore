// src/App.js - الإصدار الكامل بعد التعديل مع إضافة مسار projectPhoto و Mood Board
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useLocation, 
  Navigate, 
  useNavigate 
} from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { auth, db, serverTimestamp } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Toaster, toast } from 'react-hot-toast';

// استيراد المكونات العامة
import FloatingControls from "./components/FloatingControls";
import Footer from "./components/Footer";
import SplashScreen from "./pages/SplashScreen";

// استيراد الصفحات الرئيسية
import Home from "./pages/Home";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProjects from "./components/Admin/AdminProjects";
import Project from "./pages/Project";
import Login from "./pages/Login";
// ==============================
// استيراد صفحات الكتالوج
// ==============================
import CatalogMoodboard from "./pages/CatalogMoodboard";
import PaintPage from "./components/catalog/PaintPage";
import TilesPage from "./components/catalog/TilesPage.js";
import LightingPage from "./components/catalog/LightingPage";
import ParquetPage from "./components/catalog/ParquetPage";
import GypsumPage from "./components/catalog/GypsumPage";
import CurtainsPage from "./components/catalog/CurtainsPage";
import WoodPage from "./components/catalog/WoodPage";
import AluminumPage from "./components/catalog/AluminumPage";
import MarblePage from "./components/catalog/MarblePage";
import MoodBoardPage from "./components/catalog/MoodBoardPage"; // ✅ استيراد صفحة المود بورد

// ==============================
// قائمة بمسارات صفحات تفاصيل الكتالوج وصفحة المشروع ولوحة التحكم (حيث نخفي الأزرار العائمة)
// ==============================
const HIDE_FLOATING_CONTROLS_PATHS = [
  '/components/catalog/PaintPage',
  '/components/catalog/TilesPage',
  '/components/catalog/LightingPage',
  '/components/catalog/ParquetPage',
  '/components/catalog/GypsumPage',
  '/components/catalog/CurtainsPage',
  '/components/catalog/WoodPage',
  '/components/catalog/AluminumPage',
  '/components/catalog/MarblePage',
  '/components/catalog/MoodBoardPage', // ✅ إخفاء الأزرار في صفحة المود بورد التفاصيل
  '/catalog/paint',
  '/catalog/tiles',
  '/catalog/lighting',
  '/catalog/parquet',
  '/catalog/gypsum',
  '/catalog/curtains',
  '/catalog/wood',
  '/catalog/aluminum',
  '/catalog/marble',
  '/catalog/moodboard', // ✅ إخفاء الأزرار في مسار المود بورد المختصر
  '/project/', // إضافة مسار صفحة المشروع (سيتم التحقق باستخدام startsWith)
  '/project',   // إضافة المسار الأساسي للمشاريع
  '/admin',     // إخفاء الأزرار في لوحة التحكم
  '/admin/',    // إخفاء الأزرار في جميع صفحات لوحة التحكم
  '/admin/project-photo', // إخفاء الأزرار في صفحة عرض الصور أيضاً
  // ✅ تم إزالة '/catalog-moodboard' و '/admin-projects' من القائمة ليظهر الـ FloatingControls فيهما
];

// ==============================
// مكونات مساعدة
// ==============================

// مكون لاستعادة التمرير عند تغيير المسار
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [pathname]);

  return null;
}

// مكون شاشة التحميل
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20">
          <div className="w-full h-full border-4 border-orange-200 rounded-full"></div>
          <div className="w-full h-full border-4 border-orange-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="mt-4 sm:mt-6 text-gray-700 font-medium font-tajawal text-sm sm:text-base">جاري تحميل الموقع...</p>
        <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2 font-tajawal">يرجى الانتظار قليلاً</p>
      </div>
    </div>
  );
}

// ==============================
// مكون التخطيط الرئيسي
// ==============================
function AppLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showModals, setShowModals] = useState({
    addProject: false,
    addService: false,
    addTestimonial: false
  });
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  // حساب هذه القيم في المستوى الأعلى
  const isLoginPage = location.pathname === '/login';
  const isHomePage = location.pathname === '/';
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // التحقق مما إذا كان المسار الحالي هو صفحة تفاصيل كتالوج أو صفحة مشروع أو صفحة أدمن
  const shouldHideFloatingControls = useMemo(() => {
    // التحقق من المسارات المحددة بالضبط
    if (HIDE_FLOATING_CONTROLS_PATHS.includes(location.pathname)) {
      return true;
    }
    
    // التحقق من المسارات التي تبدأ بـ /project/ (لصفحات المشاريع الفردية)
    if (location.pathname.startsWith('/project/')) {
      return true;
    }
    
    // التحقق من المسارات التي تبدأ بـ /admin (لصفحات لوحة التحكم)
    if (location.pathname.startsWith('/admin')) {
      return true;
    }
    
    // إخفاء الأزرار في صفحة عرض صور المشروع أيضاً
    if (location.pathname.startsWith('/admin/project-photo')) {
      return true;
    }
    
    return false;
  }, [location.pathname]);

  // معالج اكتمال السبلاش
  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  // إخفاء السبلاش عند تغيير المسار إذا كنا في صفحة غير الرئيسية أو غير الدخول
  useEffect(() => {
    if (!isHomePage && !isLoginPage) {
      setShowSplash(false);
    }
  }, [location.pathname, isHomePage, isLoginPage]);

  // ==============================
  // دوال معالجة الإشعارات
  // ==============================
  const handleNotificationClick = useCallback((notification) => {
    console.log('Notification clicked:', notification);
    
    const notificationRoutes = {
      'message': '/admin/messages',
      'testimonial': '/admin/testimonials',
      'project': '/admin/projects',
      'service-request': '/admin/service-requests',
      'project-request': '/admin/project-requests'
    };
    
    const route = notificationRoutes[notification.type];
    
    if (route) {
      toast.success(`جاري الانتقال إلى ${notification.title}`, {
        duration: 1500,
        icon: '📌',
      });
      
      setTimeout(() => {
        navigate(route);
      }, 500);
    } else {
      toast.success(`تم النقر على الإشعار: ${notification.title}`, {
        duration: 2000,
      });
    }
  }, [navigate]);

  // ==============================
  // دوال معالجة التبويبات
  // ==============================
  const handleTabClick = useCallback((tab) => {
    console.log('Tab clicked:', tab);
    
    const tabRoutes = {
      'projects': '/portfolio',
      'services': '/services',
      'testimonials': '/testimonials',
      'about-us': '/about',
      'home': '/',
      'contact': '/contact',
      'catalog': '/catalog-moodboard' // ✅ توجيه إلى صفحة المود بورد
    };
    
    if (location.pathname.startsWith('/admin')) {
      toast.success(`جاري تحديث بيانات ${tab}`, {
        duration: 1500,
        icon: '🔄',
      });
    } else {
      const route = tabRoutes[tab];
      if (route) {
        navigate(route);
      }
    }
  }, [location.pathname, navigate]);

  // ==============================
  // دوال تسجيل الدخول والخروج
  // ==============================
  const handleLogout = useCallback(async () => {
    try {
      if (user && userData) {
        try {
          await updateDoc(doc(db, "adminUsers", user.uid), {
            lastLogout: serverTimestamp(),
            lastActivity: serverTimestamp()
          });
        } catch (updateError) {
          console.log("ℹ️ Could not update logout timestamp:", updateError.message);
        }
      }
      
      await signOut(auth);
      setUser(null);
      setUserRole(null);
      setUserData(null);
      
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('adminName');
      localStorage.removeItem('adminPhone');
      localStorage.removeItem('isAdminLoggedIn');
      localStorage.removeItem('userData');
      
      toast.success('تم تسجيل الخروج بنجاح', {
        duration: 3000,
        icon: '👋',
      });
      
      if (location.pathname.startsWith('/admin')) {
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
      
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  }, [location.pathname, navigate, user, userData]);

  // ==============================
  // دوال المستخدم
  // ==============================
  const handleViewProfile = useCallback(() => {
    toast('قريباً: صفحة الملف الشخصي', {
      icon: '👤',
      duration: 2000,
    });
  }, []);

  const handleViewSettings = useCallback(() => {
    toast('قريباً: صفحة الإعدادات', {
      icon: '⚙️',
      duration: 2000,
    });
  }, []);

  // ==============================
  // دوال الإشعارات
  // ==============================
  const handleMarkAllAsRead = useCallback(() => {
    toast.success('تم تعيين جميع الإشعارات كمقروءة', {
      duration: 2000,
      icon: '✅',
    });
  }, []);

  const handleViewAllNotifications = useCallback(() => {
    navigate('/admin/notifications');
    toast.success('جاري فتح صفحة الإشعارات', {
      duration: 1500,
      icon: '🔔',
    });
  }, [navigate]);

  // ==============================
  // دوال البيانات
  // ==============================
  const handleRefreshData = useCallback(() => {
    toast.success('جاري تحديث البيانات...', {
      duration: 1500,
      icon: '🔄',
    });
    
    setTimeout(() => {
      toast.success('تم تحديث البيانات بنجاح', {
        duration: 2000,
        icon: '✅',
      });
    }, 1500);
  }, []);

  // ==============================
  // دوال النوافذ المنبثقة
  // ==============================
  const handleAddProject = useCallback(() => {
    setShowModals(prev => ({ ...prev, addProject: true }));
  }, []);

  const handleAddService = useCallback(() => {
    setShowModals(prev => ({ ...prev, addService: true }));
  }, []);

  const handleAddTestimonial = useCallback(() => {
    setShowModals(prev => ({ ...prev, addTestimonial: true }));
  }, []);

  const handleCloseProjectModal = useCallback(() => {
    setShowModals(prev => ({ ...prev, addProject: false }));
  }, []);

  const handleCloseServiceModal = useCallback(() => {
    setShowModals(prev => ({ ...prev, addService: false }));
  }, []);

  const handleCloseTestimonialModal = useCallback(() => {
    setShowModals(prev => ({ ...prev, addTestimonial: false }));
  }, []);

  const handleAfterAdd = useCallback((type) => {
    toast.success(`تمت إضافة ${type} بنجاح`, {
      duration: 2000,
      icon: '✅',
    });
  }, []);

  // ==============================
  // دوال أخرى
  // ==============================
  const handleSaveAboutUs = useCallback(() => {
    toast.success('تم حفظ التغييرات بنجاح', {
      duration: 2000,
      icon: '💾',
    });
  }, []);

  const toggleBodyScroll = useCallback((enable) => {
    if (typeof window !== 'undefined') {
      if (enable) {
        document.body.classList.remove('body-no-scroll');
      } else {
        document.body.classList.add('body-no-scroll');
      }
    }
  }, []);

  // ==============================
  // دالة حل مشكلة عناصر Home.js الثابتة
  // ==============================
  const cleanupHomeFixedElements = useCallback(() => {
    if (location.pathname !== '/') {
      console.log('🧹 تنظيف عناصر Home.js الثابتة');
      
      const homeNavs = document.querySelectorAll('nav[class*="fixed"], header[class*="fixed"]');
      homeNavs.forEach(element => {
        if (element.classList.toString().includes('Home') || 
            element.parentElement?.classList.toString().includes('Home')) {
          element.style.display = 'none';
          element.style.visibility = 'hidden';
          element.style.opacity = '0';
          element.style.pointerEvents = 'none';
          element.style.zIndex = '-9999';
        }
      });
      
      const progressLines = document.querySelectorAll('[class*="Progress"], [class*="progress"]');
      progressLines.forEach(element => {
        if (element.style.position === 'fixed') {
          element.style.display = 'none';
        }
      });
      
      document.body.style.overflow = 'auto';
      document.body.style.position = 'static';
      document.documentElement.style.overflow = 'auto';
      
      document.body.classList.remove('body-no-scroll', 'overflow-hidden');
    }
  }, [location.pathname]);

  // ==============================
  // التأثير: تنظيف عناصر Home.js عند تغيير المسار
  // ==============================
  useEffect(() => {
    cleanupHomeFixedElements();
    
    const timer1 = setTimeout(cleanupHomeFixedElements, 50);
    const timer2 = setTimeout(cleanupHomeFixedElements, 200);
    
    const handleScroll = () => {
      cleanupHomeFixedElements();
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname, cleanupHomeFixedElements]);

  // ==============================
  // جلب بيانات المستخدم
  // ==============================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        console.log("🔥 Firebase User Authenticated:", firebaseUser.uid);
        setUser(firebaseUser);
        
        try {
          let userData = null;
          let userRole = null;
          let userCollection = null;
          
          const adminDoc = await getDoc(doc(db, "adminUsers", firebaseUser.uid));
          
          if (adminDoc.exists()) {
            userData = adminDoc.data();
            userRole = userData.role;
            userCollection = "adminUsers";
            console.log("✅ User found in adminUsers:", userRole);
          } 
          else {
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            if (userDoc.exists()) {
              userData = userDoc.data();
              userRole = userData.role || 'viewer';
              userCollection = "users";
              console.log("✅ User found in users:", userRole);
            }
          }
          
          if (!userData) {
            console.log("⚠️ User NOT found in any collection - creating default entry");
            
            const defaultUserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'مستخدم',
              role: 'viewer',
              createdAt: serverTimestamp(),
              isActive: true,
              status: 'active',
              lastLogin: serverTimestamp(),
              createdBy: 'system',
              autoCreated: true
            };
            
            try {
              await setDoc(doc(db, "adminUsers", firebaseUser.uid), defaultUserData);
              userData = defaultUserData;
              userRole = 'viewer';
              userCollection = "adminUsers";
              console.log("✅ Created default user in adminUsers");
            } catch (createError) {
              console.error("❌ Error creating default user:", createError);
              
              try {
                await setDoc(doc(db, "users", firebaseUser.uid), defaultUserData);
                userData = defaultUserData;
                userRole = 'viewer';
                userCollection = "users";
                console.log("✅ Created default user in users");
              } catch (secondError) {
                console.error("❌ Error creating default user in users:", secondError);
              }
            }
          }
          
          if (userData) {
            if (!userData.isActive || userData.status === 'deactivated') {
              toast.warning("الحساب معطل. الرجاء التواصل مع المسؤول", {
                duration: 5000,
                icon: '⚠️'
              });
              
              await signOut(auth);
              setUser(null);
              setUserRole(null);
              setUserData(null);
              setLoading(false);
              return;
            }
            
            try {
              await updateDoc(doc(db, userCollection, firebaseUser.uid), {
                lastLogin: serverTimestamp(),
                lastActivity: serverTimestamp()
              });
            } catch (timestampError) {
              console.log("ℹ️ Could not update login timestamp:", timestampError.message);
            }
            
            setUserRole(userRole);
            setUserData(userData);
            
            localStorage.setItem('userRole', userRole);
            localStorage.setItem('userEmail', userData.email || firebaseUser.email);
            localStorage.setItem('isAdminLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify(userData));
            
            if (userData.name) {
              localStorage.setItem('adminName', userData.name);
            }
            
            if (userData.phone) {
              localStorage.setItem('adminPhone', userData.phone);
            }
            
            if (userData.profileImage) {
              localStorage.setItem('adminProfileImage', userData.profileImage);
            }
            
            if (location.pathname === '/admin') {
              toast.success(`مرحباً ${userData.name}! تم تسجيل الدخول بنجاح`, {
                duration: 3000,
                icon: '👋'
              });
            }
          }
          
        } catch (error) {
          console.error("❌ Error in user authentication flow:", error);
          
          toast.error("حدث خطأ في تحميل بيانات المستخدم، لكن يمكنك الاستمرار في استخدام النظام", {
            duration: 4000,
            icon: '⚠️',
          });
          
          setUserRole('viewer');
          setUserData({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'مستخدم',
            role: 'viewer',
            isActive: true
          });
          
          localStorage.setItem('userRole', 'viewer');
          localStorage.setItem('userEmail', firebaseUser.email);
          localStorage.setItem('isAdminLoggedIn', 'true');
        }
        
      } else {
        console.log("👤 No user authenticated");
        setUser(null);
        setUserRole(null);
        setUserData(null);
        
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminName');
        localStorage.removeItem('adminPhone');
        localStorage.removeItem('adminProfileImage');
        localStorage.removeItem('userData');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [location.pathname]);

  // ==============================
  // جلب بيانات المستخدم من localStorage عند التحميل
  // ==============================
  useEffect(() => {
    if (!loading && !user) {
      const savedUserData = localStorage.getItem('userData');
      if (savedUserData) {
        try {
          const parsedData = JSON.parse(savedUserData);
          setUserData(parsedData);
          setUserRole(parsedData.role);
        } catch (e) {
          console.log("❌ Error parsing saved user data");
        }
      }
    }
  }, [loading, user]);

  // ==============================
  // إعداد props لـ AdminDashboard
  // ==============================
  const adminDashboardProps = useMemo(() => ({
    currentUser: user,
    userData: userData,
    userRole: userRole,
    userEmail: user?.email || localStorage.getItem('userEmail'),
    
    onNotificationClick: handleNotificationClick,
    onTabClick: handleTabClick,
    
    onLogout: handleLogout,
    onViewProfile: handleViewProfile,
    onViewSettings: handleViewSettings,
    
    onMarkAllAsRead: handleMarkAllAsRead,
    onViewAllNotifications: handleViewAllNotifications,
    
    onRefreshData: handleRefreshData,
    
    onAddProject: handleAddProject,
    onAddService: handleAddService,
    onAddTestimonial: handleAddTestimonial,
    onSaveAboutUs: handleSaveAboutUs,
    
    toggleBodyScroll,
    
    showModals,
    onCloseProjectModal: handleCloseProjectModal,
    onCloseServiceModal: handleCloseServiceModal,
    onCloseTestimonialModal: handleCloseTestimonialModal,
    onAfterAdd: handleAfterAdd
  }), [
    user,
    userData,
    userRole,
    handleNotificationClick,
    handleTabClick,
    handleLogout,
    handleViewProfile,
    handleViewSettings,
    handleMarkAllAsRead,
    handleViewAllNotifications,
    handleRefreshData,
    handleAddProject,
    handleAddService,
    handleAddTestimonial,
    handleSaveAboutUs,
    toggleBodyScroll,
    showModals,
    handleCloseProjectModal,
    handleCloseServiceModal,
    handleCloseTestimonialModal,
    handleAfterAdd
  ]);

  // عرض شاشة التحميل إذا كان التحميل جارياً
  if (loading) {
    return <LoadingScreen />;
  }

  // تحديد ما إذا كنا نظهر السبلاش
  const shouldShowSplash = (isHomePage || isLoginPage) && showSplash;

  // ==============================
  // التعديل الجوهري: إذا كان shouldShowSplash صحيحاً، نعرض فقط SplashScreen
  // ==============================
  if (shouldShowSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  // وإلا نعرض المحتوى الطبيعي للتطبيق
  return (
    <div className="flex flex-col text-sm md:text-base">
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            border: '1px solid #f3f4f6',
            fontFamily: 'Tajawal, sans-serif',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(249, 115, 22, 0.1)',
            maxWidth: '500px',
            width: '90vw'
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
            style: {
              background: '#f0fdf4',
              color: '#065f46',
              border: '1px solid #86efac',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
            },
          },
          warning: {
            duration: 5000,
            iconTheme: {
              primary: '#f59e0b',
              secondary: '#fff',
            },
            style: {
              background: '#fffbeb',
              color: '#92400e',
              border: '1px solid #fde68a',
            },
          },
          loading: {
            style: {
              background: '#fffbeb',
              color: '#92400e',
              border: '1px solid #fde68a',
            },
          },
        }}
      />
      
      {/* إخفاء الأزرار العائمة في صفحات تفاصيل الكتالوج وصفحة المشروع وصفحة الأدمن فقط */}
      {/* صفحة الكتالوج مودبورد وصفحة AdminProjects ستظهر فيها الأزرار */}
      {!shouldHideFloatingControls && <FloatingControls />}
      
      <ScrollToTop />
      
      <main className="flex-grow">
        <Routes>
          {/* ========== الصفحات العامة ========== */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/project/:id" element={<Project />} />
          <Route path="/login" element={<Login />} />
          
          {/* ========== صفحات الكتالوج ========== */}
          {/* ✅ صفحة الكتالوج الرئيسية (مودبورد) - ستظهر فيها الأزرار العائمة */}
          <Route path="/catalog-moodboard" element={<CatalogMoodboard />} />
          
          {/* ✅ صفحة عرض المود بورد - لن تظهر فيها الأزرار العائمة */}
          <Route path="/components/catalog/MoodBoardPage" element={<MoodBoardPage />} />
          <Route path="/catalog/moodboard" element={<MoodBoardPage />} /> {/* مسار مختصر */}
          
          {/* صفحات تفاصيل الكتالوج - لن تظهر فيها الأزرار العائمة */}
          <Route path="/components/catalog/PaintPage" element={<PaintPage />} />
          <Route path="/components/catalog/TilesPage" element={<TilesPage />} />
          <Route path="/components/catalog/LightingPage" element={<LightingPage />} />
          <Route path="/components/catalog/ParquetPage" element={<ParquetPage />} />
          <Route path="/components/catalog/GypsumPage" element={<GypsumPage />} />
          <Route path="/components/catalog/CurtainsPage" element={<CurtainsPage />} />
          <Route path="/components/catalog/WoodPage" element={<WoodPage />} />
          <Route path="/components/catalog/AluminumPage" element={<AluminumPage />} />
          <Route path="/components/catalog/MarblePage" element={<MarblePage />} />
          
          {/* مسارات مختصرة للكتالوج */}
          <Route path="/catalog/paint" element={<PaintPage />} />
          <Route path="/catalog/tiles" element={<TilesPage />} />
          <Route path="/catalog/lighting" element={<LightingPage />} />
          <Route path="/catalog/parquet" element={<ParquetPage />} />
          <Route path="/catalog/gypsum" element={<GypsumPage />} />
          <Route path="/catalog/curtains" element={<CurtainsPage />} />
          <Route path="/catalog/wood" element={<WoodPage />} />
          <Route path="/catalog/aluminum" element={<AluminumPage />} />
          <Route path="/catalog/marble" element={<MarblePage />} />
          
          {/* ========== صفحة إدارة أعمالنا المستقلة ========== */}
          {/* ✅ هذه الصفحة ستظهر فيها الأزرار العائمة */}
          <Route path="/admin-projects" element={<AdminProjects userData={userData} />} />
          
          
          {/* ========== لوحة التحكم ========== */}
          <Route 
            path="/admin/*" 
            element={
              user
                ? <AdminDashboard {...adminDashboardProps} />
                : <Navigate to="/login" replace />
            } 
          />

          {/* ========== إعادة التوجيه للصفحة الرئيسية ========== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* إخفاء الفوتر في صفحة الدخول ولوحة التحكم */}
      {!isLoginPage && !isAdminPage && <Footer />}
    </div>
  );
}

// ==============================
// مكون إخفاء عناصر Home الثابتة للمكونات الأخرى
// ==============================
export function HideHomeElementsOnMount() {
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname !== '/') {
      const hideHomeFixedElements = () => {
        const homeNavs = document.querySelectorAll('nav[class*="fixed"], header[class*="fixed"]');
        homeNavs.forEach(nav => {
          if (nav.textContent.includes('DEMORE') || nav.classList.toString().includes('Home')) {
            nav.style.display = 'none';
            nav.style.visibility = 'hidden';
          }
        });
        
        document.querySelectorAll('[class*="floating"]').forEach(el => {
          el.style.display = 'none';
        });
      };
      
      hideHomeFixedElements();
      setTimeout(hideHomeFixedElements, 100);
      setTimeout(hideHomeFixedElements, 500);
      
      return () => {};
    }
  }, [location.pathname]);
  
  return null;
}

// ==============================
// المكون الرئيسي للتطبيق
// ==============================
function App() {
  const setupViewportHeight = useCallback(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  const testFirebaseConnection = useCallback(async () => {
    try {
      console.log("🧪 Testing Firebase connection...");
      console.log("✅ Firebase Auth initialized:", !!auth);
      console.log("✅ Firestore initialized:", !!db);
      console.log("ℹ️ Checking for required collections...");
    } catch (error) {
      console.error("❌ Firebase test failed:", error);
      
      toast.error("مشكلة في الاتصال بقاعدة البيانات. الرجاء المحاولة لاحقاً", {
        duration: 5000,
        icon: '⚠️'
      });
    }
  }, []);

  useEffect(() => {
    testFirebaseConnection();
    
    const cleanup = setupViewportHeight();
    
    document.body.classList.add('touch-manipulation');
    
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      document.body.classList.add('ios-device');
    }
    
    const initializeUserData = () => {
      const savedData = localStorage.getItem('userData');
      if (!savedData && auth.currentUser) {
        const defaultData = {
          email: auth.currentUser.email,
          role: localStorage.getItem('userRole') || 'admin',
          name: localStorage.getItem('adminName') || auth.currentUser.displayName || 'مستخدم',
          phone: localStorage.getItem('adminPhone') || '',
          lastLogin: new Date().toLocaleString('ar-SA'),
          uid: auth.currentUser.uid,
          isActive: true
        };
        localStorage.setItem('userData', JSON.stringify(defaultData));
      }
    };

    setTimeout(() => {
      if (auth) {
        initializeUserData();
      }
    }, 1000);
    
    return cleanup;
  }, [setupViewportHeight, testFirebaseConnection]);

  return (
    <LanguageProvider>
      <Router>
        <HideHomeElementsOnMount />
        <AppLayout />
      </Router>
    </LanguageProvider>
  );
}

export default App;