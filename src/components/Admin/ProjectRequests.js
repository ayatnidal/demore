// src/components/Admin/ProjectRequests.js
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  IconPhone,
  IconWhatsApp,
  IconClipboardList,
  IconTrash,
  IconSearch,
  IconEye,
  IconX,
  IconChevronDown,
  IconChevronUp,
  IconFilter,
  IconRefresh,
  IconCalendar,
  IconUser,
  IconStar,
  IconMessage,
  IconAlertCircle,
  IconExternalLink
} from "../Icons";

const ProjectRequests = ({
  projectRequests,
  onStatusUpdate,
  onContact,
  onDelete,
  userData,
  showNotification: externalShowNotification,
  onRefresh,
  onViewProject
}) => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [contactMethodFilter, setContactMethodFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedRows, setExpandedRows] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showFiltersDropdown, setShowFiltersDropdown] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isOpeningWhatsApp, setIsOpeningWhatsApp] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [updatingPriorityId, setUpdatingPriorityId] = useState(null);

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

  const cleanPhoneNumber = (phone) => {
    if (!phone) return '';
    let cleaned = phone.replace(/\D/g, '');
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
      showNotification('success', `جاري فتح محادثة واتساب مع ${phoneNumber}`);
      
      if (onContact && typeof onContact === 'function') {
        onContact(phoneNumber, 'whatsapp');
      }
    } catch (error) {
      console.error('خطأ في فتح واتساب:', error);
      try {
        const cleanNumber = cleanPhoneNumber(phoneNumber);
        const fallbackUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}`;
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
        showNotification('info', 'جاري فتح واتساب عبر الطريقة البديلة');
      } catch (fallbackError) {
        console.error('خطأ في المحاولة البديلة:', fallbackError);
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
      let cleanNumber = phoneNumber.replace(/\D/g, '');
      if (!cleanNumber.startsWith('0') && !cleanNumber.startsWith('972') && !cleanNumber.startsWith('970')) {
        if (cleanNumber.startsWith('5') || cleanNumber.startsWith('59')) {
          cleanNumber = '0' + cleanNumber;
        } else {
          cleanNumber = '0' + cleanNumber;
        }
      }
      const telUrl = `tel:${cleanNumber}`;
      window.location.href = telUrl;
      showNotification('info', `جاري الاتصال بالرقم ${phoneNumber}`);
      
      if (onContact && typeof onContact === 'function') {
        onContact(phoneNumber, 'phone');
      }
    } catch (error) {
      console.error('خطأ في فتح الاتصال:', error);
      showNotification('error', 'لا يمكن إجراء المكالمة من هذا الجهاز');
    }
  };

  const handleWhatsAppClick = (request, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    if (!request || !request.customerPhone) {
      showNotification('error', 'رقم الهاتف غير متوفر');
      return;
    }
    
    openWhatsAppChat(request.customerPhone, event);
  };

  const handlePhoneClick = (request, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    if (!request || !request.customerPhone) {
      showNotification('error', 'رقم الهاتف غير متوفر');
      return;
    }
    
    makePhoneCall(request.customerPhone, event);
  };

  const copyPhoneNumber = (phoneNumber, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    if (!phoneNumber) return;
    
    navigator.clipboard.writeText(phoneNumber).then(() => {
      showNotification('success', 'تم نسخ رقم الهاتف بنجاح');
    }).catch(() => {
      showNotification('error', 'فشل نسخ الرقم');
    });
  };

  const handleViewProject = (request, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    if (!request) return;
    
    let projectUrl = null;
    
    if (request.projectUrl) {
      projectUrl = request.projectUrl;
    }
    else if (request.projectLink) {
      projectUrl = request.projectLink;
    }
    else if (request.projectId) {
      projectUrl = `/project/${request.projectId}`;
    }
    else if (request.projectName) {
      const projectNameStr = typeof request.projectName === 'object'  
        ? (request.projectName.en || request.projectName.ar || '') 
        : request.projectName;
      const slug = projectNameStr.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      projectUrl = `/project/${slug}`;
    }
    
    if (projectUrl) {
      if (onViewProject && typeof onViewProject === 'function') {
        onViewProject(request);
      } else {
        window.open(projectUrl, '_blank', 'noopener,noreferrer');
      }
      showNotification('success', `جاري فتح صفحة المشروع: ${getProjectDisplayName(request)}`);
    } else {
      showNotification('error', 'لا يوجد رابط متاح لهذا المشروع');
    }
  };

  const getProjectDisplayName = (request) => {
    if (!request) return '';
    if (typeof request.projectName === 'object') {
      return request.projectName.ar || request.projectName.en || 'مشروع غير محدد';
    }
    return request.projectName || 'مشروع غير محدد';
  };

  const getProjectInfo = (request) => {
    const projectName = typeof request.projectName === 'object'   
      ? (request.projectName.ar || request.projectName.en || '')   
      : (request.projectName || '');
    
    const projectId = request.projectId || 'غير محدد';
    const projectType = request.category || request.projectType || 'غير محدد';
    
    let projectUrl = null;
    if (request.projectUrl) {
      projectUrl = request.projectUrl;
    } else if (request.projectLink) {
      projectUrl = request.projectLink;
    } else if (request.projectId && request.projectId !== 'غير محدد') {
      projectUrl = `/project/${request.projectId}`;
    }
    
    return {
      name: projectName,
      id: projectId,
      type: projectType,
      description: request.message || 'لا يوجد وصف',
      similarTo: request.similarTo || null,
      url: projectUrl,
      slug: request.projectSlug || null
    };
  };

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const statusOptions = useMemo(() => [
    { value: 'all', label: 'جميع الحالات', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'contacted', label: 'تم التواصل', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: 'قيد التنفيذ', color: 'bg-purple-100 text-purple-800' },
    { value: 'completed', label: 'مكتمل', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'cancelled', label: 'ملغي', color: 'bg-red-100 text-red-800' }
  ], []);
    
  const priorityOptions = useMemo(() => [
    { value: 'all', label: 'جميع الأولويات' },
    { value: 'low', label: 'منخفض', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'متوسط', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'مرتفع', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'عاجل', color: 'bg-red-100 text-red-800' }
  ], []);
    
  const contactMethodOptions = useMemo(() => [
    { value: 'all', label: 'جميع الطرق' },
    { value: 'whatsapp', label: 'واتساب', icon: IconWhatsApp },
    { value: 'phone', label: 'اتصال هاتفي', icon: IconPhone }
  ], []);
    
  const timeOptions = useMemo(() => [
    { value: 'all', label: 'جميع الأوقات' },
    { value: 'today', label: 'اليوم' },
    { value: 'week', label: 'الأسبوع' },
    { value: 'month', label: 'الشهر' },
    { value: 'year', label: 'السنة' }
  ], []);
    
  const sortOptions = useMemo(() => [
    { value: 'newest', label: 'الأحدث أولاً' },
    { value: 'oldest', label: 'الأقدم أولاً' },
    { value: 'priority', label: 'حسب الأولوية' },
    { value: 'name', label: 'حسب الاسم' }
  ], []);

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

  const filterAndSortRequests = useCallback(() => {
    if (!projectRequests || !Array.isArray(projectRequests)) {
      setFilteredRequests([]);
      return;
    }
      
    let filtered = [...projectRequests];
     
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(request => {
        const projectName = typeof request.projectName === 'object'   
          ? (request.projectName.ar || request.projectName.en || '')   
          : (request.projectName || '');
        return (
          request.customerName?.toLowerCase().includes(searchLower) ||
          request.customerPhone?.includes(searchTerm) ||
          projectName.toLowerCase().includes(searchLower) ||
          (request.category || request.projectType || '').toLowerCase().includes(searchLower) ||
          (request.message || '').toLowerCase().includes(searchLower) ||
          (request.email || '').toLowerCase().includes(searchLower) ||
          (request.projectId || '').toLowerCase().includes(searchLower)
        );
      });
    }
     
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
     
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(request => (request.priority || 'medium') === priorityFilter);
    }
     
    if (contactMethodFilter !== 'all') {
      filtered = filtered.filter(request => request.contactMethod === contactMethodFilter);
    }
     
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
  }, [projectRequests, searchTerm, statusFilter, priorityFilter, contactMethodFilter, timeFilter, sortBy]);

  useEffect(() => {
    filterAndSortRequests();
  }, [filterAndSortRequests]);

  useEffect(() => {
    setShowBulkActions(selectedRows.length > 0);
  }, [selectedRows]);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) return;
      
    if (!window.confirm(`هل أنت متأكد من حذف ${selectedRows.length} طلب؟`)) {
      return;
    }
      
    try {
      const deletePromises = selectedRows.map(id => onDelete(id));
      await Promise.all(deletePromises);
      setSelectedRows([]);
      showNotification('success', `تم حذف ${selectedRows.length} طلب بنجاح`);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("خطأ في الحذف الجماعي:", error);
      showNotification('error', 'حدث خطأ في حذف الطلبات');
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedRows.length === 0) return;
    
    if (!window.confirm(`هل أنت متأكد من تحديث حالة ${selectedRows.length} طلب إلى "${getStatusText(newStatus)}"؟`)) {
      return;
    }
    
    try {
      const updatePromises = selectedRows.map(id => onStatusUpdate(id, newStatus));
      await Promise.all(updatePromises);
      setSelectedRows([]);
      showNotification('success', `تم تحديث حالة ${selectedRows.length} طلب إلى "${getStatusText(newStatus)}"`);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("خطأ في التحديث الجماعي:", error);
      showNotification('error', 'حدث خطأ في تحديث حالة الطلبات');
    }
  };

  const handleDelete = async (requestId, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
      
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
      return;
    }
      
    try {
      await onDelete(requestId);
      showNotification('success', 'تم حذف الطلب بنجاح');
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("خطأ في الحذف:", error);
      showNotification('error', 'حدث خطأ في حذف الطلب');
    }
  };

  // تحديث حالة الطلب
  const handleStatusChange = async (requestId, newStatus, event) => {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    if (updatingStatusId === requestId) return;
    
    setUpdatingStatusId(requestId);
    
    try {
      if (onStatusUpdate && typeof onStatusUpdate === 'function') {
        await onStatusUpdate(requestId, newStatus);
        showNotification('success', `تم تحديث حالة الطلب إلى: ${getStatusText(newStatus)}`);
        if (onRefresh) onRefresh();
        
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      console.error("خطأ في تحديث الحالة:", error);
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
    
    if (updatingPriorityId === requestId) return;
    
    setUpdatingPriorityId(requestId);
    
    try {
      if (onStatusUpdate && typeof onStatusUpdate === 'function') {
        // Assuming onStatusUpdate can also handle priority updates
        // If you have a separate function for priority, use that instead
        await onStatusUpdate(requestId, undefined, newPriority);
        showNotification('success', `تم تحديث أولوية الطلب إلى: ${getPriorityText(newPriority)}`);
        if (onRefresh) onRefresh();
        
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest(prev => ({ ...prev, priority: newPriority }));
        }
      }
    } catch (error) {
      console.error("خطأ في تحديث الأولوية:", error);
      showNotification('error', 'حدث خطأ في تحديث أولوية الطلب');
    } finally {
      setTimeout(() => {
        setUpdatingPriorityId(null);
      }, 500);
    }
  };

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

  const getContactMethodLabel = (method) => {
    const labels = {
      whatsapp: 'واتساب',
      phone: 'اتصال'
    };
    return labels[method] || method;
  };

  const stats = useMemo(() => ({
    total: projectRequests?.length || 0,
    pending: projectRequests?.filter(r => r.status === 'pending').length || 0,
    contacted: projectRequests?.filter(r => r.status === 'contacted').length || 0,
    inProgress: projectRequests?.filter(r => r.status === 'in_progress').length || 0,
    completed: projectRequests?.filter(r => r.status === 'completed').length || 0,
    cancelled: projectRequests?.filter(r => r.status === 'cancelled').length || 0,
    today: projectRequests?.filter(r => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const requestDate = r.timestamp?.toDate ? r.timestamp.toDate() : new Date(r.timestamp);
      requestDate.setHours(0, 0, 0, 0);
      return requestDate.getTime() === today.getTime();
    }).length || 0,
    highPriority: projectRequests?.filter(r => r.priority === 'high' || r.priority === 'urgent').length || 0
  }), [projectRequests]);

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

  const resetAllFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setContactMethodFilter("all");
    setTimeFilter("all");
    setSearchTerm("");
    setSortBy("newest");
    showNotification("info", "تم إعادة تعيين جميع الفلاتر");
  };

  const toggleRowSelection = (requestId) => {
    setSelectedRows(prev => 
      prev.includes(requestId) 
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredRequests.length && filteredRequests.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredRequests.map(r => r.id));
    }
  };

  const toggleRowExpand = (requestId) => {
    setExpandedRows(prev => ({
      ...prev,
      [requestId]: !prev[requestId]
    }));
  };

  // مكون عرض طريقة التواصل
  const ContactMethodDisplay = ({ request }) => {
    const method = request.contactMethod || 'whatsapp';
    const isWhatsApp = method === 'whatsapp';
      
    return (
      <button 
        onClick={(e) => isWhatsApp ? handleWhatsAppClick(request, e) : handlePhoneClick(request, e)} 
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

  // مكون عرض معلومات المشروع
  const ProjectInfoDisplay = ({ request }) => {
    const projectInfo = getProjectInfo(request);
    const hasUrl = projectInfo.url || projectInfo.id !== 'غير محدد';
     
    return (
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-slate-900">{projectInfo.name || 'مشروع غير محدد'}</span>
          {hasUrl && (
            <button 
              onClick={(e) => handleViewProject(request, e)} 
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md text-xs hover:bg-indigo-100 transition-colors" 
              title="عرض المشروع"
            >
              <IconExternalLink className="w-3 h-3" />
              <span>رابط المشروع</span>
            </button>
          )}
        </div>
        <div className="text-xs text-slate-500 mt-1">{projectInfo.type}</div>
        {projectInfo.similarTo && (
          <div className="text-xs text-orange-600 mt-1">مشابه لـ: {projectInfo.similarTo}</div>
        )}
      </div>
    );
  };

  // مكون عرض معلومات العميل - مع إصلاح عرض الرقم
  const CustomerInfoDisplay = ({ request }) => {
    return (
      <div>
        <div className="font-medium text-slate-900">{request.customerName}</div>
        <div className="text-xs text-slate-500 mt-0.5" style={{ direction: 'ltr', unicodeBidi: 'embed', display: 'inline-block' }}>
          {request.customerPhone}
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
        onChange={(e) => handleStatusChange(request.id, e.target.value)}
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

  // مكون تحديث الأولوية داخل البطاقة
  const PriorityUpdateSelect = ({ request }) => {
    const isUpdating = updatingPriorityId === request.id;
    
    return (
      <select
        value={request.priority || 'medium'}
        onChange={(e) => handlePriorityUpdate(request.id, e.target.value)}
        className={`px-3 py-1 rounded-full text-sm font-medium border-0 focus:ring-2 focus:ring-indigo-500 cursor-pointer ${getPriorityColor(request.priority || 'medium')}`}
        disabled={isUpdating}
      >
        <option value="low">منخفض</option>
        <option value="medium">متوسط</option>
        <option value="high">مرتفع</option>
        <option value="urgent">عاجل</option>
      </select>
    );
  };

  // مكون تفاصيل الطلب - مودال
  const RequestDetailsModal = () => {
    if (!selectedRequest) return null;
    const projectInfo = getProjectInfo(selectedRequest);
    
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
            <button onClick={() => setShowDetailsModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
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
                    {selectedRequest.customerPhone}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={(e) => handleWhatsAppClick(selectedRequest, e)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all duration-200 text-sm"
                    >
                      <IconWhatsApp className="w-4 h-4" />واتساب
                    </button>
                    <button
                      onClick={(e) => handlePhoneClick(selectedRequest, e)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 text-sm"
                    >
                      <IconPhone className="w-4 h-4" />اتصال
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
            <StatusUpdateSection request={selectedRequest} onStatusChange={handleStatusChange} />
              
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
              
            {/* Project Info with Link */}
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center">
                <IconStar className="ml-2 w-5 h-5" /> معلومات المشروع
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-slate-500 mb-1">اسم المشروع</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-slate-900">{projectInfo.name || 'غير محدد'}</p>
                    {(projectInfo.url || projectInfo.id !== 'غير محدد') && (
                      <button
                        onClick={(e) => handleViewProject(selectedRequest, e)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                      >
                        <IconExternalLink className="w-4 h-4" /> فتح المشروع
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-500 mb-1">نوع/قسم المشروع</label>
                  <p className="font-medium text-slate-900">{projectInfo.type}</p>
                </div>
                {projectInfo.similarTo && (
                  <div>
                    <label className="block text-sm text-slate-500 mb-1">مشروع مماثل لـ</label>
                    <p className="font-medium text-orange-700">{projectInfo.similarTo}</p>
                  </div>
                )}
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
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex-1 min-w-[120px]"
              >
                إغلاق
              </button>
              {(projectInfo.url || projectInfo.id !== 'غير محدد') && (
                <button
                  onClick={(e) => handleViewProject(selectedRequest, e)}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all flex-1 min-w-[120px] flex items-center justify-center gap-2"
                >
                  <IconExternalLink className="w-5 h-5" /> عرض المشروع
                </button>
              )}
              {userData?.role === 'admin' && (
                <button
                  onClick={(e) => {
                    handleDelete(selectedRequest.id, e);
                    setShowDetailsModal(false);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex-1 min-w-[120px] flex items-center justify-center gap-2"
                >
                  <IconTrash className="w-5 h-5" /> حذف الطلب
                </button>
              )}
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
            <h2 className="text-2xl font-bold text-slate-900">طلبات المشاريع</h2>
            <p className="text-slate-600 mt-1">إدارة وتتبع جميع طلبات المشاريع من العملاء</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={resetAllFilters}
              className="w-full sm:w-auto px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center"
            >
              <IconFilter className="ml-2 w-5 h-5" />إعادة تعيين الفلاتر
            </button>
            <button
              onClick={onRefresh}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all flex items-center justify-center"
            >
              <IconRefresh className="ml-2 w-5 h-5" />تحديث
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
              placeholder="ابحث بالاسم أو الهاتف أو المشروع..."
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
            <span className="text-sm text-slate-600">عرض {filteredRequests.length} من {projectRequests?.length || 0} طلب</span>
          </div>
        </div>
        
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <div className="inline-block p-3 bg-slate-100 rounded-full mb-4">
              <IconClipboardList className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">لا توجد طلبات</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              {getAppliedFiltersCount() > 0 ? 'لم نتمكن من العثور على طلبات تطابق فلاترك' : 'لا توجد طلبات مشاريع حالياً'}
            </p>
          </div>
        ) : isMobileView ? (
          /* Mobile View - Cards */
          <div className="p-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="mb-3 p-3 border border-slate-200 rounded-lg bg-white"
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
                    <div className="text-xs text-slate-500 mb-1">المشروع</div>
                    <ProjectInfoDisplay request={request} />
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
                    <PriorityUpdateSelect request={request} />
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
                        <button onClick={() => handleViewDetails(request)} className="flex-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm">
                          عرض التفاصيل
                        </button>
                        <button onClick={(e) => handleDelete(request.id, e)} className="px-3 py-1.5 bg-red-500 text-white rounded-lg">
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
                      <button onClick={() => handleViewDetails(request)} className="p-1.5 text-indigo-600 hover:text-indigo-800" title="عرض التفاصيل">
                        <IconEye className="w-4 h-4" />
                      </button>
                      <button onClick={(e) => handleDelete(request.id, e)} className="p-1.5 text-red-600 hover:text-red-800" title="حذف">
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
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider min-w-[250px]">المشروع</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">الحالة</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider min-w-[100px]">الأولوية</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">طريقة التواصل</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">تاريخ الطلب</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-slate-500 uppercase tracking-wider min-w-[120px]">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-50 transition-colors">
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
                      <ProjectInfoDisplay request={request} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusUpdateSelect request={request} />
                    </td>
                    <td className="px-6 py-4">
                      <PriorityUpdateSelect request={request} />
                    </td>
                    <td className="px-6 py-4">
                      <ContactMethodDisplay request={request} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">
                        {formatDate(request.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="عرض التفاصيل"
                        >
                          <IconEye className="w-5 h-5" />
                        </button>
                        {(getProjectInfo(request).url || getProjectInfo(request).id !== 'غير محدد') && (
                          <button
                            onClick={(e) => handleViewProject(request, e)}
                            className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="عرض المشروع"
                          >
                            <IconExternalLink className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(request.id, e)}
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
      {showDetailsModal && <RequestDetailsModal />}
    </div>
  );
};

export default ProjectRequests;