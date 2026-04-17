// src/components/Admin/Catalog.js
import { useState, useMemo, useCallback } from "react";
import { 
  IconPackage, IconEdit, IconTrash, IconEye, IconEyeOff, 
  IconStar, IconSearch, 
  IconGrid, IconList, IconPlus} from "../Icons";

const Catalog = ({ 
  products = [], 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct,
  onToggleStatus,
  onToggleFeatured,
  userData 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortBy, setSortBy] = useState("newest");

  // الفئات الرئيسية - باستخدام useMemo
  const categories = useMemo(() => [
    { value: "all", label: "جميع الفئات" },
    { value: "paints", label: "دهانات" },
    { value: "flooring", label: "أرضيات" },
    { value: "aluminum", label: "ألمنيوم" },
    { value: "wood", label: "خشب" },
    { value: "steel", label: "حديد" },
    { value: "tiles", label: "بلاط" },
    { value: "wallpaper", label: "ورق حائط" },
    { value: "lighting", label: "إضاءة" },
    { value: "kitchen", label: "مطابخ" }
  ], []); // ← مصفوفة فارغة لأن البيانات ثابتة

  // إحصائيات المنتجات
  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter(p => p.isActive).length,
    inactive: products.filter(p => !p.isActive).length,
    featured: products.filter(p => p.isFeatured).length,
    lowStock: products.filter(p => p.stockQuantity < 10).length,
    outOfStock: products.filter(p => p.stockQuantity === 0).length
  }), [products]);

  // دالة الحصول على اسم المنتج بأي لغة
  const getProductName = useCallback((product) => {
    if (!product) return 'منتج';
    if (product.name?.ar) return product.name.ar;
    if (product.name?.en) return product.name.en;
    if (product.nameAr) return product.nameAr;
    if (product.nameEn) return product.nameEn;
    return 'منتج بدون اسم';
  }, []);

  // دالة الحصول على وصف المنتج
  const getProductDescription = useCallback((product) => {
    if (!product) return '';
    if (product.description?.ar) return product.description.ar;
    if (product.description?.en) return product.description.en;
    if (product.descriptionAr) return product.descriptionAr;
    if (product.descriptionEn) return product.descriptionEn;
    return '';
  }, []);

  // دالة الحصول على الفئة
  const getCategoryLabel = useCallback((categoryValue) => {
    const category = categories.find(c => c.value === categoryValue);
    return category ? category.label : categoryValue;
  }, [categories]);

  // تصفية وترتيب المنتجات
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const productName = getProductName(product);
      const description = getProductDescription(product);
      const category = product.category || "";
      const brand = product.brand || "";
      const model = product.model || "";
      
      const matchesSearch = searchTerm === "" || 
        productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.tags?.ar?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (product.tags?.en?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesCategory = filterCategory === "all" || product.category === filterCategory;
      const matchesStatus = filterStatus === "all" ||
        (filterStatus === "active" && product.isActive) ||
        (filterStatus === "inactive" && !product.isActive) ||
        (filterStatus === "featured" && product.isFeatured) ||
        (filterStatus === "low-stock" && product.stockQuantity < 10) ||
        (filterStatus === "out-of-stock" && product.stockQuantity === 0);
      
      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => {
      const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt).getTime();
      const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt).getTime();
      
      switch(sortBy) {
        case "newest": return dateB - dateA;
        case "oldest": return dateA - dateB;
        case "name-asc": return getProductName(a).localeCompare(getProductName(b), 'ar');
        case "name-desc": return getProductName(b).localeCompare(getProductName(a), 'ar');
        case "price-high": return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
        case "price-low": return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
        case "stock-high": return (b.stockQuantity || 0) - (a.stockQuantity || 0);
        case "stock-low": return (a.stockQuantity || 0) - (b.stockQuantity || 0);
        default: return 0;
      }
    });
  }, [products, searchTerm, filterCategory, filterStatus, sortBy, getProductName, getProductDescription]);

  // دالة عرض الوسوم
  const renderTags = (tags) => {
    if (!tags) return null;
    
    const arabicTags = tags.ar || [];
    const englishTags = tags.en || [];
    const allTags = [...arabicTags, ...englishTags].slice(0, 3);
    
    return allTags.map((tag, idx) => (
      <span 
        key={idx}
        className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200"
        title={tag}
      >
        {tag}
      </span>
    ));
  };

  // دالة عرض حالة المخزون
  const renderStockStatus = (stockQuantity) => {
    if (stockQuantity === 0) {
      return (
        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
          نفذ من المخزون
        </span>
      );
    } else if (stockQuantity < 10) {
      return (
        <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
          كمية قليلة ({stockQuantity})
        </span>
      );
    } else {
      return (
        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
          متوفر ({stockQuantity})
        </span>
      );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* رأس الصفحة مع الإحصائيات */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-0">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">كتالوج المنتجات</h1>
            <p className="text-slate-600 text-sm">إدارة جميع المنتجات والمواد الخاصة بالديكور والتصميم</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 sm:px-4 py-3">
              <div className="text-xs text-slate-500">الإجمالي</div>
              <div className="text-lg sm:text-xl font-bold text-slate-900">{stats.total}</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 sm:px-4 py-3">
              <div className="text-xs text-emerald-600">النشطة</div>
              <div className="text-lg sm:text-xl font-bold text-emerald-700">{stats.active}</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 sm:px-4 py-3">
              <div className="text-xs text-orange-600">كمية قليلة</div>
              <div className="text-lg sm:text-xl font-bold text-orange-700">{stats.lowStock}</div>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-3 sm:px-4 py-3">
              <div className="text-xs text-indigo-600">المميزة</div>
              <div className="text-lg sm:text-xl font-bold text-indigo-700">{stats.featured}</div>
            </div>
          </div>
        </div>
      </div>

      {/* شريط التحكم */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن منتج، ماركة، موديل، أو وسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 pr-12 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-sm text-slate-900"
              />
              <div className="absolute left-3 top-3 text-slate-400">
                <IconSearch className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* فلتر الفئة */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm text-slate-900 bg-white"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            {/* فلتر الحالة */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm text-slate-900 bg-white"
            >
              <option value="all">جميع الحالات</option>
              <option value="active">النشطة فقط</option>
              <option value="inactive">غير النشطة</option>
              <option value="featured">المميزة فقط</option>
              <option value="low-stock">كمية قليلة</option>
              <option value="out-of-stock">نفذ من المخزون</option>
            </select>
            
            {/* ترتيب */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-sm text-slate-900 bg-white"
            >
              <option value="newest">الأحدث أولاً</option>
              <option value="oldest">الأقدم أولاً</option>
              <option value="name-asc">الاسم (أ-ي)</option>
              <option value="name-desc">الاسم (ي-أ)</option>
              <option value="stock-high">المخزون (الأعلى)</option>
              <option value="stock-low">المخزون (الأدنى)</option>
            </select>
            
            {/* طريقة العرض */}
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                title="عرض شبكي"
              >
                <IconGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                title="عرض قائمة"
              >
                <IconList className="w-4 h-4" />
              </button>
            </div>
            
            {/* زر إضافة منتج */}
            {userData?.role !== "viewer" && (
              <button
                onClick={onAddProduct}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md flex items-center text-sm"
              >
                <IconPlus className="ml-2 w-5 h-5" />
                إضافة منتج جديد
              </button>
            )}
          </div>
        </div>

        {/* عرض المنتجات */}
        {filteredProducts.length > 0 ? (
          viewMode === "grid" ? (
            /* العرض الشبكي */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => {
                const productName = getProductName(product);
                const categoryName = getCategoryLabel(product.category);
                const mainImage = product.images?.[0] || "https://via.placeholder.com/400x300?text=Product";
                
                return (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300">
                    {/* صورة المنتج */}
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={mainImage} 
                        alt={productName}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/400x300?text=Product";
                        }}
                      />
                      
                      {/* شارات الحالة */}
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-3">
                        <div className="flex justify-between">
                          <div className="flex flex-wrap gap-1">
                            {product.isFeatured && (
                              <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                مميز
                              </span>
                            )}
                            {product.isActive ? (
                              <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-2 py-1 rounded-full">
                                نشط
                              </span>
                            ) : (
                              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full">
                                غير نشط
                              </span>
                            )}
                          </div>
                          {renderStockStatus(product.stockQuantity)}
                        </div>
                      </div>
                      
                    </div>
                    
                    {/* معلومات المنتج */}
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 text-lg mb-1 truncate">
                        {productName}
                      </h3>
                      
                      <div className="flex items-center text-sm text-slate-600 mb-2">
                        <IconPackage className="w-4 h-4 ml-2" />
                        <span>{categoryName}</span>
                        {product.brand && (
                          <span className="mr-4">• {product.brand}</span>
                        )}
                      </div>
                      
                      {/* الوسوم */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {renderTags(product.tags)}
                      </div>
                      
                      {/* معلومات إضافية */}
                      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                        <div className="bg-slate-50 rounded-lg p-2">
                          <div className="text-xs text-slate-500">الموديل</div>
                          <div className="font-medium text-slate-900 truncate">
                            {product.model || 'غير محدد'}
                          </div>
                        </div>
                        <div className="bg-slate-50 rounded-lg p-2">
                          <div className="text-xs text-slate-500">المادة</div>
                          <div className="font-medium text-slate-900 truncate">
                            {product.material || 'غير محدد'}
                          </div>
                        </div>
                      </div>
                      
                      {/* أزرار الإجراءات */}
                      <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                        <div className="text-xs text-slate-500">
                          {product.images?.length || 0} صورة
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => onEditProduct(product)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                            title="تعديل"
                            disabled={userData?.role === "viewer"}
                          >
                            <IconEdit className="w-4 h-4" />
                          </button>
                          
                          {userData?.role !== "viewer" && (
                            <>
                              <button
                                onClick={() => onToggleStatus(product.id, product.isActive, productName)}
                                className={`p-2 rounded-lg transition-colors ${
                                  product.isActive 
                                    ? "text-orange-600 hover:text-orange-800 hover:bg-orange-50" 
                                    : "text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                                }`}
                                title={product.isActive ? "تعطيل" : "تفعيل"}
                              >
                                {product.isActive ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                              </button>
                              
                              <button
                                onClick={() => onToggleFeatured(product.id, product.isFeatured, productName, "منتج")}
                                className={`p-2 rounded-lg transition-colors ${
                                  product.isFeatured 
                                    ? "text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50" 
                                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                                }`}
                                title={product.isFeatured ? "إلغاء التميز" : "تمييز"}
                              >
                                <IconStar className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          
                          {(userData?.role === "editor" || userData?.role === "admin") && (
                            <button
                              onClick={() => onDeleteProduct(product.id, productName)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="حذف"
                            >
                              <IconTrash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* العرض القائمة */
            <div className="space-y-4">
              {filteredProducts.map((product) => {
                const productName = getProductName(product);
                const categoryName = getCategoryLabel(product.category);
                const mainImage = product.images?.[0] || "https://via.placeholder.com/400x300?text=Product";
                
                return (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-all duration-300">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* الصورة */}
                      <div className="md:w-1/4">
                        <div className="relative h-48 md:h-32 rounded-lg overflow-hidden">
                          <img 
                            src={mainImage} 
                            alt={productName}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 flex flex-col gap-1">
                            {product.isFeatured && (
                              <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                مميز
                              </span>
                            )}
                            {!product.isActive && (
                              <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full">
                                غير نشط
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* المعلومات */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg mb-1">
                              {productName}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 mb-2">
                              <span className="flex items-center">
                                <IconPackage className="w-4 h-4 ml-2" />
                                {categoryName}
                              </span>
                              {product.brand && <span>• {product.brand}</span>}
                              {product.model && <span>• الموديل: {product.model}</span>}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-slate-900">
                                {product.price} {product.currency || 'SAR'}
                              </div>
                              {product.discount > 0 && (
                                <div className="text-sm text-red-500 line-through">
                                  {product.price + (product.price * product.discount / 100)} {product.currency || 'SAR'}
                                </div>
                              )}
                            </div>
                            {renderStockStatus(product.stockQuantity)}
                          </div>
                        </div>
                        
                        {/* الوصف */}
                        {product.description?.ar && (
                          <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                            {product.description.ar}
                          </p>
                        )}
                        
                        {/* الوسوم */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {renderTags(product.tags)}
                        </div>
                        
                        {/* معلومات إضافية */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
                          <div className="bg-slate-50 rounded-lg p-2">
                            <div className="text-xs text-slate-500">الوحدة</div>
                            <div className="font-medium text-slate-900">
                              {product.unit || 'متر مربع'}
                            </div>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2">
                            <div className="text-xs text-slate-500">المادة</div>
                            <div className="font-medium text-slate-900 truncate">
                              {product.material || 'غير محدد'}
                            </div>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2">
                            <div className="text-xs text-slate-500">الكمية</div>
                            <div className="font-medium text-slate-900">
                              {product.stockQuantity || 0}
                            </div>
                          </div>
                          <div className="bg-slate-50 rounded-lg p-2">
                            <div className="text-xs text-slate-500">الخيارات</div>
                            <div className="font-medium text-slate-900">
                              {product.availableColors?.length || 0} لون
                            </div>
                          </div>
                        </div>
                        
                        {/* أزرار الإجراءات */}
                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                          <button
                            onClick={() => onEditProduct(product)}
                            className="px-3 py-2 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors text-sm"
                            disabled={userData?.role === "viewer"}
                          >
                            تعديل
                          </button>
                          
                          {userData?.role !== "viewer" && (
                            <>
                              <button
                                onClick={() => onToggleStatus(product.id, product.isActive, productName)}
                                className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                                  product.isActive 
                                    ? "bg-orange-100 text-orange-700 hover:bg-orange-200" 
                                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                }`}
                              >
                                {product.isActive ? "تعطيل" : "تفعيل"}
                              </button>
                              
                              <button
                                onClick={() => onToggleFeatured(product.id, product.isFeatured, productName, "منتج")}
                                className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                                  product.isFeatured 
                                    ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" 
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                }`}
                              >
                                {product.isFeatured ? "إلغاء التميز" : "تمييز"}
                              </button>
                            </>
                          )}
                          
                          {(userData?.role === "editor" || userData?.role === "admin") && (
                            <button
                              onClick={() => onDeleteProduct(product.id, productName)}
                              className="px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg transition-colors text-sm"
                            >
                              حذف
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* حالة عدم وجود منتجات */
          <div className="text-center py-12">
            <IconPackage className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              {searchTerm || filterCategory !== "all" || filterStatus !== "all" 
                ? "لم يتم العثور على منتجات" 
                : "لا توجد منتجات"}
            </h3>
            <p className="text-slate-500 mb-6">
              {searchTerm || filterCategory !== "all" || filterStatus !== "all"
                ? "جرب تغيير كلمات البحث أو إزالة المرشحات" 
                : "لم يتم إضافة أي منتجات بعد"}
            </p>
            {userData?.role !== "viewer" && (
              <button
                onClick={onAddProduct}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md flex items-center mx-auto text-sm"
              >
                <IconPlus className="ml-2 w-5 h-5" />
                إضافة أول منتج
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;