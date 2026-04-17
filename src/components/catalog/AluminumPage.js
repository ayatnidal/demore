// AluminumPage.js
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function AluminumPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState("windows");
  const [showUpArrow, setShowUpArrow] = useState(false);

  // مراقبة التمرير لعكس اتجاه السهم
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      if (scrollPosition + windowHeight >= documentHeight - 100) {
        setShowUpArrow(true);
      } else {
        setShowUpArrow(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Translations
  const t = {
    pageTitle: {
      ar: "الألمنيوم",
      en: "Aluminum"
    },
    backToCatalog: {
      ar: "العودة إلى الكتالوج",
      en: "Back to Catalog"
    },
    scroll: {
      ar: "تمرير",
      en: "SCROLL"
    },
    backToTop: {
      ar: "العودة للأعلى",
      en: "BACK TO TOP"
    },
    heroDescription: {
      ar: "أنظمة ألمنيوم عالية الجودة للمنازل والمباني التجارية بأحدث التقنيات وأجود الخامات",
      en: "High-quality aluminum systems for homes and commercial buildings with the latest technologies and finest materials"
    },
    tabs: {
      windows: { ar: "شبابيك وأبواب", en: "Windows & Doors" },
      shutters: { ar: "أباجورات", en: "Shutters" },
      colors: { ar: "الألوان", en: "Colors" }
    },
    specifications: {
      ar: "المواصفات",
      en: "Specifications"
    },
    features: {
      ar: "المميزات",
      en: "Features"
    },
    usage: {
      ar: "الاستخدام",
      en: "Usage"
    },
    systems: {
      ar: "الأنظمة",
      en: "Systems"
    },
    colorApplications: {
      ar: "تطبيقات الألوان",
      en: "Color Applications"
    },
    hex: {
      ar: "رمز اللون",
      en: "HEX"
    },
    footer: {
      ar: "جودة عالية - تصاميم عصرية",
      en: "High Quality - Modern Designs"
    },
    copyright: {
      ar: "© 2024 أنظمة الألمنيوم",
      en: "© 2024 Aluminum Systems"
    }
  };

  const aluminumTypes = [
    { 
      id: 7200, 
      name: { ar: "نظام 7200", en: "System 7200" },
      badge: { ar: "اقتصادي", en: "Economic" },
      image: "/images/aluminum-7200.jpg",
      description: { 
        ar: "نظام سحاب عملي للمنازل والشقق.", 
        en: "Practical sliding system for homes and apartments." 
      },
      specs: [
        { ar: "سماكة بروفيل: 1.2 – 1.6 مم", en: "Profile thickness: 1.2 – 1.6 mm" },
        { ar: "نظام سحب مزدوج أو ثلاثي", en: "Double or triple sliding system" },
        { ar: "زجاج مفرد أو مزدوج", en: "Single or double glass" },
        { ar: "إمكانية إضافة شبك حماية", en: "Possibility to add protection mesh" }
      ],
      usage: [
        { ar: "شبابيك غرف نوم", en: "Bedroom windows" },
        { ar: "بلكونات", en: "Balconies" },
        { ar: "مطابخ", en: "Kitchens" }
      ],
      features: [
        { ar: "سعر اقتصادي", en: "Economic price" },
        { ar: "سهل الصيانة", en: "Easy maintenance" },
        { ar: "مقاومة جيدة للعوامل الجوية", en: "Good weather resistance" },
        { ar: "انزلاق سلس", en: "Smooth sliding" }
      ]
    },
    { 
      id: 9000, 
      name: { ar: "نظام 9000", en: "System 9000" },
      badge: { ar: "دبل جلاس", en: "Double Glass" },
      image: "/images/aluminum-9000.jpg",
      description: { 
        ar: "نظام سحاب ثقيل للمساحات الكبيرة.", 
        en: "Heavy sliding system for large spaces." 
      },
      specs: [
        { ar: "سماكة بروفيل: 1.6 – 2.0 مم", en: "Profile thickness: 1.6 – 2.0 mm" },
        { ar: "يتحمل زجاج دبل جلاس", en: "Supports double glass" },
        { ar: "عزل صوتي وحراري أفضل", en: "Better sound and thermal insulation" },
        { ar: "إمكانية إضافة نظام Thermal Break", en: "Thermal break option available" }
      ],
      usage: [
        { ar: "واجهات كبيرة", en: "Large facades" },
        { ar: "فلل", en: "Villas" },
        { ar: "مكاتب تجارية", en: "Commercial offices" }
      ],
      features: [
        { ar: "عزل ممتاز", en: "Excellent insulation" },
        { ar: "قوة تحمل عالية", en: "High durability" },
        { ar: "مناسب للفتحات الواسعة", en: "Suitable for wide openings" },
        { ar: "مستوى أمان أعلى", en: "Higher security level" }
      ]
    },
    { 
      id: 4500, 
      name: { ar: "نظام 4500", en: "System 4500" },
      badge: { ar: "مفصلي", en: "Hinged" },
      image: "/images/aluminum-4500.jpg",
      description: { 
        ar: "نظام فتح مفصلي (داخلي أو خارجي).", 
        en: "Hinged opening system (inward or outward)." 
      },
      specs: [
        { ar: "سماكة بروفيل: 1.2 – 1.6 مم", en: "Profile thickness: 1.2 – 1.6 mm" },
        { ar: "إغلاق محكم", en: "Tight closing" },
        { ar: "يدعم دبل جلاس", en: "Supports double glass" }
      ],
      usage: [
        { ar: "شبابيك غرف", en: "Room windows" },
        { ar: "حمامات", en: "Bathrooms" },
        { ar: "مطابخ", en: "Kitchens" }
      ],
      features: [
        { ar: "عزل هواء ممتاز", en: "Excellent air insulation" },
        { ar: "أمان أعلى من السحاب", en: "Higher security than sliding" },
        { ar: "تهوية أفضل", en: "Better ventilation" }
      ]
    },
    { 
      id: "curtain", 
      name: { ar: "كيرتن وول", en: "Curtain Wall" },
      badge: { ar: "واجهات زجاجية", en: "Glass Facade" },
      image: "/images/curtain-wall.jpg",
      description: { 
        ar: "نظام واجهات زجاجية هيكلية للمباني التجارية.", 
        en: "Structural glass facade system for commercial buildings." 
      },
      specs: [
        { ar: "بروفيلات ألمنيوم ثقيلة", en: "Heavy aluminum profiles" },
        { ar: "زجاج سيكوريت أو دبل جلاس", en: "Tempered or double glass" },
        { ar: "مقاومة رياح عالية", en: "High wind resistance" },
        { ar: "نظام تصريف مياه متكامل", en: "Integrated water drainage system" }
      ],
      usage: [
        { ar: "مولات", en: "Malls" },
        { ar: "أبراج", en: "Towers" },
        { ar: "مكاتب", en: "Offices" },
        { ar: "معارض", en: "Showrooms" }
      ],
      features: [
        { ar: "مظهر عصري فاخر", en: "Luxurious modern look" },
        { ar: "إدخال إضاءة طبيعية", en: "Natural light integration" },
        { ar: "عزل حراري وصوتي عالي", en: "High thermal and sound insulation" },
        { ar: "مقاومة للعوامل الجوية", en: "Weather resistant" }
      ]
    }
  ];

  const shutterTypes = [
    {
      id: "rolling",
      name: { ar: "أباجور رول", en: "Rolling Shutter" },
      badge: { ar: "رول", en: "Rolling" },
      image: "/images/rolling-shutter.jpg",
      description: { 
        ar: "نظام شرائح ألمنيوم تنزل للأعلى والأسفل داخل صندوق علوي.", 
        en: "Aluminum slats system that rolls up and down into a top box." 
      },
      types: [
        { ar: "يدوي", en: "Manual" },
        { ar: "كهربائي", en: "Electric" },
        { ar: "ذكي", en: "Smart" }
      ],
      features: [
        { ar: "حماية عالية ضد السرقة", en: "High theft protection" },
        { ar: "عزل حراري وصوتي", en: "Thermal and sound insulation" },
        { ar: "مقاومة للأمطار والغبار", en: "Rain and dust resistant" },
        { ar: "يوفر خصوصية كاملة", en: "Complete privacy" }
      ],
      usage: [
        { ar: "شقق سكنية", en: "Residential apartments" },
        { ar: "محلات تجارية", en: "Commercial shops" },
        { ar: "فلل", en: "Villas" }
      ]
    },
    {
      id: "swing",
      name: { ar: "أباجور مفصلي", en: "Swing Shutter" },
      badge: { ar: "مفصلي", en: "Swing" },
      image: "/images/swing-shutter.jpg",
      description: { 
        ar: "ألواح ألمنيوم تُفتح مثل الباب.", 
        en: "Aluminum panels that open like doors." 
      },
      features: [
        { ar: "طابع كلاسيكي جميل", en: "Beautiful classic style" },
        { ar: "تحكم بالضوء والتهوية", en: "Light and ventilation control" },
        { ar: "مناسب للواجهات", en: "Suitable for facades" }
      ],
      usage: [
        { ar: "فلل", en: "Villas" },
        { ar: "بيوت مستقلة", en: "Independent houses" },
        { ar: "مشاريع طابع أوروبي", en: "European style projects" }
      ]
    },
    {
      id: "sliding",
      name: { ar: "أباجور سحاب", en: "Sliding Shutter" },
      badge: { ar: "سحاب", en: "Sliding" },
      image: "/images/sliding-shutter.jpg",
      description: { 
        ar: "نظام ألواح تتحرك جانبياً على مسار.", 
        en: "Panel system that slides sideways on tracks." 
      },
      features: [
        { ar: "تصميم عصري", en: "Modern design" },
        { ar: "مثالي للواجهات الكبيرة", en: "Ideal for large facades" },
        { ar: "تحكم جزئي بالضوء", en: "Partial light control" }
      ],
      usage: [
        { ar: "واجهات زجاجية", en: "Glass facades" },
        { ar: "فلل حديثة", en: "Modern villas" },
        { ar: "مكاتب", en: "Offices" }
      ]
    },
    {
      id: "security",
      name: { ar: "أباجور أمني", en: "Security Shutter" },
      badge: { ar: "أمني", en: "Security" },
      image: "/images/security-shutter.jpg",
      description: { 
        ar: "نظام ثقيل مخصص للحماية القصوى.", 
        en: "Heavy-duty system for maximum protection." 
      },
      specs: [
        { ar: "شرائح مقواة", en: "Reinforced slats" },
        { ar: "نظام قفل متعدد النقاط", en: "Multi-point locking system" },
        { ar: "مقاوم للكسر", en: "Break resistant" }
      ],
      features: [
        { ar: "مقاومة عالية للكسر", en: "High break resistance" },
        { ar: "مناسب للمحال التجارية", en: "Suitable for shops" },
        { ar: "متوفر بشرائح مثقبة", en: "Available with perforated slats" }
      ],
      usage: [
        { ar: "محلات", en: "Shops" },
        { ar: "مولات", en: "Malls" },
        { ar: "مخازن", en: "Warehouses" }
      ]
    }
  ];

  // ألوان الألمنيوم
  const aluminumColors = [
    { 
      id: "white", 
      name: { ar: "أبيض", en: "White" }, 
      code: "#ffffff", 
      image: "/images/white.jpg",
      description: { ar: "لون نقي وعصري", en: "Pure and modern" }
    },
    { 
      id: "black", 
      name: { ar: "أسود", en: "Black" }, 
      code: "#000000", 
      image: "/images/black.jpg",
      description: { ar: "أنيق وجريء", en: "Elegant and bold" }
    },
    { 
      id: "gray", 
      name: { ar: "رمادي", en: "Gray" }, 
      code: "#808080", 
      image: "/images/gray.jpg",
      description: { ar: "كلاسيكي ومحايد", en: "Classic and neutral" }
    },
    { 
      id: "champagne", 
      name: { ar: "شمبانيا", en: "Champagne" }, 
      code: "#F7E7CE", 
      image: "/images/champagne.jpg",
      description: { ar: "فاخر ودافئ", en: "Luxurious and warm" }
    },
    { 
      id: "sapphire", 
      name: { ar: "أزرق ياقوتي", en: "Sapphire Blue" }, 
      code: "#0F52BA", 
      image: "/images/sapphire.jpg",
      description: { ar: "عميق وملكي", en: "Deep and royal" }
    }
  ];

  // Function to get image path with fallback
  const getImagePath = (imageName) => {
    return imageName || "/images/aluminum-default.jpg";
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#fcf9f7] px-8 md:px-20 py-16 relative"
      dir="RTL"
    >
      {/* زر العودة */}
      <Link to="/catalog-moodboard">
        <motion.div 
          className="text-gray-800 text-xl mb-8 block absolute top-18 right-20 z-50 cursor-pointer group"
          whileHover={{ x: language === 'ar' ? 10 : -10 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md group-hover:shadow-xl transition-all duration-300">
            → {language === 'ar' ? ' العودة ' : ' Back'}
          </span>
        </motion.div>
      </Link>

      {/* سهم التمرير */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
        }}
        transition={{ delay: 1, repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
      >
        <span className="text-sm tracking-widest text-[#4a3f36] mb-2 bg-white/80 backdrop-blur-sm px-4 py-1 rounded-full shadow-md">
          {showUpArrow ? t.backToTop[language] : t.scroll[language]}
        </span>
        <div className="text-2xl text-[#4a3f36]">
          {showUpArrow ? "↑" : "↓"}
        </div>
      </motion.div>

      {/* Hero Section مع حركة الدخول */}
      <div className="flex flex-col md:flex-row items-start gap-12 mt-16">
        {/* Image Section مع حركة الدخول */}
        <motion.div 
          layoutId="aluminum-container" 
          className="relative"
          initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* الزخارف الجانبية */}
          <div className={`absolute -top-4 ${language === 'ar' ? '-right-4 border-r-2' : '-left-4 border-l-2'} w-24 h-24 border-t-2 border-gray-300`} />
          <div className={`absolute -bottom-4 ${language === 'ar' ? '-left-4 border-l-2' : '-right-4 border-r-2'} w-24 h-24 border-b-2 border-gray-300`} />
          
          <motion.img
            layoutId="aluminum-hero"
            src="/images/aluminum-hero.jpg"
            className="w-full md:w-96 h-auto rounded-2xl shadow-2xl"
            alt="Aluminum Systems"
            onError={(e) => {
              e.target.src = "/images/aluminum-default.jpg";
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute -bottom-4 -right-4 bg-[#4a3f36] text-white px-6 py-2 rounded-full text-sm tracking-widest shadow-xl">
            {t.pageTitle[language]}
          </div>
        </motion.div>

        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-lg"
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#4a3f36] tracking-wider mb-4">
            {t.pageTitle[language]}
          </h2>
          
          <div className="space-y-6 mb-8">
            <p className="text-[#6b5b4e] text-lg leading-relaxed font-light">
              {t.heroDescription[language]}
            </p>
            
            {/* قسم أنظمة الألمنيوم */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/80">
              <h3 className="text-sm tracking-widest text-[#4a3f36] font-medium mb-4 border-b border-[#d6ccc2] pb-2">
                {language === 'ar' ? 'أنظمة الألمنيوم' : 'Aluminum Systems'}
              </h3>
              
              <div className="space-y-4">
                {/* شبابيك وأبواب */}
                <div className="flex items-start gap-3 group hover:bg-[#fcf9f7] p-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 bg-[#4a3f36]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#4a3f36]/20 transition-colors">
                    <span className="text-[#4a3f36] text-sm font-medium">W</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4a3f36]">
                      {language === 'ar' ? 'شبابيك وأبواب' : 'Windows & Doors'}
                    </h4>
                    <p className="text-xs text-[#6b5b4e] leading-relaxed mt-0.5">
                      {language === 'ar' 
                        ? 'أنظمة سحاب ومفصلية بمواصفات عالية الجودة.' 
                        : 'Sliding and hinged systems with high quality specifications.'}
                    </p>
                  </div>
                </div>
                
                {/* أباجورات */}
                <div className="flex items-start gap-3 group hover:bg-[#fcf9f7] p-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 bg-[#4a3f36]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#4a3f36]/20 transition-colors">
                    <span className="text-[#4a3f36] text-sm font-medium">S</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4a3f36]">
                      {language === 'ar' ? 'أباجورات' : 'Shutters'}
                    </h4>
                    <p className="text-xs text-[#6b5b4e] leading-relaxed mt-0.5">
                      {language === 'ar' 
                        ? 'أنظمة حماية متكاملة بمختلف أنواعها.' 
                        : 'Integrated protection systems in various types.'}
                    </p>
                  </div>
                </div>
                
                {/* ألوان الألمنيوم */}
                <div className="flex items-start gap-3 group hover:bg-[#fcf9f7] p-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 bg-[#4a3f36]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#4a3f36]/20 transition-colors">
                    <span className="text-[#4a3f36] text-sm font-medium">C</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4a3f36]">
                      {language === 'ar' ? 'الألوان' : 'Colors'}
                    </h4>
                    <p className="text-xs text-[#6b5b4e] leading-relaxed mt-0.5">
                      {language === 'ar' 
                        ? 'مجموعة واسعة من الألوان والتشطيبات.' 
                        : 'Wide range of colors and finishes.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Tabs */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex justify-center gap-6 mb-16 mt-24"
      >
        {[
          { id: "windows", name: t.tabs.windows[language] },
          { id: "shutters", name: t.tabs.shutters[language] },
          { id: "colors", name: t.tabs.colors[language] }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`relative px-8 py-3 text-sm tracking-wider transition-all duration-300 ${
              activeTab === tab.id
                ? "text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.name}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-px bg-gray-900"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Windows & Doors Section */}
      {activeTab === "windows" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          {aluminumTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              className="group"
            >
              <div className="bg-white/70 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 border border-white/80">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  {/* Image Section */}
                  <div className="lg:col-span-1 relative h-[300px] lg:h-auto overflow-hidden">
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-[#4a3f36] text-white px-4 py-2 rounded-full text-xs tracking-wider shadow-lg">
                        {type.badge[language]}
                      </span>
                    </div>
                    <motion.img
                      src={getImagePath(type.image)}
                      alt={type.name[language]}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 1.2 }}
                      onError={(e) => {
                        e.target.src = "/images/aluminum-default.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  {/* Content Section */}
                  <div className="lg:col-span-2 p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
                      <h2 className="text-2xl font-light tracking-wide text-[#4a3f36]">
                        {type.name[language]}
                      </h2>
                    </div>

                    <p className="text-[#6b5b4e] text-sm mb-8 font-light text-right">
                      {type.description[language]}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Specifications */}
                      <div>
                        <h3 className="text-xs tracking-wider text-[#4a3f36] mb-4 text-right">
                          {t.specifications[language]}
                        </h3>
                        <ul className="space-y-2">
                          {type.specs.map((spec, i) => (
                            <li key={i} className="text-sm text-[#6b5b4e] flex items-start gap-2 flex-row-reverse">
                              <span className="text-gray-400 text-xs mt-1">—</span>
                              <span className="font-light">{spec[language]}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Features */}
                      <div>
                        <h3 className="text-xs tracking-wider text-[#4a3f36] mb-4 text-right">
                          {t.features[language]}
                        </h3>
                        <ul className="space-y-2">
                          {type.features.map((feature, i) => (
                            <li key={i} className="text-sm text-[#6b5b4e] flex items-start gap-2 flex-row-reverse">
                              <span className="text-gray-400 text-xs mt-1">—</span>
                              <span className="font-light">{feature[language]}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Usage */}
                      <div>
                        <h3 className="text-xs tracking-wider text-[#4a3f36] mb-4 text-right">
                          {t.usage[language]}
                        </h3>
                        <div className="flex flex-wrap gap-2 justify-end">
                          {type.usage.map((item, i) => (
                            <span key={i} className="text-xs bg-[#f0ebe7] text-[#6b5b4e] px-3 py-1.5 rounded-full font-light">
                              {item[language]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Shutters Section */}
      {activeTab === "shutters" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {shutterTypes.map((shutter, index) => (
            <motion.div
              key={shutter.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              className="group"
            >
              <div className="bg-white/70 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 h-full border border-white/80">
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute top-4 right-4 z-10">
                    <span className="bg-[#4a3f36] text-white px-4 py-2 rounded-full text-xs tracking-wider shadow-lg">
                      {shutter.badge[language]}
                    </span>
                  </div>
                  <motion.img
                    src={getImagePath(shutter.image)}
                    alt={shutter.name[language]}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 1.2 }}
                    onError={(e) => {
                      e.target.src = "/images/aluminum-default.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
                    <h2 className="text-xl font-light tracking-wide text-[#4a3f36]">
                      {shutter.name[language]}
                    </h2>
                  </div>

                  <p className="text-[#6b5b4e] text-sm mb-6 font-light text-right">
                    {shutter.description[language]}
                  </p>

                  {/* Types for Rolling Shutter */}
                  {shutter.id === "rolling" && (
                    <div className="mb-6">
                      <h3 className="text-xs tracking-wider text-[#4a3f36] mb-3 text-right">
                        {t.systems[language]}
                      </h3>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {shutter.types.map((type, i) => (
                          <span key={i} className="text-xs bg-[#f0ebe7] text-[#6b5b4e] px-3 py-1.5 rounded-full font-light">
                            {type[language]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  <div className="mb-6">
                    <h3 className="text-xs tracking-wider text-[#4a3f36] mb-3 text-right">
                      {t.features[language]}
                    </h3>
                    <ul className="space-y-2">
                      {shutter.features.map((feature, i) => (
                        <li key={i} className="text-sm text-[#6b5b4e] flex items-start gap-2 flex-row-reverse">
                          <span className="text-gray-400 text-xs mt-1">—</span>
                          <span className="font-light">{feature[language]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Specs for Security Shutter */}
                  {shutter.specs && (
                    <div className="mb-6">
                      <h3 className="text-xs tracking-wider text-[#4a3f36] mb-3 text-right">
                        {t.specifications[language]}
                      </h3>
                      <ul className="space-y-2">
                        {shutter.specs.map((spec, i) => (
                          <li key={i} className="text-sm text-[#6b5b4e] flex items-start gap-2 flex-row-reverse">
                            <span className="text-gray-400 text-xs mt-1">—</span>
                            <span className="font-light">{spec[language]}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Usage */}
                  <div>
                    <h3 className="text-xs tracking-wider text-[#4a3f36] mb-3 text-right">
                      {t.usage[language]}
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {shutter.usage.map((item, i) => (
                        <span key={i} className="text-xs bg-[#f0ebe7] text-[#6b5b4e] px-3 py-1.5 rounded-full font-light">
                          {item[language]}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Colors Section */}
      {activeTab === "colors" && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-6 mb-12 ">
            <h2 className="text-3xl font-light tracking-[0.15em] text-[#4a3f36]">
              {t.tabs.colors[language]}
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aluminumColors.map((color) => (
              <motion.div
                key={color.id}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
                className="group cursor-pointer"
              >
                <div className="bg-white/70 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/80">
                  {/* Color Image */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={getImagePath(color.image)}
                      alt={color.name[language]}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.8 }}
                      onError={(e) => {
                        e.target.src = "/images/aluminum-default.jpg";
                      }}
                    />
                    {/* Color Overlay */}
                    <div 
                      className="absolute inset-0 mix-blend-multiply opacity-50"
                      style={{ backgroundColor: color.code }}
                    />
                    
                    {/* Color Badge */}
                    <div className="absolute bottom-4 right-4">
                      <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-6 h-6 rounded-full border border-gray-200"
                            style={{ backgroundColor: color.code }}
                          />
                          <span className="text-sm font-light text-[#4a3f36]">
                            {color.name[language]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Color Details */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4 flex-row">
                      <div className="w-12 h-px bg-gray-300" />
                      <span className="text-xs text-[#6b5b4e] tracking-wider">
                        {color.name[language === 'ar' ? 'en' : 'ar']}
                      </span>
                    </div>
                    
                    <p className="text-[#6b5b4e] text-sm font-light text-right">
                      {color.description[language]}
                    </p>

                    {/* Color Code */}
                    <div className="mt-4 pt-4 border-t border-[#d6ccc2]">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs font-mono bg-[#f0ebe7] px-2 py-1 rounded text-[#4a3f36]">
                          {color.code}
                        </span>
                        <span className="text-xs text-[#6b5b4e]">{t.hex[language]}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Color Application Examples */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-white/80"
          >
            <h3 className="text-xl font-light mb-6 text-right text-[#4a3f36]">
              {t.colorApplications[language]}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {aluminumColors.map((color) => (
                <div key={color.id} className="text-center">
                  <div 
                    className="h-16 rounded-2xl mb-2 shadow-lg"
                    style={{ backgroundColor: color.code }}
                  />
                  <span className="text-xs text-[#6b5b4e]">{color.name[language]}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Footer Decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="border-t border-[#d6ccc2] mt-20"
      >
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-between items-center text-xs text-[#6b5b4e] font-light tracking-wider flex-row-reverse">
            <span>{t.copyright[language]}</span>
            <span className="flex items-center gap-2">
              <span className="w-8 h-px bg-[#d6ccc2]" />
              {t.footer[language]}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}