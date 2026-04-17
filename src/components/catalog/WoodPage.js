import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function WoodPage() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedColorFamily, setSelectedColorFamily] = useState("all");
  const [selectedFormicaType, setSelectedFormicaType] = useState("all");
  const [selectedFormicaColor, setSelectedFormicaColor] = useState(null);
  const [selectedStainType, setSelectedStainType] = useState("all");
  const [showFormicaModal, setShowFormicaModal] = useState(false);
  const { language } = useLanguage();
  
  // References for scrolling
  const colorsSectionRef = useRef(null);
  const productsSectionRef = useRef(null);
  const formicaSectionRef = useRef(null);
  const stainsSectionRef = useRef(null);

  const woodTypes = [
    { id: "sandwich", nameEn: "Sandwich Panel", nameAr: "ساندوتش بانل" },
    { id: "mdf", nameEn: "Standard MDF", nameAr: "MDF عادي" },
    { id: "green-mdf", nameEn: "Green MDF (Moisture Resistant)", nameAr: "MDF أخضر (مقاوم للرطوبة)" }
  ];

  // أنواع الشلايف
  const stainTypes = [
    { 
      id: "water-based", 
      nameEn: "Water Based Stain", 
      nameAr: "شلايف مائي",
      featuresEn: [
        "Light odor",
        "Dries quickly",
        "Environmentally friendly",
        "Suitable for interior use",
        "Natural and soft colors"
      ],
      featuresAr: [
        "رائحة خفيفة",
        "يجف بسرعة",
        "صديق للبيئة",
        "مناسب للأعمال الداخلية",
        "ألوانه طبيعية وناعمة"
      ],
      descriptionEn: "Water-based wood stain with natural finish",
      descriptionAr: "شلايف خشب مائي بتشطيب طبيعي",
      usageEn: "Indoor furniture, decorative pieces, interior woodwork",
      usageAr: "أثاث داخلي، قطع ديكورية، أعمال خشبية داخلية"
    },
    { 
      id: "oil-based", 
      nameEn: "Oil Based Stain", 
      nameAr: "شلايف زيتي",
      featuresEn: [
        "Deeper penetration into wood",
        "Gives darker and richer colors",
        "Higher moisture resistance",
        "Longer drying time",
        "Durable finish"
      ],
      featuresAr: [
        "تغلغل أعمق داخل الخشب",
        "يعطي ألوان أغمق وأغنى",
        "مقاومة أعلى للرطوبة",
        "وقت جفاف أطول",
        "تشطيب متين"
      ],
      descriptionEn: "Oil-based wood stain for deep penetration and rich colors",
      descriptionAr: "شلايف خشب زيتي لتغلغل عميق وألوان غنية",
      usageEn: "Doors, windows, kitchens, exterior woodwork, high-moisture areas",
      usageAr: "أبواب، شبابيك، مطابخ، أعمال خشبية خارجية، أماكن عالية الرطوبة"
    }
  ];

  // ألوان الشلايف
  const stainColors = [
    // ألوان الشلايف المائي
    {
      id: "water-light-oak",
      code: "WS101",
      nameEn: "Light Oak",
      nameAr: "بلوط فاتح",
      descriptionEn: "Natural light oak stain - water based",
      descriptionAr: "شلايف بلوط فاتح طبيعي - مائي",
      type: "water-based",
      class: "bg-[#e5d3b5]",
      colorCode: "#e5d3b5",
      hex: "#e5d3b5",
      coverage: "12-14 m²/liter",
      dryingTime: "2-4 hours",
      application: "Brush, roller, or spray"
    },
    {
      id: "water-walnut",
      code: "WS102",
      nameEn: "Natural Walnut",
      nameAr: "جوز طبيعي",
      descriptionEn: "Classic walnut stain - water based",
      descriptionAr: "شلايف جوز كلاسيكي - مائي",
      type: "water-based",
      class: "bg-[#4a3320]",
      colorCode: "#4a3320",
      hex: "#4a3320",
      coverage: "12-14 m²/liter",
      dryingTime: "2-4 hours",
      application: "Brush, roller, or spray"
    },
    {
      id: "water-honey",
      code: "WS103",
      nameEn: "Honey Pine",
      nameAr: "صنوبر عسلي",
      descriptionEn: "Warm honey color - water based",
      descriptionAr: "شلايف عسلي دافئ - مائي",
      type: "water-based",
      class: "bg-[#c88a3d]",
      colorCode: "#c88a3d",
      hex: "#c88a3d",
      coverage: "12-14 m²/liter",
      dryingTime: "2-4 hours",
      application: "Brush, roller, or spray"
    },
    {
      id: "water-maple",
      code: "WS104",
      nameEn: "Soft Maple",
      nameAr: "ميبل ناعم",
      descriptionEn: "Light maple stain - water based",
      descriptionAr: "شلايف ميبل فاتح - مائي",
      type: "water-based",
      class: "bg-[#f0d8b0]",
      colorCode: "#f0d8b0",
      hex: "#f0d8b0",
      coverage: "12-14 m²/liter",
      dryingTime: "2-4 hours",
      application: "Brush, roller, or spray"
    },
    {
      id: "water-cherry",
      code: "WS105",
      nameEn: "Light Cherry",
      nameAr: "كرز فاتح",
      descriptionEn: "Reddish cherry stain - water based",
      descriptionAr: "شلايف كرز مائل للأحمر - مائي",
      type: "water-based",
      class: "bg-[#b85e4c]",
      colorCode: "#b85e4c",
      hex: "#b85e4c",
      coverage: "12-14 m²/liter",
      dryingTime: "2-4 hours",
      application: "Brush, roller, or spray"
    },
    {
      id: "water-teak",
      code: "WS106",
      nameEn: "Natural Teak",
      nameAr: "ساج طبيعي",
      descriptionEn: "Medium teak stain - water based",
      descriptionAr: "شلايف ساج متوسط - مائي",
      type: "water-based",
      class: "bg-[#9f6e4c]",
      colorCode: "#9f6e4c",
      hex: "#9f6e4c",
      coverage: "12-14 m²/liter",
      dryingTime: "2-4 hours",
      application: "Brush, roller, or spray"
    },

    // ألوان الشلايف الزيتي
    {
      id: "oil-dark-walnut",
      code: "OS201",
      nameEn: "Dark Walnut",
      nameAr: "جوز داكن",
      descriptionEn: "Rich dark walnut stain - oil based",
      descriptionAr: "شلايف جوز داكن غني - زيتي",
      type: "oil-based",
      class: "bg-[#2c1e10]",
      colorCode: "#2c1e10",
      hex: "#2c1e10",
      coverage: "10-12 m²/liter",
      dryingTime: "8-12 hours",
      application: "Brush or cloth"
    },
    {
      id: "oil-espresso",
      code: "OS202",
      nameEn: "Espresso",
      nameAr: "إسبريسو",
      descriptionEn: "Deep espresso brown - oil based",
      descriptionAr: "شلايف إسبريسو بني غامق - زيتي",
      type: "oil-based",
      class: "bg-[#1a120b]",
      colorCode: "#1a120b",
      hex: "#1a120b",
      coverage: "10-12 m²/liter",
      dryingTime: "8-12 hours",
      application: "Brush or cloth"
    },
    {
      id: "oil-mahogany",
      code: "OS203",
      nameEn: "Mahogany",
      nameAr: "ماهوجني",
      descriptionEn: "Rich red-brown mahogany - oil based",
      descriptionAr: "شلايف ماهوجني بني محمر - زيتي",
      type: "oil-based",
      class: "bg-[#6b2e1e]",
      colorCode: "#6b2e1e",
      hex: "#6b2e1e",
      coverage: "10-12 m²/liter",
      dryingTime: "8-12 hours",
      application: "Brush or cloth"
    },
    {
      id: "oil-teak",
      code: "OS204",
      nameEn: "Golden Teak",
      nameAr: "ساج ذهبي",
      descriptionEn: "Rich golden teak - oil based",
      descriptionAr: "شلايف ساج ذهبي غني - زيتي",
      type: "oil-based",
      class: "bg-[#8b5a2b]",
      colorCode: "#8b5a2b",
      hex: "#8b5a2b",
      coverage: "10-12 m²/liter",
      dryingTime: "8-12 hours",
      application: "Brush or cloth"
    },
    {
      id: "oil-ebony",
      code: "OS205",
      nameEn: "Ebony Black",
      nameAr: "أبنوس أسود",
      descriptionEn: "Deep black ebony - oil based",
      descriptionAr: "شلايف أبنوس أسود عميق - زيتي",
      type: "oil-based",
      class: "bg-[#1a1a1a]",
      colorCode: "#1a1a1a",
      hex: "#1a1a1a",
      coverage: "10-12 m²/liter",
      dryingTime: "8-12 hours",
      application: "Brush or cloth"
    },
    {
      id: "oil-cherry",
      code: "OS206",
      nameEn: "Dark Cherry",
      nameAr: "كرز غامق",
      descriptionEn: "Rich dark cherry - oil based",
      descriptionAr: "شلايف كرز غامق غني - زيتي",
      type: "oil-based",
      class: "bg-[#8b3a2b]",
      colorCode: "#8b3a2b",
      hex: "#8b3a2b",
      coverage: "10-12 m²/liter",
      dryingTime: "8-12 hours",
      application: "Brush or cloth"
    }
  ];

  // أنواع الفورمايكا
  const formicaTypes = [
    { 
      id: "wood", 
      nameEn: "Wood Look", 
      nameAr: "شكل خشب",
      descriptionEn: "Mimics natural wood - less expensive than real wood",
      descriptionAr: "تحاكي الخشب الطبيعي - أقل تكلفة من الخشب الحقيقي",
      usageEn: "Kitchen doors, wardrobes, interior doors, desks",
      usageAr: "أبواب مطابخ، خزائن ملابس، أبواب داخلية، مكاتب"
    },
    { 
      id: "solid", 
      nameEn: "Solid Colors", 
      nameAr: "سادة",
      descriptionEn: "Uniform colors without veins - perfect for modern kitchens",
      descriptionAr: "ألوان موحدة بدون عروق - مناسبة للمطابخ المودرن",
      usageEn: "Modern kitchens, contemporary cabinets, office desks",
      usageAr: "مطابخ مودرن، خزائن عصرية، مكاتب تجارية"
    },
    { 
      id: "stone", 
      nameEn: "Stone/Marble Look", 
      nameAr: "شكل حجر/رخام",
      descriptionEn: "Mimics marble or stone - gives luxury at a lower price",
      descriptionAr: "تحاكي الرخام أو الحجر - تعطي فخامة بسعر أقل",
      usageEn: "Kitchen fronts, wall backgrounds, decorative surfaces",
      usageAr: "واجهات مطابخ، خلفيات جدران، أسطح ديكورية"
    }
  ];

  // عائلات الألوان الرئيسية (للأخشاب العادية فقط)
  const colorFamilies = [
    { id: "dark", nameEn: "Dark & Classic", nameAr: "داكنة وكلاسيكية", descriptionEn: "Luxurious dark colors", descriptionAr: "ألوان غامقة فاخرة" },
    { id: "warm", nameEn: "Warm", nameAr: "دافئة", descriptionEn: "Warm natural colors", descriptionAr: "ألوان طبيعية دافئة" },
    { id: "light", nameEn: "Light & Modern", nameAr: "فاتحة وعصرية", descriptionEn: "Light modern colors", descriptionAr: "ألوان مودرن فاتحة" }
  ];

  // ألوان الأخشاب العادية (ساندوتش و MDF عادي)
  const woodColors = [
    // Dark & Classic Tones
    { 
      id: "dark-walnut", 
      code: "1D22",
      nameEn: "Dark Walnut", 
      nameAr: "جوز داكن",
      descriptionEn: "Luxurious classic dark brown",
      descriptionAr: "بني غامق كلاسيكي فاخر",
      family: "dark",
      class: "bg-[#3a2819]", 
      colorCode: "#3a2819",
      image: "/images/colors/dark-walnut.jpg",
      detailImage: "/images/colors/dark-walnut-detail.jpg",
      hex: "#3a2819",
      rgb: "58,40,25",
      availableIn: ["sandwich", "mdf"]
    },
    { 
      id: "espresso", 
      code: "1D23",
      nameEn: "Espresso Brown", 
      nameAr: "بني إسبريسو",
      descriptionEn: "Dark brown with a touch of luxury",
      descriptionAr: "بني داكن بلمسة فخامة",
      family: "dark",
      class: "bg-[#2c1e10]", 
      colorCode: "#2c1e10",
      image: "/images/colors/espresso.jpg",
      detailImage: "/images/colors/espresso-detail.jpg",
      hex: "#2c1e10",
      rgb: "44,30,16",
      availableIn: ["sandwich", "mdf"]
    },
    { 
      id: "classic-walnut", 
      code: "1D24",
      nameEn: "Classic Walnut", 
      nameAr: "جوز كلاسيكي",
      descriptionEn: "Medium dark warm brown",
      descriptionAr: "بني دافئ متوسط الغمق",
      family: "dark",
      class: "bg-[#4a3320]", 
      colorCode: "#4a3320",
      image: "/images/colors/classic-walnut.jpg",
      detailImage: "/images/colors/classic-walnut-detail.jpg",
      hex: "#4a3320",
      rgb: "74,51,32",
      availableIn: ["sandwich", "mdf"]
    },
    { 
      id: "dark-chestnut", 
      code: "1D20",
      nameEn: "Dark Chestnut", 
      nameAr: "كستنائي غامق",
      descriptionEn: "Reddish brown",
      descriptionAr: "بني مائل للأحمر",
      family: "dark",
      class: "bg-[#5a3e2b]", 
      colorCode: "#5a3e2b",
      image: "/images/colors/dark-chestnut.jpg",
      detailImage: "/images/colors/dark-chestnut-detail.jpg",
      hex: "#5a3e2b",
      rgb: "90,62,43",
      availableIn: ["mdf"]
    },
    { 
      id: "mocha", 
      code: "1D21",
      nameEn: "Mocha Brown", 
      nameAr: "بني موكا",
      descriptionEn: "Modern dark brown",
      descriptionAr: "بني غامق عصري",
      family: "dark",
      class: "bg-[#4f3a2a]", 
      colorCode: "#4f3a2a",
      image: "/images/colors/mocha.jpg",
      detailImage: "/images/colors/mocha-detail.jpg",
      hex: "#4f3a2a",
      rgb: "79,58,42",
      availableIn: ["sandwich", "mdf"]
    },

    // Warm Wood Tones
    { 
      id: "honey-oak", 
      code: "1D16",
      nameEn: "Honey Oak", 
      nameAr: "بلوط عسلي",
      descriptionEn: "Warm and bright color",
      descriptionAr: "لون دافئ ومشرق",
      family: "warm",
      class: "bg-[#c88a3d]", 
      colorCode: "#c88a3d",
      image: "/images/colors/honey-oak.jpg",
      detailImage: "/images/colors/honey-oak-detail.jpg",
      hex: "#c88a3d",
      rgb: "200,138,61",
      availableIn: ["sandwich", "mdf"]
    },
    { 
      id: "golden-oak", 
      code: "1D17",
      nameEn: "Golden Oak", 
      nameAr: "بلوط ذهبي",
      descriptionEn: "Classic and comfortable for eyes",
      descriptionAr: "كلاسيكي مريح للعين",
      family: "warm",
      class: "bg-[#b77f3c]", 
      colorCode: "#b77f3c",
      image: "/images/colors/golden-oak.jpg",
      detailImage: "/images/colors/golden-oak-detail.jpg",
      hex: "#b77f3c",
      rgb: "183,127,60",
      availableIn: ["sandwich", "mdf"]
    },
    { 
      id: "warm-maple", 
      code: "1D18",
      nameEn: "Warm Maple", 
      nameAr: "ميبل دافئ",
      descriptionEn: "Soft natural color",
      descriptionAr: "لون طبيعي ناعم",
      family: "warm",
      class: "bg-[#b77a4a]", 
      colorCode: "#b77a4a",
      image: "/images/colors/warm-maple.jpg",
      detailImage: "/images/colors/warm-maple-detail.jpg",
      hex: "#b77a4a",
      rgb: "183,122,74",
      availableIn: ["mdf"]
    },
    { 
      id: "amber", 
      code: "1D19",
      nameEn: "Amber Wood", 
      nameAr: "خشب كهرماني",
      descriptionEn: "Warm brown with golden touch",
      descriptionAr: "بني دافئ بلمسة ذهبية",
      family: "warm",
      class: "bg-[#c69c6d]", 
      colorCode: "#c69c6d",
      image: "/images/colors/amber.jpg",
      detailImage: "/images/colors/amber-detail.jpg",
      hex: "#c69c6d",
      rgb: "198,156,109",
      availableIn: ["sandwich", "mdf"]
    },
    { 
      id: "light-cherry", 
      code: "1D14",
      nameEn: "Light Cherry", 
      nameAr: "كرز فاتح",
      descriptionEn: "Reddish brown",
      descriptionAr: "بني مائل للأحمر",
      family: "warm",
      class: "bg-[#b85e4c]", 
      colorCode: "#b85e4c",
      image: "/images/colors/light-cherry.jpg",
      detailImage: "/images/colors/light-cherry-detail.jpg",
      hex: "#b85e4c",
      rgb: "184,94,76",
      availableIn: ["mdf"]
    },
    { 
      id: "natural-teak", 
      code: "1D15",
      nameEn: "Natural Teak", 
      nameAr: "ساج طبيعي",
      descriptionEn: "Medium natural brown",
      descriptionAr: "بني متوسط طبيعي",
      family: "warm",
      class: "bg-[#9f6e4c]", 
      colorCode: "#9f6e4c",
      image: "/images/colors/natural-teak.jpg",
      detailImage: "/images/colors/natural-teak-detail.jpg",
      hex: "#9f6e4c",
      rgb: "159,110,76",
      availableIn: ["sandwich", "mdf"]
    },

    // Light & Modern Tones
    { 
      id: "cream-maple", 
      code: "1D10",
      nameEn: "Cream Maple", 
      nameAr: "ميبل كريمي",
      descriptionEn: "Very light and modern",
      descriptionAr: "فاتح جداً وعصري",
      family: "light",
      class: "bg-[#f5e6d3]", 
      colorCode: "#f5e6d3",
      image: "/images/colors/cream-maple.jpg",
      detailImage: "/images/colors/cream-maple-detail.jpg",
      hex: "#f5e6d3",
      rgb: "245,230,211",
      availableIn: ["mdf"]
    },
    { 
      id: "light-oak", 
      code: "1D11",
      nameEn: "Light Oak", 
      nameAr: "بلوط فاتح",
      descriptionEn: "Calm natural color",
      descriptionAr: "طبيعي هادئ",
      family: "light",
      class: "bg-[#e5d3b5]", 
      colorCode: "#e5d3b5",
      image: "/images/colors/light-oak.jpg",
      detailImage: "/images/colors/light-oak-detail.jpg",
      hex: "#e5d3b5",
      rgb: "229,211,181",
      availableIn: ["sandwich", "mdf"]
    },
    { 
      id: "natural-oak", 
      code: "1D12",
      nameEn: "Natural Oak", 
      nameAr: "بلوط طبيعي",
      descriptionEn: "Classic neutral",
      descriptionAr: "كلاسيكي محايد",
      family: "light",
      class: "bg-[#d9b382]", 
      colorCode: "#d9b382",
      image: "/images/colors/natural-oak.jpg",
      detailImage: "/images/colors/natural-oak-detail.jpg",
      hex: "#d9b382",
      rgb: "217,179,130",
      availableIn: ["sandwich", "mdf"]
    },
    { 
      id: "soft-oak", 
      code: "1D13",
      nameEn: "Soft Oak", 
      nameAr: "بلوط ناعم",
      descriptionEn: "Light warm color",
      descriptionAr: "دافئ فاتح",
      family: "light",
      class: "bg-[#e3c9a5]", 
      colorCode: "#e3c9a5",
      image: "/images/colors/soft-oak.jpg",
      detailImage: "/images/colors/soft-oak-detail.jpg",
      hex: "#e3c9a5",
      rgb: "227,201,165",
      availableIn: ["mdf"]
    },
    { 
      id: "beige-wood", 
      code: "1D25",
      nameEn: "Beige Wood", 
      nameAr: "خشب بيج",
      descriptionEn: "Modern light color",
      descriptionAr: "فاتح مودرن",
      family: "light",
      class: "bg-[#e8d9c5]", 
      colorCode: "#e8d9c5",
      image: "/images/colors/beige-wood.jpg",
      detailImage: "/images/colors/beige-wood-detail.jpg",
      hex: "#e8d9c5",
      rgb: "232,217,197",
      availableIn: ["sandwich", "mdf"]
    },
    { 
      id: "greige-oak", 
      code: "1D26",
      nameEn: "Greige Oak", 
      nameAr: "بلوط رمادي فاتح",
      descriptionEn: "Modern neutral color",
      descriptionAr: "مودرن محايد",
      family: "light",
      class: "bg-[#c9c0b3]", 
      colorCode: "#c9c0b3",
      image: "/images/colors/greige-oak.jpg",
      detailImage: "/images/colors/greige-oak-detail.jpg",
      hex: "#c9c0b3",
      rgb: "201,192,179",
      availableIn: ["mdf"]
    },
    { 
      id: "white-oak", 
      code: "1D27",
      nameEn: "White Oak", 
      nameAr: "بلوط أبيض",
      descriptionEn: "Elegant very light color",
      descriptionAr: "فاتح جداً أنيق",
      family: "light",
      class: "bg-[#f8f4ed]", 
      colorCode: "#f8f4ed",
      image: "/images/colors/white-oak.jpg",
      detailImage: "/images/colors/white-oak-detail.jpg",
      hex: "#f8f4ed",
      rgb: "248,244,237",
      availableIn: ["sandwich", "mdf"]
    }
  ];

  // ألوان MDF الأخضر
  const greenMDFColors = [
    {
      id: "light-green",
      code: "G001",
      nameEn: "Light Green",
      nameAr: "أخضر فاتح",
      descriptionEn: "Light green suitable for interior spaces",
      descriptionAr: "أخضر فاتح مناسب للأماكن الداخلية",
      class: "bg-green-300",
      colorCode: "#86efac",
      image: "/images/colors/light-green-mdf.jpg",
      detailImage: "/images/colors/light-green-mdf-detail.jpg",
      hex: "#86efac",
      rgb: "134,239,172"
    },
    {
      id: "forest-green",
      code: "G002",
      nameEn: "Forest Green",
      nameAr: "أخضر غابي",
      descriptionEn: "Modern dark green",
      descriptionAr: "أخضر داكن عصري",
      class: "bg-green-700",
      colorCode: "#15803d",
      image: "/images/colors/forest-green-mdf.jpg",
      detailImage: "/images/colors/forest-green-mdf-detail.jpg",
      hex: "#15803d",
      rgb: "21,128,61"
    },
    {
      id: "olive-green",
      code: "G003",
      nameEn: "Olive Green",
      nameAr: "أخضر زيتوني",
      descriptionEn: "Natural olive color",
      descriptionAr: "لون زيتوني طبيعي",
      class: "bg-green-600",
      colorCode: "#16a34a",
      image: "/images/colors/olive-green-mdf.jpg",
      detailImage: "/images/colors/olive-green-mdf-detail.jpg",
      hex: "#16a34a",
      rgb: "22,163,74"
    },
    {
      id: "mint-green",
      code: "G004",
      nameEn: "Mint Green",
      nameAr: "أخضر نعناعي",
      descriptionEn: "Fresh light green",
      descriptionAr: "أخضر فاتح منعش",
      class: "bg-green-200",
      colorCode: "#bbf7d0",
      image: "/images/colors/mint-green-mdf.jpg",
      detailImage: "/images/colors/mint-green-mdf-detail.jpg",
      hex: "#bbf7d0",
      rgb: "187,247,208"
    }
  ];

  // ألوان الفورمايكا
  const formicaColors = [
    // فورمايكا شكل خشب
    {
      id: "formica-light-oak",
      code: "F101",
      nameEn: "Light Oak",
      nameAr: "بلوط فاتح",
      descriptionEn: "Formica that mimics light oak wood",
      descriptionAr: "فورمايكا تحاكي خشب البلوط الفاتح",
      type: "wood",
      class: "bg-[#e5d3b5]",
      colorCode: "#e5d3b5",
      image: "/images/formica/light-oak.jpg",
      detailImage: "/images/light-oak-detail.jpg",
      hex: "#e5d3b5",
      finishEn: "Matte",
      finishAr: "مطفي",
      usageEn: "Kitchen doors, cabinets",
      usageAr: "أبواب مطابخ، خزائن",
      featuresEn: ["Scratch resistant", "Easy to clean", "Stable colors"],
      featuresAr: ["مقاومة للخدش", "سهلة التنظيف", "ألوان ثابتة"]
    },
    {
      id: "formica-natural-maple",
      code: "F102",
      nameEn: "Natural Maple",
      nameAr: "ميبل طبيعي",
      descriptionEn: "Formica that mimics natural maple wood",
      descriptionAr: "فورمايكا تحاكي خشب الميبل الطبيعي",
      type: "wood",
      class: "bg-[#f0d8b0]",
      colorCode: "#f0d8b0",
      image: "/images/formica/natural-maple.jpg",
      detailImage: "/images/natural-maple-detail.jpg",
      hex: "#f0d8b0",
      finishEn: "Matte",
      finishAr: "مطفي",
      usageEn: "Kitchen doors, cabinets",
      usageAr: "أبواب مطابخ، خزائن",
      featuresEn: ["Scratch resistant", "Easy to clean", "Stable colors"],
      featuresAr: ["مقاومة للخدش", "سهلة التنظيف", "ألوان ثابتة"]
    },
    {
      id: "formica-walnut",
      code: "F103",
      nameEn: "Walnut",
      nameAr: "جوز",
      descriptionEn: "Formica that mimics classic walnut wood",
      descriptionAr: "فورمايكا تحاكي خشب الجوز الكلاسيكي",
      type: "wood",
      class: "bg-[#4a3320]",
      colorCode: "#4a3320",
      image: "/images/formica/walnut.jpg",
      detailImage: "/images/walnut-detail.jpg",
      hex: "#4a3320",
      finishEn: "Matte",
      finishAr: "مطفي",
      usageEn: "Kitchen doors, desks",
      usageAr: "أبواب مطابخ، مكاتب",
      featuresEn: ["Scratch resistant", "Easy to clean", "Stable colors"],
      featuresAr: ["مقاومة للخدش", "سهلة التنظيف", "ألوان ثابتة"]
    },
    {
      id: "formica-dark-espresso",
      code: "F104",
      nameEn: "Dark Espresso",
      nameAr: "إسبريسو داكن",
      descriptionEn: "Formica that mimics luxurious dark espresso wood",
      descriptionAr: "فورمايكا تحاكي خشب الإسبريسو الداكن الفاخر",
      type: "wood",
      class: "bg-[#2c1e10]",
      colorCode: "#2c1e10",
      image: "/images/formica/dark-espresso.jpg",
      detailImage: "/images/dark-espresso-detail.jpg",
      hex: "#2c1e10",
      finishEn: "Matte",
      finishAr: "مطفي",
      usageEn: "Interior doors, desks",
      usageAr: "أبواب داخلية، مكاتب",
      featuresEn: ["Scratch resistant", "Easy to clean", "Stable colors"],
      featuresAr: ["مقاومة للخدش", "سهلة التنظيف", "ألوان ثابتة"]
    },
    {
      id: "formica-teak",
      code: "F105",
      nameEn: "Teak Finish",
      nameAr: "ساج",
      descriptionEn: "Formica that mimics natural teak wood",
      descriptionAr: "فورمايكا تحاكي خشب الساج الطبيعي",
      type: "wood",
      class: "bg-[#9f6e4c]",
      colorCode: "#9f6e4c",
      image: "/images/formica/teak.jpg",
      detailImage: "/images/teak-detail.jpg",
      hex: "#9f6e4c",
      finishEn: "Matte",
      finishAr: "مطفي",
      usageEn: "Kitchen doors, cabinets",
      usageAr: "أبواب مطابخ، خزائن",
      featuresEn: ["Scratch resistant", "Easy to clean", "Stable colors"],
      featuresAr: ["مقاومة للخدش", "سهلة التنظيف", "ألوان ثابتة"]
    },

    // فورمايكا سادة
    {
      id: "formica-pure-white",
      code: "F201",
      nameEn: "Pure White",
      nameAr: "أبيض نقي",
      descriptionEn: "Solid color formica in pure white - available in matte or gloss",
      descriptionAr: "فورمايكا سادة باللون الأبيض النقي - متوفرة مطفي أو لامع",
      type: "solid",
      class: "bg-white",
      colorCode: "#ffffff",
      image: "/images/formica/pure-white.jpg",
      detailImage: "/images/pure-white-detail.jpg",
      hex: "#ffffff",
      finishEn: "Matte & Gloss",
      finishAr: "مطفي ولامع",
      usageEn: "Modern kitchens, contemporary cabinets",
      usageAr: "مطابخ مودرن، خزائن عصرية",
      featuresEn: ["Scratch resistant", "Easy to clean", "Stable colors"],
      featuresAr: ["مقاومة للخدش", "سهلة التنظيف", "ألوان ثابتة"]
    },
    {
      id: "formica-matte-black",
      code: "F202",
      nameEn: "Matte Black",
      nameAr: "أسود مطفي",
      descriptionEn: "Solid color formica in elegant matte black",
      descriptionAr: "فورمايكا سادة باللون الأسود المطفي الأنيق",
      type: "solid",
      class: "bg-gray-900",
      colorCode: "#111827",
      image: "/images/formica/matte-black.jpg",
      detailImage: "/images/matte-black-detail.jpg",
      hex: "#111827",
      finishEn: "Matte",
      finishAr: "مطفي",
      usageEn: "Modern kitchens, office desks",
      usageAr: "مطابخ مودرن، مكاتب تجارية",
      featuresEn: ["Scratch resistant", "Easy to clean", "Stable colors"],
      featuresAr: ["مقاومة للخدش", "سهلة التنظيف", "ألوان ثابتة"]
    },
    {
      id: "formica-light-grey",
      code: "F203",
      nameEn: "Light Grey",
      nameAr: "رمادي فاتح",
      descriptionEn: "Solid color formica in neutral light grey",
      descriptionAr: "فورمايكا سادة باللون الرمادي الفاتح المحايد",
      type: "solid",
      class: "bg-gray-300",
      colorCode: "#d1d5db",
      image: "/images/formica/light-grey.jpg",
      detailImage: "/images/light-grey-detail.jpg",
      hex: "#d1d5db",
      finishEn: "Matte & Gloss",
      finishAr: "مطفي ولامع",
      usageEn: "Modern kitchens, cabinets",
      usageAr: "مطابخ مودرن، خزائن",
      featuresEn: ["Scratch resistant", "Easy to clean", "Stable colors"],
      featuresAr: ["مقاومة للخدش", "سهلة التنظيف", "ألوان ثابتة"]
    },
    {
      id: "formica-beige",
      code: "F204",
      nameEn: "Beige",
      nameAr: "بيج",
      descriptionEn: "Solid color formica in warm beige",
      descriptionAr: "فورمايكا سادة باللون البيج الدافئ",
      type: "solid",
      class: "bg-[#f5f0e6]",
      colorCode: "#f5f0e6",
      image: "/images/formica/beige.jpg",
      detailImage: "/images/beige-detail.jpg",
      hex: "#f5f0e6",
      finishEn: "Matte",
      finishAr: "مطفي",
      usageEn: "Modern kitchens, cabinets",
      usageAr: "مطابخ مودرن، خزائن",
      featuresEn: ["Scratch resistant", "Easy to clean", "Stable colors"],
      featuresAr: ["مقاومة للخدش", "سهلة التنظيف", "ألوان ثابتة"]
    },
    {
      id: "formica-cream",
      code: "F205",
      nameEn: "Cream",
      nameAr: "كريمي",
      descriptionEn: "Solid color formica in soft cream",
      descriptionAr: "فورمايكا سادة باللون الكريمي الناعم",
      type: "solid",
      class: "bg-[#fef7e6]",
      colorCode: "#fef7e6",
      image: "/images/formica/cream.jpg",
      detailImage: "/images/cream-detail.jpg",
      hex: "#fef7e6",
      finishEn: "Matte & Gloss",
      finishAr: "مطفي ولامع",
      usageEn: "Modern kitchens, cabinets",
      usageAr: "مطابخ مودرن، خزائن",
      featuresEn: ["Scratch resistant", "Easy to clean", "Stable colors"],
      featuresAr: ["مقاومة للخدش", "سهلة التنظيف", "ألوان ثابتة"]
    },

    // فورمايكا شكل حجر/رخام
    {
      id: "formica-marble-white",
      code: "F301",
      nameEn: "Marble White",
      nameAr: "رخام أبيض",
      descriptionEn: "Formica that mimics classic white marble",
      descriptionAr: "فورمايكا تحاكي الرخام الأبيض الكلاسيكي",
      type: "stone",
      class: "bg-white bg-opacity-80",
      colorCode: "#ffffff",
      image: "/images/formica/marble-white.jpg",
      detailImage: "/images/marble-white-detail.jpg",
      hex: "#ffffff",
      patternEn: "Marble veins",
      patternAr: "عروق رخامية",
      usageEn: "Kitchen fronts, wall backgrounds",
      usageAr: "واجهات مطابخ، خلفيات جدران",
      featuresEn: ["Stain resistant", "Easy to clean", "Stable colors"],
      featuresAr: ["مقاومة للبقع", "سهلة التنظيف", "ألوان ثابتة"]
    },
    {
      id: "formica-grey-concrete",
      code: "F302",
      nameEn: "Grey Concrete",
      nameAr: "خرسانة رمادية",
      descriptionEn: "Formica that mimics modern concrete texture",
      descriptionAr: "فورمايكا تحاكي ملمس الخرسانة العصرية",
      type: "stone",
      class: "bg-gray-400",
      colorCode: "#9ca3af",
      image: "/images/formica/grey-concrete.jpg",
      detailImage: "/images/grey-concrete-detail.jpg",
      hex: "#9ca3af",
      patternEn: "Concrete texture",
      patternAr: "ملمس خرسانة",
      usageEn: "Decorative surfaces, wall backgrounds",
      usageAr: "أسطح ديكورية، خلفيات جدران",
      featuresEn: ["Stain resistant", "Easy to clean", "Stable colors"],
      featuresAr: ["مقاومة للبقع", "سهلة التنظيف", "ألوان ثابتة"]
    },
    {
      id: "formica-travertine",
      code: "F303",
      nameEn: "Travertine Look",
      nameAr: "ترافرتين",
      descriptionEn: "Formica that mimics natural travertine stone",
      descriptionAr: "فورمايكا تحاكي حجر الترافرتين الطبيعي",
      type: "stone",
      class: "bg-[#e3d6bc]",
      colorCode: "#e3d6bc",
      image: "/images/formica/travertine.jpg",
      detailImage: "/images/travertine-detail.jpg",
      hex: "#e3d6bc",
      patternEn: "Stone texture",
      patternAr: "ملمس حجري",
      usageEn: "Kitchen fronts, decorations",
      usageAr: "واجهات مطابخ، ديكورات",
      featuresEn: ["Stain resistant", "Easy to clean", "Stable colors"],
      featuresAr: ["مقاومة للبقع", "سهلة التنظيف", "ألوان ثابتة"]
    },
    {
      id: "formica-granite",
      code: "F304",
      nameEn: "Granite Effect",
      nameAr: "تأثير جرانيت",
      descriptionEn: "Formica that mimics natural granite rock",
      descriptionAr: "فورمايكا تحاكي صخرة الجرانيت الطبيعية",
      type: "stone",
      class: "bg-gray-600",
      colorCode: "#4b5563",
      image: "/images/formica/granite.jpg",
      detailImage: "/images/granite-detail.jpg",
      hex: "#4b5563",
      patternEn: "Granite effect",
      patternAr: "تأثير جرانيت",
      usageEn: "Kitchen surfaces, decorations",
      usageAr: "أسطح مطابخ، ديكورات",
      featuresEn: ["Stain resistant", "Easy to clean", "Stable colors"],
      featuresAr: ["مقاومة للبقع", "سهلة التنظيف", "ألوان ثابتة"]
    }
  ];

  const woodProducts = [
    {
      id: 1,
      nameEn: "Insulated Sandwich Panel",
      nameAr: "ساندوتش بانل عازل",
      type: "sandwich",
      colors: ["dark-walnut", "espresso", "classic-walnut", "mocha", "honey-oak", "golden-oak", "amber", "natural-teak", "light-oak", "natural-oak", "beige-wood", "white-oak"],
      featuresEn: [
        "Heat and sound insulated",
        "Lightweight and easy to install",
        "Moisture and weather resistant",
        "Available in different thicknesses"
      ],
      featuresAr: [
        "عازل للحرارة والصوت",
        "خفيف الوزن وسهل التركيب",
        "مقاوم للرطوبة والعوامل الجوية",
        "متوفر بسماكات مختلفة"
      ],
      specificationsEn: {
        thickness: "50 - 100 mm",
        size: "120×240 cm",
        core: "Polyurethane / Rock wool"
      },
      specificationsAr: {
        thickness: "50 - 100 مم",
        size: "120×240 سم",
        core: "بولي يوريثان / صوف صخري"
      },
      descriptionEn: "Multi-purpose insulated sandwich panel for buildings and cold rooms",
      descriptionAr: "لوح ساندوتش بانل عازل متعدد الاستخدامات للمباني والثلاجات",
      images: ["/images/sandwich-panel-1.jpg", "/images/sandwich-panel-2.jpg"]
    },
    {
      id: 2,
      nameEn: "Standard MDF",
      nameAr: "MDF عادي",
      type: "mdf",
      colors: ["dark-walnut", "espresso", "classic-walnut", "dark-chestnut", "mocha", "honey-oak", "golden-oak", "warm-maple", "amber", "light-cherry", "natural-teak", "cream-maple", "light-oak", "natural-oak", "soft-oak", "beige-wood", "greige-oak", "white-oak"],
      featuresEn: [
        "Smooth surface perfect for painting and finishing",
        "Resistant to warping and cracking",
        "Easy to carve and cut",
        "Used in furniture and decoration"
      ],
      featuresAr: [
        "سطح أملس مثالي للدهان والتشطيب",
        "مقاوم للالتواء والتشقق",
        "سهل النحت والقص",
        "يستخدم في الأثاث والديكور"
      ],
      specificationsEn: {
        thickness: "3 - 30 mm",
        size: "122×244 cm",
        density: "High density"
      },
      specificationsAr: {
        thickness: "3 - 30 مم",
        size: "122×244 سم",
        density: "عالية الكثافة"
      },
      descriptionEn: "High quality MDF board for decorative works and furniture",
      descriptionAr: "لوح MDF عالي الجودة للأعمال الديكورية والأثاث",
      images: ["/images/mdf-regular-1.jpg", "/images/mdf-regular-2.jpg"]
    },
    {
      id: 3,
      nameEn: "Green MDF (Moisture Resistant)",
      nameAr: "MDF أخضر مقاوم للرطوبة",
      type: "green-mdf",
      colors: ["light-green", "forest-green", "olive-green", "mint-green"],
      featuresEn: [
        "Moisture and mold resistant",
        "Treated with anti-fungal materials",
        "Perfect for kitchens and bathrooms",
        "Maintains shape in humid environments"
      ],
      featuresAr: [
        "مقاوم للرطوبة والعفن",
        "معالج بمواد مضادة للفطريات",
        "مثالي للمطابخ والحمامات",
        "يحافظ على شكله في البيئات الرطبة"
      ],
      specificationsEn: {
        thickness: "6 - 25 mm",
        size: "122×244 cm",
        density: "High density"
      },
      specificationsAr: {
        thickness: "6 - 25 مم",
        size: "122×244 سم",
        density: "عالية الكثافة"
      },
      descriptionEn: "Green MDF resistant to moisture and mold - ideal for kitchens and bathrooms",
      descriptionAr: "MDF أخضر مقاوم للرطوبة والعفن - مناسب للمطابخ والحمامات",
      images: ["/images/mdf-green-1.jpg", "/images/mdf-green-2.jpg"]
    }
  ];

  // فلترة المنتجات حسب النوع المحدد
  const filteredProducts = woodProducts.filter(product => {
    if (selectedType !== "all" && product.type !== selectedType) return false;
    return true;
  });

  // فلترة ألوان الفورمايكا حسب النوع المحدد
  const filteredFormicaColors = formicaColors.filter(color => {
    if (selectedFormicaType !== "all" && color.type !== selectedFormicaType) return false;
    return true;
  });

  // فلترة الألوان حسب الاختيارات
  const getFilteredColors = () => {
    // إذا كان النوع المحدد هو MDF أخضر، نعرض ألوان MDF الأخضر فقط
    if (selectedType === "green-mdf") {
      if (selectedColor !== "all") {
        return greenMDFColors.filter(color => color.id === selectedColor);
      }
      return greenMDFColors;
    }
    
    // للأخشاب العادية (ساندوتش و MDF عادي)
    let filtered = woodColors;
    
    // فلترة حسب نوع الخشب المحدد
    if (selectedType !== "all" && selectedType !== "green-mdf") {
      filtered = filtered.filter(color => color.availableIn.includes(selectedType));
    }
    
    // فلترة حسب عائلة اللون المحددة
    if (selectedColorFamily !== "all") {
      filtered = filtered.filter(color => color.family === selectedColorFamily);
    }
    
    // فلترة حسب اللون المحدد
    if (selectedColor !== "all") {
      filtered = filtered.filter(color => color.id === selectedColor);
    }
    
    return filtered;
  };

  const filteredColors = getFilteredColors();

  
  const scrollToProducts = (typeId) => {
    setSelectedType(typeId);
    setTimeout(() => {
      productsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const scrollToFormica = (typeId) => {
    setSelectedFormicaType(typeId);
    setTimeout(() => {
      formicaSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const scrollToStains = (typeId) => {
    setSelectedStainType(typeId);
    setTimeout(() => {
      stainsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const showAllColors = () => {
    setSelectedColor("all");
    setSelectedColorFamily("all");
  };

  const showColorFamily = (familyId) => {
    setSelectedColorFamily(familyId);
    setSelectedColor("all");
  };

  // دالة عرض تفاصيل الفورمايكا
  const openFormicaDetail = (color) => {
    setSelectedFormicaColor(color);
    setShowFormicaModal(true);
  };

  const closeFormicaDetail = () => {
    setShowFormicaModal(false);
    setSelectedFormicaColor(null);
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#f6f4f1]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      dir="rtl"
    >
      {/* Header Section */}
      <div className="relative h-96 overflow-hidden">
        <motion.img
          layoutId="wood"
          src="/images/wood.jpg"
          className="w-full h-full object-cover"
          alt="Wood Collection"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <h1 className="text-6xl text-white font-light tracking-widest">
            {language === 'ar' ? 'مجموعة الأخشاب' : 'WOOD COLLECTION'}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        {/* أنواع الخشب */}
        <div className="mb-12" ref={productsSectionRef}>
          <h2 className="text-2xl font-light mb-6">{language === 'ar' ? 'أنواع الخشب' : 'Wood Types'}</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-8 py-3 rounded-full border transition-all text-lg ${
                selectedType === "all"
                  ? "bg-gray-800 text-white border-gray-800"
                  : "border-gray-300 hover:border-gray-800"
              }`}
            >
              {language === 'ar' ? 'الكل' : 'All'}
            </button>
            {woodTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => scrollToProducts(type.id)}
                className={`px-8 py-3 rounded-full border transition-all text-lg ${
                  selectedType === type.id
                    ? "bg-gray-800 text-white border-gray-800"
                    : "border-gray-300 hover:border-gray-800"
                }`}
              >
                {language === 'ar' ? type.nameAr : type.nameEn}
              </button>
            ))}
          </div>
        </div>

        {/* عرض منتجات الخشب */}
        <h2 className="text-3xl font-light mb-8">{language === 'ar' ? 'منتجات الخشب' : 'Wood Products'}</h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          layout
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
            >
              {/* معرض الصور */}
              <div className="relative h-64 bg-gray-100">
                <img
                  src={product.images[0]}
                  alt={language === 'ar' ? product.nameAr : product.nameEn}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300?text=Wood+Product";
                  }}
                />
                {product.type === "green-mdf" && (
                  <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    {language === 'ar' ? 'مقاوم للرطوبة' : 'Moisture Resistant'}
                  </span>
                )}
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-medium mb-2">{language === 'ar' ? product.nameAr : product.nameEn}</h3>
                  <p className="text-gray-600 text-sm">{language === 'ar' ? product.descriptionAr : product.descriptionEn}</p>
                </div>
                
                {/* المواصفات الفنية */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">{language === 'ar' ? 'المواصفات:' : 'Specifications:'}</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'السماكة:' : 'Thickness:'}</span>
                      <span className="font-medium">{language === 'ar' ? product.specificationsAr.thickness : product.specificationsEn.thickness}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === 'ar' ? 'المقاس:' : 'Size:'}</span>
                      <span className="font-medium">{language === 'ar' ? product.specificationsAr.size : product.specificationsEn.size}</span>
                    </div>
                    {product.specificationsAr.core && (
                      <div className="flex justify-between">
                        <span>{language === 'ar' ? 'اللب:' : 'Core:'}</span>
                        <span className="font-medium">{language === 'ar' ? product.specificationsAr.core : product.specificationsEn.core}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* الميزات */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 mb-2">{language === 'ar' ? 'الميزات:' : 'Features:'}</h4>
                  <ul className="space-y-1">
                    {(language === 'ar' ? product.featuresAr : product.featuresEn).map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="ml-2 text-gray-400">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* الألوان المتوفرة - تظهر فقط للأخشاب غير الخضراء */}
                {product.type !== "green-mdf" && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-700 mb-3 text-sm">{language === 'ar' ? 'الألوان المتوفرة:' : 'Available colors:'}</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((colorId) => {
                        const color = woodColors.find(c => c.id === colorId);
                        return color ? (
                          <div
                            key={colorId}
                            className="group relative focus:outline-none cursor-default"
                            title={language === 'ar' ? color.nameAr : color.nameEn}
                          >
                            <div 
                              className="w-10 h-10 rounded-full border-2 border-gray-200 hover:scale-110 transition-transform"
                              style={{ backgroundColor: color.colorCode }}
                            />
                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10">
                              <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                {language === 'ar' ? color.nameAr : color.nameEn} - {color.code}
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ألوان الأخشاب العادية */}
        {selectedType !== "green-mdf" && (
          <>
            <div className="mb-8" ref={colorsSectionRef}>
              <h2 className="text-2xl font-light mb-6">{language === 'ar' ? 'مجموعات الألوان' : 'Color Families'}</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={showAllColors}
                  className={`px-6 py-3 rounded-xl border transition-all ${
                    selectedColorFamily === "all" && selectedColor === "all"
                      ? "bg-gray-800 text-white border-gray-800"
                      : "border-gray-300 hover:border-gray-800"
                  }`}
                >
                  {language === 'ar' ? 'جميع الألوان' : 'All Colors'}
                </button>
                {colorFamilies.map((family) => (
                  <button
                    key={family.id}
                    onClick={() => showColorFamily(family.id)}
                    className={`px-6 py-3 rounded-xl border transition-all ${
                      selectedColorFamily === family.id && selectedColor === "all"
                        ? "bg-gray-800 text-white border-gray-800"
                        : "border-gray-300 hover:border-gray-800"
                    }`}
                  >
                    {language === 'ar' ? family.nameAr : family.nameEn}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-16">
              <h2 className="text-3xl font-light mb-8">{language === 'ar' ? 'الألوان والتشطيبات' : 'Colors & Finishes'}</h2>
              
              {filteredColors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredColors.map((color) => (
                    <motion.div
                      key={color.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-default"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={color.image}
                          alt={language === 'ar' ? color.nameAr : color.nameEn}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='${color.colorCode.replace('#', '%23')}'/%3E%3Ctext x='10' y='55' font-family='Arial' font-size='12' fill='white'%3E${color.code}%3C/text%3E%3C/svg%3E`;
                          }}
                        />
                        <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-mono">
                          {color.code}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-lg">{language === 'ar' ? color.nameAr : color.nameEn}</h4>
                            <p className="text-sm text-gray-500">{language === 'ar' ? color.nameAr : color.nameEn}</p>
                          </div>
                          <div 
                            className="w-8 h-8 rounded-full border-2 border-gray-200"
                            style={{ backgroundColor: color.colorCode }}
                          />
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">{language === 'ar' ? color.descriptionAr : color.descriptionEn}</p>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {color.availableIn.map(typeId => {
                            const type = woodTypes.find(t => t.id === typeId);
                            return type ? (
                              <span key={typeId} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                {language === 'ar' ? type.nameAr : type.nameEn}
                              </span>
                            ) : null;
                          })}
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                          <span>HEX: {color.hex}</span>
                          <span>RGB: {color.rgb}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 bg-white rounded-2xl"
                >
                  <p className="text-gray-500 text-lg">{language === 'ar' ? 'لا توجد ألوان تطابق الاختيار' : 'No colors match your selection'}</p>
                  <button
                    onClick={showAllColors}
                    className="mt-4 text-gray-600 underline hover:text-gray-800"
                  >
                    {language === 'ar' ? 'عرض جميع الألوان' : 'Show all colors'}
                  </button>
                </motion.div>
              )}
            </div>
          </>
        )}

        {/* ألوان MDF الأخضر */}
        {selectedType === "green-mdf" && (
          <div className="mb-16" ref={colorsSectionRef}>
            <h2 className="text-3xl font-light mb-8 text-green-700">{language === 'ar' ? 'ألوان MDF الأخضر' : 'Green MDF Colors'}</h2>
            <p className="text-gray-600 mb-4">{language === 'ar' ? 'ألوان خاصة بـ MDF الأخضر المقاوم للرطوبة' : 'Special colors for moisture-resistant Green MDF'}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {greenMDFColors.map((color) => (
                <motion.div
                  key={color.id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-default"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={color.image}
                      alt={language === 'ar' ? color.nameAr : color.nameEn}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='${color.colorCode.replace('#', '%23')}'/%3E%3Ctext x='10' y='55' font-family='Arial' font-size='12' fill='white'%3E${color.code}%3C/text%3E%3C/svg%3E`;
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-mono">
                      {color.code}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-lg">{language === 'ar' ? color.nameAr : color.nameEn}</h4>
                        <p className="text-sm text-gray-500">{language === 'ar' ? color.nameAr : color.nameEn}</p>
                      </div>
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-gray-200"
                        style={{ backgroundColor: color.colorCode }}
                      />
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{language === 'ar' ? color.descriptionAr : color.descriptionEn}</p>
                    
                    <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                      <span>HEX: {color.hex}</span>
                      <span>RGB: {color.rgb}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* قسم الشلايف */}
        <div className="mt-24 pt-12 border-t border-gray-300" ref={stainsSectionRef}>
          <h2 className="text-4xl font-light mb-4">{language === 'ar' ? 'شلايف الخشب' : 'Wood Stains'}</h2>
          <p className="text-gray-600 mb-8 text-lg">{language === 'ar' ? 'شلايف خشب عالية الجودة لتشطيبات مثالية' : 'High-quality wood stains for perfect finishes'}</p>

          {/* أنواع الشلايف */}
          <div className="mb-12">
            <h3 className="text-2xl font-light mb-6">{language === 'ar' ? 'أنواع الشلايف' : 'Stain Types'}</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedStainType("all")}
                className={`px-8 py-3 rounded-full border transition-all text-lg ${
                  selectedStainType === "all"
                    ? "bg-gray-800 text-white border-gray-800"
                    : "border-gray-300 hover:border-gray-800"
                }`}
              >
                {language === 'ar' ? 'الكل' : 'All'}
              </button>
              {stainTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => scrollToStains(type.id)}
                  className={`px-8 py-3 rounded-full border transition-all text-lg ${
                    selectedStainType === type.id
                      ? "bg-gray-800 text-white border-gray-800"
                      : "border-gray-300 hover:border-gray-800"
                  }`}
                >
                  {language === 'ar' ? type.nameAr : type.nameEn}
                </button>
              ))}
            </div>
          </div>

          {/* عرض أنواع الشلايف مع مميزاتها */}
          {selectedStainType === "all" ? (
            // عرض كل الأنواع
            stainTypes.map((type) => {
              const typeColors = stainColors.filter(c => c.type === type.id);
              return (
                <div key={type.id} className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-2xl font-light">{language === 'ar' ? type.nameAr : type.nameEn}</h3>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <p className="text-gray-700 mb-4">{language === 'ar' ? type.descriptionAr : type.descriptionEn}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">{language === 'ar' ? 'المميزات:' : 'Features:'}</h4>
                        <ul className="space-y-2">
                          {(language === 'ar' ? type.featuresAr : type.featuresEn).map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <span className="ml-2 text-green-500">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">{language === 'ar' ? 'الاستخدامات:' : 'Uses:'}</h4>
                        <p className="text-sm text-gray-600">{language === 'ar' ? type.usageAr : type.usageEn}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {typeColors.map((color) => (
                      <motion.div
                        key={color.id}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
                      >
                        <div className="relative h-40 overflow-hidden">
                          <div 
                            className="w-full h-full"
                            style={{ backgroundColor: color.colorCode }}
                          />
                          <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-mono">
                            {color.code}
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-lg">{language === 'ar' ? color.nameAr : color.nameEn}</h4>
                            </div>
                            <div 
                              className="w-6 h-6 rounded-full border-2 border-gray-200"
                              style={{ backgroundColor: color.colorCode }}
                            />
                          </div>
                        
                          
                          <div className="mt-2 text-xs text-gray-400">
                            <span>HEX: {color.hex}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // عرض نوع محدد
            <div>
              {stainTypes.filter(t => t.id === selectedStainType).map((type) => {
                const typeColors = stainColors.filter(c => c.type === type.id);
                return (
                  <div key={type.id} className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      <h3 className="text-2xl font-light">{language === 'ar' ? type.nameAr : type.nameEn}</h3>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <p className="text-gray-700 mb-4">{language === 'ar' ? type.descriptionAr : type.descriptionEn}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">{language === 'ar' ? 'المميزات:' : 'Features:'}</h4>
                          <ul className="space-y-2">
                            {(language === 'ar' ? type.featuresAr : type.featuresEn).map((feature, index) => (
                              <li key={index} className="flex items-center text-sm text-gray-600">
                                <span className="ml-2 text-green-500">✓</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">{language === 'ar' ? 'الاستخدامات:' : 'Uses:'}</h4>
                          <p className="text-sm text-gray-600">{language === 'ar' ? type.usageAr : type.usageEn}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {typeColors.map((color) => (
                        <motion.div
                          key={color.id}
                          whileHover={{ y: -4 }}
                          className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
                        >
                          <div className="relative h-40 overflow-hidden">
                            <div 
                              className="w-full h-full"
                              style={{ backgroundColor: color.colorCode }}
                            />
                            <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-mono">
                              {color.code}
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-bold text-lg">{language === 'ar' ? color.nameAr : color.nameEn}</h4>
                              </div>
                              <div 
                                className="w-6 h-6 rounded-full border-2 border-gray-200"
                                style={{ backgroundColor: color.colorCode }}
                              />
                            </div>
                                                        
                            <div className="mt-2 text-xs text-gray-400">
                              <span>HEX: {color.hex}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* قسم الفورمايكا */}
        <div className="mt-24 pt-12 border-t border-gray-300" ref={formicaSectionRef}>
          <h2 className="text-4xl font-light mb-4">{language === 'ar' ? 'فورمايكا' : 'Formica'}</h2>
          <p className="text-gray-600 mb-8 text-lg">{language === 'ar' ? 'ألواح فورمايكا عالية الجودة لمختلف الاستخدامات' : 'High-quality Formica sheets for various uses'}</p>

          {/* أنواع الفورمايكا */}
          <div className="mb-12">
            <h3 className="text-2xl font-light mb-6">{language === 'ar' ? 'أنواع الفورمايكا' : 'Formica Types'}</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedFormicaType("all")}
                className={`px-8 py-3 rounded-full border transition-all text-lg ${
                  selectedFormicaType === "all"
                    ? "bg-gray-800 text-white border-gray-800"
                    : "border-gray-300 hover:border-gray-800"
                }`}
              >
                {language === 'ar' ? 'الكل' : 'All'}
              </button>
              {formicaTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => scrollToFormica(type.id)}
                  className={`px-8 py-3 rounded-full border transition-all text-lg ${
                    selectedFormicaType === type.id
                      ? "bg-gray-800 text-white border-gray-800"
                      : "border-gray-300 hover:border-gray-800"
                  }`}
                >
                  {language === 'ar' ? type.nameAr : type.nameEn}
                </button>
              ))}
            </div>
          </div>

          {/* عرض ألوان الفورمايكا حسب النوع */}
          {selectedFormicaType === "all" ? (
            // عرض كل الأنواع
            formicaTypes.map((type) => {
              const typeColors = formicaColors.filter(c => c.type === type.id);
              return (
                <div key={type.id} className="mb-16">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-2xl font-light">{language === 'ar' ? type.nameAr : type.nameEn}</h3>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <p className="text-gray-700 mb-2">{language === 'ar' ? type.descriptionAr : type.descriptionEn}</p>
                    <p className="text-sm text-gray-500">{language === 'ar' ? `الاستخدامات: ${type.usageAr}` : `Uses: ${type.usageEn}`}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {typeColors.map((color) => (
                      <motion.div
                        key={color.id}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                        onClick={() => openFormicaDetail(color)}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={color.image}
                            alt={language === 'ar' ? color.nameAr : color.nameEn}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='${color.colorCode.replace('#', '%23')}'/%3E%3Ctext x='10' y='55' font-family='Arial' font-size='12' fill='white'%3E${color.code}%3C/text%3E%3C/svg%3E`;
                            }}
                          />
                          <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-mono">
                            {color.code}
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-lg">{language === 'ar' ? color.nameAr : color.nameEn}</h4>
                              <p className="text-sm text-gray-500">{language === 'ar' ? color.nameAr : color.nameEn}</p>
                            </div>
                            <div 
                              className="w-8 h-8 rounded-full border-2 border-gray-200"
                              style={{ backgroundColor: color.colorCode }}
                            />
                          </div>
                          
                          <p className="text-xs text-gray-400 mt-2">{language === 'ar' ? `الاستخدام: ${color.usageAr}` : `Use: ${color.usageEn}`}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // عرض نوع محدد
            <div>
              {formicaTypes.filter(t => t.id === selectedFormicaType).map((type) => (
                <div key={type.id} className="mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="text-2xl font-light">{language === 'ar' ? type.nameAr : type.nameEn}</h3>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <p className="text-gray-700 mb-2">{language === 'ar' ? type.descriptionAr : type.descriptionEn}</p>
                    <p className="text-sm text-gray-500">{language === 'ar' ? `الاستخدامات: ${type.usageAr}` : `Uses: ${type.usageEn}`}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredFormicaColors.map((color) => (
                      <motion.div
                        key={color.id}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer"
                        onClick={() => openFormicaDetail(color)}
                      >
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={color.image}
                            alt={language === 'ar' ? color.nameAr : color.nameEn}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='${color.colorCode.replace('#', '%23')}'/%3E%3Ctext x='10' y='55' font-family='Arial' font-size='12' fill='white'%3E${color.code}%3C/text%3E%3C/svg%3E`;
                            }}
                          />
                          <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-mono">
                            {color.code}
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-lg">{language === 'ar' ? color.nameAr : color.nameEn}</h4>
                              <p className="text-sm text-gray-500">{language === 'ar' ? color.nameAr : color.nameEn}</p>
                            </div>
                            <div 
                              className="w-8 h-8 rounded-full border-2 border-gray-200"
                              style={{ backgroundColor: color.colorCode }}
                            />
                          </div>
                
                          <p className="text-xs text-gray-400 mt-2">{language === 'ar' ? `الاستخدام: ${color.usageAr}` : `Use: ${color.usageEn}`}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* نافذة تفاصيل الفورمايكا */}
      {showFormicaModal && selectedFormicaColor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeFormicaDetail}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <button
                onClick={closeFormicaDetail}
                className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* صورة التفاصيل */}
              <div className="h-96 overflow-hidden">
                <img
                  src={selectedFormicaColor.detailImage}
                  alt={language === 'ar' ? selectedFormicaColor.nameAr : selectedFormicaColor.nameEn}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = selectedFormicaColor.image;
                  }}
                />
              </div>
              
              {/* معلومات التفاصيل */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-right">
                    <h2 className="text-3xl font-bold mb-2">{language === 'ar' ? selectedFormicaColor.nameAr : selectedFormicaColor.nameEn}</h2>
                    <p className="text-gray-500">{language === 'ar' ? selectedFormicaColor.nameAr : selectedFormicaColor.nameEn}</p>
                  </div>
                  <div className="text-left">
                    <span className="text-2xl font-mono bg-gray-100 px-4 py-2 rounded-lg">
                      {selectedFormicaColor.code}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 text-lg mb-6 text-right">
                  {language === 'ar' ? selectedFormicaColor.descriptionAr : selectedFormicaColor.descriptionEn}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  
                  {selectedFormicaColor.patternAr && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <span className="text-sm text-gray-500">{language === 'ar' ? 'النقشة' : 'Pattern'}</span>
                      <p className="font-medium text-lg">{language === 'ar' ? selectedFormicaColor.patternAr : selectedFormicaColor.patternEn}</p>
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3">{language === 'ar' ? 'الاستخدامات' : 'Uses'}</h3>
                  <p className="text-gray-700">{language === 'ar' ? selectedFormicaColor.usageAr : selectedFormicaColor.usageEn}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3">{language === 'ar' ? 'الميزات' : 'Features'}</h3>
                  <ul className="space-y-2">
                    {(language === 'ar' ? selectedFormicaColor.featuresAr : selectedFormicaColor.featuresEn).map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <span className="ml-2 text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex gap-2 items-center justify-start">
                  <div 
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: selectedFormicaColor.colorCode }}
                  />
                  <span className="text-gray-500">HEX: {selectedFormicaColor.hex}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}