// src/components/Admin/UserManagement.js
import { useState, useEffect, useCallback } from "react";
import { auth, db } from "../../firebase";
import { 
  collection, getDocs, doc, 
  updateDoc, serverTimestamp, setDoc, deleteDoc,
  query, orderBy, 
  getDoc
} from "firebase/firestore";
import { 
  createUserWithEmailAndPassword,
} from "firebase/auth";

// SVG Icons Components (نفس الأيقونات)
const IconUsers = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0a4 4 0 110 5.292M15 10a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const IconLock = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const IconPlus = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const IconEdit = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const IconTrash = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-2-1.838L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconX = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconEye = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const IconEyeOff = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;
const IconCheck = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconSearch = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const IconChevronLeft = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const IconChevronRight = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const IconInfo = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconAlert = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>;
const IconCopy = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);
const IconRefresh = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);
const IconStats = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const IconKey = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);
const IconMail = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default function UserManagement({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingUser, setAddingUser] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(false);
  const [deletingUser, setDeletingUser] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showSendCredentialsModal, setShowSendCredentialsModal] = useState(false);
    
  // States for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Forms
  const [userForm, setUserForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "editor",
    phone: "",
    department: ""
  });
  
  const [editUserForm, setEditUserForm] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
    phone: "",
    department: "",
    isActive: true
  });

  const [credentialsForm, setCredentialsForm] = useState({
    userId: "",
    userEmail: "",
    userName: "",
    password: ""
  });
  
  // Notifications
  const [notification, setNotification] = useState({ 
    show: false, 
    type: '', 
    message: '',
    title: ''
  });
  
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    general: ""
  });

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    admins: 0,
    editors: 0,
    viewers: 0,
    inactive: 0,
  });

  // مكون بطاقة الإحصائيات
  const StatsCard = ({ title, value, icon, color, subtitle }) => (
    <div className={`bg-gradient-to-r ${color} rounded-xl p-6 shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {subtitle && <p className="text-xs text-white/60 mt-1">{subtitle}</p>}
        </div>
        <div className="bg-white/20 p-3 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );

  // دالة جلب جميع المستخدمين
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const usersQuery = query(
        collection(db, "adminUsers"),
        orderBy("createdAt", "desc")
      );
      
      const usersSnap = await getDocs(usersQuery);
      const usersData = usersSnap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        lastLogin: doc.data().lastLogin?.toDate?.() || null
      }));
      
      setUsers(usersData);
      setFilteredUsers(usersData);
      calculateStatistics(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      showNotification("error", "خطأ في جلب البيانات", "حدث خطأ في جلب بيانات المستخدمين");
    } finally {
      setLoading(false);
    }
  }, []);

  // دالة حساب الإحصائيات
  const calculateStatistics = (usersList) => {
    const statsData = {
      total: usersList.length,
      active: usersList.filter(u => u.isActive && u.status !== "deactivated").length,
      admins: usersList.filter(u => u.role === "admin" || u.role === "super_admin").length,
      editors: usersList.filter(u => u.role === "editor").length,
      viewers: usersList.filter(u => u.role === "viewer").length,
      inactive: usersList.filter(u => !u.isActive || u.status === "deactivated").length,
    };
    setStats(statsData);
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // دالة عرض الإشعارات
  const showNotification = (type, title, message) => {
    setNotification({ show: true, type, title, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', title: '', message: '' });
    }, 8000);
  };

  // دالة التحقق من صحة الإيميل
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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

  // دالة حساب عدد المسؤولين
  const getAdminCount = useCallback(() => {
    return users.filter(user => 
      (user.role === "admin" || user.role === "super_admin") && 
      user.isActive && 
      user.status !== "deactivated"
    ).length;
  }, [users]);

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

  // دالة للحصول على لون قوة كلمة المرور
  const getPasswordStrengthColor = (strength) => {
    if (strength <= 2) return 'bg-red-500';
    if (strength === 3) return 'bg-yellow-500';
    if (strength === 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  // دالة للحصول على نص قوة كلمة المرور
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
    
    // تأكد من وجود حرف كبير
    password += chars.charAt(Math.floor(Math.random() * 26));
    // تأكد من وجود حرف صغير
    password += chars.charAt(26 + Math.floor(Math.random() * 26));
    // تأكد من وجود رقم
    password += chars.charAt(52 + Math.floor(Math.random() * 10));
    // تأكد من وجود رمز خاص
    password += chars.charAt(62 + Math.floor(Math.random() * 8));
    
    // أضف باقي الأحرف
    for (let i = 4; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // خلط الأحرف
    password = password.split('').sort(() => 0.5 - Math.random()).join('');
    
    return password;
  };

  // دالة إضافة مستخدم جديد
  const handleAddUser = async (e) => {
    e.preventDefault();
    
    setErrors({ email: "", password: "", confirmPassword: "", general: "" });
    setAddingUser(true);

    // التحقق من الإيميل
    if (!validateEmail(userForm.email)) {
      setErrors(prev => ({ ...prev, email: "البريد الإلكتروني غير صالح" }));
      setAddingUser(false);
      return;
    }

    // التحقق من كلمة المرور
    const passwordError = validatePassword(userForm.password);
    if (passwordError) {
      setErrors(prev => ({ ...prev, password: passwordError }));
      setAddingUser(false);
      return;
    }

    if (userForm.password !== userForm.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: "كلمات المرور غير متطابقة" }));
      setAddingUser(false);
      return;
    }

    try {
      console.log("🚀 بدء إنشاء المستخدم الجديد في Authentication...");

      // 1. حفظ المستخدم الحالي قبل إنشاء المستخدم الجديد
      const currentAdminUser = auth.currentUser;
      
      if (!currentAdminUser) {
        throw new Error("لم يتم العثور على المستخدم الحالي");
      }

      console.log("👤 المستخدم الحالي:", currentAdminUser.email);

      // 2. إنشاء المستخدم في Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userForm.email.toLowerCase(), 
        userForm.password
      );
      const newUser = userCredential.user;
      console.log("✅ تم إنشاء المستخدم في Authentication:", newUser.uid);

      // 3. حفظ بيانات المستخدم في Firestore
      const userDataToSave = {
        uid: newUser.uid,
        email: userForm.email.toLowerCase(),
        name: userForm.name,
        role: userForm.role,
        phone: userForm.phone || "",
        department: userForm.department || "",
        createdAt: serverTimestamp(),
        createdBy: currentAdminUser?.email || "system",
        createdById: currentAdminUser?.uid || "system",
        isActive: true,
        status: "active",
        lastLogin: null,
        authProvider: "email",
        emailVerified: false
      };

      console.log("📦 حفظ بيانات المستخدم في Firestore...");
      await setDoc(doc(db, "adminUsers", newUser.uid), userDataToSave);
      console.log("✅ تم حفظ المستخدم في Firestore بنجاح");

      // 4. أهم خطوة: إعادة تسجيل دخول المسؤول الحالي
      console.log("🔄 إعادة تسجيل دخول المسؤول:", currentAdminUser.email);
      await auth.updateCurrentUser(currentAdminUser);
      console.log("✅ تمت إعادة تسجيل دخول المسؤول بنجاح");

      // 5. إغلاق المودال وإعادة التعيين
      setShowAddUserModal(false);
      setUserForm({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        role: "editor",
        phone: "",
        department: ""
      });

      // 6. إعادة جلب البيانات
      await fetchUsers();
      
      // 7. عرض مودال إرسال البيانات للمستخدم
      setShowSendCredentialsModal(true);
      setCredentialsForm({
        userId: newUser.uid,
        userEmail: userForm.email.toLowerCase(),
        userName: userForm.name,
        password: userForm.password
      });
      
      showNotification("success", "نجاح", "✅ تم إنشاء المستخدم بنجاح");
      
    } catch (error) {
      console.error("❌ Error adding user:", error);
      
      let errorMessage = "فشل إضافة المستخدم";
      
      switch(error.code) {
        case "auth/email-already-in-use":
          errorMessage = "البريد الإلكتروني مسجل بالفعل في النظام";
          break;
        case "auth/invalid-email":
          errorMessage = "البريد الإلكتروني غير صالح";
          break;
        case "auth/weak-password":
          errorMessage = "كلمة المرور ضعيفة جداً";
          break;
        default:
          errorMessage = `خطأ: ${error.message}`;
      }
      
      setErrors(prev => ({ ...prev, general: errorMessage }));
      showNotification("error", "خطأ", `❌ ${errorMessage}`);
    } finally {
      setAddingUser(false);
    }
  };

  // دالة إرسال بيانات الدخول للمستخدم
  const handleSendCredentials = async () => {
    try {
      const roleNames = {
        'editor': 'محرر',
        'admin': 'مدير',
        'viewer': 'مشاهد'
      };
      
      // نسخ بيانات الدخول للحافظة
      const credentials = `مرحباً ${credentialsForm.userName}،

تم إنشاء حساب لك في نظام إدارة المحتوى

🔑 **بيانات الدخول:**
📧 البريد الإلكتروني: ${credentialsForm.userEmail}
🔐 كلمة المرور: ${credentialsForm.password}

🏷️ **صلاحياتك:** ${roleNames[users.find(u => u.id === credentialsForm.userId)?.role] || 'مستخدم'}

📋 **تعليمات:**
1. قم بتسجيل الدخول باستخدام البيانات أعلاه
2. في حال نسيان كلمة المرور، استخدم خاصية "نسيت كلمة المرور" في صفحة الدخول

مع تحيات فريق الإدارة`;

      navigator.clipboard.writeText(credentials).then(() => {
        showNotification("success", "نسخ", "تم نسخ بيانات الدخول إلى الحافظة");
      });
      
      // تحديث حالة المستخدم
      await updateDoc(doc(db, "adminUsers", credentialsForm.userId), {
        credentialsSent: true,
        credentialsSentAt: serverTimestamp(),
        sentBy: currentUser?.email,
        lastUpdated: serverTimestamp()
      });
      
      setShowSendCredentialsModal(false);
      
      showNotification("success", "نجاح", 
        `✅ تم إنشاء حساب "${credentialsForm.userName}" بنجاح.\n\n📋 **تم نسخ بيانات الدخول إلى الحافظة**\nيمكنك إرسالها للمستخدم عبر البريد الإلكتروني أو أي وسيلة تواصل.`
      );
      
    } catch (error) {
      console.error("Error sending credentials:", error);
      showNotification("error", "خطأ", "حدث خطأ أثناء إرسال البيانات");
    }
  };

  // دالة تحضير نموذج تعديل المستخدم
  const handleEditUser = (user) => {
    console.log("📝 تحضير تعديل المستخدم:", user);
    setEditUserForm({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      role: user.role || "editor",
      phone: user.phone || "",
      department: user.department || "",
      isActive: user.isActive !== false
    });
    setShowEditUserModal(true);
  };

  // دالة حفظ تعديل المستخدم
  const handleSaveUserEdit = async (e) => {
    e.preventDefault();
    
    setUpdatingUser(true);
    
    try {
      console.log("💾 جاري تحديث بيانات المستخدم:", editUserForm.id);
      
      const updateData = {
        name: editUserForm.name,
        role: editUserForm.role,
        phone: editUserForm.phone || "",
        department: editUserForm.department || "",
        isActive: editUserForm.isActive,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser?.email || "system"
      };
      
      console.log("📦 البيانات المرسلة:", updateData);
      
      // التحقق من وجود المستخدم في Firestore
      const userDoc = await getDoc(doc(db, "adminUsers", editUserForm.id));
      if (!userDoc.exists()) {
        throw new Error("المستخدم غير موجود في قاعدة البيانات");
      }
      
      await updateDoc(doc(db, "adminUsers", editUserForm.id), updateData);
            
      setShowEditUserModal(false);
      setEditUserForm({
        id: "",
        name: "",
        email: "",
        role: "",
        phone: "",
        department: "",
        isActive: true
      });
      
      await fetchUsers();
      
      showNotification("success", "نجاح", "✅ تم تحديث بيانات المستخدم بنجاح");
      
    } catch (error) {
      console.error("❌ Error updating user:", error);
      showNotification("error", "خطأ", `❌ فشل تحديث بيانات المستخدم: ${error.message}`);
    } finally {
      setUpdatingUser(false);
    }
  };

  // دالة تغيير حالة المستخدم
  const toggleUserStatus = async (userItem) => {
    const newStatus = !userItem.isActive;
    const confirmMessage = newStatus 
      ? `هل تريد تفعيل حساب ${userItem.name || userItem.email}؟`
      : `هل تريد تعطيل حساب ${userItem.name || userItem.email}؟`;

    if (!window.confirm(confirmMessage)) return;
    
    // التحقق من المدير الوحيد
    if ((userItem.role === "admin" || userItem.role === "super_admin") && !newStatus) {
      const adminUsers = users.filter(u => 
        (u.role === "admin" || u.role === "super_admin") && 
        u.isActive && 
        u.status !== "deactivated"
      );
      
      if (adminUsers.length <= 1) {
        showNotification("error", "خطأ", "❌ لا يمكن تعطيل المدير الوحيد النشط في النظام");
        return;
      }
    }
    
    try {
      // تحديث في Firestore فقط
      await updateDoc(doc(db, "adminUsers", userItem.id), {
        isActive: newStatus,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser?.email || "system",
        status: newStatus ? "active" : "inactive"
      });
      
      // تحديث محلي
      setUsers(prev => prev.map(u => 
        u.id === userItem.id ? { ...u, isActive: newStatus } : u
      ));
      setFilteredUsers(prev => prev.map(u => 
        u.id === userItem.id ? { ...u, isActive: newStatus } : u
      ));
      
      showNotification("success", "نجاح", 
        newStatus ? "✅ تم تفعيل حساب المستخدم" : "✅ تم تعطيل حساب المستخدم"
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      showNotification("error", "خطأ", "❌ فشل تحديث حالة المستخدم");
    }
  };

  // دالة حذف المستخدم نهائياً
  const deleteUserPermanently = async (userItem) => {
    if (userItem.email === currentUser?.email) {
      showNotification("error", "خطأ", "❌ لا يمكن حذف حسابك الخاص");
      return;
    }

    // التحقق من المدير الوحيد
    if (userItem.role === "admin" || userItem.role === "super_admin") {
      const adminUsers = users.filter(u => u.role === "admin" || u.role === "super_admin");
      
      if (adminUsers.length <= 1) {
        showNotification("error", "خطأ", "❌ لا يمكن حذف هذا المدير! هو المدير الوحيد في النظام");
        return;
      }
    }

    const confirmMessage = 
      `⚠️ تحذير: حذف نهائي!\n\n` +
      `أنت على وشك حذف المستخدم "${userItem.name || userItem.email}" بشكل نهائي.\n` +
      `الصلاحية: ${userItem.role === "admin" ? "مدير" : userItem.role === "editor" ? "محرر" : "مشاهد"}\n\n` +
      `هل أنت متأكد من الاستمرار؟`;

    if (!window.confirm(confirmMessage)) return;
    
    setDeletingUser(true);
    
    try {
      console.log("🗑️ بدء عملية الحذف النهائي للمستخدم:", userItem.id);
      
      // حفظ المستخدم الحالي
      const currentAdminUser = auth.currentUser;
      
      if (!currentAdminUser) {
        throw new Error("لم يتم العثور على المستخدم الحالي");
      }

      // 1. حذف المستخدم من Firestore أولاً
      console.log("📦 حذف المستخدم من Firestore...");
      await deleteDoc(doc(db, "adminUsers", userItem.id));
      console.log("✅ تم حذف المستخدم من Firestore بنجاح");

      // 2. محاولة حذف المستخدم من Authentication
      try {
        console.log("🔐 محاولة حذف المستخدم من Authentication...");
        
        // ملاحظة: لا يمكن حذف مستخدم آخر من Authentication مباشرة
        // هذا يتطلب صلاحيات خاصة أو استخدام Admin SDK
        // بدلاً من ذلك، سنقوم بتسجيل أن المستخدم تم حذفه
        
        showNotification("warning", "تنبيه", 
          "⚠️ تم حذف المستخدم من قاعدة البيانات، ولكن لا يمكن حذفه من نظام المصادقة تلقائياً. يرجى حذفه يدوياً من Firebase Console."
        );
        
      } catch (authError) {
        console.error("❌ خطأ في حذف المستخدم من Authentication:", authError);
        showNotification("warning", "تنبيه", 
          "تم حذف المستخدم من قاعدة البيانات، ولكن حدث خطأ في حذفه من نظام المصادقة. قد تحتاج إلى حذفه يدوياً من Firebase Console."
        );
      }

      // 3. تحديث القائمة المحلية
      setUsers(prev => prev.filter(u => u.id !== userItem.id));
      setFilteredUsers(prev => prev.filter(u => u.id !== userItem.id));
      
      showNotification("success", "نجاح", 
        `✅ تم حذف المستخدم "${userItem.name || userItem.email}" بشكل نهائي من النظام`
      );
      
    } catch (error) {
      console.error("❌ Error deleting user permanently:", error);
      showNotification("error", "خطأ", `❌ فشل حذف المستخدم: ${error.message}`);
    } finally {
      setDeletingUser(false);
    }
  };

  // دالة حذف المستخدم (واجهة) - استدعاء الحذف النهائي مباشرة
  const deleteUser = (userItem) => {
    deleteUserPermanently(userItem);
  };

  // معالجة البحث والتصفية
  useEffect(() => {
    const filterUsers = () => {
      let filtered = users;
      
      // تطبيق البحث
      if (searchTerm) {
        filtered = filtered.filter(user => 
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.includes(searchTerm) ||
          user.department?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // تطبيق فلتر الصلاحية
      if (roleFilter !== "all") {
        filtered = filtered.filter(user => user.role === roleFilter);
      }
      
      // تطبيق فلتر الحالة
      if (statusFilter !== "all") {
        filtered = filtered.filter(user => {
          if (statusFilter === "active") return user.isActive && user.status !== "deactivated";
          if (statusFilter === "inactive") return !user.isActive && user.status !== "deactivated";
          if (statusFilter === "deleted") return user.status === "deleted";
          return true;
        });
      }
      
      setFilteredUsers(filtered);
      setCurrentPage(1);
    };
    
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  // حساب بيانات Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // دالة تغيير الصفحة
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // مودال إضافة مستخدم
  const renderAddUserModal = () => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <IconUsers className="ml-2" /> إضافة مستخدم جديد
          </h2>
          <button 
            onClick={() => {
              setShowAddUserModal(false);
              setUserForm({
                email: "",
                password: "",
                confirmPassword: "",
                name: "",
                role: "editor",
                phone: "",
                department: ""
              });
              setErrors({ email: "", password: "", confirmPassword: "", general: "" });
              setShowPassword(false);
              setShowConfirmPassword(false);
              setPasswordStrength(0);
            }} 
            className="text-gray-400 hover:text-gray-600"
          >
            <IconX />
          </button>
        </div>
        
        <form onSubmit={handleAddUser} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الاسم الكامل
              <span className="text-red-500 mr-1">*</span>
            </label>
            <input 
              type="text" 
              value={userForm.name}
              onChange={(e) => setUserForm({...userForm, name: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أدخل الاسم الكامل"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
              <span className="text-red-500 mr-1">*</span>
            </label>
            <input 
              type="email" 
              value={userForm.email}
              onChange={(e) => {
                setUserForm({...userForm, email: e.target.value});
                if (errors.email) setErrors({...errors, email: ""});
              }}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="example@email.com"
              required 
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الهاتف
              </label>
              <input 
                type="tel" 
                value={userForm.phone}
                onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="05xxxxxxxx"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                القسم
              </label>
              <input 
                type="text" 
                value={userForm.department}
                onChange={(e) => setUserForm({...userForm, department: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="القسم"
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
                <span className="text-red-500 mr-1">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  const newPassword = generateRandomPassword();
                  setUserForm({
                    ...userForm,
                    password: newPassword,
                    confirmPassword: newPassword
                  });
                  setPasswordStrength(checkPasswordStrength(newPassword));
                  showNotification("info", "توليد كلمة مرور", "تم توليد كلمة مرور قوية تلقائياً");
                }}
                className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-lg transition-colors flex items-center"
              >
                <IconLock className="w-3 h-3 ml-1" />
                توليد كلمة مرور
              </button>
            </div>
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                value={userForm.password}
                onChange={(e) => {
                  setUserForm({...userForm, password: e.target.value});
                  if (errors.password) setErrors({...errors, password: ""});
                  setPasswordStrength(checkPasswordStrength(e.target.value));
                }}
                className={`w-full pr-12 pl-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="أدخل كلمة المرور (8 أحرف على الأقل)"
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? 
                  <IconEyeOff className="w-5 h-5" /> : 
                  <IconEye className="w-5 h-5" />
                }
              </button>
              {userForm.password && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(userForm.password);
                    showNotification("success", "نسخ", "تم نسخ كلمة المرور إلى الحافظة");
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none p-1"
                  title="نسخ كلمة المرور"
                >
                  <IconCopy className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* مؤشر قوة كلمة المرور */}
            {userForm.password && (
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
                    {passwordStrength >= 4 && ' ✓'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getPasswordStrengthColor(passwordStrength)} transition-all duration-300`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
                
                <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-500">
                  <p className={`flex items-center ${userForm.password.length >= 8 ? 'text-green-600' : ''}`}>
                    {userForm.password.length >= 8 ? (
                      <IconCheck className="w-3 h-3 text-green-500 ml-1" />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-gray-300 ml-1"></span>
                    )}
                    <span>8 أحرف على الأقل</span>
                  </p>
                  <p className={`flex items-center ${/[A-Z]/.test(userForm.password) ? 'text-green-600' : ''}`}>
                    {/[A-Z]/.test(userForm.password) ? (
                      <IconCheck className="w-3 h-3 text-green-500 ml-1" />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-gray-300 ml-1"></span>
                    )}
                    <span>حرف كبير (A-Z)</span>
                  </p>
                  <p className={`flex items-center ${/[a-z]/.test(userForm.password) ? 'text-green-600' : ''}`}>
                    {/[a-z]/.test(userForm.password) ? (
                      <IconCheck className="w-3 h-3 text-green-500 ml-1" />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-gray-300 ml-1"></span>
                    )}
                    <span>حرف صغير (a-z)</span>
                  </p>
                  <p className={`flex items-center ${/[0-9]/.test(userForm.password) ? 'text-green-600' : ''}`}>
                    {/[0-9]/.test(userForm.password) ? (
                      <IconCheck className="w-3 h-3 text-green-500 ml-1" />
                    ) : (
                      <span className="w-3 h-3 rounded-full border border-gray-300 ml-1"></span>
                    )}
                    <span>رقم (0-9)</span>
                  </p>
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تأكيد كلمة المرور
              <span className="text-red-500 mr-1">*</span>
            </label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                value={userForm.confirmPassword}
                onChange={(e) => {
                  setUserForm({...userForm, confirmPassword: e.target.value});
                  if (errors.confirmPassword) setErrors({...errors, confirmPassword: ""});
                }}
                className={`w-full pr-12 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="أعد إدخال كلمة المرور"
                required 
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                title={showConfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showConfirmPassword ? 
                  <IconEyeOff className="w-5 h-5" /> : 
                  <IconEye className="w-5 h-5" />
                }
              </button>
            </div>
            
            {/* مؤشر المطابقة */}
            {userForm.password && userForm.confirmPassword && (
              <div className="mt-2">
                {userForm.password === userForm.confirmPassword ? (
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
            
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الصلاحية
              <span className="text-red-500 mr-1">*</span>
            </label>
            <select 
              value={userForm.role}
              onChange={(e) => setUserForm({...userForm, role: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="editor">محرر (إضافة/تعديل/حذف كل المحتوى)</option>
              <option value="admin">مدير (صلاحيات كاملة)</option>
              <option value="viewer">مشاهد (عرض فقط)</option>
            </select>
            
            {/* عرض تفاصيل صلاحيات المحرر */}
            {userForm.role === "editor" && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <h5 className="font-medium text-green-800 mb-2 text-sm flex items-center">
                  <IconCheck className="w-4 h-4 ml-2 text-green-600" />
                  صلاحيات المحرر الممنوحة:
                </h5>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-green-700">
                    <IconCheck className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>✅ إضافة/تعديل/حذف المشاريع والخدمات</span>
                  </div>
                  <div className="flex items-center text-xs text-green-700">
                    <IconCheck className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>✅ إدارة طلبات المشاريع والخدمات</span>
                  </div>
                  <div className="flex items-center text-xs text-green-700">
                    <IconCheck className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>✅ الرد على الرسائل وحذفها</span>
                  </div>
                  <div className="flex items-center text-xs text-green-700">
                    <IconCheck className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>✅ إضافة/تعديل قسم "من نحن"</span>
                  </div>
                </div>
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-center text-xs text-red-700">
                    <IconX className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>❌ لا يمكن الوصول إلى إدارة المستخدمين</span>
                  </div>
                </div>
              </div>
            )}
            
            {userForm.role === "viewer" && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2 text-sm flex items-center">
                  <IconEye className="w-4 h-4 ml-2 text-blue-600" />
                  صلاحيات المشاهد:
                </h5>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-blue-700">
                    <IconEye className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>👁️ عرض المشاريع والخدمات فقط</span>
                  </div>
                  <div className="flex items-center text-xs text-blue-700">
                    <IconEye className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>👁️ عرض طلبات المشاريع والخدمات</span>
                  </div>
                  <div className="flex items-center text-xs text-blue-700">
                    <IconEye className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>👁️ عرض الرسائل</span>
                  </div>
                </div>
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-center text-xs text-red-700">
                    <IconX className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>❌ لا يمكن إضافة أو تعديل أو حذف أي شيء</span>
                  </div>
                </div>
              </div>
            )}

            {userForm.role === "admin" && (
              <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h5 className="font-medium text-purple-800 mb-2 text-sm flex items-center">
                  <IconKey className="w-4 h-4 ml-2 text-purple-600" />
                  صلاحيات المدير:
                </h5>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-purple-700">
                    <IconCheck className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>✅ جميع صلاحيات المحرر والمشاهد</span>
                  </div>
                  <div className="flex items-center text-xs text-purple-700">
                    <IconCheck className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>✅ إدارة المستخدمين (إضافة/تعديل/حذف)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <IconX className="w-5 h-5 ml-2" />
                <p className="font-medium">{errors.general}</p>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button 
              type="button" 
              onClick={() => {
                setShowAddUserModal(false);
                setUserForm({
                  email: "",
                  password: "",
                  confirmPassword: "",
                  name: "",
                  role: "editor",
                  phone: "",
                  department: ""
                });
                setErrors({ email: "", password: "", confirmPassword: "", general: "" });
                setShowPassword(false);
                setShowConfirmPassword(false);
                setPasswordStrength(0);
              }} 
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button 
              type="submit" 
              disabled={addingUser}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingUser ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري الإنشاء...
                </span>
              ) : "إضافة المستخدم"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // مودال تعديل المستخدم
  const renderEditUserModal = () => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <IconEdit className="ml-2" /> تعديل بيانات المستخدم
          </h2>
          <button 
            onClick={() => {
              setShowEditUserModal(false);
              setEditUserForm({
                id: "",
                name: "",
                email: "",
                role: "",
                phone: "",
                department: "",
                isActive: true
              });
            }} 
            className="text-gray-400 hover:text-gray-600"
          >
            <IconX />
          </button>
        </div>
        
        <form onSubmit={handleSaveUserEdit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
            <input 
              type="text" 
              value={editUserForm.name}
              onChange={(e) => setEditUserForm({...editUserForm, name: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="أدخل الاسم الكامل"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
            <input 
              type="email" 
              value={editUserForm.email}
              disabled
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الهاتف</label>
              <input 
                type="tel" 
                value={editUserForm.phone}
                onChange={(e) => setEditUserForm({...editUserForm, phone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="05xxxxxxxx"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">القسم</label>
              <input 
                type="text" 
                value={editUserForm.department}
                onChange={(e) => setEditUserForm({...editUserForm, department: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="القسم"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الصلاحية</label>
            <select 
              value={editUserForm.role}
              onChange={(e) => setEditUserForm({...editUserForm, role: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="editor">محرر (إضافة/تعديل/حذف كل المحتوى)</option>
              <option value="admin">مدير (صلاحيات كاملة)</option>
              <option value="viewer">مشاهد (عرض فقط)</option>
            </select>
            
            {/* عرض تفاصيل الصلاحيات */}
            {editUserForm.role === "editor" && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <h5 className="font-medium text-green-800 mb-2 text-sm flex items-center">
                  <IconCheck className="w-4 h-4 ml-2 text-green-600" />
                  صلاحيات المحرر الممنوحة:
                </h5>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-green-700">
                    <IconCheck className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>✅ إضافة/تعديل/حذف المشاريع والخدمات</span>
                  </div>
                  <div className="flex items-center text-xs text-green-700">
                    <IconCheck className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>✅ إدارة طلبات المشاريع والخدمات</span>
                  </div>
                  <div className="flex items-center text-xs text-green-700">
                    <IconCheck className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>✅ الرد على الرسائل وحذفها</span>
                  </div>
                  <div className="flex items-center text-xs text-green-700">
                    <IconCheck className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>✅ إضافة/تعديل قسم "من نحن"</span>
                  </div>
                </div>
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-center text-xs text-red-700">
                    <IconX className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>❌ لا يمكن الوصول إلى إدارة المستخدمين</span>
                  </div>
                </div>
              </div>
            )}
            
            {editUserForm.role === "viewer" && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2 text-sm flex items-center">
                  <IconEye className="w-4 h-4 ml-2 text-blue-600" />
                  صلاحيات المشاهد:
                </h5>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-blue-700">
                    <IconEye className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>👁️ عرض المشاريع والخدمات فقط</span>
                  </div>
                  <div className="flex items-center text-xs text-blue-700">
                    <IconEye className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>👁️ عرض طلبات المشاريع والخدمات</span>
                  </div>
                  <div className="flex items-center text-xs text-blue-700">
                    <IconEye className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>👁️ عرض الرسائل</span>
                  </div>
                </div>
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-center text-xs text-red-700">
                    <IconX className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>❌ لا يمكن إضافة أو تعديل أو حذف أي شيء</span>
                  </div>
                </div>
              </div>
            )}

            {editUserForm.role === "admin" && (
              <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h5 className="font-medium text-purple-800 mb-2 text-sm flex items-center">
                  <IconKey className="w-4 h-4 ml-2 text-purple-600" />
                  صلاحيات المدير:
                </h5>
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-purple-700">
                    <IconCheck className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>✅ جميع صلاحيات المحرر والمشاهد</span>
                  </div>
                  <div className="flex items-center text-xs text-purple-700">
                    <IconCheck className="w-3 h-3 ml-1 flex-shrink-0" />
                    <span>✅ إدارة المستخدمين (إضافة/تعديل/حذف)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={editUserForm.isActive}
                onChange={(e) => setEditUserForm({...editUserForm, isActive: e.target.checked})}
                className="ml-2" 
              />
              <span>الحساب نشط</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button 
              type="button" 
              onClick={() => {
                setShowEditUserModal(false);
                setEditUserForm({
                  id: "",
                  name: "",
                  email: "",
                  role: "",
                  phone: "",
                  department: "",
                  isActive: true
                });
              }} 
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button 
              type="submit" 
              disabled={updatingUser}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatingUser ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري التحديث...
                </span>
              ) : "حفظ التعديلات"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // مودال إرسال بيانات الدخول
  const renderSendCredentialsModal = () => (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <IconMail className="ml-2" /> إرسال بيانات الدخول
          </h2>
          <button 
            onClick={() => {
              setShowSendCredentialsModal(false);
            }} 
            className="text-gray-400 hover:text-gray-600"
          >
            <IconX />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">
              <span className="font-medium">✅ تم إنشاء الحساب بنجاح</span>
            </p>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">المستخدم</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-700">{credentialsForm.userName}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-700">{credentialsForm.userEmail}</p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-gray-700 font-mono">{credentialsForm.password}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(credentialsForm.password);
                      showNotification("success", "نسخ", "تم نسخ كلمة المرور إلى الحافظة");
                    }}
                    className="text-yellow-600 hover:text-yellow-700"
                    title="نسخ كلمة المرور"
                  >
                    <IconCopy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center">
              <IconInfo className="w-4 h-4 ml-2" />
              تعليمات للمستخدم:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li className="flex items-start">
                <span className="ml-2">•</span>
                <span>استخدم البريد الإلكتروني وكلمة المرور أعلاه للدخول</span>
              </li>
              <li className="flex items-start">
                <span className="ml-2">•</span>
                <span>في حال نسيان كلمة المرور، استخدم خاصية "نسيت كلمة المرور"</span>
              </li>
            </ul>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button 
              onClick={() => {
                setShowSendCredentialsModal(false);
                showNotification("success", "تم", "تم إنشاء الحساب بنجاح ✓");
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              إغلاق
            </button>
            <button 
              onClick={handleSendCredentials}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <span className="flex items-center">
                <IconCopy className="ml-2" />
                نسخ البيانات مرة أخرى
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">جاري تحميل بيانات المستخدمين...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-8 left-4 right-4 md:left-4 md:right-auto md:w-[600px] z-50 transform transition-all duration-300 ${
          notification.show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
        }`}>
          <div className={`p-5 rounded-2xl shadow-2xl ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-l-8 border-green-400' 
              : notification.type === 'error'
              ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-l-8 border-red-400'
              : notification.type === 'warning'
              ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-l-8 border-yellow-400'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-l-8 border-blue-400'
          }`}>
            <div className="flex items-start">
              <div className="bg-white/30 p-2 rounded-lg">
                {notification.type === 'success' ? 
                  <IconCheck className="w-6 h-6 flex-shrink-0" /> : 
                  notification.type === 'error' ?
                  <IconX className="w-6 h-6 flex-shrink-0" /> :
                  notification.type === 'warning' ?
                  <IconAlert className="w-6 h-6 flex-shrink-0" /> :
                  <IconInfo className="w-6 h-6 flex-shrink-0" />
                }
              </div>
              <div className="flex-1 mr-4">
                <h4 className="font-bold text-lg mb-1">{notification.title}</h4>
                <p className="text-base opacity-95">{notification.message}</p>
                <div className="h-1 w-full bg-white/30 mt-3 rounded-full overflow-hidden">
                  <div className={`h-full ${
                    notification.type === 'success' ? 'bg-white' :
                    notification.type === 'error' ? 'bg-white' :
                    notification.type === 'warning' ? 'bg-white' :
                    'bg-white'
                  } animate-[shrink_8s_linear]`}></div>
                </div>
              </div>
              <button 
                onClick={() => setNotification({ show: false, type: '', title: '', message: '' })}
                className="text-white/80 hover:text-white bg-white/20 p-2 rounded-full transition-all hover:bg-white/30"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h3>
          <p className="text-gray-500 mt-2">إدارة حسابات وصلاحيات المستخدمين</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
            <IconUsers className="w-6 h-6 text-green-600" />
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg font-medium">
            مدير النظام
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="إجمالي المستخدمين" 
          value={stats.total} 
          icon={<IconUsers className="w-6 h-6 text-white" />}
          color="from-blue-500 to-blue-600"
          subtitle="جميع الحسابات"
        />
        <StatsCard 
          title="المستخدمين النشطين" 
          value={stats.active} 
          icon={<IconEye className="w-6 h-6 text-white" />}
          color="from-green-500 to-green-600"
          subtitle="حسابات نشطة"
        />
        <StatsCard 
          title="المدراء" 
          value={stats.admins} 
          icon={<IconLock className="w-6 h-6 text-white" />}
          color="from-purple-500 to-purple-600"
          subtitle="صلاحيات كاملة"
        />
        <StatsCard 
          title="المحررين" 
          value={stats.editors} 
          icon={<IconEdit className="w-6 h-6 text-white" />}
          color="from-orange-500 to-orange-600"
          subtitle="إدارة المحتوى"
        />
      </div>

      {/* Search and Filters */}
      <div className="mb-8 bg-gray-50 p-6 rounded-xl shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <IconSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="ابحث بالاسم، البريد، الهاتف، أو القسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1 min-w-[120px]"
            >
              <option value="all">جميع الصلاحيات</option>
              <option value="admin">مدير</option>
              <option value="editor">محرر</option>
              <option value="viewer">مشاهد</option>
            </select>
            
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1 min-w-[120px]"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">نشط فقط</option>
              <option value="inactive">غير نشط</option>
            </select>
            
            <button 
              onClick={() => setShowAddUserModal(true)} 
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              <IconPlus className="ml-2" /> إضافة مستخدم
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-gray-600 flex items-center">
            <IconStats className="w-4 h-4 ml-2" />
            <span>تم العثور على <span className="font-bold text-gray-800">{filteredUsers.length}</span> مستخدم</span>
            {filteredUsers.length !== users.length && (
              <span className="mr-4 ml-4 text-gray-400">|</span>
            )}
            {filteredUsers.length !== users.length && (
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                إعادة تعيين الفلاتر
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <button 
              onClick={fetchUsers}
              className="flex items-center text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
            >
              <IconRefresh className="w-4 h-4 ml-2" />
              تحديث البيانات
            </button>
          </div>
        </div>
      </div>
      
      {filteredUsers.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-block p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full mb-6">
            <IconUsers className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد نتائج</h3>
          <p className="text-gray-500 mb-6">لم يتم العثور على مستخدمين يطابقون معايير البحث</p>
          <button 
            onClick={() => {
              setSearchTerm("");
              setRoleFilter("all");
              setStatusFilter("all");
            }} 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium mx-auto transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            إعادة تعيين البحث
          </button>
        </div>
      ) : (
        <>
          {/* Users Table */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 mb-8 shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="text-right py-5 px-6 text-sm font-semibold text-gray-700">المستخدم</th>
                  <th className="text-right py-5 px-6 text-sm font-semibold text-gray-700">البريد الإلكتروني</th>
                  <th className="text-right py-5 px-6 text-sm font-semibold text-gray-700">الصلاحية</th>
                  <th className="text-right py-5 px-6 text-sm font-semibold text-gray-700">الحالة</th>
                  <th className="text-right py-5 px-6 text-sm font-semibold text-gray-700">تاريخ الإنشاء</th>
                  <th className="text-right py-5 px-6 text-sm font-semibold text-gray-700">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(userItem => {
                  const isCurrentUser = userItem.email === currentUser?.email;
                  const isOnlyAdmin = userItem.role === "admin" && getAdminCount() <= 1;
                  
                  return (
                    <tr key={userItem.id} className={`border-b border-gray-100 transition-all duration-200 ${
                      isCurrentUser ? 'bg-blue-50' : 
                      'hover:bg-gray-50'
                    }`}>
                      <td className="py-5 px-6">
                        <div className="flex items-center">
                          <div className="ml-3">
                            <div className="font-semibold text-gray-900">
                              {userItem.name || "بدون اسم"}
                              {isCurrentUser && (
                                <span className="mr-2 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded">(أنت)</span>
                              )}
                              {isOnlyAdmin && (
                                <span className="mr-2 text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded">المدير الوحيد</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {userItem.department && <span>{userItem.department}</span>}
                              {userItem.phone && (
                                <span className={`${userItem.department ? 'mr-4' : ''}`}>
                                  📱 {userItem.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="text-gray-600">{userItem.email}</div>
                      </td>
                      <td className="py-5 px-6">
                        <div className={`px-3 py-1.5 rounded-lg text-sm font-medium text-center ${
                          userItem.role === "admin" || userItem.role === "super_admin"
                            ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200' 
                            : userItem.role === "editor"
                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          {userItem.role === "admin" ? "مدير" : 
                           userItem.role === "editor" ? "محرر" : "مشاهد"}
                          {userItem.role === "editor" && (
                            <div className="text-xs text-blue-600 mt-1">✅ إدارة المحتوى</div>
                          )}
                          {userItem.role === "viewer" && (
                            <div className="text-xs text-gray-600 mt-1">👁️ عرض فقط</div>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <button 
                          onClick={() => toggleUserStatus(userItem)}
                          disabled={isOnlyAdmin && !userItem.isActive}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            userItem.isActive
                              ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 hover:from-green-100 hover:to-green-200 border border-green-200' 
                              : 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 hover:from-red-100 hover:to-red-200 border border-red-200'
                          } ${isOnlyAdmin && !userItem.isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                          title={
                            isOnlyAdmin && !userItem.isActive ? "لا يمكن تعطيل المدير الوحيد" :
                            userItem.isActive ? "تعطيل الحساب" : "تفعيل الحساب"
                          }
                        >
                          <div className="flex items-center">
                            {userItem.isActive ? 
                              <IconEye className="w-4 h-4 ml-2" /> : 
                              <IconEyeOff className="w-4 h-4 ml-2" />
                            }
                            {userItem.isActive ? 'نشط' : 'غير نشط'}
                          </div>
                        </button>
                      </td>
                      <td className="py-5 px-6">
                        <div className="text-sm text-gray-500">
                          {userItem.createdAt?.toLocaleDateString('ar-SA') || "تاريخ غير معروف"}
                          {userItem.lastLogin && (
                            <div className="text-xs text-gray-400 mt-1">
                              آخر دخول: {userItem.lastLogin.toLocaleDateString('ar-SA')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => handleEditUser(userItem)}
                            className="p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-blue-200"
                            title="تعديل بيانات المستخدم"
                          >
                            <IconEdit className="w-5 h-5" />
                          </button>
                          
                          <button 
                            onClick={() => deleteUser(userItem)}
                            className={`p-2.5 rounded-lg transition-all duration-200 border ${
                              isOnlyAdmin || deletingUser
                                ? 'text-gray-400 bg-gray-100 border-gray-300 cursor-not-allowed' 
                                : 'text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200'
                            }`}
                            title={isOnlyAdmin ? "لا يمكن حذف المدير الوحيد" : "حذف المستخدم نهائياً"}
                            disabled={isOnlyAdmin || deletingUser}
                          >
                            {deletingUser ? (
                              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <IconTrash className="w-5 h-5" />
                            )}
                          </button>
                          
                          {isCurrentUser && (
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
                              حسابك
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
              <div className="text-sm text-gray-500">
                عرض {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} من {filteredUsers.length}
                <select 
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="mr-4 ml-2 border border-gray-300 rounded px-2 py-1"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                لكل صفحة
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 flex items-center border border-gray-300"
                >
                  <IconChevronRight className="w-5 h-5" />
                  <span className="mr-2">السابق</span>
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`w-10 h-10 rounded-lg transition-all duration-200 border ${
                          currentPage === pageNumber
                            ? 'bg-blue-600 text-white shadow-md border-blue-600'
                            : 'hover:bg-gray-100 border-gray-300'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  
                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <span className="px-2">...</span>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`w-10 h-10 rounded-lg hover:bg-gray-100 border ${
                          currentPage === totalPages ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300'
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                <button
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 flex items-center border border-gray-300"
                >
                  <span className="ml-2">التالي</span>
                  <IconChevronLeft className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showAddUserModal && renderAddUserModal()}
      {showEditUserModal && renderEditUserModal()}
      {showSendCredentialsModal && renderSendCredentialsModal()}
    </div>
  );
}