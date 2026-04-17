import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function GypsumPage() {
  const { language } = useLanguage();
  const [selectedType, setSelectedType] = useState("white");
  const [selectedCategory, setSelectedCategory] = useState("all");
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
      ar: "الجبس بورد",
      en: "Gypsum Board"
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
    quickFacts: {
      ar: "معلومات سريعة عن الجبس بورد",
      en: "Quick Facts about Gypsum Board"
    },
    types: {
      ar: "أنواع الجبس بورد",
      en: "Gypsum Board Types"
    },
    applications: {
      ar: "الاستخدامات",
      en: "Applications"
    },
    advantages: {
      ar: "المميزات",
      en: "Advantages"
    },
    viewDetails: {
      ar: "عرض التفاصيل",
      en: "View Details"
    },
    thickness: {
      ar: "السمك",
      en: "Thickness"
    },
    width: {
      ar: "العرض",
      en: "Width"
    },
    length: {
      ar: "الطول",
      en: "Length"
    },
    fireResistance: {
      ar: "مقاومة الحريق",
      en: "Fire Resistance"
    },
    categories: {
      all: { ar: "الكل", en: "All" },
      residential: { ar: "سكني", en: "Residential" },
      commercial: { ar: "تجاري", en: "Commercial" },
      industrial: { ar: "صناعي", en: "Industrial" }
    }
  };

  // بيانات أنواع الجبس
  const gypsumTypes = [
    {
      id: "white",
      name: { ar: "الجبس الأبيض", en: "White Gypsum" },
      subtitle: { ar: "العادي", en: "Regular" },
      color: "white",
      image: "/images/gypsum-white.jpg",
      category: "residential",
      applications: {
        ar: ["الأسقف المستعارة", "الجدران الداخلية", "التصاميم الديكورية"],
        en: ["Suspended ceilings", "Interior walls", "Decorative designs"]
      },
      advantages: {
        ar: ["أقل سعراً", "سهولة التركيب", "خفة الوزن"],
        en: ["Most affordable", "Easy installation", "Light weight"]
      },
      specs: {
        thickness: { ar: "9.5 - 12.5 مم", en: "9.5 - 12.5 mm" },
        width: { ar: "1200 مم", en: "1200 mm" },
        length: { ar: "2400 - 3000 مم", en: "2400 - 3000 mm" },
        fireResistance: { ar: "متوسطة", en: "Medium" }
      },
      bgGradient: "from-gray-50 to-gray-100",
      borderColor: "border-gray-200",
      accentColor: "text-gray-600",
      badgeColor: "bg-gray-500"
    },
    {
      id: "green",
      name: { ar: "الجبس الأخضر", en: "Green Gypsum" },
      subtitle: { ar: "مقاوم للرطوبة", en: "Moisture Resistant" },
      color: "green",
      image: "/images/gypsum-green.jpg",
      category: "industrial",
      applications: {
        ar: ["الحمامات", "المطابخ", "الأقبية"],
        en: ["Bathrooms", "Kitchens", "Basements"]
      },
      advantages: {
        ar: ["مقاوم للرطوبة", "مضاد للعفن", "عمر أطول في الأماكن الرطبة"],
        en: ["Moisture resistant", "Anti-mold", "Longer lifespan in humid areas"]
      },
      specs: {
        thickness: { ar: "12.5 - 15 مم", en: "12.5 - 15 mm" },
        width: { ar: "1200 مم", en: "1200 mm" },
        length: { ar: "2400 - 3000 مم", en: "2400 - 3000 mm" },
        fireResistance: { ar: "متوسطة", en: "Medium" }
      },
      bgGradient: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
      accentColor: "text-emerald-600",
      badgeColor: "bg-emerald-500"
    },
    {
      id: "red",
      name: { ar: "الجبس الأحمر", en: "Red Gypsum" },
      subtitle: { ar: "مقاوم للحريق", en: "Fire Resistant" },
      color: "red",
      image: "/images/gypsum-red.jpg",
      category: "commercial",
      applications: {
        ar: ["الممرات العامة", "المباني التجارية", "غرف الأمان"],
        en: ["Hallways", "Commercial buildings", "Safe rooms"]
      },
      advantages: {
        ar: ["مقاوم للحريق", "يحتوي ألياف زجاجية", "يطابق معايير السلامة"],
        en: ["Fire resistant", "Contains fiberglass", "Meets safety standards"]
      },
      specs: {
        thickness: { ar: "15 - 18 مم", en: "15 - 18 mm" },
        width: { ar: "1200 مم", en: "1200 mm" },
        length: { ar: "2400 - 3000 مم", en: "2400 - 3000 mm" },
        fireResistance: { ar: "عالية (حتى ساعتين)", en: "High (up to 2 hours)" }
      },
      bgGradient: "from-red-50 to-red-100",
      borderColor: "border-red-200",
      accentColor: "text-red-600",
      badgeColor: "bg-red-500"
    },
    {
      id: "blue",
      name: { ar: "الجبس الأزرق", en: "Blue Gypsum" },
      subtitle: { ar: "عازل للصوت", en: "Sound Insulation" },
      color: "blue",
      image: "/images/gypsum-blue.jpg",
      category: "residential",
      applications: {
        ar: ["غرف النوم", "المكاتب", "استديوهات التسجيل"],
        en: ["Bedrooms", "Offices", "Recording studios"]
      },
      advantages: {
        ar: ["عزل صوت ممتاز", "كثافة أعلى", "يقلل الضوضاء"],
        en: ["Excellent sound insulation", "Higher density", "Reduces noise"]
      },
      specs: {
        thickness: { ar: "12.5 - 15 مم", en: "12.5 - 15 mm" },
        width: { ar: "1200 مم", en: "1200 mm" },
        length: { ar: "2400 - 3000 مم", en: "2400 - 3000 mm" },
        fireResistance: { ar: "متوسطة", en: "Medium" }
      },
      bgGradient: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      accentColor: "text-blue-600",
      badgeColor: "bg-blue-500"
    },
    {
      id: "purple",
      name: { ar: "الجبس البنفسجي", en: "Purple Gypsum" },
      subtitle: { ar: "مقاوم للرطوبة والعفن", en: "Moisture + Mold Resistant" },
      color: "purple",
      image: "/images/gypsum-purple.jpg",
      category: "industrial",
      applications: {
        ar: ["المناطق شديدة الرطوبة", "المطابخ الصناعية", "المستشفيات"],
        en: ["High humidity areas", "Commercial kitchens", "Hospitals"]
      },
      advantages: {
        ar: ["مقاوم للعفن", "أقوى من الأخضر", "مناسب للبيئات القاسية"],
        en: ["Mold resistant", "Stronger than green", "Suitable for harsh environments"]
      },
      specs: {
        thickness: { ar: "15 - 18 مم", en: "15 - 18 mm" },
        width: { ar: "1200 مم", en: "1200 mm" },
        length: { ar: "2400 - 3000 مم", en: "2400 - 3000 mm" },
        fireResistance: { ar: "عالية", en: "High" }
      },
      bgGradient: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      accentColor: "text-purple-600",
      badgeColor: "bg-purple-500"
    }
  ];

  // Quick facts
  const quickFacts = [
    {
      ar: "متوفر بسماكات مختلفة: 9.5 - 18 مم حسب النوع والاستخدام",
      en: "Available in different thicknesses: 9.5 - 18 mm depending on type and use"
    },
    {
      ar: "مقاوم للحريق حتى ساعتين في الأنواع المخصصة",
      en: "Fire resistant up to 2 hours in specialized types"
    },
    {
      ar: "خفيف الوزن وسهل التركيب مقارنة بالجدران التقليدية",
      en: "Light weight and easy to install compared to traditional walls"
    },
    {
      ar: "صديق للبيئة وقابل لإعادة التدوير",
      en: "Eco-friendly and recyclable"
    }
  ];

  // Function to get image path with fallback
  const getImagePath = (typeId) => {
    const imageMap = {
      white: "/images/gypsum-white.jpg",
      green: "/images/gypsum-green.jpg",
      red: "/images/gypsum-red.jpg",
      blue: "/images/gypsum-blue.jpg",
      purple: "/images/gypsum-purple.jpg"
    };
    return imageMap[typeId] || "/images/gypsum-default.jpg";
  };

  // Filter types by category
  const filteredTypes = selectedCategory === "all" 
    ? gypsumTypes 
    : gypsumTypes.filter(type => type.category === selectedCategory);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#f6f4f1] px-8 md:px-20 py-16 relative"
      dir="RTL"
    >
      {/* زر العودة */}
      <Link to="/catalog-moodboard">
        <motion.div 
          className="text-gray-800 text-xl mb-8 block absolute top-18 right-20 z-50 cursor-pointer group"
          whileHover={{ x: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md group-hover:shadow-xl transition-all duration-300">
            →{language === 'ar' ? ' العودة' : ' Back'}
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

      {/* ===== القسم الرئيسي مع LayoutID ===== */}
      <div className="flex flex-col lg:flex-row items-start gap-12 mt-16 mb-20">
        {/* الصورة الرئيسية مع layoutId */}
        <motion.div layoutId="gypsum-container" className="relative w-full lg:w-1/2">
          <motion.img
            layoutId="gypsum-image"
            src={getImagePath(selectedType)}
            className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
            alt="Gypsum Collection"
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          />
          <motion.div 
            layoutId="gypsum-label"
            className="absolute -bottom-4 -right-4 bg-[#a58d7b] text-white px-6 py-2 rounded-full text-sm tracking-widest shadow-xl"
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t.pageTitle[language]}
          </motion.div>
        </motion.div>

        {/* النص التعريفي */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full lg:w-1/2"
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#4a3f36] tracking-wider mb-6">
            {t.pageTitle[language]}
          </h2>
          
          {/* معلومات سريعة عن الجبس */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/80">
            <h3 className="text-sm tracking-widest text-[#4a3f36] font-medium mb-4 border-b border-[#d6ccc2] pb-2">
              {t.quickFacts[language]}
            </h3>
            <div className="space-y-3">
              {quickFacts.map((fact, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#a58d7b] rounded-full"></div>
                  <span className="text-sm text-[#6b5b4e]">
                    {fact[language]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* فلاتر التصنيف */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12 flex justify-center gap-4 flex-wrap"
      >
        {Object.entries(t.categories).map(([key, value]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory(key)}
            className={`px-6 py-2 rounded-full text-sm transition-all duration-300 ${
              selectedCategory === key
                ? 'bg-[#a58d7b] text-white shadow-lg'
                : 'bg-white text-[#4a3f36] hover:bg-gray-50 shadow-md'
            }`}
          >
            {value[language]}
          </motion.button>
        ))}
      </motion.div>

      {/* أنواع الجبس */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-20"
      >
        <h3 className="text-3xl font-light text-[#4a3f36] mb-10 text-center">
          {t.types[language]}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedType(type.id)}
              className={`cursor-pointer rounded-2xl transition-all duration-500 overflow-hidden bg-gradient-to-br ${type.bgGradient} border ${type.borderColor} ${
                selectedType === type.id 
                  ? 'shadow-2xl ring-2 ring-[#a58d7b] scale-[1.02]' 
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {/* الصورة مع overlay متدرج */}
              <div className="relative h-56 overflow-hidden group">
                <motion.img 
                  src={type.image}
                  alt={type.name[language]}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  whileHover={{ scale: 1.1 }}
                  onError={(e) => {
                    e.target.src = "/images/gypsum-default.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Badge النوع */}
                <div className={`absolute top-4 right-4 ${type.badgeColor} text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg`}>
                  {type.subtitle[language]}
                </div>
              </div>

              {/* المحتوى */}
              <div className="p-8">
                <h4 className={`text-2xl font-light mb-2 ${type.accentColor}`}>
                  {type.name[language]}
                </h4>
                
                {/* الاستخدامات */}
                <div className="mb-6">
                  <h5 className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                    {t.applications[language]}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {type.applications[language].map((app, idx) => (
                      <span 
                        key={idx}
                        className="text-xs bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-gray-600 shadow-sm"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                {/* المميزات */}
                <div className="mb-6">
                  <h5 className="text-xs uppercase tracking-wider text-gray-400 mb-3">
                    {t.advantages[language]}
                  </h5>
                  <ul className="space-y-2">
                    {type.advantages[language].map((adv, idx) => (
                      <motion.li 
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * idx }}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${type.accentColor.replace('text', 'bg')}`} />
                        {adv}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}