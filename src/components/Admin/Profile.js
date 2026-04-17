// src/components/Admin/Profile.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  IconMail, 
  IconPhone, 
  IconCalendar, 
  IconMapPin, 
  IconLock, 
  IconShield, 
  IconLogout, 
  IconCamera, 
  IconGlobe,
  IconUser,
  IconFolder,
  IconEdit,
  IconX,
  IconCheck,
  IconInfo,
  IconEye,
  IconEyeOff,
  IconCopy
} from '../../components/Icons';
  
import { auth, db } from '../../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import toast from 'react-hot-toast';

// ✅ مكون مودال تغيير كلمة المرور (مضمن في نفس الملف)
const PasswordModal = ({ onClose, onSubmit, userData, isAdmin, showNotification }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // دالة التحقق من صحة كلمة المرور
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }
    if (!/[A-Z]/.test(password)) {
      return "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل";
    }
    if (!/[a-z]/.test(password)) {
      return "كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل";
    }
    if (!/[0-9]/.test(password)) {
      return "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل";
    }
    return "";
  };

  // دالة قياس قوة كلمة المرور
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  // دالة الحصول على لون قوة كلمة المرور
  const getPasswordStrengthColor = (strength) => {
    if (strength <= 2) return 'bg-red-500';
    if (strength === 3) return 'bg-yellow-500';
    if (strength === 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // دالة الحصول على نص قوة كلمة المرور
  const getPasswordStrengthText = (strength) => {
    if (strength <= 2) return 'ضعيفة';
    if (strength === 3) return 'متوسطة';
    if (strength === 4) return 'جيدة';
    return 'قوية جداً';
  };

  // دالة توليد كلمة مرور عشوائية
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const length = 12;
    let password = '';
    
    password += chars.charAt(Math.floor(Math.random() * 26));
    password += chars.charAt(26 + Math.floor(Math.random() * 26));
    password += chars.charAt(52 + Math.floor(Math.random() * 10));
    password += chars.charAt(62 + Math.floor(Math.random() * 8));
    
    for (let i = 4; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    return password;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'newPassword') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من أن المستخدم مدير
    if (!isAdmin) {
      showNotification('error', 'عذراً، هذه الخاصية متاحة فقط لمدير النظام');
      onClose();
      return;
    }

    // التحقق من صحة كلمة المرور الجديدة
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      showNotification('error', passwordError);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showNotification('error', 'كلمات المرور الجديدة غير متطابقة');
      return;
    }

    setLoading(true);

    try {
      // إعادة مصادقة المستخدم قبل تغيير كلمة المرور
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email,
        formData.currentPassword
      );
      
      await reauthenticateWithCredential(user, credential);
      
      // تغيير كلمة المرور في Firebase Authentication
      await updatePassword(user, formData.newPassword);
      
      // تحديث تاريخ آخر تغيير في Firestore
      await updateDoc(doc(db, "adminUsers", user.uid), {
        lastPasswordChange: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // استدعاء الدالة الأصلية لتحديث الحالة
      await onSubmit(formData.newPassword);
      
      showNotification('success', '✅ تم تغيير كلمة المرور بنجاح');
      onClose();
    } catch (error) {
      console.error('Error changing password:', error);
      
      if (error.code === 'auth/wrong-password') {
        showNotification('error', 'كلمة المرور الحالية غير صحيحة');
      } else if (error.code === 'auth/requires-recent-login') {
        showNotification('error', 'يرجى تسجيل الخروج ثم الدخول مرة أخرى');
      } else {
        showNotification('error', 'حدث خطأ أثناء تغيير كلمة المرور');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <IconLock className="ml-2" /> تغيير كلمة المرور
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <IconX />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* تنبيه للمستخدم غير المدير */}
          {!isAdmin && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <IconInfo className="w-5 h-5" />
                <p className="text-sm">هذه الخاصية متاحة فقط لمدير النظام</p>
              </div>
            </div>
          )}

          {/* كلمة المرور الحالية */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور الحالية
              <span className="text-red-500 mr-1">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل كلمة المرور الحالية"
                required
                disabled={!isAdmin}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* كلمة المرور الجديدة */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                كلمة المرور الجديدة
                <span className="text-red-500 mr-1">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  const newPassword = generateRandomPassword();
                  setFormData(prev => ({
                    ...prev,
                    newPassword,
                    confirmPassword: newPassword
                  }));
                  setPasswordStrength(checkPasswordStrength(newPassword));
                  showNotification('info', 'تم توليد كلمة مرور قوية تلقائياً');
                }}
                disabled={!isAdmin}
                className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-lg transition-colors flex items-center disabled:opacity-50"
              >
                <IconLock className="w-3 h-3 ml-1" />
                توليد كلمة مرور
              </button>
            </div>
            
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أدخل كلمة المرور الجديدة (8 أحرف على الأقل)"
                required
                disabled={!isAdmin}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
              </button>
              {formData.newPassword && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(formData.newPassword);
                    showNotification('success', 'تم نسخ كلمة المرور إلى الحافظة');
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
                >
                  <IconCopy className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* مؤشر قوة كلمة المرور */}
            {formData.newPassword && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">قوة كلمة المرور:</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength <= 2 ? 'text-red-600' :
                    passwordStrength === 3 ? 'text-yellow-600' :
                    passwordStrength === 4 ? 'text-blue-600' :
                    'text-green-600'
                  }`}>
                    {getPasswordStrengthText(passwordStrength)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getPasswordStrengthColor(passwordStrength)} transition-all duration-300`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* تأكيد كلمة المرور الجديدة */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تأكيد كلمة المرور الجديدة
              <span className="text-red-500 mr-1">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="أعد إدخال كلمة المرور الجديدة"
                required
                disabled={!isAdmin}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
              </button>
            </div>

            {/* مؤشر المطابقة */}
            {formData.newPassword && formData.confirmPassword && (
              <div className="mt-2">
                {formData.newPassword === formData.confirmPassword ? (
                  <div className="flex items-center text-green-600 text-sm">
                    <IconCheck className="w-4 h-4 ml-2" />
                    <span>كلمات المرور متطابقة ✓</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 text-sm">
                    <IconX className="w-4 h-4 ml-2" />
                    <span>كلمات المرور غير متطابقة ✗</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* أزرار التحكم */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading || !isAdmin}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري التغيير...
                </span>
              ) : "تغيير كلمة المرور"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ✅ المكون الرئيسي للملف الشخصي
const Profile = ({ currentUser }) => {
  // بيانات الدول والمدن (عالمية)
  const countriesWithCities = useMemo(() => [
    {
      id: 'SA',
      name: 'السعودية',
      cities: [
        { id: 'SA-1', name: 'الرياض', region: 'منطقة الرياض' },
        { id: 'SA-2', name: 'جدة', region: 'منطقة مكة المكرمة' },
        { id: 'SA-3', name: 'الدمام', region: 'المنطقة الشرقية' },
        { id: 'SA-4', name: 'مكة المكرمة', region: 'منطقة مكة المكرمة' },
        { id: 'SA-5', name: 'المدينة المنورة', region: 'منطقة المدينة المنورة' },
        { id: 'SA-6', name: 'الخرج', region: 'منطقة الرياض' },
        { id: 'SA-7', name: 'تبوك', region: 'منطقة تبوك' },
        { id: 'SA-8', name: 'القصيم', region: 'منطقة القصيم' },
        { id: 'SA-9', name: 'حائل', region: 'منطقة حائل' },
        { id: 'SA-10', name: 'أبها', region: 'منطقة عسير' },
      ]
    },
    {
      id: 'PS',
      name: 'فلسطين',
      cities: [
        { id: 'PS-1', name: 'القدس', region: 'محافظة القدس' },
        { id: 'PS-2', name: 'غزة', region: 'محافظة غزة' },
        { id: 'PS-3', name: 'رام الله', region: 'محافظة رام الله والبيرة' },
        { id: 'PS-4', name: 'الخليل', region: 'محافظة الخليل' },
        { id: 'PS-5', name: 'نابلس', region: 'محافظة نابلس' },
        { id: 'PS-6', name: 'بيت لحم', region: 'محافظة بيت لحم' },
        { id: 'PS-7', name: 'أريحا', region: 'محافظة أريحا' },
        { id: 'PS-8', name: 'جنين', region: 'محافظة جنين' },
        { id: 'PS-9', name: 'طولكرم', region: 'محافظة طولكرم' },
        { id: 'PS-10', name: 'قلقيلية', region: 'محافظة قلقيلية' },
      ]
    },
    {
      id: 'AE',
      name: 'الإمارات العربية المتحدة',
      cities: [
        { id: 'AE-1', name: 'دبي', region: 'إمارة دبي' },
        { id: 'AE-2', name: 'أبوظبي', region: 'إمارة أبوظبي' },
        { id: 'AE-3', name: 'الشارقة', region: 'إمارة الشارقة' },
        { id: 'AE-4', name: 'عجمان', region: 'إمارة عجمان' },
        { id: 'AE-5', name: 'رأس الخيمة', region: 'إمارة رأس الخيمة' },
      ]
    },
    {
      id: 'QA',
      name: 'قطر',
      cities: [
        { id: 'QA-1', name: 'الدوحة', region: 'بلدية الدوحة' },
        { id: 'QA-2', name: 'الريان', region: 'بلدية الريان' },
        { id: 'QA-3', name: 'أم صلال', region: 'بلدية أم صلال' },
      ]
    },
    {
      id: 'KW',
      name: 'الكويت',
      cities: [
        { id: 'KW-1', name: 'الكويت', region: 'محافظة العاصمة' },
        { id: 'KW-2', name: 'حولي', region: 'محافظة حولي' },
        { id: 'KW-3', name: 'الفروانية', region: 'محافظة الفروانية' },
      ]
    },
  ], []);

  const roles = useMemo(() => [
    { id: 'super_admin', name: 'المدير العام', permissions: ['all'], canChangePassword: true },
    { id: 'admin', name: 'مدير النظام', permissions: ['all'], canChangePassword: true },
    { id: 'editor', name: 'محرر محتوى', permissions: ['read', 'write'], canChangePassword: false },
    { id: 'viewer', name: 'مشاهد', permissions: ['read'], canChangePassword: false },
  ], []);

  // البيانات الافتراضية للمستخدم
  const initialUserData = useMemo(() => ({
    uid: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    roleName: '',
    joinDate: '',
    address: '',
    city: '',
    cityId: '',
    country: '',
    countryId: '',
    bio: '',
    avatarColor: '#F97316',
    permissions: [],
    lastLogin: '',
    isActive: true,
    lastPasswordChange: null,
    department: '',
    createdBy: '',
    createdById: '',
    createdAt: null,
    canChangePassword: false
  }), []);
  
  const [userData, setUserData] = useState({ ...initialUserData });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...initialUserData });
  const [isLoading, setIsLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  
  // حالة PasswordModal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // ✅ التحقق من صلاحيات المستخدم
  const userRole = userData?.role || 'viewer';
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  const isEditor = userRole === 'editor';
  const isViewerOnly = userRole === 'viewer';
  const canChangePassword = isAdmin; // فقط المدير يمكنه تغيير كلمة المرور
  const canEditProfile = !isViewerOnly; // المشاهدون فقط لا يمكنهم التعديل
  
  // ✅ الحصول على المدن الخاصة بدولة معينة
  const getCitiesByCountry = useCallback((countryId) => {
    const country = countriesWithCities.find(c => c.id === countryId);
    return country ? country.cities : [];
  }, [countriesWithCities]);
  
  // ✅ دالة لتحميل بيانات المستخدم من Firestore
  const loadUserDataFromFirestore = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (!auth.currentUser || !auth.currentUser.uid) {
        console.error("No user logged in");
        return initialUserData;
      }

      const userDoc = await getDoc(doc(db, "adminUsers", auth.currentUser.uid));
      
      if (!userDoc.exists()) {
        console.error("User not found in Firestore");
        return initialUserData;
      }

      const firestoreData = userDoc.data();
      
      // تحديد إذا كان المستخدم يمكنه تغيير كلمة المرور
      const userCanChangePassword = firestoreData.role === 'admin' || firestoreData.role === 'super_admin';
      
      // تنسيق البيانات من Firestore
      const formattedData = {
        uid: auth.currentUser.uid,
        name: firestoreData.name || auth.currentUser.displayName || '',
        email: firestoreData.email || auth.currentUser.email || '',
        phone: firestoreData.phone || '',
        role: firestoreData.role || 'viewer',
        roleName: roles.find(r => r.id === firestoreData.role)?.name || 'مستخدم',
        joinDate: firestoreData.createdAt?.toDate?.()?.toLocaleDateString('ar-SA') || new Date().toLocaleDateString('ar-SA'),
        address: firestoreData.address || '',
        city: firestoreData.city || '',
        cityId: firestoreData.cityId || '',
        country: firestoreData.country || '',
        countryId: firestoreData.countryId || '',
        bio: firestoreData.bio || '',
        avatarColor: firestoreData.avatarColor || '#F97316',
        permissions: firestoreData.permissions || [],
        lastLogin: firestoreData.lastLogin?.toDate?.()?.toLocaleString('ar-SA') || '',
        isActive: firestoreData.isActive !== false,
        lastPasswordChange: firestoreData.lastPasswordChange?.toDate?.() || null,
        department: firestoreData.department || '',
        createdBy: firestoreData.createdBy || 'system',
        createdById: firestoreData.createdById || '',
        createdAt: firestoreData.createdAt?.toDate?.() || null,
        canChangePassword: userCanChangePassword
      };

      return formattedData;
      
    } catch (error) {
      console.error("Error loading user data from Firestore:", error);
      return initialUserData;
    }
  }, [initialUserData, roles]);
  
  // ✅ دالة لحفظ البيانات في Firestore
  const saveUserDataToFirestore = useCallback(async (data) => {
    try {
      if (!auth.currentUser || !auth.currentUser.uid) {
        throw new Error("No user logged in");
      }

      const updateData = {
        name: data.name,
        phone: data.phone || '',
        country: data.country || '',
        countryId: data.countryId || '',
        city: data.city || '',
        cityId: data.cityId || '',
        bio: data.bio || '',
        department: data.department || '',
        updatedAt: serverTimestamp(),
        address: data.address || `${data.city}, ${data.country}`
      };

      await updateDoc(doc(db, "adminUsers", auth.currentUser.uid), updateData);
      
      return true;
    } catch (error) {
      console.error("Error saving user data to Firestore:", error);
      toast.error("❌ فشل في حفظ البيانات في قاعدة البيانات");
      return false;
    }
  }, []);
  
  // ✅ دالة fetchUserData
  const fetchUserData = useCallback(async () => {
    try {
      const userDataFromFirestore = await loadUserDataFromFirestore();
      
      setUserData(userDataFromFirestore);
      setFormData(userDataFromFirestore);
      
      // التحقق إذا كان المستخدم جديداً (لا يوجد اسم)
      const hasBasicData = userDataFromFirestore.name && userDataFromFirestore.phone;
      if (!hasBasicData) {
        setIsNewUser(true);
        setIsEditing(true);
      }
      
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("❌ فشل في تحميل بيانات المستخدم");
    } finally {
      setIsLoading(false);
    }
  }, [loadUserDataFromFirestore]);
  
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);
  
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name === 'countryId') {
      const selectedCountry = countriesWithCities.find(c => c.id === value);
      const cities = selectedCountry ? selectedCountry.cities : [];
      const firstCity = cities.length > 0 ? cities[0] : null;
      
      setFormData(prev => ({ 
        ...prev, 
        countryId: value,
        country: selectedCountry ? selectedCountry.name : '',
        cityId: firstCity ? firstCity.id : '',
        city: firstCity ? firstCity.name : '',
        address: selectedCountry ? `${firstCity ? firstCity.name : ''}, ${selectedCountry.name}` : prev.address
      }));
    } else if (name === 'cityId') {
      const cities = getCitiesByCountry(formData.countryId);
      const selectedCity = cities.find(c => c.id === value);
      
      if (selectedCity) {
        const country = countriesWithCities.find(c => c.id === formData.countryId);
        
        setFormData(prev => ({ 
          ...prev, 
          cityId: value,
          city: selectedCity.name,
          address: `${selectedCity.name}, ${country ? country.name : ''}`
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, [countriesWithCities, formData.countryId, getCitiesByCountry]);
  
  const handleAvatarChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم الصورة يجب أن يكون أقل من 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarFile(reader.result);
        toast.success('تم اختيار صورة جديدة');
      };
      reader.readAsDataURL(file);
    }
  }, []);
  
  const handleSave = useCallback(async () => {
    if (!formData.name.trim()) {
      toast.error('الاسم مطلوب');
      return;
    }
    
    if (!formData.phone.trim()) {
      toast.error('رقم الهاتف مطلوب');
      return;
    }
    
    if (!formData.countryId) {
      toast.error('البلد مطلوب');
      return;
    }
    
    if (!formData.cityId) {
      toast.error('المدينة مطلوبة');
      return;
    }
    
    setIsLoading(true);
    
    const roleName = roles.find(r => r.id === formData.role)?.name || formData.roleName;
    const updatedUserData = {
      ...formData,
      roleName,
      lastLogin: new Date().toLocaleString('ar-SA'),
      updatedAt: new Date().toISOString(),
    };
    
    try {
      const saveSuccess = await saveUserDataToFirestore(updatedUserData);
      
      if (saveSuccess) {
        setUserData(updatedUserData);
        setIsEditing(false);
        setIsNewUser(false);
        
        toast.success('✅ تم حفظ التغييرات بنجاح في قاعدة البيانات');
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error('❌ حدث خطأ أثناء حفظ البيانات');
    } finally {
      setIsLoading(false);
    }
  }, [formData, saveUserDataToFirestore, roles]);
  
  const handleCancel = useCallback(() => {
    if (isNewUser) {
      setFormData({ ...initialUserData, email: userData.email, role: userData.role });
    } else {
      setFormData(userData);
    }
    setIsEditing(false);
    setAvatarFile(null);
  }, [initialUserData, isNewUser, userData]);
    
  // ✅ دالة لتغيير كلمة المرور (للمدير فقط) - تقوم بتحديث Auth و Firestore
  const handleChangePassword = useCallback(async (newPassword) => {
    // التحقق من الصلاحية مرة أخرى قبل التنفيذ
    if (!isAdmin) {
      toast.error('❌ عذراً، هذه الخاصية متاحة فقط لمدير النظام');
      return Promise.reject(new Error('غير مصرح'));
    }
    
    setIsLoading(true);
    
    try {
      // تم تغيير كلمة المرور في Auth داخل PasswordModal
      // هنا فقط نقوم بتحديث Firestore (تم بالفعل في PasswordModal)
      
      const updatedUserData = {
        ...userData,
        lastPasswordChange: new Date(),
        updatedAt: new Date(),
      };
      
      setUserData(updatedUserData);
      
      toast.success('✅ تم تغيير كلمة المرور بنجاح');
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error updating password change date:", error);
      toast.error('❌ حدث خطأ أثناء تغيير كلمة المرور');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userData, isAdmin]);
  
  // ✅ دالة لإظهار نافذة تغيير كلمة المرور مع التحقق من الصلاحية
  const handlePasswordChangeClick = useCallback(() => {
    if (!isAdmin) {
      toast.error('عذراً، هذه الخاصية متاحة فقط لمدير النظام', {
        icon: '🔒',
        duration: 4000
      });
      return;
    }
    setShowPasswordModal(true);
  }, [isAdmin]);
  
  const handleLogoutAllDevices = useCallback(() => {
    auth.signOut().then(() => {
      localStorage.clear();
      sessionStorage.clear();
      
      toast.success('✅ تم تسجيل الخروج بنجاح');
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    }).catch(error => {
      console.error('Logout error:', error);
      toast.error('❌ حدث خطأ أثناء تسجيل الخروج');
    });
  }, []);

  // ✅ دالة الحصول على اسم المدينة من الـ ID
  const getCityNameById = useCallback((cityId) => {
    if (!cityId) return '';
    
    for (const country of countriesWithCities) {
      const city = country.cities.find(c => c.id === cityId);
      if (city) return city.name;
    }
    return '';
  }, [countriesWithCities]);

  // ✅ دالة الحصول على اسم الدولة من الـ ID
  const getCountryNameById = useCallback((countryId) => {
    if (!countryId) return '';
    
    const country = countriesWithCities.find(c => c.id === countryId);
    return country ? country.name : '';
  }, [countriesWithCities]);

  // ✅ دالة لإظهار الإشعارات
  const showNotification = useCallback((type, message) => {
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    } else if (type === 'info') {
      toast(message, { icon: 'ℹ️' });
    }
  }, []);

  // ✅ دالة للحصول على لون الدور
  const getRoleColor = useCallback((role) => {
    switch(role) {
      case 'admin':
      case 'super_admin':
        return 'from-red-500 to-red-600';
      case 'editor':
        return 'from-blue-500 to-blue-600';
      case 'viewer':
        return 'from-slate-500 to-slate-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  }, []);

  // ✅ دالة للحصول على وصف الدور
  const getRoleDescription = useCallback((role) => {
    switch(role) {
      case 'admin':
      case 'super_admin':
        return 'صلاحيات كاملة - يمكنك إدارة كل شيء وتغيير كلمة المرور';
      case 'editor':
        return 'صلاحيات التعديل والإضافة فقط - لا يمكنك تغيير كلمة المرور';
      case 'viewer':
        return 'صلاحيات المشاهدة فقط - لا يمكنك التعديل أو الحذف أو تغيير كلمة المرور';
      default:
        return 'صلاحيات محدودة';
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow border border-slate-200 p-6 animate-pulse">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 bg-slate-200 rounded-full mb-4"></div>
                  <div className="h-6 w-40 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-slate-200 rounded mb-4"></div>
                  <div className="h-3 w-full bg-slate-200 rounded mb-1"></div>
                  <div className="h-3 w-3/4 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow border border-slate-200 p-6 animate-pulse">
                <div className="h-6 w-40 bg-slate-200 rounded mb-6"></div>
                <div className="space-y-4">
                  <div className="h-10 w-full bg-slate-200 rounded"></div>
                  <div className="h-10 w-full bg-slate-200 rounded"></div>
                  <div className="h-24 w-full bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">الملف الشخصي</h1>
            <p className="text-slate-600 mt-2">إدارة معلومات حسابك الشخصي وإعدادات الحساب</p>
            
            {isNewUser && (
              <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <IconInfo className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-amber-900">مرحباً بك! يرجى إكمال ملفك الشخصي</h5>
                    <p className="text-sm text-amber-700 mt-1">هذا هو أول دخول لك، يرجى تعبئة معلوماتك الشخصية للحصول على أفضل تجربة استخدام</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* بطاقة معلومات المستخدم */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 h-fit sticky top-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    <div 
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center"
                      style={{ backgroundColor: userData.avatarColor }}
                    >
                      {avatarFile ? (
                        <img 
                          src={avatarFile} 
                          alt={userData.name} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : userData.name ? (
                        <span className="text-white font-bold text-4xl">
                          {userData.name.charAt(0)}
                        </span>
                      ) : (
                        <IconUser className="w-14 h-14 text-white opacity-80" />
                      )}
                    </div>
                    
                    {isEditing && canEditProfile && (
                      <label className="absolute bottom-2 right-2 bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-full shadow-lg cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all">
                        <IconCamera className="w-5 h-5 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    )}
                    
                    {userData.name && (
                      <div className="absolute top-0 left-0">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${userData.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                          {userData.isActive ? 'نشط' : 'غير نشط'}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {userData.name ? (
                    <>
                      <h2 className="text-xl font-bold text-slate-900">{userData.name}</h2>
                      <div className={`mt-2 px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${getRoleColor(userData.role)} text-white`}>
                        {userData.roleName}
                      </div>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-slate-900">مستخدم جديد</h2>
                      <div className="mt-2 px-4 py-1.5 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full text-sm font-medium">
                        {userData.roleName}
                      </div>
                    </>
                  )}
                  
                  {/* إظهار صلاحية تغيير كلمة المرور */}
                  {!canChangePassword && (
                    <div className="mt-3">
                      <div className="flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs">
                        <IconLock className="w-3 h-3" />
                        <span>لا يمكن تغيير كلمة المرور</span>
                      </div>
                    </div>
                  )}
                  
                  {userData.bio ? (
                    <p className="mt-4 text-slate-600 text-sm leading-relaxed line-clamp-3">{userData.bio}</p>
                  ) : (
                    <p className="mt-4 text-slate-500 text-sm leading-relaxed italic">لم يتم إضافة نبذة شخصية بعد</p>
                  )}
                  
                  <div className="mt-6 w-full space-y-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <IconCalendar className="w-4 h-4" />
                      <span className="text-sm">تاريخ الانضمام: {userData.joinDate || 'غير محدد'}</span>
                    </div>
                    
                    {userData.department && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <IconFolder className="w-4 h-4" />
                        <span className="text-sm">القسم: {userData.department}</span>
                      </div>
                    )}
                    
                    {userData.cityId ? (
                      <div className="flex items-center gap-2 text-slate-600">
                        <IconMapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {getCityNameById(userData.cityId)}, {getCountryNameById(userData.countryId)}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-500 italic">
                        <IconMapPin className="w-4 h-4" />
                        <span className="text-sm">لم يتم تحديد الموقع</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-slate-600">
                      <IconMail className="w-4 h-4" />
                      <span className="text-sm truncate">{userData.email}</span>
                    </div>
                    
                    {userData.phone ? (
                      <div className="flex items-center gap-2 text-slate-600">
                        <IconPhone className="w-4 h-4" />
                        <span className="text-sm">{userData.phone}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-slate-500 italic">
                        <IconPhone className="w-4 h-4" />
                        <span className="text-sm">لم يتم إضافة رقم هاتف</span>
                      </div>
                    )}
                    
                    {userData.createdBy && userData.createdBy !== 'system' && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <IconUser className="w-4 h-4" />
                        <span className="text-sm truncate">تم الإنشاء بواسطة: {userData.createdBy}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* معلومات الصلاحيات */}
                  <div className="mt-6 w-full pt-4 border-t border-slate-200">
                    <div className="text-left w-full">
                      <h4 className="font-medium text-slate-900 mb-2 text-sm">تفاصيل الصلاحيات:</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {getRoleDescription(userData.role)}
                      </p>
                      
                      {/* إظهار صلاحيات تغيير كلمة المرور */}
                      {canChangePassword ? (
                        <div className="mt-3 flex items-center gap-2 text-emerald-600 text-xs">
                          <IconCheck className="w-3 h-3" />
                          <span>يمكنك تغيير كلمة المرور</span>
                        </div>
                      ) : (
                        <div className="mt-3 flex items-center gap-2 text-orange-600 text-xs">
                          <IconX className="w-3 h-3" />
                          <span>لا يمكنك تغيير كلمة المرور</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* معلومات الحساب */}
            <div className="lg:col-span-2 space-y-6">
              {/* قسم المعلومات الشخصية */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">معلومات الحساب</h3>
                    <p className="text-sm text-slate-600 mt-1">قم بتعديل معلوماتك الشخصية والمهنية</p>
                  </div>
                  {!isEditing && canEditProfile ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow hover:shadow-md text-sm font-medium flex items-center gap-2 justify-center sm:justify-start"
                    >
                      <IconEdit className="w-4 h-4" />
                      {userData.name ? 'تعديل المعلومات' : 'إضافة المعلومات'}
                    </button>
                  ) : isViewerOnly ? (
                    <div className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm">
                      لا يمكنك التعديل
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={handleCancel}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-all text-sm flex items-center gap-2"
                      >
                        <IconX className="w-4 h-4" />
                        إلغاء
                      </button>
                      <button 
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow hover:shadow-md flex items-center gap-2 disabled:opacity-50 text-sm"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            جاري الحفظ...
                          </>
                        ) : (
                          <>
                            <IconCheck className="w-4 h-4" />
                            حفظ التغييرات
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        الاسم الكامل *
                      </label>
                      {isEditing && canEditProfile ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
                          placeholder="أدخل اسمك الكامل"
                          required
                        />
                      ) : (
                        <div className={`px-4 py-2.5 border rounded-lg text-sm ${userData.name ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-amber-50 border-amber-200 text-amber-700 italic'}`}>
                          {userData.name || 'لم يتم إضافة الاسم'}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        البريد الإلكتروني
                      </label>
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                        <IconMail className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-slate-700 truncate">{userData.email}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">لا يمكن تغيير البريد الإلكتروني</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        رقم الهاتف *
                      </label>
                      {isEditing && canEditProfile ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
                          placeholder="+966 5X XXX XXXX"
                          required
                        />
                      ) : (
                        <div className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm ${userData.phone ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-amber-50 border-amber-200 text-amber-700 italic'}`}>
                          <IconPhone className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{userData.phone || 'لم يتم إضافة رقم هاتف'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        القسم
                      </label>
                      {isEditing && canEditProfile ? (
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
                          placeholder="أدخل اسم القسم"
                        />
                      ) : (
                        <div className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm ${userData.department ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-amber-50 border-amber-200 text-amber-700 italic'}`}>
                          <IconFolder className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{userData.department || 'لم يتم تحديد القسم'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        الدولة *
                      </label>
                      {isEditing && canEditProfile ? (
                        <select
                          name="countryId"
                          value={formData.countryId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
                          required
                        >
                          <option value="">اختر الدولة</option>
                          {countriesWithCities.map(country => (
                            <option key={country.id} value={country.id}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm ${userData.countryId ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-amber-50 border-amber-200 text-amber-700 italic'}`}>
                          <IconGlobe className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="truncate">{getCountryNameById(userData.countryId) || 'لم يتم تحديد الدولة'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        المدينة *
                      </label>
                      {isEditing && canEditProfile ? (
                        <select
                          name="cityId"
                          value={formData.cityId}
                          onChange={handleInputChange}
                          disabled={!formData.countryId}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm disabled:bg-slate-100 disabled:cursor-not-allowed"
                          required
                        >
                          <option value="">{formData.countryId ? 'اختر المدينة' : 'اختر الدولة أولاً'}</option>
                          {formData.countryId && getCitiesByCountry(formData.countryId).map(city => (
                            <option key={city.id} value={city.id}>
                              {city.name} - {city.region}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className={`px-4 py-2.5 border rounded-lg text-sm ${userData.cityId ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-amber-50 border-amber-200 text-amber-700 italic'}`}>
                          {getCityNameById(userData.cityId) || 'لم يتم تحديد المدينة'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      نبذة عنك
                    </label>
                    {isEditing && canEditProfile ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm resize-none"
                        placeholder="اكتب نبذة مختصرة عنك وخبراتك..."
                      />
                    ) : (
                      <div className={`px-4 py-2.5 border rounded-lg min-h-[80px] leading-relaxed text-sm ${userData.bio ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-amber-50 border-amber-200 text-amber-700 italic'}`}>
                        {userData.bio || 'لم يتم إضافة نبذة شخصية'}
                      </div>
                    )}
                  </div>
                  
                  {/* معلومات النظام */}
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-medium text-slate-900 mb-3">معلومات الحساب</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-600">الصلاحية:</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900">{userData.roleName}</p>
                          {canChangePassword && (
                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                              مدير
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">حالة الحساب:</p>
                        <p className={`font-medium ${userData.isActive ? 'text-emerald-600' : 'text-red-600'}`}>
                          {userData.isActive ? 'نشط' : 'غير نشط'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">تاريخ الانضمام:</p>
                        <p className="font-medium text-slate-900">{userData.joinDate || 'غير محدد'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">آخر تسجيل دخول:</p>
                        <p className="font-medium text-slate-900">{userData.lastLogin || 'لم يتم تسجيل الدخول بعد'}</p>
                      </div>
                      {userData.createdBy && userData.createdBy !== 'system' && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-slate-600">تم الإنشاء بواسطة:</p>
                          <p className="font-medium text-slate-900">{userData.createdBy}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* إظهار صلاحية تغيير كلمة المرور */}
                    <div className="mt-4 pt-4 border-t border-slate-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconLock className={`w-4 h-4 ${canChangePassword ? 'text-emerald-500' : 'text-slate-400'}`} />
                          <span className="text-sm text-slate-600">تغيير كلمة المرور:</span>
                        </div>
                        <span className={`text-sm font-medium ${canChangePassword ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {canChangePassword ? 'مصرح' : 'غير مصرح'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">
                        {canChangePassword 
                          ? 'يمكنك تغيير كلمة مرورك من قسم إعدادات الأمان'
                          : 'هذه الخاصية متاحة فقط لمدير النظام'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* إعدادات الأمان */}
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-lg ${canChangePassword ? 'bg-gradient-to-r from-blue-100 to-indigo-100' : 'bg-gradient-to-r from-slate-100 to-gray-100'}`}>
                    <IconShield className={`w-6 h-6 ${canChangePassword ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">إعدادات الأمان</h4>
                    <p className="text-sm text-slate-600 mt-1">إدارة أمان حسابك وكلمات المرور والجلسات</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* قسم تغيير كلمة المرور */}
                  <div className={`p-4 border rounded-lg ${canChangePassword ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${canChangePassword ? 'bg-blue-100' : 'bg-slate-100'}`}>
                        <IconLock className={`w-5 h-5 ${canChangePassword ? 'text-blue-600' : 'text-slate-400'}`} />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-slate-900">تغيير كلمة المرور</h5>
                        <p className="text-sm text-slate-600 mt-1">
                          {canChangePassword 
                            ? 'قم بتحديث كلمة المرور الخاصة بحسابك'
                            : 'هذه الخاصية متاحة فقط لمدير النظام'}
                        </p>
                        {userData.lastPasswordChange && canChangePassword && (
                          <p className="text-xs text-slate-500 mt-1">
                            آخر تحديث: {new Date(userData.lastPasswordChange).toLocaleDateString('ar-SA')}
                          </p>
                        )}
                        {!canChangePassword && (
                          <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                            <IconInfo className="w-3 h-3" />
                            يرجى التواصل مع مدير النظام لتغيير كلمة المرور
                          </p>
                        )}
                      </div>
                      <button 
                        onClick={handlePasswordChangeClick}
                        disabled={!canChangePassword || isLoading}
                        className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                          canChangePassword 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700' 
                            : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {canChangePassword ? 'تغيير' : 'غير متاح'}
                      </button>
                    </div>
                  </div>
                  
                  {/* معلومات الصلاحيات */}
                  <div className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                    <h5 className="font-medium text-slate-900 mb-3">صلاحيات حسابك</h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">تغيير المعلومات الشخصية:</span>
                        <span className={`text-sm font-medium ${canEditProfile ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {canEditProfile ? 'مصرح' : 'غير مصرح'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">إضافة/تعديل المحتوى:</span>
                        <span className={`text-sm font-medium ${isEditor || isAdmin ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {isEditor || isAdmin ? 'مصرح' : 'غير مصرح'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">تغيير كلمة المرور:</span>
                        <span className={`text-sm font-medium ${canChangePassword ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {canChangePassword ? 'مصرح' : 'غير مصرح'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">إدارة المستخدمين:</span>
                        <span className={`text-sm font-medium ${isAdmin ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {isAdmin ? 'مصرح' : 'غير مصرح'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* زر تسجيل الخروج */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <button 
                    onClick={handleLogoutAllDevices}
                    className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all w-full justify-center shadow hover:shadow-md text-sm"
                  >
                    <IconLogout className="w-5 h-5" />
                    <span>تسجيل الخروج من جميع الأجهزة</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* ✅ نافذة تغيير كلمة المرور (للمدير فقط) - تم تحديثها لتغيير كلمة المرور في Auth */}
      {showPasswordModal && (
        <PasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handleChangePassword}
          userData={userData}
          isAdmin={isAdmin}
          showNotification={showNotification}
        />
      )}
    </>
  );
};

export default Profile;