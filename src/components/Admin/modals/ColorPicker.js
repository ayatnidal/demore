// /Users/ayatnidal/Desktop/decor-website/decor-website-react/src/components/Admin/modals/ColorPicker.js
// يتم استدعاؤه من قبل كود ProjectModal لتحديد الالوان المستخدمة بالمشروع
import React, { useState } from 'react';
import { IconX, IconCheck, IconColorPalette, IconRefresh } from '../../Icons';

const ColorPicker = ({ 
  selectedColors = [], 
  onColorsChange, 
  disabled = false,
  isMobile = false,
  maxColors = 20
}) => {
  const [customColor, setCustomColor] = useState('#3B82F6');
  const [recentColors, setRecentColors] = useState([]);
  
  // التحقق من صحة اللون
  const validateColor = (color) => {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
  };
  
  // إضافة لون إلى القائمة
  const addColor = (color) => {
    const normalizedColor = color.toUpperCase();
    
    if (selectedColors.includes(normalizedColor)) {
      return;
    }
    
    const newColors = [...selectedColors, normalizedColor];
    if (newColors.length > maxColors) {
      newColors.shift(); // إزالة أقدم لون إذا تجاوز الحد
    }
    
    onColorsChange(newColors);
    
    // إضافة إلى الألوان الأخيرة (حد أقصى 5 ألوان)
    if (!recentColors.includes(normalizedColor)) {
      const newRecent = [normalizedColor, ...recentColors.slice(0, 4)];
      setRecentColors(newRecent);
    }
  };
  
  // إزالة لون
  const removeColor = (colorToRemove) => {
    const newColors = selectedColors.filter(color => color !== colorToRemove);
    onColorsChange(newColors);
  };
  
  // تحديث اللون المخصص من المدخل
  const handleCustomColorChange = (e) => {
    const value = e.target.value;
    setCustomColor(value);
  };
  
  // إضافة لون مخصص
  const handleAddCustomColor = () => {
    if (validateColor(customColor)) {
      addColor(customColor);
      setCustomColor('#3B82F6');
    }
  };
  
  // إعادة تعيين الألوان
  const handleResetColors = () => {
    onColorsChange([]);
  };
  
  // توليد لون عشوائي
  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
    setCustomColor(randomColor);
    
    if (!selectedColors.includes(randomColor)) {
      addColor(randomColor);
    }
  };

  // إضافة لون حديث
  const handleRecentColorClick = (color) => {
    addColor(color);
  };
  
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* عرض الألوان المختارة */}
      {selectedColors.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h4 className="font-medium text-gray-700 text-sm sm:text-base">
              الألوان المختارة ({selectedColors.length}/{maxColors})
            </h4>
            {!disabled && selectedColors.length > 0 && (
              <button
                type="button"
                onClick={handleResetColors}
                className="text-xs sm:text-sm text-red-600 hover:text-red-800 flex items-center"
                disabled={disabled}
              >
                <IconRefresh className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                إعادة تعيين
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {selectedColors.map((color, index) => (
              <div key={index} className="relative group">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg shadow-md border border-gray-200"
                  style={{ backgroundColor: color }}
                  title={color}
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeColor(color)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`حذف اللون ${color}`}
                  >
                    <IconX className="w-2 h-2 sm:w-3 sm:h-3" />
                  </button>
                )}
                <div className="text-xs font-mono text-center mt-1 truncate max-w-[3rem] sm:max-w-[4rem]">
                  {color}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* منتقي الألوان المدمج */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h4 className="font-medium text-green-800 text-sm sm:text-base flex items-center">
            <IconColorPalette className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
            اختر اللون
          </h4>
          <button
            type="button"
            onClick={generateRandomColor}
            className="text-xs sm:text-sm text-green-600 hover:text-green-800 flex items-center"
            disabled={disabled}
          >
            <IconRefresh className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
            لون عشوائي
          </button>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-gray-300 shadow-lg"
              style={{ backgroundColor: customColor }}
            />
            
            <div className="flex-1 min-w-0">
              <label className="block text-xs sm:text-sm text-gray-700 mb-2">
                اختر اللون من المنتقي المدمج:
              </label>
              <input
                type="color"
                value={customColor}
                onChange={handleCustomColorChange}
                className="w-full h-12 cursor-pointer rounded-lg border border-gray-300"
                disabled={disabled}
              />
              <div className="font-mono text-sm sm:text-base lg:text-lg font-bold text-center mt-2 bg-white p-2 rounded-lg border border-gray-200">
                {customColor}
              </div>
            </div>
          </div>
          
          <button
            type="button"
            onClick={handleAddCustomColor}
            className="px-5 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium shadow-md hover:shadow-lg whitespace-nowrap"
            disabled={disabled || selectedColors.includes(customColor)}
          >
            <IconCheck className="ml-2 inline-block w-4 h-4 sm:w-5 sm:h-5" />
            إضافة اللون
          </button>
        </div>
        
        <div className="mt-4 p-3 bg-white/50 rounded-lg border border-green-100">
          <p className="text-xs sm:text-sm text-gray-600">
            <span className="font-medium">ملاحظة:</span> هذه الطريقة تستخدم منتقي الألوان المدمج في متصفحك، 
            مما يمنحك تحكماً دقيقاً في اختيار الألوان.
          </p>
        </div>
      </div>
      
      {/* الألوان المستخدمة مؤخراً */}
      {recentColors.length > 0 && (
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h4 className="font-medium text-amber-800 mb-3 sm:mb-4 text-sm sm:text-base">
            الألوان المستخدمة مؤخراً
          </h4>
          
          <div className="flex flex-wrap gap-3 sm:gap-4">
            {recentColors.map((color, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleRecentColorClick(color)}
                className="relative group flex flex-col items-center"
                disabled={disabled || selectedColors.includes(color)}
                title={`إضافة ${color}`}
                aria-label={`إضافة اللون ${color}`}
              >
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 border-white shadow-lg hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
                <div className="mt-2 font-mono text-xs sm:text-sm bg-white/80 px-2 py-1 rounded border border-amber-200">
                  {color}
                </div>
              </button>
            ))}
          </div>
          
          {recentColors.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              لم تقم باختيار أي ألوان بعد. ابدأ باختيار أول لون!
            </div>
          )}
        </div>
      )}
      
      {/* ألوان افتراضية سريعة */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h4 className="font-medium text-blue-800 mb-3 sm:mb-4 text-sm sm:text-base">
          ألوان سريعة
        </h4>
        
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-gray-600">
            اختر من الألوان الجاهزة:
          </p>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
            {[
              '#FF0000', '#FF6B6B', '#FFA726', '#FFEB3B', 
              '#4CAF50', '#00BCD4', '#2196F3', '#3F51B5',
              '#9C27B0', '#E91E63', '#795548', '#607D8B',
              '#000000', '#FFFFFF', '#9E9E9E', '#FFC107'
            ].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  setCustomColor(color);
                  setTimeout(() => handleAddCustomColor(), 100);
                }}
                className="relative group w-10 h-10 sm:w-12 sm:h-12 rounded-lg border border-gray-300 hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                disabled={disabled || selectedColors.includes(color)}
                title={color}
                aria-label={`إضافة اللون ${color}`}
              >
                {selectedColors.includes(color) && (
                  <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                    <IconCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                  {color}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* تعليمات الاستخدام */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-300 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h5 className="font-bold text-gray-800 mb-3 text-sm sm:text-base flex items-center">
          <span className="mr-2">📋</span>
          تعليمات اختيار الألوان
        </h5>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-xs">1</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              اختر اللون من المنتقي المدمج في المتصفح للحصول على تحكم دقيق
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-600 text-xs">2</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              استخدم الألوان السريعة للاختيار السهل من مجموعة ألوان جاهزة
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-red-600 text-xs">3</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">
              يمكنك اختيار حتى {maxColors} لون. الألوان القديمة تُحذف تلقائياً
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;