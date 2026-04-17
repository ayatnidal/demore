import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateEmail,
  signOut,
  signInWithEmailAndPassword,
  getAuth,
  createUserWithEmailAndPassword
} from "firebase/auth";

import { initializeApp, deleteApp } from "firebase/app";
import { auth, db, firebaseConfig } from "../firebase";

import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  updateDoc
} from "firebase/firestore";

/* =========================================================
   1️⃣ إنشاء مستخدم جديد بدون تغيير جلسة الأدمن
========================================================= */
export async function createAdminUser(userData) {
  const { email, password, name, role, phone, department } = userData;

  try {
    const adminUser = auth.currentUser;

    if (!adminUser) {
      throw new Error("يجب تسجيل الدخول كمسؤول");
    }

    // 🔹 إنشاء Auth مؤقت (Session منفصلة)
    const tempApp = initializeApp(firebaseConfig, `temp-${Date.now()}`);
    const tempAuth = getAuth(tempApp);

    // 🔹 إنشاء المستخدم
    const userCredential = await createUserWithEmailAndPassword(
      tempAuth,
      email,
      password
    );

    const newUser = userCredential.user;

    // 🔹 حفظ بيانات المستخدم (بدون كلمة مرور)
    await setDoc(doc(db, "adminUsers", newUser.uid), {
      uid: newUser.uid,
      email: newUser.email,
      name,
      role,
      phone: phone || "",
      department: department || "",
      isActive: true,
      status: "active",
      permissions: ((role) => {
        const permissions = {
          admin: {
            manageUsers: true,
            manageContent: true,
            manageSettings: true,
            viewReports: true,
            exportData: true
          },
          editor: {
            manageUsers: false,
            manageContent: true,
            manageSettings: false,
            viewReports: true,
            exportData: false
          },
          viewer: {
            manageUsers: false,
            manageContent: false,
            manageSettings: false,
            viewReports: true,
            exportData: false
          }
        };

        return permissions[role] || permissions.viewer;
      })(role),
      createdAt: serverTimestamp(),
      createdBy: adminUser.email,
      createdById: adminUser.uid,
      lastLogin: null
    });

    // 🔹 حذف الـ app المؤقت
    await deleteApp(tempApp);

    return {
      success: true,
      userId: newUser.uid,
      message: "تم إنشاء المستخدم بنجاح"
    };

  } catch (error) {
    console.error("❌ createAdminUser:", error);

    if (error.code === "auth/email-already-in-use") {
      throw new Error("البريد الإلكتروني مستخدم بالفعل");
    }
    if (error.code === "auth/weak-password") {
      throw new Error("كلمة المرور ضعيفة");
    }

    throw new Error("فشل إنشاء المستخدم");
  }
}

/* =========================================================
   2️⃣ تغيير كلمة مرور المستخدم الحالي (الأدمن أو غيره)
========================================================= */
export const changeCurrentUserPassword = async (
  currentPassword,
  newPassword
) => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("يجب تسجيل الدخول أولاً");
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);

    await updateDoc(doc(db, "adminUsers", user.uid), {
      lastPasswordChange: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error("❌ changeCurrentUserPassword:", error);
    throw new Error("فشل تغيير كلمة المرور");
  }
};

/* =========================================================
   3️⃣ تغيير بريد المستخدم الحالي
========================================================= */
export const changeCurrentUserEmail = async (
  currentPassword,
  newEmail
) => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) {
      throw new Error("يجب تسجيل الدخول أولاً");
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    await reauthenticateWithCredential(user, credential);
    await updateEmail(user, newEmail);

    await updateDoc(doc(db, "adminUsers", user.uid), {
      email: newEmail,
      updatedAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error("❌ changeCurrentUserEmail:", error);
    throw new Error("فشل تغيير البريد الإلكتروني");
  }
};

/* =========================================================
   4️⃣ التحقق من جلسة الأدمن
========================================================= */
export const verifyAdminSession = () => {
  const user = auth.currentUser;
  if (!user) {
    return { valid: false };
  }
  return { valid: true, user };
};

/* =========================================================
   5️⃣ الصلاحيات الافتراضية
========================================================= */

/* =========================================================
   6️⃣ Export Auth Helpers
========================================================= */
export {
  signOut,
  signInWithEmailAndPassword
};
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateEmail,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

import { auth, db } from "../firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  collection
} from "firebase/firestore";

// 🔹 متغير لتخزين حالة التطبيق المؤقت (إذا اضطررنا لاستخدامه)
let tempApp = null;

/* =========================================================
   1️⃣ إنشاء مستخدم جديد باستخدام Firebase Admin SDK (مستحسن)
   أو باستخدام Cloud Functions (الحل الأفضل)
========================================================= */
export const createAdminUser = async (userData) => {
  const { email, password, name, role, phone, department } = userData;

  try {
    const adminUser = auth.currentUser;

    if (!adminUser) {
      throw new Error("يجب تسجيل الدخول كمسؤول أولاً");
    }

    // 🔹 الطريقة الأفضل: استخدام Cloud Function
    try {
      // 1. محاولة استدعاء Cloud Function إذا كان موجوداً
      const response = await createUserViaCloudFunction(userData, adminUser);
      return response;
    } catch (cloudError) {
      console.log("Cloud Function غير متوفر، استخدام الطريقة البديلة");
      
      // 2. الطريقة البديلة: تسجيل خروج مؤقت ثم إنشاء المستخدم
      return await createUserWithTemporaryLogout(userData, adminUser);
    }

  } catch (error) {
    console.error("❌ createAdminUser Error:", error);
    
    let errorMessage = "فشل إنشاء المستخدم";
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "البريد الإلكتروني مستخدم بالفعل";
        break;
      case "auth/weak-password":
        errorMessage = "كلمة المرور ضعيفة (يجب أن تكون 8 أحرف على الأقل)";
        break;
      case "auth/invalid-email":
        errorMessage = "البريد الإلكتروني غير صالح";
        break;
      case "auth/operation-not-allowed":
        errorMessage = "عملية إنشاء الحساب غير مسموحة";
        break;
    }
    
    throw new Error(errorMessage);
  }
};

/* =========================================================
   🔥 الطريقة المثلى: استخدام Cloud Function
========================================================= */
const createUserViaCloudFunction = async (userData, adminUser) => {
  // هذا مثال لاستدعاء Cloud Function
  // يجب إنشاء Cloud Function في الخلفية
  
  const userDataToSend = {
    email: userData.email,
    password: userData.password,
    displayName: userData.name,
    role: userData.role,
    phone: userData.phone || "",
    department: userData.department || "",
    createdBy: adminUser.email,
    createdById: adminUser.uid
  };

  // إذا كان لديك Cloud Functions
  // import { getFunctions, httpsCallable } from "firebase/functions";
  // const functions = getFunctions();
  // const createUser = httpsCallable(functions, 'createUser');
  // const result = await createUser(userDataToSend);
  
  // مؤقتاً نستخدم الطريقة البديلة
  throw new Error("Cloud Function غير متوفر حالياً");
};

/* =========================================================
   🔄 الطريقة البديلة: تسجيل خروج مؤقت
========================================================= */
const createUserWithTemporaryLogout = async (userData, adminUser) => {
  const { email, password, name, role, phone, department } = userData;
  
  // 🔹 1. حفظ بيانات المسؤول الحالي
  const adminEmail = adminUser.email;
  const adminUid = adminUser.uid;
  
  // 🔹 2. جلب كلمة مرور المسؤول من Firestore (إذا كانت مخزنة)
  let adminPassword = null;
  try {
    const adminDoc = await getDoc(doc(db, "adminUsers", adminUid));
    if (adminDoc.exists()) {
      adminPassword = adminDoc.data().password; // ⚠️ يجب أن تكون مشفرة
    }
  } catch (error) {
    console.warn("⚠️ تعذر الحصول على كلمة مرور المسؤول من Firestore");
  }
  
  // 🔹 3. إنشاء المستخدم الجديد
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  
  const newUser = userCredential.user;
  
  // 🔹 4. حفظ بيانات المستخدم الجديد في Firestore
  await setDoc(doc(db, "adminUsers", newUser.uid), {
    uid: newUser.uid,
    email: newUser.email,
    name,
    role,
    phone: phone || "",
    department: department || "",
    isActive: true,
    status: "active",
    permissions: ((role) => {
      const permissions = {
        admin: {
          manageUsers: true,
          manageContent: true,
          manageSettings: true,
          viewReports: true,
          exportData: true
        },
        editor: {
          manageUsers: false,
          manageContent: true,
          manageSettings: false,
          viewReports: true,
          exportData: false
        },
        viewer: {
          manageUsers: false,
          manageContent: false,
          manageSettings: false,
          viewReports: true,
          exportData: false
        }
      };

      return permissions[role] || permissions.viewer;
    })(role),
    createdAt: serverTimestamp(),
    createdBy: adminEmail,
    createdById: adminUid,
    lastLogin: null,
    lastPasswordChange: serverTimestamp(),
    canChangePassword: role === "admin" || role === "super_admin"
  });
  
  // 🔹 5. العودة إلى حساب المسؤول الأصلي
  if (adminPassword) {
    try {
      // تسجيل خروج من حساب المستخدم الجديد
      await signOut(auth);
      
      // تسجيل دخول بحساب المسؤول الأصلي
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      
      console.log("✅ تم العودة إلى حساب المسؤول بنجاح");
    } catch (recoveryError) {
      console.error("⚠️ فشل العودة إلى حساب المسؤول:", recoveryError);
      
      // إشعار للمسؤول
      throw new Error(
        `تم إنشاء المستخدم الجديد بنجاح، ولكن تعذر العودة إلى حسابك.\n` +
        `يرجى تسجيل الخروج وإعادة الدخول بحسابك.\n` +
        `بيانات الدخول: ${email} / ${password}`
      );
    }
  } else {
    console.warn("⚠️ لم يتم تخزين كلمة مرور المسؤول، سيتم البقاء في حساب المستخدم الجديد");
  }
  
  return {
    success: true,
    userId: newUser.uid,
    email: newUser.email,
    message: "تم إنشاء المستخدم بنجاح"
  };
};

/* =========================================================
   2️⃣ 🔄 دالة مساعدة لتغيير كلمة مرور أي مستخدم (للمسؤول فقط)
========================================================= */
export const changeUserPassword = async (targetUserId, newPassword, currentAdmin) => {
  try {
    if (!currentAdmin || currentAdmin.role !== "admin") {
      throw new Error("الصفحة متاحة للمسؤولين فقط");
    }

    // 1. جلب بيانات المستخدم الهدف
    const targetUserDoc = await getDoc(doc(db, "adminUsers", targetUserId));
    if (!targetUserDoc.exists()) {
      throw new Error("المستخدم غير موجود");
    }

    const targetUserData = targetUserDoc.data();
    
    // 2. التحقق من أن المستخدم الهدف ليس "مشاهد" أو "محرر" فقط
    if (targetUserData.role !== "admin" && targetUserData.role !== "super_admin") {
      throw new Error("تغيير كلمة المرور متاح للمديرين فقط");
    }

    // 3. حفظ بيانات المسؤول الحالي
    const adminEmail = currentAdmin.email;
    const adminUid = currentAdmin.uid;
    const adminDoc = await getDoc(doc(db, "adminUsers", adminUid));
    const adminPassword = adminDoc.data()?.password;

    if (!adminPassword) {
      throw new Error("تعذر الحصول على بيانات المسؤول");
    }

    // 4. تسجيل خروج مؤقت وحفظ بيانات الجلسة
    const userCredential = await signInWithEmailAndPassword(
      auth,
      targetUserData.email,
      targetUserData.password || "temp-password"
    );

    // 5. تغيير كلمة المرور للمستخدم الهدف
    await updatePassword(userCredential.user, newPassword);

    // 6. تحديث كلمة المرور في Firestore
    await updateDoc(doc(db, "adminUsers", targetUserId), {
      password: newPassword,
      lastPasswordChange: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: adminEmail
    });

    // 7. العودة إلى حساب المسؤول
    await signOut(auth);
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

    return {
      success: true,
      message: `تم تغيير كلمة مرور ${targetUserData.name || targetUserData.email} بنجاح`
    };

  } catch (error) {
    console.error("❌ changeUserPassword Error:", error);
    
    // محاولة استعادة جلسة المسؤول في حالة الخطأ
    try {
      const adminDoc = await getDoc(doc(db, "adminUsers", currentAdmin.uid));
      const adminData = adminDoc.data();
      if (adminData?.password) {
        await signInWithEmailAndPassword(auth, currentAdmin.email, adminData.password);
      }
    } catch (recoveryError) {
      console.error("❌ فشل استعادة جلسة المسؤول:", recoveryError);
    }
    
    throw new Error(error.message || "فشل تغيير كلمة المرور");
  }
};

/* =========================================================
   3️⃣ 🔍 دالة التحقق من البريد الإلكتروني المكرر
========================================================= */
export const checkEmailExists = async (email) => {
  try {
    const usersRef = collection(db, "adminUsers");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    return !querySnapshot.empty;
  } catch (error) {
    console.error("❌ checkEmailExists Error:", error);
    return false;
  }
};

/* =========================================================
   4️⃣ 🔄 دالة لإعادة تعيين جلسة المستخدم
========================================================= */
export const reinitializeSession = async (email, password) => {
  try {
    // تسجيل خروج من الجلسة الحالية
    await signOut(auth);
    
    // تسجيل دخول جديد
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // تحديث آخر تسجيل دخول
    await updateDoc(doc(db, "adminUsers", userCredential.user.uid), {
      lastLogin: serverTimestamp()
    });
    
    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    console.error("❌ reinitializeSession Error:", error);
    throw new Error("فشل إعادة تعيين الجلسة");
  }
};

/* =========================================================
   5️⃣ 🛡️ تحسين دالة الصلاحيات الافتراضية
========================================================= */
const getDefaultPermissions = (role) => {
  const basePermissions = {
    // جميع المستخدمين
    viewDashboard: true,
    viewProfile: true,
    
    // الصلاحيات المشتركة
    viewProjects: true,
    viewServices: true,
    viewTestimonials: true,
    viewMessages: true
  };

  const rolePermissions = {
    admin: {
      ...basePermissions,
      manageUsers: true,
      manageContent: true,
      manageSettings: true,
      viewReports: true,
      exportData: true,
      deleteContent: true,
      approveTestimonials: true,
      toggleFeatured: true
    },
    super_admin: {
      ...basePermissions,
      manageUsers: true,
      manageContent: true,
      manageSettings: true,
      viewReports: true,
      exportData: true,
      deleteContent: true,
      approveTestimonials: true,
      toggleFeatured: true,
      systemAccess: true,
      deleteUsers: true
    },
    editor: {
      ...basePermissions,
      manageUsers: false,
      manageContent: true,
      manageSettings: false,
      viewReports: true,
      exportData: false,
      deleteContent: false, // يمكنهم حذف فقط المحتوى الذي أضافوه
      approveTestimonials: false,
      toggleFeatured: false
    },
    viewer: {
      ...basePermissions,
      manageUsers: false,
      manageContent: false,
      manageSettings: false,
      viewReports: false,
      exportData: false,
      deleteContent: false,
      approveTestimonials: false,
      toggleFeatured: false,
      viewOnly: true
    }
  };

  return rolePermissions[role] || rolePermissions.viewer;
};

/* =========================================================
   6️⃣ 📊 دالة للحصول على إحصائيات المستخدمين
========================================================= */
export const getUserStats = async () => {
  try {
    const usersRef = collection(db, "adminUsers");
    const snapshot = await getDocs(usersRef);
    
    const stats = {
      total: 0,
      byRole: {
        admin: 0,
        super_admin: 0,
        editor: 0,
        viewer: 0
      },
      active: 0,
      inactive: 0,
      recent: 0 // المستخدمين المضافين في آخر 7 أيام
    };
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    snapshot.forEach(doc => {
      const user = doc.data();
      stats.total++;
      
      // إحصاء حسب الصلاحية
      if (stats.byRole[user.role]) {
        stats.byRole[user.role]++;
      }
      
      // إحصاء الحالة
      if (user.isActive && user.status !== "deactivated") {
        stats.active++;
      } else {
        stats.inactive++;
      }
      
      // إحصاء المستخدمين الجدد
      const createdAt = user.createdAt?.toDate?.();
      if (createdAt && createdAt > sevenDaysAgo) {
        stats.recent++;
      }
    });
    
    return stats;
  } catch (error) {
    console.error("❌ getUserStats Error:", error);
    return null;
  }
};

/* =========================================================
   7️⃣ 📋 Export الدوال المحسنة
========================================================= */
export {
  signOut,
  signInWithEmailAndPassword,
  reauthenticateWithCredential,
  updatePassword,
  updateEmail
};

/* =========================================================
   📝 مثال للاستخدام في UserManagement.js
========================================================= */
/*
// 1. استيراد الدوال المحسنة
import { createAdminUser, changeUserPassword, checkEmailExists } from "./firebaseAuthHelper";

// 2. استخدام دالة إنشاء المستخدم
const handleAddUser = async (userData) => {
  try {
    const result = await createAdminUser(userData);
    
    if (result.success) {
      showNotification("success", "نجاح", "✅ تم إنشاء المستخدم بنجاح");
      
      // نسخ بيانات الدخول
      navigator.clipboard.writeText(
        `البريد: ${userData.email}\nكلمة المرور: ${userData.password}`
      );
      
      return true;
    }
  } catch (error) {
    showNotification("error", "خطأ", `❌ ${error.message}`);
    return false;
  }
};

// 3. التحقق من البريد المكرر
const checkEmail = async (email) => {
  const exists = await checkEmailExists(email);
  if (exists) {
    setErrors({ email: "البريد الإلكتروني مسجل بالفعل" });
    return false;
  }
  return true;
};
*/