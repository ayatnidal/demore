// src/components/Admin/Sidebar.js
import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  IconGrid, IconPackage, 
  IconMail, IconPhone, IconCalendar, IconUsers,
  IconLogout,
  IconImage, IconUser,
  IconX, IconHome,
  IconCatalog
} from '../Icons';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  userData, 
  counts = {},
  onLogout,
  onChangePassword,
  isOpen = false,
  onClose = () => {},
  onToggleHeader = () => {}
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  
  // تحديد إذا كان الجهاز موبايل
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // على الديسكتوب، نجعل القائمة مفتوحة افتراضياً
      if (!mobile) {
        setIsCollapsed(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // 🔥 عند فتح السايدبار على الموبايل، نخفي الهيدر
  useEffect(() => {
    if (isMobile && isOpen && onToggleHeader) {
      onToggleHeader(true); // إخفاء الهيدر عند فتح السايدبار
    }
  }, [isMobile, isOpen, onToggleHeader]);
  
  // 🔥 دالة لإغلاق السايدبار مع التحكم في الهيدر
  const closeSidebar = useCallback(() => {
    // 🔥 إظهار الهيدر قبل إغلاق السايدبار
    if (isMobile && onToggleHeader) {
      onToggleHeader(false);
    }
    
    if (onClose) {
      onClose();
    }
  }, [isMobile, onClose, onToggleHeader]);
  
  // إغلاق القائمة عند النقر خارجها على الموبايل
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar();
      }
    };
    
    if (isMobile && isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobile, isOpen, closeSidebar]);
  
  // 🔥 دالة للضغط على عنصر قائمة مع التحكم في الهيدر
  const handleMenuItemClick = (tabId) => {
    // ✅ التحقق مما إذا كان العنصر هو الكتالوج
    if (tabId === 'catalog-moodboard') {
      // فتح صفحة الكتالوج في نفس التبويب باستخدام navigate
      navigate('/catalog-moodboard');
      if (isMobile) {
        closeSidebar();
      }
      return;
    }
    
    // ✅ التحقق مما إذا كان العنصر هو "أعمالنا"
    if (tabId === 'admin-projects') {
      // فتح صفحة أعمالنا في نفس التبويب باستخدام navigate
      navigate('/admin-projects');
      if (isMobile) {
        closeSidebar();
      }
      return;
    }
    
    setActiveTab(tabId);
    if (isMobile) {
      closeSidebar();
    }
  };
  
  // 🔥 دالة لإغلاق السايدبار من الزر X
  const handleCloseClick = () => {
    closeSidebar();
  };
  

  
  // قائمة التبويبات الكاملة مع جميع الصفحات
  const menuItems = [
    { id: "overview", label: "نظرة عامة", icon: IconGrid, count: null, adminOnly: false, showForAll: true },
    { id: "projects", label: "المشاريع", icon: IconImage, count: null, adminOnly: false, showForAll: true },
    { id: "services", label: "الخدمات", icon: IconPackage, count: null, adminOnly: false, showForAll: true },
    { id: "catalog-moodboard", label: "الكتالوج", icon: IconCatalog, count: counts.lowStockCatalog || 0, adminOnly: false, showForAll: false },
    { id: "admin-projects", label: "أعمالنا", icon: IconImage, count: null, adminOnly: false, showForAll: false },
    { id: "messages", label: "الرسائل", icon: IconMail, count: counts.unreadMessages || 0, adminOnly: false, showForAll: true },
    { id: "service-requests", label: "طلبات الخدمات", icon: IconPhone, count: counts.pendingServiceRequests || 0, adminOnly: false, showForAll: true },
    { id: "project-requests", label: "طلبات المشاريع", icon: IconCalendar, count: counts.pendingProjectRequests || 0, adminOnly: false, showForAll: false },
    { id: "users", label: "المستخدمين", icon: IconUsers, count: null, adminOnly: true, showForAll: false },
    { id: "profile", label: "الملف الشخصي", icon: IconUser, count: null, adminOnly: false, showForAll: true },
  ];
  
  // تصفية القائمة بناءً على صلاحية المستخدم
  const filteredMenuItems = menuItems.filter(item => {
    // الصفحات الخاصة بالأدمن فقط
    if (item.adminOnly && userData?.role !== "admin" && userData?.role !== "super_admin") {
      return false;
    }
    
    // الصفحات التي تظهر للجميع
    if (item.showForAll) {
      return true;
    }
    
    // تحديد الصفحات بناءً على الصلاحية
    switch(userData?.role) {
      case "admin":
      case "super_admin":
        // الأدمن يرى كل شيء
        return true;
        
      case "editor":
        // المحرر يرى كل شيء إلا إدارة المستخدمين
        if (item.id === "users") {
          return false;
        }
        return true;
        
      case "viewer":
        // المشاهد يرى فقط:
        // overview, projects, services, testimonials, messages, service-requests, profile
        const viewerAllowed = [
          "overview", "projects", "services", "testimonials", 
          "messages", "service-requests", "profile"
        ];
        return viewerAllowed.includes(item.id);
        
      default:
        return false;
    }
  });
  
  const getRoleLabel = (role) => {
    switch(role) {
      case "super_admin":
        return "المدير العام";
      case "admin":
        return "مدير النظام";
      case "editor":
        return "محرر محتوى";
      case "viewer":
        return "مشاهد";
      default:
        return "مستخدم";
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case "super_admin":
        return "from-purple-500 to-purple-600";
      case "admin":
        return "from-red-500 to-red-600";
      case "editor":
        return "from-blue-500 to-blue-600";
      case "viewer":
        return "from-slate-500 to-slate-600";
      default:
        return "from-slate-500 to-slate-600";
    }
  };

  // 🔥 دالة للعودة للصفحة الرئيسية مع التحكم في الهيدر
  const handleGoToHome = () => {
    if (isMobile) {
      closeSidebar();
    }
    window.location.href = '/';
  };

  // 🔥 دالة لتسجيل الخروج مع التحكم في الهيدر
  const handleLogout = () => {
    if (isMobile) {
      closeSidebar();
    }
    if (onLogout) {
      onLogout();
    }
  };

  
  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-all duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed lg:relative
          ${isMobile ? (isOpen ? "right-0" : "-right-full") : "right-0"}
          top-0 h-full w-64 lg:w-64
          bg-gradient-to-b from-white to-slate-50
          text-slate-800 z-40
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
          flex flex-col
          shadow-xl border-l border-slate-200
        `}
      >
        {/* Header with Close Button for Mobile */}
        <div className={`p-4 sm:p-6 border-b border-slate-200 bg-white`}>
          <div className="flex items-center justify-between">
            {(!isCollapsed || isMobile) ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex-1">
                  <h1 className={`font-bold ${isMobile ? 'text-lg sm:text-xl' : 'text-lg'} text-slate-900`}>
                    لوحة التحكم
                  </h1>
                  <p className="text-slate-600 text-xs mt-1">
                    {getRoleLabel(userData?.role)}
                  </p>
                </div>
                
                {/* Mobile Close Button */}
                {isMobile && (
                  <button
                    onClick={handleCloseClick}
                    className="p-2 text-slate-600 hover:text-slate-800 transition-colors rounded-lg hover:bg-slate-100 flex-shrink-0 ml-2"
                    aria-label="إغلاق القائمة"
                  >
                    <IconX className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                )}
                
                {/* Desktop Collapse Button */}
                
              </div>
            ) : (
              <div className="w-full flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow">
                  <span className="text-white font-bold text-lg">ل</span>
                </div>
              </div>
            )}
          </div>
          
          {/* User Info - تظهر فقط عندما تكون القائمة مفتوحة أو على الموبايل */}
          {(!isCollapsed || isMobile) && (
            <div className={`p-3 sm:p-4 bg-slate-100/50 rounded-lg border border-slate-200 mt-4`}>
              <div className={`flex items-center gap-3`}>
                <div className={`flex items-center justify-center ${
                  isMobile ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-10 h-10 sm:w-12 sm:h-12'
                } bg-gradient-to-br ${getRoleColor(userData?.role)} rounded-full text-white font-bold text-sm sm:text-lg shadow-md flex-shrink-0`}>
                  {userData?.name?.charAt(0) || userData?.email?.charAt(0)?.toUpperCase() || "م"}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-slate-800 truncate ${
                    isMobile ? 'text-sm sm:text-base' : 'text-sm'
                  }`}>
                    {userData?.name?.split(' ')[0] || userData?.email?.split('@')[0] || "مستخدم"}
                  </p>
                  <p className={`text-slate-600 truncate text-xs sm:text-sm mt-0.5`} title={userData?.email}>
                    {userData?.email || "admin@example.com"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 bg-gradient-to-r ${getRoleColor(userData?.role)} bg-opacity-10 rounded-full text-xs text-slate-600`}>
                      {getRoleLabel(userData?.role)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* User Info Mini للوضع المطوي */}
          {isCollapsed && !isMobile && (
            <div className="mt-4 flex items-center justify-center">
              <div className={`w-10 h-10 bg-gradient-to-br ${getRoleColor(userData?.role)} rounded-full text-white font-bold text-lg flex items-center justify-center shadow-md`}>
                {userData?.name?.charAt(0) || userData?.email?.charAt(0)?.toUpperCase() || "م"}
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation Menu */}
        <nav className={`flex-1 p-3 sm:p-4 overflow-y-auto ${(isCollapsed && !isMobile) ? 'px-2' : ''}`}>
          <div className="mb-4">
            {(!isCollapsed || isMobile) && (
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                القائمة الرئيسية
              </h3>
            )}
            
            <div className="space-y-1 sm:space-y-1.5">
              {filteredMenuItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                const hasNotification = item.count > 0;
                
                // تحديد لون البادج بناءً على نوع الإشعار
                const getBadgeColor = () => {
                  if (isActive) return "bg-white/20 text-white";
                  
                  switch(item.id) {
                    case "catalog-moodboard":
                      return "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow";
                    case "admin-projects":
                      return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow";
                    case "testimonials":
                      return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow";
                    case "messages":
                      return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow";
                    case "service-requests":
                    case "project-requests":
                      return "bg-gradient-to-r from-red-500 to-red-600 text-white shadow";
                    default:
                      return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow";
                  }
                };
                
                return (
                  <div key={item.id} className="relative">
                    <button 
                      onClick={() => handleMenuItemClick(item.id)}
                      onMouseEnter={() => setShowTooltip(item.id)}
                      onMouseLeave={() => setShowTooltip(null)}
                      className={`
                        w-full flex items-center justify-between
                        px-3 sm:px-4 py-2.5 sm:py-3
                        rounded-lg transition-all duration-200
                        ${isActive 
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                        }
                        ${(isCollapsed && !isMobile) ? "justify-center px-3" : ""}
                        ${isMobile ? "py-3" : ""}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          isActive ? "text-white" : "text-slate-500"
                        }`} />
                        
                        {(!isCollapsed || isMobile) && (
                          <span className={`font-medium text-sm sm:text-base`}>
                            {item.label}
                          </span>
                        )}
                      </div>
                      
                      {hasNotification && !(isCollapsed && !isMobile) && (
                        <span className={`
                          flex items-center justify-center font-bold rounded-full
                          min-w-6 h-6 px-1.5 text-xs
                          ${getBadgeColor()}
                        `}>
                          {item.count > 9 ? "9+" : item.count}
                        </span>
                      )}
                      
                      {hasNotification && (isCollapsed && !isMobile) && (
                        <span className={`absolute top-1 right-1 w-2 h-2 rounded-full border border-white ${
                          item.id === "catalog-moodboard" ? "bg-purple-500" :
                          item.id === "admin-projects" ? "bg-blue-500" :
                          item.id === "testimonials" ? "bg-orange-500" :
                          item.id === "messages" ? "bg-blue-500" :
                          item.id === "service-requests" ? "bg-red-500" :
                          item.id === "project-requests" ? "bg-red-500" :
                          "bg-orange-500"
                        }`}></span>
                      )}
                    </button>
                    
                    {/* Tooltip للوضع المطوي */}
                    {(isCollapsed && !isMobile && showTooltip === item.id) && (
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg z-50 whitespace-nowrap min-w-[120px]">
                        <div className="font-medium mb-0.5">{item.label}</div>
                        {hasNotification && (
                          <div className={`text-xs px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${
                            item.id === "catalog-moodboard" ? "bg-purple-500 text-white" :
                            item.id === "admin-projects" ? "bg-blue-500 text-white" :
                            item.id === "testimonials" ? "bg-orange-500 text-white" :
                            item.id === "messages" ? "bg-blue-500 text-white" :
                            item.id === "service-requests" ? "bg-red-500 text-white" :
                            item.id === "project-requests" ? "bg-red-500 text-white" :
                            "bg-orange-500 text-white"
                          }`}>
                            {item.count} جديد
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Back to Home Button */}
          <div className="mt-4 sm:mt-6 pt-4 border-t border-slate-200">
            <button
              onClick={handleGoToHome}
              onMouseEnter={() => setShowTooltip('home')}
              onMouseLeave={() => setShowTooltip(null)}
              className={`
                w-full flex items-center justify-center transition-all duration-200 rounded-lg group
                px-3 sm:px-4 py-2.5 sm:py-3
                bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow hover:shadow-md
                ${isMobile ? "py-3" : ""}
                ${(isCollapsed && !isMobile) ? "justify-center px-3" : ""}
              `}
            >
              <IconHome className={`w-4 h-4 sm:w-5 sm:h-5`} />
              
              {(!isCollapsed || isMobile) && (
                <span className={`font-medium text-sm sm:text-base mr-2`}>
                  العودة للموقع
                </span>
              )}
            </button>
            
            {/* Tooltip للزر في الوضع المطوي */}
            {(isCollapsed && !isMobile && showTooltip === 'home') && (
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg z-50 whitespace-nowrap">
                العودة للصفحة الرئيسية
              </div>
            )}
          </div>
        </nav>
        
        {/* Footer Actions */}
        <div className="mt-auto border-t border-slate-200 p-4">
          <div className="space-y-2 sm:space-y-2.5">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              onMouseEnter={() => setShowTooltip('logout')}
              onMouseLeave={() => setShowTooltip(null)}
              className={`
                w-full flex items-center justify-center transition-all duration-200 rounded-lg group
                px-3 sm:px-4 py-2.5 sm:py-3
                bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow hover:shadow-md
                ${isMobile ? "py-3" : ""}
                ${(isCollapsed && !isMobile) ? "justify-center px-3" : ""}
              `}
            >
              <IconLogout className={`w-4 h-4 sm:w-5 sm:h-5`} />
              
              {(!isCollapsed || isMobile) && (
                <span className={`font-medium text-sm sm:text-base mr-2`}>
                  تسجيل الخروج
                </span>
              )}
            </button>
            
            {/* Tooltip للزر في الوضع المطوي */}
            {(isCollapsed && !isMobile && showTooltip === 'logout') && (
              <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-2 bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg z-50 whitespace-nowrap">
                تسجيل الخروج
              </div>
            )}
          </div>
          
          {/* Footer Info */}
          {(!isCollapsed || isMobile) && (
            <div className={`mt-4 sm:mt-6 pt-3 border-t border-slate-200 ${
              isMobile ? "text-center" : ""
            }`}>
              <div className={`flex items-center justify-between text-slate-500 ${
                isMobile ? "text-xs sm:text-sm" : "text-xs"
              }`}>
                <span className="font-medium">الإصدار 2.0</span>
                <span>© {new Date().getFullYear()}</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                نظام إدارة المحتوى
              </div>
            </div>
          )}
          
          {/* Footer Info Mini للوضع المطوي */}
          {(isCollapsed && !isMobile) && (
            <div className="mt-4 pt-3 border-t border-slate-200 text-center">
              <span className="text-xs text-slate-500">© {new Date().getFullYear()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        nav::-webkit-scrollbar {
          width: 4px;
        }
        nav::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        nav::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        nav::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.3);
        }
        
        /* Touch-friendly styles for mobile */
        @media (max-width: 768px) {
          button, a {
            touch-action: manipulation;
          }
          
          nav::-webkit-scrollbar {
            width: 3px;
          }
        }
        
        /* Smooth transitions */
        * {
          transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
      `}</style>
    </>
  );
};

Sidebar.defaultProps = {
  counts: {
    lowStockCatalog: 0,
    pendingTestimonials: 0,
    unreadMessages: 0,
    pendingServiceRequests: 0,
    pendingProjectRequests: 0
  },
  onLogout: () => console.log('Logout clicked'),
  onChangePassword: () => console.log('Change password clicked'),
  isOpen: false,
  onClose: () => {},
  onToggleHeader: () => {}
};

export default Sidebar;