import React, { useState } from 'react';
import { 
  IconX, 
  IconLock, 
  IconShield, 
  IconCheck,
  IconEye,
  IconEyeOff,
  IconAlertCircle
} from '../../Icons';

const PasswordModal = ({ 
  onClose, 
  onSubmit, 
  userData = {},
  currentUser = {}, // المستخدم الحالي المسجل دخوله
  showNotification,
  isAdmin = false // معلمة جديدة للتحقق من الصلاحية
}) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordSuggestions, setPasswordSuggestions] = useState([]);

  // التحقق من الصلاحية باستخدام المعلمة الممررة
  const canChangePassword = isAdmin;
  
  // تحقق إذا كان المستخدم الحالي هو نفسه المستخدم المستهدف
  const isChangingOwnPassword = currentUser?.email === userData?.email || currentUser?.uid === userData?.uid;

  // تحليل قوة كلمة المرور
  const analyzePasswordStrength = (password) => {
    let strength = 0;
    const suggestions = [];
    
    if (password.length >= 8) strength += 1;
    else suggestions.push("أقل من 8 أحرف");
    
    if (/[A-Z]/.test(password)) strength += 1;
    else suggestions.push("أضف حرف كبير");
    
    if (/[a-z]/.test(password)) strength += 1;
    else suggestions.push("أضف حرف صغير");
    
    if (/[0-9]/.test(password)) strength += 1;
    else suggestions.push("أضف رقم");
    
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    else suggestions.push("أضف رمز خاص (@#!$)");
    
    setPasswordStrength(strength);
    setPasswordSuggestions(suggestions);
    
    return strength;
  };

  const handlePasswordChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'newPassword') {
      analyzePasswordStrength(value);
    }
    
    // مسح الخطأ عند البدء بالكتابة
    if (error) setError("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePassword = () => {
    const { newPassword, confirmPassword } = formData;
    
    // التحقق من التطابق
    if (newPassword !== confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return false;
    }
    
    // التحقق من الطول
    if (newPassword.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      return false;
    }
    
    // التحقق من القوة
    const strength = analyzePasswordStrength(newPassword);
    if (strength < 3) {
      setError("كلمة المرور ضعيفة جداً. يرجى استخدام كلمة مرور أقوى");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // ✅ التحقق من الصلاحية: المسؤول فقط يمكنه تغيير كلمات المرور
    if (!canChangePassword) {
      setError("❌ عذراً، هذه الخاصية متاحة فقط لمدير النظام");
      showNotification?.("error", "❌ عذراً، هذه الخاصية متاحة فقط لمدير النظام");
      return;
    }

    // التحقق من صحة البيانات
    if (!validatePassword()) {
      return;
    }

    try {
      setLoading(true);
      
      // إرسال كلمة المرور الجديدة فقط (لم يعد هناك حاجة لإعادة المصادقة)
      await onSubmit(formData.newPassword);
      
      // إغلاق المودال بعد النجاح
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (error) {
      console.error("Error changing password:", error);
      
      // معالجة أخطاء Firebase
      let errorMsg = "فشل تغيير كلمة المرور: ";
      
      if (error.code === "auth/requires-recent-login") {
        errorMsg = "يلزم إعادة تسجيل الدخول. يرجى تسجيل الخروج والدخول مرة أخرى.";
      } else if (error.code === "auth/weak-password") {
        errorMsg = "كلمة المرور ضعيفة جداً.";
      } else if (error.code === "auth/not-authorized") {
        errorMsg = "غير مصرح لك بتنفيذ هذه العملية.";
      } else {
        errorMsg += error.message || "حدث خطأ غير معروف";
      }
      
      setError(errorMsg);
      showNotification?.("error", `❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // مؤشر قوة كلمة المرور
  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 2) return "bg-orange-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    if (passwordStrength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return "ضعيفة جداً";
    if (passwordStrength <= 2) return "ضعيفة";
    if (passwordStrength <= 3) return "متوسطة";
    if (passwordStrength <= 4) return "قوية";
    return "قوية جداً";
  };

  // الحصول على اسم الدور
  const getRoleName = (role) => {
    switch(role) {
      case "super_admin": return "المدير العام";
      case "admin": return "مدير النظام";
      case "editor": return "محرر محتوى";
      case "viewer": return "مشاهد";
      default: return "مستخدم";
    }
  };

  // الحصول على لون الدور
  const getRoleColor = (role) => {
    switch(role) {
      case "super_admin":
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "editor":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "viewer":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* الهيدر */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <IconLock className="ml-2 w-5 h-5" />
            {canChangePassword ? "تغيير كلمة المرور" : "غير مصرح"}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>
        
        {/* معلومات المستخدم */}
        <div className="px-6 pt-6">
          <div className={`rounded-xl p-4 mb-4 ${canChangePassword ? 'bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200' : 'bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200'}`}>
            <div className="flex items-center mb-2">
              <IconShield className={`w-5 h-5 ml-2 ${canChangePassword ? 'text-blue-600' : 'text-gray-400'}`} />
              <span className={`font-medium ${canChangePassword ? 'text-blue-800' : 'text-gray-600'}`}>
                {isChangingOwnPassword ? "تغيير كلمة المرور الخاصة بك" : "تغيير كلمة المرور للمستخدم:"}
              </span>
            </div>
            <p className={`truncate ${canChangePassword ? 'text-blue-700' : 'text-gray-600'}`} title={userData?.email}>
              {userData?.email || "مستخدم"}
            </p>
            {userData?.name && (
              <p className={`text-sm mt-1 ${canChangePassword ? 'text-blue-600' : 'text-gray-500'}`}>
                {userData.name}
              </p>
            )}
            <div className={`mt-2 px-2 py-1 rounded text-xs font-medium text-center inline-block ${getRoleColor(userData?.role)}`}>
              {getRoleName(userData?.role)}
            </div>
            
            {/* معلومات عن الصلاحية */}
            <div className="mt-3 text-xs">
              {canChangePassword ? (
                <div className="flex items-center text-green-600">
                  <IconCheck className="w-3 h-3 ml-1" />
                  <span>لديك صلاحية تغيير كلمة المرور</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <IconAlertCircle className="w-3 h-3 ml-1" />
                  <span>لا تملك صلاحية تغيير كلمة المرور</span>
                </div>
              )}
            </div>

            {/* رسالة مهمة للمسؤولين */}
            {canChangePassword && (
              <div className="mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
                <div className="flex items-start gap-2">
                  <IconShield className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">ملاحظة هامة:</span>
                    <p className="mt-0.5">سيتطلب المستخدم استخدام كلمة المرور الجديدة عند تسجيل الدخول القادم.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* النموذج */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {canChangePassword ? (
            <>
              {/* كلمة المرور الجديدة */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور الجديدة *
                </label>
                <div className="relative">
                  <input 
                    type={showPasswords.new ? "text" : "password"} 
                    value={formData.newPassword}
                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required 
                    placeholder="أدخل كلمة المرور الجديدة"
                    disabled={loading}
                    minLength="8"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    disabled={loading}
                  >
                    {showPasswords.new ? (
                      <IconEyeOff className="w-5 h-5" />
                    ) : (
                      <IconEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* مؤشر قوة كلمة المرور */}
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">قوة كلمة المرور:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength <= 2 ? "text-red-600" :
                        passwordStrength <= 3 ? "text-yellow-600" :
                        "text-green-600"
                      }`}>
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    
                    {/* تلميحات لتحسين كلمة المرور */}
                    {passwordSuggestions.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        <p className="font-medium mb-1">لتحسين كلمة المرور:</p>
                        <ul className="space-y-1">
                          {passwordSuggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-center">
                              <IconAlertCircle className="w-3 h-3 text-red-400 ml-1" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* تأكيد كلمة المرور */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور *
                </label>
                <div className="relative">
                  <input 
                    type={showPasswords.confirm ? "text" : "password"} 
                    value={formData.confirmPassword}
                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required 
                    placeholder="أعد إدخال كلمة المرور"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    disabled={loading}
                  >
                    {showPasswords.confirm ? (
                      <IconEyeOff className="w-5 h-5" />
                    ) : (
                      <IconEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* تحقق من التطابق */}
                {formData.confirmPassword && formData.newPassword && (
                  <div className="mt-2">
                    {formData.newPassword === formData.confirmPassword ? (
                      <div className="flex items-center text-green-600 text-sm">
                        <IconCheck className="w-4 h-4 ml-1" />
                        <span>كلمات المرور متطابقة</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600 text-sm">
                        <IconAlertCircle className="w-4 h-4 ml-1" />
                        <span>كلمات المرور غير متطابقة</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* نصائح كلمة المرور */}
              <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <IconShield className="w-4 h-4 ml-1" />
                  نصائح لأمان أفضل
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• استخدم 8 أحرف على الأقل</li>
                  <li>• اخلط بين الأحرف الكبيرة والصغيرة</li>
                  <li>• أضف أرقاماً ورموزاً خاصة</li>
                  <li>• تجنب استخدام كلمات شائعة</li>
                  <li>• لا تستخدم نفس كلمة المرور في مواقع متعددة</li>
                  <li>• غير كلمة المرور كل 3-6 أشهر</li>
                </ul>
              </div>
            </>
          ) : (
            /* عرض رسالة للمستخدمين غير المسؤولين */
            <div className="py-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <IconShield className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">غير مصرح لك</h3>
              <p className="text-gray-600 mb-4">
                هذه الخاصية متاحة فقط لمدير النظام.
                <br />
                صلاحيتك الحالية: <span className="font-medium">{getRoleName(currentUser?.role)}</span>
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
                <div className="flex items-start gap-2">
                  <IconAlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-700 text-sm">
                      <span className="font-medium">للتغيير كلمة مرورك:</span>
                      <br />
                      1. تواصل مع مدير النظام
                      <br />
                      2. اطلب منه تغيير كلمة المرور من لوحة التحكم
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* رسالة الخطأ */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <IconAlertCircle className="w-5 h-5 ml-2" />
                <p className="flex-1">{error}</p>
              </div>
            </div>
          )}
          
          {/* أزرار */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              إغلاق
            </button>
            
            {canChangePassword && (
              <button 
                type="submit" 
                disabled={loading || !formData.newPassword || !formData.confirmPassword}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                    جاري التغيير...
                  </>
                ) : (
                  <>
                    <IconCheck className="ml-2 w-5 h-5" />
                    {isChangingOwnPassword ? "تغيير كلمة مروري" : "تغيير كلمة مرور المستخدم"}
                  </>
                )}
              </button>
            )}
          </div>
        </form>
        
        {/* رسالة التأكيد للمسؤولين فقط */}
        {canChangePassword && (
          <div className="px-6 pb-6">
            <div className="text-xs text-gray-500">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="font-medium text-gray-700 mb-1">⚠️ تنبيهات أمان:</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• تأكد من تذكر كلمة المرور الجديدة</li>
                  <li>• استخدم كلمة مرور قوية وفريدة</li>
                  <li>• لا تشارك كلمة المرور مع أي شخص</li>
                  <li>• سجل كلمة المرور في مكان آمن إذا لزم الأمر</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// القيم الافتراضية
PasswordModal.defaultProps = {
  userData: {},
  currentUser: {},
  showNotification: () => {},
  isAdmin: false
};

export default PasswordModal;