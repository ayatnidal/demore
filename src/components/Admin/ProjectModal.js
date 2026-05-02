// /Users/ayatnidal/Desktop/decor-website/decor-website-react/src/components/Admin/modals/ProjectModal.js
// إضافة مشاريع من صفحة الإدارة
import { useState, useEffect, useCallback, useMemo } from 'react';
import ColorPicker from '../Admin/modals/ColorPicker';
import ImageUploader from '../Admin/modals/ImageUploader';

// ==================== أيقونات مخصصة ====================
const IconX = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconCheck = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const IconHome = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const IconChallenge = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const IconSolution = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconResults = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const IconColorPalette = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const IconImage = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconStar = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const IconMapPin = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconInfo = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconUser = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IconEye = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const IconChevronLeft = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const IconChevronRight = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const IconSettings = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const IconZoomIn = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 1114 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
  </svg>
);

const IconDownload = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const IconMaximize = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
  </svg>
);

const IconVideo = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

// أيقونة جديدة لصفحة الإدارة
const IconAdmin = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
  </svg>
);

// أيقونة لصفحة المعرض
const IconPortfolio = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// ==================== مكون Lightbox محسن لعرض الصور والفيديوهات بدقة عالية ====================
const EnhancedLightbox = ({ 
  media, 
  initialIndex = 0, 
  isOpen, 
  onClose,
  title = "معرض الوسائط"
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setImageLoaded(false);
      setIsZoomed(false);
      setZoomPosition({ x: 0, y: 0 });
      
      // إخفاء التمرير عند فتح الـ Lightbox
      document.body.style.overflow = 'hidden';
      
      // تفعيل وضع ملء الشاشة عند الضغط على F
      const handleKeyPress = (e) => {
        if (e.key === 'f' || e.key === 'F') {
          toggleFullscreen();
        }
        if (e.key === 'Escape') {
          if (isFullscreen) {
            toggleFullscreen();
          } else {
            onClose();
          }
        }
      };
      
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isOpen, initialIndex, onClose, isFullscreen]);
  
  const goToPrev = () => {
    setCurrentIndex(prev => {
      const newIndex = prev === media.length - 1 ? 0 : prev + 1;
      setImageLoaded(false);
      setIsZoomed(false);
      return newIndex;
    });
  };
  
  const goToNext = () => {
    setCurrentIndex(prev => {
      const newIndex = prev === 0 ? media.length - 1 : prev - 1;
      setImageLoaded(false);
      setIsZoomed(false);
      return newIndex;
    });
  };
  
  const toggleZoom = () => {
    if (isVideo(media[currentIndex])) return; // لا يمكن تكبير الفيديو
    setIsZoomed(!isZoomed);
  };
  
  const handleImageClick = (e) => {
    if (isVideo(media[currentIndex])) return; // لا يمكن تكبير الفيديو
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
    toggleZoom();
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  const downloadMedia = async () => {
    if (isDownloading) return;
    
    const currentMedia = media[currentIndex];
    
    if (isVideo(currentMedia)) {
      // فتح رابط الفيديو في نافذة جديدة
      window.open(currentMedia.url, '_blank');
      return;
    }
    
    try {
      setIsDownloading(true);
      const imageUrl = currentMedia.url;
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // استخراج اسم الملف من الرابط
      const fileName = imageUrl.split('/').pop() || `project-media-${currentIndex + 1}.jpg`;
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setTimeout(() => setIsDownloading(false), 1000);
    } catch (error) {
      console.error('❌ خطأ في تحميل الملف:', error);
      setIsDownloading(false);
    }
  };
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const isVideo = (mediaItem) => {
    return mediaItem.type === 'video';
  };
  
  if (!isOpen || !media.length) return null;
  
  const currentMedia = media[currentIndex];
  const mediaTypeLabels = {
    'before': '🔴 قبل',
    'after': '🟢 بعد', 
    'cover': '📸 غلاف',
    'featured': '⭐ رئيسية',
    'gallery': '🖼️ معرض',
    'main': '🏠 رئيسي',
    'video': '🎬 فيديو'
  };
  
  return (
    <div className={`fixed inset-0 z-[1000] ${isFullscreen ? 'bg-black' : 'bg-black/95 backdrop-blur-sm'}`}>
      {/* رأس الـ Lightbox */}
      <div className={`absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 sm:p-6 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            onClick={onClose}
            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            aria-label="إغلاق"
          >
            <IconX className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <div className="text-white">
            <h2 className="text-base sm:text-lg font-bold truncate max-w-xs sm:max-w-md">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              {isVideo(currentMedia) ? '🎬 فيديو' : `صورة ${currentIndex + 1} من ${media.length}`} • {mediaTypeLabels[currentMedia.type] || currentMedia.type}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          {!isVideo(currentMedia) && (
            <button
              onClick={downloadMedia}
              disabled={isDownloading}
              className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="تحميل الملف"
              title="تحميل الملف"
            >
              {isDownloading ? (
                <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <IconDownload className="w-5 h-5" />
              )}
            </button>
          )}
          
          {!isVideo(currentMedia) && (
            <button
              onClick={toggleZoom}
              className={`p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors ${isZoomed ? 'bg-blue-500/50' : ''}`}
              aria-label={isZoomed ? "تصغير" : "تكبير"}
              title={isZoomed ? "تصغير (Z)" : "تكبير (Z)"}
            >
              <IconZoomIn className="w-5 h-5" />
            </button>
          )}
          
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            aria-label={isFullscreen ? "الخروج من ملء الشاشة" : "ملء الشاشة"}
            title="ملء الشاشة (F)"
          >
            <IconMaximize className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* المحتوى الرئيسي */}
      <div 
        className="w-full h-full flex items-center justify-center p-4 sm:p-8 md:p-12 lg:p-16"
        onClick={() => !isVideo(currentMedia) && setShowControls(!showControls)}
      >
        <div className="relative w-full h-full max-w-7xl max-h-[calc(100vh-200px)]">
          {!imageLoaded && !isVideo(currentMedia) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          )}
          
          {isVideo(currentMedia) ? (
            <div className="w-full h-full flex items-center justify-center">
              <video
                src={currentMedia.url}
                controls
                autoPlay
                className="w-full h-full max-w-4xl max-h-[80vh] rounded-lg"
              />
            </div>
          ) : (
            <img
              src={currentMedia.url}
              alt={`المشروع ${currentIndex + 1}`}
              className={`w-full h-full object-contain transition-all duration-300 ${
                isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={handleImageClick}
              onLoad={handleImageLoad}
              style={{
                transform: isZoomed ? 'scale(2)' : 'scale(1)',
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                transition: isZoomed ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%232d3748'/%3E%3Ctext x='400' y='300' text-anchor='middle' dy='.3em' fill='%23a0aec0' font-size='20' font-family='system-ui'%3Eخطأ في تحميل الصورة%3C/text%3E%3C/svg%3E";
              }}
            />
          )}
        </div>
      </div>
      
      {/* أدوات التنقل */}
      <div className={`absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 z-10 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={goToPrev}
          className="p-3 sm:p-4 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          aria-label="السابق"
        >
          <IconChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>
      
      <div className={`absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 z-10 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={goToNext}
          className="p-3 sm:p-4 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          aria-label="التالي"
        >
          <IconChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>
      
      {/* معرض المصغرات */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 sm:p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex overflow-x-auto space-x-2 sm:space-x-3 px-2 py-2">
            {media.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  if (!isVideo(item)) setImageLoaded(false);
                  setIsZoomed(false);
                }}
                className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg sm:rounded-xl overflow-hidden border-3 transition-all duration-200 ${
                  currentIndex === index 
                    ? 'border-blue-500 scale-105 shadow-lg' 
                    : 'border-transparent hover:border-white/50 hover:scale-105'
                }`}
                aria-label={isVideo(item) ? `فيديو ${index + 1}` : `صورة ${index + 1}`}
              >
                {isVideo(item) ? (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <IconVideo className="w-8 h-8 text-white" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <img
                      src={item.url}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 hover:opacity-30 transition-opacity" />
                  </>
                )}
                <div className="absolute bottom-1 left-1 text-white text-xs bg-black/50 px-1 rounded">
                  {index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* معلومات مفيدة */}
      <div className={`absolute bottom-4 right-4 text-white text-xs opacity-70 transition-opacity duration-300 ${showControls ? 'opacity-70' : 'opacity-0'}`}>
        <div className="space-y-1">
          <div>← → للتنقل</div>
          <div>{isVideo(currentMedia) ? '🎬 فيديو' : 'Z للتكبير/التصغير'} • F لملء الشاشة</div>
          <div>ESC للإغلاق • انقر لإظهار/إخفاء الأدوات</div>
        </div>
      </div>
    </div>
  );
};

const ProjectViewModal = ({ project, onClose }) => {
  const [activeImage, setActiveImage] = useState(project.coverImage || project.mainImage || "");
  const [activeTab, setActiveTab] = useState('overview');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // دالة للتحقق من أن الرابط دائم
  const isPermanentUrl = useCallback((url) => {
    if (!url) return false;
    return (
      url.startsWith('http') || 
      url.startsWith('/uploads/') ||
      url.startsWith('data:image/') ||
      url.startsWith('data:video/')
    );
  }, []);
  
  // منع التمرير في الخلفية عند فتح المودال
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  
  // كشف حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // ==================== فئات التصميم المعدلة والمحدثة ====================
  const designCategories = useMemo(() => [
    // تصنيفات سكنية
    { 
      id: "residential", 
      name: { ar: "سكني", en: "Residential" },
      subcategories: [
        { id: "apartments", name: { ar: "شقق", en: "Apartments" } },
        { id: "villas", name: { ar: "فلل", en: "Villas" } },
        { id: "duplex", name: { ar: "دوبلكس", en: "Duplex" } },
        { id: "townhouse", name: { ar: "تاون هاوس", en: "Townhouse" } },
        { id: "penthouse", name: { ar: "بنتهاوس", en: "Penthouse" } },
        { id: "studios", name: { ar: "إستوديوهات", en: "Studios" } },
        { id: "chalets", name: { ar: "شاليهات", en: "Chalets" } },
        { id: "cabin", name: { ar: "كوخ", en: "Cabin" } },
        { id: "roof", name: { ar: "روف", en: "Roof" } },
      ]
    },
    // تصنيفات تجارية
    { 
      id: "commercial", 
      name: { ar: "تجاري", en: "Commercial" },
      subcategories: [
        { id: "offices", name: { ar: "مكاتب", en: "Offices" } },
        { id: "stores", name: { ar: "متاجر", en: "Stores" } },
        { id: "restaurants", name: { ar: "مطاعم", en: "Restaurants" } },
        { id: "cafes", name: { ar: "مقاهي", en: "Cafes" } },
        { id: "showrooms", name: { ar: "معارض", en: "Showrooms" } },
        { id: "clinics", name: { ar: "عيادات", en: "Clinics" } },
        { id: "salons", name: { ar: "صالونات", en: "Salons" } },
        { id: "hotels", name: { ar: "فنادق", en: "Hotels" } },
        { id: "gyms", name: { ar: "صالات رياضية", en: "Gyms" } },
        { id: "schools", name: { ar: "مدارس", en: "Schools" } }
      ]
    },
    // التخصصات (داخلي/خارجي/لاندسكيب)
    { 
      id: "specializations", 
      name: { ar: "التخصصات", en: "Specializations" },
      subcategories: [
        { id: "interior", name: { ar: "داخلي", en: "Interior" } },
        { id: "exterior", name: { ar: "خارجي", en: "Exterior" } },
        { id: "landscape", name: { ar: "لاندسكيب", en: "Landscape" } },
        { id: "both", name: { ar: "داخلي وخارجي", en: "Interior and Exterior" } }
      ]
    },
    // أنواع الغرف الداخلية
    { 
      id: "interior_rooms", 
      name: { ar: "الغرف الداخلية", en: "Interior Rooms" },
      subcategories: [
        { id: "full_projects", name: { ar: "مشاريع كاملة", en: "Full Projects" } },
        { id: "living_room", name: { ar: "غرفة المعيشة", en: "Living Room" } },
        { id: "salon", name: { ar: "صالون", en: "Salon" } },
        { id: "kitchen", name: { ar: "مطبخ", en: "Kitchen" } },
        { id: "dining_room", name: { ar: "غرفة الطعام", en: "Dining Room" } },
        { id: "bathroom", name: { ar: "حمام", en: "Bathroom" } },
        { id: "home_office", name: { ar: "مكتب منزلي", en: "Home Office" } },
        { id: "master_bedroom", name: { ar: "غرفة نوم رئيسية", en: "Master Bedroom" } },
        { id: "children_room", name: { ar: "غرفة أطفال", en: "Children's Room" } },
        { id: "guest_room", name: { ar: "غرفة ضيوف", en: "Guest Room" } },
        { id: "library", name: { ar: "مكتبة", en: "Library" } },
        { id: "Boys_Bedroom", name: { ar: "غرفة نوم الاولاد", en: "Boys' Bedroom" } },
        { id: "Girls_Bedroom", name: { ar: "غرفة نوم البنات", en: "Girls' Bedroom" } },
        { id: "Second_Bedroom", name: { ar: "غرفة نوم ثانوية", en: "Second Bedroom" } },
        { id: "prayer_room", name: { ar: "غرفة صلاة", en: "Prayer Room" } },
        { id: "dressing_room", name: { ar: "غرفة ملابس", en: "Dressing Room" } },
        { id: "laundry_room", name: { ar: "غرفة غسيل", en: "Laundry Room" } },
        { id: "storage_room", name: { ar: "غرفة تخزين", en: "Storage Room" } }
      ]
    },
    // الغرف التجارية
    { 
      id: "commercial_rooms", 
      name: { ar: "الغرف التجارية", en: "Commercial Rooms" },
      subcategories: [
        { id: "commercial_reception", name: { ar: "استقبال", en: "Reception" } },
        { id: "commercial_waiting", name: { ar: "غرفة انتظار", en: "Waiting Room" } },
        { id: "commercial_conference", name: { ar: "غرفة اجتماعات", en: "Conference Room" } },
        { id: "commercial_manager", name: { ar: "غرفة مدير", en: "Manager's Room" } },
        { id: "commercial_bathroom", name: { ar: "حمام تجاري", en: "Commercial Bathroom" } },
        { id: "commercial_kitchen", name: { ar: "مطبخ تجاري", en: "Commercial Kitchen" } },
        { id: "commercial_storage", name: { ar: "مخزن تجاري", en: "Commercial Storage" } }
      ]
    },
    // الأماكن الخارجية
    { 
      id: "exterior_areas", 
      name: { ar: "الأماكن الخارجية", en: "Exterior Areas" },
      subcategories: [
        { id: "facade", name: { ar: "واجهة", en: "Facade" } },
        { id: "garden", name: { ar: "حديقة", en: "Garden" } },
        { id: "swimming_pool", name: { ar: "مسبح", en: "Swimming Pool" } },
        { id: "terrace", name: { ar: "تراس", en: "Terrace" } },
        { id: "balcony", name: { ar: "بلكونة", en: "Balcony" } },
        { id: "patio", name: { ar: "فناء", en: "Patio" } },
        { id: "driveway", name: { ar: "مدخل سيارات", en: "Driveway" } },
        { id: "parking", name: { ar: "موقف سيارات", en: "Parking" } },
        { id: "fence", name: { ar: "سياج", en: "Fence" } },
        { id: "gazebo", name: { ar: "جازيبو", en: "Gazebo" } },
        { id: "outdoor_kitchen", name: { ar: "مطبخ خارجي", en: "Outdoor Kitchen" } },
        { id: "fire_pit", name: { ar: "مشعل نار", en: "Fire Pit" } },
        { id: "walkway", name: { ar: "ممشى", en: "Walkway" } }
      ]
    },
    // أنماط التصميم
    { 
      id: "design_styles", 
      name: { ar: "أنماط التصميم", en: "Design Styles" },
      subcategories: [
        { id: "modern", name: { ar: "عصري", en: "Modern" } },
        { id: "classic", name: { ar: "كلاسيكي", en: "Classic" } },
        { id: "minimalist", name: { ar: "بسيط", en: "Minimalist" } },
        { id: "luxury", name: { ar: "فاخر", en: "Luxury" } },
        { id: "traditional", name: { ar: "تقليدي", en: "Traditional" } },
        { id: "contemporary", name: { ar: "معاصر", en: "Contemporary" } },
        { id: "industrial", name: { ar: "صناعي", en: "Industrial" } },
        { id: "scandinavian", name: { ar: "سكاندينافي", en: "Scandinavian" } },
        { id: "rustic", name: { ar: "ريفي", en: "Rustic" } },
        { id: "mediterranean", name: { ar: "بحر متوسط", en: "Mediterranean" } },
        { id: "art_deco", name: { ar: "آرت ديكو", en: "Art Deco" } },
        { id: "bohemian", name: { ar: "بوهيمي", en: "Bohemian" } }
      ]
    }
  ], []);
  
  // جمع كل الوسائط في مصفوفة واحدة
  const allMedia = useMemo(() => {
    const media = [];
    
    // الصور
    if (project.coverImage && isPermanentUrl(project.coverImage)) 
      media.push({ url: project.coverImage, type: 'cover' });
    
    if (project.featuredImage && isPermanentUrl(project.featuredImage)) 
      media.push({ url: project.featuredImage, type: 'featured' });
    
    if (project.mainImage && isPermanentUrl(project.mainImage) && !media.some(item => item.url === project.mainImage)) {
      media.push({ url: project.mainImage, type: 'main' });
    }
    
    project.beforeImages?.forEach(img => {
      if (isPermanentUrl(img) && !media.some(existing => existing.url === img)) {
        media.push({ url: img, type: 'before' });
      }
    });
    
    project.afterImages?.forEach(img => {
      if (isPermanentUrl(img) && !media.some(existing => existing.url === img)) {
        media.push({ url: img, type: 'after' });
      }
    });
    
    project.galleryImages?.forEach(img => {
      if (isPermanentUrl(img) && !media.some(existing => existing.url === img)) {
        media.push({ url: img, type: 'gallery' });
      }
    });
    
    project.additionalImages?.forEach(img => {
      if (isPermanentUrl(img) && !media.some(existing => existing.url === img)) {
        media.push({ url: img, type: 'gallery' });
      }
    });
    
    // الفيديوهات
    if (project.videoUrl && isPermanentUrl(project.videoUrl)) {
      media.push({ url: project.videoUrl, type: 'video' });
    }
    
    project.additionalVideos?.forEach(video => {
      if (isPermanentUrl(video) && !media.some(existing => existing.url === video)) {
        media.push({ url: video, type: 'video' });
      }
    });
    
    return media;
  }, [project, isPermanentUrl]);

  // تبويبات العرض
  const tabs = useMemo(() => [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'gallery', label: 'معرض الوسائط' },
    { id: 'details', label: 'التفاصيل'},
    { id: 'solutions', label: 'الحلول' },
    { id: 'colors', label: 'الألوان'  }
  ], []);
  
  // ==================== دالة مساعدة للحصول على اسم التصنيف الفرعي ====================
  const getSubcategoryName = useCallback((subCategoryId, mainCategoryId) => {
    if (!subCategoryId || !mainCategoryId) return '';
    
    const mainCategory = designCategories.find(cat => cat.id === mainCategoryId);
    if (mainCategory) {
      const subCat = mainCategory.subcategories?.find(sub => sub.id === subCategoryId);
      return subCat?.name?.ar || subCategoryId;
    }
    
    // البحث في التصنيفات الأخرى
    for (const category of designCategories) {
      const subCat = category.subcategories?.find(sub => sub.id === subCategoryId);
      if (subCat) {
        return subCat.name?.ar || subCategoryId;
      }
    }
    
    return subCategoryId;
  }, [designCategories]);
  
  // دالة لعرض تصنيفات المشروع
  const getCategoryDisplay = useCallback(() => {
    const category = project.category;
    if (!category) return 'غير محدد';
    
    const parts = [];
    
    if (category.mainCategory) {
      const mainCatName = category.mainCategory === 'residential' ? 'سكني' : 'تجاري';
      parts.push(mainCatName);
    }
    
    if (category.subCategory) {
      const subCatName = getSubcategoryName(category.subCategory, category.mainCategory);
      if (subCatName) parts.push(subCatName);
    }
    
    if (category.specialization) {
      const specCat = designCategories.find(cat => cat.id === 'specializations');
      const spec = specCat?.subcategories?.find(sub => sub.id === category.specialization);
      if (spec) parts.push(spec.name.ar);
    }
    
    if (category.interiorRooms && Array.isArray(category.interiorRooms) && category.interiorRooms.length > 0) {
      parts.push(`${category.interiorRooms.length} غرفة داخلية`);
    }
    
    if (category.commercialRooms && Array.isArray(category.commercialRooms) && category.commercialRooms.length > 0) {
      parts.push(`${category.commercialRooms.length} غرفة تجارية`);
    }
    
    if (category.exteriorAreas && Array.isArray(category.exteriorAreas) && category.exteriorAreas.length > 0) {
      parts.push(`${category.exteriorAreas.length} منطقة خارجية`);
    }
    
    if (category.designStyles && Array.isArray(category.designStyles) && category.designStyles.length > 0) {
      parts.push(`${category.designStyles.length} نمط تصميم`);
    }
    
    return parts.length > 0 ? parts.join(' | ') : 'غير محدد';
  }, [project.category, getSubcategoryName, designCategories]);

  // تحويل التاريخ
  const formatYear = (year) => {
    return year ? `${year}م` : 'غير محدد';
  };
  
  // فتح Lightbox
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  
  // إغلاق Lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  
  // تحويل اللون HEX إلى RGBA
  const hexToRgba = (hex, alpha = 0.1) => {
    if (!hex) return 'rgba(0,0,0,0.1)';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  
  return (
    <>
      {/* خلفية سوداء شفافة تغطي كامل الشاشة */}
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 overflow-y-auto">
        <div className="bg-white rounded-none sm:rounded-2xl shadow-2xl w-full sm:max-w-6xl sm:w-full sm:max-h-[90vh] overflow-y-auto my-0 sm:my-8 mx-0 sm:mx-4">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 sm:px-8 sm:py-6 flex justify-between items-center z-20">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 truncate">
                {project.projectName?.ar || project.title?.ar || 'المشروع'}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-600 text-xs sm:text-sm">
                <span className="flex items-center whitespace-nowrap">
                  <IconMapPin className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  {project.projectLocation || project.location || 'غير محدد'}
                </span>
                <span className="flex items-center whitespace-nowrap">
                  {project.projectYear || project.year ? (
                    <>
                      {formatYear(project.projectYear || project.year)}
                    </>
                  ) : (
                    'غير محدد'
                  )}
                </span>
                <span className="flex items-center whitespace-nowrap">
                  <IconInfo className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  {project.projectArea || project.area || 'غير محدد'}
                </span>
                {project.duration && (
                  <span className="flex items-center whitespace-nowrap">
                    {project.duration}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {project.isFeatured && (
                <span className="px-2 py-1 sm:px-3 sm:py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs sm:text-sm font-medium flex items-center">
                  <IconStar className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  <span className="hidden sm:inline">مميز</span>
                </span>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="إغلاق"
              >
                <IconX className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
          
          {/* Hero Section محسّن */}
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
            <div className="aspect-video max-h-[60vh] relative">
              {activeImage && isPermanentUrl(activeImage) ? (
                <button 
                  onClick={() => {
                    const mediaIndex = allMedia.findIndex(item => item.url === activeImage);
                    if (mediaIndex !== -1) openLightbox(mediaIndex);
                  }}
                  className="w-full h-full"
                >
                  <img
                    src={activeImage}
                    alt="Project cover"
                    className="w-full h-full object-contain bg-gray-900 cursor-zoom-in hover:opacity-95 transition-opacity"
                    style={{
                      objectFit: 'contain',
                      maxHeight: '60vh'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='600' viewBox='0 0 1200 600'%3E%3Crect width='1200' height='600' fill='%231a202c'/%3E%3Ctext x='600' y='300' text-anchor='middle' dy='.3em' fill='%23a0aec0' font-size='24' font-family='system-ui'%3Eخطأ في تحميل الصورة%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </button>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="text-center text-white">
                    <IconImage className="w-24 h-24 mx-auto mb-4 text-gray-500" />
                    <p className="text-gray-400">لا توجد صورة غلاف متاحة</p>
                  </div>
                </div>
              )}
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>
            
            {/* Project Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${
                    project.isActive ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {project.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                  {project.category?.mainCategory && (
                    <span className="px-2 py-1 sm:px-3 sm:py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs sm:text-sm font-medium">
                      {project.category.mainCategory === 'residential' ? 'سكني' : 'تجاري'}
                    </span>
                  )}
                </div>
                
                <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-2 sm:mb-4 line-clamp-2">
                  {project.briefDescription?.ar || project.description?.ar || ''}
                </p>
              </div>
            </div>
            
            {/* Image Navigation */}
            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 flex gap-1 sm:gap-2">
              {allMedia.slice(0, isMobile ? 3 : 4).map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(item.type === 'video' ? '' : item.url)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === item.url ? 'border-white scale-110' : 'border-white/50 hover:border-white'
                  }`}
                  aria-label={item.type === 'video' ? `فيديو ${index + 1}` : `صورة ${index + 1}`}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <IconVideo className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              ))}
              {allMedia.length > (isMobile ? 3 : 4) && (
                <button
                  onClick={() => {
                    setActiveTab('gallery');
                    setTimeout(() => {
                      const galleryElement = document.querySelector('.tab-content');
                      if (galleryElement) {
                        galleryElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 100);
                  }}
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-black/50 text-white rounded-lg flex items-center justify-center text-xs sm:text-sm hover:bg-black/70"
                  aria-label="المزيد من الوسائط"
                >
                  +{allMedia.length - (isMobile ? 3 : 4)}
                </button>
              )}
            </div>
          </div>
          
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto px-2 sm:px-4 md:px-8">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4 font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-1 sm:flex-none justify-center min-w-[100px] sm:min-w-0 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm">{tab.icon}</span>
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-4 sm:p-6 md:p-8 tab-content">
            {/* نظرة عامة */}
            {activeTab === 'overview' && (
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {/* Project Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-blue-200">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-700 mb-1 sm:mb-2">
                      {allMedia.length}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-600 font-medium">
                      عدد الوسائط
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-green-200">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-700 mb-1 sm:mb-2">
                      {Array.isArray(project.features) ? project.features.length : 0}
                    </div>
                    <div className="text-xs sm:text-sm text-green-600 font-medium">
                      عدد المميزات
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-purple-200">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-700 mb-1 sm:mb-2">
                      {Array.isArray(project.selectedColors) ? project.selectedColors.length : 0}
                    </div>
                    <div className="text-xs sm:text-sm text-purple-600 font-medium">
                      عدد الألوان
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-amber-200">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-amber-700 mb-1 sm:mb-2">
                      {project.order || 0}
                    </div>
                    <div className="text-xs sm:text-sm text-amber-600 font-medium">
                      ترتيب العرض
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <IconInfo className="ml-2 text-blue-600 w-4 h-4 sm:w-5 sm:h-5" />
                    الوصف التفصيلي
                  </h3>
                  
                  <div className="text-sm sm:text-base leading-relaxed">
                    {project.detailedDescription?.ar ? (
                      <div className="text-gray-700 space-y-2 sm:space-y-4">
                        {project.detailedDescription.ar.split('\n').map((para, idx) => (
                          <p key={idx} className="text-justify">{para}</p>
                        ))}
                      </div>
                    ) : project.briefDescription?.ar ? (
                      <p className="text-gray-700">
                        {project.briefDescription.ar}
                      </p>
                    ) : (
                      <p className="text-gray-500 italic">لا يوجد وصف مفصل متوفر</p>
                    )}
                  </div>
                </div>
                
                {/* Client Info */}
                {(project.clientName || project.clientFeedback) && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                      <IconUser className="ml-2 text-gray-600 w-4 h-4 sm:w-5 sm:h-5" />
                      معلومات العميل
                    </h3>
                    
                    <div className="space-y-3 sm:space-y-4">
                      {project.clientName && (
                        <div>
                          <h4 className="text-xs sm:text-sm text-gray-600 mb-1">اسم العميل</h4>
                          <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                            {project.clientName}
                          </p>
                        </div>
                      )}
                      
                      {project.clientFeedback && (
                        <div>
                          <h4 className="text-xs sm:text-sm text-gray-600 mb-1">تقييم العميل</h4>
                          <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200">
                            <p className="text-gray-700 italic text-sm sm:text-base">"{project.clientFeedback}"</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Features */}
                {Array.isArray(project.features) && project.features.length > 0 && (
                  <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                      <IconStar className="ml-2 text-yellow-600 w-4 h-4 sm:w-5 sm:h-5" />
                      مميزات المشروع
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                      {project.features.map((feature, index) => (
                        <div key={index} className="flex items-start p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-500 rounded-full mt-1.5 sm:mt-2 ml-2 sm:ml-3" />
                          <span className="text-sm sm:text-base text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* معرض الوسائط - محسّن */}
            {activeTab === 'gallery' && (
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {/* إشعار Lightbox */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h3 className="font-bold text-blue-800 text-sm sm:text-base">
                          عرض الوسائط بدقة عالية
                        </h3>
                        <p className="text-xs sm:text-sm text-blue-600">
                          انقر على أي صورة أو فيديو لعرضها بشكل كامل مع إمكانية التكبير والتنزيل
                        </p>
                      </div>
                    </div>
                    <div className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full">
                      {allMedia.length} وسائط
                    </div>
                  </div>
                </div>
                
                {/* قبل وبعد */}
                {((Array.isArray(project.beforeImages) && project.beforeImages.length > 0) || 
                  (Array.isArray(project.afterImages) && project.afterImages.length > 0)) && (
                  <div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-4 sm:mb-6">صور قبل وبعد</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                      {Array.isArray(project.beforeImages) && project.beforeImages.length > 0 && (
                        <div>
                          <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                            <span className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full ml-2" />
                            قبل التنفيذ ({project.beforeImages.length})
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3">
                            {project.beforeImages.slice(0, isMobile ? 4 : 6).map((img, index) => (
                              isPermanentUrl(img) && (
                                <button
                                  key={index}
                                  onClick={() => {
                                    const mediaIndex = allMedia.findIndex(item => item.url === img);
                                    if (mediaIndex !== -1) openLightbox(mediaIndex);
                                  }}
                                  className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden group bg-gray-100 hover:shadow-xl transition-all duration-300"
                                  aria-label={`صورة قبل التنفيذ ${index + 1}`}
                                >
                                  <img
                                    src={img}
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    style={{ objectFit: 'cover' }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="bg-black/70 text-white px-3 py-1.5 rounded-full text-xs flex items-center space-x-1">
                                      <IconZoomIn className="w-3 h-3" />
                                      <span>تكبير</span>
                                    </div>
                                  </div>
                                </button>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {Array.isArray(project.afterImages) && project.afterImages.length > 0 && (
                        <div>
                          <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                            <span className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full ml-2" />
                            بعد التنفيذ ({project.afterImages.length})
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3">
                            {project.afterImages.slice(0, isMobile ? 4 : 6).map((img, index) => (
                              isPermanentUrl(img) && (
                                <button
                                  key={index}
                                  onClick={() => {
                                    const mediaIndex = allMedia.findIndex(item => item.url === img);
                                    if (mediaIndex !== -1) openLightbox(mediaIndex);
                                  }}
                                  className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden group bg-gray-100 hover:shadow-xl transition-all duration-300"
                                  aria-label={`صورة بعد التنفيذ ${index + 1}`}
                                >
                                  <img
                                    src={img}
                                    alt=""
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    style={{ objectFit: 'cover' }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="bg-black/70 text-white px-3 py-1.5 rounded-full text-xs flex items-center space-x-1">
                                      <IconZoomIn className="w-3 h-3" />
                                      <span>تكبير</span>
                                    </div>
                                  </div>
                                </button>
                              )
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* معرض الوسائط الكامل */}
                {allMedia.length > 0 && (
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                        معرض الوسائط ({allMedia.length} ملف)
                      </h3>
                      <div className="text-sm text-gray-600 flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-xs">قبل</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs">بعد</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <IconVideo className="w-3 h-3 text-blue-500" />
                          <span className="text-xs">فيديو</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                      {allMedia.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => openLightbox(index)}
                          className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden group bg-gray-100 hover:shadow-xl transition-all duration-300"
                          aria-label={item.type === 'video' ? `فيديو ${index + 1}` : `صورة ${index + 1}`}
                        >
                          {item.type === 'video' ? (
                            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                              <IconVideo className="w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center">
                                  <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <img
                              src={item.url}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              style={{ objectFit: 'cover' }}
                              loading="lazy"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-2 right-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full text-white ${
                              item.type === 'before' ? 'bg-red-500' :
                              item.type === 'after' ? 'bg-green-500' :
                              item.type === 'video' ? 'bg-blue-500' :
                              item.type === 'cover' ? 'bg-purple-500' :
                              'bg-gray-500'
                            }`}>
                              {index + 1}
                            </span>
                          </div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-black/70 text-white px-3 py-1.5 rounded-full text-xs flex items-center space-x-2">
                              {item.type === 'video' ? (
                                <>
                                  <IconVideo className="w-3 h-3" />
                                  <span>تشغيل</span>
                                </>
                              ) : (
                                <>
                                  <IconZoomIn className="w-3 h-3" />
                                  <span>تكبير</span>
                                  <IconDownload className="w-3 h-3" />
                                  <span>تحميل</span>
                                </>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* التفاصيل */}
            {activeTab === 'details' && (
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {/* المعلومات الأساسية */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl border border-blue-200 p-4 sm:p-6 md:p-8">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-800 mb-4 sm:mb-6 flex items-center">
                    <IconHome className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    المعلومات الأساسية
                  </h3>
                  
                  <div className="space-y-4 sm:space-y-6">
                    {/* Project Info Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                          <div className="text-xs sm:text-sm text-gray-600 mb-1">اسم المشروع</div>
                          <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                            {project.projectName?.ar || project.title?.ar}
                          </div>
                          {project.projectName?.en && (
                            <div className="text-xs sm:text-sm text-gray-500 mt-1">
                              {project.projectName.en}
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                          <div className="text-xs sm:text-sm text-gray-600 mb-1">التصنيف</div>
                          <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                            {getCategoryDisplay()}
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                          <div className="text-xs sm:text-sm text-gray-600 mb-1">الموقع</div>
                          <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 flex items-center">
                            <IconMapPin className="w-3 h-3 sm:w-4 sm:h-4 ml-1 text-gray-500" />
                            {project.projectLocation || project.location || 'غير محدد'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3 sm:space-y-4">
                        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                          <div className="text-xs sm:text-sm text-gray-600 mb-1">سنة التنفيذ</div>
                          <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                            {formatYear(project.projectYear || project.year)}
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                          <div className="text-xs sm:text-sm text-gray-600 mb-1">المساحة</div>
                          <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 flex items-center">
                            <IconInfo className="w-3 h-3 sm:w-4 sm:h-4 ml-1 text-gray-500" />
                            {project.projectArea || project.area || 'غير محدد'}
                          </div>
                        </div>
                        
                        <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                          <div className="text-xs sm:text-sm text-gray-600 mb-1">المدة</div>
                          <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                            {project.duration || 'غير محددة'}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* التصنيفات الفرعية */}
                    {project.category && (
                      <div>
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">تفاصيل التصنيف</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          {project.category?.mainCategory && (
                            <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                              <div className="text-xs sm:text-sm text-gray-600 mb-1">النوع الرئيسي</div>
                              <div className="text-sm sm:text-base font-semibold text-gray-900">
                                {project.category.mainCategory === 'residential' ? 'سكني' : 'تجاري'}
                              </div>
                            </div>
                          )}
                          
                          {project.category?.subCategory && (
                            <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                              <div className="text-xs sm:text-sm text-gray-600 mb-1">النوع الفرعي</div>
                              <div className="text-sm sm:text-base font-semibold text-gray-900">
                                {getSubcategoryName(project.category.subCategory, project.category.mainCategory)}
                              </div>
                            </div>
                          )}
                          
                          {project.category?.specialization && (
                            <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                              <div className="text-xs sm:text-sm text-gray-600 mb-1">التخصص</div>
                              <div className="text-sm sm:text-base font-semibold text-gray-900">
                                {(() => {
                                  const specCat = designCategories.find(cat => cat.id === 'specializations');
                                  const spec = specCat?.subcategories?.find(sub => sub.id === project.category.specialization);
                                  return spec?.name?.ar || project.category.specialization;
                                })()}
                              </div>
                            </div>
                          )}
                          
                          {project.category?.interiorRooms && Array.isArray(project.category.interiorRooms) && project.category.interiorRooms.length > 0 && (
                            <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                              <div className="text-xs sm:text-sm text-gray-600 mb-1">الغرف الداخلية</div>
                              <div className="text-sm sm:text-base font-semibold text-gray-900">
                                {project.category.interiorRooms.length} نوع
                              </div>
                            </div>
                          )}
                          
                          {project.category?.commercialRooms && Array.isArray(project.category.commercialRooms) && project.category.commercialRooms.length > 0 && (
                            <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                              <div className="text-xs sm:text-sm text-gray-600 mb-1">الغرف التجارية</div>
                              <div className="text-sm sm:text-base font-semibold text-gray-900">
                                {project.category.commercialRooms.length} نوع
                              </div>
                            </div>
                          )}
                          
                          {project.category?.exteriorAreas && Array.isArray(project.category.exteriorAreas) && project.category.exteriorAreas.length > 0 && (
                            <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                              <div className="text-xs sm:text-sm text-gray-600 mb-1">الأماكن الخارجية</div>
                              <div className="text-sm sm:text-base font-semibold text-gray-900">
                                {project.category.exteriorAreas.length} منطقة
                              </div>
                            </div>
                          )}
                          
                          {project.category?.designStyles && Array.isArray(project.category.designStyles) && project.category.designStyles.length > 0 && (
                            <div className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                              <div className="text-xs sm:text-sm text-gray-600 mb-1">أنماط التصميم</div>
                              <div className="text-sm sm:text-base font-semibold text-gray-900">
                                {project.category.designStyles.length} نمط
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* عرض تفاصيل الغرف الداخلية */}
                        {project.category?.interiorRooms && Array.isArray(project.category.interiorRooms) && project.category.interiorRooms.length > 0 && (
                          <div className="mt-4 bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                            <div className="text-xs sm:text-sm text-gray-600 mb-2">الغرف الداخلية المضمنة:</div>
                            <div className="flex flex-wrap gap-1.5">
                              {project.category.interiorRooms.map((roomType, index) => {
                                const roomCategory = designCategories.find(cat => cat.id === 'interior_rooms');
                                const room = roomCategory?.subcategories?.find(sub => sub.id === roomType);
                                return (
                                  <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                                    {room?.name?.ar || roomType}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {/* عرض تفاصيل الغرف التجارية */}
                        {project.category?.commercialRooms && Array.isArray(project.category.commercialRooms) && project.category.commercialRooms.length > 0 && (
                          <div className="mt-4 bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                            <div className="text-xs sm:text-sm text-gray-600 mb-2">الغرف التجارية المضمنة:</div>
                            <div className="flex flex-wrap gap-1.5">
                              {project.category.commercialRooms.map((roomType, index) => {
                                const roomCategory = designCategories.find(cat => cat.id === 'commercial_rooms');
                                const room = roomCategory?.subcategories?.find(sub => sub.id === roomType);
                                return (
                                  <span key={index} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                                    {room?.name?.ar || roomType}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {/* عرض تفاصيل الأماكن الخارجية */}
                        {project.category?.exteriorAreas && Array.isArray(project.category.exteriorAreas) && project.category.exteriorAreas.length > 0 && (
                          <div className="mt-4 bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                            <div className="text-xs sm:text-sm text-gray-600 mb-2">الأماكن الخارجية المضمنة:</div>
                            <div className="flex flex-wrap gap-1.5">
                              {project.category.exteriorAreas.map((area, index) => {
                                const areaCategory = designCategories.find(cat => cat.id === 'exterior_areas');
                                const areaObj = areaCategory?.subcategories?.find(sub => sub.id === area);
                                return (
                                  <span key={index} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                                    {areaObj?.name?.ar || area}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {/* عرض تفاصيل أنماط التصميم */}
                        {project.category?.designStyles && Array.isArray(project.category.designStyles) && project.category.designStyles.length > 0 && (
                          <div className="mt-4 bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                            <div className="text-xs sm:text-sm text-gray-600 mb-2">أنماط التصميم:</div>
                            <div className="flex flex-wrap gap-1.5">
                              {project.category.designStyles.map((style, index) => {
                                const styleCategory = designCategories.find(cat => cat.id === 'design_styles');
                                const styleObj = styleCategory?.subcategories?.find(sub => sub.id === style);
                                return (
                                  <span key={index} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                                    {styleObj?.name?.ar || style}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* التحديات */}
                {Array.isArray(project.challenges) && project.challenges.length > 0 && (
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl sm:rounded-2xl border border-orange-200 p-4 sm:p-6 md:p-8">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-orange-800 mb-4 sm:mb-6 flex items-center">
                      <IconChallenge className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                      التحديات ({project.challenges.length})
                    </h3>
                    
                    <div className="space-y-2 sm:space-y-3">
                      {project.challenges.map((challenge, index) => (
                        <div key={index} className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-orange-100 hover:bg-orange-50 transition-colors">
                          <div className="flex items-start">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 text-orange-600 rounded flex items-center justify-center ml-2 sm:ml-3 flex-shrink-0 text-xs sm:text-sm">
                              {index + 1}
                            </div>
                            <p className="text-sm sm:text-base text-gray-700">{challenge}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* النتائج */}
                {Array.isArray(project.results) && project.results.length > 0 && (
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl sm:rounded-2xl border border-emerald-200 p-4 sm:p-6 md:p-8">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-emerald-800 mb-4 sm:mb-6 flex items-center">
                      <IconResults className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                      النتائج النهائية ({project.results.length})
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {project.results.map((result, index) => (
                        <div key={index} className="bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl border border-emerald-100">
                          <div className="flex items-center mb-2">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full ml-2" />
                            <span className="text-xs sm:text-sm font-medium text-gray-700">نتيجة {index + 1}</span>
                          </div>
                          <p className="text-sm sm:text-base text-gray-600">{result}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* الوسوم */}
                {project.tags && (
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl sm:rounded-2xl border border-purple-200 p-4 sm:p-6 md:p-8">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-purple-800 mb-4 sm:mb-6">الوسوم</h3>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {(() => {
                        let tagsArray = [];
                        if (Array.isArray(project.tags)) {
                          tagsArray = project.tags;
                        } else if (project.tags && project.tags.ar && Array.isArray(project.tags.ar)) {
                          tagsArray = project.tags.ar;
                        } else if (typeof project.tags === 'string') {
                          tagsArray = [project.tags];
                        }
                        
                        return tagsArray.map((tag, index) => (
                          <span key={index} className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-white text-purple-700 rounded-full border border-purple-200 text-xs sm:text-sm font-medium">
                            #{tag}
                          </span>
                        ));
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* الحلول */}
            {activeTab === 'solutions' && (
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {Array.isArray(project.designSolution) && project.designSolution.length > 0 && (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl border border-green-200 p-4 sm:p-6 md:p-8">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-green-800 mb-4 sm:mb-6 flex items-center">
                      <IconSolution className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                      الحلول التصميمية ({project.designSolution.length})
                    </h3>
                    
                    <div className="space-y-3 sm:space-y-4">
                      {project.designSolution.map((solution, index) => (
                        <div key={index} className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-green-100 hover:shadow-md transition-shadow">
                          <div className="flex items-start">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 text-green-600 rounded flex items-center justify-center ml-3 sm:ml-4 flex-shrink-0">
                              <IconCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div>
                              <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                                الحل التصميمي رقم {index + 1}
                              </h4>
                              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{solution}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* الميزانية */}
                {project.budget && (
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl sm:rounded-2xl border border-amber-200 p-4 sm:p-6 md:p-8">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-amber-800 mb-3 sm:mb-4">الميزانية</h3>
                    <div className="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl border border-amber-200">
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-700 text-center">
                        {project.budget}
                      </div>
                      <p className="text-center text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">التكلفة الإجمالية للمشروع</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* الألوان */}
            {activeTab === 'colors' && Array.isArray(project.selectedColors) && project.selectedColors.length > 0 && (
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl sm:rounded-2xl border border-pink-200 p-4 sm:p-6 md:p-8">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-pink-800 mb-4 sm:mb-6 flex items-center">
                    <IconColorPalette className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    لوحة الألوان ({project.selectedColors.length} لون)
                  </h3>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
                    {project.selectedColors.map((color, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg sm:rounded-xl md:rounded-2xl mb-2 sm:mb-3 border border-gray-200 shadow-lg"
                          style={{ backgroundColor: color }}
                        />
                        <div className="text-center">
                          <div className="font-mono text-xs sm:text-sm font-semibold text-gray-900 truncate w-full px-1">
                            {color}
                          </div>
                          <div
                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mx-auto mt-1 sm:mt-2"
                            style={{ backgroundColor: color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Color Palette Preview */}
                  <div className="mt-6 sm:mt-8 bg-white rounded-lg sm:rounded-xl p-4 sm:p-6">
                    <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">عينة من لوحة الألوان</h4>
                    <div className="h-20 sm:h-24 md:h-28 lg:h-32 rounded-lg overflow-hidden flex">
                      {project.selectedColors.map((color, index) => (
                        <div
                          key={index}
                          className="flex-1"
                          style={{
                            backgroundColor: color,
                            backgroundImage: `linear-gradient(135deg, ${color} 0%, ${hexToRgba(color, 0.8)} 100%)`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="border-t border-gray-200 px-4 py-4 sm:px-6 sm:py-6 bg-gray-50 rounded-b-none sm:rounded-b-2xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              <div className="text-xs sm:text-sm text-gray-600">
                <span className="font-medium">معرّف المشروع:</span> {project.id || 'غير متوفر'}
                <span className="mx-1 sm:mx-2">•</span>
                <span className="font-medium">تاريخ الإنشاء:</span> {new Date(project.createdAt).toLocaleDateString('ar-SA') || 'غير محدد'}
                {project.pageType && (
                  <>
                    <span className="mx-1 sm:mx-2">•</span>
                    <span className="font-medium">الصفحة:</span> {project.pageType === 'admin' ? 'صفحة الإدارة' : 'المعرض'}
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  إغلاق
                </button>
                
                <div className="flex items-center text-xs sm:text-sm text-gray-500">
                  <IconEye className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                  <span className="hidden sm:inline">عرض المشروع</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lightbox محسن */}
      <EnhancedLightbox 
        media={allMedia}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        title={project.projectName?.ar || 'معرض الوسائط'}
      />
    </>
  );
};

// ==================== المكون الرئيسي (نموذج المشروع) المعدل ====================
const ProjectModal = ({ 
  isEdit = false, 
  initialData = null,
  onSubmit, 
  onClose, 
  isViewer = false,
  showNotification
}) => {
  // ==================== فئات التصميم المعدلة والمحدثة ====================
  const designCategories = useMemo(() => [
    // تصنيفات سكنية
    { 
      id: "residential", 
      name: { ar: "سكني", en: "Residential" },
      subcategories: [
        { id: "apartments", name: { ar: "شقق", en: "Apartments" } },
        { id: "villas", name: { ar: "فلل", en: "Villas" } },
        { id: "duplex", name: { ar: "دوبلكس", en: "Duplex" } },
        { id: "townhouse", name: { ar: "تاون هاوس", en: "Townhouse" } },
        { id: "penthouse", name: { ar: "بنتهاوس", en: "Penthouse" } },
        { id: "studios", name: { ar: "إستوديوهات", en: "Studios" } },
        { id: "chalets", name: { ar: "شاليهات", en: "Chalets" } },
        { id: "cabin", name: { ar: "كوخ", en: "Cabin" } },
        { id: "roof", name: { ar: "روف", en: "Roof" } },
      ]
    },
    // تصنيفات تجارية
    { 
      id: "commercial", 
      name: { ar: "تجاري", en: "Commercial" },
      subcategories: [
        { id: "offices", name: { ar: "مكاتب", en: "Offices" } },
        { id: "stores", name: { ar: "متاجر", en: "Stores" } },
        { id: "restaurants", name: { ar: "مطاعم", en: "Restaurants" } },
        { id: "cafes", name: { ar: "مقاهي", en: "Cafes" } },
        { id: "showrooms", name: { ar: "معارض", en: "Showrooms" } },
        { id: "clinics", name: { ar: "عيادات", en: "Clinics" } },
        { id: "salons", name: { ar: "صالونات", en: "Salons" } },
        { id: "hotels", name: { ar: "فنادق", en: "Hotels" } },
        { id: "gyms", name: { ar: "صالات رياضية", en: "Gyms" } },
        { id: "schools", name: { ar: "مدارس", en: "Schools" } }
      ]
    },
    // التخصصات (داخلي/خارجي/لاندسكيب)
    { 
      id: "specializations", 
      name: { ar: "التخصصات", en: "Specializations" },
      subcategories: [
        { id: "interior", name: { ar: "داخلي", en: "Interior" } },
        { id: "exterior", name: { ar: "خارجي", en: "Exterior" } },
        { id: "landscape", name: { ar: "لاندسكيب", en: "Landscape" } },
        { id: "both", name: { ar: "داخلي وخارجي", en: "Interior & Exterior" } }
      ]
    },
    // أنواع الغرف الداخلية (تم التحديث بإضافة الغرف الجديدة)
    { 
      id: "interior_rooms", 
      name: { ar: "الغرف الداخلية", en: "Interior Rooms" },
      subcategories: [
        { id: "full_projects", name: { ar: "مشاريع كاملة", en: "Full Projects" } },
        { id: "living_room", name: { ar: "غرفة المعيشة", en: "Living Room" } },
        { id: "salon", name: { ar: "صالون", en: "Salon" } },
        { id: "kitchen", name: { ar: "مطبخ", en: "Kitchen" } },
        { id: "dining_room", name: { ar: "غرفة الطعام", en: "Dining Room" } },
        { id: "bathroom", name: { ar: "حمام", en: "Bathroom" } },
        { id: "home_office", name: { ar: "مكتب منزلي", en: "Home Office" } },
        { id: "master_bedroom", name: { ar: "غرفة نوم رئيسية", en: "Master Bedroom" } },
        { id: "children_room", name: { ar: "غرفة أطفال", en: "Children's Room" } },
        { id: "guest_room", name: { ar: "غرفة ضيوف", en: "Guest Room" } },
        { id: "library", name: { ar: "مكتبة", en: "Library" } },
        { id: "Boys_Bedroom", name: { ar: "غرفة نوم الاولاد", en: "Boys' Bedroom" } },
        { id: "Girls_Bedroom", name: { ar: "غرفة نوم البنات", en: "Girls' Bedroom" } },
        { id: "Second_Bedroom", name: { ar: "غرفة نوم ثانوية", en: "Second Bedroom" } },
        { id: "prayer_room", name: { ar: "غرفة صلاة", en: "Prayer Room" } },
        { id: "dressing_room", name: { ar: "غرفة ملابس", en: "Dressing Room" } },
        { id: "laundry_room", name: { ar: "غرفة غسيل", en: "Laundry Room" } },
        { id: "storage_room", name: { ar: "غرفة تخزين", en: "Storage Room" } }
      ]
    },
    // الغرف التجارية (إضافة جديدة)
    { 
      id: "commercial_rooms", 
      name: { ar: "الغرف التجارية", en: "Commercial Rooms" },
      subcategories: [
        { id: "commercial_reception", name: { ar: "استقبال", en: "Reception" } },
        { id: "commercial_waiting", name: { ar: "غرفة انتظار", en: "Waiting Room" } },
        { id: "commercial_conference", name: { ar: "غرفة اجتماعات", en: "Conference Room" } },
        { id: "commercial_manager", name: { ar: "غرفة مدير", en: "Manager's Room" } },
        { id: "commercial_bathroom", name: { ar: "حمام تجاري", en: "Commercial Bathroom" } },
        { id: "commercial_kitchen", name: { ar: "مطبخ تجاري", en: "Commercial Kitchen" } },
        { id: "commercial_storage", name: { ar: "مخزن تجاري", en: "Commercial Storage" } }
      ]
    },
    // الأماكن الخارجية
    { 
      id: "exterior_areas", 
      name: { ar: "الأماكن الخارجية", en: "Exterior Areas" },
      subcategories: [
        { id: "facade", name: { ar: "واجهة", en: "Facade" } },
        { id: "garden", name: { ar: "حديقة", en: "Garden" } },
        { id: "swimming_pool", name: { ar: "مسبح", en: "Swimming Pool" } },
        { id: "terrace", name: { ar: "تراس", en: "Terrace" } },
        { id: "balcony", name: { ar: "بلكونة", en: "Balcony" } },
        { id: "patio", name: { ar: "فناء", en: "Patio" } },
        { id: "driveway", name: { ar: "مدخل سيارات", en: "Driveway" } },
        { id: "parking", name: { ar: "موقف سيارات", en: "Parking" } },
        { id: "fence", name: { ar: "سياج", en: "Fence" } },
        { id: "gazebo", name: { ar: "جازيبو", en: "Gazebo" } },
        { id: "outdoor_kitchen", name: { ar: "مطبخ خارجي", en: "Outdoor Kitchen" } },
        { id: "fire_pit", name: { ar: "مشعل نار", en: "Fire Pit" } },
        { id: "walkway", name: { ar: "ممشى", en: "Walkway" } }
      ]
    },
    // أنماط التصميم
    { 
      id: "design_styles", 
      name: { ar: "أنماط التصميم", en: "Design Styles" },
      subcategories: [
        { id: "modern", name: { ar: "عصري", en: "Modern" } },
        { id: "classic", name: { ar: "كلاسيكي", en: "Classic" } },
        { id: "minimalist", name: { ar: "بسيط", en: "Minimalist" } },
        { id: "luxury", name: { ar: "فاخر", en: "Luxury" } },
        { id: "traditional", name: { ar: "تقليدي", en: "Traditional" } },
        { id: "contemporary", name: { ar: "معاصر", en: "Contemporary" } },
        { id: "industrial", name: { ar: "صناعي", en: "Industrial" } },
        { id: "scandinavian", name: { ar: "سكاندينافي", en: "Scandinavian" } },
        { id: "rustic", name: { ar: "ريفي", en: "Rustic" } },
        { id: "mediterranean", name: { ar: "بحر متوسط", en: "Mediterranean" } },
        { id: "art_deco", name: { ar: "آرت ديكو", en: "Art Deco" } },
        { id: "bohemian", name: { ar: "بوهيمي", en: "Bohemian" } }
      ]
    }
  ], []);

  // الحالة الابتدائية للنموذج مع إضافة pageType
  const initialFormState = useMemo(() => ({
    projectName: { ar: "", en: "" },
    projectLocation: "",
    projectYear: new Date().getFullYear().toString(),
    projectArea: "",
    briefDescription: { ar: "", en: "" },
    detailedDescription: { ar: "", en: "" },
    challenges: [],
    designSolution: [],
    results: [],
    selectedColors: [],
    coverImage: "",
    beforeImages: [],
    afterImages: [],
    featuredImage: "",
    galleryImages: [],
    features: [],
    isActive: true,
    isFeatured: false,
    order: 0,
    duration: "",
    budget: "",
    clientName: "",
    clientFeedback: "",
    tags: [],
    videoUrl: "",
    additionalVideos: [],
    pageType: "portfolio" // إضافة حقل جديد: portfolio (صفحة المعرض) أو admin (صفحة الإدارة)
  }), []);

  // ==================== إضافة حالة للتصنيفات المختارة ====================
  const [selectedCategories, setSelectedCategories] = useState({
    mainCategory: "", // سكني أو تجاري
    subCategory: "", // شقق، فلل، مكاتب، إلخ
    specialization: "", // داخلي/خارجي/لاندسكيب
    interiorRooms: [], // أنواع الغرف الداخلية (يمكن اختيار أكثر من واحد)
    commercialRooms: [], // أنواع الغرف التجارية (يمكن اختيار أكثر من واحد)
    exteriorAreas: [], // الأماكن الخارجية (يمكن اختيار أكثر من واحد)
    designStyles: [] // أنماط التصميم (يمكن اختيار أكثر من واحد)
  });

  // حالة النموذج الرئيسية
  const [formData, setFormData] = useState(initialFormState);

  // حالات المدخلات
  const [challengeInput, setChallengeInput] = useState("");
  const [solutionInput, setSolutionInput] = useState("");
  const [resultInput, setResultInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  // حالة لتتبع الأخطاء
  const [errors, setErrors] = useState({});

  // حالة للتتبع إذا تم الضغط على الإرسال
  const [isSubmitting, setIsSubmitting] = useState(false);

  // حالة للتحكم في التبويبات
  const [activeTab, setActiveTab] = useState('basic');

  // ==================== دوال إدارة الحالة ====================

  // التبويبات
  const tabs = useMemo(() => [
    { id: 'basic', label: 'المعلومات الأساسية', icon: <IconHome className="w-4 h-4" /> },
    { id: 'details', label: 'التفاصيل', icon: <IconInfo className="w-4 h-4" /> },
    { id: 'visuals', label: 'العناصر المرئية', icon: <IconImage className="w-4 h-4" /> },
    { id: 'videos', label: 'الفيديوهات', icon: <IconVideo className="w-4 h-4" /> },
    { id: 'settings', label: 'الإعدادات', icon: <IconSettings className="w-4 h-4" /> }
  ], []);

  // ==================== دوال مساعدة للتحقق من الروابط ====================
  const isPermanentUrl = useCallback((url) => {
    if (!url) return false;
    return (
      url.startsWith('http') || 
      url.startsWith('/uploads/') ||
      url.startsWith('data:image/') ||
      url.startsWith('data:video/')
    );
  }, []);

  // ==================== تهيئة البيانات الأولية ====================
  useEffect(() => {
    if (initialData) {
      const newFormData = {
        ...initialFormState,
        projectName: {
          ar: initialData.projectName?.ar || initialData.title?.ar || "",
          en: initialData.projectName?.en || initialData.title?.en || ""
        },
        projectLocation: initialData.projectLocation || initialData.location || "",
        projectYear: initialData.projectYear || initialData.year || new Date().getFullYear().toString(),
        projectArea: initialData.projectArea || initialData.area || "",
        briefDescription: {
          ar: initialData.briefDescription?.ar || initialData.description?.ar || "",
          en: initialData.briefDescription?.en || initialData.description?.en || ""
        },
        detailedDescription: {
          ar: initialData.detailedDescription?.ar || "",
          en: initialData.detailedDescription?.en || ""
        },
        challenges: Array.isArray(initialData.challenges) ? initialData.challenges : [],
        designSolution: Array.isArray(initialData.designSolution) ? initialData.designSolution : [],
        results: Array.isArray(initialData.results) ? initialData.results : [],
        selectedColors: Array.isArray(initialData.selectedColors) ? initialData.selectedColors : [],
        coverImage: initialData.coverImage || initialData.mainImage || "",
        beforeImages: Array.isArray(initialData.beforeImages) ? initialData.beforeImages : [],
        afterImages: Array.isArray(initialData.afterImages) ? initialData.afterImages : [],
        featuredImage: initialData.featuredImage || "",
        galleryImages: Array.isArray(initialData.galleryImages) ? initialData.galleryImages : 
                     Array.isArray(initialData.additionalImages) ? initialData.additionalImages : [],
        features: Array.isArray(initialData.features) ? initialData.features : [],
        isActive: initialData.isActive !== false,
        isFeatured: initialData.isFeatured || false,
        order: initialData.order || 0,
        duration: initialData.duration || "",
        budget: initialData.budget || "",
        clientName: initialData.clientName || "",
        clientFeedback: initialData.clientFeedback || "",
        tags: initialData.tags ? (
          Array.isArray(initialData.tags) ? initialData.tags : 
          (initialData.tags.ar && Array.isArray(initialData.tags.ar) ? initialData.tags.ar : [])
        ) : [],
        videoUrl: initialData.videoUrl || "",
        additionalVideos: Array.isArray(initialData.additionalVideos) ? initialData.additionalVideos : [],
        pageType: initialData.pageType || "portfolio" // إضافة قيمة pageType من البيانات أو القيمة الافتراضية
      };
      
      setFormData(newFormData);
      
      // معالجة التصنيفات من البيانات القديمة
      if (initialData.category) {
        const category = initialData.category;
        
        // إذا كانت البيانات تستخدم حقول منفصلة بدلاً من كائن category
        if (!category.mainCategory && initialData.mainCategory) {
          category.mainCategory = initialData.mainCategory;
        }
        if (!category.subCategory && initialData.subCategory) {
          category.subCategory = initialData.subCategory;
        }
        if (!category.specialization && initialData.specialization) {
          category.specialization = initialData.specialization;
        }
        
        setSelectedCategories({
          mainCategory: category.mainCategory || "",
          subCategory: category.subCategory || "",
          specialization: category.specialization || "",
          interiorRooms: Array.isArray(category.interiorRooms) ? category.interiorRooms : 
                        Array.isArray(category.interiorRoom) ? category.interiorRoom : 
                        (category.interiorRoom ? [category.interiorRoom] : []),
          commercialRooms: Array.isArray(category.commercialRooms) ? category.commercialRooms : [],
          exteriorAreas: Array.isArray(category.exteriorAreas) ? category.exteriorAreas : 
                        Array.isArray(category.exteriorArea) ? category.exteriorArea : 
                        (category.exteriorArea ? [category.exteriorArea] : []),
          designStyles: Array.isArray(category.designStyles) ? category.designStyles : 
                       Array.isArray(category.designStyle) ? category.designStyle : 
                       (category.designStyle ? [category.designStyle] : [])
        });
      }
    }
  }, [initialData, initialFormState]);

  // ==================== دالة تحديث التصنيفات ====================
  const updateCategory = useCallback((type, value) => {
    setSelectedCategories(prev => {
      const newState = { ...prev };
      
      switch (type) {
        case 'main':
          newState.mainCategory = value;
          newState.subCategory = "";
          newState.specialization = "";
          newState.interiorRooms = [];
          newState.commercialRooms = [];
          newState.exteriorAreas = [];
          break;
        case 'sub':
          newState.subCategory = value;
          break;
        case 'specialization':
          newState.specialization = value;
          break;
        case 'interior':
          if (Array.isArray(value)) {
            newState.interiorRooms = value;
          } else {
            const exists = newState.interiorRooms.includes(value);
            newState.interiorRooms = exists 
              ? newState.interiorRooms.filter(item => item !== value)
              : [...newState.interiorRooms, value];
          }
          break;
        case 'commercial':
          if (Array.isArray(value)) {
            newState.commercialRooms = value;
          } else {
            const exists = newState.commercialRooms.includes(value);
            newState.commercialRooms = exists 
              ? newState.commercialRooms.filter(item => item !== value)
              : [...newState.commercialRooms, value];
          }
          break;
        case 'exterior':
          if (Array.isArray(value)) {
            newState.exteriorAreas = value;
          } else {
            const exists = newState.exteriorAreas.includes(value);
            newState.exteriorAreas = exists 
              ? newState.exteriorAreas.filter(item => item !== value)
              : [...newState.exteriorAreas, value];
          }
          break;
        case 'style':
          if (Array.isArray(value)) {
            newState.designStyles = value;
          } else {
            const exists = newState.designStyles.includes(value);
            newState.designStyles = exists 
              ? newState.designStyles.filter(item => item !== value)
              : [...newState.designStyles, value];
          }
          break;
        default:
          break;
      }
      
      return newState;
    });
  }, []);

  // ==============================
  // دوال إدارة القوائم
  // ==============================

  const handleAddChallenge = useCallback(() => {
    if (challengeInput.trim()) {
      setFormData(prev => ({
        ...prev,
        challenges: Array.isArray(prev.challenges) ? [...prev.challenges, challengeInput.trim()] : [challengeInput.trim()]
      }));
      setChallengeInput("");
    }
  }, [challengeInput]);

  const removeChallenge = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      challenges: Array.isArray(prev.challenges) ? prev.challenges.filter((_, i) => i !== index) : []
    }));
  }, []);

  const handleAddSolution = useCallback(() => {
    if (solutionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        designSolution: Array.isArray(prev.designSolution) ? [...prev.designSolution, solutionInput.trim()] : [solutionInput.trim()]
      }));
      setSolutionInput("");
    }
  }, [solutionInput]);

  const removeSolution = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      designSolution: Array.isArray(prev.designSolution) ? prev.designSolution.filter((_, i) => i !== index) : []
    }));
  }, []);

  const handleAddResult = useCallback(() => {
    if (resultInput.trim()) {
      setFormData(prev => ({
        ...prev,
        results: Array.isArray(prev.results) ? [...prev.results, resultInput.trim()] : [resultInput.trim()]
      }));
      setResultInput("");
    }
  }, [resultInput]);

  const removeResult = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      results: Array.isArray(prev.results) ? prev.results.filter((_, i) => i !== index) : []
    }));
  }, []);

  const handleAddFeature = useCallback(() => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: Array.isArray(prev.features) ? [...prev.features, featureInput.trim()] : [featureInput.trim()]
      }));
      setFeatureInput("");
    }
  }, [featureInput]);

  const removeFeature = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      features: Array.isArray(prev.features) ? prev.features.filter((_, i) => i !== index) : []
    }));
  }, []);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: Array.isArray(prev.tags) ? [...prev.tags, tagInput.trim()] : [tagInput.trim()]
      }));
      setTagInput("");
    }
  }, [tagInput]);

  const removeTag = useCallback((index) => {
    setFormData(prev => ({
      ...prev,
      tags: Array.isArray(prev.tags) ? prev.tags.filter((_, i) => i !== index) : []
    }));
  }, []);

  // ==============================
  // دوال إدارة الألوان
  // ==============================

  const handleColorsChange = useCallback((newColors) => {
    setFormData(prev => ({
      ...prev,
      selectedColors: Array.isArray(newColors) ? newColors : []
    }));
  }, []);

  // ==============================
  // دوال إدارة الصور
  // ==============================

  const handleCoverImageUploaded = useCallback((urls) => {
    console.log('📸 handleCoverImageUploaded:', urls);
    if (urls && urls.length > 0) {
      setFormData(prev => ({
        ...prev,
        coverImage: urls[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        coverImage: ""
      }));
    }
  }, []);

  const handleFeaturedImageUploaded = useCallback((urls) => {
    console.log('📸 handleFeaturedImageUploaded:', urls);
    if (urls && urls.length > 0) {
      setFormData(prev => ({
        ...prev,
        featuredImage: urls[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        featuredImage: ""
      }));
    }
  }, []);

  const handleBeforeImagesUploaded = useCallback((urls) => {
    console.log('📸 handleBeforeImagesUploaded:', urls);
    setFormData(prev => ({
      ...prev,
      beforeImages: Array.isArray(urls) ? urls : []
    }));
  }, []);

  const handleAfterImagesUploaded = useCallback((urls) => {
    console.log('📸 handleAfterImagesUploaded:', urls);
    setFormData(prev => ({
      ...prev,
      afterImages: Array.isArray(urls) ? urls : []
    }));
  }, []);

  const handleGalleryImagesUploaded = useCallback((urls) => {
    console.log('📸 handleGalleryImagesUploaded:', urls);
    setFormData(prev => ({
      ...prev,
      galleryImages: Array.isArray(urls) ? urls : []
    }));
  }, []);

  // ==============================
  // دوال إدارة الفيديوهات
  // ==============================

  const handleVideosUploaded = useCallback((urls) => {
    console.log('🎬 handleVideosUploaded:', urls);
    setFormData(prev => ({
      ...prev,
      additionalVideos: Array.isArray(urls) ? urls : []
    }));
  }, []);

  // ==============================
  // التحقق من النموذج (كل الحقول اختيارية)
  // ==============================

  const validateForm = useCallback(() => {
    const newErrors = {};
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  // ==================== دالة لتوحيد التصنيفات قبل الإرسال ====================
  const normalizeCategories = useCallback((categories) => {
    console.log("🔄 تطبيع التصنيفات قبل الإرسال:", categories);
    
    const normalized = { ...categories };
    
    // خريطة تحويل من العربية إلى الإنجليزية
    const categoryMappings = {
      mainCategory: {
        "سكني": "residential",
        "تجاري": "commercial",
        "residential": "residential",
        "commercial": "commercial"
      },
      subCategory: {
        // Residential Arabic to English
        "شقق": "apartments",
        "فلل": "villas", 
        "دوبلكس": "duplex",
        "تاون هاوس": "townhouse",
        "بنتهاوس": "penthouse",
        "إستوديوهات": "studios",
        "شاليهات": "chalets",
        "كوخ": "cabin",
        "روف": "roof",
        // Commercial Arabic to English
        "مكاتب": "offices",
        "متاجر": "stores",
        "مطاعم": "restaurants", 
        "مقاهي": "cafes",
        "معارض": "showrooms",
        "عيادات": "clinics",
        "صالونات": "salons",
        "فنادق": "hotels",
        "صالات رياضية": "gyms",
        "مدارس": "schools"
      },
      specialization: {
        "داخلي": "interior",
        "خارجي": "exterior", 
        "لاندسكيب": "landscape",
        "داخلي وخارجي": "both"
      }
    };
    
    // تطبيع mainCategory
    if (normalized.mainCategory && categoryMappings.mainCategory[normalized.mainCategory]) {
      normalized.mainCategory = categoryMappings.mainCategory[normalized.mainCategory];
    }
    
    // تطبيع subCategory
    if (normalized.subCategory && categoryMappings.subCategory[normalized.subCategory]) {
      normalized.subCategory = categoryMappings.subCategory[normalized.subCategory];
    }
    
    // تطبيع specialization
    if (normalized.specialization && categoryMappings.specialization[normalized.specialization]) {
      normalized.specialization = categoryMappings.specialization[normalized.specialization];
    }
    
    // تطبيع interiorRooms (مصفوفة)
    if (Array.isArray(normalized.interiorRooms)) {
      normalized.interiorRooms = normalized.interiorRooms.map(room => {
        // خريطة خاصة للغرف الداخلية
        const roomMap = {
          "مشاريع كاملة": "Full Projects",
          "غرفة المعيشة": "living_room",
          "صالون": "salon",
          "مطبخ": "kitchen",
          "غرفة الطعام": "dining_room",
          "حمام": "bathroom",
          "مكتب منزلي": "home_office",
          "غرفة نوم رئيسية": "master_bedroom",
          "غرفة أطفال": "children_room",
          "غرفة ضيوف": "guest_room",
          "مكتبة": "library",
          "غرفة نوم الاولاد": "Boys_Bedroom",
          "غرفة نوم البنات": "Girls_Bedroom",
          "غرفة صلاة": "prayer_room",
          "غرفة ملابس": "dressing_room",
          "غرفة غسيل": "laundry_room",
          "غرفة تخزين": "storage_room"
        };
        return roomMap[room] || room;
      });
    }
    
    // تطبيع commercialRooms (مصفوفة)
    if (Array.isArray(normalized.commercialRooms)) {
      normalized.commercialRooms = normalized.commercialRooms.map(room => {
        const commercialRoomMap = {
          "استقبال": "commercial_reception",
          "غرفة انتظار": "commercial_waiting",
          "غرفة اجتماعات": "commercial_conference",
          "غرفة مدير": "commercial_manager",
          "حمام تجاري": "commercial_bathroom",
          "مطبخ تجاري": "commercial_kitchen",
          "مخزن تجاري": "commercial_storage"
        };
        return commercialRoomMap[room] || room;
      });
    }
    
    // تطبيع exteriorAreas (مصفوفة)
    if (Array.isArray(normalized.exteriorAreas)) {
      normalized.exteriorAreas = normalized.exteriorAreas.map(area => {
        const areaMap = {
          "واجهة": "facade",
          "حديقة": "garden",
          "مسبح": "swimming_pool",
          "تراس": "terrace",
          "بلكونة": "balcony",
          "فناء": "patio",
          "مدخل سيارات": "driveway",
          "موقف سيارات": "parking",
          "سياج": "fence",
          "جازيبو": "gazebo",
          "مطبخ خارجي": "outdoor_kitchen",
          "مشعل نار": "fire_pit",
          "ممشى": "walkway"
        };
        return areaMap[area] || area;
      });
    }
    
    // تطبيع designStyles (مصفوفة)
    if (Array.isArray(normalized.designStyles)) {
      normalized.designStyles = normalized.designStyles.map(style => {
        const styleMap = {
          "عصري": "modern",
          "كلاسيكي": "classic",
          "بسيط": "minimalist",
          "فاخر": "luxury",
          "تقليدي": "traditional",
          "معاصر": "contemporary",
          "صناعي": "industrial",
          "سكاندينافي": "scandinavian",
          "ريفي": "rustic",
          "بحر متوسط": "mediterranean",
          "آرت ديكو": "art_deco",
          "بوهيمي": "bohemian"
        };
        return styleMap[style] || style;
      });
    }
    
    console.log("✅ التصنيفات بعد التطبيع:", normalized);
    return normalized;
  }, []);

  // ==============================
  // دالة الإرسال المعدلة
  // ==============================
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    console.log('🚀 بدء إرسال المشروع...');

    if (!validateForm()) {
      setIsSubmitting(false);
      
      if (showNotification) {
        showNotification({
          type: 'error',
          message: 'يرجى تصحيح الأخطاء'
        });
      }
      
      return;
    }

    // تجميع بيانات التصنيفات مع التطبيع
    const rawCategoryData = {
      mainCategory: selectedCategories.mainCategory || "",
      subCategory: selectedCategories.subCategory || "",
      specialization: selectedCategories.specialization || "",
      interiorRooms: Array.isArray(selectedCategories.interiorRooms) ? selectedCategories.interiorRooms : [],
      commercialRooms: Array.isArray(selectedCategories.commercialRooms) ? selectedCategories.commercialRooms : [],
      exteriorAreas: Array.isArray(selectedCategories.exteriorAreas) ? selectedCategories.exteriorAreas : [],
      designStyles: Array.isArray(selectedCategories.designStyles) ? selectedCategories.designStyles : []
    };
    
    // تطبيع التصنيفات قبل الإرسال
    const categoryData = normalizeCategories(rawCategoryData);
    console.log("🎯 التصنيفات الموحدة للإرسال:", categoryData);

    // إعداد الوسوم بشكل صحيح - مصفوفة مباشرة
    const prepareTagsForSubmission = (tagsArray) => {
      if (!tagsArray || !Array.isArray(tagsArray) || tagsArray.length === 0) {
        return []; // مصفوفة فارغة وليس كائن
      }
      
      return tagsArray.filter(item => item && item.trim());
    };

    const tagsData = prepareTagsForSubmission(formData.tags);
    console.log("🎯 الوسوم للإرسال:", tagsData);
    
    // تنظيف البيانات قبل الإرسال
    const projectData = {
      // التصنيفات الموحدة
      category: categoryData,
      
      projectName: {
        ar: formData.projectName?.ar || "",
        en: formData.projectName?.en || ""
      },
      projectArea: formData.projectArea?.trim() || "",
      projectLocation: formData.projectLocation?.trim() || "",
      projectYear: formData.projectYear?.toString() || "",
      
      briefDescription: {
        ar: formData.briefDescription?.ar || "",
        en: formData.briefDescription?.en || ""
      },
      
      detailedDescription: {
        ar: formData.detailedDescription?.ar || "",
        en: formData.detailedDescription?.en || ""
      },
      
      challenges: Array.isArray(formData.challenges) ? formData.challenges.filter(item => item && item.trim()) : [],
      designSolution: Array.isArray(formData.designSolution) ? formData.designSolution.filter(item => item && item.trim()) : [],
      results: Array.isArray(formData.results) ? formData.results.filter(item => item && item.trim()) : [],
      selectedColors: Array.isArray(formData.selectedColors) ? formData.selectedColors : [],
      
      // صور المشروع
      coverImage: formData.coverImage?.trim() || "",
      beforeImages: Array.isArray(formData.beforeImages) 
        ? formData.beforeImages.filter(img => img && img.trim() && isPermanentUrl(img)) 
        : [],
      afterImages: Array.isArray(formData.afterImages) 
        ? formData.afterImages.filter(img => img && img.trim() && isPermanentUrl(img)) 
        : [],
      featuredImage: formData.featuredImage?.trim() || formData.coverImage?.trim() || "",
      galleryImages: Array.isArray(formData.galleryImages) 
        ? formData.galleryImages.filter(img => img && img.trim() && isPermanentUrl(img)) 
        : [],
      
      // فيديوهات المشروع
      videoUrl: formData.videoUrl?.trim() || "",
      additionalVideos: Array.isArray(formData.additionalVideos) 
        ? formData.additionalVideos.filter(video => video && video.trim() && isPermanentUrl(video)) 
        : [],
      
      features: Array.isArray(formData.features) ? formData.features.filter(item => item && item.trim()) : [],
      isActive: formData.isActive !== false,
      isFeatured: formData.isFeatured || false,
      order: Number(formData.order) || 0,
      duration: formData.duration?.trim() || "",
      budget: formData.budget?.trim() || "",
      clientName: formData.clientName?.trim() || "",
      clientFeedback: formData.clientFeedback?.trim() || "",
      
      // إرسال tags كمصفوفة مباشرة
      tags: tagsData,
      
      // الصفحة التي سيظهر فيها المشروع
      pageType: formData.pageType || "portfolio", // portfolio أو admin
      
      // حقول التوافق
      mainCategory: categoryData.mainCategory || "",
      subCategory: categoryData.subCategory || "",
      specialization: categoryData.specialization || "",
      interiorRoom: Array.isArray(categoryData.interiorRooms) ? categoryData.interiorRooms : [],
      commercialRoom: Array.isArray(categoryData.commercialRooms) ? categoryData.commercialRooms : [],
      exteriorArea: Array.isArray(categoryData.exteriorAreas) ? categoryData.exteriorAreas : [],
      designStyle: Array.isArray(categoryData.designStyles) ? categoryData.designStyles : []
    };

    console.log('📤 بيانات المشروع للإرسال:', projectData);

    // إضافة معرّف المشروع في حالة التعديل
    if (isEdit && initialData?.id) {
      projectData.id = initialData.id;
    }

    // استدعاء دالة الإرسال من الـ props
    onSubmit(projectData);
    
    setIsSubmitting(false);
  }, [formData, selectedCategories, isEdit, initialData, showNotification, onSubmit, validateForm, normalizeCategories, isPermanentUrl]);

  // ==============================
  // دوال التحديث العامة للنموذج
  // ==============================

  const updateFormField = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // مسح الخطأ عند التعديل
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const updateNestedField = useCallback((parent, child, value) => {
    setFormData(prev => {
      const newParent = { ...prev[parent] };
      
      // إذا كانت القيمة null أو سلسلة فارغة، احذف الحقل من الكائن
      if (value === null || value === "" || (typeof value === "string" && value.trim() === "")) {
        delete newParent[child];
      } else {
        newParent[child] = value;
      }
      
      // إذا أصبح الكائن فارغًا بعد الحذف، احذف الكائن بالكامل
      if (Object.keys(newParent).length === 0) {
        const newData = { ...prev };
        delete newData[parent];
        return newData;
      }
      
      return {
        ...prev,
        [parent]: newParent
      };
    });
    
    // مسح الخطأ عند التعديل
    const errorKey = `${parent}${child.charAt(0).toUpperCase() + child.slice(1)}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  }, [errors]);

  // ==============================
  // دوال مساعدة
  // ==============================

  const handleKeyPress = useCallback((e, callback) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      callback();
    }
  }, []);

  // ==============================
  // الواجهة
  // ==============================

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-0 sm:p-2 md:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:max-w-6xl sm:w-full sm:max-h-[90vh] overflow-y-auto">
        {/* الهيدر */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-4 flex justify-between items-center z-20">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
              {isEdit ? "تعديل المشروع" : "إضافة مشروع جديد"}
            </h2>
            {isEdit && formData.projectName.ar && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                {formData.projectName.ar}
              </p>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            disabled={isViewer}
            aria-label="إغلاق"
          >
            <IconX className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        {/* التبويبات */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto px-2 sm:px-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col sm:flex-row items-center px-3 py-3 sm:px-4 sm:py-3 font-medium text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-1 min-w-[90px] sm:min-w-0 sm:flex-none justify-center ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span className="mt-1 sm:mt-0 sm:mr-2 truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* المحتوى */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* تبويب المعلومات الأساسية */}
          {activeTab === 'basic' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 sm:mb-4 flex items-center">
                  <IconHome className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  المعلومات الأساسية للمشروع
                </h3>
                
                <div className="space-y-4 sm:space-y-6">
                  {/* اسم المشروع */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        اسم المشروع (عربي)
                      </label>
                      <input 
                        type="text" 
                        value={formData.projectName?.ar || ""} 
                        onChange={(e) => {
                          const value = e.target.value;
                          updateNestedField("projectName", "ar", value.trim() === " " ? null : value);
                        }} 
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                        disabled={isViewer}
                        placeholder="اسم المشروع بالعربية (اختياري)"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        اسم المشروع (إنجليزي)
                      </label>
                      <input 
                        type="text" 
                        value={formData.projectName?.en || ""} 
                        onChange={(e) => {
                          const value = e.target.value;
                          updateNestedField("projectName", "en", value.trim() === "" ? null : value);
                        }} 
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base" 
                        disabled={isViewer}
                        placeholder="Project name in English (optional)"
                      />
                    </div>
                  </div>
                  
                  {/* 🔥 التصنيفات الجديدة - قوائم منسدلة */}
                  <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6">
                    <h4 className="font-medium text-gray-800 mb-4 text-sm sm:text-base">تصنيف المشروع</h4>
                    
                    {/* التصنيف الرئيسي */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نوع العقار (اختياري)
                      </label>
                      <div className="relative">
                        <select
                          value={selectedCategories.mainCategory}
                          onChange={(e) => updateCategory('main', e.target.value)}
                          className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base appearance-none bg-white"
                          disabled={isViewer}
                        >
                          <option value="">اختر نوع العقار</option>
                          <option value="residential">🏠 سكني</option>
                          <option value="commercial">🏢 تجاري</option>
                        </select>
                        <div className="pointer-events-none absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                    </div>
                    
                    {/* التصنيف الفرعي */}
                    {selectedCategories.mainCategory && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {selectedCategories.mainCategory === 'residential' ? 'نوع السكن (اختياري)' : 'نوع التجاري (اختياري)'}
                        </label>
                        <div className="relative">
                          <select
                            value={selectedCategories.subCategory}
                            onChange={(e) => updateCategory('sub', e.target.value)}
                            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm sm:text-base appearance-none bg-white"
                            disabled={isViewer}
                          >
                            <option value="">{selectedCategories.mainCategory === 'residential' ? 'اختر نوع السكن' : 'اختر نوع التجاري'}</option>
                            {designCategories
                              .find(cat => cat.id === selectedCategories.mainCategory)
                              ?.subcategories.map(sub => (
                                <option key={sub.id} value={sub.id}>
                                  {sub.name.ar}
                                </option>
                              ))}
                          </select>
                          <div className="pointer-events-none absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            ▼
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* التخصص (داخلي/خارجي/لاندسكيب) */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        التخصص (اختياري)
                      </label>
                      <div className="relative">
                        <select
                          value={selectedCategories.specialization}
                          onChange={(e) => updateCategory('specialization', e.target.value)}
                          className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm sm:text-base appearance-none bg-white"
                          disabled={isViewer}
                        >
                          <option value="">اختر التخصص</option>
                          <option value="interior">🏠 داخلي</option>
                          <option value="exterior">🏢 خارجي</option>
                          <option value="landscape">🌿 لاندسكيب</option>
                          <option value="both">🏠🏢 داخلي وخارجي</option>
                        </select>
                        <div className="pointer-events-none absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          ▼
                        </div>
                      </div>
                    </div>
                    
                    {/* الغرف الداخلية (اختياري - يمكن اختيار أكثر من واحد) */}
                    {selectedCategories.specialization && (
                      selectedCategories.specialization === 'interior' || selectedCategories.specialization === 'both'
                    ) && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الغرف الداخلية (اختياري - متعدد)
                        </label>
                        <div className="relative">
                          <select
                            multiple
                            value={selectedCategories.interiorRooms}
                            onChange={(e) => {
                              const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                              updateCategory('interior', selectedOptions);
                            }}
                            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base appearance-none bg-white min-h-[120px]"
                            disabled={isViewer}
                            size={4}
                          >
                            {designCategories
                              .find(cat => cat.id === 'interior_rooms')
                              ?.subcategories.map(room => (
                                <option key={room.id} value={room.id}>
                                  {room.name.ar}
                                </option>
                              ))}
                          </select>
                          <div className="pointer-events-none absolute left-2.5 sm:left-3 top-2.5 sm:top-3 text-gray-400">
                            ▼
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            اضغط مع الاستمرار على Ctrl (أو Cmd على الماك) لاختيار أكثر من نوع
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* الغرف التجارية (اختياري - يمكن اختيار أكثر من واحد) */}
                    {selectedCategories.specialization && selectedCategories.mainCategory === 'commercial' && (
                      selectedCategories.specialization === 'interior' || selectedCategories.specialization === 'both'
                    ) && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الغرف التجارية (اختياري - متعدد)
                        </label>
                        <div className="relative">
                          <select
                            multiple
                            value={selectedCategories.commercialRooms}
                            onChange={(e) => {
                              const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                              updateCategory('commercial', selectedOptions);
                            }}
                            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm sm:text-base appearance-none bg-white min-h-[120px]"
                            disabled={isViewer}
                            size={4}
                          >
                            {designCategories
                              .find(cat => cat.id === 'commercial_rooms')
                              ?.subcategories.map(room => (
                                <option key={room.id} value={room.id}>
                                  {room.name.ar}
                                </option>
                              ))}
                          </select>
                          <div className="pointer-events-none absolute left-2.5 sm:left-3 top-2.5 sm:top-3 text-gray-400">
                            ▼
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            اضغط مع الاستمرار على Ctrl (أو Cmd على الماك) لاختيار أكثر من نوع
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* الأماكن الخارجية (اختياري - يمكن اختيار أكثر من واحد) */}
                    {selectedCategories.specialization && (
                      selectedCategories.specialization === 'exterior' || selectedCategories.specialization === 'landscape' || selectedCategories.specialization === 'both'
                    ) && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الأماكن الخارجية (اختياري - متعدد)
                        </label>
                        <div className="relative">
                          <select
                            multiple
                            value={selectedCategories.exteriorAreas}
                            onChange={(e) => {
                              const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                              updateCategory('exterior', selectedOptions);
                            }}
                            className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm sm:text-base appearance-none bg-white min-h-[120px]"
                            disabled={isViewer}
                            size={4}
                          >
                            {designCategories
                              .find(cat => cat.id === 'exterior_areas')
                              ?.subcategories.map(area => (
                                <option key={area.id} value={area.id}>
                                  {area.name.ar}
                                </option>
                              ))}
                          </select>
                          <div className="pointer-events-none absolute left-2.5 sm:left-3 top-2.5 sm:top-3 text-gray-400">
                            ▼
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            اضغط مع الاستمرار على Ctrl (أو Cmd على الماك) لاختيار أكثر من منطقة
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {/* أنماط التصميم (اختياري - يمكن اختيار أكثر من واحد) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        أنماط التصميم (اختياري - متعدد)
                      </label>
                      <div className="relative">
                        <select
                          multiple
                          value={selectedCategories.designStyles}
                          onChange={(e) => {
                            const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                            updateCategory('style', selectedOptions);
                          }}
                          className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm sm:text-base appearance-none bg-white min-h-[120px]"
                          disabled={isViewer}
                          size={4}
                        >
                          {designCategories
                            .find(cat => cat.id === 'design_styles')
                            ?.subcategories.map(style => (
                              <option key={style.id} value={style.id}>
                                {style.name.ar}
                              </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute left-2.5 sm:left-3 top-2.5 sm:top-3 text-gray-400">
                          ▼
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          اضغط مع الاستمرار على Ctrl (أو Cmd على الماك) لاختيار أكثر من نمط
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* باقي الحقول كما هي (كلها اختيارية) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        موقع المشروع
                      </label>
                      <input 
                        type="text" 
                        value={formData.projectLocation || ""} 
                        onChange={(e) => updateFormField("projectLocation", e.target.value)} 
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base" 
                        disabled={isViewer}
                        placeholder="الموقع (اختياري)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        مساحة المشروع
                      </label>
                      <input 
                        type="text" 
                        value={formData.projectArea || ""} 
                        onChange={(e) => updateFormField("projectArea", e.target.value)} 
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base" 
                        disabled={isViewer}
                        placeholder="المساحة (اختياري)"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        سنة التنفيذ
                      </label>
                      <input 
                        type="number" 
                        value={formData.projectYear} 
                        onChange={(e) => updateFormField("projectYear", e.target.value)} 
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base" 
                        min="2000"
                        max={new Date().getFullYear() + 5}
                        disabled={isViewer}
                        placeholder="سنة التنفيذ"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        المدة
                      </label>
                      <input 
                        type="text" 
                        value={formData.duration || ""} 
                        onChange={(e) => updateFormField("duration", e.target.value)} 
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                        disabled={isViewer}
                        placeholder="المدة (اختياري)"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        الميزانية
                      </label>
                      <input 
                        type="text" 
                        value={formData.budget || ""} 
                        onChange={(e) => updateFormField("budget", e.target.value)} 
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                        disabled={isViewer}
                        placeholder="الميزانية (اختياري)"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                        اسم العميل
                      </label>
                      <input 
                        type="text" 
                        value={formData.clientName || ""} 
                        onChange={(e) => updateFormField("clientName", e.target.value)} 
                        className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base" 
                        disabled={isViewer}
                        placeholder="اسم العميل (اختياري)"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      وصف مختصر (عربي)
                    </label>
                    <textarea 
                      value={formData.briefDescription?.ar || ""} 
                      onChange={(e) => {
                        const value = e.target.value;
                        updateNestedField("briefDescription", "ar", value.trim() === "" ? null : value);
                      }} 
                      rows="2" 
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base" 
                      disabled={isViewer}
                      placeholder="وصف مختصر للمشروع (اختياري)"
                      maxLength="200"
                    />
                    <div className="text-xs text-gray-500 text-left mt-1">
                      {(formData.briefDescription?.ar?.length || 0)}/200 حرف
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      وصف مختصر (إنجليزي)
                    </label>
                    <textarea 
                      value={formData.briefDescription?.en || ""} 
                      onChange={(e) => {
                        const value = e.target.value;
                        updateNestedField("briefDescription", "en", value.trim() === "" ? null : value);
                      }} 
                      rows="2" 
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                      disabled={isViewer}
                      placeholder="Short description (optional)"
                      maxLength="200"
                    />
                    <div className="text-xs text-gray-500 text-left mt-1">
                      {(formData.briefDescription?.en?.length || 0)}/200 حرف
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      تقييم العميل
                    </label>
                    <textarea 
                      value={formData.clientFeedback || ""} 
                      onChange={(e) => updateFormField("clientFeedback", e.target.value)} 
                      rows="2" 
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base" 
                      disabled={isViewer}
                      placeholder="تقييم أو شهادة من العميل (اختياري)"
                      maxLength="300"
                    />
                    <div className="text-xs text-gray-500 text-left mt-1">
                      {formData.clientFeedback?.length || 0}/300 حرف
                    </div>
                  </div>
                </div>
              </div>
              
              {/* الأقسام الأخرى للمعلومات الأساسية */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-orange-800 mb-3 sm:mb-4 flex items-center">
                    <IconChallenge className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    التحديات
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={challengeInput}
                        onChange={(e) => setChallengeInput(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleAddChallenge)}
                        placeholder="أضف تحدي واجهناه في المشروع..."
                        className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                        disabled={isViewer}
                      />
                      <button
                        type="button"
                        onClick={handleAddChallenge}
                        className="px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        disabled={isViewer || !challengeInput.trim()}
                      >
                        إضافة
                      </button>
                    </div>
                    
                    {Array.isArray(formData.challenges) && formData.challenges.length > 0 && (
                      <div className="space-y-2 max-h-40 sm:max-h-60 overflow-y-auto">
                        {formData.challenges.map((challenge, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2.5 sm:p-3 rounded-lg border border-orange-100 hover:bg-orange-50 transition-colors">
                            <div className="flex items-center min-w-0">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full ml-2 sm:ml-3 flex-shrink-0"></div>
                              <span className="text-xs sm:text-sm text-gray-700 truncate">{challenge}</span>
                            </div>
                            {!isViewer && (
                              <button
                                type="button"
                                onClick={() => removeChallenge(index)}
                                className="text-orange-500 hover:text-orange-700 p-1 flex-shrink-0"
                                title="حذف"
                                aria-label="حذف التحدي"
                              >
                                <IconX className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-indigo-800 mb-3 sm:mb-4 flex items-center">
                    <IconStar className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    المميزات
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={featureInput}
                        onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleAddFeature)}
                        placeholder="أضف ميزة للمشروع..."
                        className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                        disabled={isViewer}
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        disabled={isViewer || !featureInput.trim()}
                      >
                        إضافة
                      </button>
                    </div>
                    
                    {Array.isArray(formData.features) && formData.features.length > 0 && (
                      <div className="space-y-2 max-h-40 sm:max-h-60 overflow-y-auto">
                        {formData.features.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2.5 sm:p-3 rounded-lg border border-indigo-100 hover:bg-indigo-50 transition-colors">
                            <div className="flex items-center min-w-0">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-500 rounded-full ml-2 sm:ml-3 flex-shrink-0"></div>
                              <span className="text-xs sm:text-sm text-gray-700 truncate">{feature}</span>
                            </div>
                            {!isViewer && (
                              <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="text-indigo-500 hover:text-indigo-700 p-1 flex-shrink-0"
                                title="حذف"
                                aria-label="حذف الميزة"
                              >
                                <IconX className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* تبويب التفاصيل */}
          {activeTab === 'details' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 sm:mb-4">
                  الوصف التفصيلي
                </h3>
                
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      وصف تفصيلي (عربي)
                    </label>
                    <textarea 
                      value={formData.detailedDescription?.ar || ""} 
                      onChange={(e) => {
                        const value = e.target.value;
                        updateNestedField("detailedDescription", "ar", value.trim() === "" ? null : value);
                      }} 
                      rows="5" 
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base" 
                      disabled={isViewer}
                      placeholder="وصف تفصيلي طويل عن المشروع (اختياري)"
                    />
                    <div className="text-xs text-gray-500 text-left mt-1">
                      {formData.detailedDescription?.ar?.length || 0} حرف
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      وصف تفصيلي (إنجليزي)
                    </label>
                    <textarea 
                      value={formData.detailedDescription?.en || ""} 
                      onChange={(e) => {
                        const value = e.target.value;
                        updateNestedField("detailedDescription", "en", value.trim() === "" ? null : value);
                      }} 
                      rows="5" 
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                      disabled={isViewer}
                      placeholder="Detailed description about the project (optional)"
                    />
                    <div className="text-xs text-gray-500 text-left mt-1">
                      {formData.detailedDescription?.en?.length || 0} characters
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-3 sm:mb-4 flex items-center">
                    <IconSolution className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    الحلول التصميمية
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={solutionInput}
                        onChange={(e) => setSolutionInput(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleAddSolution)}
                        placeholder="أضف حل أو فكرة تصميمية..."
                        className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm sm:text-base"
                        disabled={isViewer}
                      />
                      <button
                        type="button"
                        onClick={handleAddSolution}
                        className="px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        disabled={isViewer || !solutionInput.trim()}
                      >
                        إضافة
                      </button>
                    </div>
                    
                    {Array.isArray(formData.designSolution) && formData.designSolution.length > 0 && (
                      <div className="space-y-2 max-h-40 sm:max-h-60 overflow-y-auto">
                        {formData.designSolution.map((solution, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2.5 sm:p-3 rounded-lg border border-green-100 hover:bg-green-50 transition-colors">
                            <div className="flex items-center min-w-0">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full ml-2 sm:ml-3 flex-shrink-0"></div>
                              <span className="text-xs sm:text-sm text-gray-700 truncate">{solution}</span>
                            </div>
                            {!isViewer && (
                              <button
                                type="button"
                                onClick={() => removeSolution(index)}
                                className="text-green-500 hover:text-green-700 p-1 flex-shrink-0"
                                title="حذف"
                                aria-label="حذف الحل"
                              >
                                <IconX className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-emerald-800 mb-3 sm:mb-4 flex items-center">
                    <IconResults className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                    النتائج النهائية
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={resultInput}
                        onChange={(e) => setResultInput(e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleAddResult)}
                        placeholder="أضف نتيجة أو إنجاز..."
                        className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base"
                        disabled={isViewer}
                      />
                      <button
                        type="button"
                        onClick={handleAddResult}
                        className="px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                        disabled={isViewer || !resultInput.trim()}
                      >
                        إضافة
                      </button>
                    </div>
                    
                    {Array.isArray(formData.results) && formData.results.length > 0 && (
                      <div className="space-y-2 max-h-40 sm:max-h-60 overflow-y-auto">
                        {formData.results.map((result, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2.5 sm:p-3 rounded-lg border border-emerald-100 hover:bg-emerald-50 transition-colors">
                            <div className="flex items-center min-w-0">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full ml-2 sm:ml-3 flex-shrink-0"></div>
                              <span className="text-xs sm:text-sm text-gray-700 truncate">{result}</span>
                            </div>
                            {!isViewer && (
                              <button
                                type="button"
                                onClick={() => removeResult(index)}
                                className="text-emerald-500 hover:text-emerald-700 p-1 flex-shrink-0"
                                title="حذف"
                                aria-label="حذف النتيجة"
                              >
                                <IconX className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-purple-800 mb-3 sm:mb-4 flex items-center">
                  <IconColorPalette className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  الألوان المستخدمة في المشروع
                </h3>
                
                <ColorPicker 
                  selectedColors={Array.isArray(formData.selectedColors) ? formData.selectedColors : []}
                  onColorsChange={handleColorsChange}
                  disabled={isViewer}
                />
              </div>
              
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-pink-800 mb-3 sm:mb-4">
                  الوسوم (Tags)
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleAddTag)}
                      placeholder="أضف وسم للمشروع..."
                      className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-sm sm:text-base"
                      disabled={isViewer}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      disabled={isViewer || !tagInput.trim()}
                    >
                      إضافة
                    </button>
                  </div>
                  
                  {Array.isArray(formData.tags) && formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {formData.tags.map((tag, index) => (
                        <div key={index} className="flex items-center bg-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full border border-pink-200">
                          <span className="text-xs sm:text-sm text-gray-700">#{tag}</span>
                          {!isViewer && (
                            <button
                              type="button"
                              onClick={() => removeTag(index)}
                              className="text-pink-500 hover:text-pink-700 p-0.5 mr-1"
                              title="حذف"
                              aria-label="حذف الوسم"
                            >
                              <IconX className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* تبويب العناصر المرئية */}
          {activeTab === 'visuals' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-amber-800 mb-3 sm:mb-4 flex items-center">
                  <IconImage className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  صور المشروع
                </h3>
                
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                      صورة الغلاف الرئيسية
                    </h4>
                    <ImageUploader 
                      onImagesUploaded={handleCoverImageUploaded}
                      currentImages={formData.coverImage ? [formData.coverImage] : []}
                      multiple={false}
                      maxFiles={1}
                      label="صورة الغلاف"
                      disabled={isViewer}
                      accept="image/*"
                    />
                    <input 
                      type="url" 
                      value={formData.coverImage || ""} 
                      onChange={(e) => updateFormField("coverImage", e.target.value)} 
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg mt-2 sm:mt-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base" 
                      placeholder="أو أدخل رابط صورة الغلاف..."
                      disabled={isViewer}
                    />
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                      الصورة الرئيسية (بطاقة المشروع)
                    </h4>
                    <ImageUploader 
                      onImagesUploaded={handleFeaturedImageUploaded}
                      currentImages={formData.featuredImage ? [formData.featuredImage] : []}
                      multiple={false}
                      maxFiles={1}
                      label="الصورة الرئيسية"
                      disabled={isViewer}
                      accept="image/*"
                    />
                    <input 
                      type="url" 
                      value={formData.featuredImage || ""} 
                      onChange={(e) => updateFormField("featuredImage", e.target.value)} 
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg mt-2 sm:mt-3 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base" 
                      placeholder="أو أدخل رابط الصورة الرئيسية..."
                      disabled={isViewer}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                        صور قبل التنفيذ
                      </h4>
                      <ImageUploader 
                        onImagesUploaded={handleBeforeImagesUploaded}
                        currentImages={Array.isArray(formData.beforeImages) ? formData.beforeImages : []}
                        multiple={true}
                        maxFiles={10}
                        label="صور قبل التنفيذ"
                        disabled={isViewer}
                        accept="image/*"
                      />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                        صور بعد التنفيذ
                      </h4>
                      <ImageUploader 
                        onImagesUploaded={handleAfterImagesUploaded}
                        currentImages={Array.isArray(formData.afterImages) ? formData.afterImages : []}
                        multiple={true}
                        maxFiles={20}
                        label="صور بعد التنفيذ"
                        disabled={isViewer}
                        accept="image/*"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                      معرض الصور (لقطات زوايا متنوعة)
                    </h4>
                    <ImageUploader 
                      onImagesUploaded={handleGalleryImagesUploaded}
                      currentImages={Array.isArray(formData.galleryImages) ? formData.galleryImages : []}
                      multiple={true}
                      maxFiles={Infinity}
                      label="معرض الصور"
                      disabled={isViewer}
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* تبويب الفيديوهات */}
          {activeTab === 'videos' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-3 sm:mb-4 flex items-center">
                  <IconVideo className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  فيديوهات المشروع
                </h3>
                
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                      رابط الفيديو الرئيسي
                    </h4>
                    <input 
                      type="url" 
                      value={formData.videoUrl || ""} 
                      onChange={(e) => updateFormField("videoUrl", e.target.value)} 
                      className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base" 
                      placeholder="https://youtube.com/..."
                      disabled={isViewer}
                    />
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      يمكن إضافة رابط فيديو من يوتيوب أو فيمو أو أي منصة مشابهة (اختياري)
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                      فيديوهات إضافية
                    </h4>
                    <ImageUploader 
                      onImagesUploaded={handleVideosUploaded}
                      currentImages={Array.isArray(formData.additionalVideos) ? formData.additionalVideos : []}
                      multiple={true}
                      maxFiles={10}
                      label="فيديوهات إضافية"
                      disabled={isViewer}
                      accept="video/*"
                    />
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      يمكن رفع فيديوهات إضافية مباشرة أو استخدام روابط من منصات الفيديو
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                    <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">نصائح للفيديوهات</h4>
                    <ul className="text-xs sm:text-sm text-gray-600 space-y-1 list-disc list-inside">
                      <li>يمكن رفع فيديوهات مباشرة (MP4, MOV, AVI)</li>
                      <li>يمكن استخدام روابط من يوتيوب، فيمو، وغيرها</li>
                      <li>الحجم الأقصى للفيديو: 500MB</li>
                      <li>يجب أن تكون الفيديوهات ذات جودة عالية</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* تبويب الإعدادات */}
          {activeTab === 'settings' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                  إعدادات المشروع
                </h3>
                
                <div className="space-y-4 sm:space-y-6">
                  {/* حالة المشروع */}
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-3 h-3 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="font-medium text-gray-700 text-sm sm:text-base">حالة المشروع</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {formData.isActive 
                          ? "المشروع نشط ويظهر في الموقع للزوار" 
                          : "المشروع غير نشط ومخفي عن الزوار"}
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        type="button"
                        onClick={() => updateFormField("isActive", !formData.isActive)}
                        disabled={isViewer}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          formData.isActive ? 'bg-green-500' : 'bg-gray-300'
                        } ${isViewer ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        aria-label={formData.isActive ? "إلغاء تفعيل المشروع" : "تفعيل المشروع"}
                      >
                        <span 
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.isActive ? '-translate-x-6' : '-translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="block text-xs text-center mt-1 text-gray-600">
                        {formData.isActive ? 'نشط' : 'غير نشط'}
                      </span>
                    </div>
                  </div>
                  
                  {/* المشروع المميز */}
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-3 h-3 rounded-full ${formData.isFeatured ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                        <span className="font-medium text-gray-700 text-sm sm:text-base">المشروع المميز</span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {formData.isFeatured 
                          ? "المشروع مميز ويظهر في الأقسام الخاصة" 
                          : "المشروع عادي ويظهر في القائمة العامة"}
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        type="button"
                        onClick={() => updateFormField("isFeatured", !formData.isFeatured)}
                        disabled={isViewer}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                          formData.isFeatured ? 'bg-yellow-500' : 'bg-gray-300'
                        } ${isViewer ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        aria-label={formData.isFeatured ? "إلغاء تمييز المشروع" : "تمييز المشروع"}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            formData.isFeatured ? '-translate-x-6' : '-translate-x-1'
                          }`}
                        />
                      </button>
                      <span className="block text-xs text-center mt-1 text-gray-600">
                        {formData.isFeatured ? 'مميز' : 'عادي'}
                      </span>
                    </div>
                  </div>
                  
                  {/* إضافة خيار تحديد الصفحة - يظهر فقط في وضع الإدارة */}
                  {!isViewer && (
                    <div className="flex flex-col p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200">
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-3 h-3 rounded-full ${formData.pageType === 'admin' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                          <span className="font-medium text-gray-700 text-sm sm:text-base">الصفحة التي سيظهر فيها المشروع</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mb-3">
                          اختر المكان الذي تريد عرض المشروع فيه
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => updateFormField("pageType", "portfolio")}
                          className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 ${
                            formData.pageType === "portfolio"
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-gray-200 hover:border-blue-200 hover:bg-blue-50/50"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ml-3 ${
                            formData.pageType === "portfolio" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
                          }`}>
                            <IconPortfolio className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-right">
                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base">صفحة المعرض (Portfolio)</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              يظهر في صفحة المعرض الرئيسية للعملاء
                            </p>
                          </div>
                          {formData.pageType === "portfolio" && (
                            <IconCheck className="w-5 h-5 text-blue-500" />
                          )}
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => updateFormField("pageType", "admin")}
                          className={`flex items-center p-3 rounded-lg border-2 transition-all duration-200 ${
                            formData.pageType === "admin"
                              ? "border-purple-500 bg-purple-50 shadow-md"
                              : "border-gray-200 hover:border-purple-200 hover:bg-purple-50/50"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ml-3 ${
                            formData.pageType === "admin" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600"
                          }`}>
                            <IconAdmin className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-right">
                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base">صفحة الإدارة (Admin Projects)</h4>
                            <p className="text-xs text-gray-500 mt-1">
                              يظهر في صفحة إدارة المشاريع فقط (للمسؤولين)
                            </p>
                          </div>
                          {formData.pageType === "admin" && (
                            <IconCheck className="w-5 h-5 text-purple-500" />
                          )}
                        </button>
                      </div>
                      
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-700 flex items-center">
                          <IconInfo className="w-3 h-3 ml-1 flex-shrink-0" />
                          <span>
                            {formData.pageType === "admin" 
                              ? "المشروع سيظهر فقط في لوحة تحكم الإدارة وليس في صفحة المعرض للعملاء."
                              : "المشروع سيظهر في صفحة المعرض الرئيسية للعملاء."}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* عرض الصفحة الحالية في وضع العرض فقط */}
                  {isViewer && formData.pageType && (
                    <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${formData.pageType === 'admin' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                        <span className="font-medium text-gray-700 text-sm sm:text-base">الصفحة المعروض فيها المشروع</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {formData.pageType === "admin" ? (
                          <>
                            <IconAdmin className="w-4 h-4 text-purple-500" />
                            <span className="text-sm text-gray-600">صفحة الإدارة (Admin Projects)</span>
                          </>
                        ) : (
                          <>
                            <IconPortfolio className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-600">صفحة المعرض (Portfolio)</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200">
                    <label className="block font-medium text-gray-700 mb-2 text-sm sm:text-base">
                      الترتيب في العرض
                    </label>
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={formData.order || 0} 
                        onChange={(e) => updateFormField("order", parseInt(e.target.value) || 0)} 
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        disabled={isViewer}
                      />
                      <input 
                        type="number" 
                        value={formData.order || 0} 
                        onChange={(e) => updateFormField("order", parseInt(e.target.value) || 0)} 
                        className="w-16 sm:w-20 p-2 border border-gray-300 rounded-lg text-center text-sm sm:text-base"
                        min="0" 
                        disabled={isViewer}
                      />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      المشاريع ذات الترتيب الأعلى تظهر أولاً
                    </p>
                  </div>
                  
                  <div className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                      ملخص المشروع
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <span className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center ml-2">
                            {selectedCategories.mainCategory === 'residential' ? '🏠' : selectedCategories.mainCategory === 'commercial' ? '🏢' : ''}
                          </span>
                          <span>التصنيف: </span>
                          <span className="font-medium mr-auto truncate">
                            {selectedCategories.mainCategory === 'residential' ? 'سكني' : 
                             selectedCategories.mainCategory === 'commercial' ? 'تجاري' : "غير محدد"}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <IconInfo className="w-4 h-4 ml-2 text-gray-400" />
                          <span>المساحة: </span>
                          <span className="font-medium mr-auto">{formData.projectArea || "غير محددة"}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <span>السنة: </span>
                          <span className="font-medium mr-auto">{formData.projectYear || "غير محددة"}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <IconImage className="w-4 h-4 ml-2 text-gray-400" />
                          <span>عدد الوسائط: </span>
                          <span className="font-medium mr-auto">
                            {(Array.isArray(formData.galleryImages) ? formData.galleryImages.length : 0) + 
                             (Array.isArray(formData.beforeImages) ? formData.beforeImages.length : 0) + 
                             (Array.isArray(formData.afterImages) ? formData.afterImages.length : 0) + 
                             (formData.coverImage ? 1 : 0) + 
                             (formData.featuredImage ? 1 : 0) +
                             (formData.videoUrl ? 1 : 0) +
                             (Array.isArray(formData.additionalVideos) ? formData.additionalVideos.length : 0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* التنقل بين التبويبات والأزرار */}
          <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 border-t border-gray-200 gap-4 sm:gap-0">
            <div className="flex overflow-x-auto space-x-2 sm:space-x-3 pb-2 sm:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 sm:px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
              >
                إلغاء
              </button>
              {!isViewer && (
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-6 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center text-sm sm:text-base ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <IconCheck className="ml-2 w-4 h-4" />
                      {isEdit ? "تحديث المشروع" : "إضافة المشروع"}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
          
          {/* عرض الأخطاء */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2 flex items-center text-sm sm:text-base">
                <span className="mr-1">✗</span>
                يرجى تصحيح الأخطاء التالية:
              </h4>
              <ul className="list-disc list-inside text-red-600 text-xs sm:text-sm space-y-1">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </form>
        
        {/* التذييل */}
        <div className="border-t border-gray-200 px-4 py-3 sm:px-6 sm:py-4 bg-gray-50 text-xs sm:text-sm text-gray-500 rounded-b-none sm:rounded-b-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
            <div className="truncate">
              {isEdit ? "تعديل مشروع موجود" : "إضافة مشروع جديد"} | 
              <span className="mx-1 sm:mx-2">•</span>
              {formData.isActive ? "نشط" : "غير نشط"}
              <span className="mx-1 sm:mx-2">•</span>
              {formData.isFeatured ? "مميز" : "عادي"}
              <span className="mx-1 sm:mx-2">•</span>
              {formData.pageType === "admin" ? "صفحة الإدارة" : "صفحة المعرض"}
            </div>
            <div className="truncate">
              {formData.projectName.ar && `"${formData.projectName.ar}"`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==============================
// Default Props and Export
// ==============================

ProjectModal.ViewModal = ProjectViewModal;

ProjectModal.defaultProps = {
  isEdit: false,
  initialData: null,
  isViewer: false,
  showNotification: () => {},
  onSubmit: () => {},
  onClose: () => {}
};

export default ProjectModal;