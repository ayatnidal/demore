import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function GranitePage() {
  const [selectedCategory, setSelectedCategory] = useState("white");
  const [selectedColor, setSelectedColor] = useState(null);
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

  const graniteCategories = {
    white: {
      title: { en: "White & Light Granite", ar: "الجرانيت الأبيض والفاتح" },
      description: { 
        en: "Light colors with light gray or black waves — gives a sense of spaciousness and cleanliness", 
        ar: "ألوان فاتحة بتموجات رمادية أو سوداء خفيفة — تعطي إحساس بالاتساع والنظافة" 
      },
      
      colors: [
        { 
          name: { en: "Kashmir White", ar: "كشمير وايت" },
          image: "/images/kashmir-white.jpg",
          details: {
            origin: { en: "India", ar: "الهند" },
            finish: { en: "Polished - Matte", ar: "مصقول - مات" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "Very High", ar: "عالي جداً" },
            description: { 
              en: "Kashmir White granite features a creamy white background with soft gray waves, adding a sense of luxury and spaciousness to areas.", 
              ar: "جرانيت كشمير وايت يتميز بخلفية بيضاء كريمية مع تموجات رمادية ناعمة، يضفي إحساساً بالفخامة والاتساع على المساحات." 
            },
            images: [
              "/images/kashmir-white-detail1.jpg",
              "/images/kashmir-white-detail2.jpg",
            ]
          }
        },
        { 
          name: { en: "Alaska White", ar: "ألاسكا وايت" },
          image: "/images/alaska-white.jpg",
          details: {
            origin: { en: "Brazil", ar: "البرازيل" },
            finish: { en: "Polished", ar: "مصقول" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "High", ar: "عالي" },
            description: { 
              en: "Snow-white background with light gray and blue veins, adding a modern and elegant touch to kitchens.", 
              ar: "خلفية بيضاء ثلجية مع عروق رمادية وزرقاء خفيفة، يضفي لمسة عصرية وأنيقة على المطابخ." 
            },
            images: [
              "/images/alaska-white-detail1.jpg",
              "/images/alaska-white-detail2.jpg",
            ]
          }
        },
        { 
          name: { en: "River White", ar: "ريفر وايت" },
          image: "/images/river-white.jpg",
          details: {
            origin: { en: "India", ar: "الهند" },
            finish: { en: "Polished", ar: "مصقول" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "Very High", ar: "عالي جداً" },
            description: { 
              en: "White with gray waves resembling a river flow, adding movement and natural beauty to surfaces.", 
              ar: "أبيض مع تموجات رمادية تشبه جريان النهر، يضيف حركة وجمالية طبيعية للأسطح." 
            },
            images: [
              "/images/river-white-detail1.jpg",
              "/images/river-white-detail2.jpg",
            ]
          }
        },
        { 
          name: { en: "Colonial White", ar: "كولونيال وايت" },
          image: "/images/colonial-white.jpg",
          details: {
            origin: { en: "India", ar: "الهند" },
            finish: { en: "Polished - Matte", ar: "مصقول - مات" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "High", ar: "عالي" },
            description: { 
              en: "Warm white with brown and gray spots, suitable for classic and contemporary designs.", 
              ar: "أبيض دافئ مع بقع بنية ورمادية، مناسب للتصاميم الكلاسيكية والمعاصرة." 
            },
            images: [
              "/images/colonial-white-detail1.jpg",
              "/images/colonial-white-detail2.jpg",
            ]
          }
        }
      ]
    },
    grey: {
      title: { en: "Grey Granite", ar: "الجرانيت الرمادي" },
      description: { 
        en: "Modern gray shades with various patterns — ideal for modern and industrial designs", 
        ar: "درجات رمادية عصرية بأنماط متنوعة — مثالية للتصاميم الحديثة والصناعية" 
      },
      colors: [
        { 
          name: { en: "Luna Pearl", ar: "لونا بيرل" },
          image: "/images/luna-pearl.jpg",
          details: {
            origin: { en: "India", ar: "الهند" },
            finish: { en: "Polished - Matte", ar: "مصقول - مات" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "High", ar: "عالي" },
            description: { 
              en: "Beige-gray with small black dots – a balanced and practical color for residential projects and apartments.", 
              ar: "رمادي مائل للبيج بنقاط سوداء صغيرة – لون متوازن وعملي للمشاريع السكنية والشقق." 
            },
            images: [
              "/images/luna-pearl-detail1.jpg",
              "/images/luna-pearl-detail2.jpg",
            ]
          }
        },
        { 
          name: { en: "Viscount White", ar: "فايكونت وايت" },
          image: "/images/viscount-white.jpg",
          details: {
            origin: { en: "Brazil", ar: "البرازيل" },
            finish: { en: "Polished", ar: "مصقول" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "Very High", ar: "عالي جداً" },
            description: { 
              en: "Gray with clear black lines – gives movement and distinctive shape for modern kitchens and islands.", 
              ar: "رمادي بخطوط سوداء واضحة – يعطي حركة وشكل مميز للمطابخ المودرن والجزر." 
            },
            images: [
              "/images/viscount-white-detail1.jpg",
              "/images/viscount-white-detail2.jpg",
            ]
          }
        },
        { 
          name: { en: "Grey Concrete", ar: "جراي كونكريت" },
          image: "/images/grey-concrete.jpg",
          details: {
            origin: { en: "India", ar: "الهند" },
            finish: { en: "Matte - Polished", ar: "مات - مصقول" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "High", ar: "عالي" },
            description: { 
              en: "Concrete-like appearance – very modern and suitable for industrial designs and modern kitchens.", 
              ar: "مظهر يشبه الخرسانة – عصري جداً ومناسب للتصاميم الصناعية والمطابخ الحديثة." 
            },
            images: [
              "/images/grey-concrete-detail1.jpg",
              "/images/grey-concrete-detail2.jpg",
            ]
          }
        },
        { 
          name: { en: "Steel Grey", ar: "ستيل جراي" },
          image: "/images/steel-grey.jpg",
          details: {
            origin: { en: "India", ar: "الهند" },
            finish: { en: "Polished", ar: "مصقول" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "High", ar: "عالي" },
            description: { 
              en: "Uniform steel gray with soft shine, giving a modern and clean look to spaces.", 
              ar: "رمادي فولاذي موحد مع لمعة ناعمة، يعطي مظهراً عصرياً ونظيفاً للمساحات." 
            },
            images: [
              "/images/steel-grey-detail1.jpg",
              "/images/steel-grey-detail2.jpg",
            ]
          }
        }
      ]
    },
    black: {
      title: { en: "Black Granite", ar: "الجرانيت الأسود" },
      description: { 
        en: "Luxurious granite with deep shine — gives a classic or sophisticated modern character", 
        ar: "جرانيت فاخر بلمعة عميقة — يعطي طابع كلاسيكي أو مودرن راقٍ" 
      },
      colors: [
        { 
          name: { en: "Absolute Black", ar: "ابسولوت بلاك" },
          image: "/images/absolute-black.jpg",
          details: {
            origin: { en: "India", ar: "الهند" },
            finish: { en: "Polished - Matte", ar: "مصقول - مات" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "Very High", ar: "عالي جداً" },
            description: { 
              en: "Pure black without impurities, reflects light beautifully when polished, adds absolute luxury to spaces.", 
              ar: "أسود خالص بدون شوائب، يعكس الضوء بشكل رائع عند الصقل، يضفي فخامة مطلقة على المساحات." 
            },
            images: [
              "/images/absolute-black-detail1.jpg",
              "/images/absolute-black-detail2.jpg",
            ]
          }
        },
        { 
          name: { en: "Black Galaxy", ar: "بلاك جالاكسي" },
          image: "/images/black-galaxy.jpg",
          details: {
            origin: { en: "India", ar: "الهند" },
            finish: { en: "Polished", ar: "مصقول" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "High", ar: "عالي" },
            description: { 
              en: "Deep black with shiny gold and silver spots resembling a galaxy, adds a magical and unique touch.", 
              ar: "أسود عميق مع بقع ذهبية وفضية لامعة تشبه المجرة، يضيف لمسة سحرية وفريدة." 
            },
            images: [
              "/images/black-galaxy-detail1.jpg",
              "/images/black-galaxy-detail2.jpg",
            ]
          }
        },
        { 
          name: { en: "Zimbabwe Black", ar: "زيمبابوي بلاك" },
          image: "/images/zimbabwe-black.jpg",
          details: {
            origin: { en: "Zimbabwe", ar: "زيمبابوي" },
            finish: { en: "Polished", ar: "مصقول" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "Very High", ar: "عالي جداً" },
            description: { 
              en: "Dark black with fine natural crystals, considered one of the finest types of black granite.", 
              ar: "أسود داكن مع بلورات طبيعية دقيقة، يعتبر من أفخر أنواع الجرانيت الأسود." 
            },
            images: [
              "/images/zimbabwe-black-detail1.jpg",
              "/images/zimbabwe-black-detail2.jpg",
            ]
          }
        },
        { 
          name: { en: "Cosmic Black", ar: "كوزميك بلاك" },
          image: "/images/cosmic-black.jpg",
          details: {
            origin: { en: "India", ar: "الهند" },
            finish: { en: "Polished", ar: "مصقول" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "High", ar: "عالي" },
            description: { 
              en: "Black with soft silver and gold waves, combining elegance and modernity.", 
              ar: "أسود مع تموجات فضية وذهبية ناعمة، يجمع بين الأناقة والعصرية." 
            },
            images: [
              "/images/cosmic-black-detail1.jpg",
              "/images/cosmic-black-detail2.jpg",
            ]
          }
        }
      ]
    },
    brown: {
      title: { en: "Brown & Gold Granite", ar: "الجرانيت البني والذهبي" },
      description: { 
        en: "Warm brown and gold shades — suitable for classic and wooden designs", 
        ar: "درجات بنية وذهبية دافئة — مناسبة للتصاميم الكلاسيكية والخشبية" 
      },
      colors: [
        { 
          name: { en: "Tan Brown", ar: "تان براون" },
          image: "/images/tan-brown.jpg",
          details: {
            origin: { en: "India", ar: "الهند" },
            finish: { en: "Polished", ar: "مصقول" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "Very High", ar: "عالي جداً" },
            description: { 
              en: "Dark brown with black and gold waves, adds warmth and luxury to spaces.", 
              ar: "بني غامق مع تموجات سوداء وذهبية، يضفي دفئاً وفخامة على المساحات." 
            },
            images: [
              "/images/tan-brown-detail1.jpg",
              "/images/tan-brown-detail2.jpg",
            ]
          }
        },
        { 
          name: { en: "Coffee Brown", ar: "كافيه براون" },
          image: "/images/coffee-brown.jpg",
          details: {
            origin: { en: "India", ar: "الهند" },
            finish: { en: "Polished - Matte", ar: "مصقول - مات" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "High", ar: "عالي" },
            description: { 
              en: "Dark brown with natural patterns, perfect for classic and warm designs.", 
              ar: "بني داكن بنقوش طبيعية، مثالي للتصاميم الكلاسيكية والدافئة." 
            },
            images: [
              "/images/coffee-brown-detail1.jpg",
              "/images/coffee-brown-detail2.jpg",
            ]
          }
        },
        { 
          name: { en: "Giallo Ornamental", ar: "جيالو أورنامنتال" },
          image: "/images/giallo-ornamental.jpg",
          details: {
            origin: { en: "Brazil", ar: "البرازيل" },
            finish: { en: "Polished", ar: "مصقول" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "High", ar: "عالي" },
            description: { 
              en: "Golden with brown and black waves, adds brightness and vitality to spaces.", 
              ar: "ذهبي مع تموجات بنية وسوداء، يضفي إشراقاً وحيوية على المساحات." 
            },
            images: [
              "/images/giallo-ornamental-detail1.jpg",
              "/images/giallo-ornamental-detail2.jpg",
            ]
          }
        },
        { 
          name: { en: "Golden Persa", ar: "جولدن بيرسا" },
          image: "/images/golden-persa.jpg",
          details: {
            origin: { en: "Iran", ar: "إيران" },
            finish: { en: "Polished", ar: "مصقول" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "High", ar: "عالي" },
            description: { 
              en: "Golden beige with brown veins, adds a warm and elegant touch.", 
              ar: "بيج ذهبي مع عروق بنية، يضفي لمسة دافئة وأنيقة." 
            },
            images: [
              "/images/golden-persa-detail1.jpg",
              "/images/golden-persa-detail2.jpg",
            ]
          }
        }
      ]
    },
    red: {
      title: { en: "Red Granite", ar: "الجرانيت الأحمر" },
      description: { 
        en: "Bold and distinctive colors that give a strong presence in spaces", 
        ar: "ألوان جريئة ومميزة تعطي حضور قوي في المساحات" 
      },
      colors: [
        { 
          name: { en: "Red Multicolor", ar: "ريد ملتي كولور" },
          image: "/images/red-multicolor.jpg",
          details: {
            origin: { en: "India", ar: "الهند" },
            finish: { en: "Polished", ar: "مصقول" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "Very High", ar: "عالي جداً" },
            description: { 
              en: "Dark red with black and white waves, adds a bold and luxurious character.", 
              ar: "أحمر غامق مع تموجات سوداء وبيضاء، يضفي طابعاً جريئاً وفخماً." 
            },
            images: [
              "/images/red-multicolor-detail1.jpg",
              "/images/red-multicolor-detail2.jpg",
            ]
          }
        },
        { 
          name: { en: "Ruby Red", ar: "روبي ريد" },
          image: "/images/ruby-red.jpg",
          details: {
            origin: { en: "India", ar: "الهند" },
            finish: { en: "Polished", ar: "مصقول" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "High", ar: "عالي" },
            description: { 
              en: "Deep ruby red with natural crystals, luxurious and attractive.", 
              ar: "أحمر ياقوتي عميق مع بلورات طبيعية، فخم وجذاب." 
            },
            images: [
              "/images/ruby-red-detail1.jpg",
              "/images/ruby-red-detail2.jpg",
            ]
          }
        }
      ]
    },
    green: {
      title: { en: "Green Granite", ar: "الجرانيت الأخضر" },
      description: { 
        en: "Elegant and unique natural green waves", 
        ar: "تموجات خضراء طبيعية أنيقة وفريدة" 
      },
      colors: [
        { 
          name: { en: "Green Galaxy", ar: "جرين جالاكسي" },
          image: "/images/green-galaxy.jpg",
          details: {
            origin: { en: "India", ar: "الهند" },
            finish: { en: "Polished", ar: "مصقول" },
            thickness: { en: "2cm, 3cm", ar: "2 سم، 3 سم" },
            durability: { en: "High", ar: "عالي" },
            description: { 
              en: "Dark green with shiny gold and silver spots, enchanting and unique.", 
              ar: "أخضر غامق مع بقع ذهبية وفضية لامعة، ساحر وفريد." 
            },
            images: [
              "/images/green-galaxy-detail1.jpg",
              "/images/green-galaxy-detail2.jpg",
            ]
          }
        }
      ]
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const categoryButtonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    active: {
      scale: 1.05,
      backgroundColor: "#2c2c2c",
      color: "#ffffff",
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <>
      <motion.div 
        dir="rtl"
        className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#e8e4dd] p-8 md:p-20 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
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

        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            className="mb-16 text-center mt-16"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-light tracking-widest mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
              {language === 'ar' ? 'مجموعة الجرانيت' : 'Granite Collection'}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {language === 'ar' 
                ? 'جرانيت طبيعي عالي المتانة للمطابخ، الأرضيات، الدرج والواجهات'
                : 'Premium natural stone for kitchens, flooring, stairs and facades'}
            </p>
          </motion.div>

          {/* Category Navigation */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {Object.entries(graniteCategories).map(([key, category]) => (
              <motion.button
                key={key}
                variants={categoryButtonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                animate={selectedCategory === key ? "active" : "initial"}
                onClick={() => setSelectedCategory(key)}
                className={`px-8 py-4 rounded-full text-lg font-medium transition-all ${
                  selectedCategory === key 
                    ? "bg-gray-900 text-white shadow-2xl" 
                    : "bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-white/80"
                }`}
              >
                {language === 'ar' ? category.title.ar : category.title.en}
              </motion.button>
            ))}
          </motion.div>

          {/* Selected Category Content */}
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <motion.h2 
                className="text-4xl md:text-5xl font-light mb-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {language === 'ar' 
                  ? graniteCategories[selectedCategory].title.ar 
                  : graniteCategories[selectedCategory].title.en}
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {language === 'ar' 
                  ? graniteCategories[selectedCategory].description.ar 
                  : graniteCategories[selectedCategory].description.en}
              </motion.p>
              
            </div>

            {/* Colors Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {graniteCategories[selectedCategory].colors.map((color, index) => (
                <motion.div
                  key={color.name.en}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedColor(color)}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl mb-4 aspect-square">
                    {/* Image */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-110 transition-transform duration-700">
                      <img 
                        src={color.image} 
                        alt={language === 'ar' ? color.name.ar : color.name.en}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://via.placeholder.com/600x600/cccccc/969696?text=${language === 'ar' ? color.name.ar.replace(' ', '+') : color.name.en.replace(' ', '+')}`;
                        }}
                      />
                    </div>
                    
                    {/* Overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                      initial={false}
                    >
                      <div className="text-center">
                        <span className="text-white text-lg font-light block mb-2">
                          {language === 'ar' ? 'اضغط للمزيد' : 'Click for more'}
                        </span>
                        <span className="text-white/80 text-sm">
                          {language === 'ar' ? 'عرض التفاصيل' : 'View details'}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                  
                  <motion.h3 
                    className="text-xl font-light text-center text-gray-800 group-hover:text-gray-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    {language === 'ar' ? color.name.ar : color.name.en}
                  </motion.h3>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Modal for Color Details */}
      <AnimatePresence>
        {selectedColor && (
          <>
            {/* Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setSelectedColor(null)}
              className="fixed inset-0 bg-black/70 z-50"
            />

            {/* Modal */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-4 md:inset-10 z-50 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="min-h-full flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden">
                  {/* Close Button */}
                  <div className="flex justify-start p-4">
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedColor(null)}
                      className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                    >
                      <span className="text-2xl">×</span>
                    </motion.button>
                  </div>

                  {/* Modal Content */}
                  <div className="px-4 md:px-8 pb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left Side - Images */}
                      <div>
                        {/* Main Image */}
                        <motion.div 
                          className="rounded-2xl overflow-hidden shadow-xl mb-4 aspect-video"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <img 
                            src={selectedColor.image} 
                            alt={language === 'ar' ? selectedColor.name.ar : selectedColor.name.en}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>

                        {/* Thumbnail Images */}
                        <div className="grid grid-cols-3 gap-4">
                          {selectedColor.details.images.map((img, index) => (
                            <motion.div
                              key={index}
                              className="rounded-lg overflow-hidden shadow-md aspect-square cursor-pointer"
                              whileHover={{ scale: 1.05, y: -5 }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                            >
                              <img 
                                src={img} 
                                alt={`${language === 'ar' ? selectedColor.name.ar : selectedColor.name.en} detail ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://via.placeholder.com/200x200/cccccc/969696?text=Detail+${index + 1}`;
                                }}
                              />
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Right Side - Details */}
                      <motion.div 
                        className="space-y-6"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h2 className="text-4xl font-light text-gray-800 text-right">
                          {language === 'ar' ? selectedColor.name.ar : selectedColor.name.en}
                        </h2>

                        <p className="text-gray-600 leading-relaxed text-lg text-right">
                          {language === 'ar' 
                            ? selectedColor.details.description.ar 
                            : selectedColor.details.description.en}
                        </p>

                        {/* Specifications Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <motion.div 
                            className="bg-gray-50 p-4 rounded-xl"
                            whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
                          >
                            <h4 className="text-sm text-gray-500 mb-1 text-right">
                              {language === 'ar' ? 'المنشأ' : 'Origin'}
                            </h4>
                            <p className="text-lg font-medium text-gray-800 text-right">
                              {language === 'ar' 
                                ? selectedColor.details.origin.ar 
                                : selectedColor.details.origin.en}
                            </p>
                          </motion.div>

                          <motion.div 
                            className="bg-gray-50 p-4 rounded-xl"
                            whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
                          >
                            <h4 className="text-sm text-gray-500 mb-1 text-right">
                              {language === 'ar' ? 'التشطيب' : 'Finish'}
                            </h4>
                            <p className="text-lg font-medium text-gray-800 text-right">
                              {language === 'ar' 
                                ? selectedColor.details.finish.ar 
                                : selectedColor.details.finish.en}
                            </p>
                          </motion.div>

                          <motion.div 
                            className="bg-gray-50 p-4 rounded-xl"
                            whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
                          >
                            <h4 className="text-sm text-gray-500 mb-1 text-right">
                              {language === 'ar' ? 'السماكة' : 'Thickness'}
                            </h4>
                            <p className="text-lg font-medium text-gray-800 text-right">
                              {language === 'ar' 
                                ? selectedColor.details.thickness.ar 
                                : selectedColor.details.thickness.en}
                            </p>
                          </motion.div>

                          <motion.div 
                            className="bg-gray-50 p-4 rounded-xl"
                            whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
                          >
                            <h4 className="text-sm text-gray-500 mb-1 text-right">
                              {language === 'ar' ? 'الصلابة' : 'Durability'}
                            </h4>
                            <p className="text-lg font-medium text-gray-800 text-right">
                              {language === 'ar' 
                                ? selectedColor.details.durability.ar 
                                : selectedColor.details.durability.en}
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}