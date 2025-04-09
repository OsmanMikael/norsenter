import { initializeApp } from "firebase/app";
import { 
  getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject 
} from "firebase/storage";
import { 
  getFirestore, collection, addDoc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, doc 
} from "firebase/firestore";
import { 
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged 
} from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
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
const saveMedia = async (media, file) => {
  try {
    let fileUrl = media.fileUrl || null;
    let filePath = media.filePath || null;  // Beholder eksisterende filePath
    let fileType = media.fileType || "unknown";

    // Slett gammel fil fra Storage hvis en ny lastes opp
    if (file && media.filePath && filePath !== media.filePath) {
      const oldFileRef = ref(storage, media.filePath);
      await deleteObject(oldFileRef).catch((error) => {
        console.warn("Kunne ikke slette gammel fil:", error);
      });
    }

    // Last opp ny fil hvis den finnes
    if (file) {
      filePath = `media/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, filePath);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      fileUrl = await getDownloadURL(uploadTask.ref);
      fileType = file.type.split("/")[0];
    }

    if (media.id) {
      // Oppdater eksisterende dokument i Firestore
      const mediaRef = doc(db, "media", media.id);
      await updateDoc(mediaRef, {
        title: media.title,
        date: media.date,
        description: media.description,
        fileUrl: fileUrl,
        filePath: filePath,
        fileType: fileType,
      });

      return { success: true, id: media.id, fileUrl };
    } else {
      // Opprett nytt dokument i Firestore
      const docRef = await addDoc(collection(db, "media"), {
        title: media.title,
        date: media.date,
        description: media.description,
        fileUrl: fileUrl,
        filePath: filePath,
        fileType: fileType,
      });

      return { success: true, id: docRef.id, fileUrl };
    }
  } catch (error) {
    console.error("Error saving media:", error);
    return { success: false, error: error.message };
  }
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

// ==================== ABOUT ====================

// Hent About-teksten fra Firestore
const getAboutText = async () => {
  const aboutRef = doc(db, "content", "about");
  const docSnap = await getDoc(aboutRef);

  if (docSnap.exists()) {
    return docSnap.data().text;
  } else {
    return ""; // Returnerer tom streng hvis dokumentet ikke finnes
  }
};

// Oppdater About-teksten i Firestore

// Oppdater eller opprett About-teksten i Firestore
const updateAboutText = async (newText) => {
  const aboutRef = doc(db, "content", "about");

  try {
    await setDoc(aboutRef, { text: newText }, { merge: true }); // 🔹 Oppretter dokumentet hvis det ikke finnes
    return { success: true };
  } catch (error) {
    console.error("Feil ved oppdatering av About-teksten:", error);
    return { success: false, error: error.message };
  }
};


export { getAboutText, updateAboutText };


export { 
  storage, db, auth, getDoc,
  collection, addDoc, getDocs, updateDoc, deleteDoc, doc, ref, 
  uploadBytesResumable, getDownloadURL, deleteObject, 
  getAllContacts, saveContact, updateContact, deleteContact, 
  getAllNews, saveNews, deleteNews,
  getAllMedia, saveMedia, deleteMedia,
  loginUser, logoutUser, onAuthStateChange
};