import { openDB } from 'idb';

const dbPromise = openDB('appDB', 2, { // Oppgrader til versjon 2
  upgrade(db, oldVersion, newVersion, transaction) {
    if (oldVersion < 1) {
      db.createObjectStore('news', { keyPath: 'id' });
      db.createObjectStore('media', { keyPath: 'id' });
    }
    if (oldVersion < 2) {
      db.createObjectStore('contacts', { keyPath: 'id' });
    }
  },
});

export const getAllNews = async () => {
  const db = await dbPromise;
  return db.getAll('news');
};

export const saveNews = async (newsItem) => {
  const db = await dbPromise;
  return db.put('news', newsItem);
};

export const deleteNews = async (id) => {
  const db = await dbPromise;
  return db.delete('news', id);
};

export const getAllMedia = async () => {
  const db = await dbPromise;
  return db.getAll('media');
};

export const saveMedia = async (mediaItem) => {
  const db = await dbPromise;
  return db.put('media', mediaItem);
};

export const deleteMedia = async (id) => {
  const db = await dbPromise;
  return db.delete('media', id);
};

export const getAllContacts = async () => {
  const db = await dbPromise;
  return db.getAll('contacts');
};

export const saveContact = async (contact) => {
  const db = await dbPromise;
  return db.put('contacts', contact);
};

export const deleteContact = async (id) => {
  const db = await dbPromise;
  return db.delete('contacts', id);
};