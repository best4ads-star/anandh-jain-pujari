/**
 * Firebase Storage Service
 * 
 * Manages media uploads and deletions for CMS sections:
 * blog, temples, heritage, photography, projects, about, hero
 * Only authenticated admins can upload/delete media.
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { getFirebaseStorageInstance, getFirebaseAuth } from '../firebase/app';
import { getFirebaseConfigStatus } from '../firebase/config';

export type StorageFolder =
  | 'blog'
  | 'temples'
  | 'heritage'
  | 'photography'
  | 'projects'
  | 'about'
  | 'hero';

export interface UploadResult {
  downloadUrl: string;
  storagePath: string;
  fileName: string;
}

export interface StorageMediaItem {
  name: string;
  fullPath: string;
  downloadUrl: string;
}

/**
 * Upload an image file to a designated CMS folder in Firebase Storage
 */
export async function uploadMediaFile(
  folder: StorageFolder,
  file: File,
  customName?: string
): Promise<UploadResult> {
  const status = getFirebaseConfigStatus();
  if (!status.isConfigured) {
    throw new Error('Firebase connection required. Please configure your Firebase environment variables to upload media.');
  }

  const auth = getFirebaseAuth();
  if (!auth?.currentUser) {
    throw new Error('Authentication required. Only logged-in administrators can upload media.');
  }

  const storage = getFirebaseStorageInstance();
  if (!storage) {
    throw new Error('Firebase Storage instance unavailable.');
  }

  // Sanitize filename and create unique storage path
  const sanitizedName = (customName || file.name)
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '_');
  const timestamp = Date.now();
  const storagePath = `${folder}/${timestamp}_${sanitizedName}`;
  const storageRef = ref(storage, storagePath);

  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type,
    customMetadata: {
      uploadedBy: auth.currentUser.uid,
      uploadedAt: new Date().toISOString(),
    },
  });

  const downloadUrl = await getDownloadURL(snapshot.ref);

  return {
    downloadUrl,
    storagePath,
    fileName: sanitizedName,
  };
}

/**
 * Delete a media file from Firebase Storage
 */
export async function deleteMediaFile(storagePath: string): Promise<void> {
  const status = getFirebaseConfigStatus();
  if (!status.isConfigured) {
    throw new Error('Firebase connection required.');
  }

  const auth = getFirebaseAuth();
  if (!auth?.currentUser) {
    throw new Error('Authentication required.');
  }

  const storage = getFirebaseStorageInstance();
  if (!storage) {
    throw new Error('Storage unavailable.');
  }

  const fileRef = ref(storage, storagePath);
  await deleteObject(fileRef);
}

/**
 * List files within a designated folder
 */
export async function listFolderMedia(folder: StorageFolder): Promise<StorageMediaItem[]> {
  const status = getFirebaseConfigStatus();
  if (!status.isConfigured) {
    return [];
  }

  const storage = getFirebaseStorageInstance();
  if (!storage) {
    return [];
  }

  try {
    const folderRef = ref(storage, folder);
    const result = await listAll(folderRef);

    const items = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          downloadUrl: url,
        };
      })
    );

    return items;
  } catch (error) {
    console.warn(`Failed to list storage items for folder "${folder}":`, error);
    return [];
  }
}
