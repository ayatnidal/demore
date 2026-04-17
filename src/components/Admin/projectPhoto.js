// src/components/Admin/projectPhoto.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";

// ============================================
// SVG Icons Components
// ============================================

const IconChevronLeft = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const IconChevronRight = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const IconClose = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconZoom = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
  </svg>
);

// ============================================
// Image Lightbox Component
// ============================================

const ImageLightbox = ({
  images,
  initialIndex,
  onClose,
  language
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const thumbnailsRef = useRef(null);
  const thumbnailRefs = useRef([]);

  // حساب الحجم المناسب للصورة
  const calculateImageSize = useCallback(() => {
    if (!imageRef.current) return;
    
    const img = imageRef.current;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    const availableHeight = viewportHeight - 160;
    const availableWidth = viewportWidth - 80;
    
    const imgNaturalWidth = img.naturalWidth;
    const imgNaturalHeight = img.naturalHeight;
    
    if (imgNaturalWidth && imgNaturalHeight) {
      const widthRatio = availableWidth / imgNaturalWidth;
      const heightRatio = availableHeight / imgNaturalHeight;
      const fitRatio = Math.min(widthRatio, heightRatio, 1);
      
      setImageSize({
        width: imgNaturalWidth * fitRatio,
        height: imgNaturalHeight * fitRatio
      });
    }
  }, []);

  // تمرير شريط المصغرات إلى الصورة النشطة
  const scrollToActiveThumbnail = useCallback(() => {
    if (thumbnailsRef.current && thumbnailRefs.current[currentIndex]) {
      const thumbnail = thumbnailRefs.current[currentIndex];
      const container = thumbnailsRef.current;
      
      if (thumbnail && container) {
        const thumbnailLeft = thumbnail.offsetLeft;
        const thumbnailWidth = thumbnail.offsetWidth;
        const containerWidth = container.offsetWidth;
        
        const targetScrollLeft = thumbnailLeft - (containerWidth / 2) + (thumbnailWidth / 2);
        
        container.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);

  // دالة الانتقال للصورة التالية
  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1) % images.length);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, [images.length]);

  // دالة الانتقال للصورة السابقة
  const prevImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1 + images.length) % images.length);
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, [images.length]);

  const zoomIn = useCallback(() => {
    if (zoomLevel < 3) {
      setZoomLevel((prev) => prev + 0.5);
    }
  }, [zoomLevel]);

  const zoomOut = useCallback(() => {
    if (zoomLevel > 0.5) {
      setZoomLevel((prev) => prev - 0.5);
    }
    if (zoomLevel - 0.5 === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoomLevel]);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const startDrag = useCallback((e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }, [zoomLevel, position.x, position.y]);

  const onDrag = useCallback((e) => {
    if (isDragging && zoomLevel > 1 && imageRef.current) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      const maxX = Math.max(0, (imageSize.width * zoomLevel - containerRef.current?.offsetWidth) / 2);
      const maxY = Math.max(0, (imageSize.height * zoomLevel - containerRef.current?.offsetHeight) / 2);
      
      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY))
      });
    }
  }, [isDragging, zoomLevel, dragStart, imageSize]);

  const endDrag = useCallback(() => {
    setIsDragging(false);
  }, []);

  // تحديث حجم الصورة عند تحميلها أو تغيير حجم النافذة
  useEffect(() => {
    if (imageRef.current) {
      if (imageRef.current.complete) {
        calculateImageSize();
      } else {
        imageRef.current.onload = calculateImageSize;
      }
    }
    
    window.addEventListener('resize', calculateImageSize);
    return () => window.removeEventListener('resize', calculateImageSize);
  }, [calculateImageSize, currentIndex]);

  // تمرير المصغرات عند تغيير الصورة
  useEffect(() => {
    scrollToActiveThumbnail();
  }, [currentIndex, scrollToActiveThumbnail]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          prevImage();
          break;
        case "ArrowRight":
          e.preventDefault();
          nextImage();
          break;
        case "Escape":
          onClose();
          break;
        case "+":
        case "=":
          e.preventDefault();
          zoomIn();
          break;
        case "-":
          e.preventDefault();
          zoomOut();
          break;
        case "0":
          resetZoom();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextImage, prevImage, zoomIn, zoomOut, resetZoom, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex flex-col"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Top Bar - Close Button Only on Right */}
      <div className="absolute top-0 right-0 z-20 p-4">
        <button
          onClick={onClose}
          className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
          aria-label={language === "ar" ? "إغلاق" : "Close"}
        >
          <IconClose className="w-6 h-6" />
        </button>
      </div>

      {/* Image Container */}
      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        style={{ minHeight: 0, marginTop: '-40px' }}
        onMouseMove={onDrag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        <div
          className="flex items-center justify-center"
          style={{
            cursor: zoomLevel > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
        >
          <img
            ref={imageRef}
            src={currentImage}
            alt={`${language === "ar" ? "صورة" : "Image"} ${currentIndex + 1}`}
            className="block select-none"
            style={{
              width: imageSize.width ? `${imageSize.width}px` : 'auto',
              height: imageSize.height ? `${imageSize.height}px` : 'auto',
              maxWidth: 'calc(100vw - 80px)',
              maxHeight: 'calc(100vh - 160px)',
              objectFit: 'contain',
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-out'
            }}
            onMouseDown={startDrag}
            draggable={false}
          />
        </div>
      </div>

      {/* Navigation Buttons - Left and Right */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 z-20 hover:scale-110 transition-transform"
            aria-label={language === "ar" ? "الصورة السابقة" : "Previous image"}
          >
            <IconChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors z-20 hover:scale-110"
            aria-label={language === "ar" ? "الصورة التالية" : "Next image"}
          >
            <IconChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Zoom Controls - Smaller */}
      <div className="absolute bottom-[90px] left-1/2 transform -translate-x-1/2 flex gap-1.5 bg-black/50 rounded-full p-1.5 backdrop-blur-sm z-20">
        <button 
          onClick={zoomOut} 
          className="p-1.5 hover:bg-white/20 rounded-full text-white hover:scale-110 transition-transform"
          aria-label={language === "ar" ? "تصغير" : "Zoom out"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <button 
          onClick={resetZoom} 
          className="px-2 py-1 hover:bg-white/20 rounded-full transition-colors text-white text-xs font-medium min-w-[40px]"
          aria-label={language === "ar" ? "إعادة تعيين التكبير" : "Reset zoom"}
        >
          {Math.round(zoomLevel * 100)}%
        </button>
        <button 
          onClick={zoomIn} 
          className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white hover:scale-110"
          aria-label={language === "ar" ? "تكبير" : "Zoom in"}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Thumbnails Bar - Smaller */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 to-transparent pt-4 pb-2">
        <div className="max-w-full mx-auto px-3">
          <div 
            ref={thumbnailsRef}
            className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.2) transparent',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {images.map((image, index) => (
              <button
                key={index}
                ref={(el) => (thumbnailRefs.current[index] = el)}
                onClick={() => {
                  setCurrentIndex(index);
                  setZoomLevel(1);
                  setPosition({ x: 0, y: 0 });
                }}
                className={`flex-shrink-0 transition-all duration-300 rounded-md overflow-hidden ${
                  index === currentIndex
                    ? "ring-2 ring-amber-500 ring-offset-1 ring-offset-black scale-105"
                    : "opacity-70 hover:opacity-100"
                }`}
                style={{
                  width: '60px',
                  height: '60px'
                }}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// Helper Functions
// ============================================

// دالة لجمع جميع صور المشروع
const getAllProjectImages = (project) => {
  const images = [];

  if (project.mainImage) {
    images.push(project.mainImage);
  }

  if (project.galleryImages && Array.isArray(project.galleryImages)) {
    images.push(...project.galleryImages);
  }

  if (project.beforeImages && Array.isArray(project.beforeImages)) {
    images.push(...project.beforeImages);
  }

  if (project.afterImages && Array.isArray(project.afterImages)) {
    images.push(...project.afterImages);
  }

  return [...new Set(images)];
};

// ============================================
// Main ProjectPhoto Component
// ============================================

export default function ProjectPhoto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { language, direction } = useLanguage();

  const handleBack = () => {
    navigate("/admin-projects");
  };

  const openLightbox = useCallback((index) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setShowLightbox(false);
  }, []);

  const viewAllImages = useCallback(() => {
    openLightbox(0);
  }, [openLightbox]);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        setError(null);

        const projectDoc = await getDoc(doc(db, "portfolioProjects", id));

        if (projectDoc.exists()) {
          const projectData = projectDoc.data();

          const projectInfo = {
            id: projectDoc.id,
            mainImage: projectData.mainImage || projectData.coverImage || "",
            galleryImages: Array.isArray(projectData.galleryImages) ? projectData.galleryImages :
              Array.isArray(projectData.images) ? projectData.images : [],
            beforeImages: Array.isArray(projectData.beforeImages) ? projectData.beforeImages : [],
            afterImages: Array.isArray(projectData.afterImages) ? projectData.afterImages : [],
            title: projectData.title || projectData.projectName || { ar: "مشروع", en: "Project" }
          };

          setProject(projectInfo);
          const allImages = getAllProjectImages(projectInfo);
          setImages(allImages);

        } else {
          setError(language === "ar" ? "المشروع غير موجود" : "Project not found");
        }
      } catch (error) {
        console.error("خطأ في جلب المشروع:", error);
        setError(language === "ar" ? "حدث خطأ في تحميل المشروع" : "Error loading project");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [id, language]);

  const getProjectTitle = () => {
    if (!project || !project.title) return language === "ar" ? "مشروع" : "Project";

    if (typeof project.title === "object") {
      return project.title[language] || project.title.ar || project.title.en || "Project";
    }

    return project.title;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center" dir={direction}>
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mb-4"></div>
          </div>
          <p className="text-gray-600 text-sm md:text-base mt-4 animate-pulse">
            {language === "ar" ? "جاري تحميل الصور..." : "Loading images..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center" dir={direction}>
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4 text-amber-400"></div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            {error}
          </h2>
          <button
            onClick={handleBack}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {language === "ar" ? "العودة إلى المشاريع" : "Back to Projects"}
          </button>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center" dir={direction}>
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4 text-amber-400">🖼️</div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            {language === "ar" ? "لا توجد صور" : "No Images"}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === "ar"
              ? "لا توجد صور متاحة لهذا المشروع حالياً"
              : "No images available for this project at the moment"
            }
          </p>
          <button
            onClick={handleBack}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {language === "ar" ? "العودة إلى المشاريع" : "Back to Projects"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100" dir={direction}>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-white text-gray-700 rounded-xl shadow-md hover:shadow-lg border border-gray-200 hover:border-amber-500 transition-all duration-300 group"
            >
              <IconChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <span className="font-medium text-sm md:text-base">
                {language === "ar" ? "العودة للمشاريع" : "Back to Projects"}
              </span>
            </button>

            <div>
              <h1 className="text-sm md:text-lg font-bold text-gray-900 truncate max-w-[200px] md:max-w-md">
                {getProjectTitle()}
              </h1>
              <p className="text-xs text-gray-500 text-center">
                {images.length} {language === "ar" ? "صورة" : "images"}
              </p>
            </div>

            <button
              onClick={viewAllImages}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
            >
              <IconZoom className="w-5 h-5" />
              <span className="font-medium text-sm md:text-base hidden sm:inline">
                {language === "ar" ? "عرض الكل" : "View All"}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main className="py-6 md:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 md:mb-8 text-center">
            <p className="text-gray-500 text-sm">
              {language === "ar"
                ? `عرض ${images.length} صورة من المشروع`
                : `Showing ${images.length} project images`
              }
            </p>
          </div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className="relative group cursor-pointer"
                onClick={() => openLightbox(index)}
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-md hover:shadow-xl transition-all duration-300">
                  <img
                    src={image}
                    alt={`${getProjectTitle()} - ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                        <IconZoom className="w-5 h-5 text-gray-800" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                    {index + 1} / {images.length}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {showLightbox && images.length > 0 && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
          language={language}
        />
      )}

      <style jsx="true">{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.3);
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.5);
        }

        ::selection {
          background: rgba(245, 158, 11, 0.2);
        }
        
        /* تخصيص شريط التمرير للمصغرات */
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}