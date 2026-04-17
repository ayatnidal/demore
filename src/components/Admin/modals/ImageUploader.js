// src/components/Admin/modals/ImageUploader.js
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  IconCloudUpload,
  IconX,
  IconCamera,
  IconMenu
} from '../../Icons';

import {
  uploadFileToFirebase,
  deleteFileFromFirebase
} from '../../../firebaseStorage';

/* ================= COMPONENT ================= */
const ImageUploader = ({
  currentImages = [],
  onImagesUploaded,
  multiple = true,
  maxFiles = Infinity,
  label = 'رفع الصور والفيديوهات',
  disabled = false,
  allowVideos = true,
  duplicateCheck = true,
  section = 'general'
}) => {

  /* ================= STATE ================= */
  const [items, setItems] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState(null);
  const [dragOverItemId, setDragOverItemId] = useState(null);

  const inputRef = useRef(null);
  const cacheRef = useRef(new Set());
  const initializedRef = useRef(false);

  /* ================= HELPERS ================= */
  const isVideo = useCallback((fileOrUrl) => {
    if (!fileOrUrl) return false;
    if (typeof fileOrUrl === 'string') {
      return /\.(mp4|mov|avi|wmv|mkv|webm|m4v)$/i.test(fileOrUrl);
    }
    return fileOrUrl.type?.startsWith('video/');
  }, []);

  const validateFile = (file) => {
    const errs = [];

    const validType =
      file.type.startsWith('image/') ||
      (allowVideos && file.type.startsWith('video/'));

    if (!validType) {
      errs.push(`نوع غير مدعوم: ${file.name}`);
    }

    if (duplicateCheck) {
      const key = `${section}_${file.name}_${file.size}`;
      if (cacheRef.current.has(key)) {
        errs.push(`الملف مكرر: ${file.name}`);
      }
    }

    return errs;
  };

  /* ================= DRAG & DROP REORDERING ================= */
  const handleDragStart = (e, id) => {
    if (disabled) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    setDraggedItemId(id);
    
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  const handleDragOverItem = (e, id) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverItemId !== id) {
      setDragOverItemId(id);
    }
  };

  const handleDropOnItem = (e, targetId) => {
    e.preventDefault();
    const sourceId = draggedItemId;
    
    if (!sourceId || sourceId === targetId) {
      setDraggedItemId(null);
      setDragOverItemId(null);
      return;
    }

    setItems(prevItems => {
      const sourceIndex = prevItems.findIndex(item => item.id === sourceId);
      const targetIndex = prevItems.findIndex(item => item.id === targetId);
      
      if (sourceIndex === -1 || targetIndex === -1) return prevItems;
      
      const newItems = [...prevItems];
      const [removed] = newItems.splice(sourceIndex, 1);
      newItems.splice(targetIndex, 0, removed);
      
      onImagesUploaded?.(newItems.map(i => i.url));
      
      return newItems;
    });
    
    setDraggedItemId(null);
    setDragOverItemId(null);
  };

  /* ================= INIT ================= */
  useEffect(() => {
    if (initializedRef.current) return;
    if (!currentImages?.length) return;

    const initial = currentImages.map(url => ({
      id: crypto.randomUUID(),
      name: url.split('/').pop(),
      url,
      preview: url,
      isVideo: isVideo(url),
      source: 'existing',
      size: null
    }));

    setItems(initial);
    initializedRef.current = true;
  }, [currentImages, isVideo]);

  /* ================= UPLOAD ================= */
  const processFiles = async (files) => {
    if (disabled || !files.length) return;

    if (items.length + files.length > maxFiles) {
      setErrors([`الحد الأقصى ${maxFiles} ملفات`]);
      return;
    }

    setLoading(true);
    setErrors([]);

    const uploadedItems = [];

    for (const file of files) {
      const errs = validateFile(file);
      if (errs.length) {
        setErrors(prev => [...prev, ...errs]);
        continue;
      }

      try {
        const url = await uploadFileToFirebase(file, section);
        const cacheKey = `${section}_${file.name}_${file.size}`;
        cacheRef.current.add(cacheKey);

        uploadedItems.push({
          id: crypto.randomUUID(),
          name: file.name,
          url,
          preview: url,
          isVideo: isVideo(file),
          source: 'upload',
          size: file.size
        });
      } catch (error) {
        console.error('Failed to upload file:', error);
        setErrors(prev => [...prev, `فشل رفع ${file.name}: ${error.message || 'خطأ غير معروف'}`]);
      }
    }

    if (uploadedItems.length) {
      setItems(prev => {
        const updated = [...prev, ...uploadedItems];
        onImagesUploaded?.(updated.map(i => i.url));
        return updated;
      });
    }

    setLoading(false);
  };

  /* ================= EVENTS ================= */
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type) {
      processFiles(files);
    }
  };

  const handleSelect = (e) => {
    processFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const removeItem = async (id) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    if (item.source === 'upload') {
      await deleteFileFromFirebase(item.url);
    }

    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    onImagesUploaded?.(updated.map(i => i.url));
    
    const tempError = { message: `تم حذف ${item.isVideo ? 'الفيديو' : 'الصورة'}: ${item.name}`, isSuccess: true };
    setErrors(prev => [...prev, tempError]);
    setTimeout(() => {
      setErrors(prev => prev.filter(e => !e.isSuccess));
    }, 3000);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">{label}</h3>

      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
      >
        <IconCloudUpload className="w-12 h-12 mx-auto text-blue-500 mb-2" />
        <p className="text-gray-700">{loading ? 'جاري الرفع...' : 'اسحب الملفات أو اضغط للاختيار'}</p>
        <p className="text-xs text-gray-500 mt-1">نصيحة: اسحب الصور لإعادة ترتيبها</p>

        <input
          ref={inputRef}
          type="file"
          hidden
          multiple={multiple}
          accept="image/*,video/*"
          onChange={handleSelect}
          disabled={loading}
        />
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 p-3 rounded text-red-600 text-sm border border-red-200">
          <p className="font-semibold mb-1">ملاحظات:</p>
          {errors.map((e, i) => (
            <div key={i} className={e.isSuccess ? 'text-green-600' : ''}>
              • {e.message || e}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable={!disabled}
            onDragStart={(e) => handleDragStart(e, item.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOverItem(e, item.id)}
            onDrop={(e) => handleDropOnItem(e, item.id)}
            className={`
              relative border rounded overflow-hidden group bg-white shadow-sm 
              transition-all duration-200
              ${!disabled ? 'cursor-move' : 'cursor-default'}
              ${dragOverItemId === item.id ? 'border-blue-500 shadow-lg ring-2 ring-blue-300 scale-[1.02]' : 'hover:shadow-md'}
              ${draggedItemId === item.id ? 'opacity-40' : 'opacity-100'}
            `}
          >
            {!disabled && (
              <div className="absolute top-2 left-2 z-10 bg-black/50 rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing hover:bg-black/70">
                <IconMenu className="w-4 h-4 text-white" />
              </div>
            )}

            <div className="absolute bottom-2 left-2 z-10 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full font-medium">
              #{index + 1}
            </div>

            {item.isVideo ? (
              <div className="flex flex-col items-center justify-center h-40 bg-gradient-to-br from-purple-50 to-purple-100">
                <IconCamera className="w-12 h-12 text-purple-500 mb-1" />
                <span className="text-xs text-purple-700 font-medium px-2 text-center truncate w-full">
                  {item.name}
                </span>
                {item.size && (
                  <span className="text-xs bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full mt-1">
                    {formatFileSize(item.size)}
                  </span>
                )}
              </div>
            ) : (
              <>
                <img src={item.preview} className="h-40 w-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs bg-black/70 px-2 py-1 rounded">
                    صورة
                  </span>
                </div>
              </>
            )}

            <button
              onClick={() => removeItem(item.id)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg z-10"
              aria-label="حذف"
            >
              <IconX className="w-4 h-4" />
            </button>

            {item.isVideo && (
              <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                فيديو
              </div>
            )}

            {dragOverItemId === item.id && draggedItemId !== item.id && (
              <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none bg-blue-100/20"></div>
            )}
          </div>
        ))}
      </div>

      {items.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
          <IconCamera className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">لا توجد صور أو فيديوهات</p>
          <p className="text-xs mt-1">اسحب الملفات أو اضغط للاختيار</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 ml-2"></div>
          <span className="text-blue-700 text-sm">
            جاري رفع الملفات... الفيديوهات الكبيرة قد تستغرق وقتاً أطول
          </span>
        </div>
      )}

      {items.length > 0 && (
        <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded-lg flex justify-between items-center">
          <span>إجمالي الملفات: {items.length}</span>
          <span>
            {items.filter(i => i.isVideo).length} فيديو • {items.filter(i => !i.isVideo).length} صورة
          </span>
          {!disabled && (
            <span className="text-blue-600 flex items-center gap-1">
              <IconMenu className="w-3 h-3" /> اسحب لإعادة الترتيب
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;