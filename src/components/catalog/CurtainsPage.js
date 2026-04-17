// CurtainsPage.js
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function CurtainsPage() {
  const { language } = useLanguage();
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

  const curtainTypes = [
    {
      category: { ar: "أنواع الستائر", en: "Curtain Types" },
      items: [
        { 
          name: { ar: "رول", en: "Roller Blinds" },
          image: "/images/roll.jpg",
          specs: { ar: "متوفرة بعدة أقمشة وألوان", en: "Available in multiple fabrics and colors" }
        },
        { 
          name: { ar: "رومانية", en: "Roman Blinds" },
          image: "/images/romanian.jpg",
          specs: { ar: "خامات فاخرة مع تطريزات مميزة", en: "Premium materials with distinctive embroidery" }
        },
        { 
          name: { ar: "شرائح المنيوم (عامودي)", en: "Vertical Aluminum Blinds" },
          image: "/images/vertical.jpg",
          specs: { ar: "مقاومة للغبار وسهلة التنظيف", en: "Dust resistant and easy to clean" }
        },
        { 
          name: { ar: "شرائح المنيوم (افقي)", en: "Horizontal Aluminum Blinds" },
          image: "/images/horizontal.jpg",
          specs: { ar: "تتحكم بزاوية الضوء بدقة عالية", en: "Precise light angle control" }
        },
        { 
          name: { ar: "لوحية", en: "Panel Blinds" },
          image: "/images/panel.jpg",
          specs: { ar: "مناسبة للنوافذ الكبيرة والواجهات الزجاجية", en: "Suitable for large windows and glass facades" }
        },
        { 
          name: { ar: "قماش", en: "Fabric Curtains" },
          image: "/images/fabric.jpg",
          specs: { ar: "مجموعة واسعة من الأقمشة الفاخرة", en: "Wide range of luxury fabrics" }
        },
        { 
          name: { ar: "شيفون", en: "Chiffon Curtains" },
          image: "/images/chiffon.jpg",
          specs: { ar: "خامات ناعمة مع تطريزات أنيقة", en: "Soft materials with elegant embroidery" }
        },
      ]
    },
    {
      category: { ar: "طرق التحكم", en: "Control Methods" },
      items: [
        { 
          name: { ar: "يدوي", en: "Manual" },
          specs: { ar: "حبال جانبية أو سلاسل كريستال", en: "Side cords or crystal chains" }
        },
        { 
          name: { ar: "كهربائي", en: "Electric" },
          specs: { ar: "محركات ألمانية هادئة مع ضمان 5 سنوات", en: "Quiet German motors with 5-year warranty" }
        },
        { 
          name: { ar: "سمارت", en: "Smart" },
          specs: { ar: "متوافق مع Alexa و Google Home و Apple HomeKit", en: "Compatible with Alexa, Google Home, and Apple HomeKit" }
        }
      ]
    }
  ];

  return (
    <motion.div
      className="min-h-screen bg-[#fcf9f7] px-8 md:px-20 py-16 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      dir="RTL"
    >
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
          {showUpArrow 
            ? (language === 'ar' ? 'العودة للأعلى' : 'BACK TO TOP') 
            : (language === 'ar' ? 'تمرير' : 'SCROLL')}
        </span>
        <div className="text-2xl text-[#4a3f36]">
          {showUpArrow ? "↑" : "↓"}
        </div>
      </motion.div>

      {/* Hero Section مع حركة الدخول من الكود القديم */}
      <div className="flex flex-col md:flex-row items-start gap-12 mt-16">
        {/* Image Section مع حركة الدخول */}
        <motion.div 
          layoutId="curtains-container" 
          className="relative"
          initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* الزخارف الجانبية - مثل الكود القديم */}
          <div className={`absolute -top-4 ${language === 'ar' ? '-right-4 border-r-2' : '-left-4 border-l-2'} w-24 h-24 border-t-2 border-gray-300`} />
          <div className={`absolute -bottom-4 ${language === 'ar' ? '-left-4 border-l-2' : '-right-4 border-r-2'} w-24 h-24 border-b-2 border-gray-300`} />
          
          <motion.img
            layoutId="curtains-image"
            src="/images/main.jpg"
            className="w-full md:w-96 h-auto rounded-2xl shadow-2xl"
            alt={language === 'ar' ? 'مجموعة الستائر' : 'Curtains Collection'}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute -bottom-4 -right-4 bg-[#4a3f36] text-white px-6 py-2 rounded-full text-sm tracking-widest shadow-xl">
            {language === 'ar' ? 'الستائر' : 'CURTAINS'}
          </div>
        </motion.div>

        {/* Text Section مع حركة الدخول */}
        <motion.div
          initial={{ opacity: 0, x: language === 'ar' ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="max-w-lg"
        >
          {/* الخط الزخرفي - مثل الكود القديم */}
          <motion.span 
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="h-px bg-gray-400 mb-8 block"
          />
          
          <h2 className="text-4xl md:text-5xl font-light text-[#4a3f36] tracking-wider mb-4">
            {language === 'ar' ? 'مجموعة الستائر' : 'Curtains Collection'}
          </h2>
          
          <div className="space-y-6 mb-8">
            <p className="text-[#6b5b4e] text-lg leading-relaxed font-light">
              {language === 'ar' 
                ? 'ستائر تحكي قصصًا. من الكلاسيكي الأنيق إلى العصري البسيط، مجموعة الستائر لدينا تقدم تشطيبات حصرية بخامات عالية الجودة وتصاميم تناسب كل روح تصميمية.'
                : 'Curtains that tell stories. From elegant classic to simple modern, our curtains collection offers exclusive finishes with high-quality materials and designs that suit every design spirit.'}
            </p>
            
            {/* قسم أنواع الستائر والتشطيبات */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/80">
              <h3 className="text-sm tracking-widest text-[#4a3f36] font-medium mb-4 border-b border-[#d6ccc2] pb-2">
                {language === 'ar' ? 'أنظمة الستائر والتشطيبات' : 'Curtain Systems & Finishes'}
              </h3>
              
              <div className="space-y-4">
                {/* رول */}
                <div className="flex items-start gap-3 group hover:bg-[#fcf9f7] p-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 bg-[#4a3f36]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#4a3f36]/20 transition-colors">
                    <span className="text-[#4a3f36] text-sm font-medium">R</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4a3f36]">
                      {language === 'ar' ? 'ستائر رول' : 'Roller Blinds'}
                    </h4>
                    <p className="text-xs text-[#6b5b4e] leading-relaxed mt-0.5">
                      {language === 'ar' 
                        ? 'أنيقة وعملية، متوفرة بمختلف الأقمشة والدرجات اللونية.' 
                        : 'Elegant and practical, available in various fabrics and color shades.'}
                    </p>
                  </div>
                </div>
                
                {/* رومانية */}
                <div className="flex items-start gap-3 group hover:bg-[#fcf9f7] p-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 bg-[#4a3f36]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#4a3f36]/20 transition-colors">
                    <span className="text-[#4a3f36] text-sm font-medium">RM</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4a3f36]">
                      {language === 'ar' ? 'ستائر رومانية' : 'Roman Blinds'}
                    </h4>
                    <p className="text-xs text-[#6b5b4e] leading-relaxed mt-0.5">
                      {language === 'ar' 
                        ? 'طيات أنيقة تضفي فخامة على المكان، متوفرة بتطريزات مميزة.' 
                        : 'Elegant folds add luxury to the space, available with distinctive embroidery.'}
                    </p>
                  </div>
                </div>
                
                {/* شرائح ألمنيوم */}
                <div className="flex items-start gap-3 group hover:bg-[#fcf9f7] p-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 bg-[#4a3f36]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#4a3f36]/20 transition-colors">
                    <span className="text-[#4a3f36] text-sm font-medium">A</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4a3f36]">
                      {language === 'ar' ? 'شرائح ألمنيوم' : 'Aluminum Blinds'}
                    </h4>
                    <p className="text-xs text-[#6b5b4e] leading-relaxed mt-0.5">
                      {language === 'ar' 
                        ? 'متوفرة عامودي وأفقي، مقاومة للغبار وسهلة التنظيف.' 
                        : 'Available vertical and horizontal, dust resistant and easy to clean.'}
                    </p>
                  </div>
                </div>
                
                {/* قماش */}
                <div className="flex items-start gap-3 group hover:bg-[#fcf9f7] p-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 bg-[#4a3f36]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#4a3f36]/20 transition-colors">
                    <span className="text-[#4a3f36] text-sm font-medium">F</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4a3f36]">
                      {language === 'ar' ? 'ستائر قماش' : 'Fabric Curtains'}
                    </h4>
                    <p className="text-xs text-[#6b5b4e] leading-relaxed mt-0.5">
                      {language === 'ar' 
                        ? 'مجموعة واسعة من الأقمشة الفاخرة والتصاميم العصرية.' 
                        : 'Wide range of luxury fabrics and modern designs.'}
                    </p>
                  </div>
                </div>
                
                {/* شيفون */}
                <div className="flex items-start gap-3 group hover:bg-[#fcf9f7] p-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 bg-[#4a3f36]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#4a3f36]/20 transition-colors">
                    <span className="text-[#4a3f36] text-sm font-medium">C</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4a3f36]">
                      {language === 'ar' ? 'ستائر شيفون' : 'Chiffon Curtains'}
                    </h4>
                    <p className="text-xs text-[#6b5b4e] leading-relaxed mt-0.5">
                      {language === 'ar' 
                        ? 'خامات ناعمة وشفافة تسمح بمرور الضوء بنعومة.' 
                        : 'Soft and transparent materials allow light to pass through softly.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========== قسم الستائر الكامل ========== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-24 mb-12"
      >
        <h3 className="text-3xl font-light text-[#4a3f36] tracking-wider mb-2">
          {language === 'ar' ? 'المكتبة الكاملة للستائر' : 'Complete Curtains Library'}
        </h3>
        <p className="text-[#6b5b4e] text-base font-light mb-4">
          {language === 'ar' 
            ? 'جميع أنواع الستائر مجمعة حسب الفئة' 
            : 'All curtain types grouped by category'}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-[#4a3f36]/10 px-3 py-1 rounded-full text-xs text-[#4a3f36]">Roller</span>
          <span className="bg-[#4a3f36]/10 px-3 py-1 rounded-full text-xs text-[#4a3f36]">Roman</span>
          <span className="bg-[#4a3f36]/10 px-3 py-1 rounded-full text-xs text-[#4a3f36]">Aluminum</span>
          <span className="bg-[#4a3f36]/10 px-3 py-1 rounded-full text-xs text-[#4a3f36]">Fabric</span>
          <span className="bg-[#4a3f36]/10 px-3 py-1 rounded-full text-xs text-[#4a3f36]">Chiffon</span>
        </div>
        <div className="w-24 h-0.5 bg-[#d6ccc2] mt-4"></div>
      </motion.div>

      {/* Grid أنواع الستائر */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="space-y-12"
      >
        {curtainTypes.map((section, sectionIndex) => (
          <motion.div
            key={section.category[language]}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * sectionIndex }}
            className="bg-white/70 rounded-3xl p-6 backdrop-blur-sm border border-white/80 shadow-lg hover:shadow-xl transition-all duration-500"
          >
            {/* عنوان القسم */}
            <div className="flex flex-wrap items-center justify-between mb-6">
              <div>
                <h4 className="text-2xl font-light text-[#4a3f36] flex items-center gap-2">
                  {section.category[language]}
                  <span className="text-sm bg-[#f0ebe7] px-3 py-1 rounded-full text-[#6b5b4e] font-normal">
                    {section.items.length} {language === 'ar' ? 'نوع' : 'types'}
                  </span>
                </h4>
              </div>
              <span className="text-sm bg-[#4a3f36] text-white px-4 py-1.5 rounded-full shadow-md">
                {section.items.length} {language === 'ar' ? 'خيار' : 'options'}
              </span>
            </div>

            {/* شبكة العناصر */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {section.items.map((item, itemIndex) => (
                <motion.div
                  key={itemIndex}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                >
                  {item.image && (
                    <div className="relative h-48 overflow-hidden">
                      <motion.img
                        src={item.image}
                        alt={item.name[language]}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  
                  <div className="p-5">
                    <h5 className="text-lg font-medium text-[#4a3f36] mb-2">
                      {item.name[language]}
                    </h5>
                    <p className="text-xs text-[#6b5b4e] leading-relaxed">
                      {item.specs[language]}
                    </p>
                    
                    {/* خط زخرفي */}
                    <div className={`mt-4 w-12 h-0.5 bg-[#d6ccc2] group-hover:w-20 transition-all duration-500`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}