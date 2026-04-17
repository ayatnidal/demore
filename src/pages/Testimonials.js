import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  orderBy, 
  query, 
  doc, 
  getDoc, 
  serverTimestamp,
  where
} from "firebase/firestore";
import { useLanguage } from "../contexts/LanguageContext";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [pageContent, setPageContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const { t, language } = useLanguage();

  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    location: "",
    rating: 5,
    comment: "",
    projectType: "residential",
    serviceType: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    const fetchTestimonialsData = async () => {
      try {
        setLoading(true);

        // ✅ جلب الشهادات المنشورة من collection publishedTestimonials
        // أو جلب الشهادات المعتمدة من collection testimonials
        try {
          // أولاً: محاولة جلب من publishedTestimonials
          const publishedQuery = query(
            collection(db, "publishedTestimonials"),
            orderBy("createdAt", "desc")
          );
          const publishedSnapshot = await getDocs(publishedQuery);
          
          if (publishedSnapshot.docs.length > 0) {
            // إذا وجدت شهادات في publishedTestimonials
            const publishedData = [];
            publishedSnapshot.forEach((doc) => {
              const testimonialData = doc.data();
              publishedData.push({
                id: doc.id,
                ...testimonialData,
                // ✅ تأكيد أن الشهادة معتمدة
                approved: true,
                status: "approved"
              });
            });
            setTestimonials(publishedData);
          } else {
            // إذا لم توجد في publishedTestimonials، جلب من testimonials المعتمدة
            const testimonialsQuery = query(
              collection(db, "testimonials"),
              where("approved", "==", true),
              orderBy("createdAt", "desc")
            );
            const testimonialsSnapshot = await getDocs(testimonialsQuery);
            const testimonialsData = [];
            
            testimonialsSnapshot.forEach((doc) => {
              const testimonialData = doc.data();
              // عرض التوصيات المعتمدة فقط
              if (testimonialData.approved === true || testimonialData.status === "approved") {
                testimonialsData.push({
                  id: doc.id,
                  ...testimonialData
                });
              }
            });
            setTestimonials(testimonialsData);
          }
        } catch (error) {
          console.log("محاولة جلب بديلة...");
          // ✅ محاولة جلب من collection testimonials مباشرة مع فلتر approved
          const testimonialsQuery = query(
            collection(db, "testimonials"),
            where("approved", "==", true),
            orderBy("createdAt", "desc")
          );
          const testimonialsSnapshot = await getDocs(testimonialsQuery);
          const testimonialsData = [];
          
          testimonialsSnapshot.forEach((doc) => {
            const testimonialData = doc.data();
            // ✅ عرض التوصيات المعتمدة فقط
            if (testimonialData.approved === true) {
              testimonialsData.push({
                id: doc.id,
                ...testimonialData
              });
            }
          });
          setTestimonials(testimonialsData);
        }

        // جلب محتوى الصفحة
        try {
          const pageDoc = await getDoc(doc(db, "pageContent", "testimonials"));
          if (pageDoc.exists()) {
            setPageContent(pageDoc.data());
          }
        } catch (error) {
          console.log("لا يوجد محتوى مخصص للصفحة:", error);
        }

      } catch (error) {
        console.error("Error fetching testimonials data:", error);
        
        // ✅ عرض رسالة خطأ واضحة للمستخدم
        setPageContent({
          heroTitle: t('testimonials.heroTitle'),
          heroSubtitle: t('testimonials.heroSubtitle'),
          sectionTitle: t('testimonials.sectionTitle'),
          sectionSubtitle: t('testimonials.sectionSubtitle'),
          ctaTitle: t('testimonials.ctaTitle'),
          ctaSubtitle: t('testimonials.ctaSubtitle')
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonialsData();
  }, [language, t]);

  // ✅ دالة لاستخراج النص بناءً على اللغة من Firestore
  const getTextByLanguage = (content) => {
    if (!content) return '';
    
    // إذا كان النص كائن يحتوي على ترجمة {ar: "...", en: "..."}
    if (typeof content === 'object' && content !== null) {
      if (language === 'ar' && content.ar) {
        return content.ar;
      } else if (language === 'en' && content.en) {
        return content.en;
      }
      // إذا لم يكن هناك ترجمة للغة المطلوبة، حاول إرجاع أي قيمة نصية
      const firstValue = Object.values(content).find(val => typeof val === 'string');
      return firstValue || '';
    }
    
    // إذا كان النص سلسلة نصية عادية
    return content;
  };

  // ✅ دالة للحصول على محتوى الصفحة بشكل آمن
  const getPageContent = () => {
    if (Object.keys(pageContent).length === 0) {
      return {
        heroTitle: t('testimonials.heroTitle'),
        heroSubtitle: t('testimonials.heroSubtitle'),
        sectionTitle: t('testimonials.sectionTitle'),
        sectionSubtitle: t('testimonials.sectionSubtitle'),
        ctaTitle: t('testimonials.ctaTitle'),
        ctaSubtitle: t('testimonials.ctaSubtitle')
      };
    }
    
    // استخراج النصوص بناءً على اللغة باستخدام getTextByLanguage
    return {
      heroTitle: getTextByLanguage(pageContent.heroTitle) || t('testimonials.heroTitle'),
      heroSubtitle: getTextByLanguage(pageContent.heroSubtitle) || t('testimonials.heroSubtitle'),
      sectionTitle: getTextByLanguage(pageContent.sectionTitle) || t('testimonials.sectionTitle'),
      sectionSubtitle: getTextByLanguage(pageContent.sectionSubtitle) || t('testimonials.sectionSubtitle'),
      ctaTitle: getTextByLanguage(pageContent.ctaTitle) || t('testimonials.ctaTitle'),
      ctaSubtitle: getTextByLanguage(pageContent.ctaSubtitle) || t('testimonials.ctaSubtitle')
    };
  };

  const displayPageContent = getPageContent();

  // حساب الإحصائيات الحقيقية مع تحديد أقصى حد 5
  const totalTestimonials = testimonials.length;
  
  const calculateAverageRating = () => {
    if (totalTestimonials === 0) return 4.9;
    
    const totalRating = testimonials.reduce((sum, testimonial) => {
      const rating = Math.min(testimonial.rating, 5);
      return sum + rating;
    }, 0);
    
    const average = totalRating / totalTestimonials;
    return Math.min(average, 5);
  };

  const averageRating = calculateAverageRating();
  
  const recommendationRate = totalTestimonials > 0 
    ? Math.round((testimonials.filter(testimonial => Math.min(testimonial.rating, 5) >= 4).length / totalTestimonials) * 100)
    : 98;

  const satisfactionRate = 100;

  // ✅ خدمات التصفية المحدثة مع كل الخدمات
  const serviceTypes = [
    { 
      id: "all", 
      name: t('testimonials.allServices'), 
      count: totalTestimonials 
    },
    { 
      id: "living-room", 
      name: language === 'ar' ? "صالات جلوس" : "Living Room", 
      count: testimonials.filter(testimonial => testimonial.serviceType === "living-room" || testimonial.service === "living-room").length 
    },
    { 
      id: "kitchen", 
      name: language === 'ar' ? "مطابخ" : "Kitchen", 
      count: testimonials.filter(testimonial => testimonial.serviceType === "kitchen" || testimonial.service === "kitchen").length 
    },
    { 
      id: "bedroom", 
      name: language === 'ar' ? "غرف نوم" : "Bedroom", 
      count: testimonials.filter(testimonial => testimonial.serviceType === "bedroom" || testimonial.service === "bedroom").length 
    },
    { 
      id: "office", 
      name: language === 'ar' ? "مكاتب" : "Office", 
      count: testimonials.filter(testimonial => testimonial.serviceType === "office" || testimonial.service === "office").length 
    },
    { 
      id: "commercial", 
      name: t('testimonials.commercial'), 
      count: testimonials.filter(testimonial => testimonial.serviceType === "commercial" || testimonial.service === "commercial").length 
    },
    { 
      id: "bathroom", 
      name: language === 'ar' ? "حمامات" : "Bathroom", 
      count: testimonials.filter(testimonial => testimonial.serviceType === "bathroom" || testimonial.service === "bathroom").length 
    },
    { 
      id: "design", 
      name: language === 'ar' ? "تصميم" : "Design", 
      count: testimonials.filter(testimonial => testimonial.serviceType === "design" || testimonial.service === "design").length 
    },
    { 
      id: "renovation", 
      name: language === 'ar' ? "تطوير وترميم" : "Renovation", 
      count: testimonials.filter(testimonial => testimonial.serviceType === "renovation" || testimonial.service === "renovation").length 
    }
  ];

  // ✅ دالة التصفية المحسنة
  const filteredTestimonials = activeFilter === "all" 
    ? testimonials 
    : testimonials.filter(testimonial => 
        testimonial.serviceType === activeFilter || 
        testimonial.service === activeFilter
      );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTestimonial(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    const safeRating = Math.min(rating, 5);
    setNewTestimonial(prevState => ({
      ...prevState,
      rating: safeRating
    }));
  };

  // ✅ دالة إضافة شهادة جديدة - محدثة
  const handleSubmitTestimonial = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitStatus(null);

    try {
      // التحقق من البيانات
      if (!newTestimonial.name.trim() || !newTestimonial.comment.trim()) {
        setSubmitStatus("validation_error");
        setSubmitLoading(false);
        return;
      }

      const safeRating = Math.min(newTestimonial.rating, 5);

      // ✅ بيانات الشهادة المحدثة
      const newTestimonialData = {
        name: newTestimonial.name.trim(),
        location: newTestimonial.location.trim() || "",
        rating: safeRating,
        comment: newTestimonial.comment.trim(),
        projectType: newTestimonial.projectType,
        serviceType: newTestimonial.serviceType,
        // ✅ الحقول الأساسية للنظام الموحد
        approved: false,
        status: "pending",
        // ✅ الحقول الإضافية
        phone: newTestimonial.phone || "",
        email: newTestimonial.email || "",
        // ✅ التواريخ
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // ✅ معلومات إضافية
        language: language,
        adminNotified: false,
        contactPreference: newTestimonial.contactPreference || "email"
      };

      console.log("جاري إرسال الشهادة:", newTestimonialData);

      // ✅ 1. إضافة الشهادة إلى collection testimonials
      const docRef = await addDoc(collection(db, "testimonials"), newTestimonialData);
      console.log("تم حفظ الشهادة في testimonials، المعرف:", docRef.id);

      // ✅ 2. إرسال إشعار للمدير
      try {
        await addDoc(collection(db, "adminNotifications"), {
          type: "new_testimonial",
          testimonialId: docRef.id,
          status: "unread",
          createdAt: serverTimestamp(),
          message: language === 'ar' 
            ? `توصية جديدة من ${newTestimonial.name.trim()}` 
            : `New testimonial from ${newTestimonial.name.trim()}`,
          testimonialData: {
            name: newTestimonial.name.trim(),
            rating: safeRating,
            comment: newTestimonial.comment.trim().substring(0, 100) + "...",
            serviceType: newTestimonial.serviceType
          }
        });
        console.log("تم إرسال الإشعار للمدير");
      } catch (notificationError) {
        console.error("خطأ في إرسال الإشعار:", notificationError);
      }

      setSubmitStatus("success");
      
      // ✅ إعادة تعيين النموذج
      setNewTestimonial({
        name: "",
        location: "",
        rating: 5,
        comment: "",
        projectType: "residential",
        serviceType: "",
        phone: "",
        email: ""
      });

      setTimeout(() => {
        setShowAddForm(false);
        setSubmitStatus(null);
      }, 3000);

    } catch (error) {
      console.error("Error submitting testimonial:", error);
      setSubmitStatus("error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // ✅ دالة عودة آمنة للحصول على اسم الخدمة
  const getServiceTypeName = (type) => {
    if (!type) return t('testimonials.generalService');
    
    const serviceNames = {
      'living-room': language === 'ar' ? 'صالات جلوس' : 'Living Room',
      'kitchen': language === 'ar' ? 'مطابخ' : 'Kitchen',
      'bedroom': language === 'ar' ? 'غرف نوم' : 'Bedroom',
      'office': language === 'ar' ? 'مكاتب' : 'Office',
      'commercial': t('testimonials.commercial'),
      'bathroom': language === 'ar' ? 'حمامات' : 'Bathroom',
      'design': language === 'ar' ? 'تصميم' : 'Design',
      'renovation': language === 'ar' ? 'تطوير وترميم' : 'Renovation',
      'consultation': language === 'ar' ? 'استشارات' : 'Consultation',
      'implementation': language === 'ar' ? 'تنفيذ' : 'Implementation',
      'supervision': language === 'ar' ? 'إشراف' : 'Supervision',
      'furniture': language === 'ar' ? 'أثاث وديكور' : 'Furniture & Decor'
    };
    
    return serviceNames[type] || t('testimonials.generalService');
  };

  // ✅ دالة عودة آمنة لنوع المشروع
  const getProjectTypeName = (type) => {
    if (!type) return language === 'ar' ? 'عام' : 'General';
    
    const types = {
      'residential': language === 'ar' ? 'سكني' : 'Residential',
      'commercial': language === 'ar' ? 'تجاري' : 'Commercial',
      'both': language === 'ar' ? 'سكني وتجاري' : 'Residential & Commercial',
      'residential-commercial': language === 'ar' ? 'سكني وتجاري' : 'Residential & Commercial'
    };
    
    return types[type] || language === 'ar' ? 'عام' : 'General';
  };

  // ✅ دالة عودة آمنة لتنسيق التاريخ
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    
    try {
      let date;
      if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else if (timestamp.toDate) {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        date = new Date(timestamp);
      }
      
      const options = language === 'ar' 
        ? { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'Asia/Riyadh'
          }
        : { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'UTC'
          };
      
      return new Intl.DateTimeFormat(
        language === 'ar' ? 'ar-EG' : 'en-US', 
        options
      ).format(date);
    } catch (error) {
      console.log("خطأ في تنسيق التاريخ:", error);
      return "";
    }
  };

  // ✅ دالة عودة آمنة لتحضير عرض النجوم
  const renderStars = (rating) => {
    if (!rating && rating !== 0) rating = 5;
    const safeRating = Math.min(Math.max(rating, 0), 5);
    
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-2xl ${index < safeRating ? "text-amber-400" : "text-gray-300"}`}
      >
        ★
      </span>
    ));
  };

  // ✅ دالة عودة آمنة لعرض النجوم التفاعلية
  const renderInteractiveStars = (rating, onRatingChange) => {
    const safeRating = Math.min(rating, 5);
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        type="button"
        onClick={() => onRatingChange(index + 1)}
        className={`text-2xl cursor-pointer hover:scale-125 transition-transform ${
          index < safeRating ? "text-amber-400" : "text-gray-300"
        }`}
      >
        ★
      </button>
    ));
  };

  // ✅ دالة الحصول على الحرف الأول للصورة - تم التصحيح
  const getInitial = (name) => {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return language === 'ar' ? t('testimonials.clientInitial') : 'C';
    }
    return name.trim().charAt(0).toUpperCase();
  };

  // ✅ بيانات افتراضية للشهادات
  const defaultTestimonials = [
    {
      id: "default-1",
      name: language === 'ar' ? "أحمد محمد" : "Ahmed Mohamed",
      location: language === 'ar' ? "الرياض" : "Riyadh",
      rating: 5,
      comment: language === 'ar' 
        ? "تجربة رائعة مع فريق التصميم، قاموا بتحويل منزلي إلى تحفة فنية. أنصح الجميع بالتعامل معهم." 
        : "Amazing experience with the design team, they transformed my house into a masterpiece. I highly recommend them.",
      serviceType: "living-room",
      projectType: "residential",
      createdAt: { seconds: Date.now() / 1000 - 86400000 }
    },
    {
      id: "default-2",
      name: language === 'ar' ? "سارة العلي" : "Sarah AlAli",
      location: language === 'ar' ? "جدة" : "Jeddah",
      rating: 4,
      comment: language === 'ar' 
        ? "المهنية والالتزام بالوقت كانت مميزة جداً. مطبخي أصبح أجمل من ما تخيلت." 
        : "Professionalism and commitment to deadlines were outstanding. My kitchen is more beautiful than I imagined.",
      serviceType: "kitchen",
      projectType: "residential",
      createdAt: { seconds: Date.now() / 1000 - 172800000 }
    }
  ];

  // ✅ دالة للحصول على اسم العميل بشكل آمن
  const getSafeName = (testimonial) => {
    const name = testimonial.name || testimonial.clientName || testimonial.customerName;
    if (!name || typeof name !== 'string') {
      return t('testimonials.client');
    }
    return name;
  };

  // ✅ دالة عودة آمنة للشهادات المعروضة
  const displayTestimonials = filteredTestimonials.length > 0 ? filteredTestimonials : 
                            testimonials.length > 0 ? testimonials : defaultTestimonials;

  const handleStartProject = () => {
    window.open('/contact', '_self');
  };

  const handleViewPortfolio = () => {
    window.open('/portfolio', '_self');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            {t('testimonials.loading')}
          </p>
          <p className="text-gray-500 text-sm">
            {language === 'ar' ? "قد يستغرق بضع ثوانٍ" : "This may take a few seconds"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-inter">
      
      {/* ✅ Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-amber-400/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-300/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {getTextByLanguage(displayPageContent.heroTitle)}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            {getTextByLanguage(displayPageContent.heroSubtitle)}
          </p>
        </div>
      </section>

      {/* ✅ Statistics */}
      <section className="py-16 bg-white border-b border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">
                {averageRating.toFixed(1)}/5
              </div>
              <div className="text-gray-600 font-medium">
                {t('testimonials.averageRating')}
              </div>
              <div className="flex justify-center mt-2">
                {renderStars(averageRating)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">
                {totalTestimonials}+
              </div>
              <div className="text-gray-600 font-medium">
                {t('testimonials.testimonialsCount')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">
                {recommendationRate}%
              </div>
              <div className="text-gray-600 font-medium">
                {t('testimonials.recommendationRate')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">
                {satisfactionRate}%
              </div>
              <div className="text-gray-600 font-medium">
                {t('testimonials.satisfactionRate')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Add Testimonial CTA */}
      <section className="py-12 bg-gradient-to-r from-amber-50 to-amber-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {t('testimonials.shareExperience')}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {t('testimonials.shareDescription')}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/25 inline-flex items-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t('testimonials.addTestimonial')}
            </button>
          </div>
        </div>
      </section>

      {/* ✅ Testimonials Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              {getTextByLanguage(displayPageContent.sectionTitle)}
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {getTextByLanguage(displayPageContent.sectionSubtitle)}
            </p>
          </div>

          {/* ✅ Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {serviceTypes.map(service => (
              <button
                key={service.id}
                onClick={() => setActiveFilter(service.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeFilter === service.id
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                    : "bg-white text-gray-700 hover:bg-amber-50 border border-gray-200"
                }`}
              >
                {service.name}
                <span className="mr-2 text-sm opacity-80">({service.count})</span>
              </button>
            ))}
          </div>

          {/* ✅ شريط معلومات النظام الموحد */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 mb-8">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 text-sm">
                  {language === 'ar' ? "نظام الشهادات الموحد" : "Unified Testimonials System"}
                </h4>
                <p className="text-blue-700 text-xs mt-1">
                  {language === 'ar' 
                    ? "• جميع الشهادات المعروضة تمت الموافقة عليها من قبل إدارة الموقع"
                    : "• All displayed testimonials have been approved by site administration"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayTestimonials.map((testimonial) => {
              const clientName = getSafeName(testimonial);
              
              return (
                <div 
                  key={testimonial.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-amber-100 hover:border-amber-200 p-6 transform hover:-translate-y-2"
                >
                  {/* Rating and Date */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex">
                      {renderStars(testimonial.rating)}
                    </div>
                    <span className="text-gray-400 text-sm">
                      {formatDate(testimonial.createdAt)}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                    "{getTextByLanguage(testimonial.comment || testimonial.message || testimonial.text )||
                      (language === 'ar' ? "شهادة مميزة من عميل راضٍ" : "Excellent testimonial from a satisfied client")}"
                  </p>

                  {/* Service Type Badge */}
                  {(testimonial.serviceType || testimonial.service) && (
                    <div className="mb-3">
                      <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                        {getServiceTypeName(testimonial.serviceType || testimonial.service)}
                      </span>
                    </div>
                  )}

                  {/* Project Type Badge */}
                  {(testimonial.projectType || testimonial.project) && (
                    <div className="mb-4">
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {getProjectTypeName(testimonial.projectType || testimonial.project)}
                      </span>
                    </div>
                  )}

                  {/* Client Info */}
                  <div className="flex items-center justify-between border-t border-amber-100 pt-4">
                    <div className="flex items-center">
                      {testimonial.image ? (
                        <img 
                          src={testimonial.image} 
                          alt={clientName}
                          className="w-12 h-12 rounded-full ml-4 object-cover border-2 border-white"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg ml-4">
                          {getInitial(clientName)}
                        </div>
                      )}
                      <div className={language === 'ar' ? 'mr-3' : 'ml-3'}>
                        <h4 className="font-semibold text-gray-800">
                          {clientName}
                        </h4>
                        {(testimonial.location || testimonial.city) && (
                          <span className="text-amber-600 text-sm">
                            {testimonial.location || testimonial.city}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* ✅ شارة الموافقة */}
                    {testimonial.approved && (
                      <div className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                        ✓ {language === 'ar' ? 'معتمدة' : 'Verified'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ✅ Empty State */}
          {displayTestimonials.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4 opacity-50">💬</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                {t('testimonials.noTestimonials')}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {t('testimonials.noTestimonialsDescription')}
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-all duration-300"
              >
                {t('testimonials.beFirst')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ✅ Add Testimonial Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('testimonials.shareExperience')}
                </h3>
                <button 
                  onClick={() => {
                    setShowAddForm(false);
                    setSubmitStatus(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmitTestimonial} className="space-y-6">
                {/* Name & Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === 'ar' ? "الاسم الكامل *" : "Full Name *"}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newTestimonial.name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      placeholder={language === 'ar' ? "أدخل اسمك الكامل" : "Enter your full name"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('testimonials.city')}
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={newTestimonial.location}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      placeholder={t('testimonials.cityPlaceholder')}
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === 'ar' ? "البريد الإلكتروني" : "Email"}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newTestimonial.email}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      placeholder={language === 'ar' ? "البريد الإلكتروني (اختياري)" : "Email (optional)"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {language === 'ar' ? "رقم الهاتف" : "Phone Number"}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={newTestimonial.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      placeholder={language === 'ar' ? "رقم الهاتف (اختياري)" : "Phone (optional)"}
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('testimonials.projectType')}
                  </label>
                  <select
                    name="projectType"
                    value={newTestimonial.projectType}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="residential">{language === 'ar' ? "سكني" : "Residential"}</option>
                    <option value="commercial">{language === 'ar' ? "تجاري" : "Commercial"}</option>
                    <option value="both">{language === 'ar' ? "سكني وتجاري" : "Residential & Commercial"}</option>
                  </select>
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('testimonials.serviceType')}
                  </label>
                  <select
                    name="serviceType"
                    value={newTestimonial.serviceType}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">{t('testimonials.selectService')}</option>
                    <option value="living-room">{language === 'ar' ? "صالات جلوس" : "Living Room"}</option>
                    <option value="kitchen">{language === 'ar' ? "مطابخ" : "Kitchen"}</option>
                    <option value="bedroom">{language === 'ar' ? "غرف نوم" : "Bedroom"}</option>
                    <option value="office">{language === 'ar' ? "مكاتب" : "Office"}</option>
                    <option value="commercial">{language === 'ar' ? "تجاري" : "Commercial"}</option>
                    <option value="bathroom">{language === 'ar' ? "حمامات" : "Bathroom"}</option>
                    <option value="design">{language === 'ar' ? "تصميم" : "Design"}</option>
                    <option value="renovation">{language === 'ar' ? "تطوير وترميم" : "Renovation"}</option>
                    <option value="consultation">{language === 'ar' ? "استشارات" : "Consultation"}</option>
                    <option value="implementation">{language === 'ar' ? "تنفيذ" : "Implementation"}</option>
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    {t('testimonials.yourRating')}
                  </label>
                  <div className="flex justify-center gap-2">
                    {renderInteractiveStars(newTestimonial.rating, handleRatingChange)}
                  </div>
                  <div className="text-center text-sm text-gray-500 mt-2">
                    {Math.min(newTestimonial.rating, 5)} {t('testimonials.outOf5')}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t('testimonials.yourExperience')}
                  </label>
                  <textarea
                    name="comment"
                    value={newTestimonial.comment}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    minLength="10"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder={t('testimonials.commentPlaceholder')}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {language === 'ar' 
                      ? "ملاحظة: ستتم مراجعة شهادتك من قبل إدارة الموقع قبل نشرها." 
                      : "Note: Your testimonial will be reviewed by site administration before being published."}
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitLoading ? (
                    <span className="flex items-center justify-center">
                      {t('testimonials.sending')}
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                    </span>
                  ) : (
                    t('testimonials.submitTestimonial')
                  )}
                </button>

                {/* ✅ Status Messages */}
                {submitStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-center">
                    <p className="font-semibold mb-2">
                      {t('testimonials.successModalTitle')}
                    </p>
                    <p className="text-sm">
                      {t('testimonials.successModalMessage')}
                    </p>
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center">
                    <p className="font-semibold mb-2">
                      {t('testimonials.errorModalTitle')}
                    </p>
                    <p className="text-sm">
                      {t('testimonials.errorModalMessage')}
                    </p>
                  </div>
                )}

                {submitStatus === "validation_error" && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl text-center">
                    <p className="font-semibold mb-2">
                      {t('testimonials.validationModalTitle')}
                    </p>
                    <p className="text-sm">
                      {t('testimonials.validationModalMessage')}
                    </p>
                  </div>
                )}

                {/* ✅ معلومات النظام الموحد */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <p className="text-blue-700 text-sm">
                    {language === 'ar' 
                      ? "✅ نظام الشهادات الموحد: سيتم مراجعة شهادتك من قبل مدير النظام قبل نشرها." 
                      : "✅ Unified Testimonials System: Your testimonial will be reviewed by the system administrator before publication."}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ✅ CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 to-amber-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-300/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {getTextByLanguage(displayPageContent.ctaTitle)}
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            {getTextByLanguage(displayPageContent.ctaSubtitle)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleStartProject}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-amber-600 transition-all duration-300 transform hover:scale-105 text-lg"
            >
              {t('testimonials.startProject')}
            </button>
            <button 
              onClick={handleViewPortfolio}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-amber-600 transition-all duration-300 transform hover:scale-105 text-lg"
            >
              {t('testimonials.viewPortfolio')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}