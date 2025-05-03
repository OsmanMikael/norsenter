import { initializeApp } from "firebase/app";
import {
  getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject
} from "firebase/storage";
import {
  getFirestore, collection, addDoc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, doc
} from "firebase/firestore";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User
} from "firebase/auth";

import { ContactItem, NewsItem, MediaItem } from '../types/Types';


// ==================== CONFIG ====================
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};


// ==================== INITIALISERING ====================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);


// ==================== AUTENTISERING ====================
const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// ==================== KONTAKTER ====================
const getAllContacts = async (): Promise<ContactItem[]> => {
  const snapshot = await getDocs(collection(db, "contacts"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ContactItem));
};

const saveContact = async (contact: ContactItem): Promise<string> => {
  const docRef = await addDoc(collection(db, "contacts"), contact);
  return docRef.id;
};

const updateContact = async (id: string, data: Partial<ContactItem>) => {
  const contactRef = doc(db, "contacts", id);
  await updateDoc(contactRef, data);
};


const deleteContact = async (id: string) => {
  if (!id) return;
  await deleteDoc(doc(db, "contacts", id));
};

// ==================== NYHETER ====================
const getAllNews = async (): Promise<NewsItem[]> => {
  const snapshot = await getDocs(collection(db, "news"));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || "Ukjent tittel",
      date: data.date || "Ukjent dato",
      content: data.content || "Ingen innhold tilgjengelig",
    } as NewsItem;
  });
};

const saveNews = async (news: NewsItem): Promise<{ success: boolean; id: string }> => {
  if (!news.title || !news.date || !news.content) {
    throw new Error("Alle feltene er påkrevd: Tittel, Dato, og Innhold");
  }

  if (news.id) {
    const refDoc = doc(db, "news", news.id);
    await updateDoc(refDoc, {
      title: news.title,
      date: news.date,
      content: news.content,
    });
    return { success: true, id: news.id };
  } else {
    const docRef = await addDoc(collection(db, "news"), {
      title: news.title,
      date: news.date,
      content: news.content,
    });
    return { success: true, id: docRef.id };
  }
};

const deleteNews = async (id: string) => {
  await deleteDoc(doc(db, "news", id));
};


// ==================== MEDIA ====================
const getAllMedia = async (): Promise<MediaItem[]> => {
  const snapshot = await getDocs(collection(db, "media"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as MediaItem));
};

const saveMedia = async (
  media: MediaItem,
  file?: File
): Promise<{ success: boolean; id?: string; fileUrl?: string; error?: string }> => {
  try {
    let fileUrl = media.fileUrl || undefined;
    let filePath = media.filePath || undefined;
    let fileType = media.fileType || "unknown";

    if (file) {
      filePath = `media/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, filePath);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      fileUrl = await getDownloadURL(uploadTask.ref);
      fileType = file.type.split("/")[0];
    }

    if (media.id) {
      const mediaRef = doc(db, "media", media.id);
      await updateDoc(mediaRef, {
        title: media.title,
        date: media.date,
        description: media.description,
        fileUrl,
        filePath,
        fileType,
      });
      return { success: true, id: media.id, fileUrl };
    } else {
      const docRef = await addDoc(collection(db, "media"), {
        title: media.title,
        date: media.date,
        description: media.description,
        fileUrl,
        filePath,
        fileType,
      });
      return { success: true, id: docRef.id, fileUrl };
    }
  } catch (error: any) {
    console.error("Error saving media:", error);
    return { success: false, error: error.message };
  }
};

const deleteMedia = async (id: string, filePath?: string) => {
  try {
    await deleteDoc(doc(db, "media", id));
    if (filePath) {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// ==================== ABOUT ====================
const getAboutText = async (): Promise<string> => {
  const aboutRef = doc(db, "content", "about");
  const docSnap = await getDoc(aboutRef);
  return docSnap.exists() ? docSnap.data().text : "";
};

const updateAboutText = async (newText: string): Promise<{ success: boolean; error?: string }> => {
  try {
    await setDoc(doc(db, "content", "about"), { text: newText }, { merge: true });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// ==================== EKSPORT ====================
export {
  db,
  storage,
  auth,
  ref,
  doc,
  getDoc,
  setDoc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  getAllContacts,
  saveContact,
  updateContact,
  deleteContact,
  getAllNews,
  saveNews,
  deleteNews,
  getAllMedia,
  saveMedia,
  deleteMedia,
  getAboutText,
  updateAboutText,
  loginUser,
  logoutUser,
  onAuthStateChange,
};
