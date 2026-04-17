import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function testFirestore() {
  try {
    await addDoc(collection(db, "test"), {
      connected: true,
      createdAt: new Date(),
    });

    console.log("✅ Firestore connected successfully");
  } catch (error) {
    console.error("❌ Firebase error:", error);
  }
}
