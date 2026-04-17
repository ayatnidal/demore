import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

// بيانات الإضاءة المفصلة مع الصور
const lightingData = [
  {
    id: "indoor-linear",
    title: {
      ar: "الإضاءة الخطية الداخلية",
      en: "Indoor Linear Lighting"
    },
    description: {
      ar: "أنظمة إضاءة خطية عصرية للأسقف الجبسية",
      en: "Modern linear lighting systems for gypsum ceilings"
    },
    applications: {
      ar: ["المكاتب", "المعارض", "المنازل الحديثة"],
      en: ["Offices", "Exhibitions", "Modern Homes"]
    },
    image: "/images/lighting/indoor-linear.jpg",
    category: "linear"
  },
  {
    id: "outdoor-linear",
    title: {
      ar: "الإضاءة الخطية الخارجية",
      en: "Outdoor Linear Lighting"
    },
    description: {
      ar: "مقاومة للعوامل الجوية بتقنية IP65/IP67",
      en: "Weather-resistant with IP65/IP67 technology"
    },
    applications: {
      ar: ["الواجهات", "الحدائق", "الممرات الخارجية"],
      en: ["Facades", "Gardens", "External Walkways"]
    },
    image: "/images/lighting/outdoor-linear.jpg",
    category: "linear"
  },
  {
    id: "magnetic-track",
    title: {
      ar: "نظام الماجنتك تراك",
      en: "Magnetic Track System"
    },
    description: {
      ar: "نظام إضاءة مغناطيسي مرن سهل التركيب والتعديل",
      en: "Flexible magnetic lighting system, easy to install and adjust"
    },
    applications: {
      ar: ["المنازل الفاخرة", "المعارض", "المكاتب الراقية"],
      en: ["Luxury Homes", "Exhibitions", "High-end Offices"]
    },
    image: "/images/lighting/magnetic-track.jpg",
    category: "systems"
  },
  {
    id: "chandeliers",
    title: {
      ar: "الثريات",
      en: "Chandeliers"
    },
    description: {
      ar: "ثريات مودرن وكلاسيك بإضاءة LED فاخرة",
      en: "Modern and classic chandeliers with luxury LED lighting"
    },
    applications: {
      ar: ["الصالات", "الفنادق", "الفلل"],
      en: ["Living Rooms", "Hotels", "Villas"]
    },
    image: "/images/lighting/chandeliers.jpg",
    category: "decorative"
  },
  {
    id: "up-down",
    title: {
      ar: "إضاءة Up & Down",
      en: "Up & Down Lighting"
    },
    description: {
      ar: "إضاءة جدارية لإبراز الجدران والواجهات",
      en: "Wall lighting to highlight walls and facades"
    },
    applications: {
      ar: ["الجدران الداخلية", "الواجهات الخارجية", "المداخل"],
      en: ["Interior Walls", "Exterior Facades", "Entrances"]
    },
    image: "/images/lighting/up-down.jpg",
    category: "decorative"
  },
  {
    id: "hidden",
    title: {
      ar: "الإضاءة المخفية",
      en: "Hidden Lighting"
    },
    description: {
      ar: "شريط LED داخل بروفايل ألمنيوم لتأثير سينمائي ناعم",
      en: "LED strip inside aluminum profile for a soft cinematic effect"
    },
    applications: {
      ar: ["الأسقف الجبسية", "تحت الخزائن", "خلف المرايا"],
      en: ["Gypsum Ceilings", "Under Cabinets", "Behind Mirrors"]
    },
    image: "/images/lighting/hidden.jpg",
    category: "decorative"
  },
  {
    id: "spotlights",
    title: {
      ar: "السبوتات",
      en: "Spotlights"
    },
    description: {
      ar: "سبوتات غاطسة وسطحية بتصاميم عصرية",
      en: "Recessed and surface spotlights with modern designs"
    },
    applications: {
      ar: ["الأسقف", "الجدران", "الأرضيات"],
      en: ["Ceilings", "Walls", "Floors"]
    },
    image: "/images/lighting/spotlights.jpg",
    category: "decorative"
  }
];

// صورة واحدة لجميع درجات حرارة الإضاءة
const colorTemperatureImage = "/images/lighting/color-temperature-spectrum.jpg";

// صورة واحدة لجميع ألوان RGB
const rgbColorsImage = "/images/lighting/rgb-colors-spectrum.jpg";

// خيارات التحكم
const controlOptions = [
  { id: "manual", name: { ar: "يدوي", en: "Manual" }, icon: "🎛️" },
  { id: "smart", name: { ar: "سمارت من التلفون", en: "Smart Phone Control" }, icon: "📱" }
];

export default function LightingPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [, setSelectedLight] = useState(null);
  const [selectedControl, setSelectedControl] = useState("manual");
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showUpArrow, setShowUpArrow] = useState(false);
  const { language } = useLanguage();

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

  // تصفية الإضاءة حسب الفئة
  const filteredLighting = selectedCategory === "all" 
    ? lightingData 
    : lightingData.filter(light => light.category === selectedCategory);

  // الفئات
  const categories = [
    { id: "all", name: { ar: "الكل", en: "All" } },
    { id: "linear", name: { ar: "الإضاءة الخطية", en: "Linear Lighting" } },
    { id: "systems", name: { ar: "الأنظمة المتطورة", en: "Advanced Systems" } },
    { id: "decorative", name: { ar: "الإضاءة الديكورية", en: "Decorative Lighting" } }
  ];

  const isRTL = language === 'ar';

  return (
    <motion.div
      className="min-h-screen bg-white"
      dir="RTL"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
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
          {showUpArrow 
            ? (isRTL ? 'العودة للأعلى' : 'BACK TO TOP') 
            : (isRTL ? 'تمرير' : 'SCROLL')}
        </span>
        <div className="text-2xl text-[#4a3f36]">
          {showUpArrow ? "↑" : "↓"}
        </div>
      </motion.div>

      {/* الهيرو - فيديو بدل الصور */}
      <div className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setIsVideoLoaded(true)}
            className="w-full h-full object-cover"
          >
            <source src="/images/lighting/lighting-showcase.mp4" type="video/mp4" />
            {/* صورة احتياطية في حال لم يتم تحميل الفيديو */}
            <img 
              src="/images/lighting/hero-fallback.jpg" 
              alt={isRTL ? "إضاءة" : "Lighting"} 
              className="w-full h-full object-cover"
            />
          </video>
          
          {/* تراكب أسود خفيف */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        {/* العنوان على الهيرو */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVideoLoaded ? 1 : 0, y: isVideoLoaded ? 0 : 30 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-white z-10"
        >
          <h1 className="text-8xl font-thin tracking-widest mb-4">
            {isRTL ? 'الإضاءة' : 'Lighting'}
          </h1>
          <div className="w-24 h-px bg-white/60 mb-6" />
          <p className="text-xl tracking-widest text-white/80">
            {isRTL ? 'مجموعة الإضاءة' : 'LIGHTING COLLECTION'}
          </p>
        </motion.div>

       

        <Link to="/catalog-moodboard">
            <motion.div 
            className="text-white text-xl mb-8 block absolute top-18 right-20 z-50 cursor-pointer group"
            whileHover={{ x: language === 'ar' ? 10 : -10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
            <span className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full shadow-md group-hover:shadow-xl transition-all duration-300">
            → {language === 'ar' ? ' العودة ' : ' Back'}
            </span>
            </motion.div>
        </Link>        
      </div>

      {/* المحتوى الرئيسي */}
      <div className="container mx-auto px-8 py-16">
        
        {/* الفئات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-8 mb-16"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="relative group"
            >
              <span className={`text-lg transition-colors ${
                selectedCategory === category.id 
                  ? 'text-black' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}>
                {isRTL ? category.name.ar : category.name.en}
              </span>
              {selectedCategory === category.id && (
                <motion.div
                  layoutId="categoryIndicator"
                  className="absolute -bottom-2 left-0 right-0 h-px bg-black"
                />
              )}
            </button>
          ))}
        </motion.div>

        {/* شبكة الإضاءة مع الصور */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24"
        >
          <AnimatePresence mode="wait">
            {filteredLighting.map((light, index) => (
              <motion.div
                key={light.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedLight(light)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[4/3]">
                  <motion.img
                    src={light.image}
                    alt={isRTL ? light.title.ar : light.title.en}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                </div>
                
                <h3 className="text-xl font-light mb-2 group-hover:text-gray-600 transition-colors">
                  {isRTL ? light.title.ar : light.title.en}
                </h3>
                
                <p className="text-gray-500 text-sm mb-3 leading-relaxed">
                  {isRTL ? light.description.ar : light.description.en}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {(isRTL ? light.applications.ar : light.applications.en).map((app, i) => (
                    <span 
                      key={i}
                      className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* خيارات التحكم */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-3">
              {isRTL ? 'خيارات التحكم' : 'Control Options'}
            </h2>
            <div className="w-16 h-px bg-gray-300 mx-auto" />
          </div>

          <div className="flex justify-center gap-8">
            {controlOptions.map((control) => (
              <motion.button
                key={control.id}
                onClick={() => setSelectedControl(control.id)}
                className="relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`p-8 rounded-2xl transition-all duration-300 ${
                  selectedControl === control.id
                    ? 'bg-black text-white shadow-xl'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}>
                  <div className="text-4xl mb-3">{control.icon}</div>
                  <div className="text-lg font-light">
                    {isRTL ? control.name.ar : control.name.en}
                  </div>
                </div>
                
                {selectedControl === control.id && (
                  <motion.div
                    layoutId="controlIndicator"
                    className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* تفاصيل التحكم المحدد */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center text-gray-500"
          >
            {selectedControl === "manual" ? (
              isRTL ? (
                <p>تحكم يدوي تقليدي مع إمكانية التعتيم وتغيير شدة الإضاءة</p>
              ) : (
                <p>Traditional manual control with dimming and brightness adjustment</p>
              )
            ) : (
              isRTL ? (
                <p>تحكم ذكي عبر التطبيق مع إمكانية التحكم عن بعد وجدولة الإضاءة</p>
              ) : (
                <p>Smart control via app with remote control and lighting scheduling</p>
              )
            )}
          </motion.div>
        </motion.div>

        {/* صورة واحدة لدرجات حرارة الإضاءة */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-3">
              {isRTL ? 'درجات حرارة الإضاءة' : 'Color Temperature'}
            </h2>
            <div className="w-16 h-px bg-gray-300 mx-auto" />
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl"
          >
            <img
              src={colorTemperatureImage}
              alt={isRTL ? "درجات حرارة الإضاءة" : "Color Temperature"}
              className="w-full h-auto"
            />
          </motion.div>
        </motion.div>

        {/* صورة واحدة لألوان RGB */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light mb-3">
              {isRTL ? 'ألوان RGB' : 'RGB Colors'}
            </h2>
            <div className="w-16 h-px bg-gray-300 mx-auto" />
          </div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl max-w-3xl mx-auto"
          >
            <div className="aspect-[16/9] relative">
              <img
                src={rgbColorsImage}
                alt={isRTL ? "ألوان RGB" : "RGB Colors"}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}