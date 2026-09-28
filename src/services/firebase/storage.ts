/**
 * Firebase Storage Service
 * 
 * Handles uploading media assets (cover images, inline article photos, heritage photos)
 * to Firebase Storage buckets and returns their secure public download URLs.
 */

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFirebaseStorageInstance } from './app';
import { getFirebaseConfigStatus } from './config';

export interface UploadProgressCallback {
  (progressPercent: number): void;
}

/**
 * Uploads an image file to Firebase Storage under /blog/covers/ or /blog/articles/
 */
export async function uploadMediaFile(
  file: File,
  folder: 'blog/covers' | 'blog/articles' | 'temples' | 'heritage' | 'photography' = 'blog/articles',
  customFileName?: string,
  onProgress?: UploadProgressCallback
): Promise<string> {
  const status = getFirebaseConfigStatus();
  
  // Validate image file type
  if (!file.type.startsWith('image/')) {
    throw new Error('Selected file must be an image (JPEG, PNG, WebP, SVG, AVIF).');
  }

  // If Firebase is not configured, fall back to offline Data URL representation
  if (!status.isConfigured) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (onProgress) onProgress(100);
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  const storage = getFirebaseStorageInstance();
  if (!storage) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (onProgress) onProgress(100);
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  // Sanitize filename
  const timestamp = Date.now();
  const cleanOriginalName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-');
  const fileName = customFileName
    ? `${customFileName}-${timestamp}.${file.name.split('.').pop() || 'jpg'}`
    : `${timestamp}-${cleanOriginalName}`;

  const storageRef = ref(storage, `${folder}/${fileName}`);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error('Firebase Storage upload failed:', error);
        reject(new Error(`Storage upload failed: ${error.message}`));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadUrl);
        } catch (err: any) {
          reject(new Error(`Failed to retrieve download URL: ${err.message}`));
        }
      }
    );
  });
}

/**
 * Uploads a blog cover image
 */
export async function uploadCoverImage(
  file: File,
  articleSlug: string,
  onProgress?: UploadProgressCallback
): Promise<string> {
  return uploadMediaFile(file, 'blog/covers', `cover-${articleSlug}`, onProgress);
}

/**
 * Uploads an inline article image
 */
export async function uploadArticleImage(
  file: File,
  articleSlug: string,
  onProgress?: UploadProgressCallback
): Promise<string> {
  return uploadMediaFile(file, 'blog/articles', `article-${articleSlug}`, onProgress);
}
