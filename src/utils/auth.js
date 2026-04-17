// src/utils/auth.js
import { db } from "../firebase";
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp } from "firebase/firestore";

export const firestoreAuth = {
  // تسجيل الدخول
  async login(email, password) {
    try {
      const usersRef = collection(db, "adminUsers");
      const q = query(usersRef, where("email", "==", email.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
      
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      // التحقق من كلمة المرور
      const validPassword = userData.tempPassword === password || userData.password === password;
      if (!validPassword) {
        throw new Error("كلمة المرور غير صحيحة");
      }
      
      // التحقق من حالة الحساب
      if (!userData.isActive) {
        throw new Error("الحساب غير نشط. يرجى التواصل مع المسؤول");
      }
      
      // التحقق من الصلاحيات
      const validRoles = ["admin", "editor", "viewer", "super_admin"];
      if (!userData.role || !validRoles.includes(userData.role)) {
        throw new Error("ليس لديك صلاحية للدخول");
      }
      
      // تحديث آخر دخول
      await updateDoc(doc(db, "adminUsers", userDoc.id), {
        lastLogin: serverTimestamp()
      });
      
      // إرجاع بيانات المستخدم
      return {
        id: userDoc.id,
        uid: userDoc.id,
        email: userData.email,
        name: userData.name || userData.email,
        role: userData.role,
        phone: userData.phone || "",
        department: userData.department || "",
        isActive: userData.isActive !== false,
        createdAt: userData.createdAt,
        lastLogin: new Date()
      };
      
    } catch (error) {
      console.error("Auth error:", error);
      throw error;
    }
  },
  
  // التحقق من حالة تسجيل الدخول
  async checkAuth() {
    try {
      const savedUser = localStorage.getItem('adminUser');
      if (!savedUser) return null;
      
      const userData = JSON.parse(savedUser);
      const usersRef = collection(db, "adminUsers");
      const q = query(usersRef, where("email", "==", userData.email));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        this.logout();
        return null;
      }
      
      const userDoc = querySnapshot.docs[0];
      const currentData = userDoc.data();
      
      if (!currentData.isActive) {
        this.logout();
        return null;
      }
      
      // تحديث بيانات المستخدم
      const updatedUser = {
        ...userData,
        ...currentData,
        id: userDoc.id,
        uid: userDoc.id
      };
      
      localStorage.setItem('adminUser', JSON.stringify(updatedUser));
      return updatedUser;
      
    } catch (error) {
      console.error("Auth check error:", error);
      this.logout();
      return null;
    }
  },
  
  // تسجيل الخروج
  logout() {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  },
  
  // تغيير كلمة المرور
  async changePassword(userId, newPassword) {
    try {
      await updateDoc(doc(db, "adminUsers", userId), {
        password: newPassword,
        tempPassword: null, // إزالة كلمة المرور المؤقتة
        lastPasswordChange: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  }
};