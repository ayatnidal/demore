// ParquetPage.js
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function ParquetPage() {
  const { language } = useLanguage();
  const [selectedType, setSelectedType] = useState("natural");
  const [selectedPattern, setSelectedPattern] = useState("straight");
  const [selectedCollection, setSelectedCollection] = useState("ocean8xl");
  const [selectedInstallation, setSelectedInstallation] = useState("adhesive");
  const [selectedProduct, setSelectedProduct] = useState(null);
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
      ar: "الباركيت",
      en: "Parquet"
    },
    parquetTypes: {
      ar: "أنواع الباركيت",
      en: "Parquet Types"
    },
    patterns: {
      ar: "أشكال الباركيت",
      en: "Patterns"
    },
    collections: {
      ar: "المجموعات",
      en: "Collections"
    },
    products: {
      ar: "المنتجات",
      en: "Products"
    },
    installation: {
      ar: "طرق التركيب",
      en: "Installation Methods"
    },
    sku: {
      ar: "رقم المنتج",
      en: "SKU"
    },
    type: {
      ar: "النوع",
      en: "Type"
    },
    viewDetails: {
      ar: "عرض التفاصيل",
      en: "View Details"
    },
    close: {
      ar: "إغلاق",
      en: "Close"
    },
    productImages: {
      ar: "صور المنتج",
      en: "Product Images"
    }
  };

  // صور أنواع الباركيت
  const parquetTypeImages = {
    natural: "/images/natural-wood.jpg",
    laminate: "/images/laminate.jpg",
  };

  // صور الشكل 
  const patternImages = {
    straight: "/images/straight-planks.jpg",
    chevron: "/images/chevron-pattern.jpg"
  };

  // صور طرق التركيب
  const installationImages = {
    adhesive: "/images/adhesive-installation.jpg",
    floating: "/images/floating-floor.jpg",
    heated: "/images/heated-flooring.jpg"
  };

  // دالة لإنشاء مسار الصورة بناءً على SKU
  const getProductImagePath = (sku, collection) => {
    // هنا يمكنك تحديد المسار الفعلي للصور حسب هيكل مجلداتك
    // مثال: /images/products/ocean8xl/62003117.jpg
    // أو /images/products/62003117/main.jpg
    
    const collectionFolder = collection.includes('XL') ? 'ocean8xl' : 'ocean8v4';
    return `/images/products/${collectionFolder}/${sku}.jpg`;
  };

  // دالة للحصول على صورة بديلة إذا لم توجد الصورة
  const getProductColor = (productName) => {
    // تحديد لون خلفية مناسب حسب اسم المنتج
    if (productName.includes('Grey') || productName.includes('Gray')) {
      return 'from-gray-400 to-gray-600';
    } else if (productName.includes('Brown')) {
      return 'from-amber-700 to-amber-900';
    } else if (productName.includes('Natural')) {
      return 'from-amber-500 to-amber-700';
    } else if (productName.includes('Sand')) {
      return 'from-yellow-600 to-amber-700';
    } else if (productName.includes('Light')) {
      return 'from-amber-300 to-amber-500';
    } else {
      return 'from-[#a58d7b] to-[#8b7a6b]';
    }
  };

  const parquetTypes = [
    { 
      id: "natural", 
      name: { ar: "باركيه خشب طبيعي", en: "Natural Wood Parquet" },
      description: { ar: "خشب طبيعي 100%", en: "100% Natural Wood" },
      features: [
        { 
          title: { ar: "صلابة عالية", en: "High Durability" },
          description: { ar: "مقاوم للخدوش والصدمات اليومية", en: "Resistant to scratches and daily impacts" }
        },
        { 
          title: { ar: "قابل للصقل والتجديد", en: "Refinishable" },
          description: { ar: "يمكن تجديد سطحه عدة مرات", en: "Can be refinished multiple times" }
        },
      ],
      image: parquetTypeImages.natural
    },
    { 
      id: "laminate", 
      name: { ar: "باركيه لامينت", en: "Laminate Parquet" },
      description: { ar: "HDF وSPC وLVT", en: "HDF, SPC & LVT" },
      features: [
        { 
          title: { ar: "مقاوم للماء والرطوبة", en: "Water & Moisture Resistant" },
          description: { ar: "خصوصًا SPC وLVT مناسب للمطابخ والحمامات", en: "Especially SPC and LVT suitable for kitchens and bathrooms" }
        },
        { 
          title: { ar: "خيارات تصاميم متعددة", en: "Multiple Design Options" },
          description: { ar: "تشكيلة واسعة من الألوان والنقوشات", en: "Wide variety of colors and patterns" }
        }
      ],
      image: parquetTypeImages.laminate
    },
  ];

  const patterns = [
    { 
      id: "straight", 
      name: { ar: "ألواح مستقيمة", en: "Straight Planks" },
      description: { ar: "تصميم كلاسيكي بسيط وأنيق", en: "Simple and elegant classic design" },
      details: { ar: "تركيب متوازي للألواح يعطي شعوراً بالاتساع", en: "Parallel installation creates a sense of spaciousness" },
      image: patternImages.straight
    },
    { 
      id: "chevron", 
      name: { ar: "الشيفرون", en: "Chevron" },
      description: { ar: "نقش متعرج فاخر يضفي حركة على الأرضية", en: "Luxurious zigzag pattern adds movement" },
      details: { ar: "ألواح مقطعة بزوايا 45 درجة لتشكيل نمط V متصل", en: "Planks cut at 45-degree angles creating continuous V pattern" },
      image: patternImages.chevron
    }
  ];

  // قائمة المنتجات الجديدة من الجدول مع إضافة خاصية الصور
  const products = [
    // Ocean 8 XL Collection
    { 
      name: "Bloom Silver Grey", 
      collection: "Ocean 8 XL", 
      sku: "62003117", 
      type: "Vinyl/Laminate", 
      category: "xl",
      images: {
        main: "/images/products/ocean8xl/bloom-silver-grey.jpg",
        thumbnail: "/images/products/ocean8xl/bloom-silver-grey-thumb.jpg",
        gallery: [
          "/images/products/ocean8xl/bloom-silver-grey.jpg",
        ]
      },
      specifications: {
        thickness: { ar: "8 مم", en: "8mm" },
        width: { ar: "220 مم", en: "220mm" },
        length: { ar: "1845 مم", en: "1845mm" },
        wearLayer: { ar: "0.5 مم", en: "0.5mm" }
      }
    },
    { 
      name: "Select Light Brown", 
      collection: "Ocean 8 XL", 
      sku: "62003120", 
      type: "Vinyl/Laminate", 
      category: "xl",
      images: {
        main: "/images/products/ocean8xl/select-light-brown.jpg",
        thumbnail: "/images/products/ocean8xl/select-light-brown.jpg",
        gallery: [
          "/images/products/ocean8xl/select-light-brown.jpg",
        ]
      },
      specifications: {
        thickness: { ar: "8 مم", en: "8mm" },
        width: { ar: "220 مم", en: "220mm" },
        length: { ar: "1845 مم", en: "1845mm" },
        wearLayer: { ar: "0.5 مم", en: "0.5mm" }
      }
    },
    { 
      name: "Select Sand Natural", 
      collection: "Ocean 8 XL", 
      sku: "62003121", 
      type: "Vinyl/Laminate", 
      category: "xl",
      images: {
        main: "/images/products/ocean8xl/select-sand-natural.jpg",
        thumbnail: "/images/products/ocean8xl/select-sand-natural.jpg"
      }
    },
    { 
      name: "Gyant XL Light Sand", 
      collection: "Ocean 8 XL", 
      sku: "62003118", 
      type: "Vinyl/Laminate", 
      category: "xl",
      images: {
        main: "/images/products/ocean8xl/gyant-xl-light-sand.jpg",
        thumbnail: "/images/products/ocean8xl/gyant-xl-light-sand.jpg"
      }
    },
    { 
      name: "Gyant XL Warm Natural", 
      collection: "Ocean 8 XL", 
      sku: "62003119", 
      type: "Vinyl/Laminate", 
      category: "xl",
      images: {
        main: "/images/products/ocean8xl/gyant-xl-warm-natural.jpg",
        thumbnail: "/images/products/ocean8xl/gyant-xl-warm-natural.jpg"
      }
    },
    
    // Ocean 8 V4 Collection
    { 
      name: "Gyant Dark Brown", 
      collection: "Ocean 8 V4", 
      sku: "62003071", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/gyant-dark-brown.jpg",
        thumbnail: "/images/products/ocean8v4/gyant-dark-brown.jpg"
      }
    },
    { 
      name: "Gyant Natural", 
      collection: "Ocean 8 V4", 
      sku: "62003076", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/gyant-natural.jpg",
        thumbnail: "/images/products/ocean8v4/gyant-natural.jpg"
      }
    },
    { 
      name: "Select Light Brown", 
      collection: "Ocean 8 V4", 
      sku: "62003089", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/select-light-brown.jpg",
        thumbnail: "/images/products/ocean8v4/select-light-brown.jpg"
      }
    },
    { 
      name: "Merbau Brown", 
      collection: "Ocean 8 V4", 
      sku: "62003085", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/merbau-brown.jpg",
        thumbnail: "/images/products/ocean8v4/merbau-brown.jpg"
      }
    },
    { 
      name: "Walnut Brown", 
      collection: "Ocean 8 V4", 
      sku: "62003098", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/walnut-brown.jpg",
        thumbnail: "/images/products/ocean8v4/walnut-brown.jpg"
      }
    },
    { 
      name: "Texas Light Brown", 
      collection: "Ocean 8 V4", 
      sku: "62003099", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/texas-light-brown.jpg",
        thumbnail: "/images/products/ocean8v4/texas-light-brown.jpg"
      }
    },
    { 
      name: "Texas Brown", 
      collection: "Ocean 8 V4", 
      sku: "62003095", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/texas-brown.jpg",
        thumbnail: "/images/products/ocean8v4/texas-brown.jpg"
      }
    },
    { 
      name: "Gyant Sand Natural", 
      collection: "Ocean 8 V4", 
      sku: "62003077", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/gyant-sand-natural.jpg",
        thumbnail: "/images/products/ocean8v4/gyant-sand-natural.jpg"
      }
    },
    { 
      name: "Texas Light Natural", 
      collection: "Ocean 8 V4", 
      sku: "62003097", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/texas-light-natural.jpg",
        thumbnail: "/images/products/ocean8v4/texas-light-natural.jpg"
      }
    },
    { 
      name: "Majesty Natural", 
      collection: "Ocean 8 V4", 
      sku: "62003086", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/majesty-natural.jpg",
        thumbnail: "/images/products/ocean8v4/majesty-natural.jpg"
      }
    },
    { 
      name: "Jazz Light Grey", 
      collection: "Ocean 8 V4", 
      sku: "62003083", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/jazz-light-grey.jpg",
        thumbnail: "/images/products/ocean8v4/jazz-light-grey.jpg"
      }
    },
    { 
      name: "Gyant Brown Natural", 
      collection: "Ocean 8 V4", 
      sku: "62003070", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/gyant-brown-natural.jpg",
        thumbnail: "/images/products/ocean8v4/gyant-brown-natural.jpg"
      }
    },
    { 
      name: "Java Brown", 
      collection: "Ocean 8 V4", 
      sku: "62003079", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/java-brown.jpg",
        thumbnail: "/images/products/ocean8v4/java-brown.jpg"
      }
    },
    { 
      name: "Jazz Sand Natural", 
      collection: "Ocean 8 V4", 
      sku: "62003084", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/jazz-sand-natural.jpg",
        thumbnail: "/images/products/ocean8v4/jazz-sand-natural.jpg"
      }
    },
    { 
      name: "Epic Natural", 
      collection: "Ocean 8 V4", 
      sku: "62003069", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/epic-natural.jpg",
        thumbnail: "/images/products/ocean8v4/epic-natural.jpg"
      }
    },
    { 
      name: "Gyant Warm Natural", 
      collection: "Ocean 8 V4", 
      sku: "62003080", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/gyant-warm-natural.jpg",
        thumbnail: "/images/products/ocean8v4/gyant-warm-natural.jpg"
      }
    },
    { 
      name: "Bloom Natural", 
      collection: "Ocean 8 V4", 
      sku: "62003052", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/bloom-natural.jpg",
        thumbnail: "/images/products/ocean8v4/bloom-natural.jpg"
      }
    },
    { 
      name: "Epic Grey", 
      collection: "Ocean 8 V4", 
      sku: "62003066", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/epic-grey.jpg",
        thumbnail: "/images/products/ocean8v4/epic-grey.jpg"
      }
    },
    { 
      name: "Bloom Light Natural", 
      collection: "Ocean 8 V4", 
      sku: "62003051", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/bloom-light-natural.jpg",
        thumbnail: "/images/products/ocean8v4/bloom-light-natural.jpg"
      }
    },
    { 
      name: "Canyon Light", 
      collection: "Ocean 8 V4", 
      sku: "62003056", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/canyon-light.jpg",
        thumbnail: "/images/products/ocean8v4/canyon-light.jpg"
      }
    },
    { 
      name: "Gyant Light Natural", 
      collection: "Ocean 8 V4", 
      sku: "62003074", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/gyant-light-natural.jpg",
        thumbnail: "/images/products/ocean8v4/gyant-light-natural-thumb.jpg"
      }
    },
    { 
      name: "Bloom Warm Natural", 
      collection: "Ocean 8 V4", 
      sku: "62003055", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/bloom-warm-natural.jpg",
        thumbnail: "/images/products/ocean8v4/bloom-warm-natural.jpg"
      }
    },
    { 
      name: "Epic Light", 
      collection: "Ocean 8 V4", 
      sku: "62003068", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/epic-light.jpg",
        thumbnail: "/images/products/ocean8v4/eepic-light.jpg"
      }
    },
    { 
      name: "Charme Light Natural", 
      collection: "Ocean 8 V4", 
      sku: "62003058", 
      type: "Vinyl/Laminate", 
      category: "v4",
      images: {
        main: "/images/products/ocean8v4/charme-light-natural.jpg",
        thumbnail: "/images/products/ocean8v4/charme-light-natural.jpg"
      }
    }
  ];

  // تجميع المنتجات حسب المجموعة
  const collections = [
    {
      id: "ocean8xl",
      name: "Ocean 8 XL",
      description: { ar: "مجموعة XL بألواح عريضة للمساحات الواسعة", en: "XL collection with wide planks for large spaces" },
      products: products.filter(p => p.collection === "Ocean 8 XL")
    },
    {
      id: "ocean8v4",
      name: "Ocean 8 V4",
      description: { ar: "مجموعة V4 بتصاميم عصرية ومتنوعة", en: "V4 collection with modern and diverse designs" },
      products: products.filter(p => p.collection === "Ocean 8 V4")
    },
  ];

  const installations = [
    { 
      id: "adhesive", 
      name: { ar: "لاصق", en: "Adhesive" },
      description: { ar: "تركيب ثابت ومتين باستخدام مواد لاصقة خاصة", en: "Permanent and durable installation using special adhesives" },
      image: installationImages.adhesive
    },
    { 
      id: "floating", 
      name: { ar: "تركيب Floating Floor", en: "Floating Floor" },
      description: { ar: "تركيب عائم بدون حاجة لللصق", en: "Floating installation without adhesive" },
      advantages: [
        { 
          title: { ar: "تركيب سريع", en: "Quick Installation" },
          description: { ar: "يمكن تركيبه في وقت قياسي", en: "Can be installed in record time" }
        },
        { 
          title: { ar: "قابل للفك وإعادة التركيب", en: "Removable & Reinstallable" },
          description: { ar: "مرونة في تغيير المكان", en: "Flexibility to change location" }
        }
      ],
      image: installationImages.floating
    },
    { 
      id: "heated", 
      name: { ar: "قابل للتدفئة", en: "Heated Floor Compatible" },
      description: { ar: "مناسب لأنظمة التدفئة الأرضية", en: "Suitable for underfloor heating systems" },
      advantages: [
        { 
          title: { ar: "توزيع متساوٍ للحرارة", en: "Even Heat Distribution" },
          description: { ar: "ينشر الحرارة بانتظام في جميع أنحاء الغرفة", en: "Spreads heat evenly throughout the room" }
        },
        { 
          title: { ar: "توفير في الطاقة", en: "Energy Efficient" },
          description: { ar: "كفاءة حرارية عالية تقلل استهلاك الطاقة", en: "High thermal efficiency reduces energy consumption" }
        },
        { 
          title: { ar: "راحة في الشتاء", en: "Winter Comfort" },
          description: { ar: "أرضية دافئة تزيد الشعور بالراحة", en: "Warm floor increases comfort" }
        }
      ],
      image: installationImages.heated
    }
  ];

  const getMainImage = () => {
    return parquetTypeImages[selectedType] || "/images/default.jpg";
  };

  // مكون عرض المنتج مع الصورة
  const ProductCard = ({ product, onClick }) => {
    const [imageError, setImageError] = useState(false);
    const colorClass = getProductColor(product.name);
    
    return (
      <motion.div
        whileHover={{ y: -5 }}
        onClick={onClick}
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
      >
        <div className="h-48 overflow-hidden relative">
          {!imageError ? (
            <img 
              src={product.images?.main || getProductImagePath(product.sku, product.collection)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${colorClass} relative flex items-center justify-center`}>
              <span className="text-white text-6xl opacity-30 group-hover:scale-110 transition-transform duration-500">🪵</span>
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
            </div>
          )}
          
          {/* Badge للمجموعة */}
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-[#a58d7b]">
            {product.collection}
          </div>
        </div>
        
        <div className="p-6">
          <h4 className="font-medium text-lg text-[#4a3f36] mb-2 group-hover:text-[#a58d7b] transition-colors line-clamp-2">
            {product.name}
          </h4>
          <div className="flex justify-between items-center">
            <span className="text-sm font-mono text-gray-400">{product.sku}</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
              {product.type}
            </span>
          </div>
          
          {/* إظهار المواصفات المختصرة إذا وجدت */}
          {product.specifications && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs text-gray-500">
              {product.specifications.thickness && (
                <div>
                  <span className="block text-gray-400">{language === 'ar' ? 'سمك' : 'Thick'}:</span>
                  <span>{product.specifications.thickness[language]}</span>
                </div>
              )}
              {product.specifications.wearLayer && (
                <div>
                  <span className="block text-gray-400">{language === 'ar' ? 'طبقة' : 'Wear'}:</span>
                  <span>{product.specifications.wearLayer[language]}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // نوافذ المنتجات المحسنة
  const ProductModal = ({ product, onClose }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [imageError, setImageError] = useState(false);
    
    if (!product) return null;
    
    const images = product.images?.gallery || [product.images?.main];
    const colorClass = getProductColor(product.name);
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors shadow-lg"
          >
            ✕
          </button>
          
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* قسم الصور */}
            <div className="space-y-4">
              <div className="h-80 rounded-xl overflow-hidden bg-gray-100">
                {!imageError ? (
                  <img 
                    src={images[currentImage] || product.images?.main}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
                    <span className="text-white text-8xl opacity-50">🪵</span>
                  </div>
                )}
              </div>
              
              {/* مصغرات الصور */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        currentImage === idx ? 'border-[#a58d7b]' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name} - ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* تفاصيل المنتج */}
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-light text-[#4a3f36] mb-2">{product.name}</h3>
                <p className="text-sm text-[#a58d7b]">{product.collection}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-4 py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500 w-24">{t.sku[language]}:</span>
                  <span className="font-mono text-[#a58d7b] font-medium">{product.sku}</span>
                </div>
                
                <div className="flex items-center gap-4 py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500 w-24">{t.type[language]}:</span>
                  <span className="text-gray-800">{product.type}</span>
                </div>
              </div>
              
              {/* المواصفات الفنية */}
              {product.specifications && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="text-sm font-medium text-[#4a3f36] mb-3">
                    {language === 'ar' ? 'المواصفات الفنية' : 'Technical Specifications'}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="block text-gray-500">
                          {key === 'thickness' ? (language === 'ar' ? 'السمك' : 'Thickness') :
                           key === 'width' ? (language === 'ar' ? 'العرض' : 'Width') :
                           key === 'length' ? (language === 'ar' ? 'الطول' : 'Length') :
                           key === 'wearLayer' ? (language === 'ar' ? 'طبقة التآكل' : 'Wear Layer') :
                           key}
                        </span>
                        <span className="font-medium text-[#4a3f36]">{value[language]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* الميزات */}
              <div className="bg-[#f6f4f1] p-4 rounded-xl">
                <h4 className="text-sm font-medium text-[#4a3f36] mb-3">
                  {language === 'ar' ? 'الميزات' : 'Features'}
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#a58d7b] rounded-full"></span>
                    {language === 'ar' ? 'مقاوم للخدوش والبقع' : 'Scratch and stain resistant'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#a58d7b] rounded-full"></span>
                    {language === 'ar' ? 'سهل التنظيف والصيانة' : 'Easy to clean and maintain'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#a58d7b] rounded-full"></span>
                    {language === 'ar' ? 'مناسب للتدفئة الأرضية' : 'Suitable for underfloor heating'}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#a58d7b] rounded-full"></span>
                    {language === 'ar' ? 'ضمان 15 سنة' : '15-year warranty'}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

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

      {/* ===== القسم الرئيسي مع LayoutID ===== */}
      <div className="flex flex-col lg:flex-row items-start gap-12 mt-16 mb-20">
        {/* الصورة الرئيسية مع layoutId */}
        <motion.div layoutId="parquet-container" className="relative w-full lg:w-1/2">
          <motion.img
            layoutId="parquet-image"
            src={getMainImage()}
            className="w-full h-[500px] object-cover rounded-2xl shadow-2xl"
            alt="Parquet Collection"
            transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          />
          <motion.div 
            layoutId="parquet-label"
            className="absolute -bottom-4 -right-4 bg-[#a58d7b] text-white px-6 py-2 rounded-full text-sm tracking-widest shadow-xl"
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {language === 'ar' ? 'الباركيت' : 'PARQUET'}
          </motion.div>
        </motion.div>

        {/* النص التعريفي */}
        <motion.div
          initial={{ opacity: 0, x: language === 'ar' ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full lg:w-1/2"
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#4a3f36] tracking-wider mb-6">
            {t.pageTitle[language]}
          </h2>
          
          {/* معلومات إضافية عن الباركيت */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/80">
            <h3 className="text-sm tracking-widest text-[#4a3f36] font-medium mb-4 border-b border-[#d6ccc2] pb-2">
              {language === 'ar' ? 'معلومات سريعة عن الباركيت' : 'Quick Facts about Parquet'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#a58d7b] rounded-full"></div>
                <span className="text-sm text-[#6b5b4e]">
                  {language === 'ar' ? 'متوفر بسماكات مختلفة: 10-15 مم للطبيعي، 6-12 مم لللامينت' : 'Available in different thicknesses: 10-15mm for natural, 6-12mm for laminate'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#a58d7b] rounded-full"></div>
                <span className="text-sm text-[#6b5b4e]">
                  {language === 'ar' ? 'أكثر من 30 لون وتصميم متوفر' : 'More than 30 colors and designs available'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#a58d7b] rounded-full"></div>
                <span className="text-sm text-[#6b5b4e]">
                  {language === 'ar' ? 'مجموعتان رئيسيتان: Ocean 8 XL و Ocean 8 V4' : 'Two main collections: Ocean 8 XL and Ocean 8 V4'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Parquet Types */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-20"
      >
        <h3 className="text-3xl font-light text-[#4a3f36] mb-10 text-center">{t.parquetTypes[language]}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {parquetTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedType(type.id)}
              className={`cursor-pointer rounded-2xl transition-all duration-300 overflow-hidden bg-white ${
                selectedType === type.id 
                  ? 'shadow-2xl ring-2 ring-[#a58d7b]' 
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="h-56 overflow-hidden">
                <img 
                  src={type.image} 
                  alt={type.name[language]}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-8">
                <h4 className="font-medium text-2xl mb-3 text-[#a58d7b]">{type.name[language]}</h4>
                <p className="text-sm text-gray-600 mb-4">{type.description[language]}</p>
                <div className="space-y-4">
                  {type.features.map((feature, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-3 last:border-0">
                      <h5 className="font-medium text-sm text-gray-800 mb-1">{feature.title[language]}</h5>
                      <p className="text-xs text-gray-500">{feature.description[language]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Patterns */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-20"
      >
        <h3 className="text-3xl font-light text-[#4a3f36] mb-10 text-center">{t.patterns[language]}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {patterns.map((pattern, index) => (
            <motion.div
              key={pattern.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedPattern(pattern.id)}
              className={`cursor-pointer rounded-2xl transition-all duration-300 overflow-hidden ${
                selectedPattern === pattern.id 
                  ? 'shadow-2xl ring-2 ring-[#a58d7b]' 
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={pattern.image} 
                  alt={pattern.name[language]}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-8 bg-white">
                <h4 className="font-medium text-2xl mb-3 text-[#a58d7b]">{pattern.name[language]}</h4>
                <p className="text-sm text-gray-600 mb-3">{pattern.description[language]}</p>
                <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">{pattern.details[language]}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Collections & Products - القسم الجديد */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-20"
      >
        <h3 className="text-3xl font-light text-[#4a3f36] mb-10 text-center">{t.collections[language]}</h3>
        
        {/* أزرار المجموعات */}
        <div className="flex justify-center gap-4 mb-12">
          {collections.map((collection) => (
            <motion.button
              key={collection.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCollection(collection.id)}
              className={`px-8 py-3 rounded-full text-lg transition-all duration-300 ${
                selectedCollection === collection.id
                  ? 'bg-[#a58d7b] text-white shadow-lg'
                  : 'bg-white text-[#4a3f36] hover:bg-gray-50 shadow-md'
              }`}
            >
              {collection.name}
            </motion.button>
          ))}
        </div>

        {/* عرض المجموعة المحددة */}
        {collections.map((collection) => (
          selectedCollection === collection.id && (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-8">
                <p className="text-[#6b5b4e] text-lg mb-4">{collection.description[language]}</p>
                <div className="inline-block bg-[#a58d7b]/10 px-6 py-2 rounded-full">
                  <span className="text-[#a58d7b] font-medium">
                    {collection.products.length} {language === 'ar' ? 'منتج' : 'Products'}
                  </span>
                </div>
              </div>

              {/* شبكة المنتجات مع الصور */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collection.products.map((product, index) => (
                  <ProductCard 
                    key={product.sku}
                    product={product}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            </motion.div>
          )
        ))}
      </motion.div>

      {/* Installation Methods */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-16"
      >
        <h3 className="text-3xl font-light text-[#4a3f36] mb-10 text-center">{t.installation[language]}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {installations.map((install, index) => (
            <motion.div
              key={install.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedInstallation(install.id)}
              className={`cursor-pointer rounded-2xl transition-all duration-300 overflow-hidden ${
                selectedInstallation === install.id 
                  ? 'shadow-2xl ring-2 ring-[#a58d7b]' 
                  : 'shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={install.image} 
                  alt={install.name[language]}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6 bg-white">
                <h4 className="font-medium text-xl mb-2 text-[#a58d7b]">{install.name[language]}</h4>
                <p className="text-sm text-gray-600 mb-4">{install.description[language]}</p>
                {install.advantages && (
                  <div className="mt-4 space-y-2">
                    {install.advantages.map((adv, idx) => (
                      <div key={idx} className="text-xs text-gray-500">
                        • {adv.title[language]}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal for product details */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />
    </motion.div>
  );
}