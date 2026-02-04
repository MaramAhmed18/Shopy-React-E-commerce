// src/utils/firebaseHelper.js
import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, updateDoc , deleteDoc} from 'firebase/firestore';
import { db } from '../config/firebase.js';

export const getAllDocs = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Add this function to fetch a single product
export const getDocById = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

// Add this to store orders
export const createOrder = async (orderData) => {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: new Date().toISOString()
  });
  return docRef.id;
};

// Add this to fetch user-specific orders
export const getUserOrders = async (userId) => {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Add this to fetch user profile
export const getUserProfile = async (userId) => {
  return await getDocById('users', userId);
};

// Add this to update any document by ID
export const updateDocById = async (collectionName, id, data) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
};

//Add this to delete any document by ID
export const deleteDocById = async (collectionName, id) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}

// Add this to update user profile
export const updateUserProfile = async (userId, profileData) => {
  const docRef = doc(db, 'users', userId);
  await updateDoc(docRef, profileData);
};

