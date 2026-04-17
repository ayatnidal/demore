// src/pages/Login.js
import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, getDocs, collection, query, where, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // حالة جديدة للتحقق من المصادقة
  const { language, direction } = useLanguage();
  const navigate = useNavigate();

  // التحقق من حالة المصادقة عند تحميل الصفحة
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // المستخدم مسجل دخوله بالفعل، تحقق من صلاحياته
        try {
          const userDoc = await getDoc(doc(db, "adminUsers", user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            // تحقق إذا كان المستخدم نشط
            if (userData.isActive !== false && userData.status !== "inactive") {
              console.log("✅ المستخدم مسجل دخوله بالفعل، توجيه إلى لوحة التحكم");
              navigate("/admin");
              return;
            } else {
              // المستخدم غير نشط، سجل خروجه
              await auth.signOut();
            }
          } else {
            // المستخدم غير موجود في adminUsers، سجل خروجه
            await auth.signOut();
          }
        } catch (error) {
          console.error("خطأ في التحقق من صلاحيات المستخدم:", error);
          await auth.signOut();
        }
      }
      setCheckingAuth(false);
    });

    // تنظيف الـ subscription
    return () => unsubscribe();
  }, [navigate]);

  // Animations (متناسقة مع الرئيسية)
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // ترجمات يدوية (بالإنجليزية والعربية)
  const translations = {
    en: {
      adminLogin: "Admin Login",
      signInToAdmin: "Sign in to access your management panel",
      welcomeBack: "Welcome Back",
      enterCredentials: "Please enter your credentials to continue",
      email: "Email Address",
      emailPlaceholder: "example@gmail.com",
      password: "Password",
      passwordPlaceholder: "••••••••",
      fillAllFields: "Please fill in all fields",
      signingIn: "Signing in...",
      signIn: "Sign In to Dashboard",
      backToHome: "Return to Homepage"
    },
    ar: {
      adminLogin: "تسجيل دخول المدير",
      signInToAdmin: "سجل الدخول للوصول إلى لوحة التحكم الخاصة بك",
      welcomeBack: "أهلاً بعودتك",
      enterCredentials: "الرجاء إدخال بيانات الاعتماد للمتابعة",
      email: "البريد الإلكتروني",
      emailPlaceholder: "example@gmail.com",
      password: "كلمة المرور",
      passwordPlaceholder: "••••••••",
      fillAllFields: "الرجاء ملء جميع الحقول",
      signingIn: "جاري تسجيل الدخول...",
      signIn: "تسجيل الدخول إلى لوحة التحكم",
      backToHome: "العودة إلى الصفحة الرئيسية"
    }
  };

  const t = (key) => translations[language]?.[key] || key;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError(t("fillAllFields"));
      setLoading(false);
      return;
    }

    try {
      console.log("🔄 محاولة تسجيل الدخول للمستخدم:", email);
      
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log("✅ تسجيل الدخول الناجح عبر Firebase Auth");
        
        const userDoc = await getDoc(doc(db, "adminUsers", user.uid));
        
        if (!userDoc.exists()) {
          console.log("⚠️ المستخدم غير موجود في adminUsers، تسجيل الخروج...");
          await auth.signOut();
          throw new Error("الحساب غير مصرح له بالوصول إلى لوحة التحكم");
        }
        
        const userData = userDoc.data();
        
        if (userData.isActive === false || userData.status === "inactive") {
          await auth.signOut();
          throw new Error("حسابك غير نشط. يرجى التواصل مع المدير");
        }
        
        console.log("🚀 توجيه إلى لوحة التحكم");
        navigate("/admin");
        return;
        
      } catch (authError) {
        console.log("⚠️ فشل الدخول عبر Firebase Auth:", authError.code);
        
        console.log("🔍 البحث عن المستخدم في Firestore...");
        
        const usersQuery = query(
          collection(db, "adminUsers"),
          where("email", "==", email)
        );
        
        const querySnapshot = await getDocs(usersQuery);
        
        if (querySnapshot.empty) {
          throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }
        
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const userId = userDoc.id;
        
        console.log("📋 بيانات المستخدم من Firestore:", {
          email: userData.email,
          role: userData.role,
          isActive: userData.isActive,
          hasPassword: !!userData.password
        });
        
        if (userData.isActive === false || userData.status === "inactive") {
          throw new Error("حسابك غير نشط. يرجى التواصل مع المدير");
        }
        
        const storedPassword = userData.password;
        
        if (storedPassword && storedPassword === password) {
          console.log("🔑 جرب كلمة المرور المخزنة في Firestore...");
          
          try {
            await updateDoc(doc(db, "adminUsers", userId), {
              lastLogin: new Date(),
              lastLoginIp: window.location.hostname
            });
            
            // هنا نحتاج إلى تسجيل الدخول في Firebase Auth أيضاً
            // لكن هذا يتطلب إنشاء حساب في Firebase Auth أولاً
            // سنقوم بتوجيه المستخدم مباشرة مع تحذير
            console.log("⚠️ يرجى إنشاء حساب في Firebase Auth لهذا المستخدم");
            
            // عرض رسالة للمستخدم
            setError("يرجى تسجيل الدخول باستخدام حساب Firebase Auth. يرجى التواصل مع المدير لإنشاء حساب لك.");
            setLoading(false);
            return;
            
          } catch (storedPasswordError) {
            console.log("❌ فشل الدخول بكلمة المرور المخزنة:", storedPasswordError.code);
            
            if (password === userData.password) {
              throw new Error("يجب إعادة تعيين كلمة المرور عبر 'نسيت كلمة المرور'");
            }
          }
        }
        
        if (storedPassword && storedPassword !== password) {
          throw new Error("كلمة المرور غير صحيحة. استخدم كلمة المرور التي أعطاك إياها المدير");
        }
        
        throw new Error("كلمة المرور غير صحيحة");
      }
      
    } catch (error) {
      console.error("❌ Login error:", error.code || error.message);
      
      let errorMessage = "فشل تسجيل الدخول";
      if (error.code === "auth/invalid-credential") {
        errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "البريد الإلكتروني غير صالح";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "المستخدم غير موجود";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "كلمة المرور غير صحيحة";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "محاولات كثيرة جداً، حاول لاحقاً";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "خطأ في الاتصال بالإنترنت";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  // عرض شاشة تحميل أثناء التحقق من المصادقة
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {language === 'ar' ? 'جاري التحقق...' : 'Checking...'}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 relative overflow-hidden"
      dir={direction}
    >
      {/* تأثيرات خلفية متحركة (نفس الكود السابق) */}
      <div className="absolute inset-0 overflow-hidden">
        {/* أشكال هندسية عائمة */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`float-${i}`}
            className={`absolute ${
              i % 3 === 0 ? 'rounded-full' : 
              i % 3 === 1 ? 'rounded-lg' : 
              'rounded-sm'
            } ${
              i % 4 === 0 ? 'border-gray-200/30' : 
              i % 4 === 1 ? 'border-gray-300/20' : 
              i % 4 === 2 ? 'border-gray-400/10' : 
              'border-gray-500/5'
            } border`}
            style={{
              width: `${30 + i * 10}px`,
              height: `${30 + i * 10}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [
                `${Math.sin(i * 0.3) * 50}px`,
                `${Math.sin(i * 0.3 + Math.PI) * 50}px`,
                `${Math.sin(i * 0.3 + Math.PI * 2) * 50}px`
              ],
              y: [
                `${Math.cos(i * 0.3) * 50}px`,
                `${Math.cos(i * 0.3 + Math.PI) * 50}px`,
                `${Math.cos(i * 0.3 + Math.PI * 2) * 50}px`
              ],
              rotate: i % 2 === 0 ? [0, 180, 360] : [360, 180, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 40 + i * 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* خطوط شبكية خفيفة */}
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={`grid-h-${i}`}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/10 to-transparent"
              style={{ top: `${(i + 1) * 8}%` }}
              animate={{
                opacity: [0.05, 0.1, 0.05],
                scaleX: [1, 1.02, 1],
              }}
              transition={{
                duration: 5 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Container */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        className="relative z-10 w-full max-w-6xl"
      >
        <div className="flex flex-col lg:flex-row min-h-[700px] rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Left Side - Brand Showcase */}
          <motion.div
            variants={scaleIn}
            className="lg:w-2/5 relative overflow-hidden"
          >
            <div className="absolute inset-0">
              {/* خلفية متدرجة متحركة */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%)',
                    'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
                    'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 100%)',
                  ],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* تأثير إضاءة متحرك */}
              <motion.div
                className="absolute top-0 right-0 w-64 h-64"
                animate={{
                  background: [
                    'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                    'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                  ],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
            
            {/* محتوى الجانب الأيسر */}
            <div className="relative z-10 h-full p-8 lg:p-12 flex flex-col justify-center">
              <motion.div variants={fadeInUp} className="mb-12">
                {/* شعار DEMORE مع تصميم أنيق */}
                <div className="flex flex-col items-center lg:items-start mb-10">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 inline-block"
                  >
                    <div className="text-center">
                      <motion.h1 
                        className="text-5xl font-light tracking-tight text-white mb-2"
                        animate={{
                          letterSpacing: ['-0.02em', '-0.01em', '-0.02em']
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        DEMORE
                      </motion.h1>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                        className="h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      />
                      <p className="text-white/80 text-lg mt-2 tracking-wider">
                        The design and more
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center lg:text-left"
                    variants={fadeInUp}
                  >
                    <h2 className="text-2xl lg:text-3xl font-light text-white mb-4">
                      {t("adminLogin")}
                    </h2>
                    <p className="text-white/70 text-lg">
                      {t("signInToAdmin")}
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                variants={fadeInUp}
                className="mt-8 pt-6 border-t border-white/20"
              >
                <p className="text-white/70 text-sm text-center lg:text-center">
                  {language === 'ar' ? 'للتواصل مع الدعم:' : 'For support contact:'}
                  <br />
                  <span className="font-light tracking-wider">info@demoreps.com</span>
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            variants={scaleIn}
            className="lg:w-3/5 bg-white p-8 lg:p-12 relative"
          >
            {/* تأثيرات خلفية خفيفة */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent opacity-50" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-transparent opacity-30" />
            
            <div className="relative z-10 max-w-md mx-auto">
              {/* Form Header */}
              <motion.div variants={fadeInUp} className="mb-12 text-center lg:text-right">
                <div className="flex justify-center lg:justify-end items-center gap-4 mb-6">
                  <div className="w-12 h-px bg-gray-300"></div>
                  <span className="text-sm uppercase tracking-widest text-gray-500">
                    {language === 'ar' ? 'دخول المدير' : 'Admin Access'}
                  </span>
                  <div className="w-12 h-px bg-gray-300"></div>
                </div>
                
                <h3 className="text-3xl font-light text-gray-800 mb-3 text-left">
                  {t("welcomeBack")}
                </h3>
                <p className="text-gray-500 text-left">
                  {t("enterCredentials")}
                </p>
              </motion.div>

              <form onSubmit={handleLogin} className="space-y-8">
                
                {/* Email Field */}
                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-light tracking-wider text-gray-700 mb-3 uppercase">
                    {t("email")}
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 bg-white/80 hover:bg-white group-hover:border-gray-300"
                      placeholder={t("emailPlaceholder")}
                      dir="ltr"
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-light tracking-wider text-gray-700 mb-3 uppercase">
                    {t("password")}
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-gray-600 transition-colors duration-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-all duration-300 bg-white/80 hover:bg-white group-hover:border-gray-300"
                      placeholder={t("passwordPlaceholder")}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors duration-300"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 border border-red-100 rounded-xl p-4"
                  >
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  variants={fadeInUp}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl group-hover:from-gray-800 group-hover:to-gray-700 transition-all duration-300"></div>
                  <div className="relative z-10 w-full py-4 rounded-xl flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-white font-light tracking-wider">
                          {t("signingIn")}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-white font-light tracking-wider text-sm uppercase">
                          {t("signIn")}
                        </span>
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </div>
                </motion.button>

                {/* Divider */}
                <motion.div variants={fadeInUp} className="relative pt-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white text-sm text-gray-400">
                      {language === 'ar' ? 'أو' : 'or'}
                    </span>
                  </div>
                </motion.div>

                {/* Back to Home */}
                <motion.div variants={fadeInUp} className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-300 group"
                  >
                    <span className="text-sm tracking-wider">
                      {t("backToHome")}
                    </span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div
          variants={fadeInUp}
          className="mt-8 text-center text-sm text-gray-400"
        >
          © {new Date().getFullYear()} DEMORE. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
          <br />
          <span className="text-xs">The design and more</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}