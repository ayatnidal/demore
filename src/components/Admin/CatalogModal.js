// src/components/Admin/CatalogModal.js
import { useState, useEffect, useRef } from "react";
import { 
  IconX, 
  IconImage, 
  IconPackage, 
  IconInfo, 
  IconShield,
  IconCheck,
  IconTrash
} from "../Icons";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

const CatalogModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  product, 
  isEdit = false, 
  isViewer = false,
  currentLanguage = 'ar',
  showNotification
}) => {
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    category: "",
    subCategory: "",
    brand: "",
    model: "",
    descriptionAr: "",
    descriptionEn: "",
    featuresAr: [""],
    featuresEn: [""],
    specifications: {},
    price: "",
    currency: "shekel",
    unit: "square_meter",
    availableColors: [],
    availableSizes: [],
    material: "",
    finish: "",
    thickness: "",
    warranty: "",
    installationInfo: "",
    maintenanceInfo: "",
    images: [],
    isActive: true,
    isFeatured: false,
    tagsAr: [],
    tagsEn: [],
    stockQuantity: 0,
    sku: "",
    barcode: "",
    supplier: "",
    leadTime: "",
    discount: 0,
    isOnSale: false
  });

  const [imageUrls, setImageUrls] = useState([]);
  const [newTagAr, setNewTagAr] = useState("");
  const [newTagEn, setNewTagEn] = useState("");
  const [newColor, setNewColor] = useState("#3b82f6");
  const [newSize, setNewSize] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  
  const fileInputRef = useRef(null);
  const featureInputArRef = useRef(null);
  const featureInputEnRef = useRef(null);

  // دالة للترجمة
  const t = (arText, enText) => {
    return currentLanguage === 'ar' ? arText : enText;
  };

  // الفئات الرئيسية للكتالوج - مع دعم اللغتين
  const mainCategories = [
    { value: "paints", label: t("دهانات", "Paints") },
    { value: "flooring", label: t("أرضيات", "Flooring") },
    { value: "tiles", label: t("بلاط", "Tiles") },
    { value: "wood", label: t("خشب", "Wood") },
    { value: "steel", label: t("حديد", "Steel") },
    { value: "wallpaper", label: t("ورق حائط", "Wallpaper") },
    { value: "lighting", label: t("إضاءة", "Lighting") },
    { value: "fabric", label: t("قماش", "Fabric") },
    { value: "curtains", label: t("ستائر", "Curtains") },
    { value: "gypsum", label: t("جبس", "Gypsum") },
    { value: "aluminum", label: t("ألمنيوم", "Aluminum") }
  ];

  // الفئات الفرعية لكل فئة رئيسية
  const getSubCategories = () => {
    const subCategories = {
      paints: [
        { value: "interior-paint", label: t("دهان داخلي", "Interior Paint") },
        { value: "exterior-paint", label: t("دهان خارجي", "Exterior Paint") },
        { value: "wood-paint", label: t("دهان خشب", "Wood Paint") },
        { value: "metal-paint", label: t("دهان معادن", "Metal Paint") },
        { value: "anti-rust-paint", label: t("دهان مضاد للصدأ", "Anti-Rust Paint") },
        { value: "waterproof-paint", label: t("دهان مقاوم للماء", "Waterproof Paint") },
        { value: "heat-resistant-paint", label: t("دهان مقاوم للحرارة", "Heat Resistant Paint") },
        { value: "primer", label: t("برايمر", "Primer") },
        { value: "varnish", label: t("ورنيش", "Varnish") },
        { value: "lacquer", label: t("لاكيه", "Lacquer") },
        { value: "enamel-paint", label: t("دهان إينامل", "Enamel Paint") },
        { value: "acrylic-paint", label: t("دهان أكريليك", "Acrylic Paint") }
      ],
      
      flooring: [
        { value: "parquet", label: t("باركيه", "Parquet") },
        { value: "laminate", label: t("لامينيت", "Laminate") },
        { value: "vinyl-flooring", label: t("فينيل", "Vinyl Flooring") },
        { value: "engineered-wood", label: t("خشب هندسي", "Engineered Wood") },
        { value: "solid-wood", label: t("خشب صلب", "Solid Wood") },
        { value: "bamboo-flooring", label: t("أرضيات بامبو", "Bamboo Flooring") },
        { value: "cork-flooring", label: t("فلين", "Cork Flooring") },
        { value: "rubber-flooring", label: t("أرضيات مطاطية", "Rubber Flooring") }
      ],
      
      tiles: [
        { value: "ceramic-tiles", label: t("سيراميك", "Ceramic Tiles") },
        { value: "porcelain-tiles", label: t("بورسلين", "Porcelain Tiles") },
        { value: "mosaic-tiles", label: t("موزايكو", "Mosaic Tiles") },
        { value: "marble-tiles", label: t("رخام", "Marble Tiles") },
        { value: "granite-tiles", label: t("جرانيت", "Granite Tiles") },
        { value: "travertine-tiles", label: t("حجر طبيعي", "Travertine Tiles") },
        { value: "limestone-tiles", label: t("حجر جيري", "Limestone Tiles") },
        { value: "slate-tiles", label: t("أردواز", "Slate Tiles") },
        { value: "terracotta-tiles", label: t("طوب", "Terracotta Tiles") },
        { value: "glass-tiles", label: t("بلاط زجاجي", "Glass Tiles") },
        { value: "metal-tiles", label: t("بلاط معدني", "Metal Tiles") }
      ],
      
      wood: [
        { value: "wood-doors", label: t("أبواب خشب", "Wood Doors") },
        { value: "wood-windows", label: t("نوافذ خشب", "Wood Windows") },
        { value: "wood-flooring", label: t("أرضيات خشب", "Wood Flooring") },
        { value: "wood-cladding", label: t("كسوة خشب", "Wood Cladding") },
        { value: "wood-beams", label: t("عوارض خشب", "Wood Beams") },
        { value: "wood-panels", label: t("ألواح خشب", "Wood Panels") },
        { value: "wood-molding", label: t("كورنيش خشب", "Wood Molding") },
        { value: "wood-stairs", label: t("سلالم خشب", "Wood Stairs") },
        { value: "pergola-wood", label: t("برجولات خشب", "Wood Pergolas") },
        { value: "oak-wood", label: t("خشب بلوط", "Oak Wood") },
        { value: "pine-wood", label: t("خشب صنوبر", "Pine Wood") },
        { value: "teak-wood", label: t("خشب تيك", "Teak Wood") },
        { value: "walnut-wood", label: t("خشب جوز", "Walnut Wood") },
        { value: "mahogany-wood", label: t("خشب ماهوجني", "Mahogany Wood") },
        { value: "maple-wood", label: t("خشب قيقب", "Maple Wood") },
        { value: "cherry-wood", label: t("خشب كرز", "Cherry Wood") },
        { value: "beech-wood", label: t("خشب زان", "Beech Wood") },
        { value: "ash-wood", label: t("خشب رماد", "Ash Wood") },
        { value: "bamboo-wood", label: t("خشب بامبو", "Bamboo Wood") },
        { value: "plywood", label: t("أبلاكاج", "Plywood") },
        { value: "mdf", label: t("إم دي إف", "MDF") },
        { value: "hdf", label: t("إتش دي إف", "HDF") },
        { value: "particle-board", label: t("خشب حبيبي", "Particle Board") }
      ],
      
      steel: [
        { value: "structural-steel", label: t("حديد إنشائي", "Structural Steel") },
        { value: "steel-doors", label: t("أبواب حديد", "Steel Doors") },
        { value: "steel-windows", label: t("نوافذ حديد", "Steel Windows") },
        { value: "steel-railing", label: t("درابزين حديد", "Steel Railing") },
        { value: "steel-gates", label: t("بوابات حديد", "Steel Gates") },
        { value: "steel-fencing", label: t("أسوار حديد", "Steel Fencing") },
        { value: "steel-beams", label: t("عوارض حديد", "Steel Beams") },
        { value: "steel-columns", label: t("أعمدة حديد", "Steel Columns") },
        { value: "steel-sheets", label: t("ألواح حديد", "Steel Sheets") },
        { value: "steel-tubes", label: t("أنابيب حديد", "Steel Tubes") },
        { value: "stainless-steel", label: t("ستانلس ستيل", "Stainless Steel") },
        { value: "galvanized-steel", label: t("حديد مجلفن", "Galvanized Steel") },
        { value: "corrugated-steel", label: t("حديد مموج", "Corrugated Steel") }
      ],
      
      wallpaper: [
        { value: "vinyl-wallpaper", label: t("فينيل", "Vinyl Wallpaper") },
        { value: "non-woven-wallpaper", label: t("غير منسوج", "Non-Woven Wallpaper") },
        { value: "paper-wallpaper", label: t("ورقي", "Paper Wallpaper") },
        { value: "fabric-wallpaper", label: t("قماشي", "Fabric Wallpaper") },
        { value: "grasscloth-wallpaper", label: t("عشبي", "Grasscloth Wallpaper") },
        { value: "foil-wallpaper", label: t("معدني", "Foil Wallpaper") },
        { value: "textured-wallpaper", label: t("ملمس", "Textured Wallpaper") },
        { value: "3d-wallpaper", label: t("ثلاثي الأبعاد", "3D Wallpaper") },
        { value: "custom-wallpaper", label: t("مخصص", "Custom Wallpaper") },
        { value: "removable-wallpaper", label: t("قابل للإزالة", "Removable Wallpaper") },
        { value: "waterproof-wallpaper", label: t("مقاوم للماء", "Waterproof Wallpaper") }
      ],
      
      lighting: [
        { value: "ceiling-lights", label: t("إنارة سقف", "Ceiling Lights") },
        { value: "wall-lights", label: t("إنارة حائط", "Wall Lights") },
        { value: "floor-lamps", label: t("مصابيح أرضية", "Floor Lamps") },
        { value: "table-lamps", label: t("مصابيح طاولة", "Table Lamps") },
        { value: "pendant-lights", label: t("إنارة معلقة", "Pendant Lights") },
        { value: "spotlights", label: t("سبوت لايت", "Spotlights") },
        { value: "track-lighting", label: t("إنارة مسار", "Track Lighting") },
        { value: "recessed-lighting", label: t("إنارة مخفية", "Recessed Lighting") },
        { value: "led-strips", label: t("شرائط LED", "LED Strips") },
        { value: "chandeliers", label: t("ثريات", "Chandeliers") },
        { value: "sconces", label: t("شموع حائط", "Sconces") },
        { value: "outdoor-lighting", label: t("إنارة خارجية", "Outdoor Lighting") },
        { value: "garden-lights", label: t("إنارة حدائق", "Garden Lights") },
        { value: "emergency-lighting", label: t("إنارة طوارئ", "Emergency Lighting") },
        { value: "smart-lighting", label: t("إنارة ذكية", "Smart Lighting") }
      ],
      
      fabric: [
        { value: "upholstery-fabric", label: t("قماش تنجيد", "Upholstery Fabric") },
        { value: "curtain-fabric", label: t("قماش ستائر", "Curtain Fabric") },
        { value: "drapery-fabric", label: t("قماش ديكور", "Drapery Fabric") },
        { value: "linen-fabric", label: t("كتان", "Linen Fabric") },
        { value: "silk-fabric", label: t("حرير", "Silk Fabric") },
        { value: "cotton-fabric", label: t("قطن", "Cotton Fabric") },
        { value: "polyester-fabric", label: t("بوليستر", "Polyester Fabric") },
        { value: "velvet-fabric", label: t("مخمل", "Velvet Fabric") },
        { value: "wool-fabric", label: t("صوف", "Wool Fabric") },
        { value: "leather-fabric", label: t("جلد", "Leather Fabric") },
        { value: "faux-leather", label: t("جلد صناعي", "Faux Leather") },
        { value: "suede-fabric", label: t("جلد زغب", "Suede Fabric") },
        { value: "jacquard-fabric", label: t("جاكار", "Jacquard Fabric") },
        { value: "brocade-fabric", label: t("ديباج", "Brocade Fabric") },
        { value: "damask-fabric", label: t("دامسك", "Damask Fabric") }
      ],
      
      curtains: [
        { value: "blackout-curtains", label: t("ستائر عاتمة", "Blackout Curtains") },
        { value: "sheer-curtains", label: t("ستائر شفافة", "Sheer Curtains") },
        { value: "thermal-curtains", label: t("ستائر عازلة", "Thermal Curtains") },
        { value: "voile-curtains", label: t("ستائر فويل", "Voile Curtains") },
        { value: "roman-curtains", label: t("ستائر رومانية", "Roman Curtains") },
        { value: "roller-curtains", label: t("ستائر رول", "Roller Curtains") },
        { value: "vertical-blinds", label: t("ستائر عمودية", "Vertical Blinds") },
        { value: "horizontal-blinds", label: t("ستائر أفقية", "Horizontal Blinds") },
        { value: "pleated-curtains", label: t("ستائر مطوية", "Pleated Curtains") },
        { value: "eyelet-curtains", label: t("ستائر مثقوبة", "Eyelet Curtains") },
        { value: "tab-top-curtains", label: t("ستائر بشرائط", "Tab Top Curtains") },
        { value: "panel-track-curtains", label: t("ستائر بانل", "Panel Track Curtains") },
        { value: "cafe-curtains", label: t("ستائر كافيه", "Cafe Curtains") },
        { value: "shower-curtains", label: t("ستائر حمام", "Shower Curtains") }
      ],
      
      gypsum: [
        { value: "gypsum-boards", label: t("ألواح جبس", "Gypsum Boards") },
        { value: "gypsum-ceiling", label: t("أسقف جبس", "Gypsum Ceiling") },
        { value: "gypsum-partitions", label: t("فواصل جبس", "Gypsum Partitions") },
        { value: "gypsum-cornices", label: t("كورنيش جبس", "Gypsum Cornices") },
        { value: "gypsum-molding", label: t("قوالب جبس", "Gypsum Molding") },
        { value: "gypsum-columns", label: t("أعمدة جبس", "Gypsum Columns") },
        { value: "gypsum-arches", label: t("أقواس جبس", "Gypsum Arches") },
        { value: "gypsum-roses", label: t("ورد جبس", "Gypsum Roses") },
        { value: "gypsum-panels", label: t("بانل جبس", "Gypsum Panels") },
        { value: "waterproof-gypsum", label: t("جبس مقاوم للماء", "Waterproof Gypsum") },
        { value: "fire-resistant-gypsum", label: t("جبس مقاوم للحريق", "Fire Resistant Gypsum") },
        { value: "soundproof-gypsum", label: t("جبس عازل للصوت", "Soundproof Gypsum") }
      ],
      
      aluminum: [
        { value: "aluminum-windows", label: t("نوافذ ألمنيوم", "Aluminum Windows") },
        { value: "aluminum-doors", label: t("أبواب ألمنيوم", "Aluminum Doors") },
        { value: "sliding-doors", label: t("أبواب انزلاقية", "Sliding Doors") },
        { value: "folding-doors", label: t("أبواب مطوية", "Folding Doors") },
        { value: "swing-doors", label: t("أبواب مفصلية", "Swing Doors") },
        { value: "aluminum-curtain-walls", label: t("جدران ستائرية", "Aluminum Curtain Walls") },
        { value: "aluminum-louvers", label: t("مشربيات ألمنيوم", "Aluminum Louvers") },
        { value: "aluminum-railings", label: t("درابزين ألمنيوم", "Aluminum Railings") },
        { value: "aluminum-fencing", label: t("أسوار ألمنيوم", "Aluminum Fencing") },
        { value: "aluminum-gates", label: t("بوابات ألمنيوم", "Aluminum Gates") },
        { value: "aluminum-structures", label: t("هياكل ألمنيوم", "Aluminum Structures") },
        { value: "pergola-aluminum", label: t("برجولات ألمنيوم", "Aluminum Pergolas") },
        { value: "aluminum-beams", label: t("عوارض ألمنيوم", "Aluminum Beams") },
        { value: "aluminum-profiles", label: t("بروفيلات ألمنيوم", "Aluminum Profiles") },
        { value: "aluminum-sheets", label: t("ألواح ألمنيوم", "Aluminum Sheets") },
        { value: "aluminum-tubes", label: t("أنابيب ألمنيوم", "Aluminum Tubes") },
        { value: "anodized-aluminum", label: t("ألمنيوم مؤكسد", "Anodized Aluminum") },
        { value: "powder-coated-aluminum", label: t("ألمنيوم مطلي", "Powder Coated Aluminum") }
      ]
    };
    
    return subCategories;
  };

  // الوحدات المتاحة - مع دعم اللغتين
  const units = [
    { value: "square_meter", label: t("متر مربع", "Square Meter") },
    { value: "linear_meter", label: t("متر طولي", "Linear Meter") },
    { value: "piece", label: t("قطعة", "Piece") },
    { value: "box", label: t("علبة", "Box") },
    { value: "liter", label: t("لتر", "Liter") },
    { value: "kilogram", label: t("كيلو", "Kilogram") },
    { value: "set", label: t("مجموعة", "Set") },
    { value: "carton", label: t("كرتون", "Carton") },
    { value: "bale", label: t("بالة", "Bale") },
    { value: "roll", label: t("رول", "Roll") }
  ];
  
  // ==============================
  // دالة رفع الصور إلى Firebase Storage
  // ==============================

  const uploadImageToFirebase = async (file) => {
    try {
      const uniqueId = uuidv4();
      const fileExtension = file.name.split('.').pop();
      const fileName = `products/${uniqueId}.${fileExtension}`;
      const storageRef = ref(storage, fileName);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      return {
        url: downloadURL,
        path: fileName
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // ==============================
  // دالة حذف الصور من Firebase Storage
  // ==============================

  const deleteImageFromFirebase = async (imagePath) => {
    try {
      if (imagePath) {
        const storageRef = ref(storage, imagePath);
        await deleteObject(storageRef);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      // لا نرمي الخطأ لأن الصورة قد تكون محذوفة مسبقاً
    }
  };

  // ==============================
  // تهيئة البيانات عند فتح المودال
  // ==============================

  useEffect(() => {
    if (isEdit && product) {
      // تهيئة البيانات للمنتج الموجود
      setFormData({
        nameAr: product.name?.ar || product.nameAr || "",
        nameEn: product.name?.en || product.nameEn || "",
        category: product.category || "",
        subCategory: product.subCategory || "",
        brand: product.brand || "",
        model: product.model || "",
        descriptionAr: product.description?.ar || product.descriptionAr || "",
        descriptionEn: product.description?.en || product.descriptionEn || "",
        featuresAr: product.features?.ar || product.featuresAr || [""],
        featuresEn: product.features?.en || product.featuresEn || [""],
        specifications: product.specifications || {},
        price: product.price || "",
        currency: product.currency || "shekel",
        unit: product.unit || "square_meter",
        availableColors: product.availableColors || [],
        availableSizes: product.availableSizes || [],
        material: product.material || "",
        finish: product.finish || "",
        thickness: product.thickness || "",
        warranty: product.warranty || "",
        installationInfo: product.installationInfo || "",
        maintenanceInfo: product.maintenanceInfo || "",
        images: product.images || [],
        isActive: product.isActive !== undefined ? product.isActive : true,
        isFeatured: product.isFeatured || false,
        tagsAr: product.tags?.ar || product.tagsAr || [],
        tagsEn: product.tags?.en || product.tagsEn || [],
        stockQuantity: product.stockQuantity || 0,
        sku: product.sku || "",
        barcode: product.barcode || "",
        supplier: product.supplier || "",
        leadTime: product.leadTime || "",
        discount: product.discount || 0,
        isOnSale: product.isOnSale || false
      });
      
      // حفظ الروابط الحالية
      setImageUrls(product.images || []);
      setUploadedImages(product.images || []);
    } else if (!isEdit) {
      // إعادة التعيين لنموذج جديد
      setFormData({
        nameAr: "",
        nameEn: "",
        category: "",
        subCategory: "",
        brand: "",
        model: "",
        descriptionAr: "",
        descriptionEn: "",
        featuresAr: [""],
        featuresEn: [""],
        specifications: {},
        price: "",
        currency: "shekel",
        unit: "square_meter",
        availableColors: [],
        availableSizes: [],
        material: "",
        finish: "",
        thickness: "",
        warranty: "",
        installationInfo: "",
        maintenanceInfo: "",
        images: [],
        isActive: true,
        isFeatured: false,
        tagsAr: [],
        tagsEn: [],
        stockQuantity: 0,
        sku: "",
        barcode: "",
        supplier: "",
        leadTime: "",
        discount: 0,
        isOnSale: false
      });
      setImageUrls([]);
      setUploadedImages([]);
      setImagesToDelete([]);
    }
  }, [isEdit, product, isOpen]);

  // ==============================
  // دالة إغلاق المودال
  // ==============================

  const handleClose = () => {
    // تنظيف الصور المؤقتة التي تم رفعها ولم تحفظ
    if (!isEdit) {
      uploadedImages.forEach(image => {
        if (image.path && !formData.images.includes(image.url)) {
          deleteImageFromFirebase(image.path);
        }
      });
    }
    
    onClose();
  };

  if (!isOpen) return null;

  // ==============================
  // دوال إدارة النموذج
  // ==============================

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'price' || name === 'stockQuantity' || name === 'discount') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddFeature = (lang) => {
    if (lang === 'ar' && featureInputArRef.current?.value.trim()) {
      const newFeature = featureInputArRef.current.value.trim();
      setFormData(prev => ({
        ...prev,
        featuresAr: [...prev.featuresAr.filter(f => f.trim()), newFeature]
      }));
      featureInputArRef.current.value = "";
    } else if (lang === 'en' && featureInputEnRef.current?.value.trim()) {
      const newFeature = featureInputEnRef.current.value.trim();
      setFormData(prev => ({
        ...prev,
        featuresEn: [...prev.featuresEn.filter(f => f.trim()), newFeature]
      }));
      featureInputEnRef.current.value = "";
    }
  };

  const handleRemoveFeature = (lang, index) => {
    if (lang === 'ar') {
      setFormData(prev => ({
        ...prev,
        featuresAr: prev.featuresAr.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        featuresEn: prev.featuresEn.filter((_, i) => i !== index)
      }));
    }
  };

  // ==============================
  // دوال إدارة الصور
  // ==============================

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setUploadingImages(true);
    
    try {
      const uploadPromises = files.map(file => uploadImageToFirebase(file));
      const uploadedResults = await Promise.all(uploadPromises);
      
      const newImageUrls = uploadedResults.map(result => result.url);
      const newUploadedImages = uploadedResults;
      
      // تحديث الحالات
      setImageUrls(prev => [...prev, ...newImageUrls]);
      setUploadedImages(prev => [...prev, ...newUploadedImages]);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImageUrls]
      }));
      
      if (showNotification) {
        showNotification("success", t("تم رفع الصور بنجاح", "Images uploaded successfully"));
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      if (showNotification) {
        showNotification("error", t("فشل في رفع الصور", "Failed to upload images"));
      }
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = async (index) => {
    const imageToRemove = imageUrls[index];
    
    // إذا كانت الصورة محفوظة في قاعدة البيانات (في حالة التعديل)
    if (isEdit && product && product.images && product.images.includes(imageToRemove)) {
      // إضافة إلى قائمة الحذف
      setImagesToDelete(prev => [...prev, imageToRemove]);
    }
    
    // إزالة من القوائم المحلية
    setImageUrls(prev => prev.filter((_, i) => i !== index));
    setUploadedImages(prev => prev.filter((img) => {
      if (typeof img === 'string') return img !== imageToRemove;
      return img.url !== imageToRemove;
    }));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // ==============================
  // دوال إدارة الوسوم
  // ==============================

  const handleAddTag = (lang) => {
    if (lang === 'ar' && newTagAr.trim()) {
      setFormData(prev => ({
        ...prev,
        tagsAr: [...prev.tagsAr, newTagAr.trim()]
      }));
      setNewTagAr("");
    } else if (lang === 'en' && newTagEn.trim()) {
      setFormData(prev => ({
        ...prev,
        tagsEn: [...prev.tagsEn, newTagEn.trim()]
      }));
      setNewTagEn("");
    }
  };

  const handleRemoveTag = (lang, index) => {
    if (lang === 'ar') {
      setFormData(prev => ({
        ...prev,
        tagsAr: prev.tagsAr.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        tagsEn: prev.tagsEn.filter((_, i) => i !== index)
      }));
    }
  };

  // ==============================
  // دوال إدارة الألوان والأحجام
  // ==============================

  const handleAddColor = () => {
    if (newColor) {
      setFormData(prev => ({
        ...prev,
        availableColors: [...prev.availableColors, newColor]
      }));
    }
  };

  const handleRemoveColor = (index) => {
    setFormData(prev => ({
      ...prev,
      availableColors: prev.availableColors.filter((_, i) => i !== index)
    }));
  };

  const handleAddSize = () => {
    if (newSize.trim()) {
      setFormData(prev => ({
        ...prev,
        availableSizes: [...prev.availableSizes, newSize.trim()]
      }));
      setNewSize("");
    }
  };

  const handleRemoveSize = (index) => {
    setFormData(prev => ({
      ...prev,
      availableSizes: prev.availableSizes.filter((_, i) => i !== index)
    }));
  };

  // ==============================
  // دالة إرسال النموذج
  // ==============================

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // حذف الصور المحددة للحذف
      for (const imageUrl of imagesToDelete) {
        await deleteImageFromFirebase(imageUrl);
      }
      
      // تحضير البيانات للإرسال
      const processedFormData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : 0,
        stockQuantity: formData.stockQuantity ? parseInt(formData.stockQuantity, 10) : 0,
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        name: {
          ar: formData.nameAr,
          en: formData.nameEn
        },
        description: {
          ar: formData.descriptionAr,
          en: formData.descriptionEn
        },
        features: {
          ar: formData.featuresAr.filter(f => f.trim()),
          en: formData.featuresEn.filter(f => f.trim())
        },
        tags: {
          ar: formData.tagsAr,
          en: formData.tagsEn
        },
        images: formData.images,
        // إزالة الحقول المؤقتة
        nameAr: undefined,
        nameEn: undefined,
        descriptionAr: undefined,
        descriptionEn: undefined,
        featuresAr: undefined,
        featuresEn: undefined,
        tagsAr: undefined,
        tagsEn: undefined
      };
      
      // إرسال البيانات
      onSubmit(processedFormData);
      
      if (showNotification) {
        showNotification(
          "success",
          isEdit 
            ? t("تم تحديث المنتج بنجاح", "Product updated successfully") 
            : t("تم إضافة المنتج بنجاح", "Product added successfully")
        );
      }
      
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      if (showNotification) {
        showNotification("error", t("حدث خطأ أثناء حفظ البيانات", "Error saving data"));
      }
    }
  };

  // ==============================
  // دوال مساعدة للوسوم
  // ==============================

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  // ==============================
  // مكونات مساعدة
  // ==============================

  const renderImagePreview = () => {
    if (uploadingImages) {
      return (
        <div className="col-span-full flex justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-slate-500">{t("جاري رفع الصور...", "Uploading images...")}</p>
          </div>
        </div>
      );
    }
    
    if (imageUrls.length === 0) {
      return (
        <div className="col-span-full text-center py-8">
          <IconImage className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <p className="text-slate-500">{t("لم يتم رفع أي صور للمنتج", "No product images uploaded")}</p>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm">
            <img
              src={url}
              alt={`Product ${index + 1}`}
              className="w-full h-40 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/300x200?text=Image+Error";
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600 shadow-lg"
              title={t("حذف الصورة", "Delete image")}
            >
              <IconTrash className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  // ==============================
  // الواجهة الرئيسية
  // ==============================

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
        {/* الهيدر */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <IconPackage className={currentLanguage === 'ar' ? "ml-2 w-5 h-5" : "mr-2 w-5 h-5"} />
            {isEdit ? t('تعديل منتج', 'Edit Product') : t('إضافة منتج جديد', 'Add New Product')}
          </h2>
          <button 
            onClick={handleClose} 
            className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label={t('إغلاق', 'Close')}
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {isViewer ? (
          <div className="p-6">
            <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded-lg">
              <p className="flex items-center">
                <IconShield className={currentLanguage === 'ar' ? "ml-2 w-5 h-5" : "mr-2 w-5 h-5"} />
                {t(
                  "عذراً، الصلاحية الحالية (مشاهد) لا تسمح لك بإضافة أو تعديل المنتجات",
                  "Sorry, your current permission level (Viewer) does not allow you to add or modify products"
                )}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* المعلومات الأساسية */}
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                <IconInfo className={currentLanguage === 'ar' ? "ml-2 w-5 h-5 text-blue-500" : "mr-2 w-5 h-5 text-blue-500"} />
                {t('المعلومات الأساسية', 'Basic Information')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* اسم المنتج عربي */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('اسم المنتج (عربي)', 'Product Name (Arabic)')} *
                  </label>
                  <input
                    type="text"
                    name="nameAr"
                    value={formData.nameAr}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('أدخل اسم المنتج بالعربية', 'Enter product name in Arabic')}
                    required
                  />
                </div>
                
                {/* اسم المنتج إنجليزي */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('Product Name (English)', 'Product Name (English)')}
                  </label>
                  <input
                    type="text"
                    name="nameEn"
                    value={formData.nameEn}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('Enter product name in English', 'Enter product name in English')}
                  />
                </div>
                
                {/* الفئة الرئيسية */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('الفئة الرئيسية', 'Main Category')} *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white"
                    required
                  >
                    <option value="">{t('اختر الفئة الرئيسية', 'Select Main Category')}</option>
                    {mainCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* الفئة الفرعية */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('الفئة الفرعية', 'Subcategory')}
                  </label>
                  <select
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white"
                    disabled={!formData.category}
                  >
                    <option value="">{t('اختر الفئة الفرعية', 'Select Subcategory')}</option>
                    {formData.category && getSubCategories()[formData.category]?.map(sub => (
                      <option key={sub.value} value={sub.value}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* الماركة */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('الماركة / Brand', 'Brand')}
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('أدخل اسم الماركة', 'Enter brand name')}
                  />
                </div>
                
                {/* الموديل */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('الموديل / Model', 'Model')}
                  </label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('أدخل رقم الموديل', 'Enter model number')}
                  />
                </div>
                
                {/* الوصف عربي */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('الوصف (عربي)', 'Description (Arabic)')}
                  </label>
                  <textarea
                    name="descriptionAr"
                    value={formData.descriptionAr}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('أدخل وصف المنتج بالعربية', 'Enter product description in Arabic')}
                  />
                </div>
                
                {/* الوصف إنجليزي */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('Description (English)', 'Description (English)')}
                  </label>
                  <textarea
                    name="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('Enter product description in English', 'Enter product description in English')}
                  />
                </div>
              </div>
            </div>
            
            {/* الميزات */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                {t('الميزات', 'Features')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* الميزات عربي */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('الميزات (عربي)', 'Features (Arabic)')}
                  </label>
                  <div className="flex mb-3">
                    <input
                      type="text"
                      ref={featureInputArRef}
                      className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                      placeholder={t('أضف ميزة عربية', 'Add Arabic feature')}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddFeature('ar')}
                      className={`px-4 py-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all duration-300 shadow-sm hover:shadow-md ${currentLanguage === 'ar' ? 'mr-2' : 'ml-2'}`}
                    >
                      {t('إضافة', 'Add')}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.featuresAr.filter(f => f.trim()).map((feature, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature('ar', index)}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                        >
                          <IconX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* الميزات إنجليزي */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('Features (English)', 'Features (English)')}
                  </label>
                  <div className="flex mb-3">
                    <input
                      type="text"
                      ref={featureInputEnRef}
                      className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                      placeholder={t('Add English feature', 'Add English feature')}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddFeature('en')}
                      className={`px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md ${currentLanguage === 'ar' ? 'mr-2' : 'ml-2'}`}
                    >
                      {t('Add', 'Add')}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.featuresEn.filter(f => f.trim()).map((feature, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature('en', index)}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                        >
                          <IconX className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* السعر والكمية */}
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                <span className={currentLanguage === 'ar' ? "ml-2 w-5 h-5 text-green-500" : "mr-2 w-5 h-5 text-green-500"}>💰</span>
                {t('معلومات السعر والمخزون', 'Price and Stock Information')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               
                {/* الوحدة */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('الوحدة', 'Unit')} *
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white"
                    required
                  >
                    {units.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* الكمية */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('الكمية في المخزن', 'Stock Quantity')} *
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder="0"
                    dir="ltr"
                    min="0"
                    required
                  />
                </div>
                
                {/* الخصم */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('نسبة الخصم %', 'Discount %')}
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder="0"
                    dir="ltr"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                
                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('أدخل رمز SKU', 'Enter SKU code')}
                    dir="ltr"
                  />
                </div>
                
                {/* الباركود */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('الباركود', 'Barcode')}
                  </label>
                  <input
                    type="text"
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('أدخل رقم الباركود', 'Enter barcode number')}
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
            
            {/* الألوان والأحجام المتاحة */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* الألوان المتاحة */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  {t('الألوان المتاحة', 'Available Colors')}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-12 h-12 cursor-pointer rounded-lg border border-slate-300"
                    title={t('اختر لون', 'Choose color')}
                  />
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    {t('إضافة لون', 'Add Color')}
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {formData.availableColors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-slate-300"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                      <span className="text-sm text-slate-700 font-medium">{color}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveColor(index)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                        title={t('حذف اللون', 'Delete color')}
                      >
                        <IconX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formData.availableColors.length === 0 && (
                    <p className="text-slate-500 text-sm">
                      {t('لم تتم إضافة ألوان بعد', 'No colors added yet')}
                    </p>
                  )}
                </div>
              </div>
              
              {/* الأحجام المتاحة */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  {t('الأحجام المتاحة', 'Available Sizes')}
                </h3>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleAddSize)}
                    className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('أدخل حجم (مثال: 60x60 سم)', 'Enter size (example: 60x60 cm)')}
                  />
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    {t('إضافة', 'Add')}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.availableSizes.map((size, index) => (
                    <span key={index} className="bg-white text-slate-700 px-3 py-2 rounded-lg border border-slate-200 text-sm flex items-center gap-2 shadow-sm">
                      <span className="text-slate-500">📏</span>
                      {size}
                      <button
                        type="button"
                        onClick={() => handleRemoveSize(index)}
                        className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                        title={t('حذف الحجم', 'Delete size')}
                      >
                        <IconX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {formData.availableSizes.length === 0 && (
                    <p className="text-slate-500 text-sm">
                      {t('لم تتم إضافة أحجام بعد', 'No sizes added yet')}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* الوسوم */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                {t('الوسوم', 'Tags')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* الوسوم عربي */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('الوسوم (عربي)', 'Tags (Arabic)')}
                  </label>
                  <div className="flex mb-3">
                    <input
                      type="text"
                      value={newTagAr}
                      onChange={(e) => setNewTagAr(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, () => handleAddTag('ar'))}
                      className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                      placeholder={t('أضف وسماً عربياً', 'Add Arabic tag')}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTag('ar')}
                      className={`px-4 py-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all duration-300 shadow-sm hover:shadow-md ${currentLanguage === 'ar' ? 'mr-2' : 'ml-2'}`}
                    >
                      {t('إضافة', 'Add')}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[40px]">
                    {formData.tagsAr.map((tag, index) => (
                      <span key={index} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-full text-sm flex items-center shadow-sm">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag('ar', index)}
                          className={`text-white/80 hover:text-white p-1 hover:bg-blue-700 rounded-full transition-colors ${currentLanguage === 'ar' ? 'mr-2' : 'ml-2'}`}
                          title={t('حذف الوسم', 'Delete tag')}
                        >
                          <IconX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {formData.tagsAr.length === 0 && (
                      <p className="text-slate-500 text-sm">
                        {t('لم تتم إضافة وسوم عربية بعد', 'No Arabic tags added yet')}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* الوسوم إنجليزي */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('Tags (English)', 'Tags (English)')}
                  </label>
                  <div className="flex mb-3">
                    <input
                      type="text"
                      value={newTagEn}
                      onChange={(e) => setNewTagEn(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, () => handleAddTag('en'))}
                      className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                      placeholder={t('Add English tag', 'Add English tag')}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTag('en')}
                      className={`px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md ${currentLanguage === 'ar' ? 'mr-2' : 'ml-2'}`}
                    >
                      {t('Add', 'Add')}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 min-h-[40px]">
                    {formData.tagsEn.map((tag, index) => (
                      <span key={index} className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-3 py-2 rounded-full text-sm flex items-center shadow-sm">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag('en', index)}
                          className={`text-white/80 hover:text-white p-1 hover:bg-indigo-700 rounded-full transition-colors ${currentLanguage === 'ar' ? 'mr-2' : 'ml-2'}`}
                          title={t('Delete tag', 'Delete tag')}
                        >
                          <IconX className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {formData.tagsEn.length === 0 && (
                      <p className="text-slate-500 text-sm">
                        {t('No English tags added yet', 'No English tags added yet')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* الصور */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                <IconImage className={currentLanguage === 'ar' ? "ml-2 w-5 h-5 text-purple-500" : "mr-2 w-5 h-5 text-purple-500"} />
                {t('صور المنتج', 'Product Images')}
              </h3>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={uploadingImages}
                className="w-full p-6 border-2 border-dashed border-slate-300 rounded-lg hover:border-blue-500 transition-colors mb-4 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-center">
                  {uploadingImages ? (
                    <>
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
                      <p className="text-slate-700 font-medium">{t('جاري رفع الصور...', 'Uploading images...')}</p>
                    </>
                  ) : (
                    <>
                      <IconImage className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                      <p className="text-slate-700 font-medium">
                        {t('انقر لرفع صور المنتج', 'Click to upload product images')}
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        {t('يمكنك رفع أكثر من صورة (JPG, PNG, WebP)', 'You can upload multiple images (JPG, PNG, WebP)')}
                      </p>
                    </>
                  )}
                </div>
              </button>
              
              {renderImagePreview()}
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t('رابط الصورة اليدوي', 'Manual Image URL')}
                </label>
                <input
                  type="url"
                  placeholder={t('https://example.com/image.jpg (اختياري)', 'https://example.com/image.jpg (optional)')}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const url = e.target.value.trim();
                      if (url) {
                        setImageUrls(prev => [...prev, url]);
                        setFormData(prev => ({
                          ...prev,
                          images: [...prev.images, url]
                        }));
                        e.target.value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>
            
            {/* معلومات إضافية */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                {t('معلومات إضافية', 'Additional Information')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* المادة */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('المادة', 'Material')}
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('مثال: خشب، حديد، زجاج', 'Example: Wood, Steel, Glass')}
                  />
                </div>
                
                {/* التشطيب */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('التشطيب', 'Finish')}
                  </label>
                  <input
                    type="text"
                    name="finish"
                    value={formData.finish}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('مثال: لامع، غير لامع', 'Example: Glossy, Matte')}
                  />
                </div>
                
                {/* السمك */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('السمك', 'Thickness')}
                  </label>
                  <input
                    type="text"
                    name="thickness"
                    value={formData.thickness}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('مثال: 5 مم', 'Example: 5 mm')}
                  />
                </div>
                
                {/* الضمان */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('الضمان', 'Warranty')}
                  </label>
                  <input
                    type="text"
                    name="warranty"
                    value={formData.warranty}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('مثال: سنة واحدة', 'Example: 1 year')}
                  />
                </div>
                
                {/* معلومات التركيب */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('معلومات التركيب', 'Installation Information')}
                  </label>
                  <textarea
                    name="installationInfo"
                    value={formData.installationInfo}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('معلومات حول تركيب المنتج', 'Information about product installation')}
                  />
                </div>
                
                {/* معلومات الصيانة */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('معلومات الصيانة', 'Maintenance Information')}
                  </label>
                  <textarea
                    name="maintenanceInfo"
                    value={formData.maintenanceInfo}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('معلومات حول صيانة المنتج', 'Information about product maintenance')}
                  />
                </div>
                
                {/* المورد */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('المورد', 'Supplier')}
                  </label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('اسم المورد', 'Supplier name')}
                  />
                </div>
                
                {/* وقت التسليم */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t('وقت التسليم', 'Lead Time')}
                  </label>
                  <input
                    type="text"
                    name="leadTime"
                    value={formData.leadTime}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                    placeholder={t('مثال: 3-5 أيام عمل', 'Example: 3-5 business days')}
                  />
                </div>
              </div>
            </div>
            
            {/* حالة المنتج */}
            <div className="bg-slate-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">
                {t('حالة المنتج', 'Product Status')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* نشط */}
                <div className="flex items-center p-3 bg-white rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className={currentLanguage === 'ar' ? 'mr-3 text-slate-700 font-medium' : 'ml-3 text-slate-700 font-medium'}>
                    {t('المنتج نشط', 'Product is active')}
                  </label>
                </div>
                
                {/* مميز */}
                <div className="flex items-center p-3 bg-white rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isFeatured" className={currentLanguage === 'ar' ? 'mr-3 text-slate-700 font-medium' : 'ml-3 text-slate-700 font-medium'}>
                    {t('منتج مميز', 'Featured product')}
                  </label>
                </div>
                
                {/* عرض خاص */}
                <div className="flex items-center p-3 bg-white rounded-lg border border-slate-200">
                  <input
                    type="checkbox"
                    id="isOnSale"
                    name="isOnSale"
                    checked={formData.isOnSale}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="isOnSale" className={currentLanguage === 'ar' ? 'mr-3 text-slate-700 font-medium' : 'ml-3 text-slate-700 font-medium'}>
                    {t('عرض خاص', 'On sale')}
                  </label>
                </div>
              </div>
            </div>
            
            {/* أزرار الحفظ */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-300"
              >
                {t('إلغاء', 'Cancel')}
              </button>
              <button
                type="submit"
                disabled={uploadingImages}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {uploadingImages ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('جاري الحفظ...', 'Saving...')}
                  </>
                ) : (
                  <>
                    <IconCheck className={currentLanguage === 'ar' ? "ml-2 w-5 h-5" : "mr-2 w-5 h-5"} />
                    {isEdit ? t('تحديث المنتج', 'Update Product') : t('إضافة المنتج', 'Add Product')}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CatalogModal;