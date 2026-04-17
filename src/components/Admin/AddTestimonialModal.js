// src/components/Admin/AddTestimonialModal.js
import { useState } from "react";
import { serverTimestamp } from "firebase/firestore";

// Icons
const IconMessage = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>;
const IconCheck = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconX = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconFolder = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>;
const IconStar = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
const IconAlertCircle = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconCertificate = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>;

const AddTestimonialModal = ({ onClose, onSubmit, currentUser }) => {
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    positionAr: "",
    positionEn: "",
    commentAr: "",
    commentEn: "",
    rating: 5,
    location: "",
    image: "",
    serviceType: "",
    projectType: "residential",
    email: "",
    phone: "",
    approved: true,
    status: "approved",
    isFeatured: false
  });

  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // قائمة أنواع الخدمات
  const serviceTypes = [
    { value: "", label: { ar: "اختر نوع الخدمة", en: "Select Service Type" } },
    { value: "living-room", label: { ar: "صالات جلوس", en: "Living Room" } },
    { value: "kitchen", label: { ar: "مطابخ", en: "Kitchen" } },
    { value: "bedroom", label: { ar: "غرف نوم", en: "Bedroom" } },
    { value: "office", label: { ar: "مكاتب", en: "Office" } },
    { value: "commercial", label: { ar: "تجاري", en: "Commercial" } },
    { value: "bathroom", label: { ar: "حمامات", en: "Bathroom" } },
    { value: "design", label: { ar: "تصميم", en: "Design" } },
    { value: "renovation", label: { ar: "تطوير وترميم", en: "Renovation" } }
  ];

  // دالة تحضير البيانات
  const prepareTestimonialData = () => {
    if (!formData.nameAr.trim()) {
      throw new Error("اسم العميل بالعربية مطلوب");
    }
    
    if (!formData.commentAr.trim()) {
      throw new Error("نص الشهادة بالعربية مطلوب");
    }
    
    if (!formData.serviceType) {
      throw new Error("نوع الخدمة مطلوب");
    }

    const data = {
      name: formData.nameAr.trim(),
      nameAr: formData.nameAr.trim(),
      nameEn: formData.nameEn.trim() || formData.nameAr.trim(),
      rating: formData.rating,
      comment: formData.commentAr.trim(),
      commentAr: formData.commentAr.trim(),
      commentEn: formData.commentEn.trim() || formData.commentAr.trim(),
      position: formData.positionAr.trim() || "",
      positionAr: formData.positionAr.trim() || "",
      positionEn: formData.positionEn.trim() || "",
      location: formData.location.trim() || "",
      projectType: formData.projectType,
      serviceType: formData.serviceType,
      email: formData.email.trim() || "",
      phone: formData.phone.trim() || "",
      image: formData.image || "",
      approved: true,
      status: "approved",
      isFeatured: formData.isFeatured,
      adminAdded: true,
      imageType: formData.image ? (formData.image.includes('logo') || formData.image.includes('certificate') ? 'certificate' : 'avatar') : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      publishedAt: serverTimestamp(),
      createdBy: currentUser?.email || "admin@system.com",
      language: "ar",
      contactPreference: formData.email ? "email" : "phone"
    };

    // إزالة الحقول الفارغة
    Object.keys(data).forEach(key => {
      if (data[key] === "" || data[key] === null || data[key] === undefined) {
        delete data[key];
      }
    });

    return data;
  };

  // دالة إرسال النموذج 
    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    
    try {
      setLoading(true);
      
      // التحقق من البيانات
      if (!formData.nameAr.trim()) {
        throw new Error("يرجى إدخال اسم العميل بالعربية");
      }

      if (!formData.commentAr.trim()) {
        throw new Error("يرجى إدخال نص الشهادة بالعربية");
      }

      if (!formData.serviceType) {
        throw new Error("يرجى اختيار نوع الخدمة");
      }

      if (formData.rating < 1 || formData.rating > 5) {
        throw new Error("التقييم يجب أن يكون بين 1 و 5");
      }

      // تحضير البيانات
      const testimonialData = prepareTestimonialData();
      
      console.log("📝 بيانات الشهادة جاهزة للإرسال:", testimonialData);

      // ✅ فقط تمرير البيانات إلى onSubmit (في AdminDashboard)
      if (onSubmit && typeof onSubmit === 'function') {
        await onSubmit(testimonialData);
      }

      // عرض رسالة النجاح
      setSuccess(true);
      setSuccessMessage("✅ تم إرسال البيانات بنجاح!");
      
      // إعادة تعيين النموذج
      setTimeout(() => {
        handleResetForm();
      }, 300);

      // إغلاق النافذة بعد 1.5 ثانية
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (error) {
      console.error("❌ خطأ في إعداد البيانات:", error);
      
      // رسالة الخطأ للمستخدم
      let errorMessage = error.message || "حدث خطأ غير متوقع";
      
      setError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  // دالة رفع الصورة
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        throw new Error("نوع الملف غير مدعوم. يرجى اختيار صورة (JPG, PNG, GIF, WebP, SVG)");
      }
      
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("حجم الصورة كبير جداً. الحد الأقصى هو 5MB");
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, image: event.target.result }));
        setImageError(false);
      };
      reader.onerror = () => {
        throw new Error("حدث خطأ أثناء قراءة الصورة");
      };
      reader.readAsDataURL(file);
    } catch (uploadError) {
      setError(uploadError.message);
      setImageError(true);
    }
  };

  // دالة معالجة خطأ الصورة
  const handleImageError = (e) => {
    setImageError(true);
    e.target.onerror = null;
    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f5f5f5'/%3E%3Cpath d='M50 50h100v100H50z' fill='%23e0e0e0'/%3E%3Ctext x='100' y='110' text-anchor='middle' font-family='Arial' font-size='16' fill='%23999'%3Eشهادة%3C/text%3E%3C/svg%3E";
  };

  // دالة تغيير رابط الصورة
  const handleImageUrlChange = (url) => {
    if (url.trim() === "") {
      setFormData(prev => ({ ...prev, image: "" }));
      setImageError(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setFormData(prev => ({ ...prev, image: url }));
      setImageError(false);
    };
    img.onerror = () => {
      setError("❌ رابط الصورة غير صحيح أو لا يمكن تحميله");
      setImageError(true);
    };
    img.src = url;
  };

  // دالة التغيير العامة
  const handleChange = (field, value) => {
    setError("");
    setSuccess(false);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // دالة إعادة تعيين النموذج
  const handleResetForm = () => {
    setFormData({
      nameAr: "",
      nameEn: "",
      positionAr: "",
      positionEn: "",
      commentAr: "",
      commentEn: "",
      rating: 5,
      location: "",
      image: "",
      serviceType: "",
      projectType: "residential",
      email: "",
      phone: "",
      approved: true,
      status: "approved",
      isFeatured: false
    });
    setError("");
    setSuccess(false);
    setImageError(false);
  };

  // دالة الإغلاق
  const handleClose = () => {
    if (loading) {
      const confirmClose = window.confirm("جاري إضافة الشهادة، هل تريد إلغاء العملية؟");
      if (!confirmClose) return;
    }
    
    if (success) {
      onClose();
    } else {
      const confirmClose = window.confirm("لم يتم حفظ التغييرات، هل تريد المغادرة؟");
      if (confirmClose) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <IconMessage className="ml-2" />
              إضافة شهادة جديدة
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {loading ? "جاري الإضافة..." : success ? "تمت الإضافة بنجاح!" : "املأ النموذج لإضافة شهادة جديدة"}
            </p>
          </div>
          <button 
            onClick={handleClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            disabled={loading}
          >
            <IconX className="w-6 h-6" />
          </button>
        </div>
        
        {/* رسالة النجاح */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mx-6 mt-4">
            <div className="flex items-center">
              <IconCheck className="text-green-500 ml-2" />
              <div>
                <p className="text-green-700 font-medium">تم بنجاح!</p>
                <p className="text-green-600 text-sm mt-1">
                  {successMessage} سيتم إغلاق النافذة تلقائياً خلال ثانيتين...
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* رسالة الخطأ */}
        {error && !success && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-4">
            <div className="flex items-center">
              <IconAlertCircle className="text-red-500 ml-2" />
              <div>
                <p className="text-red-700 font-medium">حدث خطأ</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* معلومات العميل الأساسية */}
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">معلومات العميل الأساسية *</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم (عربي) *
                </label>
                <input 
                  type="text" 
                  value={formData.nameAr} 
                  onChange={(e) => handleChange('nameAr', e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
                  required 
                  placeholder="أدخل اسم العميل بالعربية"
                  disabled={loading || success}
                  maxLength={100}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم (إنجليزي)
                </label>
                <input 
                  type="text" 
                  value={formData.nameEn} 
                  onChange={(e) => handleChange('nameEn', e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Enter client name in English"
                  disabled={loading || success}
                  maxLength={100}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المنصب/المهنة (عربي)
                </label>
                <input 
                  type="text" 
                  value={formData.positionAr} 
                  onChange={(e) => handleChange('positionAr', e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="مصمم ديكور, مهندس معماري, ..."
                  disabled={loading || success}
                  maxLength={100}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المنصب/المهنة (إنجليزي)
                </label>
                <input 
                  type="text" 
                  value={formData.positionEn} 
                  onChange={(e) => handleChange('positionEn', e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Interior Designer, Architect, ..."
                  disabled={loading || success}
                  maxLength={100}
                />
              </div>
            </div>
          </div>
          
          {/* معلومات الاتصال */}
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">معلومات الاتصال</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => handleChange('email', e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="example@email.com"
                  disabled={loading || success}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف
                </label>
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={(e) => handleChange('phone', e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="+966 5X XXX XXXX"
                  disabled={loading || success}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الموقع/المدينة
              </label>
              <input 
                type="text" 
                value={formData.location} 
                onChange={(e) => handleChange('location', e.target.value)} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="الرياض, جدة, دبي, ..."
                disabled={loading || success}
                maxLength={100}
              />
            </div>
          </div>
          
          {/* نوع المشروع والخدمة */}
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">نوع المشروع والخدمة *</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع المشروع
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => handleChange('projectType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  disabled={loading || success}
                >
                  <option value="residential">سكني</option>
                  <option value="commercial">تجاري</option>
                  <option value="both">سكني وتجاري</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع الخدمة *
                </label>
                <select
                  value={formData.serviceType}
                  onChange={(e) => handleChange('serviceType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  required
                  disabled={loading || success}
                >
                  {serviceTypes.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label.ar}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* صورة العميل/الشهادة */}
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              <IconCertificate className="inline ml-2" />
              صورة العميل أو الشهادة (اختياري)
            </h3>
            
            <div className="flex flex-col items-center">
              {formData.image && !imageError ? (
                <div className="relative mb-4">
                  <img 
                    src={formData.image} 
                    alt="صورة الشهادة" 
                    className="max-w-full h-auto max-h-64 rounded-lg object-contain border-2 border-gray-200 shadow-md p-2 bg-white"
                    onError={handleImageError}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, image: "" }));
                      setImageError(false);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-md"
                    disabled={loading || success}
                  >
                    <IconX className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-sm h-48 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center mb-4 p-6">
                  <IconCertificate className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-gray-500 text-sm text-center">
                    يمكنك إضافة صورة شخصية للعميل<br />
                    أو صورة شهادة أو لوجو الشركة
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                <label className={`inline-flex items-center justify-center px-4 py-2.5 rounded-lg font-medium cursor-pointer transition-all duration-300 flex-1 ${
                  loading || success
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200'
                }`}>
                  <IconFolder className="ml-2" />
                  <span>{formData.image ? "تغيير الصورة" : "رفع صورة"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={loading || success}
                  />
                </label>
                
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, image: "" }));
                    setImageError(false);
                  }}
                  disabled={loading || success || !formData.image}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-300 flex-1 ${
                    loading || success || !formData.image
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  إزالة الصورة
                </button>
              </div>
              
              <div className="w-full mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  أو أدخل رابط الصورة:
                </label>
                <input 
                  type="url" 
                  value={formData.image} 
                  onChange={(e) => handleImageUrlChange(e.target.value)} 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="https://example.com/certificate.jpg"
                  disabled={loading || success}
                />
              </div>
            </div>
          </div>
          
          {/* نص الشهادة */}
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">نص الشهادة *</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نص الشهادة (عربي) *
              </label>
              <textarea 
                value={formData.commentAr} 
                onChange={(e) => handleChange('commentAr', e.target.value)} 
                rows="4" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200" 
                required 
                placeholder="أدخل نص الشهادة بالعربية..."
                disabled={loading || success}
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {formData.commentAr.length}/500
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نص الشهادة (إنجليزي)
              </label>
              <textarea 
                value={formData.commentEn} 
                onChange={(e) => handleChange('commentEn', e.target.value)} 
                rows="4" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter testimonial text in English..."
                disabled={loading || success}
                maxLength={500}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {formData.commentEn.length}/500
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                التقييم *
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleChange('rating', star)}
                      className="p-1 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading || success}
                    >
                      <IconStar 
                        className={`w-8 h-8 ${star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
                <div className="mr-auto">
                  <span className="text-gray-700 font-semibold text-lg">
                    {formData.rating}/5
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* الإعدادات */}
          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">إعدادات الشهادة</h3>
            
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl mb-6 border border-gray-200">
              <div className="flex-1 mb-4 sm:mb-0 sm:mr-4">
                <div className="flex items-center mb-2">
                  <IconStar className="text-yellow-500 ml-2" />
                  <span className="font-bold text-lg text-gray-900">هل الشهادة مميزة؟</span>
                </div>
                <p className="text-gray-600 text-sm">
                  {formData.isFeatured 
                    ? "⭐ ستظهر الشهادة في الأقسام المميزة على الموقع وتكون بارزة للزوار" 
                    : "ستظهر الشهادة في القسم العام مع باقي الشهادات"}
                </p>
              </div>
              
              <div className="relative">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange('isFeatured', e.target.checked)}
                  disabled={loading || success}
                  className="sr-only"
                />
                <label
                  htmlFor="isFeatured"
                  className={`
                    relative inline-flex items-center justify-between w-36 h-12 px-4
                    rounded-xl cursor-pointer transition-all duration-300
                    shadow-md border-2
                    ${formData.isFeatured 
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 border-yellow-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }
                    ${loading || success ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}
                  `}
                >
                  <span className="font-semibold text-sm">
                    {formData.isFeatured ? 'مميزة ' : 'غير مميزة'}
                  </span>
                  <div className="flex items-center">
                    {formData.isFeatured && (
                      <IconStar className="w-5 h-5 mr-2 text-white" />
                    )}
                    <div className={`
                      w-7 h-7 rounded-lg flex items-center justify-center
                      ${formData.isFeatured ? 'bg-white/20' : 'bg-gray-100'}
                    `}>
                      {formData.isFeatured ? (
                        <IconCheck className="w-4 h-4 text-white" />
                      ) : (
                        <IconStar className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          {/* أزرار التحكم */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={handleResetForm}
                disabled={loading || success}
                className="px-5 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl font-medium transition-all duration-200 border border-gray-300 hover:border-gray-400 disabled:opacity-50"
              >
                إعادة تعيين النموذج
              </button>
              <button 
                type="button" 
                onClick={handleClose}
                disabled={loading}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl font-medium transition-all duration-200 border border-gray-300 hover:border-gray-400 disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
            
            <button 
              type="submit" 
              disabled={loading || success}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-3"></div>
                  جاري الإضافة...
                </>
              ) : success ? (
                <>
                  <IconCheck className="ml-3" />
                  تمت الإضافة بنجاح ✓
                </>
              ) : (
                <>
                  <IconCheck className="ml-3" />
                  إضافة الشهادة
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// القيم الافتراضية
AddTestimonialModal.defaultProps = {
  currentUser: {
    email: "admin@system.com"
  }
};

export default AddTestimonialModal;