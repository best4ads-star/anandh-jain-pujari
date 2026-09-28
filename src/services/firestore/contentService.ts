/**
 * Content Service for Additional Firestore Collections
 * 
 * Supports CRUD operations for:
 * temples, heritage, photography, projects, pages, categories, siteSettings, seoSettings
 * with standard id, createdAt, updatedAt handling.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { getFirestoreDb } from '../firebase/app';
import { getFirebaseConfigStatus } from '../firebase/config';
import {
  COLLECTIONS,
  CollectionName,
  TempleDocument,
  HeritageDocument,
  PhotographyDocument,
  ProjectDocument,
  PageDocument,
  CategoryDocument,
  SiteSettingsDocument,
  SeoSettingsDocument,
} from './collections';
import { handleFirestoreError, OperationType } from './errorHandler';

/**
 * Generic fetch for any published collection
 */
export async function getCollectionItems<T>(
  colName: CollectionName,
  includeDrafts: boolean = false
): Promise<T[]> {
  const status = getFirebaseConfigStatus();
  if (!status.isConfigured) {
    return [];
  }

  const db = getFirestoreDb();
  if (!db) return [];

  try {
    const colRef = collection(db, colName);
    let q = query(colRef);

    if (!includeDrafts && colName !== COLLECTIONS.CATEGORIES) {
      q = query(colRef, where('status', '==', 'published'));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, colName);
  }
}

/**
 * Generic save document helper
 */
export async function saveCollectionItem<T extends { id?: string }>(
  colName: CollectionName,
  item: T
): Promise<string> {
  const status = getFirebaseConfigStatus();
  if (!status.isConfigured) {
    throw new Error('Firebase connection required. Please configure Firebase to modify data.');
  }

  const db = getFirestoreDb();
  if (!db) throw new Error('Firestore is unavailable.');

  const now = new Date().toISOString();
  const id = item.id || `${colName}_${Date.now()}`;
  const path = `${colName}/${id}`;

  const documentData = {
    ...item,
    id,
    updatedAt: now,
    createdAt: (item as any).createdAt || now,
  };

  try {
    const docRef = doc(db, colName, id);
    await setDoc(docRef, documentData, { merge: true });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Generic delete document helper
 */
export async function deleteCollectionItem(
  colName: CollectionName,
  id: string
): Promise<void> {
  const status = getFirebaseConfigStatus();
  if (!status.isConfigured) {
    throw new Error('Firebase connection required.');
  }

  const db = getFirestoreDb();
  if (!db) throw new Error('Firestore is unavailable.');

  const path = `${colName}/${id}`;
  try {
    const docRef = doc(db, colName, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
