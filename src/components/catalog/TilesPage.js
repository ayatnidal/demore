import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function TilesPage() {
  const [selectedType] = useState("");
  const [selectedUsage] = useState("");
  const [selectedTile, setSelectedTile] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
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

  const tileTypes = [
    { 
      id: "porcelain", 
      name: { en: "Porcelain", ar: "بورسلان" },
      description: { en: "High quality and durability", ar: "عالي الجودة والمتانة" },
      images: [
        "/images/porcelain-1.jpg",
        "/images/porcelain-2.jpg",
        "/images/porcelain-3.jpg"
      ],
      features: [
        { en: "High scratch resistance", ar: "مقاومة عالية للخدوش" },
        { en: "Water and moisture resistant", ar: "مقاومة الماء والرطوبة" },
        { en: "Ideal for entrances and kitchens", ar: "مثالي للمداخل والمطابخ" },
        { en: "Suitable for high traffic areas", ar: "مناسب للمناطق عالية الاستخدام" }
      ],
      sizes: [
        { en: "60×60 cm", ar: "60×60 سم" },
        { en: "80×80 cm", ar: "80×80 سم" },
        { en: "30×60 cm", ar: "30×60 سم" },
        { en: "60×120 cm", ar: "60×120 سم" },
        { en: "120×120 cm", ar: "120×120 سم" }
      ],
      finishes: [
        { en: "Glossy", ar: "لامع" },
        { en: "Matte", ar: "مطفي" }
      ],
      usage: [
        { en: "Interior flooring", ar: "أرضيات داخلية" },
        { en: "Kitchens", ar: "مطابخ" },
        { en: "Bathrooms", ar: "حمامات" },
        { en: "Living rooms", ar: "صالات" }
      ]
    },
    { 
      id: "ceramic", 
      name: { en: "Ceramic", ar: "كراميكا" },
      description: { en: "Suitable for walls and floors", ar: "مناسب للجدران والأرضيات" },
      images: [
        "/images/ceramic-1.jpg",
        "/images/ceramic-2.jpg",
        "/images/ceramic-3.jpg"
      ],
      features: [
        { en: "Economic price", ar: "سعر اقتصادي" },
        { en: "Variety of colors and designs", ar: "ألوان وتصاميم متنوعة" },
        { en: "Easy to install", ar: "سهلة التركيب" }
      ],
      sizes: [
        { en: "30×60 cm", ar: "30×60 سم" },
        { en: "33×33 cm", ar: "33×33 سم" },
        { en: "25×40 cm", ar: "25×40 سم" },
        { en: "40×40 cm", ar: "40×40 سم" }
      ],
      finishes: [
        { en: "Glossy", ar: "لامع" },
        { en: "Matte", ar: "مطفي" }
      ],
      usage: [
        { en: "Walls", ar: "جدران" },
        { en: "Low traffic floors", ar: "أرضيات منخفضة الاستخدام" },
        { en: "Decorative areas", ar: "مناطق تجميلية" }
      ]
    },
    { 
      id: "wood", 
      name: { en: "Wood Look", ar: "خشبي المظهر" },
      description: { en: "Wood appearance without its flaws", ar: "مظهر الخشب بدون عيوبه" },
      images: [
        "/images/wood-1.jpg",
        "/images/wood-2.jpg",
        "/images/wood-3.jpg"
      ],
      features: [
        { en: "Wood look without wood flaws", ar: "شكل الخشب بدون عيوب الخشب" },
        { en: "Water and scratch resistant", ar: "مقاومة الماء والخدوش" },
        { en: "Ideal for kitchens and bathrooms", ar: "مثالي للمطابخ والحمامات" }
      ],
      sizes: [
        { en: "15×60 cm", ar: "15×60 سم" },
        { en: "20×120 cm", ar: "20×120 سم" },
        { en: "15×90 cm", ar: "15×90 سم" },
        { en: "18×90 cm", ar: "18×90 سم" }
      ],
      finishes: [
        { en: "Matte", ar: "مطفي" }
      ],
      usage: [
        { en: "Flooring", ar: "أرضيات" },
        { en: "Walls", ar: "جدران" },
        { en: "Open spaces", ar: "مساحات مفتوحة" }
      ]
    },
    { 
      id: "stone", 
      name: { en: "Natural Stone", ar: "حجر طبيعي" },
      description: { en: "Luxurious natural look", ar: "مظهر طبيعي فاخر" },
      images: [
        "/images/stone-1.jpg",
        "/images/stone-2.jpg",
        "/images/stone-3.jpg"
      ],
      features: [
        { en: "Luxurious natural look", ar: "مظهر طبيعي فاخر" },
        { en: "Excellent durability", ar: "مقاومة ممتازة" },
        { en: "Easy to clean", ar: "سهل التنظيف" }
      ],
      sizes: [
        { en: "60×60 cm", ar: "60×60 سم" },
        { en: "80×80 cm", ar: "80×80 سم" },
        { en: "60×120 cm", ar: "60×120 سم" },
        { en: "120×120 cm", ar: "120×120 سم" }
      ],
      finishes: [
        { en: "Matte", ar: "مطفي" }
      ],
      usage: [
        { en: "Reception areas", ar: "ريسبشن" },
        { en: "Living rooms", ar: "صالات" },
        { en: "Outdoor flooring", ar: "أرضيات خارجية" }
      ]
    },
    { 
      id: "marble", 
      name: { en: "Artificial Marble", ar: "رخام اصطناعي" },
      description: { en: "Marble luxury at lower cost", ar: "فخامة الرخام بسعر أقل" },
      images: [
        "/images/marble-1.jpg",
        "/images/marble-2.jpg",
        "/images/marble-3.jpg"
      ],
      features: [
        { en: "Luxurious marble look at lower cost", ar: "مظهر رخام فاخر بسعر أقل" },
        { en: "Higher durability than natural marble", ar: "مقاومة أعلى من الرخام الطبيعي" },
        { en: "Suitable for classic and modern designs", ar: "يناسب التصميمات الكلاسيكية والمودرن" }
      ],
      sizes: [
        { en: "60×60 cm", ar: "60×60 سم" },
        { en: "80×80 cm", ar: "80×80 سم" },
        { en: "60×120 cm", ar: "60×120 سم" },
        { en: "120×120 cm", ar: "120×120 سم" }
      ],
      finishes: [
        { en: "Glossy", ar: "لامع" },
        { en: "Matte", ar: "مطفي" }
      ],
      usage: [
        { en: "Flooring", ar: "أرضيات" },
        { en: "Walls", ar: "جدران" },
        { en: "Kitchens", ar: "مطابخ" }
      ]
    }
  ];


  const handleTileClick = (tile) => {
    setSelectedTile(tile);
    setSelectedImageIndex(0);
  };

  const closeModal = () => {
    setSelectedTile(null);
    setSelectedImageIndex(0);
  };

  const nextImage = () => {
    if (selectedTile) {
      setSelectedImageIndex((prev) => 
        prev === selectedTile.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedTile) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? selectedTile.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <motion.div 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#f6f4f1] px-8 md:px-20 py-16 relative"
    >
      <Link to="/catalog-moodboard">
        <motion.div 
          className="text-gray-800 text-xl mb-8 block absolute top-18 right-20 z-50 cursor-pointer group"
          whileHover={{ x: language === 'ar' ? 10 : -10 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md group-hover:shadow-xl transition-all duration-300">
           → {language === 'ar' ? ' العودة' : ' Back'}
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

      {/* الحاوية الرئيسية مع layoutId */}
      <motion.div
        layoutId="tiles-container"
        className="relative w-full max-w-4xl mx-auto mb-10 mt-16"
        transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
        <motion.img
          layoutId="tiles-image"
          src="/images/tiles-hero.jpg"
          className="w-full h-[400px] object-cover rounded-2xl shadow-2xl"
          alt={language === 'ar' ? 'مجموعة البلاط' : 'Tiles Collection'}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
        />
        <motion.div
          layoutId="tiles-label"
          className="absolute -top-4 left-10 bg-[#4a3f36] text-white px-6 py-2 rounded-full text-sm tracking-widest shadow-lg"
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {language === 'ar' ? 'البلاط' : 'TILES'}
        </motion.div>
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl md:text-4xl font-light tracking-widest mb-6 text-center text-[#4a3f36]"
      >
        {language === 'ar' ? 'مجموعة البلاط' : 'Tiles Collection'}
      </motion.h2>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-600 max-w-xl mx-auto mb-10 text-center text-lg"
      >
        {language === 'ar' 
          ? 'بورسلان، سيراميك، خشبي، حجر طبيعي ورخام للأرضيات والجدران والمساحات الخارجية'
          : 'Porcelain, Ceramic, Wood Look, Natural Stone and Marble for floors, walls and outdoor spaces'}
      </motion.p>

      {/* عرض جميع أنواع البلاط مع الصور */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto mb-12"
      >
        {tileTypes.map((tile, index) => (
          <motion.div
            key={tile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -8 }}
            onClick={() => handleTileClick(tile)}
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all"
          >
            <div className="h-48 overflow-hidden relative">
              <img 
                src={tile.images[0]} 
                alt={language === 'ar' ? tile.name.ar : tile.name.en}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                {language === 'ar' ? `${tile.images.length} صور` : `${tile.images.length} images`}
              </div>
            </div>
            <div className="p-4 text-center">
              <h3 className="text-lg font-bold mb-2 text-[#4a3f36]">
                {language === 'ar' ? tile.name.ar : tile.name.en}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {language === 'ar' ? tile.description.ar : tile.description.en}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {tile.finishes.map((finish, i) => (
                  <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {language === 'ar' ? finish.ar : finish.en}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter Section */}
      {selectedType && selectedUsage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => {
              const selectedTileData = tileTypes.find(t => t.id === selectedType);
              console.log('Filtering by:', { 
                type: selectedType, 
                usage: selectedUsage,
                tileDetails: selectedTileData 
              });
            }}
          >
            {language === 'ar' ? 'عرض المنتجات' : 'View Products'}
          </motion.button>
        </motion.div>
      )}

      {/* Modal for Tile Details with Gallery */}
      <AnimatePresence>
        {selectedTile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* معرض الصور */}
              <div className="relative h-96 bg-gray-100">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImageIndex}
                    src={selectedTile.images[selectedImageIndex]}
                    alt={`${language === 'ar' ? selectedTile.name.ar : selectedTile.name.en} - ${language === 'ar' ? 'صورة' : 'Image'} ${selectedImageIndex + 1}`}
                    initial={{ opacity: 0, x: language === 'ar' ? -100 : 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: language === 'ar' ? 100 : -100 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* أزرار التنقل بين الصور */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={language === 'ar' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                  </svg>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={language === 'ar' ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
                  </svg>
                </button>

                {/* مؤشر الصور */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {selectedTile.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === selectedImageIndex 
                          ? 'bg-white w-4' 
                          : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                      }`}
                    />
                  ))}
                </div>

                {/* زر الإغلاق */}
                <button
                  onClick={closeModal}
                  className={`absolute top-4 ${language === 'ar' ? 'left-4' : 'right-4'} bg-white rounded-full p-2 shadow-lg hover:bg-gray-100`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* عداد الصور */}
                <div className={`absolute top-4 ${language === 'ar' ? 'right-4' : 'left-4'} bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm`}>
                  {selectedImageIndex + 1} / {selectedTile.images.length}
                </div>
              </div>
              
              {/* تفاصيل المنتج */}
              <div className="p-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <h2 className="text-3xl font-bold mb-4 text-[#4a3f36]">
                  {language === 'ar' ? selectedTile.name.ar : selectedTile.name.en}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* المميزات */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-[#4a3f36]">
                      {language === 'ar' ? 'المميزات' : 'Features'}
                    </h3>
                    <ul className="space-y-2">
                      {selectedTile.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 ml-2">✓</span>
                          {language === 'ar' ? feature.ar : feature.en}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* الأحجام الشائعة */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-[#4a3f36]">
                      {language === 'ar' ? 'الأحجام الشائعة' : 'Common Sizes'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTile.sizes.map((size, index) => (
                        <span key={index} className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
                          {language === 'ar' ? size.ar : size.en}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* التشطيبات */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-[#4a3f36]">
                      {language === 'ar' ? 'التشطيبات' : 'Finishes'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTile.finishes.map((finish, index) => (
                        <span key={index} className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
                          {language === 'ar' ? finish.ar : finish.en}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* الاستخدام */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-[#4a3f36]">
                      {language === 'ar' ? 'الاستخدام' : 'Usage'}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTile.usage.map((use, index) => (
                        <span key={index} className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
                          {language === 'ar' ? use.ar : use.en}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* صور مصغرة إضافية */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3 text-[#4a3f36]">
                    {language === 'ar' ? 'معرض الصور' : 'Gallery'}
                  </h3>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {selectedTile.images.map((image, index) => (
                      <motion.img
                        key={index}
                        src={image}
                        alt={`${language === 'ar' ? selectedTile.name.ar : selectedTile.name.en} - ${language === 'ar' ? 'صورة' : 'Image'} ${index + 1}`}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                          index === selectedImageIndex ? 'border-black' : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}