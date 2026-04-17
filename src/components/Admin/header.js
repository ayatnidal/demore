// src/components/Admin/Header.js
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  IconGrid,
  IconImage,
  IconPackage,
  IconMessage,
  IconMail,
  IconPhone,
  IconCalendar,
  IconUsers,
  IconAbout,
  IconUser,
  IconRefresh,
  IconLogout,
  IconEye,
  IconChevronLeft,
  IconShield,
  IconEdit,
  IconMenu,
  IconX
} from '../Icons';

const Header = ({ 
  activeTab, 
  onRefreshData,
  onExportData,
  onLogout,
  onNavigateToProfile,
  userData = {},
  sidebarOpen = false,
  onToggleSidebar = () => {},
  onNavigateToDashboard = () => {},
  hideHeader = false,
  onToggleHeader = () => {}
}) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(!hideHeader);
  
  const userMenuRef = useRef(null);
  
  // 🔥 تحديث حالة إظهار الهيدر عند تغيير الخاصية
  useEffect(() => {
    setHeaderVisible(!hideHeader);
  }, [hideHeader]);
  
  // 🔥 إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);
  
  // 🔥 بيانات التبويب النشط
  const getTabData = useCallback(() => {
    const tabs = {
      overview: {
        title: "لوحة التحكم",
        icon: <IconGrid className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />,
        gradient: "from-orange-400 to-orange-500",
        description: "نظرة عامة على النظام والإحصائيات",
        path: "/admin/dashboard"
      },
      projects: {
        title: "المشاريع",
        icon: <IconImage className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500" />,
        gradient: "from-teal-400 to-teal-500",
        description: "إدارة معرض المشاريع والصور",
        path: "/admin/projects"
      },
      services: {
        title: "الخدمات",
        icon: <IconPackage className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />,
        gradient: "from-blue-400 to-blue-500",
        description: "إدارة الخدمات المقدمة والعروض",
        path: "/admin/services"
      },
      testimonials: {
        title: "الشهادات",
        icon: <IconMessage className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />,
        gradient: "from-emerald-400 to-emerald-500",
        description: "شهادات العملاء والتقييمات",
        path: "/admin/testimonials"
      },
      messages: {
        title: "الرسائل",
        icon: <IconMail className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" />,
        gradient: "from-indigo-400 to-indigo-500",
        description: "رسائل الزوار وطلبات الاتصال",
        path: "/admin/messages"
      },
      "service-requests": {
        title: "طلبات الخدمات",
        icon: <IconPhone className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />,
        gradient: "from-rose-400 to-rose-500",
        description: "طلبات الخدمات الجديدة والمعلقة",
        path: "/admin/service-requests"
      },
      "project-requests": {
        title: "طلبات المشاريع",
        icon: <IconCalendar className="w-5 h-5 sm:w-6 sm:h-6 text-violet-500" />,
        gradient: "from-violet-400 to-violet-500",
        description: "طلبات المشاريع والاستشارات",
        path: "/admin/project-requests"
      },
      users: {
        title: "المستخدمين",
        icon: <IconUsers className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />,
        gradient: "from-slate-400 to-slate-500",
        description: "إدارة مستخدمي النظام والصلاحيات",
        path: "/admin/users"
      },
      "about-us": {
        title: "من نحن",
        icon: <IconAbout className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500" />,
        gradient: "from-cyan-400 to-cyan-500",
        description: "معلومات الشركة والتفاصيل",
        path: "/admin/about-us"
      },
      profile: {
        title: "الملف الشخصي",
        icon: <IconUser className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />,
        gradient: "from-amber-400 to-amber-500",
        description: "معلومات المستخدم والإعدادات",
        path: "/admin/profile"
      }
    };
    
    return tabs[activeTab] || tabs.overview;
  }, [activeTab]);
  
  // 🔥 بيانات الدور (الصلاحية)
  const getRoleData = useCallback(() => {
    const roles = {
      admin: {
        label: "مدير النظام",
        shortLabel: "مدير",
        color: "text-orange-700",
        bgColor: "bg-orange-50",
        hoverBgColor: "hover:bg-orange-100",
        borderColor: "border-orange-200",
        gradient: "from-orange-500 to-orange-600",
        icon: <IconShield className="w-3.5 h-3.5 text-orange-600" />,
        badgeColor: "bg-orange-500",
        lightColor: "text-orange-400"
      },
      editor: {
        label: "محرر محتوى",
        shortLabel: "محرر",
        color: "text-blue-700",
        bgColor: "bg-blue-50",
        hoverBgColor: "hover:bg-blue-100",
        borderColor: "border-blue-200",
        gradient: "from-blue-500 to-blue-600",
        icon: <IconEdit className="w-3.5 h-3.5 text-blue-600" />,
        badgeColor: "bg-blue-500",
        lightColor: "text-blue-400"
      },
      viewer: {
        label: "مشاهد",
        shortLabel: "مشاهد",
        color: "text-slate-700",
        bgColor: "bg-slate-50",
        hoverBgColor: "hover:bg-slate-100",
        borderColor: "border-slate-200",
        gradient: "from-slate-500 to-slate-600",
        icon: <IconEye className="w-3.5 h-3.5 text-slate-600" />,
        badgeColor: "bg-slate-500",
        lightColor: "text-slate-400"
      }
    };
    
    return roles[userData?.role] || roles.viewer;
  }, [userData?.role]);
  
  // 🔥 النقر على عنوان التبويب
  const handleHeaderTabClick = useCallback(() => {
    const tabData = getTabData();
    
    if (onNavigateToDashboard && tabData.path === "/admin/dashboard") {
      onNavigateToDashboard();
    } else if (tabData.path) {
      navigate(tabData.path);
    }
  }, [navigate, getTabData, onNavigateToDashboard]);
  
  // 🔥 عرض الملف الشخصي
  const handleViewProfile = useCallback(() => {
    setShowUserMenu(false);
    
    if (onNavigateToProfile) {
      onNavigateToProfile();
    } else {
      navigate('/admin/profile');
    }
  }, [onNavigateToProfile, navigate]);
  
  // 🔥 تسجيل الخروج
  const handleLogout = useCallback(() => {
    setShowUserMenu(false);
    
    if (onLogout) {
      onLogout();
    }
  }, [onLogout]);
  
  // 🔥 تحديث البيانات
  const handleRefreshClick = useCallback(() => {
    if (onRefreshData) {
      onRefreshData();
    }
  }, [onRefreshData]);
  
  
  // 🔥 فتح/إغلاق القائمة الجانبية على الجوال
  const handleToggleSidebar = useCallback(() => {
    // تفعيل/تعطيل إظهار الهيدر
    if (onToggleHeader) {
      onToggleHeader(!sidebarOpen);
    } else {
      setHeaderVisible(!sidebarOpen);
    }
    
    if (onToggleSidebar) {
      onToggleSidebar();
    }
    
    // إغلاق قائمة المستخدم
    setShowUserMenu(false);
  }, [onToggleSidebar, onToggleHeader, sidebarOpen]);
  
  // 🔥 البيانات المحسوبة
  const tabData = useMemo(() => getTabData(), [getTabData]);
  const roleData = useMemo(() => getRoleData(), [getRoleData]);
  
  
  
  // 🔥 قائمة المستخدم
  const UserMenuButton = () => (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={() => setShowUserMenu(!showUserMenu)}
        className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow"
        aria-label="قائمة المستخدم"
      >
        {/* صورة المستخدم */}
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-300 shadow-sm flex items-center justify-center">
            <span className="text-orange-700 font-bold text-sm">
              {userData?.name?.charAt(0)?.toUpperCase() || userData?.email?.charAt(0)?.toUpperCase() || "م"}
            </span>
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
        </div>
        
        {/* معلومات المستخدم (لأجهزة الكمبيوتر) */}
        <div className="hidden md:block text-right">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-bold text-slate-900 truncate max-w-[100px]">
              {userData?.name || userData?.email?.split('@')[0] || "مستخدم"}
            </p>
            <div className={`px-1.5 py-0.5 rounded text-xs font-medium ${roleData.bgColor} ${roleData.color}`}>
              {roleData.shortLabel}
            </div>
          </div>
          <p className="text-xs text-slate-500 truncate max-w-[100px]">
            {userData?.email || "بريد إلكتروني"}
          </p>
        </div>
        
        {/* سهم القائمة */}
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* قائمة المستخدم المنسدلة */}
      {showUserMenu && (
        <div className="fixed sm:absolute inset-x-4 sm:inset-x-auto sm:right-0 top-16 sm:top-full sm:mt-2 w-auto sm:w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-slide-down">
          {/* رأس القائمة */}
          <div className="p-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
            <div className="flex items-center gap-3">
              {/* صورة المستخدم */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 border-2 border-orange-300 shadow-sm flex items-center justify-center">
                  <span className="text-orange-700 font-bold text-lg">
                    {userData?.name?.charAt(0)?.toUpperCase() || userData?.email?.charAt(0)?.toUpperCase() || "م"}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              
              {/* معلومات المستخدم */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {userData?.name || userData?.email?.split('@')[0] || "مستخدم"}
                </h3>
                <p className="text-xs text-slate-600 truncate mt-1" title={userData?.email}>
                  {userData?.email || "بريد إلكتروني"}
                </p>
                {/* بطاقة الدور */}
                <div className="flex items-center gap-1.5 mt-2">
                  <div className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 ${roleData.bgColor} ${roleData.color} border ${roleData.borderColor}`}>
                    <span className="opacity-75">{roleData.icon}</span>
                    <span className="font-bold">{roleData.label}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* خيارات القائمة */}
          <div className="py-2">
            <button 
              onClick={handleViewProfile}
              className="w-full flex items-center justify-between px-4 py-3 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 group border-b border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                  <IconUser className="w-4 h-4 text-blue-600 group-hover:text-blue-800" />
                </div>
                <div className="text-right">
                  <span className="font-bold">الملف الشخصي</span>
                  <p className="text-xs text-slate-500 mt-0.5">عرض وتعديل معلوماتك</p>
                </div>
              </div>
              <IconChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
            </button>
          </div>
          
          {/* زر تسجيل الخروج */}
          <div className="p-4 bg-gradient-to-r from-slate-50 to-white border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl transition-all duration-300 shadow hover:shadow-md text-sm font-bold"
            >
              <IconLogout className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
  // 🔥 زر قائمة الجوال
  const MobileMenuButton = () => (
    <button
      onClick={handleToggleSidebar}
      className="lg:hidden p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center"
      aria-label={sidebarOpen ? "إغلاق القائمة" : "فتح القائمة"}
      style={{ minWidth: '44px', minHeight: '44px' }}
    >
      {sidebarOpen ? (
        <IconX className="w-6 h-6" />
      ) : (
        <IconMenu className="w-6 h-6" />
      )}
    </button>
  );
  
  // 🔥 إذا كان الهيدر مخفيًا، لا نعيد عرضه
  if (!headerVisible) {
    return null;
  }
  
  return (
    <header 
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 md:px-6 py-4 shadow-sm transition-all duration-300 ${
        headerVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6">
        
        {/* القسم الأول: العنوان */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
          
          {/* زر القائمة على الجوال + العنوان */}
          <div className="flex items-center justify-between md:justify-start gap-3">
            <MobileMenuButton />
            
            {/* عنوان التبويب */}
            <div 
              className="flex items-center gap-3 cursor-pointer group flex-1"
              onClick={handleHeaderTabClick}
            >
              {/* أيقونة التبويب */}
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${tabData.gradient} shadow group-hover:shadow-md transition-all duration-300 transform group-hover:scale-105`}>
                {tabData.icon}
              </div>
              
              {/* معلومات التبويب */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                    {tabData.title}
                  </h1>
                  {tabData.description && (
                    <span className="hidden lg:inline-block text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                      {tabData.description}
                    </span>
                  )}
                </div>
                
                {/* معلومات الدور والوقت */}
                <div className="flex items-center gap-2 mt-1">
                  <div className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 ${roleData.bgColor} ${roleData.color}`}>
                    <span className="opacity-75">{roleData.icon}</span>
                    <span>{roleData.label}</span>
                  </div>
                  <p className="text-xs text-slate-500 hidden sm:block">
                    آخر دخول: {new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* القسم الثاني: أزرار التحكم */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
          
          {/* أزرار التحكم الرئيسية */}
          <div className="flex items-center gap-2 flex-wrap">
           
            {/* زر تحديث البيانات */}
            {onRefreshData && (
              <button
                onClick={handleRefreshClick}
                title="تحديث البيانات"
                className="p-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all duration-200 shadow-sm hover:shadow"
              >
                <IconRefresh className="w-5 h-5 text-slate-600" />
              </button>
            )}
          </div>
          
          {/* زر المستخدم */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <UserMenuButton />
          </div>
        </div>
      </div>
    </header>
  );
};

// 🔥 القيم الافتراضية
Header.defaultProps = {
  userData: {
    name: "مدير النظام",
    email: "admin@decor.com",
    role: "admin"
  },
  onRefreshData: () => {},
  onExportData: () => {},
  onLogout: () => {},
  onNavigateToProfile: () => {},
  onNavigateToDashboard: () => {},
  sidebarOpen: false,
  onToggleSidebar: () => {},
  hideHeader: false,
  onToggleHeader: () => {}
};

export default Header;

// 🔥 CSS Animations
const styles = `
@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slide-down 0.2s ease-out;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
`;

// 🔥 إضافة الأنماط إلى المستند
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}