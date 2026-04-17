// src/components/Admin/ServiceRequests.js
import { useState, useEffect, useCallback, useMemo } from "react";
import { db } from "../../firebase";
import { 
  collection, getDocs, query, orderBy, 
  updateDoc, doc, deleteDoc, serverTimestamp,
  where
} from "firebase/firestore";
import {
  IconPhone, IconWhatsApp, 
  IconX, IconEye, IconTrash, IconRefresh, IconSearch,
  IconFilter, IconStar,
  IconUser,
  IconCalendar, IconMessage, IconAlertCircle,
  IconChevronDown, IconChevronUp,
  IconClipboardList} from "../Icons";

// ServiceRequests Component
export default function ServiceRequests({ showNotification: externalShowNotification, onRefresh }) {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [timeFilter, setTimeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [contactMethodFilter, setContactMethodFilter] = useState("all");
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isOpeningWhatsApp, setIsOpeningWhatsApp] = useState(false);

  const showNotification = useCallback((type, message) => {
    if (externalShowNotification && typeof externalShowNotification === 'function') {
      externalShowNotification(type, message);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
      if (type === 'error') {
        alert(`خطأ: ${message}`);
      } else if (type === 'success') {
        alert(`تم: ${message}`);
      }
    }
  }, [externalShowNotification]);

  // كشف حجم الشاشة
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // دالة لإضافة فواصل بين كل 3 أرقام
  const formatPhoneNumberWithSpaces = (phone) => {
    if (!phone) return '';
    
    // إزالة جميع الأحرف غير الأرقام
    let cleaned = phone.toString().replace(/\D/g, '');
    
    // إذا كان الرقم يبدأ بـ 0، قم بإزالته مؤقتاً للمعالجة
    let hadLeadingZero = cleaned.startsWith('0');
    if (hadLeadingZero) {
      cleaned = cleaned.substring(1);
    }
    
    // إزالة أي أصفار إضافية في البداية
    while (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    
    // تنسيق الرقم حسب البادئة مع إضافة فواصل بين كل 3 أرقام
    let formattedNumber = '';
    
    if (cleaned.startsWith('972')) {
      // رقم فلسطيني مع مفتاح 972 - تنسيق +972 XXX XXX XXX
      const countryCode = cleaned.substring(0, 3);
      const rest = cleaned.substring(3);
      const parts = rest.match(/.{1,3}/g);
      formattedNumber = `+${countryCode} ${parts ? parts.join(' ') : rest}`;
    } 
    else if (cleaned.startsWith('970')) {
      // رقم فلسطيني مع مفتاح 970
      const countryCode = cleaned.substring(0, 3);
      const rest = cleaned.substring(3);
      const parts = rest.match(/.{1,3}/g);
      formattedNumber = `+${countryCode} ${parts ? parts.join(' ') : rest}`;
    }
    else if (cleaned.startsWith('966')) {
      // رقم سعودي
      const countryCode = cleaned.substring(0, 3);
      const rest = cleaned.substring(3);
      const parts = rest.match(/.{1,3}/g);
      formattedNumber = `+${countryCode} ${parts ? parts.join(' ') : rest}`;
    }
    else if (cleaned.startsWith('962')) {
      // رقم أردني
      const countryCode = cleaned.substring(0, 3);
      const rest = cleaned.substring(3);
      const parts = rest.match(/.{1,3}/g);
      formattedNumber = `+${countryCode} ${parts ? parts.join(' ') : rest}`;
    }
    else if (cleaned.length === 9 || cleaned.length === 10) {
      // رقم محلي - تنسيق 0XXX XXX XXX
      const parts = cleaned.match(/.{1,3}/g);
      formattedNumber = `0${parts ? parts.join(' ') : cleaned}`;
    }
    else {
      // عرض الرقم كما هو مع إضافة + إذا كان يبدأ بمفتاح دولي
      if (cleaned.length > 9 && !cleaned.startsWith('0')) {
        const parts = cleaned.match(/.{1,3}/g);
        formattedNumber = `+${parts ? parts.join(' ') : cleaned}`;
      } else if (hadLeadingZero || cleaned.length <= 10) {
        const parts = cleaned.match(/.{1,3}/g);
        formattedNumber = `0${parts ? parts.join(' ') : cleaned}`;
      } else {
        const parts = cleaned.match(/.{1,3}/g);
        formattedNumber = parts ? parts.join(' ') : cleaned;
      }
    }
    
    return formattedNumber;
  };

  // دالة تنظيف رقم الهاتف للاتصال (بدون تنسيق)
  const getCleanPhoneNumber = (phone) => {
    if (!phone) return '';
    return phone.toString().replace(/\D/g, '');
  };

  // دالة تنظيف رقم الهاتف للواتساب
  const cleanPhoneNumber = (phone) => {
    if (!phone) return '';
    let cleaned = phone.toString().replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    while (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    if (!cleaned.startsWith('972') && !cleaned.startsWith('970')) {
      if (cleaned.startsWith('5') || cleaned.startsWith('59')) {
        cleaned = '972' + cleaned;
      } else if (cleaned.startsWith('7')) {
        cleaned = '962' + cleaned;
      } else if (cleaned.startsWith('1')) {
        cleaned = '966' + cleaned;
      } else {
        cleaned = '972' + cleaned;
      }
    }
    return cleaned;
  };

  // دالة لفتح واتساب
  const openWhatsAppChat = async (phoneNumber, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    if (!phoneNumber) {
      showNotification('error', 'رقم الهاتف غير موجود');
      return;
    }

    if (isOpeningWhatsApp) {
      showNotification('info', 'جاري فتح واتساب...');
      return;
    }

    setIsOpeningWhatsApp(true);

    try {
      const cleanNumber = cleanPhoneNumber(phoneNumber);
      const whatsappUrl = `https://wa.me/${cleanNumber}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      showNotification('success', `جاري فتح محادثة واتساب مع ${formatPhoneNumberWithSpaces(phoneNumber)}`);
    } catch (error) {
      console.error('خطأ في فتح واتساب:', error);
      try {
        const cleanNumber = cleanPhoneNumber(phoneNumber);
        const fallbackUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}`;
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
        showNotification('info', 'جاري فتح واتساب عبر الطريقة البديلة');
      } catch (fallbackError) {
        const cleanNumber = cleanPhoneNumber(phoneNumber);
        const manualUrl = `https://wa.me/${cleanNumber}`;
        if (window.confirm(`لا يمكن فتح واتساب تلقائياً. هل تريد نسخ الرابط لفتحه يدوياً؟\n${manualUrl}`)) {
          navigator.clipboard.writeText(manualUrl).then(() => {
            showNotification('success', 'تم نسخ الرابط بنجاح');
          }).catch(() => {
            showNotification('error', 'فشل نسخ الرابط');
          });
        }
      }
    } finally {
      setTimeout(() => {
        setIsOpeningWhatsApp(false);
      }, 3000);
    }
  };

  // دالة لفتح اتصال هاتفي
  const makePhoneCall = (phoneNumber, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    if (!phoneNumber) {
      showNotification('error', 'رقم الهاتف غير موجود');
      return;
    }
    
    try {
      let cleanNumber = phoneNumber.toString().replace(/\D/g, '');
      if (!cleanNumber.startsWith('0') && !cleanNumber.startsWith('972') && !cleanNumber.startsWith('970')) {
        if (cleanNumber.startsWith('5') || cleanNumber.startsWith('59')) {
          cleanNumber = '0' + cleanNumber;
        } else {
          cleanNumber = '0' + cleanNumber;
        }
      }
      const telUrl = `tel:${cleanNumber}`;
      window.location.href = telUrl;
      showNotification('info', `جاري الاتصال بالرقم ${formatPhoneNumberWithSpaces(phoneNumber)}`);
    } catch (error) {
      console.error('خطأ في فتح الاتصال:', error);
      showNotification('error', 'لا يمكن إجراء المكالمة من هذا الجهاز');
    }
  };

  // دالة للتعامل مع النقر على طريقة التواصل
  const handleContactMethodClick = (request, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    if (!request || !request.customerPhone) {
      showNotification('error', 'رقم الهاتف غير متوفر');
      return;
    }
    
    if (request.contactMethod === 'whatsapp') {
      openWhatsAppChat(request.customerPhone, event);
    } else {
      makePhoneCall(request.customerPhone, event);
    }
  };

  // دالة لنسخ رقم الهاتف
  const copyPhoneNumber = (phoneNumber, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    if (!phoneNumber) return;
    
    const cleanNumber = getCleanPhoneNumber(phoneNumber);
    navigator.clipboard.writeText(cleanNumber).then(() => {
      showNotification('success', 'تم نسخ رقم الهاتف بنجاح');
    }).catch(() => {
      showNotification('error', 'فشل نسخ الرقم');
    });
  };

  // خيارات الحالة
  const statusOptions = useMemo(() => [
    { value: 'all', label: 'جميع الحالات', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'contacted', label: 'تم التواصل', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: 'قيد التنفيذ', color: 'bg-purple-100 text-purple-800' },
    { value: 'completed', label: 'مكتمل', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'cancelled', label: 'ملغي', color: 'bg-red-100 text-red-800' }
  ], []);

  // خيارات الأولوية
  const priorityOptions = useMemo(() => [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'متوسط', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'مرتفع', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'عاجل', color: 'bg-red-100 text-red-800' }
  ], []);

  // خيارات طريقة التواصل
  const contactMethodOptions = useMemo(() => [
    { value: 'all', label: 'جميع الطرق' },
    { value: 'whatsapp', label: 'واتساب', icon: IconWhatsApp },
    { value: 'phone', label: 'اتصال هاتفي', icon: IconPhone }
  ], []);

  // خيارات الفترة الزمنية
  const timeOptions = useMemo(() => [
    { value: 'all', label: 'جميع الأوقات' },
    { value: 'today', label: 'اليوم' },
    { value: 'week', label: 'الأسبوع' },
    { value: 'month', label: 'الشهر' },
    { value: 'year', label: 'السنة' }
  ], []);

  // خيارات الترتيب
  const sortOptions = useMemo(() => [
    { value: 'newest', label: 'الأحدث أولاً' },
    { value: 'oldest', label: 'الأقدم أولاً' },
    { value: 'priority', label: 'حسب الأولوية' },
    { value: 'name', label: 'حسب الاسم' }
  ], []);

  // جلب طلبات الخدمات من Firebase
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      let q;
      
      if (timeFilter === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        q = query(
          collection(db, "service-requests"),
          where("timestamp", ">=", today),
          where("timestamp", "<", tomorrow),
          orderBy("timestamp", "desc")
        );
      } else if (timeFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        q = query(
          collection(db, "service-requests"),
          where("timestamp", ">=", weekAgo),
          orderBy("timestamp", "desc")
        );
      } else if (timeFilter === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        
        q = query(
          collection(db, "service-requests"),
          where("timestamp", ">=", monthAgo),
          orderBy("timestamp", "desc")
        );
      } else {
        q = query(
          collection(db, "service-requests"),
          orderBy("timestamp", "desc")
        );
      }
      
      const snapshot = await getDocs(q);
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || null,
        viewed: doc.data().viewed || false,
        priority: doc.data().priority || "medium",
        serviceName: doc.data().serviceName || doc.data().service || "خدمة غير محددة",
        customerName: doc.data().customerName || doc.data().name || "عميل",
        customerPhone: doc.data().customerPhone || doc.data().phone || "",
        contactMethod: doc.data().contactMethod || doc.data().preferredContact || "phone",
        category: doc.data().category || "",
        serviceId: doc.data().serviceId || "",
        message: doc.data().message || doc.data().notes || "",
        email: doc.data().email || "",
        additionalInfo: doc.data().additionalInfo || ""
      }));
      
      setRequests(requestsData);
      calculateStats(requestsData);
      
    } catch (error) {
      console.error("Error fetching service requests:", error);
      showNotification("error", "حدث خطأ في جلب طلبات الخدمات");
    } finally {
      setLoading(false);
    }
  }, [showNotification, timeFilter]);

  // تصفية وفرز الطلبات
  const filterAndSortRequests = useCallback(() => {
    if (!requests || !Array.isArray(requests)) {
      setFilteredRequests([]);
      return;
    }
    
    let filtered = [...requests];
    
    // التصفية حسب البحث
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(request => {
        return (
          request.customerName?.toLowerCase().includes(searchLower) ||
          request.customerPhone?.includes(searchTerm) ||
          request.serviceName?.toLowerCase().includes(searchLower) ||
          (request.category || '').toLowerCase().includes(searchLower) ||
          (request.message || '').toLowerCase().includes(searchLower) ||
          (request.email || '').toLowerCase().includes(searchLower)
        );
      });
    }
    
    // التصفية حسب الحالة
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    // التصفية حسب الأولوية
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(request => (request.priority || 'medium') === priorityFilter);
    }
    
    // التصفية حسب طريقة التواصل
    if (contactMethodFilter !== 'all') {
      filtered = filtered.filter(request => request.contactMethod === contactMethodFilter);
    }
    
    // التصفية حسب الفترة الزمنية (للمستخدمين الذين ليسوا في fetchRequests)
    if (timeFilter !== 'all') {
      const now = new Date();
      let startDate = new Date();
      switch (timeFilter) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }
      filtered = filtered.filter(request => {
        const requestDate = request.timestamp?.toDate ? request.timestamp.toDate() : new Date(request.timestamp);
        return requestDate >= startDate;
      });
    }
    
    // الترتيب
    filtered.sort((a, b) => {
      const dateA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
      const dateB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
      const priorityOrder = { 'urgent': 0, 'high': 1, 'medium': 2, 'low': 3 };
      
      switch (sortBy) {
        case 'newest':
          return dateB - dateA;
        case 'oldest':
          return dateA - dateB;
        case 'priority':
          return (priorityOrder[a.priority || 'medium'] || 2) - (priorityOrder[b.priority || 'medium'] || 2);
        case 'name':
          return (a.customerName || '').localeCompare(b.customerName || '');
        default:
          return 0;
      }
    });
    
    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter, priorityFilter, contactMethodFilter, timeFilter, sortBy]);

  // حساب الإحصائيات
  const calculateStats = (requestsData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = {
      total: requestsData.length,
      pending: requestsData.filter(r => r.status === 'pending').length,
      contacted: requestsData.filter(r => r.status === 'contacted').length,
      inProgress: requestsData.filter(r => r.status === 'in_progress' || r.status === 'in-progress').length,
      completed: requestsData.filter(r => r.status === 'completed').length,
      cancelled: requestsData.filter(r => r.status === 'cancelled').length,
      today: requestsData.filter(r => {
        const requestDate = new Date(r.timestamp);
        requestDate.setHours(0, 0, 0, 0);
        return requestDate.getTime() === today.getTime();
      }).length,
      unread: requestsData.filter(r => !r.viewed).length,
      highPriority: requestsData.filter(r => r.priority === 'high' || r.priority === 'urgent').length
    };
    
    setStats(stats);
  };

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    contacted: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    today: 0,
    unread: 0,
    highPriority: 0
  });

  // تحديث عند تغيير الفلاتر
  useEffect(() => {
    filterAndSortRequests();
  }, [filterAndSortRequests]);

  // جلب البيانات عند التحميل أو تغيير timeFilter
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // تحديث الإجراءات الجماعية
  useEffect(() => {
    setShowBulkActions(selectedRows.length > 0);
  }, [selectedRows]);

  // إغلاق الفلاتر عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFiltersDropdown && !event.target.closest('.filters-dropdown')) {
        setShowFiltersDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFiltersDropdown]);

  // تحديث حالة الطلب
  const handleStatusUpdate = async (requestId, newStatus, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    if (updatingStatusId === requestId) return;
    
    setUpdatingStatusId(requestId);
    
    try {
      const requestRef = doc(db, "service-requests", requestId);
      
      await updateDoc(requestRef, { 
        status: newStatus,
        updatedAt: serverTimestamp(),
        viewed: true
      });
      
      // تحديث الحالة المحلية
      const updatedRequests = requests.map(request => 
        request.id === requestId 
          ? { ...request, status: newStatus, viewed: true, updatedAt: new Date() } 
          : request
      );
      
      setRequests(updatedRequests);
      calculateStats(updatedRequests);
      
      showNotification('success', `تم تحديث حالة الطلب إلى: ${getStatusText(newStatus)}`);
      
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest(prev => ({ ...prev, status: newStatus }));
      }
      
      if (onRefresh) onRefresh();
      
    } catch (error) {
      console.error("Error updating request status:", error);
      showNotification('error', 'حدث خطأ في تحديث حالة الطلب');
    } finally {
      setTimeout(() => {
        setUpdatingStatusId(null);
      }, 500);
    }
  };

  // تحديث أولوية الطلب
  const handlePriorityUpdate = async (requestId, newPriority, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    try {
      const requestRef = doc(db, "service-requests", requestId);
      
      await updateDoc(requestRef, { 
        priority: newPriority,
        updatedAt: serverTimestamp()
      });
      
      const updatedRequests = requests.map(request => 
        request.id === requestId 
          ? { ...request, priority: newPriority, updatedAt: new Date() } 
          : request
      );
      
      setRequests(updatedRequests);
      calculateStats(updatedRequests);
      
      showNotification('success', `تم تحديث أولوية الطلب إلى: ${getPriorityText(newPriority)}`);
      
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest(prev => ({ ...prev, priority: newPriority }));
      }
      
    } catch (error) {
      console.error("Error updating request priority:", error);
      showNotification('error', 'حدث خطأ في تحديث أولوية الطلب');
    }
  };

  // حذف طلب
  const handleDeleteRequest = async (requestId, customerName, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    if (!window.confirm(`هل أنت متأكد من حذف طلب ${customerName || 'هذا الطلب'}؟`)) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, "service-requests", requestId));
      
      const updatedRequests = requests.filter(request => request.id !== requestId);
      setRequests(updatedRequests);
      calculateStats(updatedRequests);
      setSelectedRows(selectedRows.filter(id => id !== requestId));
      
      showNotification('success', 'تم حذف الطلب بنجاح');
      
      if (onRefresh) onRefresh();
      
    } catch (error) {
      console.error("Error deleting request:", error);
      showNotification('error', 'حدث خطأ في حذف الطلب');
    }
  };

  // حذف جماعي
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
    
    if (!window.confirm(`هل أنت متأكد من حذف ${selectedRows.length} طلب؟`)) {
      return;
    }
    
    try {
      const deletePromises = selectedRows.map(id => 
        deleteDoc(doc(db, "service-requests", id))
      );
      
      await Promise.all(deletePromises);
      
      const updatedRequests = requests.filter(request => !selectedRows.includes(request.id));
      setRequests(updatedRequests);
      calculateStats(updatedRequests);
      setSelectedRows([]);
      setShowBulkActions(false);
      
      showNotification('success', `تم حذف ${selectedRows.length} طلب بنجاح`);
      
      if (onRefresh) onRefresh();
      
    } catch (error) {
      console.error("Error bulk deleting requests:", error);
      showNotification('error', 'حدث خطأ في حذف الطلبات');
    }
  };

  // تحديث الحالة الجماعية
  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedRows.length === 0) return;
    
    try {
      const updatePromises = selectedRows.map(id => 
        updateDoc(doc(db, "service-requests", id), {
          status: newStatus,
          updatedAt: serverTimestamp(),
          viewed: true
        })
      );
      
      await Promise.all(updatePromises);
      
      const updatedRequests = requests.map(request => 
        selectedRows.includes(request.id) 
          ? { ...request, status: newStatus, viewed: true, updatedAt: new Date() } 
          : request
      );
      
      setRequests(updatedRequests);
      calculateStats(updatedRequests);
      
      showNotification('success', `تم تحديث حالة ${selectedRows.length} طلب إلى "${getStatusText(newStatus)}"`);
      
    } catch (error) {
      console.error("Error bulk updating status:", error);
      showNotification('error', 'حدث خطأ في تحديث حالة الطلبات');
    }
  };

  // تعيين كمقروء
  const handleMarkAsViewed = async (requestId) => {
    try {
      const requestRef = doc(db, "service-requests", requestId);
      await updateDoc(requestRef, { 
        viewed: true,
        updatedAt: serverTimestamp()
      });
      
      const updatedRequests = requests.map(request => 
        request.id === requestId 
          ? { ...request, viewed: true, updatedAt: new Date() } 
          : request
      );
      
      setRequests(updatedRequests);
      calculateStats(updatedRequests);
      
    } catch (error) {
      console.error("Error marking as viewed:", error);
    }
  };


  // تحديد/إلغاء تحديد صف
  const toggleRowSelection = (requestId) => {
    setSelectedRows(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  // تحديد/إلغاء تحديد الكل
  const toggleSelectAll = () => {
    if (selectedRows.length === filteredRequests.length && filteredRequests.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredRequests.map(r => r.id));
    }
  };

  // توسيع/طي صف
  const toggleRowExpand = (requestId) => {
    setExpandedRows(prev => ({
      ...prev,
      [requestId]: !prev[requestId]
    }));
  };

  // إعادة تعيين جميع الفلاتر
  const resetAllFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setContactMethodFilter("all");
    setTimeFilter("all");
    setSearchTerm("");
    setSortBy("newest");
    showNotification("info", "تم إعادة تعيين جميع الفلاتر");
  };

  // عرض إجمالي الفلاتر المطبقة
  const getAppliedFiltersCount = () => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (priorityFilter !== 'all') count++;
    if (contactMethodFilter !== 'all') count++;
    if (timeFilter !== 'all') count++;
    if (searchTerm.trim() !== '') count++;
    if (sortBy !== 'newest') count++;
    return count;
  };

  // تنسيق التاريخ
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '';
    }
  };

  const formatDateMobile = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('ar-SA', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '';
    }
  };

  // الحصول على لون الحالة
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // الحصول على نص الحالة
  const getStatusText = (status) => {
    const statusMap = {
      pending: 'قيد الانتظار',
      contacted: 'تم التواصل',
      in_progress: 'قيد التنفيذ',
      completed: 'مكتمل',
      cancelled: 'ملغي'
    };
    return statusMap[status] || status;
  };

  // الحصول على لون الأولوية
  const getPriorityColor = (priority) => {
    const prio = priority || 'medium';
    switch(prio) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  // الحصول على نص الأولوية
  const getPriorityText = (priority) => {
    const prio = priority || 'medium';
    const priorityMap = {
      low: 'منخفض',
      medium: 'متوسط',
      high: 'مرتفع',
      urgent: 'عاجل'
    };
    return priorityMap[prio] || 'متوسط';
  };

  // الحصول على نص طريقة التواصل
  const getContactMethodLabel = (method) => {
    const labels = {
      whatsapp: 'واتساب',
      phone: 'اتصال'
    };
    return labels[method] || method;
  };

  // مكون عرض طريقة التواصل
  const ContactMethodDisplay = ({ request }) => {
    const method = request.contactMethod || 'whatsapp';
    const isWhatsApp = method === 'whatsapp';
    
    return (
      <button 
        onClick={(e) => handleContactMethodClick(request, e)} 
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm ${
          isWhatsApp ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
        title={isWhatsApp ? "فتح محادثة واتساب" : "اتصال هاتفي"}
      >
        {isWhatsApp ? <IconWhatsApp className="w-4 h-4" /> : <IconPhone className="w-4 h-4" />}
        {getContactMethodLabel(method)}
      </button>
    );
  };

  // مكون عرض معلومات الخدمة (بدون معرف الخدمة)
  const ServiceInfoDisplay = ({ request }) => {
    return (
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-slate-900">{request.serviceName || 'خدمة غير محددة'}</span>
        </div>
        <div className="text-xs text-slate-500 mt-1">{request.category || 'قسم غير محدد'}</div>
      </div>
    );
  };

  // مكون عرض معلومات العميل - مع عرض الرقم بفواصل بين كل 3 أرقام
  const CustomerInfoDisplay = ({ request }) => {
    const formattedPhone = formatPhoneNumberWithSpaces(request.customerPhone);
    return (
      <div>
        <div className="font-medium text-slate-900">{request.customerName}</div>
        <div className="text-xs text-slate-500 mt-0.5 font-mono" style={{ direction: 'ltr', unicodeBidi: 'embed' }}>
          {formattedPhone}
        </div>
      </div>
    );
  };

  // مكون تحديث الحالة داخل البطاقة
  const StatusUpdateSelect = ({ request }) => {
    const isUpdating = updatingStatusId === request.id;
    
    return (
      <select
        value={request.status}
        onChange={(e) => handleStatusUpdate(request.id, e.target.value)}
        className={`px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-indigo-500 ${getStatusColor(request.status)} cursor-pointer`}
        disabled={isUpdating}
      >
        <option value="pending">قيد الانتظار</option>
        <option value="contacted">تم التواصل</option>
        <option value="in_progress">قيد التنفيذ</option>
        <option value="completed">مكتمل</option>
        <option value="cancelled">ملغي</option>
      </select>
    );
  };

  // مكون تفاصيل الطلب - مودال
  const RequestDetailsModal = () => {
    if (!selectedRequest) return null;
    const formattedPhone = formatPhoneNumberWithSpaces(selectedRequest.customerPhone);
    
    // مكون تحديث الحالة داخل المودال
    const StatusUpdateSection = ({ request, onStatusChange }) => {
      const statusButtons = [
        { value: 'pending', label: 'قيد الانتظار', color: 'bg-yellow-500 hover:bg-yellow-600' },
        { value: 'contacted', label: 'تم التواصل', color: 'bg-blue-500 hover:bg-blue-600' },
        { value: 'in_progress', label: 'قيد التنفيذ', color: 'bg-purple-500 hover:bg-purple-600' },
        { value: 'completed', label: 'مكتمل', color: 'bg-emerald-500 hover:bg-emerald-600' },
        { value: 'cancelled', label: 'ملغي', color: 'bg-red-500 hover:bg-red-600' }
      ];

      const isUpdating = updatingStatusId === request.id;

      return (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
            <IconAlertCircle className="ml-2 w-5 h-5" /> حالة الطلب
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {statusButtons.map((status) => (
              <button
                key={status.value}
                onClick={(e) => onStatusChange(request.id, status.value, e)}
                disabled={isUpdating}
                className={`px-3 py-2 rounded-lg text-white text-sm font-medium transition-all transform hover:scale-105 ${
                  status.color
                } ${request.status === status.value ? 'ring-2 ring-offset-2 ring-slate-400 scale-105' : ''} ${
                  isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUpdating && updatingStatusId === request.id ? 'جاري...' : status.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            الحالة الحالية: <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
              {getStatusText(request.status)}
            </span>
          </p>
        </div>
      );
    };
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">تفاصيل الطلب</h2>
            <button onClick={() => setShowDetails(false)} className="p-1 hover:bg-slate-100 rounded-lg">
              <IconX className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Customer Info */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                <IconUser className="ml-2 w-5 h-5" /> معلومات العميل
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-500 mb-1">الاسم</label>
                  <p className="font-medium text-slate-900">{selectedRequest.customerName}</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">رقم الهاتف</label>
                  <p className="font-mono text-sm text-slate-600 mb-2" style={{ direction: 'ltr', unicodeBidi: 'embed' }}>
                    {formattedPhone}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={(e) => handleContactMethodClick(selectedRequest, e)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm ${
                        selectedRequest.contactMethod === 'whatsapp' 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {selectedRequest.contactMethod === 'whatsapp' ? (
                        <IconWhatsApp className="w-4 h-4" />
                      ) : (
                        <IconPhone className="w-4 h-4" />
                      )}
                      {selectedRequest.contactMethod === 'whatsapp' ? 'واتساب' : 'اتصال'}
                    </button>
                    <button
                      onClick={(e) => copyPhoneNumber(selectedRequest.customerPhone, e)}
                      className="p-1.5 text-slate-500 hover:text-slate-700 bg-white rounded-lg border border-slate-200"
                      title="نسخ الرقم"
                    >
                      <IconClipboardList className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {selectedRequest.email && (
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">البريد الإلكتروني</label>
                    <p className="font-medium text-slate-900 truncate">{selectedRequest.email}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm text-slate-500 mb-1">طريقة التواصل</label>
                  <ContactMethodDisplay request={selectedRequest} />
                </div>
              </div>
            </div>
            
            {/* Status Update Section */}
            <StatusUpdateSection request={selectedRequest} onStatusChange={handleStatusUpdate} />
            
            {/* Priority Update Section */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                <IconStar className="ml-2 w-5 h-5" /> أولوية الطلب
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={(e) => handlePriorityUpdate(selectedRequest.id, 'low', e)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                    selectedRequest.priority === 'low' 
                      ? 'bg-gray-500 text-white ring-2 ring-offset-2 ring-gray-400 scale-105' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  منخفض
                </button>
                <button
                  onClick={(e) => handlePriorityUpdate(selectedRequest.id, 'medium', e)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                    selectedRequest.priority === 'medium' 
                      ? 'bg-blue-500 text-white ring-2 ring-offset-2 ring-blue-400 scale-105' 
                      : 'bg-blue-200 text-blue-700 hover:bg-blue-300'
                  }`}
                >
                  متوسط
                </button>
                <button
                  onClick={(e) => handlePriorityUpdate(selectedRequest.id, 'high', e)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                    selectedRequest.priority === 'high' 
                      ? 'bg-orange-500 text-white ring-2 ring-offset-2 ring-orange-400 scale-105' 
                      : 'bg-orange-200 text-orange-700 hover:bg-orange-300'
                  }`}
                >
                  مرتفع
                </button>
                <button
                  onClick={(e) => handlePriorityUpdate(selectedRequest.id, 'urgent', e)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                    selectedRequest.priority === 'urgent' 
                      ? 'bg-red-500 text-white ring-2 ring-offset-2 ring-red-400 scale-105' 
                      : 'bg-red-200 text-red-700 hover:bg-red-300'
                  }`}
                >
                  عاجل
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-3">
                الأولوية الحالية: <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                  {getPriorityText(selectedRequest.priority)}
                </span>
              </p>
            </div>
            
            {/* Service Info - بدون معرف الخدمة */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                <IconClipboardList className="ml-2 w-5 h-5" /> معلومات الخدمة
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-slate-500 mb-1">اسم الخدمة</label>
                  <p className="font-medium text-slate-900">{selectedRequest.serviceName || 'غير محدد'}</p>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">القسم</label>
                  <p className="font-medium text-slate-900">{selectedRequest.category || 'غير محدد'}</p>
                </div>
              </div>
            </div>
            
            {/* Message */}
            {selectedRequest.message && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                  <IconMessage className="ml-2 w-5 h-5" /> الرسالة
                </h3>
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {selectedRequest.message}
                  </p>
                </div>
              </div>
            )}
            
            {/* Additional Info */}
            {selectedRequest.additionalInfo && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">معلومات إضافية</h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {selectedRequest.additionalInfo}
                  </p>
                </div>
              </div>
            )}
            
            {/* Timestamps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <label className="block text-sm text-slate-500 mb-1">
                  <IconCalendar className="ml-2 w-4 h-4 inline" /> تاريخ الطلب
                </label>
                <p className="font-medium text-slate-900">{formatDate(selectedRequest.timestamp)}</p>
              </div>
              {selectedRequest.updatedAt && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <label className="block text-sm text-slate-500 mb-1">آخر تحديث</label>
                  <p className="font-medium text-slate-900">{formatDate(selectedRequest.updatedAt)}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex-1 min-w-[120px]"
              >
                إغلاق
              </button>
              <button
                onClick={(e) => {
                  handleDeleteRequest(selectedRequest.id, selectedRequest.customerName, e);
                  setShowDetails(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex-1 min-w-[120px] flex items-center justify-center gap-2"
              >
                <IconTrash className="w-5 h-5" /> حذف الطلب
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="text-center sm:text-right">
            <h2 className="text-2xl font-bold text-slate-900">طلبات الخدمات</h2>
            <p className="text-slate-600 mt-1">إدارة وتتبع جميع طلبات الخدمات من العملاء</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={resetAllFilters}
              className="w-full sm:w-auto px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center"
            >
              <IconFilter className="ml-2 w-5 h-5" />إعادة تعيين الفلاتر
            </button>
            <button
              onClick={fetchRequests}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all flex items-center justify-center disabled:opacity-50"
            >
              <IconRefresh className={`ml-2 w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-4 text-white">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm opacity-90">إجمالي الطلبات</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
            <div className="text-2xl font-bold">{stats.today}</div>
            <div className="text-sm opacity-90">طلبات اليوم</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-sm opacity-90">قيد الانتظار</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 text-white">
            <div className="text-2xl font-bold">{stats.highPriority}</div>
            <div className="text-sm opacity-90">أولوية عالية</div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <IconSearch className="text-slate-400 w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث بالاسم أو الهاتف أو الخدمة..."
              className="pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full transition-all"
            />
          </div>
          
          {/* Advanced Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative filters-dropdown">
              <button
                onClick={() => setShowFiltersDropdown(!showFiltersDropdown)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-100 transition-all flex items-center justify-between"
              >
                <span className="flex items-center">
                  <IconFilter className="ml-2 w-5 h-5" />
                  {getAppliedFiltersCount() > 0 && (
                    <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">
                      {getAppliedFiltersCount()}
                    </span>
                  )} فلترة متقدمة
                </span>
                <IconChevronDown className="w-4 h-4" />
              </button>
              {showFiltersDropdown && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-slate-200 z-50 p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">حالة الطلب</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">الأولوية</label>
                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    >
                      {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">طريقة التواصل</label>
                    <select
                      value={contactMethodFilter}
                      onChange={(e) => setContactMethodFilter(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    >
                      {contactMethodOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">الفترة الزمنية</label>
                    <select
                      value={timeFilter}
                      onChange={(e) => setTimeFilter(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    >
                      {timeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">الترتيب حسب</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <button
                      onClick={resetAllFilters}
                      className="w-full px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      إعادة تعيين جميع الفلاتر
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Active Filters Display */}
            <div className="sm:col-span-2">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-slate-600">الفلاتر المطبقة:</span>
                {statusFilter !== 'all' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center">
                    {statusOptions.find(o => o.value === statusFilter)?.label}
                    <button onClick={() => setStatusFilter('all')} className="mr-1 text-blue-600 hover:text-blue-800">
                      <IconX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {priorityFilter !== 'all' && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm flex items-center">
                    {priorityOptions.find(o => o.value === priorityFilter)?.label}
                    <button onClick={() => setPriorityFilter('all')} className="mr-1 text-orange-600 hover:text-orange-800">
                      <IconX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {contactMethodFilter !== 'all' && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center">
                    {contactMethodFilter === 'whatsapp' ? (
                      <IconWhatsApp className="w-3 h-3 ml-1" />
                    ) : (
                      <IconPhone className="w-3 h-3 ml-1" />
                    )}
                    {contactMethodOptions.find(o => o.value === contactMethodFilter)?.label}
                    <button onClick={() => setContactMethodFilter('all')} className="mr-1 text-green-600 hover:text-green-800">
                      <IconX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {timeFilter !== 'all' && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center">
                    <IconCalendar className="w-3 h-3 ml-1" />
                    {timeOptions.find(o => o.value === timeFilter)?.label}
                    <button onClick={() => setTimeFilter('all')} className="mr-1 text-purple-600 hover:text-purple-800">
                      <IconX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {sortBy !== 'newest' && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm flex items-center">
                    ترتيب: {sortOptions.find(o => o.value === sortBy)?.label}
                    <button onClick={() => setSortBy('newest')} className="mr-1 text-slate-600 hover:text-slate-800">
                      <IconX className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchTerm.trim() !== '' && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-sm flex items-center">
                    بحث: {searchTerm.length > 10 ? `${searchTerm.substring(0, 10)}...` : searchTerm}
                    <button onClick={() => setSearchTerm('')} className="mr-1 text-slate-600 hover:text-slate-800">
                      <IconX className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bulk Actions */}
      {showBulkActions && (
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-orange-500 text-white rounded-lg">
                {selectedRows.length} طلب محدد
              </div>
              <button onClick={() => setSelectedRows([])} className="text-orange-600 hover:text-orange-800">إلغاء التحديد</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => handleBulkStatusUpdate('contacted')} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">تم التواصل</button>
              <button onClick={() => handleBulkStatusUpdate('in_progress')} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">قيد التنفيذ</button>
              <button onClick={() => handleBulkStatusUpdate('completed')} className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">مكتمل</button>
              <button onClick={() => handleBulkStatusUpdate('cancelled')} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">ملغي</button>
              <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors">حذف</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-visible">
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-200 gap-3">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedRows.length === filteredRequests.length && filteredRequests.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
            />
            <span className="text-sm text-slate-600">عرض {filteredRequests.length} من {requests.length} طلب</span>
          </div>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">جاري تحميل الطلبات...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-block p-3 bg-slate-100 rounded-full mb-4">
              <IconClipboardList className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">لا توجد طلبات</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              {getAppliedFiltersCount() > 0 ? 'لم نتمكن من العثور على طلبات تطابق فلاترك' : 'لا توجد طلبات خدمة حالياً'}
            </p>
          </div>
        ) : isMobileView ? (
          /* Mobile View - Cards */
          <div className="p-4">
            {filteredRequests.map((request) => (
              <div 
                key={request.id} 
                className={`mb-3 p-3 border border-slate-200 rounded-lg ${
                  !request.viewed ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(request.id)}
                      onChange={() => toggleRowSelection(request.id)}
                      className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500 mt-1"
                    />
                    <CustomerInfoDisplay request={request} />
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleRowExpand(request.id)} className="p-1">
                      {expandedRows[request.id] ? <IconChevronUp className="w-4 h-4" /> : <IconChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="col-span-2">
                    <div className="text-xs text-slate-500 mb-1">الخدمة</div>
                    <ServiceInfoDisplay request={request} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">طريقة التواصل</div>
                    <ContactMethodDisplay request={request} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">الحالة</div>
                    <StatusUpdateSelect request={request} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">الأولوية</div>
                    <select
                      value={request.priority || 'medium'}
                      onChange={(e) => handlePriorityUpdate(request.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-indigo-500 cursor-pointer ${getPriorityColor(request.priority || 'medium')}`}
                    >
                      <option value="low">منخفض</option>
                      <option value="medium">متوسط</option>
                      <option value="high">مرتفع</option>
                      <option value="urgent">عاجل</option>
                    </select>
                  </div>
                </div>
                
                <div className="text-xs text-slate-500 mb-2">
                  {formatDateMobile(request.timestamp)}
                </div>
                
                {/* Expanded Content */}
                {expandedRows[request.id] && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="space-y-3">
                      {request.message && (
                        <div>
                          <div className="text-xs text-slate-500 mb-1">الرسالة</div>
                          <div className="text-sm text-slate-700 bg-slate-50 p-2 rounded">
                            {request.message.length > 100 ? `${request.message.substring(0, 100)}...` : request.message}
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetails(true);
                            if (!request.viewed) {
                              handleMarkAsViewed(request.id);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm"
                        >
                          عرض التفاصيل
                        </button>
                        <button
                          onClick={(e) => handleDeleteRequest(request.id, request.customerName, e)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg"
                        >
                          <IconTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Quick Actions */}
                {!expandedRows[request.id] && (
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetails(true);
                          if (!request.viewed) {
                            handleMarkAsViewed(request.id);
                          }
                        }}
                        className="p-1.5 text-indigo-600 hover:text-indigo-800"
                        title="عرض التفاصيل"
                      >
                        <IconEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteRequest(request.id, request.customerName, e)}
                        className="p-1.5 text-red-600 hover:text-red-800"
                        title="حذف"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Desktop View - Table */
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider w-12">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === filteredRequests.length && filteredRequests.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider min-w-[150px]">العميل</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider min-w-[200px]">الخدمة</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider min-w-[100px]">طريقة التواصل</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">الحالة</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider min-w-[100px]">الأولوية</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">تاريخ الطلب</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider min-w-[100px]">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className={`hover:bg-slate-50 transition-colors ${!request.viewed ? 'bg-gradient-to-r from-orange-50 to-orange-100' : ''}`}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(request.id)}
                        onChange={() => toggleRowSelection(request.id)}
                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <CustomerInfoDisplay request={request} />
                    </td>
                    <td className="px-6 py-4">
                      <ServiceInfoDisplay request={request} />
                    </td>
                    <td className="px-6 py-4">
                      <ContactMethodDisplay request={request} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusUpdateSelect request={request} />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={request.priority || 'medium'}
                        onChange={(e) => handlePriorityUpdate(request.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-indigo-500 cursor-pointer ${getPriorityColor(request.priority || 'medium')}`}
                      >
                        <option value="low">منخفض</option>
                        <option value="medium">متوسط</option>
                        <option value="high">مرتفع</option>
                        <option value="urgent">عاجل</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">
                        {formatDate(request.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetails(true);
                            if (!request.viewed) {
                              handleMarkAsViewed(request.id);
                            }
                          }}
                          className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <IconEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteRequest(request.id, request.customerName, e)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="حذف"
                        >
                          <IconTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Request Details Modal */}
      {showDetails && <RequestDetailsModal />}
    </div>
  );
}