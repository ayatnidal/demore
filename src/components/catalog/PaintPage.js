import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function PaintPage() {
  const [showUpArrow, setShowUpArrow] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
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

  // ========== جميع الألوان مجمعة حسب العائلة اللونية ==========
  const colorFamilies = [
    {
      id: "white",
      name: "White",
      arabicName: "الأبيض",
      standard: "RAL, NCS, Pantone, BS",
      colors: [
        // RAL Whites
        { name: "RAL 9001 - Cream", arabicName: "أبيض كريمي", hex: "#FDF4E3", finish: "ساتان", intensity: "دافئ", finishEn: "Satin", intensityEn: "Warm", standard: "RAL", code: "9001" },
        { name: "RAL 9002 - Gray White", arabicName: "أبيض رمادي", hex: "#E7EBDA", finish: "غير لامع", intensity: "فاتح", finishEn: "Matte", intensityEn: "Light", standard: "RAL", code: "9002" },
        { name: "RAL 9003 - Signal White", arabicName: "أبيض إشاري", hex: "#F4F8F4", finish: "لامع", intensity: "ناصع", finishEn: "Gloss", intensityEn: "Pure", standard: "RAL", code: "9003" },
        { name: "RAL 9010 - Pure White", arabicName: "أبيض نقي", hex: "#F7F9F5", finish: "غير لامع", intensity: "ناصع", finishEn: "Matte", intensityEn: "Pure", standard: "RAL", code: "9010" },
        { name: "RAL 9016 - Traffic White", arabicName: "أبيض مروري", hex: "#F6F8F4", finish: "لامع", intensity: "ناصع", finishEn: "Gloss", intensityEn: "Pure", standard: "RAL", code: "9016" },
        { name: "RAL 9018 - Papyrus White", arabicName: "أبيض بردي", hex: "#D7D9CB", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "RAL", code: "9018" },
        
        // NCS Whites
        { name: "NCS S 0500-N", arabicName: "أبيض", hex: "#F2F2F2", finish: "غير لامع", intensity: "ناصع", finishEn: "Matte", intensityEn: "Pure", standard: "NCS", code: "0500-N" },
        { name: "NCS S 1000-N", arabicName: "أبيض فاتح", hex: "#E5E5E5", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "NCS", code: "1000-N" },
        { name: "NCS S 1500-N", arabicName: "أبيض رمادي", hex: "#D9D9D9", finish: "غير لامع", intensity: "فاتح", finishEn: "Matte", intensityEn: "Light", standard: "NCS", code: "1500-N" },
        
        // Pantone Whites
        { name: "Pantone 11-0601 TCX", arabicName: "أبيض ناصع", hex: "#F5F5F5", finish: "لامع", intensity: "ناصع", finishEn: "Gloss", intensityEn: "Pure", standard: "Pantone", code: "11-0601" },
        { name: "Pantone 12-0104 TCX", arabicName: "أبيض كريمي", hex: "#F9F1E0", finish: "ساتان", intensity: "دافئ", finishEn: "Satin", intensityEn: "Warm", standard: "Pantone", code: "12-0104" },
        { name: "Pantone 11-4800 TCX", arabicName: "أبيض لؤلؤي", hex: "#F0EAD6", finish: "لامع", intensity: "ناعم", finishEn: "Gloss", intensityEn: "Soft", standard: "Pantone", code: "11-4800" },
        
        // Additional Whites
        { name: "White", arabicName: "أبيض", hex: "#FFFFFF", finish: "غير لامع", intensity: "ناصع", finishEn: "Matte", intensityEn: "Pure", standard: "Classic", code: "WHI-01" },
        { name: "Ivory", arabicName: "عاجي", hex: "#FFFFF0", finish: "لامع", intensity: "ناعم", finishEn: "Gloss", intensityEn: "Soft", standard: "Classic", code: "IVO-01" },
        { name: "Pearl", arabicName: "لؤلؤي", hex: "#F0EAD6", finish: "لامع", intensity: "ناعم", finishEn: "Gloss", intensityEn: "Soft", standard: "Classic", code: "PEA-03" },
        { name: "Snow", arabicName: "ثلجي", hex: "#FFFAFA", finish: "غير لامع", intensity: "ناصع", finishEn: "Matte", intensityEn: "Pure", standard: "Classic", code: "SNO-01" },
        { name: "Chalk", arabicName: "طباشيري", hex: "#F0F2F0", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Classic", code: "CHA-02" },
        { name: "Alabaster", arabicName: "مرمري", hex: "#F2F0E6", finish: "ساتان", intensity: "ناعم", finishEn: "Satin", intensityEn: "Soft", standard: "Classic", code: "ALA-01" },
        { name: "Eggshell", arabicName: "بيضي", hex: "#F0EAD6", finish: "غير لامع", intensity: "فاتح", finishEn: "Matte", intensityEn: "Light", standard: "Classic", code: "EGG-02" },
        { name: "Off White", arabicName: "أبيض مائل", hex: "#FAF0E6", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "Classic", code: "OFF-01" }
      ]
    },
    {
      id: "black",
      name: "Black",
      arabicName: "الأسود",
      standard: "RAL, NCS, Pantone",
      colors: [
        // RAL Blacks
        { name: "RAL 9004 - Signal Black", arabicName: "أسود إشاري", hex: "#2E2E30", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "RAL", code: "9004" },
        { name: "RAL 9005 - Jet Black", arabicName: "أسود فاحم", hex: "#0A0A0A", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "RAL", code: "9005" },
        { name: "RAL 9006 - White Aluminum", arabicName: "ألمنيوم أبيض", hex: "#A5A5A5", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "RAL", code: "9006" },
        { name: "RAL 9007 - Gray Aluminum", arabicName: "ألمنيوم رمادي", hex: "#8F8F8F", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "RAL", code: "9007" },
        
        // NCS Blacks
        { name: "NCS S 9000-N", arabicName: "أسود", hex: "#1E1E1E", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "NCS", code: "9000-N" },
        { name: "NCS S 8500-N", arabicName: "أسود فاتح", hex: "#2B2B2B", finish: "ساتان", intensity: "غامق", finishEn: "Satin", intensityEn: "Dark", standard: "NCS", code: "8500-N" },
        
        // Pantone Blacks
        { name: "Pantone Black C", arabicName: "أسود", hex: "#2D2D2D", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "Pantone", code: "Black C" },
        { name: "Pantone Black 2 C", arabicName: "أسود داكن", hex: "#23282B", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "Pantone", code: "Black 2 C" },
        { name: "Pantone Black 3 C", arabicName: "أسود فاحم", hex: "#212721", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "Pantone", code: "Black 3 C" },
        { name: "Pantone Black 4 C", arabicName: "أسود بني", hex: "#312A22", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "Pantone", code: "Black 4 C" },
        { name: "Pantone Black 5 C", arabicName: "أسود أزرق", hex: "#2E2C2F", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "Pantone", code: "Black 5 C" },
        { name: "Pantone Black 6 C", arabicName: "أسود مخضر", hex: "#2C2D2C", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "Pantone", code: "Black 6 C" },
        
        // Additional Blacks
        { name: "Jet Black", arabicName: "أسود فاحم", hex: "#0A0A0A", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "Classic", code: "JET-01" },
        { name: "Soft Black", arabicName: "أسود ناعم", hex: "#2C2C2C", finish: "ساتان", intensity: "غامق", finishEn: "Satin", intensityEn: "Dark", standard: "Classic", code: "SOF-01" },
        { name: "Charcoal Black", arabicName: "أسود فحمي", hex: "#1C1C1C", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "Classic", code: "CHA-03" },
        { name: "Onyx", arabicName: "جزع", hex: "#353839", finish: "ساتان", intensity: "غامق", finishEn: "Satin", intensityEn: "Dark", standard: "Classic", code: "ONY-01" },
        { name: "Ebony", arabicName: "أبنوس", hex: "#555D50", finish: "ساتان", intensity: "غامق", finishEn: "Satin", intensityEn: "Dark", standard: "Classic", code: "EBO-01" }
      ]
    },
    {
      id: "gray",
      name: "Gray",
      arabicName: "الرمادي",
      standard: "RAL, NCS, Pantone, BS",
      colors: [
        // RAL Grays
        { name: "RAL 7000 - Squirrel Gray", arabicName: "رمادي سنجابي", hex: "#7D847C", finish: "ساتان", intensity: "متوسط", finishEn: "Satin", intensityEn: "Medium", standard: "RAL", code: "7000" },
        { name: "RAL 7001 - Silver Gray", arabicName: "رمادي فضي", hex: "#8A9995", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "RAL", code: "7001" },
        { name: "RAL 7002 - Olive Gray", arabicName: "رمادي زيتوني", hex: "#7F7C6B", finish: "غير لامع", intensity: "ترابي", finishEn: "Matte", intensityEn: "Earthy", standard: "RAL", code: "7002" },
        { name: "RAL 7003 - Moss Gray", arabicName: "رمادي طحلبي", hex: "#74776B", finish: "ساتان", intensity: "هادئ", finishEn: "Satin", intensityEn: "Calm", standard: "RAL", code: "7003" },
        { name: "RAL 7004 - Signal Gray", arabicName: "رمادي إشاري", hex: "#9A9B9E", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "RAL", code: "7004" },
        { name: "RAL 7005 - Mouse Gray", arabicName: "رمادي فأري", hex: "#6B6E6C", finish: "غير لامع", intensity: "متوسط", finishEn: "Matte", intensityEn: "Medium", standard: "RAL", code: "7005" },
        { name: "RAL 7006 - Beige Gray", arabicName: "رمادي بيج", hex: "#6F685C", finish: "ساتان", intensity: "دافئ", finishEn: "Satin", intensityEn: "Warm", standard: "RAL", code: "7006" },
        
        // NCS Grays
        { name: "NCS S 2502-B", arabicName: "رمادي فاتح", hex: "#D3D3D3", finish: "غير لامع", intensity: "فاتح", finishEn: "Matte", intensityEn: "Light", standard: "NCS", code: "2502-B" },
        { name: "NCS S 3502-B", arabicName: "رمادي متوسط", hex: "#A9A9A9", finish: "ساتان", intensity: "متوسط", finishEn: "Satin", intensityEn: "Medium", standard: "NCS", code: "3502-B" },
        { name: "NCS S 5502-B", arabicName: "رمادي غامق", hex: "#696969", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "NCS", code: "5502-B" },
        { name: "NCS S 7502-B", arabicName: "رمادي فحمي", hex: "#36454F", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "NCS", code: "7502-B" },
        
        // Pantone Grays
        { name: "Pantone 420 C", arabicName: "رمادي فاتح", hex: "#C7C9C7", finish: "غير لامع", intensity: "فاتح", finishEn: "Matte", intensityEn: "Light", standard: "Pantone", code: "420 C" },
        { name: "Pantone 421 C", arabicName: "رمادي متوسط", hex: "#B1B3B1", finish: "ساتان", intensity: "متوسط", finishEn: "Satin", intensityEn: "Medium", standard: "Pantone", code: "421 C" },
        { name: "Pantone 422 C", arabicName: "رمادي", hex: "#9EA2A2", finish: "غير لامع", intensity: "هادئ", finishEn: "Matte", intensityEn: "Calm", standard: "Pantone", code: "422 C" },
        { name: "Pantone 423 C", arabicName: "رمادي غامق", hex: "#898D8D", finish: "ساتان", intensity: "غامق", finishEn: "Satin", intensityEn: "Dark", standard: "Pantone", code: "423 C" },
        { name: "Pantone 424 C", arabicName: "رمادي داكن", hex: "#6F7271", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "Pantone", code: "424 C" },
        
        // Additional Grays
        { name: "Light Gray", arabicName: "رمادي فاتح", hex: "#D3D3D3", finish: "غير لامع", intensity: "فاتح", finishEn: "Matte", intensityEn: "Light", standard: "Classic", code: "LGY-01" },
        { name: "Silver", arabicName: "فضي", hex: "#C0C0C0", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "Classic", code: "SIL-01" },
        { name: "Charcoal", arabicName: "فحمي", hex: "#36454F", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "Classic", code: "CHA-01" },
        { name: "Slate", arabicName: "سليت", hex: "#708090", finish: "ساتان", intensity: "متوسط", finishEn: "Satin", intensityEn: "Medium", standard: "Classic", code: "SLA-01" },
        { name: "Pewter", arabicName: "بيوتر", hex: "#899499", finish: "ساتان", intensity: "هادئ", finishEn: "Satin", intensityEn: "Calm", standard: "Classic", code: "PEW-01" },
        { name: "Ash", arabicName: "رماد", hex: "#B2BEB5", finish: "غير لامع", intensity: "فاتح", finishEn: "Matte", intensityEn: "Light", standard: "Classic", code: "ASH-01" },
        { name: "Graphite", arabicName: "جرافيت", hex: "#251607", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "Classic", code: "GRA-01" },
        { name: "Dove", arabicName: "حمامي", hex: "#C0C0C0", finish: "ساتان", intensity: "ناعم", finishEn: "Satin", intensityEn: "Soft", standard: "Classic", code: "DOV-01" }
      ]
    },
    {
      id: "beige",
      name: "Beige",
      arabicName: "البيج",
      standard: "RAL, NCS, Pantone",
      colors: [
        // RAL Beiges
        { name: "RAL 1000 - Green Beige", arabicName: "بيج مخضر", hex: "#CBB87C", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "RAL", code: "1000" },
        { name: "RAL 1001 - Beige", arabicName: "بيج", hex: "#CBB88C", finish: "غير لامع", intensity: "دافئ", finishEn: "Matte", intensityEn: "Warm", standard: "RAL", code: "1001" },
        { name: "RAL 1002 - Sand Yellow", arabicName: "بيج رملي", hex: "#C6A87C", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "RAL", code: "1002" },
        { name: "RAL 1011 - Brown Beige", arabicName: "بيج بني", hex: "#AF8A5A", finish: "غير لامع", intensity: "ترابي", finishEn: "Matte", intensityEn: "Earthy", standard: "RAL", code: "1011" },
        { name: "RAL 1013 - Oyster White", arabicName: "بيج لؤلؤي", hex: "#EAE6CA", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "RAL", code: "1013" },
        { name: "RAL 1014 - Ivory", arabicName: "عاجي", hex: "#E1CC9A", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "RAL", code: "1014" },
        { name: "RAL 1015 - Light Ivory", arabicName: "عاجي فاتح", hex: "#E6D2B5", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "RAL", code: "1015" },
        
        // NCS Beiges
        { name: "NCS S 1005-Y20R", arabicName: "كريمي", hex: "#FFFDD0", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "NCS", code: "1005-Y20R" },
        { name: "NCS S 2005-Y20R", arabicName: "ايكرو", hex: "#C2B280", finish: "ساتان", intensity: "ترابي", finishEn: "Satin", intensityEn: "Earthy", standard: "NCS", code: "2005-Y20R" },
        { name: "NCS S 1502-Y", arabicName: "كتان", hex: "#FAF0E6", finish: "غير لامع", intensity: "فاتح", finishEn: "Matte", intensityEn: "Light", standard: "NCS", code: "1502-Y" },
        
        // Pantone Beiges
        { name: "Pantone 468 C", arabicName: "بيج", hex: "#B29B7A", finish: "ساتان", intensity: "ترابي", finishEn: "Satin", intensityEn: "Earthy", standard: "Pantone", code: "468 C" },
        { name: "Pantone 469 C", arabicName: "بيج غامق", hex: "#9E7E5E", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "Pantone", code: "469 C" },
        { name: "Pantone 726 C", arabicName: "بيج فاتح", hex: "#E7C9B0", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "Pantone", code: "726 C" },
        
        // Additional Beiges
        { name: "Cream", arabicName: "كريمي", hex: "#FFFDD0", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Classic", code: "CRE-02" },
        { name: "Ecru", arabicName: "ايكرو", hex: "#C2B280", finish: "ساتان", intensity: "ترابي", finishEn: "Satin", intensityEn: "Earthy", standard: "Classic", code: "ECR-01" },
        { name: "Linen", arabicName: "كتان", hex: "#FAF0E6", finish: "غير لامع", intensity: "فاتح", finishEn: "Matte", intensityEn: "Light", standard: "Classic", code: "LIN-01" },
        { name: "Sand", arabicName: "رملي", hex: "#C2B280", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "Classic", code: "SAN-01" },
        { name: "Wheat", arabicName: "قمحي", hex: "#F5DEB3", finish: "غير لامع", intensity: "دافئ", finishEn: "Matte", intensityEn: "Warm", standard: "Classic", code: "WHE-01" },
        { name: "Khaki", arabicName: "كاكي", hex: "#C3B091", finish: "ساتان", intensity: "ترابي", finishEn: "Satin", intensityEn: "Earthy", standard: "Classic", code: "KHA-01" },
        { name: "Biscuit", arabicName: "بسكويت", hex: "#EEDC9A", finish: "لامع", intensity: "ناعم", finishEn: "Gloss", intensityEn: "Soft", standard: "Classic", code: "BIS-01" },
        { name: "Almond", arabicName: "لوزي", hex: "#EFDECD", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "Classic", code: "ALM-01" }
      ]
    },
    {
      id: "brown",
      name: "Brown",
      arabicName: "البني",
      standard: "RAL, NCS, Pantone, BS",
      colors: [
        // RAL Browns
        { name: "RAL 8000 - Green Brown", arabicName: "بني مخضر", hex: "#826B4A", finish: "ساتان", intensity: "ترابي", finishEn: "Satin", intensityEn: "Earthy", standard: "RAL", code: "8000" },
        { name: "RAL 8001 - Ochre Brown", arabicName: "بني مغري", hex: "#9D6B3A", finish: "لامع", intensity: "دافئ", finishEn: "Gloss", intensityEn: "Warm", standard: "RAL", code: "8001" },
        { name: "RAL 8002 - Signal Brown", arabicName: "بني إشاري", hex: "#78493B", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "RAL", code: "8002" },
        { name: "RAL 8003 - Clay Brown", arabicName: "بني طيني", hex: "#7D4931", finish: "ساتان", intensity: "ترابي", finishEn: "Satin", intensityEn: "Earthy", standard: "RAL", code: "8003" },
        { name: "RAL 8004 - Copper Brown", arabicName: "بني نحاسي", hex: "#8F4E35", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "RAL", code: "8004" },
        { name: "RAL 8007 - Fawn Brown", arabicName: "بني فاتح", hex: "#6E4A3A", finish: "غير لامع", intensity: "فاتح", finishEn: "Matte", intensityEn: "Light", standard: "RAL", code: "8007" },
        { name: "RAL 8008 - Olive Brown", arabicName: "بني زيتوني", hex: "#6F4F28", finish: "ساتان", intensity: "ترابي", finishEn: "Satin", intensityEn: "Earthy", standard: "RAL", code: "8008" },
        
        // NCS Browns
        { name: "NCS S 6030-Y50R", arabicName: "بني شوكولاتة", hex: "#7B3F00", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "NCS", code: "6030-Y50R" },
        { name: "NCS S 5020-Y30R", arabicName: "بني كراميل", hex: "#AF6E4D", finish: "ساتان", intensity: "دافئ", finishEn: "Satin", intensityEn: "Warm", standard: "NCS", code: "5020-Y30R" },
        { name: "NCS S 7010-Y50R", arabicName: "بني اسبريسو", hex: "#4B2E2B", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "NCS", code: "7010-Y50R" },
        
        // Pantone Browns
        { name: "Pantone 161 C", arabicName: "بني غامق", hex: "#5C3E35", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "Pantone", code: "161 C" },
        { name: "Pantone 162 C", arabicName: "بني فاتح", hex: "#A87B5A", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "Pantone", code: "162 C" },
        { name: "Pantone 168 C", arabicName: "بني ترابي", hex: "#7A4A3C", finish: "غير لامع", intensity: "ترابي", finishEn: "Matte", intensityEn: "Earthy", standard: "Pantone", code: "168 C" },
        
        // Additional Browns
        { name: "Chocolate", arabicName: "شوكولاتة", hex: "#7B3F00", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "Classic", code: "CHO-01" },
        { name: "Caramel", arabicName: "كراميل", hex: "#AF6E4D", finish: "ساتان", intensity: "دافئ", finishEn: "Satin", intensityEn: "Warm", standard: "Classic", code: "CAR-03" },
        { name: "Espresso", arabicName: "اسبريسو", hex: "#4B2E2B", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "Classic", code: "ESP-01" },
        { name: "Hazelnut", arabicName: "بندقي", hex: "#9B6B43", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "Classic", code: "HAZ-01" },
        { name: "Walnut", arabicName: "جوز", hex: "#5C4033", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "Classic", code: "WAL-01" },
        { name: "Cinnamon", arabicName: "قرفة", hex: "#7B3F00", finish: "لامع", intensity: "دافئ", finishEn: "Gloss", intensityEn: "Warm", standard: "Classic", code: "CIN-01" },
        { name: "Mocha", arabicName: "موكا", hex: "#967117", finish: "ساتان", intensity: "ترابي", finishEn: "Satin", intensityEn: "Earthy", standard: "Classic", code: "MOC-01" },
        { name: "Cocoa", arabicName: "كاكاو", hex: "#5C4033", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "Classic", code: "COC-01" }
      ]
    },
    {
      id: "earth",
      name: "Earth",
      arabicName: "الترابي",
      standard: "RAL, NCS, Pantone",
      colors: [
        // RAL Earth Tones
        { name: "RAL 8000 - Green Brown", arabicName: "بني مخضر", hex: "#826B4A", finish: "ساتان", intensity: "ترابي", finishEn: "Satin", intensityEn: "Earthy", standard: "RAL", code: "8000" },
        { name: "RAL 8003 - Clay Brown", arabicName: "بني طيني", hex: "#7D4931", finish: "غير لامع", intensity: "ترابي", finishEn: "Matte", intensityEn: "Earthy", standard: "RAL", code: "8003" },
        { name: "RAL 8023 - Tawny Brown", arabicName: "بني محمر", hex: "#A65E3A", finish: "ساتان", intensity: "دافئ", finishEn: "Satin", intensityEn: "Warm", standard: "RAL", code: "8023" },
        { name: "RAL 8024 - Beige Brown", arabicName: "بني بيج", hex: "#79553B", finish: "غير لامع", intensity: "ترابي", finishEn: "Matte", intensityEn: "Earthy", standard: "RAL", code: "8024" },
        { name: "RAL 8025 - Pale Brown", arabicName: "بني شاحب", hex: "#755C48", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "RAL", code: "8025" },
        
        // NCS Earth Tones
        { name: "NCS S 4030-Y50R", arabicName: "بني ترابي", hex: "#8B4513", finish: "غير لامع", intensity: "ترابي", finishEn: "Matte", intensityEn: "Earthy", standard: "NCS", code: "4030-Y50R" },
        { name: "NCS S 5030-Y50R", arabicName: "بني غامق", hex: "#6B3F2B", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "NCS", code: "5030-Y50R" },
        { name: "NCS S 6030-Y50R", arabicName: "بني داكن", hex: "#4A2C1C", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "NCS", code: "6030-Y50R" },
        
        // Additional Earth Tones
        { name: "Brown", arabicName: "بني", hex: "#964B00", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "Classic", code: "BRO-01" },
        { name: "Tan", arabicName: "تان", hex: "#D2B48C", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "Classic", code: "TAN-02" },
        { name: "Clay", arabicName: "طيني", hex: "#B66A50", finish: "ساتان", intensity: "ترابي", finishEn: "Satin", intensityEn: "Earthy", standard: "Classic", code: "CLA-01" },
        { name: "Sand", arabicName: "رملي", hex: "#C2B280", finish: "غير لامع", intensity: "فاتح", finishEn: "Matte", intensityEn: "Light", standard: "Classic", code: "SAN-02" },
        { name: "Umber", arabicName: "أمبر", hex: "#635147", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "Classic", code: "UMB-01" },
        { name: "Ochre", arabicName: "أوكر", hex: "#CC7722", finish: "لامع", intensity: "دافئ", finishEn: "Gloss", intensityEn: "Warm", standard: "Classic", code: "OCH-01" },
        { name: "Sienna", arabicName: "سيينا", hex: "#882D17", finish: "ساتان", intensity: "عميق", finishEn: "Satin", intensityEn: "Deep", standard: "Classic", code: "SIE-01" },
        { name: "Coffee", arabicName: "قهوة", hex: "#6F4E37", finish: "لامع", intensity: "غامق", finishEn: "Gloss", intensityEn: "Dark", standard: "Classic", code: "COF-01" }
      ]
    },
    {
      id: "red",
      name: "Red",
      arabicName: "الأحمر",
      standard: "RAL, NCS, Pantone",
      colors: [
        // RAL Classic Reds
        { name: "RAL 3000 - Flame Red", arabicName: "أحمر لهبي", hex: "#AF2B1E", finish: "لامع", intensity: "جريء", finishEn: "Gloss", intensityEn: "Bold", standard: "RAL", code: "3000" },
        { name: "RAL 3001 - Signal Red", arabicName: "أحمر إشاري", hex: "#9B2423", finish: "ساتان", intensity: "قوي", finishEn: "Satin", intensityEn: "Strong", standard: "RAL", code: "3001" },
        { name: "RAL 3002 - Carmine Red", arabicName: "أحمر كارمين", hex: "#9B2B2B", finish: "لامع", intensity: "عميق", finishEn: "Gloss", intensityEn: "Deep", standard: "RAL", code: "3002" },
        { name: "RAL 3003 - Ruby Red", arabicName: "أحمر ياقوتي", hex: "#8D1C1C", finish: "لامع", intensity: "غامق", finishEn: "Gloss", intensityEn: "Dark", standard: "RAL", code: "3003" },
        { name: "RAL 3004 - Purple Red", arabicName: "أحمر بنفسجي", hex: "#6B1C1C", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "RAL", code: "3004" },
        { name: "RAL 3005 - Wine Red", arabicName: "أحمر خمري", hex: "#5E1C1C", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "RAL", code: "3005" },
        
        // NCS Reds
        { name: "NCS S 1080-R", arabicName: "أحمر ناصع", hex: "#C40233", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "NCS", code: "1080-R" },
        { name: "NCS S 1580-R", arabicName: "أحمر قرمزي", hex: "#B01030", finish: "ساتان", intensity: "عميق", finishEn: "Satin", intensityEn: "Deep", standard: "NCS", code: "1580-R" },
        { name: "NCS S 2070-R", arabicName: "أحمر تيراكوتا", hex: "#A52A2A", finish: "غير لامع", intensity: "ترابي", finishEn: "Matte", intensityEn: "Earthy", standard: "NCS", code: "2070-R" },
        
        // Pantone Reds
        { name: "Pantone 186 C", arabicName: "أحمر بانتون", hex: "#C8102E", finish: "لامع", intensity: "جريء", finishEn: "Gloss", intensityEn: "Bold", standard: "Pantone", code: "186 C" },
        { name: "Pantone 187 C", arabicName: "أحمر داكن", hex: "#BA0C2F", finish: "ساتان", intensity: "عميق", finishEn: "Satin", intensityEn: "Deep", standard: "Pantone", code: "187 C" },
        { name: "Pantone 200 C", arabicName: "أحمر متوسط", hex: "#BA0C2F", finish: "لامع", intensity: "قوي", finishEn: "Gloss", intensityEn: "Strong", standard: "Pantone", code: "200 C" },
        
        // Additional Reds
        { name: "Burgundy", arabicName: "بورجندي", hex: "#800020", finish: "ساتان", intensity: "عميق", finishEn: "Satin", intensityEn: "Deep", standard: "Classic", code: "BUR-01" },
        { name: "Terracotta", arabicName: "تيراكوتا", hex: "#E2725B", finish: "غير لامع", intensity: "ترابي", finishEn: "Matte", intensityEn: "Earthy", standard: "Classic", code: "TER-01" },
        { name: "Coral", arabicName: "كورال", hex: "#FF7F50", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "Classic", code: "COR-01" },
        { name: "Rose", arabicName: "روز", hex: "#FFC0CB", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Classic", code: "ROS-01" },
        { name: "Ruby", arabicName: "روبي", hex: "#E0115F", finish: "لامع", intensity: "جريء", finishEn: "Gloss", intensityEn: "Bold", standard: "Classic", code: "RUB-01" },
        { name: "Mahogany", arabicName: "ماهوجني", hex: "#C04000", finish: "ساتان", intensity: "غامق", finishEn: "Satin", intensityEn: "Dark", standard: "Classic", code: "MAH-01" },
        { name: "Vermilion", arabicName: "فيرميليون", hex: "#E34234", finish: "غير لامع", intensity: "مشرق", finishEn: "Matte", intensityEn: "Bright", standard: "Classic", code: "VER-01" },
        { name: "Carmine", arabicName: "كارمين", hex: "#960018", finish: "لامع", intensity: "عميق", finishEn: "Gloss", intensityEn: "Deep", standard: "Classic", code: "CAR-01" }
      ]
    },
    {
      id: "orange",
      name: "Orange",
      arabicName: "البرتقالي",
      standard: "RAL, NCS, Pantone",
      colors: [
        // RAL Oranges
        { name: "RAL 2000 - Yellow Orange", arabicName: "برتقالي مصفر", hex: "#DA7226", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "RAL", code: "2000" },
        { name: "RAL 2001 - Red Orange", arabicName: "برتقالي محمر", hex: "#B43E2A", finish: "ساتان", intensity: "عميق", finishEn: "Satin", intensityEn: "Deep", standard: "RAL", code: "2001" },
        { name: "RAL 2002 - Vermilion", arabicName: "فيرميليون", hex: "#C13C2B", finish: "لامع", intensity: "جريء", finishEn: "Gloss", intensityEn: "Bold", standard: "RAL", code: "2002" },
        { name: "RAL 2003 - Pastel Orange", arabicName: "برتقالي باستيل", hex: "#F67828", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "RAL", code: "2003" },
        { name: "RAL 2004 - Pure Orange", arabicName: "برتقالي نقي", hex: "#E2531C", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "RAL", code: "2004" },
        { name: "RAL 2008 - Bright Red Orange", arabicName: "برتقالي أحمر فاتح", hex: "#ED6B2D", finish: "ساتان", intensity: "مشرق", finishEn: "Satin", intensityEn: "Bright", standard: "RAL", code: "2008" },
        
        // NCS Oranges
        { name: "NCS S 0580-Y70R", arabicName: "كورال", hex: "#FF7F50", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "NCS", code: "0580-Y70R" },
        { name: "NCS S 1070-Y60R", arabicName: "يوسفي", hex: "#F28500", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "NCS", code: "1070-Y60R" },
        { name: "NCS S 2060-Y50R", arabicName: "قرعي", hex: "#FF7518", finish: "غير لامع", intensity: "دافئ", finishEn: "Matte", intensityEn: "Warm", standard: "NCS", code: "2060-Y50R" },
        
        // Pantone Oranges
        { name: "Pantone 151 C", arabicName: "برتقالي", hex: "#FF8200", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "Pantone", code: "151 C" },
        { name: "Pantone 158 C", arabicName: "برتقالي داكن", hex: "#E35F2E", finish: "ساتان", intensity: "عميق", finishEn: "Satin", intensityEn: "Deep", standard: "Pantone", code: "158 C" },
        { name: "Pantone 165 C", arabicName: "برتقالي فاتح", hex: "#F3682D", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "Pantone", code: "165 C" },
        
        // Additional Oranges
        { name: "Peach", arabicName: "خوخي", hex: "#FFE5B4", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Classic", code: "PEA-01" },
        { name: "Coral", arabicName: "كورال", hex: "#FF7F50", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "Classic", code: "COR-02" },
        { name: "Apricot", arabicName: "مشمشي", hex: "#FBCEB1", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "Classic", code: "APR-01" },
        { name: "Tangerine", arabicName: "يوسفي", hex: "#F28500", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "Classic", code: "TAN-01" },
        { name: "Pumpkin", arabicName: "قرعي", hex: "#FF7518", finish: "غير لامع", intensity: "دافئ", finishEn: "Matte", intensityEn: "Warm", standard: "Classic", code: "PUM-01" },
        { name: "Rust", arabicName: "صدأ", hex: "#B7410E", finish: "ساتان", intensity: "ترابي", finishEn: "Satin", intensityEn: "Earthy", standard: "Classic", code: "RUS-01" },
        { name: "Amber", arabicName: "عنبري", hex: "#FFBF00", finish: "لامع", intensity: "غني", finishEn: "Gloss", intensityEn: "Rich", standard: "Classic", code: "AMB-01" },
        { name: "Carrot", arabicName: "جزرية", hex: "#ED9121", finish: "غير لامع", intensity: "مشرق", finishEn: "Matte", intensityEn: "Bright", standard: "Classic", code: "CAR-02" }
      ]
    },
    {
      id: "yellow",
      name: "Yellow",
      arabicName: "الأصفر",
      standard: "RAL, NCS, Pantone, BS",
      colors: [
        // RAL Yellows
        { name: "RAL 1000 - Green Beige", arabicName: "بيج مخضر", hex: "#CBB87C", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "RAL", code: "1000" },
        { name: "RAL 1001 - Beige", arabicName: "بيج", hex: "#CBB88C", finish: "غير لامع", intensity: "دافئ", finishEn: "Matte", intensityEn: "Warm", standard: "RAL", code: "1001" },
        { name: "RAL 1002 - Sand Yellow", arabicName: "أصفر رملي", hex: "#C6A87C", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "RAL", code: "1002" },
        { name: "RAL 1003 - Signal Yellow", arabicName: "أصفر إشاري", hex: "#F9A800", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "RAL", code: "1003" },
        { name: "RAL 1004 - Golden Yellow", arabicName: "أصفر ذهبي", hex: "#E49E00", finish: "لامع", intensity: "غني", finishEn: "Gloss", intensityEn: "Rich", standard: "RAL", code: "1004" },
        { name: "RAL 1005 - Honey Yellow", arabicName: "أصفر عسلي", hex: "#CB8E00", finish: "ساتان", intensity: "دافئ", finishEn: "Satin", intensityEn: "Warm", standard: "RAL", code: "1005" },
        
        // NCS Yellows
        { name: "NCS S 0580-Y", arabicName: "أصفر ليموني", hex: "#FFF44F", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "NCS", code: "0580-Y" },
        { name: "NCS S 1060-Y", arabicName: "أصفر شمسي", hex: "#FFDA03", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "NCS", code: "1060-Y" },
        { name: "NCS S 2040-Y", arabicName: "أصفر خردلي", hex: "#FFDB58", finish: "غير لامع", intensity: "دافئ", finishEn: "Matte", intensityEn: "Warm", standard: "NCS", code: "2040-Y" },
        
        // Pantone Yellows
        { name: "Pantone 109 C", arabicName: "أصفر زاهي", hex: "#FFD100", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "Pantone", code: "109 C" },
        { name: "Pantone 116 C", arabicName: "أصفر متوسط", hex: "#FFCD00", finish: "ساتان", intensity: "قوي", finishEn: "Satin", intensityEn: "Strong", standard: "Pantone", code: "116 C" },
        { name: "Pantone 123 C", arabicName: "أصفر عسلي", hex: "#FFC72C", finish: "لامع", intensity: "دافئ", finishEn: "Gloss", intensityEn: "Warm", standard: "Pantone", code: "123 C" },
        
        // Additional Yellows
        { name: "Cream", arabicName: "كريمي", hex: "#FFFDD0", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Classic", code: "CRE-01" },
        { name: "Butter", arabicName: "زبدة", hex: "#FFF8E7", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "Classic", code: "BUT-01" },
        { name: "Sunflower", arabicName: "دوار الشمس", hex: "#FFDA03", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "Classic", code: "SUN-01" },
        { name: "Mustard", arabicName: "خردلي", hex: "#FFDB58", finish: "غير لامع", intensity: "دافئ", finishEn: "Matte", intensityEn: "Warm", standard: "Classic", code: "MUS-01" },
        { name: "Honey", arabicName: "عسلي", hex: "#FFC30B", finish: "ساتان", intensity: "عميق", finishEn: "Satin", intensityEn: "Deep", standard: "Classic", code: "HON-01" },
        { name: "Lemon", arabicName: "ليموني", hex: "#FFF44F", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "Classic", code: "LEM-01" },
        { name: "Gold", arabicName: "ذهبي", hex: "#FFD700", finish: "لامع", intensity: "غني", finishEn: "Gloss", intensityEn: "Rich", standard: "Classic", code: "GOL-01" },
        { name: "Vanilla", arabicName: "فانيليا", hex: "#F3E5AB", finish: "غير لامع", intensity: "فاتح", finishEn: "Matte", intensityEn: "Light", standard: "Classic", code: "VAN-01" }
      ]
    },
    {
      id: "green",
      name: "Green",
      arabicName: "الأخضر",
      standard: "RAL, NCS, Pantone, BS",
      colors: [
        // RAL Greens
        { name: "RAL 6000 - Patina Green", arabicName: "أخضر باتينا", hex: "#3C756A", finish: "ساتان", intensity: "هادئ", finishEn: "Satin", intensityEn: "Calm", standard: "RAL", code: "6000" },
        { name: "RAL 6001 - Emerald Green", arabicName: "أخضر زمردي", hex: "#28713E", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "RAL", code: "6001" },
        { name: "RAL 6002 - Leaf Green", arabicName: "أخضر ورق شجر", hex: "#2D572C", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "RAL", code: "6002" },
        { name: "RAL 6003 - Olive Green", arabicName: "أخضر زيتوني", hex: "#4A5D23", finish: "غير لامع", intensity: "ترابي", finishEn: "Matte", intensityEn: "Earthy", standard: "RAL", code: "6003" },
        { name: "RAL 6004 - Turquoise Green", arabicName: "أخضر فيروزي", hex: "#1F3A3D", finish: "ساتان", intensity: "عميق", finishEn: "Satin", intensityEn: "Deep", standard: "RAL", code: "6004" },
        { name: "RAL 6005 - Moss Green", arabicName: "أخضر طحلبي", hex: "#2F4538", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "RAL", code: "6005" },
        
        // NCS Greens
        { name: "NCS S 2060-G", arabicName: "أخضر نعناعي", hex: "#98FB98", finish: "لامع", intensity: "منعش", finishEn: "Gloss", intensityEn: "Fresh", standard: "NCS", code: "2060-G" },
        { name: "NCS S 4030-G", arabicName: "أخضر ميرمية", hex: "#BCB88A", finish: "غير لامع", intensity: "هادئ", finishEn: "Matte", intensityEn: "Calm", standard: "NCS", code: "4030-G" },
        { name: "NCS S 5040-G", arabicName: "أخضر غابي", hex: "#228B22", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "NCS", code: "5040-G" },
        
        // Pantone Greens
        { name: "Pantone 348 C", arabicName: "أخضر زمردي", hex: "#00843D", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "Pantone", code: "348 C" },
        { name: "Pantone 362 C", arabicName: "أخضر عشبي", hex: "#4B8B3B", finish: "ساتان", intensity: "قوي", finishEn: "Satin", intensityEn: "Strong", standard: "Pantone", code: "362 C" },
        { name: "Pantone 375 C", arabicName: "أخضر ليموني", hex: "#5EAA5E", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "Pantone", code: "375 C" },
        
        // Additional Greens
        { name: "Sage", arabicName: "ميرمية", hex: "#BCB88A", finish: "غير لامع", intensity: "هادئ", finishEn: "Matte", intensityEn: "Calm", standard: "Classic", code: "SAG-01" },
        { name: "Mint", arabicName: "نعناعي", hex: "#98FB98", finish: "لامع", intensity: "منعش", finishEn: "Gloss", intensityEn: "Fresh", standard: "Classic", code: "MIN-01" },
        { name: "Emerald", arabicName: "زمردي", hex: "#50C878", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "Classic", code: "EME-01" },
        { name: "Jade", arabicName: "يشمي", hex: "#00A36C", finish: "ساتان", intensity: "عميق", finishEn: "Satin", intensityEn: "Deep", standard: "Classic", code: "JAD-01" },
        { name: "Forest", arabicName: "غابي", hex: "#228B22", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "Classic", code: "FOR-01" },
        { name: "Lime", arabicName: "ليموني", hex: "#32CD32", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "Classic", code: "LIM-01" },
        { name: "Olive", arabicName: "زيتوني", hex: "#808000", finish: "غير لامع", intensity: "ترابي", finishEn: "Matte", intensityEn: "Earthy", standard: "Classic", code: "OLI-01" },
        { name: "Seafoam", arabicName: "زبد البحر", hex: "#9FE2BF", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "Classic", code: "SEA-01" }
      ]
    },
    {
      id: "blue",
      name: "Blue",
      arabicName: "الأزرق",
      standard: "RAL, NCS, Pantone, BS",
      colors: [
        // RAL Blues
        { name: "RAL 5000 - Violet Blue", arabicName: "أزرق بنفسجي", hex: "#354D73", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "RAL", code: "5000" },
        { name: "RAL 5001 - Green Blue", arabicName: "أزرق مخضر", hex: "#1F3A4D", finish: "ساتان", intensity: "غامق", finishEn: "Satin", intensityEn: "Dark", standard: "RAL", code: "5001" },
        { name: "RAL 5002 - Ultramarine", arabicName: "أزرق فوق بحري", hex: "#2B2C7C", finish: "لامع", intensity: "عميق", finishEn: "Gloss", intensityEn: "Deep", standard: "RAL", code: "5002" },
        { name: "RAL 5003 - Saphire Blue", arabicName: "أزرق ياقوتي", hex: "#1D1E5C", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "RAL", code: "5003" },
        { name: "RAL 5005 - Signal Blue", arabicName: "أزرق إشاري", hex: "#005387", finish: "لامع", intensity: "قوي", finishEn: "Gloss", intensityEn: "Strong", standard: "RAL", code: "5005" },
        { name: "RAL 5007 - Brilliant Blue", arabicName: "أزرق لامع", hex: "#3F5E8C", finish: "ساتان", intensity: "مشرق", finishEn: "Satin", intensityEn: "Bright", standard: "RAL", code: "5007" },
        
        // NCS Blues
        { name: "NCS S 4055-R90B", arabicName: "أزرق سماوي", hex: "#87CEEB", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "NCS", code: "4055-R90B" },
        { name: "NCS S 6030-R90B", arabicName: "أزرق كحلي", hex: "#000080", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "NCS", code: "6030-R90B" },
        { name: "NCS S 5040-R90B", arabicName: "أزرق ملكي", hex: "#4169E1", finish: "ساتان", intensity: "قوي", finishEn: "Satin", intensityEn: "Strong", standard: "NCS", code: "5040-R90B" },
        
        // Pantone Blues
        { name: "Pantone 294 C", arabicName: "أزرق داكن", hex: "#002B5C", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "Pantone", code: "294 C" },
        { name: "Pantone 299 C", arabicName: "أزرق فاتح", hex: "#0077C8", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "Pantone", code: "299 C" },
        { name: "Pantone 300 C", arabicName: "أزرق متوسط", hex: "#005EB8", finish: "ساتان", intensity: "قوي", finishEn: "Satin", intensityEn: "Strong", standard: "Pantone", code: "300 C" },
        
        // Additional Blues
        { name: "Navy", arabicName: "كحلي", hex: "#000080", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "Classic", code: "NAV-01" },
        { name: "Sky Blue", arabicName: "أزرق سماوي", hex: "#87CEEB", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "Classic", code: "SKY-01" },
        { name: "Powder Blue", arabicName: "أزرق بودري", hex: "#B6D0E2", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Classic", code: "POW-01" },
        { name: "Baby Blue", arabicName: "أزرق فاتح", hex: "#89CFF0", finish: "لامع", intensity: "ناعم", finishEn: "Gloss", intensityEn: "Soft", standard: "Classic", code: "BAB-01" },
        { name: "Royal Blue", arabicName: "أزرق ملكي", hex: "#4169E1", finish: "ساتان", intensity: "قوي", finishEn: "Satin", intensityEn: "Strong", standard: "Classic", code: "ROY-01" },
        { name: "Cobalt", arabicName: "كوبالت", hex: "#0047AB", finish: "لامع", intensity: "عميق", finishEn: "Gloss", intensityEn: "Deep", standard: "Classic", code: "COB-01" },
        { name: "Cerulean", arabicName: "سيروليان", hex: "#007BA7", finish: "غير لامع", intensity: "هادئ", finishEn: "Matte", intensityEn: "Calm", standard: "Classic", code: "CER-01" },
        { name: "Indigo", arabicName: "نيلي", hex: "#4B0082", finish: "ساتان", intensity: "غامق", finishEn: "Satin", intensityEn: "Dark", standard: "Classic", code: "IND-01" }
      ]
    },
    {
      id: "purple",
      name: "Purple",
      arabicName: "البنفسجي",
      standard: "RAL, NCS, Pantone",
      colors: [
        // RAL Purples
        { name: "RAL 4001 - Red Lilac", arabicName: "ليلك أحمر", hex: "#8A5A7C", finish: "ساتان", intensity: "هادئ", finishEn: "Satin", intensityEn: "Calm", standard: "RAL", code: "4001" },
        { name: "RAL 4002 - Red Violet", arabicName: "بنفسجي أحمر", hex: "#933D50", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "RAL", code: "4002" },
        { name: "RAL 4003 - Heather Violet", arabicName: "بنفسجي خلنجي", hex: "#D15B8C", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "RAL", code: "4003" },
        { name: "RAL 4004 - Claret Violet", arabicName: "بنفسجي خمري", hex: "#691C3C", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "RAL", code: "4004" },
        { name: "RAL 4005 - Blue Lilac", arabicName: "ليلك أزرق", hex: "#76689A", finish: "ساتان", intensity: "هادئ", finishEn: "Satin", intensityEn: "Calm", standard: "RAL", code: "4005" },
        { name: "RAL 4006 - Traffic Purple", arabicName: "بنفسجي مروري", hex: "#873260", finish: "لامع", intensity: "قوي", finishEn: "Gloss", intensityEn: "Strong", standard: "RAL", code: "4006" },
        
        // NCS Purples
        { name: "NCS S 3030-R40B", arabicName: "لافندر", hex: "#E6E6FA", finish: "غير لامع", intensity: "فاتح", finishEn: "Matte", intensityEn: "Light", standard: "NCS", code: "3030-R40B" },
        { name: "NCS S 4030-R50B", arabicName: "ليلك", hex: "#C8A2C8", finish: "ساتان", intensity: "ناعم", finishEn: "Satin", intensityEn: "Soft", standard: "NCS", code: "4030-R50B" },
        { name: "NCS S 5030-R60B", arabicName: "بنفسجي عميق", hex: "#8F00FF", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "NCS", code: "5030-R60B" },
        
        // Pantone Purples
        { name: "Pantone 258 C", arabicName: "بنفسجي", hex: "#8246AF", finish: "ساتان", intensity: "عميق", finishEn: "Satin", intensityEn: "Deep", standard: "Pantone", code: "258 C" },
        { name: "Pantone 259 C", arabicName: "بنفسجي غامق", hex: "#6A2C8A", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "Pantone", code: "259 C" },
        { name: "Pantone 260 C", arabicName: "بنفسجي داكن", hex: "#5E2A7C", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "Pantone", code: "260 C" },
        
        // Additional Purples
        { name: "Lavender", arabicName: "لافندر", hex: "#E6E6FA", finish: "غير لامع", intensity: "فاتح", finishEn: "Matte", intensityEn: "Light", standard: "Classic", code: "LAV-01" },
        { name: "Lilac", arabicName: "ليلك", hex: "#C8A2C8", finish: "ساتان", intensity: "ناعم", finishEn: "Satin", intensityEn: "Soft", standard: "Classic", code: "LIL-01" },
        { name: "Amethyst", arabicName: "جمشت", hex: "#9966CC", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "Classic", code: "AME-01" },
        { name: "Plum", arabicName: "بلوم", hex: "#8E4585", finish: "غير لامع", intensity: "غامق", finishEn: "Matte", intensityEn: "Dark", standard: "Classic", code: "PLU-01" },
        { name: "Mauve", arabicName: "موف", hex: "#E0B0FF", finish: "ساتان", intensity: "فاتح", finishEn: "Satin", intensityEn: "Light", standard: "Classic", code: "MAU-01" },
        { name: "Orchid", arabicName: "أوركيد", hex: "#DA70D6", finish: "لامع", intensity: "متوسط", finishEn: "Gloss", intensityEn: "Medium", standard: "Classic", code: "ORC-01" },
        { name: "Violet", arabicName: "بنفسجي", hex: "#8F00FF", finish: "غير لامع", intensity: "عميق", finishEn: "Matte", intensityEn: "Deep", standard: "Classic", code: "VIO-01" },
        { name: "Eggplant", arabicName: "باذنجاني", hex: "#614051", finish: "ساتان", intensity: "غامق", finishEn: "Satin", intensityEn: "Dark", standard: "Classic", code: "EGG-01" }
      ]
    },
    {
      id: "pink",
      name: "Pink",
      arabicName: "الوردي",
      standard: "RAL, NCS, Pantone",
      colors: [
        // RAL Pinks
        { name: "RAL 3014 - Antique Pink", arabicName: "وردي عتيق", hex: "#D36E70", finish: "ساتان", intensity: "ناعم", finishEn: "Satin", intensityEn: "Soft", standard: "RAL", code: "3014" },
        { name: "RAL 3015 - Light Pink", arabicName: "وردي فاتح", hex: "#E1A6AD", finish: "غير لامع", intensity: "فاتح", finishEn: "Matte", intensityEn: "Light", standard: "RAL", code: "3015" },
        { name: "RAL 3017 - Rose", arabicName: "وردي", hex: "#D53E4C", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "RAL", code: "3017" },
        
        // NCS Pinks
        { name: "NCS S 0540-R20B", arabicName: "فوشيا", hex: "#FF00FF", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "NCS", code: "0540-R20B" },
        { name: "NCS S 1050-R20B", arabicName: "وردي فاقع", hex: "#FF69B4", finish: "لامع", intensity: "جريء", finishEn: "Gloss", intensityEn: "Bold", standard: "NCS", code: "1050-R20B" },
        { name: "NCS S 2030-R20B", arabicName: "بلش", hex: "#DE5D83", finish: "ساتان", intensity: "ناعم", finishEn: "Satin", intensityEn: "Soft", standard: "NCS", code: "2030-R20B" },
        
        // Pantone Pinks
        { name: "Pantone 203 C", arabicName: "وردي فاتح", hex: "#EFB3CB", finish: "غير لامع", intensity: "فاتح", finishEn: "Matte", intensityEn: "Light", standard: "Pantone", code: "203 C" },
        { name: "Pantone 204 C", arabicName: "وردي", hex: "#E891B0", finish: "ساتان", intensity: "متوسط", finishEn: "Satin", intensityEn: "Medium", standard: "Pantone", code: "204 C" },
        { name: "Pantone 205 C", arabicName: "وردي غامق", hex: "#E06A8C", finish: "لامع", intensity: "عميق", finishEn: "Gloss", intensityEn: "Deep", standard: "Pantone", code: "205 C" },
        
        // Additional Pinks
        { name: "Blush", arabicName: "بلش", hex: "#DE5D83", finish: "ساتان", intensity: "ناعم", finishEn: "Satin", intensityEn: "Soft", standard: "Classic", code: "BLU-01" },
        { name: "Fuchsia", arabicName: "فوشيا", hex: "#FF00FF", finish: "لامع", intensity: "مشرق", finishEn: "Gloss", intensityEn: "Bright", standard: "Classic", code: "FUC-01" },
        { name: "Hot Pink", arabicName: "وردي فاقع", hex: "#FF69B4", finish: "لامع", intensity: "جريء", finishEn: "Gloss", intensityEn: "Bold", standard: "Classic", code: "HOT-01" },
        { name: "Bubblegum", arabicName: "علكة", hex: "#FFC1CC", finish: "غير لامع", intensity: "فاتح", finishEn: "Matte", intensityEn: "Light", standard: "Classic", code: "BUB-01" },
        { name: "Salmon", arabicName: "سلموني", hex: "#FA8072", finish: "ساتان", intensity: "دافئ", finishEn: "Satin", intensityEn: "Warm", standard: "Classic", code: "SAL-01" },
        { name: "Magenta", arabicName: "ماجنتا", hex: "#FF0090", finish: "لامع", intensity: "عميق", finishEn: "Gloss", intensityEn: "Deep", standard: "Classic", code: "MAG-01" },
        { name: "Peach", arabicName: "خوخي", hex: "#FFE5B4", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Classic", code: "PEA-02" },
        { name: "Rose Gold", arabicName: "ذهب وردي", hex: "#B76E79", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "Classic", code: "ROS-02" }
      ]
    },
    {
      id: "metallic",
      name: "Metallic",
      arabicName: "المعدني",
      standard: "RAL, Pantone",
      colors: [
        // RAL Metallics
        { name: "RAL 9006 - White Aluminum", arabicName: "ألمنيوم أبيض", hex: "#A5A5A5", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "RAL", code: "9006" },
        { name: "RAL 9007 - Gray Aluminum", arabicName: "ألمنيوم رمادي", hex: "#8F8F8F", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "RAL", code: "9007" },
        { name: "RAL 1012 - Lemon Yellow", arabicName: "أصفر ليموني معدني", hex: "#DDAF32", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "RAL", code: "1012" },
        
        // Pantone Metallics
        { name: "Pantone 8001 C", arabicName: "ذهبي", hex: "#A67C4F", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "Pantone", code: "8001 C" },
        { name: "Pantone 8002 C", arabicName: "ذهبي وردي", hex: "#B5826E", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "Pantone", code: "8002 C" },
        { name: "Pantone 8003 C", arabicName: "برونزي", hex: "#B67342", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "Pantone", code: "8003 C" },
        { name: "Pantone 8004 C", arabicName: "نحاسي", hex: "#B86A4B", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "Pantone", code: "8004 C" },
        { name: "Pantone 8005 C", arabicName: "برونزي قديم", hex: "#9F6C4A", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "Pantone", code: "8005 C" },
        
        // Additional Metallics
        { name: "Silver", arabicName: "فضي", hex: "#C0C0C0", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "Classic", code: "SIL-02" },
        { name: "Gold", arabicName: "ذهبي", hex: "#FFD700", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "Classic", code: "GOL-02" },
        { name: "Rose Gold", arabicName: "ذهب وردي", hex: "#B76E79", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "Classic", code: "ROS-03" },
        { name: "Copper", arabicName: "نحاسي", hex: "#B87333", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "Classic", code: "COP-01" },
        { name: "Bronze", arabicName: "برونزي", hex: "#CD7F32", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "Classic", code: "BRO-02" },
        { name: "Chrome", arabicName: "كروم", hex: "#D3D3D3", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "Classic", code: "CHR-01" },
        { name: "Brass", arabicName: "نحاس أصفر", hex: "#B5A642", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "Classic", code: "BRA-01" },
        { name: "Titanium", arabicName: "تيتانيوم", hex: "#878681", finish: "لامع", intensity: "معدني", finishEn: "Gloss", intensityEn: "Metallic", standard: "Classic", code: "TIT-01" }
      ]
    },
    {
      id: "pastel",
      name: "Pastel",
      arabicName: "الباستيل",
      standard: "RAL, NCS, Pantone",
      colors: [
        // RAL Pastels
        { name: "RAL 9001 - Cream", arabicName: "كريمي باستيل", hex: "#FDF4E3", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "RAL", code: "9001" },
        { name: "RAL 9002 - Gray White", arabicName: "رمادي باستيل", hex: "#E7EBDA", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "RAL", code: "9002" },
        { name: "RAL 9010 - Pure White", arabicName: "أبيض باستيل", hex: "#F7F9F5", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "RAL", code: "9010" },
        
        // NCS Pastels
        { name: "NCS S 0502-Y", arabicName: "أصفر باستيل", hex: "#FFF8E7", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "NCS", code: "0502-Y" },
        { name: "NCS S 0502-R", arabicName: "وردي باستيل", hex: "#FFE4E1", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "NCS", code: "0502-R" },
        { name: "NCS S 0502-B", arabicName: "أزرق باستيل", hex: "#E0F2FE", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "NCS", code: "0502-B" },
        { name: "NCS S 0502-G", arabicName: "أخضر باستيل", hex: "#E0F0E0", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "NCS", code: "0502-G" },
        
        // Pantone Pastels
        { name: "Pantone 11-0616 TCX", arabicName: "أصفر باستيل", hex: "#F9F1CF", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Pantone", code: "11-0616" },
        { name: "Pantone 12-2903 TCX", arabicName: "وردي باستيل", hex: "#FADADD", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Pantone", code: "12-2903" },
        { name: "Pantone 13-4303 TCX", arabicName: "أزرق باستيل", hex: "#C6E9FA", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Pantone", code: "13-4303" },
        { name: "Pantone 13-6108 TCX", arabicName: "أخضر باستيل", hex: "#D0E5D9", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Pantone", code: "13-6108" },
        { name: "Pantone 14-3207 TCX", arabicName: "لافندر باستيل", hex: "#E3D7E8", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Pantone", code: "14-3207" },
        { name: "Pantone 14-1312 TCX", arabicName: "خوخي باستيل", hex: "#FFD6C0", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Pantone", code: "14-1312" },
        
        // Additional Pastels
        { name: "Mint Cream", arabicName: "نعناعي باستيل", hex: "#F5FFFA", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Classic", code: "MIN-02" },
        { name: "Baby Pink", arabicName: "وردي فاتح", hex: "#FFD1DC", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Classic", code: "BAB-02" },
        { name: "Baby Blue", arabicName: "أزرق فاتح", hex: "#89CFF0", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Classic", code: "BAB-03" },
        { name: "Lavender Blush", arabicName: "لافندر فاتح", hex: "#FFF0F5", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Classic", code: "LAV-02" },
        { name: "Seashell", arabicName: "صدفي", hex: "#FFF5EE", finish: "غير لامع", intensity: "ناعم", finishEn: "Matte", intensityEn: "Soft", standard: "Classic", code: "SEA-02" }
      ]
    }
  ];

  // ترتيب العائلات اللونية حسب الدرجات (من الفاتح للغامق)
  const sortedColorFamilies = [...colorFamilies].sort((a, b) => {
    const order = ["white", "beige", "pastel", "gray", "brown", "earth", "yellow", "orange", "red", "pink", "purple", "blue", "green", "metallic", "black"];
    return order.indexOf(a.id) - order.indexOf(b.id);
  });

  // فلترة الألوان - إزالة فلتر الداخلي وإظهار كل الألوان
  const filteredColorFamilies = sortedColorFamilies.map(family => ({
    ...family,
    colors: family.colors
  })).filter(family => family.colors.length > 0);

  // دالة عرض تفاصيل اللون في نافذة منبثقة
  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  // دالة إغلاق النافذة المنبثقة
  const closeModal = () => {
    setSelectedColor(null);
  };

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

      {/* العنصر الرئيسي مع LayoutID */}
      <div className="flex flex-col md:flex-row items-start gap-12 mt-16">
        <motion.div layoutId="paint-container" className="relative">
          <motion.img
            layoutId="paint-image"
            src="/images/paint.jpg"
            className="w-full md:w-96 h-auto rounded-2xl shadow-2xl"
            alt={language === 'ar' ? 'مجموعة الدهانات' : 'Paint Collection'}
          />
          <div className="absolute -bottom-4 -right-4 bg-[#4a3f36] text-white px-6 py-2 rounded-full text-sm tracking-widest shadow-xl">
            {language === 'ar' ? 'الدهانات' : 'PAINTS'}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-lg"
        >
          <h2 className="text-4xl md:text-5xl font-light text-[#4a3f36] tracking-wider mb-4">
            {language === 'ar' ? 'مجموعة الدهانات' : 'Paint Collection'}
          </h2>
          
          {/* ===== قسم النص الرئيسي + أنواع الدهانات ===== */}
          <div className="space-y-6 mb-8">
            <p className="text-[#6b5b4e] text-lg leading-relaxed font-light">
              {language === 'ar' 
                ? 'ألوان تروي قصصًا. من الهادئ العميق إلى المشرق الناعم، مجموعة الدهانات لدينا تقدم تشطيبات حصرية بجودة عالية ولمسات نهائية تتناسب مع كل روح تصميمية.'
                : 'Colors that tell stories. From deep calm to bright soft, our paint collection offers exclusive finishes with high quality and final touches that suit every design spirit.'}
            </p>
            
            {/* قسم أنواع الدهانات والتشطيبات - مرتب وأنيق */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/80">
              <h3 className="text-sm tracking-widest text-[#4a3f36] font-medium mb-4 border-b border-[#d6ccc2] pb-2">
                {language === 'ar' ? 'أنواع الدهانات والتشطيبات' : 'Paint Types & Finishes'}
              </h3>
              
              <div className="space-y-4">
                {/* دهان زيتي */}
                <div className="flex items-start gap-3 group hover:bg-[#fcf9f7] p-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 bg-[#4a3f36]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#4a3f36]/20 transition-colors">
                    <span className="text-[#4a3f36] text-sm font-medium">O</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4a3f36]">
                      {language === 'ar' ? 'دهان زيتي' : 'Oil-Based Paint'}
                    </h4>
                    <p className="text-xs text-[#6b5b4e] leading-relaxed mt-0.5">
                      {language === 'ar' 
                        ? 'مقاوم للماء وسهل التنظيف، يعطي لمعة عالية.' 
                        : 'Water-resistant and easy to clean, gives high gloss.'}
                    </p>
                  </div>
                </div>
                
                {/* دهان أكريليك مائي */}
                <div className="flex items-start gap-3 group hover:bg-[#fcf9f7] p-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 bg-[#4a3f36]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#4a3f36]/20 transition-colors">
                    <span className="text-[#4a3f36] text-sm font-medium">A</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4a3f36]">
                      {language === 'ar' ? 'دهان أكريليك مائي' : 'Acrylic / Emulsion Paint'}
                    </h4>
                    <p className="text-xs text-[#6b5b4e] leading-relaxed mt-0.5">
                      {language === 'ar' 
                        ? 'سريع الجفاف، مناسب للجدران الداخلية، متوفر بمات ولمعان متوسط (نص لمعة).' 
                        : 'Fast drying, suitable for interior walls, available in matte and medium gloss (semi-gloss).'}
                    </p>
                  </div>
                </div>
                
                {/* دهان مات */}
                <div className="flex items-start gap-3 group hover:bg-[#fcf9f7] p-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 bg-[#4a3f36]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#4a3f36]/20 transition-colors">
                    <span className="text-[#4a3f36] text-sm font-medium">M</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4a3f36]">
                      {language === 'ar' ? 'دهان مات' : 'Matte Paint'}
                    </h4>
                    <p className="text-xs text-[#6b5b4e] leading-relaxed mt-0.5">
                      {language === 'ar' 
                        ? 'يعطي لمسة ناعمة وبدون انعكاس للضوء، يخفي العيوب.' 
                        : 'Gives a soft touch with no light reflection, hides imperfections.'}
                    </p>
                  </div>
                </div>
                
                {/* دهان نصف لامع / نص لمعة */}
                <div className="flex items-start gap-3 group hover:bg-[#fcf9f7] p-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 bg-[#4a3f36]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#4a3f36]/20 transition-colors">
                    <span className="text-[#4a3f36] text-sm font-medium">S</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4a3f36]">
                      {language === 'ar' ? 'دهان نصف لامع / نص لمعة' : 'Satin / Semi-Gloss'}
                    </h4>
                    <p className="text-xs text-[#6b5b4e] leading-relaxed mt-0.5">
                      {language === 'ar' 
                        ? 'يعطي لمعان متوسط، سهل التنظيف، ممتاز للمطابخ والحمامات.' 
                        : 'Medium gloss, easy to clean, excellent for kitchens and bathrooms.'}
                    </p>
                  </div>
                </div>
                
                {/* دهان لامع */}
                <div className="flex items-start gap-3 group hover:bg-[#fcf9f7] p-2 rounded-lg transition-all duration-300">
                  <div className="w-8 h-8 bg-[#4a3f36]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#4a3f36]/20 transition-colors">
                    <span className="text-[#4a3f36] text-sm font-medium">G</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#4a3f36]">
                      {language === 'ar' ? 'دهان لامع' : 'Gloss Paint'}
                    </h4>
                    <p className="text-xs text-[#6b5b4e] leading-relaxed mt-0.5">
                      {language === 'ar' 
                        ? 'لمعان قوي، مقاوم للرطوبة، يستخدم للأبواب والخشب.' 
                        : 'Strong gloss, moisture resistant, used for doors and wood.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========== قسم الألوان الكامل ========== */}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-24 mb-12"
      >
        <h3 className="text-3xl font-light text-[#4a3f36] tracking-wider mb-2">
          {language === 'ar' ? 'المكتبة اللونية الكاملة' : 'Complete Color Library'}
        </h3>
        <p className="text-[#6b5b4e] text-base font-light mb-4">
          {language === 'ar' 
            ? 'جميع الألوان مجمعة حسب العائلة اللونية - من الأبيض إلى الأسود' 
            : 'All colors grouped by color family - from white to black'}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-[#4a3f36]/10 px-3 py-1 rounded-full text-xs text-[#4a3f36]">RAL Classic</span>
          <span className="bg-[#4a3f36]/10 px-3 py-1 rounded-full text-xs text-[#4a3f36]">NCS</span>
          <span className="bg-[#4a3f36]/10 px-3 py-1 rounded-full text-xs text-[#4a3f36]">Pantone</span>
          <span className="bg-[#4a3f36]/10 px-3 py-1 rounded-full text-xs text-[#4a3f36]">BS</span>
          <span className="bg-[#4a3f36]/10 px-3 py-1 rounded-full text-xs text-[#4a3f36]">Classic</span>
        </div>
        <div className="w-24 h-0.5 bg-[#d6ccc2] mt-4"></div>
      </motion.div>

      {/* Grid العائلات اللونية - جميع الألوان مجمعة مع بعض */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="space-y-12"
      >
        {filteredColorFamilies.map((family, index) => (
          <motion.div
            key={family.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white/70 rounded-3xl p-6 backdrop-blur-sm border border-white/80 shadow-lg hover:shadow-xl transition-all duration-500"
          >
            {/* عنوان العائلة اللونية */}
            <div className="flex flex-wrap items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full border-2 border-white shadow-lg`} style={{ backgroundColor: family.colors[Math.floor(family.colors.length/2)]?.hex }}></div>
                <div>
                  <h4 className="text-2xl font-light text-[#4a3f36] flex items-center gap-2">
                    {language === 'ar' ? family.arabicName : family.name}
                    <span className="text-sm bg-[#f0ebe7] px-3 py-1 rounded-full text-[#6b5b4e] font-normal">
                      {family.standard}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {language === 'ar' 
                      ? `${family.colors.length} درجة لونية حسب معايير ${family.standard}` 
                      : `${family.colors.length} shades according to ${family.standard} standards`}
                  </p>
                </div>
              </div>
              <span className="text-sm bg-[#4a3f36] text-white px-4 py-1.5 rounded-full shadow-md">
                {family.colors.length} {language === 'ar' ? 'لون' : 'colors'}
              </span>
            </div>

            {/* شبكة درجات اللون - متجاوبة */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
              {family.colors.map((color, colorIndex) => (
                <motion.div
                  key={colorIndex}
                  whileHover={{ y: -8, scale: 1.05 }}
                  className="group cursor-pointer"
                  onClick={() => handleColorClick(color)}
                >
                  <div className="relative">
                    <div 
                      className="h-20 rounded-lg shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:shadow-black/20"
                      style={{ 
                        backgroundColor: color.hex, 
                        border: color.hex === "#FFFFFF" || color.hex.includes("F5F5F5") || color.hex.includes("FFF") ? "1px solid #e2e2e2" : "none" 
                      }}
                    >
                      {/* Overlay عند الهوفر */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300 flex items-end justify-start p-2">
                        <span className="bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full text-[8px] font-medium text-[#4a3f36] shadow-lg">
                          {color.standard}
                        </span>
                      </div>
                    </div>
                    {/* شريط معلومات */}
                    <div className="absolute -bottom-2 left-0 right-0 mx-auto w-11/12 bg-white/95 backdrop-blur-sm rounded-md p-1.5 shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-0 group-hover:-translate-y-2 border border-gray-100">
                      <p className="text-[9px] font-bold text-[#4a3f36] text-center truncate">{color.code}</p>
                      <p className="text-[8px] text-gray-500 text-center truncate">{color.hex}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 px-1">
                    <h5 className="text-[#4a3f36] font-medium text-[11px] truncate">
                      {language === 'ar' 
                        ? color.arabicName
                        : color.name}
                    </h5>
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-medium ${
                        color.finishEn === "Gloss" ? "bg-yellow-100 text-yellow-800 border border-yellow-200" :
                        color.finishEn === "Satin" ? "bg-blue-100 text-blue-800 border border-blue-200" :
                        "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}>
                        {language === 'ar' ? color.finish : color.finishEn}
                      </span>
                      <span className="text-[7px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full border border-purple-200">
                        {color.intensityEn}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal لعرض تفاصيل اللون بشكل أكبر */}
      <AnimatePresence>
        {selectedColor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden cursor-default"
            >
              <div className="flex flex-col md:flex-row">
                {/* قسم اللون الكبير */}
                <div className="md:w-1/2 h-64 md:h-auto relative">
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      backgroundColor: selectedColor.hex,
                      backgroundImage: selectedColor.hex === "#FFFFFF" || selectedColor.hex.includes("F5F5F5") || selectedColor.hex.includes("FFF") 
                        ? "radial-gradient(circle at 20% 30%, rgba(0,0,0,0.05) 1px, transparent 1px)" 
                        : "none",
                      backgroundSize: "20px 20px"
                    }}
                  >
                    {/* شريط علوي مع معلومات أساسية */}
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white text-xs font-mono bg-black/50 inline-block px-2 py-1 rounded backdrop-blur-sm">
                            {selectedColor.code}
                          </p>
                        </div>
                        <button 
                          onClick={closeModal}
                          className="text-white hover:text-gray-200 transition-colors bg-black/50 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    
                    {/* معلومات اللون في المنتصف */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-[#4a3f36] shadow-lg">
                          {selectedColor.standard}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm ${
                          selectedColor.finishEn === "Gloss" ? "bg-yellow-100 text-yellow-800" :
                          selectedColor.finishEn === "Satin" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {language === 'ar' ? selectedColor.finish : selectedColor.finishEn}
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm">
                          {selectedColor.intensityEn}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* قسم التفاصيل */}
                <div className="md:w-1/2 p-8 bg-white">
                  <h3 className="text-3xl font-light text-[#4a3f36] mb-2">
                    {language === 'ar' ? selectedColor.arabicName : selectedColor.name}
                  </h3>
                  
                  <div className="space-y-4 mt-6">
                    <div className="border-b border-[#d6ccc2] pb-3">
                      <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'رمز اللون' : 'Color Code'}</p>
                      <p className="text-lg font-mono text-[#4a3f36]">{selectedColor.code}</p>
                    </div>
                    
                    <div className="border-b border-[#d6ccc2] pb-3">
                      <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'القيمة السداسية' : 'HEX Value'}</p>
                      <p className="text-lg font-mono text-[#4a3f36]">{selectedColor.hex}</p>
                    </div>
                    
                    <div className="border-b border-[#d6ccc2] pb-3">
                      <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'المعيار' : 'Standard'}</p>
                      <p className="text-[#4a3f36] font-medium">{selectedColor.standard}</p>
                    </div>
                    
                    <div className="border-b border-[#d6ccc2] pb-3">
                      <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'التشطيب' : 'Finish'}</p>
                      <p className="text-[#4a3f36]">{language === 'ar' ? selectedColor.finish : selectedColor.finishEn}</p>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-xs text-gray-500 mb-1">{language === 'ar' ? 'درجة اللون' : 'Intensity'}</p>
                      <p className="text-[#4a3f36]">{selectedColor.intensityEn}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={closeModal}
                    className="mt-8 w-full bg-[#4a3f36] text-white py-3 rounded-full hover:bg-[#5c4f41] transition-colors duration-300 font-medium shadow-md"
                  >
                    {language === 'ar' ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}