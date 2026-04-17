// /Users/ayatnidal/Desktop/decor-website/decor-website-react/src/components/Admin/modals/ServiceModal.js
// اضافة خدمات من صفحة الادمن - بدون حقول إجبارية وبدون كتالوج - بدون قيم افتراضية
import { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  IconX, IconCheck, IconPackage, IconTag, 
  IconImage, IconStar, IconSettings, IconCalendar,
  IconClock, IconShield, IconCreditCard
} from '../Icons';
import ImageUploader from './modals/ImageUploader';

const ServiceModal = ({ 
  isEdit = false,
  initialData = null,
  onSubmit,
  onClose,
  isViewer = false,
  showNotification
}) => {
  
  // حالة لتتبع حجم الشاشة
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);
  
  // كشف حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // تصنيفات الخدمات الموسعة
  const serviceCategories = useMemo(() => [
    { value: "", label: { ar: "بدون تصنيف", en: "No Category" } },
    { value: "design", label: { ar: "تصميم", en: "Design" } },
    { value: "supervision", label: { ar: "إشراف", en: "Supervision" } },
    { value: "consultation", label: { ar: "استشارات", en: "Consultation" } },
    { value: "interior", label: { ar: "داخلي", en: "Interior" } },
    { value: "exterior", label: { ar: "خارجي", en: "Exterior" } },
    { value: "gardens", label: { ar: "حدائق", en: "Gardens" } },
    { value: "renovation", label: { ar: "تطوير وترميم", en: "Renovation" } },
    { value: "furniture", label: { ar: "أثاث وديكور", en: "Furniture & Decor" } },
    { value: "lighting", label: { ar: "إضاءة", en: "Lighting" } },
    { value: "color-consultation", label: { ar: "استشارة ألوان", en: "Color Consultation" } }
  ], []);

  // حالة التبويبات
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // حالة النموذج الرئيسية - بدون قيم افتراضية
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        title: initialData.title || { ar: "", en: "" },
        shortDescription: initialData.shortDescription || { ar: "", en: "" },
        fullDescription: initialData.fullDescription || { ar: "", en: "" },
        category: initialData.category || "",
        mainImage: initialData.mainImage || "",
        tags: initialData.tags || { ar: [], en: [] },
        isFeatured: initialData.isFeatured || false,
        isActive: initialData.isActive || true,
        order: initialData.order || 0,
        features: initialData.features || { ar: [], en: [] },
        steps: initialData.steps || { ar: [], en: [] },
        includes: initialData.includes || { ar: [], en: [] },
        price: initialData.price || "",
        duration: initialData.duration || "",
        deliveryTime: initialData.deliveryTime || "",
        warranty: initialData.warranty || "",
        popularity: initialData.popularity || 50,
        views: initialData.views || 0
      };
    }

    // حالة أولية بدون قيم افتراضية
    return {
      title: { ar: "", en: "" },
      shortDescription: { ar: "", en: "" },
      fullDescription: { ar: "", en: "" },
      category: "",
      mainImage: "",
      tags: { ar: [], en: [] },
      isFeatured: false,
      isActive: true,
      order: 0,
      features: { ar: [], en: [] },
      steps: { ar: [], en: [] },
      includes: { ar: [], en: [] },
      price: "",
      duration: "",
      deliveryTime: "",
      warranty: "",
      popularity: 50,
      views: 0
    };
  });

  // حالات المدخلات
  const [tagInputAr, setTagInputAr] = useState("");
  const [tagInputEn, setTagInputEn] = useState("");
  const [featureInputAr, setFeatureInputAr] = useState("");
  const [featureInputEn, setFeatureInputEn] = useState("");
  const [stepInputAr, setStepInputAr] = useState("");
  const [stepInputEn, setStepInputEn] = useState("");
  const [includeInputAr, setIncludeInputAr] = useState("");
  const [includeInputEn, setIncludeInputEn] = useState("");

  // تهيئة البيانات الأولية
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || { ar: "", en: "" },
        shortDescription: initialData.shortDescription || { ar: "", en: "" },
        fullDescription: initialData.fullDescription || { ar: "", en: "" },
        category: initialData.category || "",
        mainImage: initialData.mainImage || "",
        tags: initialData.tags || { ar: [], en: [] },
        isFeatured: initialData.isFeatured || false,
        isActive: initialData.isActive || true,
        order: initialData.order || 0,
        features: initialData.features || { ar: [], en: [] },
        steps: initialData.steps || { ar: [], en: [] },
        includes: initialData.includes || { ar: [], en: [] },
        price: initialData.price || "",
        duration: initialData.duration || "",
        deliveryTime: initialData.deliveryTime || "",
        warranty: initialData.warranty || "",
        popularity: initialData.popularity || 50,
        views: initialData.views || 0
      });
    }
  }, [initialData]);

  // التبويبات مع تحسين للشاشات الصغيرة
  const tabs = useMemo(() => [
    { 
      id: 'basic', 
      label: isMobile ? 'الأساسيات' : 'المعلومات الأساسية', 
      icon: IconPackage,
      shortLabel: 'الأساسيات'
    },
    { 
      id: 'features', 
      label: isMobile ? 'الميزات' : 'الميزات', 
      icon: IconStar,
      shortLabel: 'الميزات'
    },
    { 
      id: 'process', 
      label: isMobile ? 'العملية' : 'العملية', 
      icon: IconSettings,
      shortLabel: 'العملية'
    },
    { 
      id: 'media', 
      label: isMobile ? 'الوسائط' : 'الوسائط', 
      icon: IconImage,
      shortLabel: 'الوسائط'
    },
    { 
      id: 'settings', 
      label: isMobile ? 'الإعدادات' : 'الإعدادات', 
      icon: IconSettings,
      shortLabel: 'الإعدادات'
    }
  ], [isMobile]);

  // ==============================
  // التحقق من النموذج (بدون حقول إجبارية)
  // ==============================

  const validateForm = useCallback(() => {
    // لا يوجد حقول إجبارية - يمكن حفظ الخدمة فارغة تماماً
    setErrors({});
    return true;
  }, []);

  // ==============================
  // دوال إدارة الوسوم
  // ==============================

  const addTag = useCallback((language, value) => {
    if (!value.trim()) return;
    
    const newTags = [...formData.tags[language], value.trim()];
    setFormData(prev => ({
      ...prev,
      tags: {
        ...prev.tags,
        [language]: newTags
      }
    }));
    
    if (language === "ar") setTagInputAr("");
    if (language === "en") setTagInputEn("");
  }, [formData.tags]);

  const removeTag = useCallback((language, index) => {
    setFormData(prev => ({
      ...prev,
      tags: {
        ...prev.tags,
        [language]: prev.tags[language].filter((_, i) => i !== index)
      }
    }));
  }, []);

  // ==============================
  // دوال إدارة القوائم
  // ==============================

  const addListItem = useCallback((field, language, value, setInputFunction) => {
    if (!value.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [language]: [...prev[field][language], value.trim()]
      }
    }));
    
    setInputFunction("");
  }, []);

  const removeListItem = useCallback((field, language, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [language]: prev[field][language].filter((_, i) => i !== index)
      }
    }));
  }, []);

  // ==============================
  // دوال إدارة الصور
  // ==============================

  const handleServiceImageUploaded = useCallback((imageUrls) => {
    if (imageUrls.length > 0) {
      setFormData(prev => ({
        ...prev,
        mainImage: imageUrls[0]
      }));
    }
  }, []);

  // ==============================
  // دوال التحديث العامة
  // ==============================

  const updateFormField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // مسح الخطأ عند التعديل
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const updateNestedField = useCallback((parent, child, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value
      }
    }));
    
    // مسح الخطأ عند التعديل
    const errorKey = `${parent}${child.charAt(0).toUpperCase() + child.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  }, [errors]);

  // ==============================
  // دالة الإرسال - بدون تنظيف أو قيم افتراضية
  // ==============================

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      showNotification?.("error", "يرجى تعبئة الحقول المطلوبة بشكل صحيح");
      setActiveTab('basic');
      return;
    }

    // إرسال البيانات كما هي بدون تنظيف أو قيم افتراضية
    const submitData = {
      ...formData,
      // ترك البيانات كما أدخلها المستخدم
      title: {
        ar: formData.title.ar,
        en: formData.title.en
      },
      shortDescription: {
        ar: formData.shortDescription.ar,
        en: formData.shortDescription.en
      },
      fullDescription: {
        ar: formData.fullDescription.ar,
        en: formData.fullDescription.en
      },
      tags: {
        ar: formData.tags.ar,
        en: formData.tags.en
      },
      features: {
        ar: formData.features.ar,
        en: formData.features.en
      },
      steps: {
        ar: formData.steps.ar,
        en: formData.steps.en
      },
      includes: {
        ar: formData.includes.ar,
        en: formData.includes.en
      },
      price: formData.price,
      duration: formData.duration,
      deliveryTime: formData.deliveryTime,
      warranty: formData.warranty,
      popularity: formData.popularity,
      views: formData.views,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      category: formData.category,
      mainImage: formData.mainImage,
      order: formData.order
    };

    // إرسال البيانات
    try {
      if (onSubmit && typeof onSubmit === 'function') {
        onSubmit(submitData);
        setIsSubmitting(false);
        
        showNotification?.("success", 
          isEdit ? "تم تحديث الخدمة بنجاح" : "تم إضافة الخدمة بنجاح"
        );
      }
    } catch (error) {
      console.error("خطأ في إرسال البيانات:", error);
      setIsSubmitting(false);
      showNotification?.("error", "حدث خطأ أثناء حفظ البيانات");
    }
  }, [formData, validateForm, onSubmit, showNotification, isEdit]);

  // ==============================
  // دوال مساعدة للوسوم
  // ==============================

  const handleAddTag = useCallback((language, inputValue, setInputValue) => {
    if (inputValue.trim()) {
      if (inputValue.includes(',')) {
        inputValue.split(',').forEach(tag => {
          if (tag.trim()) addTag(language, tag.trim());
        });
      } else {
        addTag(language, inputValue.trim());
      }
      setInputValue("");
    }
  }, [addTag]);

  const handleTagKeyPress = useCallback((e, language, inputValue, setInputValue) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(language, inputValue, setInputValue);
    }
  }, [handleAddTag]);

  // ==============================
  // دوال مساعدة للقوائم
  // ==============================

  const handleAddItem = useCallback((field, language, inputValue, setInputValue) => {
    addListItem(field, language, inputValue, setInputValue);
  }, [addListItem]);

  const handleItemKeyPress = useCallback((e, field, language, inputValue, setInputValue) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem(field, language, inputValue, setInputValue);
    }
  }, [handleAddItem]);

  // ==============================
  // مكونات القوائم المدمجة مع تحسين للشاشات الصغيرة
  // ==============================

  const TagsInput = useCallback(({ language, tags, inputValue, setInputValue, placeholder }) => (
    <div className="space-y-2 sm:space-y-3">
      <label className="block text-xs sm:text-sm font-medium text-gray-700">
        الوسوم ({language === 'ar' ? 'العربية' : 'الإنجليزية'})
      </label>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => handleTagKeyPress(e, language, inputValue, setInputValue)}
          placeholder={isMobile ? placeholder.split(' ')[0] + '...' : placeholder}
          className="flex-1 px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isViewer}
        />
        <button
          type="button"
          onClick={() => handleAddTag(language, inputValue, setInputValue)}
          className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          disabled={isViewer || !inputValue.trim()}
        >
          {isMobile ? 'إضافة' : 'إضافة'}
        </button>
      </div>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
          {tags.map((tag, index) => (
            <div key={index} className="flex items-center gap-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
              <IconTag className="w-3 h-3" />
              <span className="text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px]">{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(language, index)}
                className="text-blue-500 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed p-0.5"
                disabled={isViewer}
                title="حذف الوسم"
              >
                <IconX className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {tags.length === 0 && (
        <div className="text-center py-3 sm:py-4 text-gray-400 text-xs sm:text-sm">
          لم تتم إضافة أي وسوم بعد
        </div>
      )}
    </div>
  ), [handleAddTag, handleTagKeyPress, isViewer, removeTag, isMobile]);

  const ListItemInput = useCallback(({ title, field, language, items, inputValue, setInputValue, placeholder }) => (
    <div className="space-y-2 sm:space-y-3">
      <label className="block text-xs sm:text-sm font-medium text-gray-700">
        {title} ({language === 'ar' ? 'العربية' : 'الإنجليزية'})
      </label>
      
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => handleItemKeyPress(e, field, language, inputValue, setInputValue)}
          placeholder={isMobile ? placeholder.split(' ')[0] + '...' : placeholder}
          className="flex-1 px-3 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          disabled={isViewer}
        />
        <button
          type="button"
          onClick={() => handleAddItem(field, language, inputValue, setInputValue)}
          className="px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          disabled={isViewer || !inputValue.trim()}
        >
          {isMobile ? 'إضافة' : 'إضافة'}
        </button>
      </div>
      
      {items.length > 0 && (
        <div className="space-y-1.5 sm:space-y-2 max-h-40 sm:max-h-60 overflow-y-auto">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 sm:p-3 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center min-w-0">
                <span className="text-blue-500 mr-1.5 sm:mr-2 text-xs sm:text-sm">•</span>
                <span className="text-xs sm:text-sm text-gray-700 truncate">{item}</span>
              </div>
              <button
                type="button"
                onClick={() => removeListItem(field, language, index)}
                className="text-red-500 hover:text-red-700 p-0.5 sm:p-1 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                disabled={isViewer}
                title="حذف"
              >
                <IconX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {items.length === 0 && (
        <div className="text-center py-3 sm:py-4 text-gray-400 text-xs sm:text-sm">
          لم تتم إضافة أي عناصر بعد
        </div>
      )}
    </div>
  ), [handleAddItem, handleItemKeyPress, isViewer, removeListItem, isMobile]);

  // ==============================
  // مكون Toggle Button محسن مع تحسين للشاشات الصغيرة
  // ==============================

  const ToggleButton = useCallback(({
    label,
    description,
    checked,
    onChange,
    disabled = false,
    activeColor = "green",
    inactiveColor = "gray"
  }) => {

    const activeColors = {
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      blue: "bg-blue-500",
      purple: "bg-purple-500"
    };

    const inactiveColors = {
      gray: "bg-gray-300",
      red: "bg-red-300",
      blue: "bg-blue-300"
    };

    const activeColorClass = activeColors[activeColor] || activeColors.green;
    const inactiveColorClass = inactiveColors[inactiveColor] || inactiveColors.gray;

    return (
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200 space-y-2 sm:space-y-0 ${disabled ? 'opacity-75' : ''}`}>

        {/* النص */}
        <div className="flex-1 pr-0 sm:pr-4">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${checked ? activeColorClass : inactiveColorClass}`}></div>
            <span className="block font-medium text-gray-700 text-sm sm:text-base">
              {label}
            </span>
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-gray-500">
              {description}
            </p>
          )}
        </div>

        {/* التوجيل */}
        <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end">

          <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            disabled={disabled}
            onClick={() => !disabled && onChange(!checked)}
            className={`
              relative inline-flex h-6 w-11 sm:h-7 sm:w-14 items-center rounded-full
              transition-colors duration-300 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
              ${checked ? activeColorClass : inactiveColorClass}
            `}
          >
            {/* الدائرة */}
            <span
              className={`
                absolute top-1 left-1
                h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-white shadow
                transition-transform duration-300 ease-in-out
                ${checked ? "translate-x-5 sm:translate-x-7" : "translate-x-0"}
              `}
            />
          </button>

          {/* نعم / لا */}
          <span
            className={`
              w-8 sm:w-10 text-center text-xs sm:text-sm font-medium
              ${checked ? "text-green-600" : "text-gray-500"}
            `}
          >
            {checked ? "نعم" : "لا"}
          </span>

        </div>
      </div>
    );
  }, []);

  // ==============================
  // الواجهة الرئيسية مع تحسين للشاشات الصغيرة
  // ==============================

  const modalTitle = isEdit ? "تعديل الخدمة" : "إضافة خدمة جديدة";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-0 sm:p-2 md:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:max-w-6xl sm:w-full sm:max-h-[90vh] overflow-y-auto">
        {/* الهيدر */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-4 sm:px-6 sm:py-4 flex justify-between items-center z-10">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-white truncate">
              {modalTitle}
            </h2>
            {isEdit && formData.title.ar && (
              <p className="text-xs sm:text-sm text-purple-100 truncate hidden sm:block">
                {formData.title.ar}
              </p>
            )}
          </div>
          
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white/20 p-1 sm:p-2 rounded-full transition-colors flex-shrink-0"
            disabled={isViewer}
            title="إغلاق"
            aria-label="إغلاق"
          >
            <IconX className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        {/* التبويبات مع تحسين للشاشات الصغيرة */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto px-1 sm:px-4">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const label = isMobile ? tab.shortLabel : tab.label;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col sm:flex-row items-center px-2 py-2 sm:px-4 sm:py-3 font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-1 min-w-[70px] sm:min-w-0 sm:flex-none justify-center ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="mb-1 sm:mb-0 sm:ml-2 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* المحتوى */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          {/* تبويب المعلومات الأساسية */}
          {activeTab === 'basic' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-purple-800 mb-3 sm:mb-4 flex items-center">
                  <IconPackage className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  المعلومات الأساسية
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      اسم الخدمة (عربي)
                    </label>
                    <input 
                      type="text" 
                      value={formData.title.ar} 
                      onChange={(e) => updateNestedField("title", "ar", e.target.value)} 
                      className={`w-full p-2.5 sm:p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                        errors.titleAr ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={isViewer}
                      placeholder="أدخل اسم الخدمة بالعربية (اختياري)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      اسم الخدمة (إنجليزي)
                    </label>
                    <input 
                      type="text" 
                      value={formData.title.en} 
                      onChange={(e) => updateNestedField("title", "en", e.target.value)} 
                      className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      disabled={isViewer}
                      placeholder="Enter service name in English (optional)"
                    />
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    الوصف المختصر (عربي)
                    <span className="text-xs text-gray-500 mr-2 hidden sm:inline">
                      (يظهر في بطاقة الخدمة - سطرين فقط) (اختياري)
                    </span>
                  </label>
                  <textarea 
                    value={formData.shortDescription.ar} 
                    onChange={(e) => updateNestedField("shortDescription", "ar", e.target.value)} 
                    rows={isMobile ? 2 : 3}
                    className={`w-full p-2.5 sm:p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                      errors.shortDescriptionAr ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    disabled={isViewer}
                    placeholder="وصف مختصر يظهر في بطاقة الخدمة (اختياري)"
                    maxLength="200"
                  />
                  <div className="text-xs text-gray-500 text-left mt-1">
                    {formData.shortDescription.ar?.length || 0}/200 حرف
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    الوصف المختصر (إنجليزي)
                  </label>
                  <textarea 
                    value={formData.shortDescription.en} 
                    onChange={(e) => updateNestedField("shortDescription", "en", e.target.value)} 
                    rows={isMobile ? 2 : 3}
                    className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    disabled={isViewer}
                    placeholder="Short description for service card (optional)"
                    maxLength="200"
                  />
                  <div className="text-xs text-gray-500 text-left mt-1">
                    {formData.shortDescription.en?.length || 0}/200 characters
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    الوصف التفصيلي (عربي)
                    <span className="text-xs text-gray-500 mr-2 hidden sm:inline">
                      (نص طويل لصفحة الخدمة الخاصة) (اختياري)
                    </span>
                  </label>
                  <textarea 
                    value={formData.fullDescription.ar} 
                    onChange={(e) => updateNestedField("fullDescription", "ar", e.target.value)} 
                    rows={isMobile ? 3 : 4}
                    className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    disabled={isViewer}
                    placeholder="وصف تفصيلي طويل لصفحة الخدمة... (اختياري)"
                  />
                  <div className="text-xs text-gray-500 text-left mt-1">
                    {formData.fullDescription.ar?.length || 0} حرف
                  </div>
                </div>
                
                <div className="mt-4 sm:mt-6">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    الوصف التفصيلي (إنجليزي)
                  </label>
                  <textarea 
                    value={formData.fullDescription.en} 
                    onChange={(e) => updateNestedField("fullDescription", "en", e.target.value)} 
                    rows={isMobile ? 3 : 4}
                    className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                    disabled={isViewer}
                    placeholder="Detailed description for service page... (optional)"
                  />
                  <div className="text-xs text-gray-500 text-left mt-1">
                    {formData.fullDescription.en?.length || 0} characters
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      تصنيف الخدمة (اختياري)
                    </label>
                    <select 
                      value={formData.category} 
                      onChange={(e) => updateFormField("category", e.target.value)} 
                      className={`w-full p-2.5 sm:p-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 ${
                        errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      disabled={isViewer}
                    >
                      <option value="">بدون تصنيف</option>
                      {serviceCategories.filter(cat => cat.value !== "").map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label.ar}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      الترتيب (اختياري)
                    </label>
                    <input 
                      type="number" 
                      value={formData.order} 
                      onChange={(e) => updateFormField("order", parseInt(e.target.value) || 0)} 
                      className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200" 
                      min="0" 
                      disabled={isViewer}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      السعر (اختياري)
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.price} 
                        onChange={(e) => updateFormField("price", e.target.value)} 
                        className="w-full p-2.5 sm:p-3 text-sm sm:text-base pl-8 sm:pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200" 
                        placeholder="تبدأ من 5000 ₪ (اختياري)"
                        disabled={isViewer}
                      />
                      <IconCreditCard className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      المدة (اختياري)
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.duration} 
                        onChange={(e) => updateFormField("duration", e.target.value)} 
                        className="w-full p-2.5 sm:p-3 text-sm sm:text-base pl-8 sm:pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200" 
                        placeholder="2-4 أسابيع (اختياري)"
                        disabled={isViewer}
                      />
                      <IconClock className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      وقت التسليم (اختياري)
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.deliveryTime || ""} 
                        onChange={(e) => updateFormField("deliveryTime", e.target.value)} 
                        className="w-full p-2.5 sm:p-3 text-sm sm:text-base pl-8 sm:pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200" 
                        placeholder="3-5 أيام عمل (اختياري)"
                        disabled={isViewer}
                      />
                      <IconCalendar className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      الضمان (اختياري)
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.warranty || ""} 
                        onChange={(e) => updateFormField("warranty", e.target.value)} 
                        className="w-full p-2.5 sm:p-3 text-sm sm:text-base pl-8 sm:pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200" 
                        placeholder="سنة واحدة (اختياري)"
                        disabled={isViewer}
                      />
                      <IconShield className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* القسم 2: الوسوم */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 sm:mb-4 flex items-center">
                  <IconTag className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  الوسوم (Tags) - للبحث والسيو (اختياري)
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <TagsInput
                      language="ar"
                      tags={formData.tags.ar}
                      inputValue={tagInputAr}
                      setInputValue={setTagInputAr}
                      placeholder="أدخل الوسوم بالعربية (مفصولة بفواصل) (اختياري)"
                    />
                  </div>
                  <div>
                    <TagsInput
                      language="en"
                      tags={formData.tags.en}
                      inputValue={tagInputEn}
                      setInputValue={setTagInputEn}
                      placeholder="Enter tags in English (comma separated) (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* تبويب الميزات */}
          {activeTab === 'features' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-3 sm:mb-4 flex items-center">
                  <IconStar className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  الميزات (Features) (اختياري)
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <ListItemInput
                      title="الميزات"
                      field="features"
                      language="ar"
                      items={formData.features.ar}
                      inputValue={featureInputAr}
                      setInputValue={setFeatureInputAr}
                      placeholder="أدخل ميزة جديدة... (اختياري)"
                    />
                  </div>
                  <div>
                    <ListItemInput
                      title="الميزات"
                      field="features"
                      language="en"
                      items={formData.features.en}
                      inputValue={featureInputEn}
                      setInputValue={setFeatureInputEn}
                      placeholder="Enter new feature... (optional)"
                    />
                  </div>
                </div>
              </div>
              
              {/* القسم 6: ما تشمله الخدمة */}
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-pink-800 mb-3 sm:mb-4 flex items-center">
                  <IconCheck className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  ما تشمله الخدمة (اختياري)
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <ListItemInput
                      title="ما تشمله الخدمة"
                      field="includes"
                      language="ar"
                      items={formData.includes.ar}
                      inputValue={includeInputAr}
                      setInputValue={setIncludeInputAr}
                      placeholder="أدخل عنصر جديد... (اختياري)"
                    />
                  </div>
                  <div>
                    <ListItemInput
                      title="ما تشمله الخدمة"
                      field="includes"
                      language="en"
                      items={formData.includes.en}
                      inputValue={includeInputEn}
                      setInputValue={setIncludeInputEn}
                      placeholder="Enter new item... (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* تبويب العملية */}
          {activeTab === 'process' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-cyan-800 mb-3 sm:mb-4 flex items-center">
                  <IconSettings className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  خطوات التنفيذ (اختياري)
                </h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <ListItemInput
                      title="خطوات التنفيذ"
                      field="steps"
                      language="ar"
                      items={formData.steps.ar}
                      inputValue={stepInputAr}
                      setInputValue={setStepInputAr}
                      placeholder="أدخل خطوة جديدة... (اختياري)"
                    />
                  </div>
                  <div>
                    <ListItemInput
                      title="خطوات التنفيذ"
                      field="steps"
                      language="en"
                      items={formData.steps.en}
                      inputValue={stepInputEn}
                      setInputValue={setStepInputEn}
                      placeholder="Enter new step... (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* تبويب الوسائط */}
          {activeTab === 'media' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-amber-800 mb-3 sm:mb-4 flex items-center">
                  <IconImage className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  صورة غلاف الخدمة (اختياري)
                </h3>
                
                <ImageUploader 
                  onImagesUploaded={handleServiceImageUploaded}
                  currentImages={formData.mainImage ? [formData.mainImage] : []}
                  multiple={false}
                  maxFiles={1}
                  label="صورة الغلاف الرئيسية (اختياري)"
                  disabled={isViewer}
                  isMobile={isMobile}
                  isTablet={isTablet}
                />
                
                <div className="mt-4 sm:mt-6">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                    رابط الصورة اليدوي (اختياري)
                  </label>
                  <input 
                    type="url" 
                    value={formData.mainImage} 
                    onChange={(e) => updateFormField("mainImage", e.target.value)} 
                    className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200" 
                    placeholder="https://example.com/service-image.jpg (اختياري)"
                    disabled={isViewer}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* تبويب الإعدادات */}
          {activeTab === 'settings' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                  الإعدادات
                </h3>
                
                <div className="space-y-3 sm:space-y-4">
                  {/* حالة الخدمة - Toggle محسن */}
                  <ToggleButton
                    label="حالة الخدمة"
                    description={formData.isActive 
                      ? "الخدمة نشطة وتظهر في الموقع" 
                      : "الخدمة غير نشطة ومخفية عن الزوار"}
                    checked={formData.isActive}
                    onChange={(value) => updateFormField("isActive", value)}
                    disabled={isViewer}
                    activeColor="green"
                    inactiveColor="gray"
                  />
                  
                  {/* هل الخدمة مميزة؟ - Toggle محسن */}
                  <ToggleButton
                    label="هل الخدمة مميزة؟"
                    description={formData.isFeatured 
                      ? "الخدمة مميزة وتظهر في القسم الخاص" 
                      : "الخدمة عادية"}
                    checked={formData.isFeatured}
                    onChange={(value) => updateFormField("isFeatured", value)}
                    disabled={isViewer}
                    activeColor="yellow"
                    inactiveColor="gray"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-3 sm:mt-4">
                    <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        الشعبية (0-100) (اختياري)
                      </label>
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={formData.popularity} 
                          onChange={(e) => updateFormField("popularity", parseInt(e.target.value) || 0)} 
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isViewer}
                        />
                        <input 
                          type="number" 
                          value={formData.popularity} 
                          onChange={(e) => updateFormField("popularity", parseInt(e.target.value) || 0)} 
                          className="w-16 sm:w-20 p-1.5 sm:p-2 border border-gray-300 rounded-lg text-center text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                          min="0" 
                          max="100"
                          disabled={isViewer}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                        كلما زادت الشعبية، زاد ظهور الخدمة
                      </p>
                    </div>
                    
                    <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        عدد المشاهدات (اختياري)
                      </label>
                      <input 
                        type="number" 
                        value={formData.views} 
                        onChange={(e) => updateFormField("views", parseInt(e.target.value) || 0)} 
                        className="w-full p-2.5 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" 
                        min="0"
                        disabled={isViewer}
                      />
                      <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                        عدد مرات مشاهدة الخدمة
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* التنقل بين التبويبات مع تحسين للشاشات الصغيرة */}
          <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 border-t border-gray-200 gap-3 sm:gap-0">
            <div className="flex overflow-x-auto space-x-1.5 sm:space-x-3 pb-2 sm:pb-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const label = isMobile ? tab.shortLabel : tab.label;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {!isMobile && <Icon className="ml-1.5 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
              >
                إلغاء
              </button>
              {!isViewer && (
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 sm:px-5 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-sm sm:text-base ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <IconCheck className="ml-2 w-4 h-4" />
                      {isEdit ? "تحديث الخدمة" : "إضافة الخدمة"}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          
          {/* عرض الأخطاء */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2 flex items-center text-sm sm:text-base">
                <span className="mr-1">✗</span>
                يرجى تصحيح الأخطاء التالية:
              </h4>
              <ul className="list-disc list-inside text-red-600 text-xs sm:text-sm space-y-1">
                {errors.titleAr && <li>{errors.titleAr}</li>}
                {errors.shortDescriptionAr && <li>{errors.shortDescriptionAr}</li>}
                {errors.category && <li>{errors.category}</li>}
              </ul>
              <button 
                type="button" 
                onClick={() => setActiveTab('basic')}
                className="mt-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800"
              >
                العودة إلى تبويب المعلومات الأساسية
              </button>
            </div>
          )}
        </form>
        
        {/* التذييل مع تحسين للشاشات الصغيرة */}
        <div className="border-t border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4 bg-gray-50 text-xs sm:text-sm text-gray-500 rounded-b-none sm:rounded-b-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5 sm:gap-0">
            <div className="truncate">
              {isEdit ? "تعديل خدمة موجودة" : "إضافة خدمة جديدة"} | 
              <span className="mx-1 sm:mx-2">•</span>
              {formData.isActive ? "نشط" : "غير نشط"}
              <span className="mx-1 sm:mx-2">•</span>
              {formData.isFeatured ? "مميز" : "عادي"}
            </div>
            <div className="truncate">
              {formData.title.ar && `"${formData.title.ar}"`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// القيم الافتراضية
ServiceModal.defaultProps = {
  isEdit: false,
  initialData: null,
  isViewer: false,
  showNotification: () => {}
};

export default ServiceModal;