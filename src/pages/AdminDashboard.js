// src/pages/AdminDashboard.js
import { useState, useEffect, useCallback, useMemo ,useRef } from "react";
import { auth, db } from "../firebase";
import { signOut, onAuthStateChanged, updatePassword, updateProfile } from "firebase/auth";
import { collection, getDocs, addDoc, deleteDoc, doc, 
  updateDoc, serverTimestamp, query, orderBy,
  getDoc, setDoc
} from "firebase/firestore";
import { useNavigate, Routes, Route, Navigate, useLocation } from "react-router-dom";

// استيراد المكونات من الملفات المنفصلة
import AboutUsSection from "../components/Admin/AboutUsSection";
import ProjectModal from "../components/Admin/ProjectModal";
import ServiceModal from "../components/Admin/ServiceModal";
import CatalogModal from "../components/Admin/CatalogModal";
import AdminProjects from "../components/Admin/AdminProjects";


// ✅ استيراد صفحة الكتالوج الجديدة
import CatalogMoodboard from "./CatalogMoodboard";

// استيراد مكونات الـ Admin الجديدة
import Sidebar from "../components/Admin/Sidebar";
import Header from "../components/Admin/header";
import ServiceRequests from "../components/Admin/ServiceRequests";
import ProjectRequests from "../components/Admin/ProjectRequests";

// استيراد الصفحات الجديدة
import Profile from "../components/Admin/Profile";
import UserManagement from "../components/Admin/UserManagement";

// استيراد الأيقونات
import {
  IconPackage,
  IconMail,
  IconPlus,
  IconEdit,
  IconTrash,
  IconEye,
  IconEyeOff,
  IconCheck,
  IconX,
  IconImage,
  IconLock,
  IconShield,
  IconCalendar,
  IconPhone,
  IconWhatsApp,
  IconInfo,
  IconUser, 
  IconChevronLeft,
  IconMapPin,
  IconTag,
  IconStar
} from "../components/Icons";

// ==============================
// مكون Toast للإشعارات
// ==============================
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const bgColor = type === 'success' ? 'bg-emerald-500' : 
                  type === 'error' ? 'bg-red-500' : 
                  type === 'warning' ? 'bg-orange-500' : 'bg-blue-500';
  
  return (
    <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 ${bgColor} text-white p-3 rounded-lg shadow-lg z-[9999] animate-fade-in`}>
      <div className="flex justify-between items-center">
        <span className="text-sm">{message}</span>
        <button onClick={onClose} className="text-white hover:text-gray-200 text-lg">✕</button>
      </div>
    </div>
  );
};

// ==============================
// المكون الرئيسي
// ==============================
export default function AdminDashboard({ 
  userRole,
  onTabClick,
  onLogout,
  onViewProfile,
  onViewSettings,
  onRefreshData}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const userEmail = useMemo(() => user?.email || '', [user]);
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [projectRequests, setProjectRequests] = useState([]);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showAddCatalogModal, setShowAddCatalogModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [showEditCatalogModal, setShowEditCatalogModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [editingCatalogProduct, setEditingCatalogProduct] = useState(null);
  const [searchTermMessages, setSearchTermMessages] = useState("");
  const [filterMessagesStatus, setFilterMessagesStatus] = useState("all");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    avatar: ""
  });
  
  // ==================== حالة Toast ====================
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // حالة الشريط الجانبي للموبايل
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // حالة إخفاء الهيدر
  const [hideHeader, setHideHeader] = useState(false);
  
  // ==================== حالات لإدارة تغيير كلمة المرور للمستخدمين ====================
  const [showChangeUserPasswordModal, setShowChangeUserPasswordModal] = useState(false);
  const [selectedUserForPasswordChange, setSelectedUserForPasswordChange] = useState(null);
  const [userPasswordForm, setUserPasswordForm] = useState({
    newPassword: "",
    confirmPassword: ""
  });

  // ==============================
  // 🔥 دالة عرض Toast
  // ==============================
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
  }, []);

  // ==============================
  // 🔥 دالة تحويل القيمة إلى نص
  // ==============================
  const getValueAsString = useCallback((value) => {
    if (!value) return '';
    
    if (typeof value === 'string') return value;
    
    if (typeof value === 'object' && value !== null) {
      if (value.ar) return value.ar;
      if (value.en) return value.en;
      
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      
      return JSON.stringify(value);
    }
    
    return String(value);
  }, []);

  // ==============================
  // 🔥 دالة تغيير كلمة مرور المستخدمين (للأدمن فقط)
  // ==============================
  const handleChangeUserPassword = useCallback(async (userId, userEmail, newPassword) => {
    if (userData?.role !== "admin" && userData?.role !== "super_admin") {
      showToast("عذراً، هذه الخاصية متاحة فقط للمديرين", "warning");
      return false;
    }

    try {
      // 1. جلب بيانات المستخدم الهدف
      const userDoc = await getDoc(doc(db, "adminUsers", userId));
      if (!userDoc.exists()) {
        throw new Error("المستخدم غير موجود");
      }

      // 2. تحديث كلمة المرور في Firestore للمستخدم الهدف
      await updateDoc(doc(db, "adminUsers", userId), {
        password: newPassword,
        lastPasswordChange: serverTimestamp(),
        updatedAt: serverTimestamp(),
        updatedBy: userEmail
      });

      return true;

    } catch (error) {
      console.error("❌ Error changing user password:", error);
      throw error;
    }
  }, [userData?.role, showToast]);

  // ==============================
  // فتح نافذة تغيير كلمة مرور المستخدم
  // ==============================
  const openChangeUserPasswordModal = useCallback((userItem) => {
    if (userData?.role !== "admin" && userData?.role !== "super_admin") {
      showToast("عذراً، هذه الخاصية متاحة فقط للمديرين", "warning");
      return;
    }

    setSelectedUserForPasswordChange(userItem);
    setUserPasswordForm({
      newPassword: "",
      confirmPassword: ""
    });
    setShowChangeUserPasswordModal(true);
  }, [userData?.role, showToast]);

  // ==============================
  // تنفيذ تغيير كلمة مرور المستخدم
  // ==============================
  const executeChangeUserPassword = useCallback(async () => {
    if (!selectedUserForPasswordChange) return;

    if (userPasswordForm.newPassword !== userPasswordForm.confirmPassword) {
      showToast("كلمات المرور غير متطابقة", "error");
      return;
    }

    if (userPasswordForm.newPassword.length < 8) {
      showToast("كلمة المرور يجب أن تكون 8 أحرف على الأقل", "error");
      return;
    }

    try {
      await handleChangeUserPassword(
        selectedUserForPasswordChange.id,
        selectedUserForPasswordChange.email,
        userPasswordForm.newPassword
      );

      setShowChangeUserPasswordModal(false);
      setSelectedUserForPasswordChange(null);
      setUserPasswordForm({
        newPassword: "",
        confirmPassword: ""
      });

      showToast("تم تغيير كلمة مرور المستخدم بنجاح", "success");

    } catch (error) {
      console.error("Error changing user password:", error);
      
      let errorMessage = "فشل تغيير كلمة المرور";
      switch(error.code) {
        case "auth/wrong-password":
          errorMessage = "كلمة المرور الحالية غير صحيحة";
          break;
        case "auth/requires-recent-login":
          errorMessage = "يجب تسجيل الدخول مؤخرًا لتغيير كلمة المرور";
          break;
        default:
          errorMessage = `فشل تغيير كلمة المرور: ${error.message}`;
      }
      
      showToast(errorMessage, "error");
    }
  }, [selectedUserForPasswordChange, userPasswordForm, handleChangeUserPassword, showToast]);

  // ==============================
  // 🔥 دالة فحص هيكل الوسوم
  // ==============================
  const validateTagsStructure = (tags) => {
    if (!tags) return { ar: [], en: [] };
    
    if (Array.isArray(tags)) {
      return { ar: tags, en: tags };
    }
    
    if (typeof tags === 'object' && tags !== null) {
      return {
        ar: Array.isArray(tags.ar) ? tags.ar : [],
        en: Array.isArray(tags.en) ? tags.en : []
      };
    }
    
    return { ar: [], en: [] };
  };

  // ==============================
  // 🔥 جلب البيانات - نسخة محسنة
  // ==============================
  const fetchUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "adminUsers", userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        
        setUserProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          avatar: data.avatar || "",
          role: data.role || "viewer"
        });
        
        localStorage.setItem('adminUser', JSON.stringify(data));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchAllData = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    
    try {
      // 🔥 جلب البيانات بالتوازي
      const [
        servicesSnap, 
        projectsSnap, 
        messagesSnap,
        serviceRequestsSnap,
        projectRequestsSnap,
        catalogSnap
      ] = await Promise.allSettled([
        getDocs(query(collection(db, "services"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "portfolioProjects"), orderBy("order", "asc"))),
        getDocs(query(collection(db, "contactMessages"), orderBy("createdAt", "desc"))),
        getDocs(query(collection(db, "service-requests"), orderBy("timestamp", "desc"))).catch(() => ({ docs: [] })),
        getDocs(query(collection(db, "projectRequests"), orderBy("timestamp", "desc"))).catch(() => ({ docs: [] })),
        getDocs(query(collection(db, "catalog"), orderBy("createdAt", "desc"))).catch(() => ({ docs: [] }))
      ]);
      
      // 🔥 تحديث الحالات مرة واحدة
      setServices(servicesSnap.status === 'fulfilled' 
        ? servicesSnap.value.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            createdAt: doc.data().createdAt || serverTimestamp()
          }))
        : []);

      setProjects(projectsSnap.status === 'fulfilled' 
        ? projectsSnap.value.docs.map(doc => { 
            const data = doc.data();
            const validatedTags = validateTagsStructure(data.tags);
            return {
              id: doc.id, 
              ...data,
              tags: validatedTags,
              // التأكد من وجود pageType بقيمة افتراضية
              pageType: data.pageType || "portfolio"
            };
          })
        : []);

      setMessages(messagesSnap.status === 'fulfilled' 
        ? messagesSnap.value.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          }))
        : []);

      setServiceRequests(serviceRequestsSnap.status === 'fulfilled' 
        ? serviceRequestsSnap.value.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data(),
            serviceName: doc.data().serviceName || doc.data().service || "طلب خدمة",
            customerName: doc.data().customerName || doc.data().name || "عميل",
            phone: doc.data().phone || doc.data().customerPhone || "غير محدد",
            status: doc.data().status || "pending",
            createdAt: doc.data().createdAt || doc.data().timestamp || null,
            message: doc.data().message || doc.data().notes || ""
          }))
        : []);

      setProjectRequests(projectRequestsSnap.status === 'fulfilled' 
        ? projectRequestsSnap.value.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          }))
        : []);

      // تحديث بيانات الكتالوج
      setCatalogProducts(catalogSnap.status === 'fulfilled' 
        ? catalogSnap.value.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data()
          }))
        : []);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      if (!silent) {
        showToast("حدث خطأ في جلب البيانات", "error");
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [showToast]);

  // ==============================
  // 🔥 دالة التحديث الصامت
  // ==============================
  const refreshDataSilently = useCallback(async () => {
    await fetchAllData(true);
  }, [fetchAllData]);

  // ==============================
  // دوال التنقل المباشرة للصفحات
  // ==============================
  const handleNavigateToProfile = useCallback(() => {
    setActiveTab('profile');
    setSidebarOpen(false);
    setHideHeader(false);
    navigate('/admin/profile');
  }, [navigate]);

  const handleNavigateToSettings = useCallback(() => {
    setActiveTab('settings');
    setSidebarOpen(false);
    setHideHeader(false);
    navigate('/admin/settings');
  }, [navigate]);

  // ==============================
  // دالة الحفظ لقسم من نحن
  // ==============================
  const handleSaveAboutUs = async (aboutUsData) => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالحفظ", "warning");
      return;
    }

    try {
      const aboutUsRef = doc(db, "aboutUs", "content");
      await setDoc(aboutUsRef, {
        ...aboutUsData,
        updatedAt: serverTimestamp(),
        updatedBy: userEmail
      }, { merge: true });
            
    } catch (error) {
      console.error("Error saving about us data:", error);
      showToast("حدث خطأ أثناء الحفظ", "error");
    }
  };

  // ==============================
  // تصنيفات الخدمات
  // ==============================
  const serviceCategories = useMemo(() => [
    { value: "consultation", label: { ar: "استشارات", en: "Consultation" } },
    { value: "design", label: { ar: "تصميم", en: "Design" } },
    { value: "implementation", label: { ar: "تنفيذ", en: "Implementation" } },
    { value: "supervision", label: { ar: "إشراف", en: "Supervision" } },
    { value: "renovation", label: { ar: "تطوير وترميم", en: "Renovation" } },
    { value: "furniture", label: { ar: "أثاث وديكور", en: "Furniture & Decor" } },
    { value: "planning", label: { ar: "تخطيط", en: "Planning" } },
    { value: "lighting", label: { ar: "إضاءة", en: "Lighting" } },
    { value: "color-consultation", label: { ar: "استشارة ألوان", en: "Color Consultation" } }
  ], []);

  // ==============================
  // دوال التنقل
  // ==============================
  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
    setHideHeader(false);
    
    if (onTabClick) {
      onTabClick(tab);
    }
    
    switch(tab) {
      case 'overview':
        navigate('/admin/dashboard');
        break;
      case 'projects':
        navigate('/admin/projects');
        break;
      case 'services':
        navigate('/admin/services');
        break;
      case 'messages':
        navigate('/admin/messages');
        break;
      case 'service-requests':
        navigate('/admin/service-requests');
        break;
      case 'project-requests':
        navigate('/admin/project-requests');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      case 'about-us':
        navigate('/admin/about-us');
        break;
      case 'profile':
        navigate('/admin/profile');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      case 'catalog-moodboard':
        navigate('/admin/catalog-moodboard');
        break;
      case 'admin-projects':
        navigate('/admin/admin-projects');
        break;
      default:
        navigate(`/admin/${tab}`);
    }
  }, [onTabClick, navigate]);

  const handleViewProfile = useCallback(() => {
    handleTabClick('profile');
    
    if (onViewProfile) {
      onViewProfile();
    }
  }, [onViewProfile, handleTabClick]);

  const handleViewSettings = useCallback(() => {
    handleTabClick('settings');
    
    if (onViewSettings) {
      onViewSettings();
    }
  }, [onViewSettings, handleTabClick]);

  // ==============================
  // دالة تسجيل الخروج
  // ==============================
  const handleLogout = useCallback(async () => {
    if (onLogout) {
      await onLogout();
      return;
    }
    
    try {
      await signOut(auth);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
    } catch (error) {
      console.error("Logout error:", error);
      showToast("حدث خطأ في تسجيل الخروج", "error");
    }
  }, [onLogout, navigate, showToast]);

  // ==============================
  // دالة التحكم في الهيدر
  // ==============================
  const handleToggleHeader = useCallback((hide) => {
    setHideHeader(hide);
  }, []);

  // ==============================
  // دالة فتح/إغلاق السايدبار
  // ==============================
  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen(!sidebarOpen);
  }, [sidebarOpen]);

  // ==============================
  // دالة إغلاق السايدبار
  // ==============================
  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
    setHideHeader(false);
  }, []);

  // ==============================
  // دوال إضافية للـ Header
  // ==============================
  const handleRefreshData = useCallback(async () => {
    await refreshDataSilently();
    
    if (onRefreshData) {
      onRefreshData();
    }
  }, [onRefreshData, refreshDataSilently]);

  // ==============================
  // دوال فتح نوافذ إضافة العناصر
  // ==============================
  const handleAddProjectClick = useCallback(() => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالإضافة", "warning");
      return;
    }
    
    setShowAddProjectModal(true);
  }, [userData?.role, showToast]);

  const handleAddServiceClick = useCallback(() => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالإضافة", "warning");
      return;
    }
    
    setShowAddServiceModal(true);
  }, [userData?.role, showToast]);

  const handleAddCatalogClick = useCallback(() => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالإضافة", "warning");
      return;
    }
    
    setShowAddCatalogModal(true);
  }, [userData?.role, showToast]);

  // ==============================
  // دوال إدارة طلبات الخدمات - نسخة معدلة
  // ==============================
  const handleServiceRequestStatusUpdate = async (requestId, newStatus, serviceName = "") => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالتعديل", "warning");
      return;
    }

    try {
      // تحديث الحالة في قاعدة البيانات
      await updateDoc(doc(db, "service-requests", requestId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
        updatedBy: userEmail
      });
      
      // تحديث الحالة محلياً
      setServiceRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, status: newStatus } 
          : request
      ));
      
      // رسالة نجاح مع النص العربي الصحيح
      const statusText = {
        pending: 'قيد الانتظار',
        "in-progress": 'قيد التنفيذ',
        completed: 'مكتملة',
        cancelled: 'ملغاة'
      }[newStatus] || newStatus;
      
      showToast(`تم تحديث حالة طلب الخدمة إلى "${statusText}"`, "success");
      
    } catch (error) {
      console.error("Error updating service request status:", error);
      showToast("حدث خطأ في تحديث حالة الطلب", "error");
    }
  };

  const deleteServiceRequest = async (requestId, serviceName = "") => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالحذف", "warning");
      return;
    }

    const confirmMessage = serviceName 
      ? `هل أنت متأكد من حذف طلب خدمة "${serviceName}"؟ لا يمكن التراجع عن هذا الإجراء.`
      : `هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.`;

    if (!window.confirm(confirmMessage)) return;

    try {
      await deleteDoc(doc(db, "service-requests", requestId));
      
      setServiceRequests(prev => prev.filter(request => request.id !== requestId));
      
      showToast("تم حذف طلب الخدمة بنجاح", "success");
      
    } catch (error) {
      console.error("Error deleting service request:", error);
      showToast("حدث خطأ في حذف الطلب", "error");
    }
  };

  // ==============================
  // دوال إدارة طلبات المشاريع
  // ==============================
  const handleProjectRequestStatus = async (requestId, newStatus, projectName = "") => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالتعديل", "warning");
      return;
    }

    try {
      // تحديث الحالة في قاعدة البيانات
      await updateDoc(doc(db, "projectRequests", requestId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
        updatedBy: userEmail
      });
      
      // تحديث الحالة محلياً
      setProjectRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, status: newStatus } 
          : request
      ));
      
      // رسالة نجاح مع النص العربي الصحيح
      const statusText = {
        pending: 'قيد الانتظار',
        contacted: 'تم التواصل',
        in_progress: 'قيد التنفيذ',
        completed: 'مكتمل',
        cancelled: 'ملغي'
      }[newStatus] || newStatus;
      
      showToast(`تم تحديث حالة الطلب إلى "${statusText}"`, "success");
      
    } catch (error) {
      console.error("Error updating project request status:", error);
      showToast("حدث خطأ في تغيير حالة الطلب", "error");
    }
  };

  const handleProjectRequestContact = async (requestId) => {
    try {
      const request = projectRequests.find(r => r.id === requestId);
      if (!request) return;

      // فتح وسيلة التواصل المناسبة
      if (request.contactMethod === 'whatsapp') {
        const phone = request.customerPhone.replace(/\D/g, '');
        window.open(`https://wa.me/${phone}`, '_blank');
      } else {
        window.location.href = `tel:${request.customerPhone}`;
      }
      
      // بعد التواصل، نغير الحالة إلى contacted مباشرة (بدون استخدام currentStatus)
      await handleProjectRequestStatus(requestId, 'contacted', request.projectName);
      
    } catch (error) {
      console.error("Error contacting customer:", error);
    }
  };

  const addProjectRequestNote = async (requestId, noteContent) => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بإضافة ملاحظات", "warning");
      return;
    }

    try {
      const requestRef = doc(db, "projectRequests", requestId);
      const requestDoc = await getDoc(requestRef);
      const currentData = requestDoc.data();
      
      const notes = currentData.notes || [];
      const newNote = {
        content: noteContent,
        addedBy: userEmail,
        timestamp: serverTimestamp()
      };
      
      await updateDoc(requestRef, {
        notes: [...notes, newNote],
        updatedAt: serverTimestamp()
      });
      
      setProjectRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { 
              ...request, 
              notes: [...(request.notes || []), newNote] 
            } 
          : request
      ));
            
    } catch (error) {
      console.error("Error adding note:", error);
      showToast("حدث خطأ في إضافة الملاحظة", "error");
    }
  };

  const assignProjectRequest = async (requestId, assignee) => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالتسليم", "warning");
      return;
    }

    try {
      await updateDoc(doc(db, "projectRequests", requestId), {
        assignedTo: assignee,
        updatedAt: serverTimestamp(),
        updatedBy: userEmail
      });
      
      setProjectRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, assignedTo: assignee } 
          : request
      ));
            
    } catch (error) {
      console.error("Error assigning request:", error);
      showToast("حدث خطأ في تسليم الطلب", "error");
    }
  };

  const deleteProjectRequest = async (requestId, requestName = "") => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالحذف", "warning");
      return;
    }

    const confirmMessage = requestName 
      ? `هل أنت متأكد من حذف طلب مشروع "${requestName}"؟ لا يمكن التراجع عن هذا الإجراء.`
      : `هل أنت متأكد من حذف هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.`;

    if (!window.confirm(confirmMessage)) return;

    try {
      await deleteDoc(doc(db, "projectRequests", requestId));
      
      setProjectRequests(prev => prev.filter(request => request.id !== requestId));
            
    } catch (error) {
      console.error("Error deleting project request:", error);
      showToast("حدث خطأ في حذف الطلب", "error");
    }
  };

  // ==============================
  // 🔥 دوال إضافة الخدمات والمشاريع إلى قاعدة البيانات (معدلة لإضافة pageType)
  // ==============================

  // 🔥 دالة إضافة خدمة إلى قاعدة البيانات
  const handleAddServiceToDB = async (formData) => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالإضافة", "warning");
      return;
    }

    try {
      setShowAddServiceModal(false);
      
      const serviceData = {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userEmail,
        isActive: true,
        isFeatured: false
      };

      console.log("📤 إرسال بيانات الخدمة:", serviceData);

      await addDoc(collection(db, "services"), serviceData);
            
      await refreshDataSilently();
      
    } catch (error) {
      console.error("❌ خطأ في إضافة الخدمة:", error);
      showToast("حدث خطأ أثناء إضافة الخدمة", "error");
    }
  };

  // 🔥 دالة تعديل الخدمة
  const handleEditService = (service) => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالتعديل", "warning");
      return;
    }

    setEditingService(service);
    setShowEditServiceModal(true);
  };

  // 🔥 دالة حفظ تعديل الخدمة
  const handleSaveServiceEdit = async (formData) => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالتعديل", "warning");
      return;
    }

    try {
      setShowEditServiceModal(false);
      
      await updateDoc(doc(db, "services", editingService.id), {
        ...formData,
        updatedAt: serverTimestamp(),
        updatedBy: userEmail
      });
      
      setEditingService(null);
      showToast("تم تحديث الخدمة بنجاح", "success");
      
      await refreshDataSilently();
      
    } catch (error) {
      console.error("❌ خطأ في تحديث الخدمة:", error);
      showToast("حدث خطأ أثناء تحديث الخدمة", "error");
    }
  };

  // 🔥 دالة لمعالجة الوسوم من النص المدخل
  const processTagsInput = (tagsInput) => {
    console.log("🔧 processTagsInput: معالجة الوسوم المدخلة:", tagsInput);
    console.log("🔧 نوع البيانات:", typeof tagsInput);
    
    if (!tagsInput || tagsInput === "" || tagsInput === '""') {
      console.log("📭 حالة 1: الوسوم فارغة، إرجاع مصفوفات فارغة");
      return { ar: [], en: [] };
    }
    
    if (typeof tagsInput === 'object' && tagsInput !== null) {
      if (Object.keys(tagsInput).length === 0) {
        console.log("📭 حالة 2: كائن فارغ، إرجاع مصفوفات فارغة");
        return { ar: [], en: [] };
      }
      
      if ((tagsInput.ar === "" || tagsInput.ar === '""') && 
          (tagsInput.en === "" || tagsInput.en === '""')) {
        console.log("📭 حالة 2.1: نصوص فارغة في ar و en");
        return { ar: [], en: [] };
      }
    }
    
    if (Array.isArray(tagsInput)) {
      console.log("✅ حالة 3: الوسوم مصفوفة:", tagsInput);
      const cleanTags = tagsInput
        .map(tag => {
          if (typeof tag === 'string') return tag.trim();
          return String(tag).trim();
        })
        .filter(tag => tag !== "" && tag !== '""');
      
      console.log("🧹 بعد التنظيف:", cleanTags);
      return { 
        ar: cleanTags,
        en: cleanTags
      };
    }
    
    if (typeof tagsInput === 'object' && tagsInput !== null) {
      console.log("✅ حالة 4: الوسوم كائن:", tagsInput);
      
      let arTags = [];
      let enTags = [];
      
      if (tagsInput.ar) {
        if (Array.isArray(tagsInput.ar)) {
          arTags = tagsInput.ar
            .map(tag => {
              if (typeof tag === 'string') return tag.trim();
              return String(tag).trim();
            })
            .filter(tag => tag !== "" && tag !== '""');
        } else if (typeof tagsInput.ar === 'string') {
          arTags = tagsInput.ar
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== "" && tag !== '""');
        }
      }
      
      if (tagsInput.en) {
        if (Array.isArray(tagsInput.en)) {
          enTags = tagsInput.en
            .map(tag => {
              if (typeof tag === 'string') return tag.trim();
              return String(tag).trim();
            })
            .filter(tag => tag !== "" && tag !== '""');
        } else if (typeof tagsInput.en === 'string') {
          enTags = tagsInput.en
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag !== "" && tag !== '""');
        }
      }
      
      console.log("🧹 ar بعد التنظيف:", arTags);
      console.log("🧹 en بعد التنظيف:", enTags);
      return { ar: arTags, en: enTags };
    }
    
    if (typeof tagsInput === 'string') {
      console.log("✅ حالة 5: الوسوم نص:", tagsInput);
      
      if (tagsInput.trim() === "" || tagsInput.trim() === '""') {
        console.log("📭 نص فارغ، إرجاع مصفوفات فارغة");
        return { ar: [], en: [] };
      }
      
      const tagsArray = tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== "" && tag !== '""');
      
      console.log("🧹 بعد التحويل:", tagsArray);
      return { 
        ar: tagsArray,
        en: tagsArray 
      };
    }
    
    console.log("⚠️ نوع غير معروف للوسوم:", typeof tagsInput, "القيمة:", tagsInput);
    return { ar: [], en: [] };
  };

  // 🔥 دالة لإضافة مشروع إلى قاعدة البيانات (معدلة لإضافة pageType)
  const handleAddProjectToDB = async (formData) => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالإضافة", "warning");
      return;
    }

    try {
      setShowAddProjectModal(false);
      
      console.log("📥 📥 📥 بيانات المشروع الواردة:", formData);
      console.log("🏷️ 🏷️ 🏷️ الوسوم الواردة:", formData.tags);
      console.log("📄 📄 📄 pageType الوارد:", formData.pageType);
      
      const processedTags = processTagsInput(formData.tags);
      
      // ✅ التأكد من وجود pageType بقيمة افتراضية
      const pageType = formData.pageType || "portfolio";
      
      const projectData = {
        ...formData,
        pageType: pageType, // إضافة pageType بشكل صريح
        tags: processedTags,
        selectedColors: formData.selectedColors || [],
        projectImages: formData.projectImages || [],
        relatedProjects: formData.relatedProjects || [],
        features: formData.features || { ar: [], en: [] },
        technicalDetails: formData.technicalDetails || { ar: {}, en: {} },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userEmail,
        createdById: user?.uid,
        isActive: true,
        isFeatured: false,
        views: 0,
        order: formData.order || 0
      };

      console.log("📤 📤 📤 بيانات المشروع النهائية:", projectData);
      console.log("📄 pageType في البيانات النهائية:", projectData.pageType);

      await addDoc(collection(db, "portfolioProjects"), projectData);
      
      showToast("✅ تم إضافة المشروع بنجاح", "success");
      await refreshDataSilently();
      
    } catch (error) {
      console.error("❌ ❌ ❌ خطأ في إضافة المشروع:", error);
      showToast("حدث خطأ أثناء إضافة المشروع", "error");
    }
  };

  // 🔥 دالة تعديل المشروع (معدلة لإضافة pageType)
  const handleEditProject = (project) => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالتعديل", "warning");
      return;
    }

    setEditingProject(project);
    setShowEditProjectModal(true);
  };

  // 🔥 دالة حفظ تعديل المشروع (معدلة لإضافة pageType)
  const handleSaveProjectEdit = async (formData) => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالتعديل", "warning");
      return;
    }

    try {
      setShowEditProjectModal(false);
      
      console.log("✏️ ✏️ ✏️ بيانات التعديل الواردة:", formData);
      console.log("📄 pageType في التعديل:", formData.pageType);
      
      const processedTags = processTagsInput(formData.tags);
      
      // ✅ التأكد من وجود pageType بقيمة افتراضية
      const pageType = formData.pageType || editingProject?.pageType || "portfolio";
      
      const updatedData = {
        ...formData,
        pageType: pageType, // إضافة pageType بشكل صريح
        tags: processedTags,
        updatedAt: serverTimestamp(),
        updatedBy: userEmail
      };

      console.log("✏️ ✏️ ✏️ بيانات التعديل النهائية:", updatedData);
      console.log("📄 pageType في بيانات التعديل النهائية:", updatedData.pageType);

      await updateDoc(doc(db, "portfolioProjects", editingProject.id), updatedData);
      
      setEditingProject(null);
      showToast("✅ تم تحديث المشروع بنجاح", "success");
      
      await refreshDataSilently();
      
    } catch (error) {
      console.error("❌ ❌ ❌ خطأ في تحديث المشروع:", error);
      showToast("حدث خطأ أثناء تحديث المشروع", "error");
    }
  };

  // ==============================
  // ✅ دوال إدارة الكتالوج الجديدة
  // ==============================
  const handleAddCatalogProduct = async (formData) => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالإضافة", "warning");
      return;
    }

    try {
      setShowAddCatalogModal(false);
      
      const productData = {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userEmail,
        createdById: user?.uid,
        views: 0
      };

      await addDoc(collection(db, "catalog"), productData);
            
      await refreshDataSilently();
      showToast("تم إضافة المنتج بنجاح", "success");
      
    } catch (error) {
      console.error("❌ خطأ في إضافة المنتج:", error);
      showToast("حدث خطأ أثناء إضافة المنتج", "error");
    }
  };

  const handleEditCatalogProduct = (product) => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالتعديل", "warning");
      return;
    }

    setEditingCatalogProduct(product);
    setShowEditCatalogModal(true);
  };

  const handleSaveCatalogEdit = async (formData) => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالتعديل", "warning");
      return;
    }

    try {
      setShowEditCatalogModal(false);
      
      await updateDoc(doc(db, "catalog", editingCatalogProduct.id), {
        ...formData,
        updatedAt: serverTimestamp(),
        updatedBy: userEmail
      });
      
      setEditingCatalogProduct(null);
      showToast("✅ تم تحديث المنتج بنجاح", "success");
      
      await refreshDataSilently();
      
    } catch (error) {
      console.error("❌ خطأ في تحديث المنتج:", error);
      showToast("حدث خطأ أثناء تحديث المنتج", "error");
    }
  };

  const toggleCatalogStatus = async (productId, currentStatus, productName = "") => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالتعديل", "warning");
      return;
    }

    const newStatus = !currentStatus;
    const action = newStatus ? "تفعيل" : "تعطيل";
    
    const confirmMessage = productName 
      ? `هل أنت متأكد من ${action} منتج "${productName}"؟`
      : `هل أنت متأكد من ${action} هذا المنتج؟`;

    if (!window.confirm(confirmMessage)) return;

    try {
      await updateDoc(doc(db, "catalog", productId), {
        isActive: newStatus,
        updatedAt: serverTimestamp()
      });
      
      showToast(`تم ${action} المنتج بنجاح`, "success");
      await refreshDataSilently();
      
    } catch (error) {
      console.error("Error updating catalog status:", error);
      showToast("حدث خطأ أثناء تغيير الحالة", "error");
    }
  };

  const toggleCatalogFeatured = async (productId, currentFeatured, productName = "") => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالتعديل", "warning");
      return;
    }

    const newStatus = !currentFeatured;
    const action = newStatus ? "تمييز" : "إلغاء التميز";
    
    const confirmMessage = productName 
      ? `هل أنت متأكد من ${action} منتج "${productName}"؟`
      : `هل أنت متأكد من ${action} هذا المنتج؟`;

    if (!window.confirm(confirmMessage)) return;

    try {
      await updateDoc(doc(db, "catalog", productId), {
        isFeatured: newStatus,
        updatedAt: serverTimestamp()
      });
      
      showToast(`تم ${action} المنتج بنجاح`, "success");
      await refreshDataSilently();
      
    } catch (error) {
      console.error("Error updating featured status:", error);
      showToast("حدث خطأ أثناء تغيير حالة التميز", "error");
    }
  };

  const deleteCatalogProduct = async (productId, productName = "") => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالحذف", "warning");
      return;
    }

    if (userData?.role === "editor") {
      showToast("عذراً، الصلاحية الحالية (محرر) لا تسمح لك بالحذف", "warning");
      return;
    }

    const confirmMessage = productName 
      ? `هل أنت متأكد من حذف منتج "${productName}"؟ لا يمكن التراجع عن هذا الإجراء.`
      : `هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.`;

    if (!window.confirm(confirmMessage)) return;

    try {
      await deleteDoc(doc(db, "catalog", productId));
      
      showToast("تم حذف المنتج بنجاح", "success");
      await refreshDataSilently();
      
    } catch (error) {
      console.error("Error deleting catalog product:", error);
      showToast(`فشل الحذف: ${error.message}`, "error");
    }
  };

  // ==============================
  // دوال الحذف العامة
  // ==============================
  const handleDelete = async (collectionName, itemId, itemName = "") => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالحذف", "warning");
      return;
    }

    if (userData?.role === "editor") {
      showToast("عذراً، الصلاحية الحالية (محرر) لا تسمح لك بالحذف", "warning");
      return;
    }

    const itemType = collectionName === "portfolioProjects" ? "مشروع" :
                    collectionName === "services" ? "خدمة" :
                    collectionName === "catalog" ? "منتج" : "رسالة";
    
    const confirmMessage = itemName 
      ? `هل أنت متأكد من حذف ${itemType} "${itemName}"؟ لا يمكن التراجع عن هذا الإجراء.`
      : `هل أنت متأكد من حذف هذا ${itemType}؟ لا يمكن التراجع عن هذا الإجراء.`;
    
    if (!window.confirm(confirmMessage)) return;
    
    try {
      await deleteDoc(doc(db, collectionName, itemId));
      
      switch(collectionName) {
        case "portfolioProjects":
          setProjects(prev => prev.filter(p => p.id !== itemId));
          break;
        case "services":
          setServices(prev => prev.filter(s => s.id !== itemId));
          break;
        case "catalog":
          setCatalogProducts(prev => prev.filter(p => p.id !== itemId));
          break;
        case "contactMessages":
          setMessages(prev => prev.filter(m => m.id !== itemId));
          break;
        default:
          console.log("Collection not found:", collectionName);
      }
      
      showToast("تم الحذف بنجاح", "success");
      await refreshDataSilently();
      
    } catch (error) {
      console.error("Error deleting:", error);
      showToast(`فشل الحذف: ${error.message}`, "error");
    }
  };

  // ==============================
  // 🔥 دالة تغيير كلمة مرور المسؤول الحالي
  // ==============================
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (userData?.role === "editor" || userData?.role === "viewer") {
      setPasswordError("عذراً، الصلاحية الحالية لا تسمح لك بتغيير كلمة المرور");
      showToast("الصلاحية الحالية لا تسمح بتغيير كلمة المرور", "warning");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("كلمات المرور غير متطابقة");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    try {
      await updatePassword(auth.currentUser, passwordForm.newPassword);
      
      if (user) {
        await updateDoc(doc(db, "adminUsers", user.uid), {
          password: passwordForm.newPassword,
          lastPasswordChange: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      
      setShowChangePasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      showToast("تم تغيير كلمة المرور بنجاح", "success");
      
    } catch (error) {
      console.error("Error changing password:", error);
      
      let errorMessage = "فشل تغيير كلمة المرور";
      switch(error.code) {
        case "auth/wrong-password":
          errorMessage = "كلمة المرور الحالية غير صحيحة";
          break;
        case "auth/requires-recent-login":
          errorMessage = "يجب تسجيل الدخول مؤخرًا لتغيير كلمة المرور";
          break;
        default:
          errorMessage = `فشل تغيير كلمة المرور: ${error.message}`;
      }
      
      setPasswordError(errorMessage);
      showToast(errorMessage, "error");
    }
  };

  // ==============================
  // دوال التبديلات
  // ==============================
  const toggleServiceStatus = async (itemId, currentStatus, serviceName = "") => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالتعديل", "warning");
      return;
    }

    const newStatus = !currentStatus;
    const action = newStatus ? "تفعيل" : "تعطيل";
    
    const confirmMessage = serviceName 
      ? `هل أنت متأكد من ${action} خدمة "${serviceName}"؟`
      : `هل أنت متأكد من ${action} هذه الخدمة؟`;

    if (!window.confirm(confirmMessage)) return;

    try {
      await updateDoc(doc(db, "services", itemId), {
        isActive: newStatus,
        updatedAt: serverTimestamp()
      });
      refreshDataSilently();
      showToast(`تم ${action} الخدمة بنجاح`, "success");
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("حدث خطأ أثناء تغيير الحالة", "error");
    }
  };

  const toggleProjectStatus = async (itemId, currentStatus, projectName = "") => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالتعديل", "warning");
      return;
    }

    const newStatus = !currentStatus;
    const action = newStatus ? "تفعيل" : "تعطيل";
    
    const confirmMessage = projectName 
      ? `هل أنت متأكد من ${action} مشروع "${projectName}"؟`
      : `هل أنت متأكد من ${action} هذا المشروع؟`;

    if (!window.confirm(confirmMessage)) return;

    try {
      await updateDoc(doc(db, "portfolioProjects", itemId), {
        isActive: newStatus,
        updatedAt: serverTimestamp()
      });
      refreshDataSilently();
      showToast(`تم ${action} المشروع بنجاح`, "success");
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("حدث خطأ أثناء تغيير الحالة", "error");
    }
  };

  const toggleFeatured = async (collectionName, itemId, currentStatus, itemName = "", itemType = "") => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالتعديل", "warning");
      return;
    }

    const newStatus = !currentStatus;
    const action = newStatus ? "تمييز" : "إلغاء التميز";
    
    const confirmMessage = itemName 
      ? `هل أنت متأكد من ${action} ${itemType} "${itemName}"؟`
      : `هل أنت متأكد من ${action} هذا ${itemType}؟`;

    if (!window.confirm(confirmMessage)) return;

    try {
      await updateDoc(doc(db, collectionName, itemId), {
        isFeatured: newStatus,
        updatedAt: serverTimestamp()
      });
      refreshDataSilently();
      showToast(`تم ${action} ${itemType} بنجاح`, "success");
    } catch (error) {
      console.error("Error updating featured status:", error);
      showToast("حدث خطأ أثناء تغيير حالة التميز", "error");
    }
  };

  const markAsRead = async (messageId, currentReadStatus, messageFrom = "") => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالتعديل", "warning");
      return;
    }

    const newStatus = !currentReadStatus;
    const action = newStatus ? "قراءة" : "إعادة تعيين كغير مقروء";
    
    const confirmMessage = messageFrom 
      ? `هل أنت متأكد من ${action} رسالة من "${messageFrom}"؟`
      : `هل أنت متأكد من ${action} هذه الرسالة؟`;

    if (!window.confirm(confirmMessage)) return;

    try {
      await updateDoc(doc(db, "contactMessages", messageId), {
        read: newStatus,
        updatedAt: serverTimestamp(),
        updatedBy: user?.email
      });
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, read: newStatus } : msg
      ));
      
      showToast(`تم ${action} الرسالة بنجاح`, "success");
      
    } catch (error) {
      console.error("Error updating read status:", error);
      showToast("حدث خطأ في تحديث حالة الرسالة", "error");
    }
  };

  // ==============================
  // دالة تنسيق التاريخ
  // ==============================
  const formatDate = useCallback((timestamp) => {
    if (!timestamp) return "بدون تاريخ";
    try {
      const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
      return new Intl.DateTimeFormat('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return "تاريخ غير صالح";
    }
  }, []);

  // ==============================
  // الإحصائيات المحدثة
  // ==============================
  const stats = useMemo(() => {
    const activeProjects = projects.filter(p => p.isActive).length;
    const activeServices = services.filter(s => s.isActive).length;
    const activeCatalog = catalogProducts.filter(p => p.isActive).length;
    const unreadMessages = messages.filter(m => !m.read).length;
    const featuredProjects = projects.filter(p => p.isFeatured).length;
    const featuredServices = services.filter(s => s.isFeatured).length;
    const featuredCatalog = catalogProducts.filter(p => p.isFeatured).length;
    const totalProjects = projects.length;
    const totalServices = services.length;
    const totalCatalog = catalogProducts.length;
    const pendingServiceRequests = serviceRequests.filter(r => r.status === "pending").length;
    const pendingProjectRequests = projectRequests.filter(r => r.status === "pending").length;
    const lowStockCatalog = catalogProducts.filter(p => p.stockQuantity < 10).length;
    const outOfStockCatalog = catalogProducts.filter(p => p.stockQuantity === 0).length;
    
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const newServiceRequests = serviceRequests.filter(request => {
      if (!request.createdAt) return false;
      const requestDate = request.createdAt.toDate ? request.createdAt.toDate() : new Date(request.createdAt);
      return requestDate >= threeDaysAgo;
    }).length;
    
    const newProjectRequests = projectRequests.filter(request => {
      if (!request.timestamp && !request.createdAt) return false;
      const requestDate = request.timestamp?.toDate ? request.timestamp.toDate() : 
                        request.createdAt?.toDate ? request.createdAt.toDate() : 
                        new Date(request.timestamp || request.createdAt);
      return requestDate >= threeDaysAgo;
    }).length;
    
    return {
      activeProjects,
      activeServices,
      activeCatalog,
      unreadMessages,
      featuredProjects,
      featuredServices,
      featuredCatalog,
      totalProjects,
      totalServices,
      totalCatalog,
      pendingServiceRequests,
      pendingProjectRequests,
      lowStockCatalog,
      outOfStockCatalog,
      newServiceRequests,
      newProjectRequests
    };
  }, [projects, services, catalogProducts, messages, serviceRequests, projectRequests]);

  // ==============================
  // إعداد بيانات المستخدم
  // ==============================
  const userSidebarData = useMemo(() => ({
    name: getValueAsString(userData?.name) || user?.displayName || user?.email?.split('@')[0] || 'مدير النظام',
    email: user?.email || "",
    role: userData?.role || userRole || "viewer",
    avatar: userProfile.avatar || ""
  }), [userData, user, userRole, userProfile, getValueAsString]);

  const countsData = useMemo(() => ({
    unreadMessages: stats.unreadMessages,
    pendingServiceRequests: stats.pendingServiceRequests,
    pendingProjectRequests: stats.pendingProjectRequests,
    lowStockCatalog: stats.lowStockCatalog
  }), [stats]);

  // ==============================
  // دالة حفظ الملف الشخصي
  // ==============================
  const handleSaveProfile = async (profileData) => {
    if (userData?.role === "viewer") {
      showToast("عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بالحفظ", "warning");
      return;
    }

    try {
      if (profileData.name) {
        await updateProfile(auth.currentUser, {
          displayName: profileData.name
        });
      }
      
      if (user) {
        await setDoc(doc(db, "adminUsers", user.uid), {
          ...userData,
          ...profileData,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
      
      setUserProfile(profileData);
            
      if (user) {
        await fetchUserData(user.uid);
      }
      
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("حدث خطأ أثناء تحديث الملف الشخصي", "error");
    }
  };

  // ==============================
  // تحديث activeTab بناءً على المسار الحالي
  // ==============================
  useEffect(() => {
    const path = location.pathname;
    const tabFromPath = path.split('/').pop();
    
    const tabMap = {
      'dashboard': 'overview',
      'projects': 'projects',
      'services': 'services',
      'messages': 'messages',
      'service-requests': 'service-requests',
      'project-requests': 'project-requests',
      'users': 'users',
      'about-us': 'about-us',
      'profile': 'profile',
      'settings': 'settings',
      'catalog-moodboard': 'catalog-moodboard'
    };
    
    if (tabMap[tabFromPath]) {
      setActiveTab(tabMap[tabFromPath]);
    }
  }, [location.pathname]);

  // ==============================
  // useEffect للتحميل الأولي
  // ==============================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        await fetchUserData(user.uid);
        await fetchAllData();
      } else {
        navigate("/admin/login");
      }
    });
    return () => unsubscribe();
  }, [fetchAllData, navigate]);

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-orange-200 rounded-full"></div>
            <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-orange-400 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 md:mt-6 text-slate-600 font-medium text-sm md:text-base">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      {/* Toast Notifications */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ show: false, message: '', type: 'success' })} 
        />
      )}
      
      {/* Overlay للشريط الجانبي على الموبايل */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={handleCloseSidebar}
        />
      )}
      
      {/* الشريط الجانبي */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabClick}
        userData={userSidebarData}
        counts={countsData}
        onLogout={handleLogout}
        onChangePassword={() => setShowChangePasswordModal(true)}
        isOpen={sidebarOpen}
        onClose={handleCloseSidebar}
        onToggleHeader={handleToggleHeader}
      />
      
      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 w-full lg:w-[calc(100%-280px)]">
        <Header
          activeTab={activeTab}
          onRefreshData={handleRefreshData}
          userData={userSidebarData}
          onLogout={handleLogout}
          onViewProfile={handleViewProfile}
          onViewSettings={handleViewSettings}
          onNavigateToProfile={handleNavigateToProfile}
          onNavigateToSettings={handleNavigateToSettings}
          onTabClick={handleTabClick}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={handleToggleSidebar}
          hideHeader={hideHeader}
          onToggleHeader={handleToggleHeader}
        />
        
        {/* المحتوى */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6">
          <div className="max-w-7xl mx-auto w-full">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-orange-400"></div>
                <p className="mr-4 text-slate-600 text-sm md:text-base">جاري تحميل البيانات...</p>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Navigate to="dashboard" replace />} />
                
                <Route path="dashboard" element={<OverviewTabContent />} />
                <Route path="projects" element={<ProjectsTabContent />} />
                <Route path="services" element={<ServicesTabContent />} />
                <Route path="messages" element={<MessagesTabContent />} />
                <Route path="service-requests" element={<ServiceRequestsTabContent />} />
                <Route path="project-requests" element={<ProjectRequestsTabContent />} />
                <Route path="about-us" element={<AboutUsTabContent />} />
                <Route path="profile" element={
                  <Profile 
                    userData={userData} 
                    user={user} 
                    profileData={userProfile}
                    onSave={handleSaveProfile}
                    onPasswordChange={() => setShowChangePasswordModal(true)}
                  />
                } />
                
                {/* ✅ صفحة الكتالوج - تم تغييرها لاستخدام CatalogMoodboard */}
                <Route path="catalog-moodboard" element={
                  <CatalogMoodboard 
                    products={catalogProducts}
                    onAddProduct={handleAddCatalogClick}
                    onEditProduct={handleEditCatalogProduct}
                    onDeleteProduct={deleteCatalogProduct}
                    onToggleStatus={toggleCatalogStatus}
                    onToggleFeatured={toggleCatalogFeatured}
                    userData={userData}
                  />
                } />
                <Route path="admin-projects" element={
                  <AdminProjects
                    projects={projects}
                    userData={userData}
                    onAddProject={handleAddProjectToDB}
                    onEditProject={handleSaveProjectEdit}
                    onDeleteProject={(id, name) => handleDelete("portfolioProjects", id, name)}
                    onToggleStatus={toggleProjectStatus}
                    onToggleFeatured={(id, current, name) => toggleFeatured("portfolioProjects", id, current, name, "مشروع")}
                    onRefreshData={refreshDataSilently}
                  />
                } />
                
                {/* Users Tab - للمدير فقط */}
                <Route path="users" element={
                  userData?.role === "admin" || userData?.role === "super_admin" ? (
                    <UserManagement 
                      currentUser={user}
                      userData={userData}
                      onChangeUserPassword={openChangeUserPasswordModal}
                    />
                  ) : (
                    <div className="text-center py-8 sm:py-12">
                      <IconShield className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-slate-300" />
                      <h3 className="text-base sm:text-lg font-semibold text-slate-600 mb-1 sm:mb-2">غير مصرح بالوصول</h3>
                      <p className="text-slate-500 text-sm sm:text-base">الصفحة متاحة فقط لمدير النظام</p>
                    </div>
                  )
                } />
              </Routes>
            )}
          </div>
        </main>
      </div>

      {/* ✅ جميع النوافذ المنبثقة (Modals) */}
      {showAddProjectModal && (
        <ProjectModal
          isEdit={false}
          initialData={null}
          onSubmit={handleAddProjectToDB}
          onClose={() => setShowAddProjectModal(false)}
          isViewer={userData?.role === "viewer"}
        />
      )}

      {showEditProjectModal && (
        <ProjectModal
          isEdit={true}
          initialData={editingProject}
          onSubmit={handleSaveProjectEdit}
          onClose={() => setShowEditProjectModal(false)}
          isViewer={userData?.role === "viewer"}
        />
      )}

      {showAddServiceModal && (
        <ServiceModal
          isEdit={false}
          initialData={null}
          onSubmit={handleAddServiceToDB}
          onClose={() => setShowAddServiceModal(false)}
          isViewer={userData?.role === "viewer"}
        />
      )}

      {showEditServiceModal && (
        <ServiceModal
          isEdit={true}
          initialData={editingService}
          onSubmit={handleSaveServiceEdit}
          onClose={() => setShowEditServiceModal(false)}
          isViewer={userData?.role === "viewer"}
        />
      )}

      {/* نافذة الكتالوج */}
      {showAddCatalogModal && (
        <CatalogModal
          isOpen={true}
          onClose={() => setShowAddCatalogModal(false)}
          onSubmit={handleAddCatalogProduct}
          isEdit={false}
          isViewer={userData?.role === "viewer"}
        />
      )}

      {showEditCatalogModal && editingCatalogProduct && (
        <CatalogModal
          isOpen={true}
          onClose={() => {
            setShowEditCatalogModal(false);
            setEditingCatalogProduct(null);
          }}
          onSubmit={handleSaveCatalogEdit}
          product={editingCatalogProduct}
          isEdit={true}
          isViewer={userData?.role === "viewer"}
        />
      )}

      {/* 🔥 نافذة تغيير كلمة مرور المسؤول الحالي */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center">
                <IconLock className="ml-2 w-5 h-5" /> تغيير كلمة مرور حسابك
              </h2>
              <button onClick={() => setShowChangePasswordModal(false)} className="text-slate-400 hover:text-slate-600">
                <IconX className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleChangePassword} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">كلمة المرور الجديدة</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 text-sm sm:text-base"
                  required 
                  placeholder="أدخل كلمة المرور الجديدة"
                  disabled={userData?.role === "editor" || userData?.role === "viewer"}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">تأكيد كلمة المرور</label>
                <input 
                  type="password" 
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 text-sm sm:text-base"
                  required 
                  placeholder="أعد إدخال كلمة المرور"
                  disabled={userData?.role === "editor" || userData?.role === "viewer"}
                />
              </div>
              
              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  <div className="flex items-center">
                    <IconX className="w-5 h-5 ml-2" />
                    <p>{passwordError}</p>
                  </div>
                </div>
              )}
              
              {(userData?.role === "editor" || userData?.role === "viewer") && (
                <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg text-sm">
                  <p className="flex items-center">
                    <IconShield className="w-5 h-5 ml-2" />
                    عذراً، الصلاحية الحالية ({userData?.role === "editor" ? "محرر" : "مشاهد"}) لا تسمح لك بتغيير كلمة المرور
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button type="button" onClick={() => setShowChangePasswordModal(false)} className="px-3 sm:px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors text-sm sm:text-base">إلغاء</button>
                {userData?.role !== "editor" && userData?.role !== "viewer" && (
                  <button type="submit" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base">
                    تغيير كلمة المرور
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔥 نافذة تغيير كلمة مرور المستخدمين (للأدمن فقط) */}
      {showChangeUserPasswordModal && selectedUserForPasswordChange && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 sm:px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center">
                <IconLock className="ml-2 w-5 h-5" /> تغيير كلمة مرور المستخدم
              </h2>
              <button onClick={() => {
                setShowChangeUserPasswordModal(false);
                setSelectedUserForPasswordChange(null);
              }} className="text-slate-400 hover:text-slate-600">
                <IconX className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <p className="text-blue-700 text-sm">
                  <span className="font-medium">المستخدم:</span> {selectedUserForPasswordChange.name || selectedUserForPasswordChange.email}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">كلمة المرور الجديدة</label>
                <input 
                  type="password" 
                  value={userPasswordForm.newPassword}
                  onChange={(e) => setUserPasswordForm({...userPasswordForm, newPassword: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                  required 
                  placeholder="أدخل كلمة المرور الجديدة"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">تأكيد كلمة المرور</label>
                <input 
                  type="password" 
                  value={userPasswordForm.confirmPassword}
                  onChange={(e) => setUserPasswordForm({...userPasswordForm, confirmPassword: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                  required 
                  placeholder="أعد إدخال كلمة المرور"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowChangeUserPasswordModal(false);
                    setSelectedUserForPasswordChange(null);
                  }} 
                  className="px-3 sm:px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors text-sm sm:text-base"
                >
                  إلغاء
                </button>
                <button 
                  type="button" 
                  onClick={executeChangeUserPassword}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  تغيير كلمة المرور
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ==============================
  // مكونات المحتوى لكل تبويب
  // ==============================
  
  function OverviewTabContent() {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* العنوان والإحصائيات الرئيسية */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">لوحة التحكم</h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">نظرة عامة على الإحصائيات والطلبات الحديثة</p>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <IconCalendar className="w-4 h-4 ml-1" />
            <span>آخر تحديث: {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* الإحصائيات الرئيسية */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* بطاقة المشاريع */}
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 sm:p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-teal-100 text-xs sm:text-sm font-medium mb-1 sm:mb-2">المشاريع</p>
                <p className="text-2xl sm:text-3xl font-bold mb-1">{stats.totalProjects}</p>
                <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                  <span className="bg-teal-400/30 text-teal-100 text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                    {stats.activeProjects} نشطة
                  </span>
                  <span className="text-teal-200 text-xs">{stats.featuredProjects} مميزة</span>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <IconImage className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
            </div>
            <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-teal-400/30">
              <div className="flex justify-between text-xs">
                <span>الإجمالي</span>
                <span>نسبة النشاط: {stats.totalProjects > 0 ? Math.round((stats.activeProjects/stats.totalProjects)*100) : 0}%</span>
              </div>
              <div className="mt-2 w-full bg-teal-400/30 rounded-full h-1.5">
                <div 
                  className="bg-white rounded-full h-1.5" 
                  style={{ width: `${stats.totalProjects > 0 ? (stats.activeProjects/stats.totalProjects)*100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* بطاقة الخدمات */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 sm:p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm font-medium mb-1 sm:mb-2">الخدمات</p>
                <p className="text-2xl sm:text-3xl font-bold mb-1">{stats.totalServices}</p>
                <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                  <span className="bg-blue-400/30 text-blue-100 text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                    {stats.activeServices} نشطة
                  </span>
                  <span className="text-blue-200 text-xs">{stats.featuredServices} مميزة</span>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <IconPackage className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
            </div>
            <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-blue-400/30">
              <div className="flex justify-between text-xs">
                <span>الإجمالي</span>
                <span>نسبة النشاط: {stats.totalServices > 0 ? Math.round((stats.activeServices/stats.totalServices)*100) : 0}%</span>
              </div>
              <div className="mt-2 w-full bg-blue-400/30 rounded-full h-1.5">
                <div 
                  className="bg-white rounded-full h-1.5" 
                  style={{ width: `${stats.totalServices > 0 ? (stats.activeServices/stats.totalServices)*100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* بطاقة الرسائل */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 sm:p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-100 text-xs sm:text-sm font-medium mb-1 sm:mb-2">الرسائل</p>
                <p className="text-2xl sm:text-3xl font-bold mb-1">{messages.length}</p>
                <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                  <span className="bg-emerald-400/30 text-emerald-100 text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                    {stats.unreadMessages} غير مقروءة
                  </span>
                  <span className="text-emerald-200 text-xs">إجمالي: {messages.length}</span>
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <IconMail className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>
            </div>
            <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-emerald-400/30">
              <div className="flex justify-between text-xs">
                <span>غير المقروءة</span>
                <span>نسبة القراءة: {messages.length > 0 ? Math.round(((messages.length - stats.unreadMessages)/messages.length)*100) : 0}%</span>
              </div>
              <div className="mt-2 w-full bg-emerald-400/30 rounded-full h-1.5">
                <div 
                  className="bg-white rounded-full h-1.5" 
                  style={{ width: `${messages.length > 0 ? ((messages.length - stats.unreadMessages)/messages.length)*100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* الطلبات الجديدة */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* طلبات الخدمات الجديدة */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-orange-50 to-orange-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
                  <IconPhone className="ml-2 text-orange-500 w-4 h-4 sm:w-5 sm:h-5" />
                  طلبات الخدمات الجديدة
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">آخر 3 طلبات خدمات تم تقديمها</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {stats.pendingServiceRequests > 0 && (
                  <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium">
                    {stats.pendingServiceRequests} بانتظار
                  </span>
                )}
                <span className="text-xs sm:text-sm text-slate-600">الإجمالي: {serviceRequests.length}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 sm:p-5">
            {serviceRequests.length > 0 ? (
              <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto pr-2">
                {serviceRequests.slice(0, 3).map((request) => {
                  // دوال مساعدة للحصول على البيانات بشكل آمن
                  const getServiceName = () => {
                    if (!request.serviceName && !request.service) return "طلب خدمة";
                    
                    const serviceName = request.serviceName || request.service;
                    
                    if (typeof serviceName === 'object') {
                      return serviceName.ar || serviceName.en || "طلب خدمة";
                    }
                    
                    return String(serviceName);
                  };

                  const getCustomerName = () => {
                    const name = request.customerName || request.name || "عميل";
                    
                    if (typeof name === 'object') {
                      return name.ar || name.en || "عميل";
                    }
                    
                    return String(name);
                  };

                  const getServiceType = () => {
                    if (!request.serviceType) return "";
                    
                    if (typeof request.serviceType === 'object') {
                      return request.serviceType.ar || request.serviceType.en || "";
                    }
                    
                    return String(request.serviceType);
                  };

                  const getMessage = () => {
                    const message = request.message || request.notes || "";
                    
                    if (typeof message === 'object') {
                      return message.ar || message.en || "";
                    }
                    
                    return String(message);
                  };

                  const serviceName = getServiceName();
                  const customerName = getCustomerName();
                  const serviceType = getServiceType();
                  const message = getMessage();
                  
                  const statusColors = {
                    pending: "bg-yellow-100 text-yellow-800",
                    "in-progress": "bg-blue-100 text-blue-800",
                    completed: "bg-emerald-100 text-emerald-800",
                    cancelled: "bg-red-100 text-red-800"
                  };
                  
                  const statusText = {
                    pending: "قيد الانتظار",
                    "in-progress": "قيد التنفيذ",
                    completed: "مكتملة",
                    cancelled: "ملغاة"
                  };
                  
                  const statusClass = statusColors[request.status] || "bg-gray-100 text-gray-800";
                  const statusDisplay = statusText[request.status] || request.status;
                  
                  const requestDate = request.createdAt?.toDate ? request.createdAt.toDate() : 
                                    request.timestamp?.toDate ? request.timestamp.toDate() : 
                                    request.createdAt ? new Date(request.createdAt) : new Date();
                  
                  return (
                    <div 
                      key={request.id} 
                      className="border border-orange-100 rounded-xl p-3 sm:p-4 hover:bg-orange-50 transition-all duration-300 cursor-pointer"
                      onClick={() => handleTabClick("service-requests")}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 sm:mb-3 gap-2 sm:gap-0">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 text-sm mb-1 truncate" title={serviceName}>
                            {serviceName}
                          </h4>
                          <div className="flex flex-wrap items-center text-xs text-slate-600 gap-2 sm:gap-3">
                            <span className="flex items-center">
                              <IconUser className="w-3 h-3 ml-1 flex-shrink-0" />
                              <span className="truncate max-w-[100px] sm:max-w-[150px]" title={customerName}>
                                {customerName}
                              </span>
                            </span>
                            <span className="flex items-center">
                              <IconPhone className="w-3 h-3 ml-1 flex-shrink-0" />
                              <span dir="ltr" className="text-left">
                                {request.phone || "غير محدد"}
                              </span>
                              {request.preferredContact === 'whatsapp' ? (
                                <IconWhatsApp className="w-3 h-3 mr-1 text-emerald-500 flex-shrink-0" />
                              ) : request.preferredContact === 'phone' ? (
                                <IconPhone className="w-3 h-3 mr-1 text-blue-500 flex-shrink-0" />
                              ) : request.preferredContact === 'email' ? (
                                <IconMail className="w-3 h-3 mr-1 text-indigo-500 flex-shrink-0" />
                              ) : null}
                            </span>
                          </div>
                          {serviceType && (
                            <div className="mt-1">
                              <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full inline-block">
                                {serviceType}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs rounded-full font-medium whitespace-nowrap ${statusClass}`}>
                          {statusDisplay}
                        </span>
                      </div>
                      
                      {message && (
                        <div className="mb-2 sm:mb-3">
                          <p className="text-xs sm:text-sm text-slate-600 bg-orange-50 p-2 rounded-lg border border-orange-100 line-clamp-2" title={message}>
                            {message}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-orange-100 gap-2 sm:gap-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-slate-500">
                            {requestDate.toLocaleDateString("ar-SA", {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {request.email && (
                            <span className="text-xs text-slate-500 flex items-center" title={request.email}>
                              <IconMail className="w-3 h-3 ml-1" />
                              <span className="truncate max-w-[120px]">{request.email}</span>
                            </span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {/* زر عرض التفاصيل - يوجه إلى صفحة طلبات الخدمات */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTabClick("service-requests");
                            }}
                            className="text-xs px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-1"
                          >
                            <IconEye className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>عرض التفاصيل</span>
                          </button>
                          
                          {request.phone && (
                            <a 
                              href={`tel:${request.phone}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center gap-1"
                              title="اتصال هاتفي"
                            >
                              <IconPhone className="w-3 h-3" />
                              <span className="hidden sm:inline">اتصال</span>
                            </a>
                          )}
                          
                          {request.email && (
                            <a 
                              href={`mailto:${request.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-1"
                              title="إرسال بريد"
                            >
                              <IconMail className="w-3 h-3" />
                              <span className="hidden sm:inline">بريد</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <IconPhone className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400" />
                </div>
                <p className="text-slate-700 font-medium text-sm sm:text-base">لا توجد طلبات خدمات جديدة</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">جميع الطلبات تمت معالجتها</p>
              </div>
            )}
            
            {serviceRequests.length > 3 && (
              <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => handleTabClick("service-requests")}
                  className="text-orange-600 hover:text-orange-800 text-xs sm:text-sm font-medium flex items-center justify-center mx-auto gap-2"
                >
                  عرض جميع الطلبات ({serviceRequests.length})
                  <IconChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
          
        {/* طلبات المشاريع الجديدة */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-indigo-100">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
                  <IconCalendar className="ml-2 text-indigo-500 w-4 h-4 sm:w-5 sm:h-5" />
                  طلبات المشاريع الجديدة
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">آخر 3 طلبات مشاريع تم تقديمها</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                {stats.pendingProjectRequests > 0 && (
                  <span className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium">
                    {stats.pendingProjectRequests} بانتظار
                  </span>
                )}
                <span className="text-xs sm:text-sm text-slate-600">الإجمالي: {projectRequests.length}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 sm:p-5">
            {projectRequests.length > 0 ? (
              <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto pr-2">
                {projectRequests.slice(0, 3).map((request) => {
                  // دالة مساعدة للحصول على اسم المشروع بشكل آمن
                  const getProjectName = () => {
                    if (!request.projectName) return "طلب مشروع";
                    
                    // إذا كان projectName كائن (مثلاً { ar: "اسم", en: "name" })
                    if (typeof request.projectName === 'object') {
                      return request.projectName.ar || request.projectName.en || "طلب مشروع";
                    }
                    
                    // إذا كان projectType موجود
                    if (request.projectType) {
                      // إذا كان projectType كائن
                      if (typeof request.projectType === 'object') {
                        return request.projectType.ar || request.projectType.en || request.projectType;
                      }
                      // إذا كان projectType نص
                      return request.projectType;
                    }
                    
                    // إذا كان projectName نص
                    return String(request.projectName);
                  };

                  // دالة مساعدة للحصول على نوع المشروع بشكل آمن
                  const getProjectType = () => {
                    if (!request.category && !request.projectType) return "";
                    
                    const type = request.category || request.projectType;
                    
                    if (typeof type === 'object') {
                      return type.ar || type.en || "";
                    }
                    
                    return String(type);
                  };

                  const projectDisplayName = getProjectName();
                  const projectType = getProjectType();
                  
                  const statusColors = {
                    pending: "bg-yellow-100 text-yellow-800",
                    contacted: "bg-blue-100 text-blue-800",
                    in_progress: "bg-purple-100 text-purple-800",
                    completed: "bg-emerald-100 text-emerald-800",
                    cancelled: "bg-red-100 text-red-800"
                  };
                  
                  const statusText = {
                    pending: "قيد الانتظار",
                    contacted: "تم التواصل",
                    in_progress: "قيد التنفيذ",
                    completed: "مكتمل",
                    cancelled: "ملغي"
                  };
                  
                  const statusClass = statusColors[request.status] || "bg-gray-100 text-gray-800";
                  const statusDisplay = statusText[request.status] || request.status;
                  
                  const requestDate = request.timestamp?.toDate ? request.timestamp.toDate() : 
                                    request.createdAt?.toDate ? request.createdAt.toDate() : 
                                    new Date();
                  
                  return (
                    <div 
                      key={request.id} 
                      className="border border-indigo-100 rounded-xl p-3 sm:p-4 hover:bg-indigo-50 transition-all duration-300 cursor-pointer"
                      onClick={() => handleTabClick("project-requests")}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 sm:mb-3 gap-2 sm:gap-0">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 text-sm mb-1 truncate" title={projectDisplayName}>
                            {projectDisplayName}
                          </h4>
                          <div className="flex flex-wrap items-center text-xs text-slate-600 gap-2 sm:gap-3">
                            <span className="flex items-center">
                              <IconUser className="w-3 h-3 ml-1 flex-shrink-0" />
                              <span className="truncate max-w-[100px] sm:max-w-[150px]" title={request.customerName || "عميل"}>
                                {request.customerName || "عميل"}
                              </span>
                            </span>
                            <span className="flex items-center">
                              <IconPhone className="w-3 h-3 ml-1 flex-shrink-0" />
                              <span dir="ltr" className="text-left">
                                {request.customerPhone || "غير محدد"}
                              </span>
                              {request.contactMethod === 'whatsapp' ? (
                                <IconWhatsApp className="w-3 h-3 mr-1 text-emerald-500 flex-shrink-0" />
                              ) : request.contactMethod === 'phone' ? (
                                <IconPhone className="w-3 h-3 mr-1 text-blue-500 flex-shrink-0" />
                              ) : null}
                            </span>
                          </div>
                          {projectType && (
                            <div className="mt-1">
                              <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block">
                                {projectType}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className={`px-2 sm:px-3 py-1 sm:py-1.5 text-xs rounded-full font-medium whitespace-nowrap ${statusClass}`}>
                          {statusDisplay}
                        </span>
                      </div>
                      
                      {request.message && (
                        <div className="mb-2 sm:mb-3">
                          <p className="text-xs sm:text-sm text-slate-600 bg-indigo-50 p-2 rounded-lg border border-indigo-100 line-clamp-2" title={request.message}>
                            {request.message}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-indigo-100 gap-2 sm:gap-0">
                        <span className="text-xs text-slate-500">
                          {requestDate.toLocaleDateString("ar-SA", {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        
                        {/* زر عرض التفاصيل - عند النقر يوجه إلى صفحة طلبات المشاريع */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // منع تفعيل الـ onClick للبطاقة
                            handleTabClick("project-requests");
                          }}
                          className="text-xs px-3 sm:px-2 py-1.5 sm:py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 flex items-center gap-1"
                        >
                          <IconEye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>عرض التفاصيل</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <IconCalendar className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-400" />
                </div>
                <p className="text-slate-700 font-medium text-sm sm:text-base">لا توجد طلبات مشاريع جديدة</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">جميع الطلبات تمت معالجتها</p>
              </div>
            )}
            
            {projectRequests.length > 3 && (
              <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => handleTabClick("project-requests")}
                  className="text-indigo-600 hover:text-indigo-800 text-xs sm:text-sm font-medium flex items-center justify-center mx-auto gap-2"
                >
                  عرض جميع الطلبات ({projectRequests.length})
                  <IconChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

        {/* المحتوى الحديث */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* الرسائل غير المقروءة */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-emerald-100">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center">
                    <IconMail className="ml-2 text-emerald-500 w-4 h-4 sm:w-5 sm:h-5" />
                    الرسائل غير المقروءة
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-1">آخر الرسائل من الزوار والعملاء</p>
                </div>
                {stats.unreadMessages > 0 && (
                  <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium">
                    {stats.unreadMessages} غير مقروءة
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-4 sm:p-5">
              {stats.unreadMessages > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {messages
                    .filter(m => !m.read)
                    .slice(0, 2)
                    .map((message) => (
                      <div key={message.id} className="border border-emerald-100 bg-emerald-50 rounded-xl p-3 sm:p-4">
                        <div className="flex items-start">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center ml-3 border-2 border-white">
                            <IconMail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 sm:mb-2 gap-1 sm:gap-0">
                              <div>
                                <h4 className="font-semibold text-slate-900 text-sm truncate">{message.name}</h4>
                                <p className="text-xs text-slate-600 mt-0.5 truncate">
                                  {message.email}
                                </p>
                              </div>
                              <span className="text-xs text-emerald-600 font-medium">
                                {formatDate(message.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 mb-2 sm:mb-3">
                              {message.message?.substring(0, 100)}...
                            </p>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 sm:pt-3 border-t border-emerald-200 gap-2 sm:gap-0">
                              <div className="flex items-center gap-2">
                                {message.phone && (
                                  <span className="text-xs text-slate-600 flex items-center">
                                    <IconPhone className="w-3 h-3 ml-1" />
                                    {message.phone}
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                {userData?.role !== "viewer" && (
                                  <button
                                    onClick={() => markAsRead(message.id, message.read, message.name)}
                                    className="text-xs px-2 sm:px-3 py-1.5 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 rounded-lg transition-all duration-300"
                                  >
                                    تعيين كمقروءة
                                  </button>
                                )}
                                <button
                                  onClick={() => handleTabClick("messages")}
                                  className="text-xs px-2 sm:px-3 py-1.5 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-all duration-300"
                                >
                                  عرض الرسالة
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  
                  {stats.unreadMessages > 2 && (
                    <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-100 text-center">
                      <button
                        onClick={() => handleTabClick("messages")}
                        className="text-emerald-600 hover:text-emerald-800 text-xs sm:text-sm font-medium flex items-center justify-center mx-auto gap-2"
                      >
                        عرض جميع الرسائل ({messages.length})
                        <IconChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <IconCheck className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                  </div>
                  <p className="text-slate-700 font-medium text-sm sm:text-base">لا توجد رسائل غير مقروءة</p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">جميع الرسائل تمت قراءتها</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==============================
  // ProjectsTabContent
  // ==============================


function ProjectsTabContent() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPageType, setFilterPageType] = useState("all");
    const [filterYear, setFilterYear] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    
    // حفظ موقع التمرير
    //const scrollPositionRef = useRef(0);
    // معرف إذا كنا نستعيد الفلاتر من sessionStorage (لمنع الحفظ المؤقت)
    const isRestoringRef = useRef(false);
    
    // ==================== استعادة الفلاتر من sessionStorage عند تحميل المكون ====================
    useEffect(() => {
        // استعادة جميع الفلاتر عند تحميل الصفحة
        const savedSearchTerm = sessionStorage.getItem('projects_searchTerm');
        const savedFilterStatus = sessionStorage.getItem('projects_filterStatus');
        const savedFilterPageType = sessionStorage.getItem('projects_filterPageType');
        const savedFilterYear = sessionStorage.getItem('projects_filterYear');
        const savedSortBy = sessionStorage.getItem('projects_sortBy');
        const savedScrollPosition = sessionStorage.getItem('projects_scrollPosition');
        
        if (savedSearchTerm !== null) {
            isRestoringRef.current = true;
            setSearchTerm(savedSearchTerm);
        }
        if (savedFilterStatus !== null) {
            setFilterStatus(savedFilterStatus);
        }
        if (savedFilterPageType !== null) {
            setFilterPageType(savedFilterPageType);
        }
        if (savedFilterYear !== null) {
            setFilterYear(savedFilterYear);
        }
        if (savedSortBy !== null) {
            setSortBy(savedSortBy);
        }
        
        // استعادة موضع التمرير بعد تحميل المكون
        if (savedScrollPosition !== null) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedScrollPosition));
            }, 100);
        }
        
        // إعادة تعيين علامة الاستعادة بعد فترة قصيرة
        setTimeout(() => {
            isRestoringRef.current = false;
        }, 500);
    }, []);
    
    // ==================== حفظ الفلاتر في sessionStorage عند تغييرها ====================
    useEffect(() => {
        // لا نحفظ إذا كنا في وضع الاستعادة
        if (!isRestoringRef.current) {
            sessionStorage.setItem('projects_searchTerm', searchTerm);
        }
    }, [searchTerm]);
    
    useEffect(() => {
        if (!isRestoringRef.current) {
            sessionStorage.setItem('projects_filterStatus', filterStatus);
        }
    }, [filterStatus]);
    
    useEffect(() => {
        if (!isRestoringRef.current) {
            sessionStorage.setItem('projects_filterPageType', filterPageType);
        }
    }, [filterPageType]);
    
    useEffect(() => {
        if (!isRestoringRef.current) {
            sessionStorage.setItem('projects_filterYear', filterYear);
        }
    }, [filterYear]);
    
    useEffect(() => {
        if (!isRestoringRef.current) {
            sessionStorage.setItem('projects_sortBy', sortBy);
        }
    }, [sortBy]);
    
    // ==================== حفظ موضع التمرير ====================
    useEffect(() => {
        const handleScroll = () => {
            if (!isRestoringRef.current) {
                sessionStorage.setItem('projects_scrollPosition', window.scrollY.toString());
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // ==================== مسح sessionStorage عند إغلاق التبويب أو تحديث الصفحة ====================
    useEffect(() => {
        const handleBeforeUnload = () => {
            // مسح جميع البيانات عند تحديث الصفحة أو إغلاقها
            sessionStorage.removeItem('projects_searchTerm');
            sessionStorage.removeItem('projects_filterStatus');
            sessionStorage.removeItem('projects_filterPageType');
            sessionStorage.removeItem('projects_filterYear');
            sessionStorage.removeItem('projects_sortBy');
            sessionStorage.removeItem('projects_scrollPosition');
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    
    // ==================== فئات التصميم من ProjectModal ====================
    const designCategories = useMemo(() => [
        // تصنيفات سكنية
        { 
            id: "residential", 
            name: { ar: "سكني", en: "Residential" },
            subcategories: [
                { id: "apartments", name: { ar: "شقق", en: "Apartments" } },
                { id: "villas", name: { ar: "فلل", en: "Villas" } },
                { id: "duplex", name: { ar: "دوبلكس", en: "Duplex" } },
                { id: "townhouse", name: { ar: "تاون هاوس", en: "Townhouse" } },
                { id: "penthouse", name: { ar: "بنتهاوس", en: "Penthouse" } },
                { id: "studios", name: { ar: "إستوديوهات", en: "Studios" } },
                { id: "chalets", name: { ar: "شاليهات", en: "Chalets" } },
                { id: "cabin", name: { ar: "كوخ", en: "Cabin" } },
                { id: "roof", name: { ar: "روف", en: "Roof" } },
            ]
        },
        // تصنيفات تجارية
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
        // التخصصات (داخلي/خارجي/لاندسكيب)
        { 
            id: "specializations", 
            name: { ar: "التخصصات", en: "Specializations" },
            subcategories: [
                { id: "interior", name: { ar: "داخلي", en: "Interior" } },
                { id: "exterior", name: { ar: "خارجي", en: "Exterior" } },
                { id: "landscape", name: { ar: "لاندسكيب", en: "Landscape" } },
                { id: "both", name: { ar: "داخلي وخارجي", en: "Interior & Exterior" } }
            ]
        },
        // أنواع الغرف الداخلية (مطابقة تماماً مع ProjectModal)
        { 
            id: "interior_rooms", 
            name: { ar: "الغرف الداخلية", en: "Interior Rooms" },
            subcategories: [
                { id: "full_projects", name: { ar: "مشاريع كاملة", en: "Full Projects" } },
                { id: "living_room", name: { ar: "غرفة المعيشة", en: "Living Room" } },
                { id: "salon", name: { ar: "صالون", en: "Salon" } },
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
        // الغرف التجارية (مطابقة تماماً مع ProjectModal)
        { 
            id: "commercial_rooms", 
            name: { ar: "الغرف التجارية", en: "Commercial Rooms" },
            subcategories: [
                { id: "commercial_reception", name: { ar: "استقبال", en: "Reception" } },
                { id: "commercial_waiting", name: { ar: "غرفة انتظار", en: "Waiting Room" } },
                { id: "commercial_conference", name: { ar: "غرفة اجتماعات", en: "Conference Room" } },
                { id: "commercial_manager", name: { ar: "غرفة مدير", en: "Manager's Room" } },
                { id: "commercial_bathroom", name: { ar: "حمام تجاري", en: "Commercial Bathroom" } },
                { id: "commercial_kitchen", name: { ar: "مطبخ تجاري", en: "Commercial Kitchen" } },
                { id: "commercial_storage", name: { ar: "مخزن تجاري", en: "Commercial Storage" } }
            ]
        },
        // الأماكن الخارجية (مطابقة تماماً مع ProjectModal)
        { 
            id: "exterior_areas", 
            name: { ar: "الأماكن الخارجية", en: "Exterior Areas" },
            subcategories: [
                { id: "facade", name: { ar: "واجهة", en: "Facade" } },
                { id: "garden", name: { ar: "حديقة", en: "Garden" } },
                { id: "swimming_pool", name: { ar: "مسبح", en: "Swimming Pool" } },
                { id: "terrace", name: { ar: "تراس", en: "Terrace" } },
                { id: "balcony", name: { ar: "بلكونة", en: "Balcony" } },
                { id: "patio", name: { ar: "فناء", en: "Patio" } },
                { id: "driveway", name: { ar: "مدخل سيارات", en: "Driveway" } },
                { id: "parking", name: { ar: "موقف سيارات", en: "Parking" } },
                { id: "fence", name: { ar: "سياج", en: "Fence" } },
                { id: "gazebo", name: { ar: "جازيبو", en: "Gazebo" } },
                { id: "outdoor_kitchen", name: { ar: "مطبخ خارجي", en: "Outdoor Kitchen" } },
                { id: "fire_pit", name: { ar: "مشعل نار", en: "Fire Pit" } },
                { id: "walkway", name: { ar: "ممشى", en: "Walkway" } }
            ]
        },
        // أنماط التصميم (مطابقة تماماً مع ProjectModal)
        { 
            id: "design_styles", 
            name: { ar: "أنماط التصميم", en: "Design Styles" },
            subcategories: [
                { id: "modern", name: { ar: "عصري", en: "Modern" } },
                { id: "classic", name: { ar: "كلاسيكي", en: "Classic" } },
                { id: "minimalist", name: { ar: "بسيط", en: "Minimalist" } },
                { id: "luxury", name: { ar: "فاخر", en: "Luxury" } },
                { id: "traditional", name: { ar: "تقليدي", en: "Traditional" } },
                { id: "contemporary", name: { ar: "معاصر", en: "Contemporary" } },
                { id: "industrial", name: { ar: "صناعي", en: "Industrial" } },
                { id: "scandinavian", name: { ar: "سكاندينافي", en: "Scandinavian" } },
                { id: "rustic", name: { ar: "ريفي", en: "Rustic" } },
                { id: "mediterranean", name: { ar: "بحر متوسط", en: "Mediterranean" } },
                { id: "art_deco", name: { ar: "آرت ديكو", en: "Art Deco" } },
                { id: "bohemian", name: { ar: "بوهيمي", en: "Bohemian" } }
            ]
        }
    ], []);

    // ==================== خريطة تحويل شاملة (مطابقة لـ normalizeCategories في ProjectModal) ====================
    const categoryMapping = useMemo(() => ({
        // خريطة mainCategory
        mainCategory: {
            "سكني": "residential",
            "residential": "residential",
            "تجاري": "commercial",
            "commercial": "commercial"
        },
        // خريطة subCategory للمشاريع السكنية
        subCategoryResidential: {
            "شقق": "apartments",
            "apartments": "apartments",
            "فلل": "villas",
            "villas": "villas",
            "دوبلكس": "duplex",
            "duplex": "duplex",
            "تاون هاوس": "townhouse",
            "townhouse": "townhouse",
            "بنتهاوس": "penthouse",
            "penthouse": "penthouse",
            "إستوديوهات": "studios",
            "studios": "studios",
            "شاليهات": "chalets",
            "chalets": "chalets",
            "كوخ": "cabin",
            "cabin": "cabin",
            "روف": "roof",
            "roof": "roof"
        },
        // خريطة subCategory للمشاريع التجارية
        subCategoryCommercial: {
            "مكاتب": "offices",
            "offices": "offices",
            "متاجر": "stores",
            "stores": "stores",
            "مطاعم": "restaurants",
            "restaurants": "restaurants",
            "مقاهي": "cafes",
            "cafes": "cafes",
            "معارض": "showrooms",
            "showrooms": "showrooms",
            "عيادات": "clinics",
            "clinics": "clinics",
            "صالونات": "salons",
            "salons": "salons",
            "فنادق": "hotels",
            "hotels": "hotels",
            "صالات رياضية": "gyms",
            "gyms": "gyms",
            "مدارس": "schools",
            "schools": "schools"
        },
        // خريطة specialization
        specialization: {
            "داخلي": "interior",
            "interior": "interior",
            "خارجي": "exterior",
            "exterior": "exterior",
            "لاندسكيب": "landscape",
            "landscape": "landscape",
            "داخلي وخارجي": "both",
            "both": "both"
        },
        // خريطة الغرف الداخلية
        interiorRooms: {
            "مشاريع كاملة": "full_projects",
            "full_projects": "full_projects",
            "غرفة المعيشة": "living_room",
            "living_room": "living_room",
            "صالون": "salon",
            "salon": "salon",
            "مطبخ": "kitchen",
            "kitchen": "kitchen",
            "غرفة الطعام": "dining_room",
            "dining_room": "dining_room",
            "حمام": "bathroom",
            "bathroom": "bathroom",
            "مكتب منزلي": "home_office",
            "home_office": "home_office",
            "غرفة نوم رئيسية": "master_bedroom",
            "master_bedroom": "master_bedroom",
            "غرفة أطفال": "children_room",
            "children_room": "children_room",
            "غرفة ضيوف": "guest_room",
            "guest_room": "guest_room",
            "مكتبة": "library",
            "library": "library",
            "غرفة نوم الاولاد": "Boys_Bedroom",
            "Boys_Bedroom": "Boys_Bedroom",
            "غرفة نوم البنات": "Girls_Bedroom",
            "Girls_Bedroom": "Girls_Bedroom",
            "غرفة نوم ثانوية": "Second_Bedroom",
            "Second_Bedroom": "Second_Bedroom",
            "غرفة صلاة": "prayer_room",
            "prayer_room": "prayer_room",
            "غرفة ملابس": "dressing_room",
            "dressing_room": "dressing_room",
            "غرفة غسيل": "laundry_room",
            "laundry_room": "laundry_room",
            "غرفة تخزين": "storage_room",
            "storage_room": "storage_room"
        },
        // خريطة الغرف التجارية
        commercialRooms: {
            "استقبال": "commercial_reception",
            "commercial_reception": "commercial_reception",
            "غرفة انتظار": "commercial_waiting",
            "commercial_waiting": "commercial_waiting",
            "غرفة اجتماعات": "commercial_conference",
            "commercial_conference": "commercial_conference",
            "غرفة مدير": "commercial_manager",
            "commercial_manager": "commercial_manager",
            "حمام تجاري": "commercial_bathroom",
            "commercial_bathroom": "commercial_bathroom",
            "مطبخ تجاري": "commercial_kitchen",
            "commercial_kitchen": "commercial_kitchen",
            "مخزن تجاري": "commercial_storage",
            "commercial_storage": "commercial_storage"
        },
        // خريطة الأماكن الخارجية
        exteriorAreas: {
            "واجهة": "facade",
            "facade": "facade",
            "حديقة": "garden",
            "garden": "garden",
            "مسبح": "swimming_pool",
            "swimming_pool": "swimming_pool",
            "تراس": "terrace",
            "terrace": "terrace",
            "بلكونة": "balcony",
            "balcony": "balcony",
            "فناء": "patio",
            "patio": "patio",
            "مدخل سيارات": "driveway",
            "driveway": "driveway",
            "موقف سيارات": "parking",
            "parking": "parking",
            "سياج": "fence",
            "fence": "fence",
            "جازيبو": "gazebo",
            "gazebo": "gazebo",
            "مطبخ خارجي": "outdoor_kitchen",
            "outdoor_kitchen": "outdoor_kitchen",
            "مشعل نار": "fire_pit",
            "fire_pit": "fire_pit",
            "ممشى": "walkway",
            "walkway": "walkway"
        },
        // خريطة أنماط التصميم
        designStyles: {
            "عصري": "modern",
            "modern": "modern",
            "كلاسيكي": "classic",
            "classic": "classic",
            "بسيط": "minimalist",
            "minimalist": "minimalist",
            "فاخر": "luxury",
            "luxury": "luxury",
            "تقليدي": "traditional",
            "traditional": "traditional",
            "معاصر": "contemporary",
            "contemporary": "contemporary",
            "صناعي": "industrial",
            "industrial": "industrial",
            "سكاندينافي": "scandinavian",
            "scandinavian": "scandinavian",
            "ريفي": "rustic",
            "rustic": "rustic",
            "بحر متوسط": "mediterranean",
            "mediterranean": "mediterranean",
            "آرت ديكو": "art_deco",
            "art_deco": "art_deco",
            "بوهيمي": "bohemian",
            "bohemian": "bohemian"
        }
    }), []);

    // ==================== دوال مساعدة للتصنيفات ====================
    
    // تطبيع أي قيمة إلى المعرف الموحد
    const normalizeId = useCallback((value, mapping) => {
        if (!value) return value;
        const normalizedValue = String(value).toLowerCase().trim();
        return mapping[normalizedValue] || mapping[value] || value;
    }, []);

    // الحصول على اسم التصنيف الرئيسي
    const getMainCategoryName = useCallback((mainCategory) => {
        if (!mainCategory) return "";
        const normalized = normalizeId(mainCategory, categoryMapping.mainCategory);
        if (normalized === "residential") return "سكني";
        if (normalized === "commercial") return "تجاري";
        return mainCategory;
    }, [categoryMapping.mainCategory, normalizeId]);

    // الحصول على اسم التصنيف الفرعي
    const getSubCategoryName = useCallback((subCategory, mainCategory) => {
        if (!subCategory) return "";
        
        const normalizedMain = mainCategory ? normalizeId(mainCategory, categoryMapping.mainCategory) : "";
        let normalizedSub = subCategory;
        
        if (normalizedMain === "residential") {
            normalizedSub = normalizeId(subCategory, categoryMapping.subCategoryResidential);
        } else if (normalizedMain === "commercial") {
            normalizedSub = normalizeId(subCategory, categoryMapping.subCategoryCommercial);
        } else {
            normalizedSub = normalizeId(subCategory, {
                ...categoryMapping.subCategoryResidential,
                ...categoryMapping.subCategoryCommercial
            });
        }
        
        // البحث عن الاسم العربي
        if (normalizedMain === "residential") {
            const cat = designCategories.find(c => c.id === "residential");
            const sub = cat?.subcategories?.find(s => s.id === normalizedSub);
            return sub?.name?.ar || subCategory;
        } else if (normalizedMain === "commercial") {
            const cat = designCategories.find(c => c.id === "commercial");
            const sub = cat?.subcategories?.find(s => s.id === normalizedSub);
            return sub?.name?.ar || subCategory;
        }
        
        return subCategory;
    }, [categoryMapping, designCategories, normalizeId]);

    // الحصول على اسم التخصص
    const getSpecializationName = useCallback((specialization) => {
        if (!specialization) return "";
        const normalized = normalizeId(specialization, categoryMapping.specialization);
        const cat = designCategories.find(c => c.id === "specializations");
        const spec = cat?.subcategories?.find(s => s.id === normalized);
        return spec?.name?.ar || specialization;
    }, [categoryMapping.specialization, designCategories, normalizeId]);

    // الحصول على اسم الغرفة الداخلية
    const getInteriorRoomName = useCallback((roomId) => {
        if (!roomId) return "";
        const normalized = normalizeId(roomId, categoryMapping.interiorRooms);
        const cat = designCategories.find(c => c.id === "interior_rooms");
        const room = cat?.subcategories?.find(s => s.id === normalized);
        return room?.name?.ar || roomId;
    }, [categoryMapping.interiorRooms, designCategories, normalizeId]);

    // الحصول على اسم الغرفة التجارية
    const getCommercialRoomName = useCallback((roomId) => {
        if (!roomId) return "";
        const normalized = normalizeId(roomId, categoryMapping.commercialRooms);
        const cat = designCategories.find(c => c.id === "commercial_rooms");
        const room = cat?.subcategories?.find(s => s.id === normalized);
        return room?.name?.ar || roomId;
    }, [categoryMapping.commercialRooms, designCategories, normalizeId]);

    // الحصول على اسم المنطقة الخارجية
    const getExteriorAreaName = useCallback((areaId) => {
        if (!areaId) return "";
        const normalized = normalizeId(areaId, categoryMapping.exteriorAreas);
        const cat = designCategories.find(c => c.id === "exterior_areas");
        const area = cat?.subcategories?.find(s => s.id === normalized);
        return area?.name?.ar || areaId;
    }, [categoryMapping.exteriorAreas, designCategories, normalizeId]);

    // الحصول على اسم نمط التصميم
    const getDesignStyleName = useCallback((styleId) => {
        if (!styleId) return "";
        const normalized = normalizeId(styleId, categoryMapping.designStyles);
        const cat = designCategories.find(c => c.id === "design_styles");
        const style = cat?.subcategories?.find(s => s.id === normalized);
        return style?.name?.ar || styleId;
    }, [categoryMapping.designStyles, designCategories, normalizeId]);

    // دالة للحصول على نص التصنيف الكامل
    const getCategoryString = useCallback((category) => {
        if (!category) return '';
        
        if (typeof category === 'string') {
            return category;
        }
        
        if (typeof category === 'object' && category !== null) {
            const parts = [];
            
            // التصنيف الرئيسي
            if (category.mainCategory) {
                parts.push(getMainCategoryName(category.mainCategory));
            }
            
            // التصنيف الفرعي
            if (category.subCategory) {
                const subName = getSubCategoryName(category.subCategory, category.mainCategory);
                if (subName) parts.push(subName);
            }
            
            // التخصص
            if (category.specialization) {
                const specName = getSpecializationName(category.specialization);
                if (specName) parts.push(specName);
            }
            
            // الغرف الداخلية
            if (category.interiorRooms && Array.isArray(category.interiorRooms) && category.interiorRooms.length > 0) {
                const roomNames = category.interiorRooms.map(room => getInteriorRoomName(room));
                roomNames.forEach(name => {
                    if (name && !parts.includes(name)) parts.push(name);
                });
            }
            
            // الغرف التجارية
            if (category.commercialRooms && Array.isArray(category.commercialRooms) && category.commercialRooms.length > 0) {
                const roomNames = category.commercialRooms.map(room => getCommercialRoomName(room));
                roomNames.forEach(name => {
                    if (name && !parts.includes(name)) parts.push(name);
                });
            }
            
            // الأماكن الخارجية
            if (category.exteriorAreas && Array.isArray(category.exteriorAreas) && category.exteriorAreas.length > 0) {
                const areaNames = category.exteriorAreas.map(area => getExteriorAreaName(area));
                areaNames.forEach(name => {
                    if (name && !parts.includes(name)) parts.push(name);
                });
            }
            
            // أنماط التصميم
            if (category.designStyles && Array.isArray(category.designStyles) && category.designStyles.length > 0) {
                const styleNames = category.designStyles.map(style => getDesignStyleName(style));
                styleNames.forEach(name => {
                    if (name && !parts.includes(name)) parts.push(name);
                });
            }
            
            if (parts.length === 0) {
                return '';
            }
            
            // إزالة التكرارات
            const uniqueParts = [...new Set(parts)];
            return uniqueParts.join(' • ');
        }
        
        if (Array.isArray(category)) {
            return category.join(' • ');
        }
        
        return '';
    }, [
        getMainCategoryName,
        getSubCategoryName,
        getSpecializationName,
        getInteriorRoomName,
        getCommercialRoomName,
        getExteriorAreaName,
        getDesignStyleName
    ]);

    // دالة safeStringify
    const safeStringify = useCallback((value, fallback = '') => {
        if (value === undefined || value === null) return fallback;
        
        if (typeof value === 'string') {
            if (value === '' || value === '{"en":"","ar":""}' || value === '{}') return fallback;
            return value;
        }
        
        if (typeof value === 'number') return String(value);
        
        if (typeof value === 'object') {
            try {
                if (value.en === '' && value.ar === '') return fallback;
                if (value.en === '' && !value.ar) return fallback;
                if (value.ar === '' && !value.en) return fallback;
                
                if (value.ar && value.ar !== '') return value.ar;
                
                if (value.en && value.en !== '') return value.en;
                
                if (value.mainCategory) {
                    const categoryStr = getCategoryString(value);
                    return categoryStr || fallback;
                }
                
                if (value.title) {
                    return safeStringify(value.title, fallback);
                }
                
                if (value.name) {
                    return safeStringify(value.name, fallback);
                }
                
                if (Object.keys(value).length === 0) return fallback;
                
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
    }, [getCategoryString]);

    // دالة للحصول على كل النصوص القابلة للبحث في المشروع
    const getProjectSearchableText = useCallback((project) => {
        const searchTexts = [];
        
        // اسم المشروع
        const projectName = safeStringify(project.projectName || project.title, '');
        if (projectName) searchTexts.push(projectName);
        
        // الوصف
        const description = safeStringify(project.briefDescription || project.description, '');
        if (description) searchTexts.push(description);
        
        // التصنيفات
        const categoryString = getCategoryString(project.category);
        if (categoryString) searchTexts.push(categoryString);
        
        // التصنيف الرئيسي
        if (project.category?.mainCategory) {
            searchTexts.push(project.category.mainCategory);
            searchTexts.push(getMainCategoryName(project.category.mainCategory));
        }
        
        // التصنيف الفرعي
        if (project.category?.subCategory) {
            searchTexts.push(project.category.subCategory);
            searchTexts.push(getSubCategoryName(project.category.subCategory, project.category.mainCategory));
        }
        
        // التخصص
        if (project.category?.specialization) {
            searchTexts.push(project.category.specialization);
            searchTexts.push(getSpecializationName(project.category.specialization));
        }
        
        // الغرف الداخلية
        if (project.category?.interiorRooms && Array.isArray(project.category.interiorRooms)) {
            project.category.interiorRooms.forEach(room => {
                searchTexts.push(room);
                searchTexts.push(getInteriorRoomName(room));
            });
        }
        
        // الغرف التجارية
        if (project.category?.commercialRooms && Array.isArray(project.category.commercialRooms)) {
            project.category.commercialRooms.forEach(room => {
                searchTexts.push(room);
                searchTexts.push(getCommercialRoomName(room));
            });
        }
        
        // الأماكن الخارجية
        if (project.category?.exteriorAreas && Array.isArray(project.category.exteriorAreas)) {
            project.category.exteriorAreas.forEach(area => {
                searchTexts.push(area);
                searchTexts.push(getExteriorAreaName(area));
            });
        }
        
        // أنماط التصميم
        if (project.category?.designStyles && Array.isArray(project.category.designStyles)) {
            project.category.designStyles.forEach(style => {
                searchTexts.push(style);
                searchTexts.push(getDesignStyleName(style));
            });
        }
        
        // السنة
        const year = project.projectYear || project.year;
        if (year) searchTexts.push(String(year));
        
        // الموقع
        const location = safeStringify(project.projectLocation || project.location, '');
        if (location) searchTexts.push(location);
        
        // المساحة
        const area = project.projectArea || project.area;
        if (area) searchTexts.push(String(area));
        
        // الوسوم
        if (project.tags) {
            if (project.tags.ar && Array.isArray(project.tags.ar)) {
                searchTexts.push(...project.tags.ar);
            }
            if (project.tags.en && Array.isArray(project.tags.en)) {
                searchTexts.push(...project.tags.en);
            }
            if (Array.isArray(project.tags)) {
                searchTexts.push(...project.tags);
            }
        }
        
        // الألوان
        if (project.selectedColors && Array.isArray(project.selectedColors)) {
            searchTexts.push(...project.selectedColors);
        }
        
        return searchTexts.join(' ').toLowerCase();
    }, [
        safeStringify,
        getCategoryString,
        getMainCategoryName,
        getSubCategoryName,
        getSpecializationName,
        getInteriorRoomName,
        getCommercialRoomName,
        getExteriorAreaName,
        getDesignStyleName
    ]);

    // دالة للحصول على السنوات المتاحة من المشاريع
    const getAvailableYears = useCallback(() => {
        const years = new Set();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const currentProjects = projects || [];
        currentProjects.forEach(project => {
            const year = project.projectYear || project.year;
            if (year && year !== "بدون تاريخ") {
                years.add(year);
            }
        });
        return Array.from(years).sort((a, b) => b - a);
    }, []);

    // دالة تصفية المشاريع - فلترة تلقائية مع بحث شامل
    const filteredProjects = useMemo(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const currentProjects = projects || [];
        
        return currentProjects.filter(project => {
            // تحديد الصفحة التي يظهر فيها المشروع - القيمة الافتراضية هي "portfolio"
            const projectPageType = project.pageType || "portfolio";
            
            // الحصول على سنة المشروع
            const projectYear = project.projectYear || project.year;
            
            // فلترة البحث الشامل
            let matchesSearch = true;
            if (searchTerm !== "") {
                const searchLower = searchTerm.toLowerCase().trim();
                const projectSearchText = getProjectSearchableText(project);
                matchesSearch = projectSearchText.includes(searchLower);
            }
            
            // فلترة الحالة
            const matchesStatus = filterStatus === "all" ||
                (filterStatus === "active" && project.isActive) ||
                (filterStatus === "inactive" && !project.isActive) ||
                (filterStatus === "featured" && project.isFeatured);
            
            // فلترة الصفحة (من أين يظهر المشروع)
            const matchesPageType = filterPageType === "all" ||
                (filterPageType === "portfolio" && projectPageType === "portfolio") ||
                (filterPageType === "admin" && projectPageType === "admin");
            
            // فلترة السنة
            const matchesYear = filterYear === "all" ||
                (projectYear && projectYear.toString() === filterYear);
            
            return matchesSearch && 
                   matchesStatus && 
                   matchesPageType &&
                   matchesYear;
        }).sort((a, b) => {
            switch(sortBy) {
                case "newest":
                    // ترتيب حسب تاريخ الإضافة (الأحدث أولاً)
                    const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 
                                 a.createdAt ? new Date(a.createdAt).getTime() : 
                                 a.id || 0;
                    const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 
                                 b.createdAt ? new Date(b.createdAt).getTime() : 
                                 b.id || 0;
                    return dateB - dateA;
                case "oldest":
                    // ترتيب حسب تاريخ الإضافة (الأقدم أولاً)
                    const dateAOld = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 
                                    a.createdAt ? new Date(a.createdAt).getTime() : 
                                    a.id || 0;
                    const dateBOld = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 
                                    b.createdAt ? new Date(b.createdAt).getTime() : 
                                    b.id || 0;
                    return dateAOld - dateBOld;
                case "name-asc":
                    const nameA = safeStringify(a.projectName || a.title, '');
                    const nameB = safeStringify(b.projectName || b.title, '');
                    return nameA.localeCompare(nameB, 'ar');
                case "name-desc":
                    const nameADesc = safeStringify(a.projectName || a.title, '');
                    const nameBDesc = safeStringify(b.projectName || b.title, '');
                    return nameBDesc.localeCompare(nameADesc, 'ar');
                case "year-newest":
                    return (b.projectYear || b.year || 0) - (a.projectYear || a.year || 0);
                case "year-oldest":
                    return (a.projectYear || a.year || 0) - (b.projectYear || b.year || 0);
                default:
                    return 0;
            }
        });
    }, [
        searchTerm,
        filterStatus,
        filterPageType,
        filterYear,
        sortBy,
        safeStringify,
        getProjectSearchableText
    ]);

    // ==================== دوال إنشاء خيارات الفلاتر ====================
    
    // خيارات الصفحة (من أين يظهر المشروع)
    const pageTypeOptions = useMemo(() => [
        { id: "all", name: "جميع الصفحات" },
        { id: "portfolio", name: "صفحة المعرض (Portfolio)" },
        { id: "admin", name: "صفحة الإدارة (Admin Projects)" }
    ], []);

    // خيارات السنوات
    const yearOptions = useMemo(() => {
        const years = getAvailableYears();
        return [
            { id: "all", name: "جميع السنوات" },
            ...years.map(year => ({ id: year.toString(), name: year.toString() }))
        ];
    }, [getAvailableYears]);

    // ==================== دوال إدارة الفلاتر والتمرير ====================
    
    const resetFilters = () => {
        setSearchTerm("");
        setFilterStatus("all");
        setFilterPageType("all");
        setFilterYear("all");
        setSortBy("newest");
        
        // مسح جميع البيانات المحفوظة من sessionStorage
        sessionStorage.removeItem('projects_searchTerm');
        sessionStorage.removeItem('projects_filterStatus');
        sessionStorage.removeItem('projects_filterPageType');
        sessionStorage.removeItem('projects_filterYear');
        sessionStorage.removeItem('projects_sortBy');
        sessionStorage.removeItem('projects_scrollPosition');
    };

    // دالة معالجة فتح المشروع - نحفظ الفلاتر الحالية قبل الانتقال
    const handleProjectClick = useCallback((projectId) => {
        // قبل فتح المشروع، نتأكد من حفظ الفلاتر الحالية
        sessionStorage.setItem('projects_searchTerm', searchTerm);
        sessionStorage.setItem('projects_filterStatus', filterStatus);
        sessionStorage.setItem('projects_filterPageType', filterPageType);
        sessionStorage.setItem('projects_filterYear', filterYear);
        sessionStorage.setItem('projects_sortBy', sortBy);
        sessionStorage.setItem('projects_scrollPosition', window.scrollY.toString());
        
        // هنا يمكن إضافة منطق فتح المشروع
        handleEditProject({ id: projectId });
    }, [searchTerm, filterStatus, filterPageType, filterYear, sortBy]);

    // ==================== حساب الإحصائيات ====================
    const stats = useMemo(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const currentProjects = projects || [];
        return {
            total: currentProjects.length,
            active: currentProjects.filter(p => p.isActive).length,
            inactive: currentProjects.filter(p => !p.isActive).length,
            featured: currentProjects.filter(p => p.isFeatured).length,
            portfolio: currentProjects.filter(p => (p.pageType || "portfolio") === "portfolio").length,
            admin: currentProjects.filter(p => p.pageType === "admin").length
        };
    }, []);
    
    // ==================== دالة عرض الوسوم ====================
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

    // دالة للحصول على أيقونة الصفحة
    const getPageTypeIcon = useCallback((pageType) => {
        const type = pageType || "portfolio";
        switch(type) {
            case "admin":
                return { name: "صفحة الإدارة", color: "bg-purple-600 text-purple-700" };
            case "portfolio":
            default:
                return { name: "صفحة المعرض", color: "bg-blue-600 text-blue-700" };
        }
    }, []);

    // التحقق من وجود أي فلتر نشط
    const hasActiveFilters = useMemo(() => {
        return searchTerm !== "" ||
               filterStatus !== "all" ||
               filterPageType !== "all" ||
               filterYear !== "all";
    }, [searchTerm, filterStatus, filterPageType, filterYear]);

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-0">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">إدارة المشاريع</h1>
                        <p className="text-slate-600 text-sm">إدارة معرض المشاريع وعرضها وتعديلها</p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-4">
                        <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 sm:px-4 py-3">
                            <div className="text-xs text-slate-500">الإجمالي</div>
                            <div className="text-lg sm:text-xl font-bold text-slate-900">{stats.total}</div>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 sm:px-4 py-3">
                            <div className="text-xs text-emerald-600">النشطة</div>
                            <div className="text-lg sm:text-xl font-bold text-emerald-700">{stats.active}</div>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 sm:px-4 py-3">
                            <div className="text-xs text-orange-600">غير النشطة</div>
                            <div className="text-lg sm:text-xl font-bold text-orange-700">{stats.inactive}</div>
                        </div>
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 sm:px-4 py-3">
                            <div className="text-xs text-indigo-600">المميزة</div>
                            <div className="text-lg sm:text-xl font-bold text-indigo-700">{stats.featured}</div>
                        </div>
                    </div>
                </div>
                
                {/* إحصائيات الصفحات */}
                <div className="flex flex-wrap gap-2 sm:gap-4 mt-4 pt-4 border-t border-slate-100">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 sm:px-4 py-2">
                        <div className="flex items-center gap-2">
                            <div className="text-xs text-blue-600">صفحة المعرض</div>
                            <div className="text-lg font-bold text-blue-700">{stats.portfolio}</div>
                        </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 sm:px-4 py-2">
                        <div className="flex items-center gap-2">
                            <div className="text-xs text-purple-600">صفحة الإدارة</div>
                            <div className="text-lg font-bold text-purple-700">{stats.admin}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="ابحث عن أي شيء في المشاريع (اسم، نوع، غرفة، نمط، سنة، لون...)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 pr-12 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 text-sm text-slate-900"
                            />
                            <div className="absolute left-3 top-3 text-slate-400">
                                <IconInfo className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 text-sm text-slate-900 bg-white"
                        >
                            <option value="all">جميع المشاريع</option>
                            <option value="active">النشطة فقط</option>
                            <option value="inactive">غير النشطة</option>
                            <option value="featured">المميزة فقط</option>
                        </select>
                        
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 text-sm text-slate-900 bg-white"
                        >
                            <option value="newest">الأحدث أولاً</option>
                            <option value="oldest">الأقدم أولاً</option>
                            <option value="name-asc">الاسم (أ-ي)</option>
                            <option value="name-desc">الاسم (ي-أ)</option>
                            <option value="year-newest">السنة (الأحدث)</option>
                            <option value="year-oldest">السنة (الأقدم)</option>
                        </select>
                    </div>
                </div>
                
                {/* قسم الفلاتر المبسطة */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-xs text-slate-500 mb-2">الصفحة المعروض فيها</label>
                        <select
                            value={filterPageType}
                            onChange={(e) => setFilterPageType(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 text-sm text-slate-900 bg-white"
                        >
                            {pageTypeOptions.map(option => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-xs text-slate-500 mb-2">السنة</label>
                        <select
                            value={filterYear}
                            onChange={(e) => setFilterYear(e.target.value)}
                            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all duration-200 text-sm text-slate-900 bg-white"
                        >
                            {yearOptions.map(option => (
                                <option key={option.id} value={option.id}>{option.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                {/* زر إعادة تعيين فقط */}
                <div className="flex justify-end gap-3 mb-6">
                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all duration-200 text-sm font-medium"
                        >
                            إعادة تعيين
                        </button>
                    )}
                    
                    {userData?.role !== "viewer" && (
                        <button
                            onClick={handleAddProjectClick}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md flex items-center text-sm"
                        >
                            <IconPlus className="ml-2 w-5 h-5" />
                            إضافة مشروع جديد
                        </button>
                    )}
                </div>

                {/* عرض عدد النتائج */}
                {hasActiveFilters && (
                    <div className="mb-4 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                        تم العثور على {filteredProjects.length} نتيجة من أصل {stats.total} مشروع
                    </div>
                )}

                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {filteredProjects.map((project) => {
                            const projectName = safeStringify(project.projectName || project.title, '');
                            const description = safeStringify(project.briefDescription || project.description, '');
                            const categoryString = getCategoryString(project.category);
                            const pageTypeInfo = getPageTypeIcon(project.pageType);
                            
                            const mainImage = project.coverImage || project.mainImage || "https://via.placeholder.com/400x250?text=Project";
                            const area = project.projectArea || project.area || "غير محدد";
                            const year = project.projectYear || project.year || "بدون تاريخ";
                            const location = project.projectLocation || project.location || "غير محدد";
                            
                            return (
                                <div 
                                    key={project.id} 
                                    className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
                                    onClick={() => handleProjectClick(project.id)}
                                >
                                    <div className="relative h-40 sm:h-48 overflow-hidden">
                                        <img 
                                            src={mainImage} 
                                            alt={projectName || "مشروع"}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://via.placeholder.com/400x250?text=Project";
                                            }}
                                        />
                                        
                                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-3 sm:p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                                    {project.isFeatured && (
                                                        <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full mb-1 sm:mb-2 inline-block">
                                                            مميز
                                                        </span>
                                                    )}
                                                    {project.isActive ? (
                                                        <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-2 sm:px-3 py-1 rounded-full mb-1 sm:mb-2 inline-block">
                                                            نشط
                                                        </span>
                                                    ) : (
                                                        <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 sm:px-3 py-1 rounded-full mb-1 sm:mb-2 inline-block">
                                                            غير نشط
                                                        </span>
                                                    )}
                                                    {/* عرض الصفحة التي يظهر فيها المشروع */}
                                                    <span className={`${pageTypeInfo.color} text-white text-xs px-2 sm:px-3 py-1 rounded-full mb-1 sm:mb-2 inline-block`}>
                                                        {pageTypeInfo.name}
                                                    </span>
                                                </div>
                                                <span className="bg-white/90 text-slate-800 text-xs px-2 sm:px-3 py-1 rounded-full">
                                                    {year}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4">
                                            <h3 className="text-white font-bold text-base sm:text-lg truncate">
                                                {projectName || "بدون عنوان"}
                                            </h3>
                                            <p className="text-white/90 text-xs sm:text-sm mt-1 truncate">
                                                {categoryString || area}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4 sm:p-6">
                                        <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 min-h-[40px]">
                                            {description || "لا يوجد وصف"}
                                        </p>
                                        {/* عرض التصنيفات المحددة */}
                                        <div className="mb-3">
                                            {project.category?.mainCategory && (
                                                <div className="flex items-center mb-2">
                                                    <span className="text-xs text-slate-600 ml-2 w-20">النوع:</span>
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                        {getMainCategoryName(project.category.mainCategory)}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {project.category?.subCategory && (
                                                <div className="flex items-center mb-2">
                                                    <span className="text-xs text-slate-600 ml-2 w-20">الفرعي:</span>
                                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                        {getSubCategoryName(project.category.subCategory, project.category.mainCategory)}
                                                    </span>
                                                </div>
                                            )}
                                            
                                            {project.category?.specialization && (
                                                <div className="flex items-center mb-2">
                                                    <span className="text-xs text-slate-600 ml-2 w-20">التخصص:</span>
                                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                                        {getSpecializationName(project.category.specialization)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* عرض الغرف الداخلية */}
                                        {project.category?.interiorRooms && project.category.interiorRooms.length > 0 && (
                                            <div className="mb-3">
                                                <span className="text-xs text-slate-600 ml-2">الغرف الداخلية:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {project.category.interiorRooms.slice(0, 3).map((room, idx) => (
                                                        <span key={idx} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                                                            {getInteriorRoomName(room)}
                                                        </span>
                                                    ))}
                                                    {project.category.interiorRooms.length > 3 && (
                                                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                                                            +{project.category.interiorRooms.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* عرض الغرف التجارية */}
                                        {project.category?.commercialRooms && project.category.commercialRooms.length > 0 && (
                                            <div className="mb-3">
                                                <span className="text-xs text-slate-600 ml-2">الغرف التجارية:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {project.category.commercialRooms.slice(0, 3).map((room, idx) => (
                                                        <span key={idx} className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                                                            {getCommercialRoomName(room)}
                                                        </span>
                                                    ))}
                                                    {project.category.commercialRooms.length > 3 && (
                                                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                                                            +{project.category.commercialRooms.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* عرض الأماكن الخارجية */}
                                        {project.category?.exteriorAreas && project.category.exteriorAreas.length > 0 && (
                                            <div className="mb-3">
                                                <span className="text-xs text-slate-600 ml-2">الخارجية:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {project.category.exteriorAreas.slice(0, 3).map((area, idx) => (
                                                        <span key={idx} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                                                            {getExteriorAreaName(area)}
                                                        </span>
                                                    ))}
                                                    {project.category.exteriorAreas.length > 3 && (
                                                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                                                            +{project.category.exteriorAreas.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* عرض أنماط التصميم */}
                                        {project.category?.designStyles && project.category.designStyles.length > 0 && (
                                            <div className="mb-3">
                                                <span className="text-xs text-slate-600 ml-2">الأنماط:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {project.category.designStyles.slice(0, 3).map((style, idx) => (
                                                        <span key={idx} className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                                                            {getDesignStyleName(style)}
                                                        </span>
                                                    ))}
                                                    {project.category.designStyles.length > 3 && (
                                                        <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                                                            +{project.category.designStyles.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="mb-3 sm:mb-4">
                                            <div className="flex items-center mb-2">
                                                <IconTag className="w-4 h-4 ml-2 text-slate-400" />
                                                <span className="text-xs text-slate-600">الوسوم:</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1 sm:gap-2 min-h-[28px]">
                                                {renderTags(project.tags) || (
                                                    <span className="text-xs text-slate-400 italic">لا توجد وسوم</span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {project.selectedColors?.length > 0 && (
                                            <div className="flex items-center mb-3 sm:mb-4">
                                                <span className="text-xs text-slate-600 ml-2">الألوان:</span>
                                                <div className="flex gap-1 sm:gap-2">
                                                    {project.selectedColors.slice(0, 4).map((color, idx) => (
                                                        <div 
                                                            key={idx}
                                                            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-slate-200 shadow-sm"
                                                            style={{ backgroundColor: color }}
                                                            title={color}
                                                        />
                                                    ))}
                                                    {project.selectedColors.length > 4 && (
                                                        <span className="text-xs text-slate-500">
                                                            +{project.selectedColors.length - 4}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="grid grid-cols-2 gap-2 mb-3 sm:mb-4">
                                            <div className="bg-slate-50 rounded-lg p-2">
                                                <div className="text-xs text-slate-500">المساحة</div>
                                                <div className="text-sm font-medium text-slate-900">
                                                    {area}
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 rounded-lg p-2">
                                                <div className="text-xs text-slate-500">الموقع</div>
                                                <div className="text-sm font-medium text-slate-900 truncate">
                                                    {location}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-slate-100 pt-3 sm:pt-4 gap-2 sm:gap-0">
                                            <div className="text-xs sm:text-sm text-slate-500 truncate flex items-center">
                                                <IconMapPin className="w-3 h-3 sm:w-4 sm:h-4 ml-1 text-slate-400" />
                                                {location}
                                            </div>
                                            <div className="flex gap-1 sm:gap-2" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => handleEditProject(project)}
                                                    className="p-1.5 sm:p-2 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-lg transition-colors"
                                                    disabled={userData?.role === "viewer"}
                                                    title="تعديل"
                                                >
                                                    <IconEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                                                </button>
                                                {userData?.role !== "viewer" && (
                                                    <button
                                                        onClick={() => toggleProjectStatus(project.id, project.isActive, projectName || "المشروع")}
                                                        className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                                                            project.isActive 
                                                                ? "text-orange-600 hover:text-orange-800 hover:bg-orange-50" 
                                                                : "text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                                                        }`}
                                                        title={project.isActive ? "تعطيل" : "تفعيل"}
                                                    >
                                                        {project.isActive ? <IconEyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <IconEye className="w-4 h-4 sm:w-5 sm:h-5" />}
                                                    </button>
                                                )}
                                                {userData?.role !== "viewer" && (
                                                    <button
                                                        onClick={() => toggleFeatured("portfolioProjects", project.id, project.isFeatured, projectName || "المشروع", "مشروع")}
                                                        className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                                                            project.isFeatured 
                                                                ? "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50" 
                                                                : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                                                        }`}
                                                        title={project.isFeatured ? "إلغاء التميز" : "تمييز"}
                                                    >
                                                        <IconStar className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </button>
                                                )}
                                                {(userData?.role === "editor" || userData?.role === "admin") && (
                                                    <button
                                                        onClick={() => handleDelete("portfolioProjects", project.id, projectName || "المشروع")}
                                                        className="p-1.5 sm:p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="حذف"
                                                    >
                                                        <IconTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <IconImage className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-semibold text-slate-600 mb-2">
                            {hasActiveFilters ? "لم يتم العثور على مشاريع" : "لا توجد مشاريع"}
                        </h3>
                        <p className="text-slate-500 mb-6">
                            {hasActiveFilters
                                ? "جرب تغيير كلمات البحث أو إزالة المرشحات" 
                                : "لم يتم إضافة أي مشاريع بعد"}
                        </p>
                        {userData?.role !== "viewer" && !hasActiveFilters && (
                            <button
                                onClick={handleAddProjectClick}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md flex items-center mx-auto text-sm"
                            >
                                <IconPlus className="ml-2 w-5 h-5" />
                                إضافة أول مشروع
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

  function ServicesTabContent() {
      const [searchTerm, setSearchTerm] = useState("");
      const [filterStatus, setFilterStatus] = useState("all");
      const [filterCategory, setFilterCategory] = useState("all");
      const [sortBy, setSortBy] = useState("newest");
      
      // إحصائيات الخدمات
      const stats = useMemo(() => ({
        total: services.length,
        active: services.filter(s => s.isActive).length,
        inactive: services.filter(s => !s.isActive).length,
        featured: services.filter(s => s.isFeatured).length
        // eslint-disable-next-line
      }), [services]);
      
      // تصنيفات الخدمات للفلتر
      const categoryOptions = useMemo(() => [
        { value: "all", label: "جميع التصنيفات" },
        { value: "none", label: "بدون تصنيف" },
        ...serviceCategories.map(cat => ({
          value: cat.value,
          label: cat.label.ar
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
      ], [serviceCategories]);
      
      // دالة للحصول على قيمة النص بأمان
      const getSafeValue = (value, defaultValue = "") => {
        if (value === undefined || value === null || value === "") return defaultValue;
        
        // إذا كان كائن متعدد اللغات
        if (typeof value === 'object' && !Array.isArray(value)) {
          return value.ar || value.en || defaultValue;
        }
        
        return String(value);
      };
      
      // دالة لعرض الوسوم - تعرض الحقول الفارغة كما هي
      const renderTags = (tags) => {
        if (!tags || (typeof tags === 'object' && Object.keys(tags).length === 0) || (Array.isArray(tags) && tags.length === 0)) {
          return <span className="text-xs text-slate-400 italic">لا توجد وسوم</span>;
        }
        
        if (typeof tags === 'object' && tags !== null && !Array.isArray(tags)) {
          const arabicTags = tags.ar || [];
          const englishTags = tags.en || [];
          const allTags = [...arabicTags, ...englishTags];
          
          if (allTags.length === 0) {
            return <span className="text-xs text-slate-400 italic">لا توجد وسوم</span>;
          }
          
          return (
            <>
              {allTags.slice(0, 3).map((tag, idx) => (
                <span 
                  key={idx} 
                  className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200"
                  title={tag}
                >
                  {tag.length > 15 ? tag.substring(0, 15) + '...' : tag}
                </span>
              ))}
            </>
          );
        }
        
        if (Array.isArray(tags)) {
          return tags.slice(0, 3).map((tag, idx) => (
            <span 
              key={idx} 
              className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200"
              title={tag}
            >
              {tag.length > 15 ? tag.substring(0, 15) + '...' : tag}
            </span>
          ));
        }
        
        if (typeof tags === 'string') {
          const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
          if (tagsArray.length === 0) {
            return <span className="text-xs text-slate-400 italic">لا توجد وسوم</span>;
          }
          return tagsArray.slice(0, 3).map((tag, idx) => (
            <span 
              key={idx} 
              className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200"
              title={tag}
            >
              {tag.length > 15 ? tag.substring(0, 15) + '...' : tag}
            </span>
          ));
        }
        
        return <span className="text-xs text-slate-400 italic">لا توجد وسوم</span>;
      };

      const getFilteredServices = () => {
        return services.filter(service => {
          const serviceName = getSafeValue(service.title, "");
          const description = getSafeValue(service.shortDescription, "");
          const longDescription = getSafeValue(service.description, "");
          
          const matchesSearch = searchTerm === "" || 
            serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            longDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (service.tags && (
              (service.tags.ar && service.tags.ar.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
              (service.tags.en && service.tags.en.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
              (Array.isArray(service.tags) && service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
            ));
          
          const matchesStatus = filterStatus === "all" ||
            (filterStatus === "active" && service.isActive) ||
            (filterStatus === "inactive" && !service.isActive) ||
            (filterStatus === "featured" && service.isFeatured);
          
          const matchesCategory = filterCategory === "all" ||
            (filterCategory === "none" && !service.category) ||
            service.category === filterCategory;
          
          return matchesSearch && matchesStatus && matchesCategory;
        }).sort((a, b) => {
          switch(sortBy) {
            case "newest":
              const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt).getTime();
              const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime();
              return dateB - dateA;
            case "oldest":
              const dateAOld = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt).getTime();
              const dateBOld = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime();
              return dateAOld - dateBOld;
            case "name-asc":
              const nameA = getSafeValue(a.title, "");
              const nameB = getSafeValue(b.title, "");
              return nameA.localeCompare(nameB, 'ar');
            case "name-desc":
              const nameADesc = getSafeValue(a.title, "");
              const nameBDesc = getSafeValue(b.title, "");
              return nameBDesc.localeCompare(nameADesc, 'ar');
            case "price-high":
              return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
            case "price-low":
              return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
            default:
              return 0;
          }
        });
      };

      const filteredServices = getFilteredServices();

      return (
        <div className="space-y-4 sm:space-y-6">
          {/* رأس الصفحة مع الإحصائيات */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">إدارة الخدمات</h1>
                <p className="text-slate-600 text-sm">إدارة خدمات التصميم والديكور وعرضها وتعديلها</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 sm:px-4 py-3">
                  <div className="text-xs text-slate-500">الإجمالي</div>
                  <div className="text-lg sm:text-xl font-bold text-slate-900">{stats.total}</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 sm:px-4 py-3">
                  <div className="text-xs text-emerald-600">النشطة</div>
                  <div className="text-lg sm:text-xl font-bold text-emerald-700">{stats.active}</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 sm:px-4 py-3">
                  <div className="text-xs text-orange-600">غير النشطة</div>
                  <div className="text-lg sm:text-xl font-bold text-orange-700">{stats.inactive}</div>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 sm:px-4 py-3">
                  <div className="text-xs text-indigo-600">المميزة</div>
                  <div className="text-lg sm:text-xl font-bold text-indigo-700">{stats.featured}</div>
                </div>
              </div>
            </div>
          </div>

          {/* شريط التحكم */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="ابحث عن خدمة، وصف، تصنيف، أو وسم..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 pr-12 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-sm text-slate-900"
                  />
                  <div className="absolute left-3 top-3 text-slate-400">
                    <IconInfo className="w-5 h-5" />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-sm text-slate-900 bg-white"
                >
                  <option value="all">جميع الخدمات</option>
                  <option value="active">النشطة فقط</option>
                  <option value="inactive">غير النشطة</option>
                  <option value="featured">المميزة فقط</option>
                </select>
                
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-sm text-slate-900 bg-white"
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-sm text-slate-900 bg-white"
                >
                  <option value="newest">الأحدث أولاً</option>
                  <option value="oldest">الأقدم أولاً</option>
                  <option value="name-asc">الاسم (أ-ي)</option>
                  <option value="name-desc">الاسم (ي-أ)</option>
                  <option value="price-high">السعر (الأعلى)</option>
                  <option value="price-low">السعر (الأدنى)</option>
                </select>
                
                {userData?.role !== "viewer" && (
                  <button
                    onClick={handleAddServiceClick}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md flex items-center text-sm"
                  >
                    <IconPlus className="ml-2 w-5 h-5" />
                    إضافة خدمة جديدة
                  </button>
                )}
              </div>
            </div>

            {/* قائمة الخدمات */}
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredServices.map((service) => {
                  const category = serviceCategories.find(cat => cat.value === service.category);
                  const categoryName = category ? category.label.ar : (service.category || "بدون تصنيف");
                  const serviceName = getSafeValue(service.title, "خدمة بدون اسم");
                  const serviceDescription = getSafeValue(service.shortDescription, "");
                  
                  return (
                    <div key={service.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300">
                      <div className="relative h-32 sm:h-40 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                        {service.mainImage ? (
                          <img 
                            src={service.mainImage} 
                            alt={serviceName}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <IconImage className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                              <span className="text-xs text-slate-500">لا توجد صورة</span>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-3 sm:p-4">
                          <div className="flex justify-between">
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                              {service.isFeatured && (
                                <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full mb-1 sm:mb-2 inline-block">
                                  مميز
                                </span>
                              )}
                              {service.isActive ? (
                                <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-2 sm:px-3 py-1 rounded-full mb-1 sm:mb-2 inline-block">
                                  نشط
                                </span>
                              ) : (
                                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 sm:px-3 py-1 rounded-full mb-1 sm:mb-2 inline-block">
                                  غير نشط
                                </span>
                              )}
                            </div>
                            {service.price && (
                              <span className="bg-white/90 text-slate-800 text-xs px-2 sm:px-3 py-1 rounded-full">
                                {service.price}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4">
                          <h3 className="text-white font-bold text-base sm:text-lg truncate">
                            {serviceName}
                          </h3>
                          <p className="text-white/90 text-xs sm:text-sm mt-1 truncate">
                            {categoryName} • {service.duration || "مدة غير محددة"}
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-4 sm:p-6">
                        {/* الوصف المختصر */}
                        {serviceDescription ? (
                          <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                            {serviceDescription}
                          </p>
                        ) : (
                          <div className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4 italic">
                            لا يوجد وصف مختصر
                          </div>
                        )}
                        
                        {/* عرض الوسوم */}
                        <div className="mb-3 sm:mb-4">
                          <div className="flex items-center mb-2">
                            <IconTag className="w-4 h-4 ml-2 text-slate-400" />
                            <span className="text-xs text-slate-600">الوسوم:</span>
                          </div>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {renderTags(service.tags)}
                          </div>
                        </div>
                        
                        {/* معلومات إضافية */}
                        <div className="grid grid-cols-2 gap-3 mb-3 sm:mb-4">
                          <div className="bg-slate-50 rounded-lg p-2 sm:p-3">
                            <div className="text-xs text-slate-500">المدة</div>
                            <div className="text-sm font-medium text-slate-900">
                              {service.duration || "غير محددة"}
                            </div>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2 sm:p-3">
                            <div className="text-xs text-slate-500">التصنيف</div>
                            <div className="text-sm font-medium text-slate-900 truncate">
                              {categoryName}
                            </div>
                          </div>
                        </div>
                        
                        {/* معلومات اختيارية إضافية */}
                        {(service.deliveryTime || service.warranty) && (
                          <div className="grid grid-cols-2 gap-3 mb-3 sm:mb-4">
                            {service.deliveryTime && (
                              <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
                                <div className="text-xs text-blue-500">وقت التسليم</div>
                                <div className="text-sm font-medium text-blue-900 truncate">
                                  {service.deliveryTime}
                                </div>
                              </div>
                            )}
                            {service.warranty && (
                              <div className="bg-green-50 rounded-lg p-2 sm:p-3">
                                <div className="text-xs text-green-500">الضمان</div>
                                <div className="text-sm font-medium text-green-900 truncate">
                                  {service.warranty}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* معلومات الإحصائيات */}
                        <div className="grid grid-cols-2 gap-3 mb-3 sm:mb-4">
                          <div className="bg-purple-50 rounded-lg p-2 sm:p-3">
                            <div className="text-xs text-purple-500">الشعبية</div>
                            <div className="text-sm font-medium text-purple-900">
                              {service.popularity || 0}%
                            </div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                            <div className="text-xs text-gray-500">المشاهدات</div>
                            <div className="text-sm font-medium text-gray-900">
                              {service.views || 0}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-slate-100 pt-3 sm:pt-4 gap-2 sm:gap-0">
                          <div className="text-xs sm:text-sm text-slate-500 truncate">
                            {service.views || 0} مشاهدة
                          </div>
                          <div className="flex gap-1 sm:gap-2">
                            <button
                              onClick={() => handleEditService(service)}
                              className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              disabled={userData?.role === "viewer"}
                              title="تعديل"
                            >
                              <IconEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            {userData?.role !== "viewer" && (
                              <button
                                onClick={() => toggleServiceStatus(service.id, service.isActive, getSafeValue(service.title, "الخدمة"))}
                                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                                  service.isActive 
                                    ? "text-orange-600 hover:text-orange-800 hover:bg-orange-50" 
                                    : "text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                                }`}
                                title={service.isActive ? "تعطيل" : "تفعيل"}
                              >
                                {service.isActive ? <IconEyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <IconEye className="w-4 h-4 sm:w-5 sm:h-5" />}
                              </button>
                            )}
                            {userData?.role !== "viewer" && (
                              <button
                                onClick={() => toggleFeatured("services", service.id, service.isFeatured, getSafeValue(service.title, "الخدمة"), "خدمة")}
                                className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
                                  service.isFeatured 
                                    ? "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50" 
                                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                                }`}
                                title={service.isFeatured ? "إلغاء التميز" : "تمييز"}
                              >
                                <IconStar className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            )}
                            {(userData?.role === "editor" || userData?.role === "admin") && (
                              <button
                                onClick={() => handleDelete("services", service.id, getSafeValue(service.title, "الخدمة"))}
                                className="p-1.5 sm:p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                title="حذف"
                              >
                                <IconTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <IconPackage className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-semibold text-slate-600 mb-2">
                  {searchTerm || filterStatus !== "all" || filterCategory !== "all" 
                    ? "لم يتم العثور على خدمات" 
                    : "لا توجد خدمات"}
                </h3>
                <p className="text-slate-500 mb-6">
                  {searchTerm || filterStatus !== "all" || filterCategory !== "all"
                    ? "جرب تغيير كلمات البحث أو إزالة المرشحات" 
                    : "لم يتم إضافة أي خدمات بعد"}
                </p>
                {userData?.role !== "viewer" && (
                  <button
                    onClick={handleAddServiceClick}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md flex items-center mx-auto text-sm"
                  >
                    <IconPlus className="ml-2 w-5 h-5" />
                    إضافة أول خدمة
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

  function MessagesTabContent() {
    // إحصائيات الرسائل
    const unreadMessages = messages.filter(m => !m.read).length;
    const whatsappMessages = messages.filter(m => 
      m.preferredContact === 'whatsapp' || 
      m.contactMethod === 'whatsapp' ||
      m.phone?.includes('whatsapp') ||
      m.message?.toLowerCase().includes('واتساب')
    ).length;
    const phoneMessages = messages.filter(m => 
      m.preferredContact === 'phone' || 
      m.contactMethod === 'phone' ||
      m.message?.toLowerCase().includes('اتصال')
    ).length;
    
    // دالة التصفية
    const getFilteredMessages = () => {
      return messages.filter(message => {
        const matchesSearch = searchTermMessages === "" || 
          message.name?.toLowerCase().includes(searchTermMessages.toLowerCase()) ||
          message.email?.toLowerCase().includes(searchTermMessages.toLowerCase()) ||
          message.phone?.toLowerCase().includes(searchTermMessages.toLowerCase()) ||
          message.subject?.toLowerCase().includes(searchTermMessages.toLowerCase()) ||
          message.message?.toLowerCase().includes(searchTermMessages.toLowerCase());
        
        const matchesStatus = filterMessagesStatus === "all" ||
          (filterMessagesStatus === "unread" && !message.read) ||
          (filterMessagesStatus === "read" && message.read) ||
          (filterMessagesStatus === "whatsapp" && (
            message.preferredContact === 'whatsapp' || 
            message.contactMethod === 'whatsapp' ||
            message.phone?.includes('whatsapp') ||
            message.message?.toLowerCase().includes('واتساب')
          )) ||
          (filterMessagesStatus === "phone" && (
            message.preferredContact === 'phone' || 
            message.contactMethod === 'phone' ||
            message.message?.toLowerCase().includes('اتصال')
          )) ||
          (filterMessagesStatus === "email" && (
            message.preferredContact === 'email' ||
            !message.preferredContact
          ));
        
        return matchesSearch && matchesStatus;
      }).sort((a, b) => {
        if (!a.read && b.read) return -1;
        if (a.read && !b.read) return 1;
        
        const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt).getTime();
        const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime();
        
        return dateB - dateA;
      });
    };
    
    const filteredMessages = getFilteredMessages();
    
    const getContactInfo = (message) => {
      const phone = message.phone || '';
      const preferredContact = message.preferredContact || message.contactMethod || '';
      
      if (preferredContact === 'whatsapp' || phone.includes('whatsapp') || message.message?.toLowerCase().includes('واتساب')) {
        return {
          type: 'whatsapp',
          icon: <IconWhatsApp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />,
          label: 'واتساب',
          color: 'bg-emerald-100 text-emerald-700 border-emerald-200'
        };
      } else if (preferredContact === 'phone' || message.message?.toLowerCase().includes('اتصال')) {
        return {
          type: 'phone',
          icon: <IconPhone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />,
          label: 'اتصال',
          color: 'bg-blue-100 text-blue-700 border-blue-200'
        };
      } else {
        return {
          type: 'email',
          icon: <IconMail className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500" />,
          label: 'بريد',
          color: 'bg-indigo-100 text-indigo-700 border-indigo-200'
        };
      }
    };
    
    const getContactLink = (message) => {
      const phone = message.phone?.replace(/\D/g, '');
      const contactInfo = getContactInfo(message);
      
      if (contactInfo.type === 'whatsapp' && phone) {
        return `https://wa.me/${phone}`;
      } else if (contactInfo.type === 'phone' && phone) {
        return `tel:${phone}`;
      } else if (message.email) {
        return `mailto:${message.email}`;
      }
      return null;
    };
    
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* رأس الصفحة مع الإحصائيات */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">رسائل الاتصال</h1>
              <p className="text-slate-600 text-sm">إدارة جميع رسائل التواصل من الزوار والعملاء</p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 sm:px-4 py-3">
                <div className="text-xs text-slate-500">الإجمالي</div>
                <div className="text-lg sm:text-xl font-bold text-slate-900">{messages.length}</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 sm:px-4 py-3">
                <div className="text-xs text-orange-600">غير مقروء</div>
                <div className="text-lg sm:text-xl font-bold text-orange-700">{unreadMessages}</div>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 sm:px-4 py-3">
                <div className="text-xs text-emerald-600">واتساب</div>
                <div className="text-lg sm:text-xl font-bold text-emerald-700">{whatsappMessages}</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 sm:px-4 py-3">
                <div className="text-xs text-blue-600">اتصال</div>
                <div className="text-lg sm:text-xl font-bold text-blue-700">{phoneMessages}</div>
              </div>
            </div>
          </div>
        </div>

        {/* شريط التحكم */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث في الرسائل..."
                  value={searchTermMessages}
                  onChange={(e) => setSearchTermMessages(e.target.value)}
                  className="w-full p-3 pr-12 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-sm text-slate-900"
                />
                <div className="absolute left-3 top-3 text-slate-400">
                  <IconInfo className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <select
                value={filterMessagesStatus}
                onChange={(e) => setFilterMessagesStatus(e.target.value)}
                className="p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-sm text-slate-900 bg-white"
              >
                <option value="all">جميع الرسائل</option>
                <option value="unread">غير المقروء فقط</option>
                <option value="read">المقروء فقط</option>
                <option value="whatsapp">طلبات واتساب</option>
                <option value="phone">طلبات اتصال</option>
                <option value="email">طلبات بريد</option>
              </select>
              
              <button
                onClick={() => {
                  setSearchTermMessages("");
                  setFilterMessagesStatus("all");
                }}
                className="px-4 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors text-sm"
              >
                إعادة التعيين
              </button>
            </div>
          </div>
          {/* قائمة الرسائل */}
          {filteredMessages.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredMessages.map((message) => {
                const contactInfo = getContactInfo(message);
                const contactLink = getContactLink(message);
                
                return (
                  <div key={message.id} className={`p-4 sm:p-6 transition-all duration-300 hover:bg-slate-50 ${
                    !message.read ? 'bg-blue-50 hover:bg-blue-100' : ''
                  }`}>
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4 gap-3">
                      {/* معلومات المرسل */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h4 className="font-bold text-slate-900 text-lg">{message.name}</h4>
                          
                          {/* شارة حالة القراءة */}
                          {!message.read && (
                            <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs px-2 py-1 rounded-full">
                              جديد
                            </span>
                          )}
                          
                          {/* شارة نوع الاتصال */}
                          <span className={`border px-2 py-1 rounded-full text-xs font-medium ${contactInfo.color}`}>
                            <div className="flex items-center gap-1">
                              {contactInfo.icon}
                              {contactInfo.label}
                            </div>
                          </span>
                        </div>
                        
                        {/* معلومات الاتصال */}
                        <div className="flex flex-wrap gap-3 text-sm text-slate-600 mb-3">
                          <div className="flex items-center">
                            <IconMail className="w-4 h-4 ml-2" />
                            <span className="truncate max-w-[200px] sm:max-w-none">{message.email}</span>
                          </div>
                          {message.phone && (
                            <div className="flex items-center">
                              <IconPhone className="w-4 h-4 ml-2" />
                              <span>{message.phone}</span>
                            </div>
                          )}
                          {message.subject && (
                            <div className="flex items-center">
                              <span className="font-medium ml-2">الموضوع:</span>
                              <span>{message.subject}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* التاريخ والوقت */}
                      <div className="text-left min-w-[180px]">
                        <div className="text-sm text-slate-500">
                          {message.createdAt?.toDate?.().toLocaleDateString("ar-SA", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {message.createdAt?.toDate?.().toLocaleTimeString("ar-SA", {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    
                    {/* نص الرسالة */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4">
                      <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                        {message.message}
                      </p>
                    </div>
                    
                    {/* أزرار الإجراءات */}
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          message.read 
                            ? 'bg-slate-100 text-slate-700' 
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {message.read ? 'مقروءة' : 'غير مقروءة'}
                        </span>
                        
                        {message.readBy && (
                          <span className="text-xs text-slate-500">
                            قرأها: {message.readBy}
                          </span>
                        )}
                        
                        {message.readAt && (
                          <span className="text-xs text-slate-500">
                            بتاريخ: {formatDate(message.readAt)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {/* زر تغيير حالة القراءة */}
                        {userData?.role !== "viewer" && (
                          <button
                            onClick={() => markAsRead(message.id, message.read, message.name)}
                            className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                              message.read 
                                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {message.read ? 'تعيين كغير مقروءة' : 'تعيين كمقروءة'}
                          </button>
                        )}
                        
                        {/* زر الحذف (للمدير فقط) */}
                        {(userData?.role === "editor" || userData?.role === "admin") && (
                          <button
                            onClick={() => handleDelete("contactMessages", message.id, message.name)}
                            className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors text-sm"
                          >
                            حذف الرسالة
                          </button>
                        )}
                        
                        {/* زر الرد بالبريد الإلكتروني */}
                        <a 
                          href={`mailto:${message.email}`}
                          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 text-sm"
                        >
                          الرد بالبريد
                        </a>
                        
                        {/* زر الاتصال المناسب */}
                        {contactLink && (
                          <a 
                            href={contactLink}
                            target={contactInfo.type !== 'phone' ? "_blank" : undefined}
                            rel={contactInfo.type !== 'phone' ? "noopener noreferrer" : undefined}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm flex items-center ${
                              contactInfo.type === 'whatsapp'
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
                                : contactInfo.type === 'phone'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                            }`}
                          >
                            {contactInfo.icon}
                            <span className="mr-2">
                              {contactInfo.type === 'whatsapp' ? 'مراسلة واتساب' :
                               contactInfo.type === 'phone' ? 'الاتصال هاتفياً' : 'مراسلة بريد'}
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <IconMail className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">
                {searchTermMessages || filterMessagesStatus !== "all" 
                  ? "لم يتم العثور على رسائل" 
                  : "لا توجد رسائل"}
              </h3>
              <p className="text-slate-500 mb-6">
                {searchTermMessages 
                  ? "جرب تغيير كلمات البحث" 
                  : filterMessagesStatus !== "all"
                  ? "لا توجد رسائل تطابق هذا الفلتر"
                  : "لم يتم إرسال أي رسائل بعد"}
              </p>
              {(searchTermMessages || filterMessagesStatus !== "all") && (
                <button
                  onClick={() => {
                    setSearchTermMessages("");
                    setFilterMessagesStatus("all");
                  }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                >
                  عرض جميع الرسائل
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  function ServiceRequestsTabContent() {
    return (
      <ServiceRequests 
        serviceRequests={serviceRequests}
        onStatusUpdate={handleServiceRequestStatusUpdate}
        onDelete={deleteServiceRequest}
        userData={userData}
        onRefresh={refreshDataSilently}
      />
    );
  }

  function ProjectRequestsTabContent() {
    return userData?.role !== "viewer" ? (
      <ProjectRequests 
        projectRequests={projectRequests}
        onStatusUpdate={handleProjectRequestStatus}
        onContact={handleProjectRequestContact}
        onAddNote={addProjectRequestNote}
        onAssign={assignProjectRequest}
        onDelete={deleteProjectRequest}
        userData={userData}
        onRefresh={refreshDataSilently}
      />
    ) : (
      <div className="text-center py-8 sm:py-12">
        <IconCalendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-slate-300" />
        <h3 className="text-base sm:text-lg font-semibold text-slate-600 mb-1 sm:mb-2">غير مصرح بالوصول</h3>
        <p className="text-slate-500 text-sm sm:text-base">الصلاحية الحالية (مشاهد) لا تسمح لك بعرض طلبات المشاريع</p>
      </div>
    );
  }

  function AboutUsTabContent() {
    return userData?.role === "admin" ? (
      <AboutUsSection 
        onSave={handleSaveAboutUs}
      />
    ) : (
      <div className="text-center py-8 sm:py-12">
        <IconInfo className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-slate-300" />
        <h3 className="text-base sm:text-lg font-semibold text-slate-600 mb-1 sm:mb-2">غير مصرح بالوصول</h3>
        <p className="text-slate-500 text-sm sm:text-base">الصفحة متاحة فقط لمدير النظام</p>
      </div>
    );
  }
}