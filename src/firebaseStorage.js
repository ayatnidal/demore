import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";
import { storage } from "./firebase";

// دالة رفع الملفات (للصور والفيديوهات)
export const uploadFileToFirebase = async (file, folder = "uploads") => {
  if (!file) throw new Error("No file selected");

  const cleanName = file.name.replace(/\s+/g, "_");
  const fileRef = ref(
    storage,
    `${folder}/${Date.now()}_${cleanName}`
  );

  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
};

// دالة حذف الملفات
export const deleteFileFromFirebase = async (fileUrl) => {
  try {
    // استخراج المرجع من الـ URL
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

// دالة للصور فقط (للتـ backward compatibility)
export const uploadImageToFirebase = async (file, folder = "uploads") => {
  return uploadFileToFirebase(file, folder);
};