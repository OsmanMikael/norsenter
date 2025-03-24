import { initializeApp } from "firebase/app";
import { 
  getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject 
} from "firebase/storage";
import { 
  getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc 
} from "firebase/firestore";
import { 
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "firebase/auth";

// Firebase-konfigurasjon
const firebaseConfig = {
  apiKey: "AIzaSyBSR0GVJvnGgi2y2tvHgqs2-75-pBZxS-w",
  authDomain: "nor-senter.firebaseapp.com",
  projectId: "nor-senter",
  storageBucket: "nor-senter.appspot.com",
  messagingSenderId: "181059608560",
  appId: "1:181059608560:web:f5076fa3c5111a4acd0735",
  measurementId: "G-CKQ54Y34CY"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // Legger til autentisering

// ==================== AUTENTISERING ====================
// Logg inn bruker
const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Logg ut bruker
const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Lytt etter autentiseringsendringer
const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// ==================== KONTAKTER ====================
const getAllContacts = async () => {
  const contactsCollection = collection(db, "contacts");
  const contactSnapshot = await getDocs(contactsCollection);
  return contactSnapshot.docs.map(doc => ({
    id: doc.id, // 🔹 Sikrer at vi inkluderer ID-en
    ...doc.data(),
  }));
};



const saveContact = async (contact) => {
  const docRef = await addDoc(collection(db, "contacts"), contact);
  return docRef.id; // 🔹 Sørger for at vi returnerer ID-en
};


const updateContact = async (id, updatedData) => {
  const contactRef = doc(db, "contacts", id);
  await updateDoc(contactRef, updatedData);
};

const deleteContact = async (id) => {
  if (!id) {
    console.error("Contact ID is null or undefined");
    return;
  }
  await deleteDoc(doc(db, "contacts", id));
};

// ==================== NYHETER ====================
const getAllNews = async () => {
  const newsCollection = collection(db, "news");
  const newsSnapshot = await getDocs(newsCollection);
  return newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const saveNews = async (news) => {
  if (news.id) {
    const newsRef = doc(db, "news", news.id);
    await updateDoc(newsRef, {
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

const deleteNews = async (id) => {
  await deleteDoc(doc(db, "news", id));
};

// ==================== MEDIA ====================
// Hent alle mediefiler
const getAllMedia = async () => {
  const mediaCollection = collection(db, "media");
  const mediaSnapshot = await getDocs(mediaCollection);
  return mediaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Lagre ny medieoppføring
const saveMedia = async (media) => {
  const docRef = await addDoc(collection(db, "media"), media);
  return { success: true, id: docRef.id };
};

// Slett en medieoppføring fra Firestore og Storage
const deleteMedia = async (id, filePath) => {
  try {
    // Slett fra Firestore
    await deleteDoc(doc(db, "media", id));

    // Slett fra Storage hvis filsti er gitt
    if (filePath) {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting media:", error);
    return { success: false, error };
  }
};

export { 
  storage, db, auth, 
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, ref, 
  uploadBytesResumable, getDownloadURL, deleteObject, 
  getAllContacts, saveContact, updateContact, deleteContact, 
  getAllNews, saveNews, deleteNews,
  getAllMedia, saveMedia, deleteMedia,
  loginUser, logoutUser, onAuthStateChange
};