/**
 * Hero Settings Service (Firestore with Local Defaults)
 * 
 * Manages dynamic hero configuration.
 * Does not alter the existing public Hero appearance.
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirestoreDb } from '../firebase/app';
import { getFirebaseConfigStatus } from '../firebase/config';
import { COLLECTIONS, HeroSettingsDocument } from './collections';
import { handleFirestoreError, OperationType } from './errorHandler';

export const DEFAULT_HERO_SETTINGS: HeroSettingsDocument = {
  id: 'default',
  greeting: 'JAIN TEMPLE PRIEST • HERITAGE DOCUMENTARIAN',
  title: 'Anandh Jain Pujari',
  subtitle: 'Preserving Sacred Jain Heritage, Epigraphy, and Living Spiritual Traditions of Kongu Nadu.',
  quote: '"In the stillness of ancient sanctums and the weathered stone of inscriptions, the eternal path of Ahimsa speaks to every generation."',
  quoteAuthor: 'Anandh Jain Pujari',
  status: 'published',
  updatedAt: '2026-09-20T00:00:00.000Z',
};

/**
 * Fetch Hero settings with automatic fallback to current static defaults
 */
export async function getHeroSettings(): Promise<HeroSettingsDocument> {
  const status = getFirebaseConfigStatus();
  if (!status.isConfigured) {
    return DEFAULT_HERO_SETTINGS;
  }

  const db = getFirestoreDb();
  if (!db) {
    return DEFAULT_HERO_SETTINGS;
  }

  try {
    const docRef = doc(db, COLLECTIONS.HERO_SETTINGS, 'default');
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return snapshot.data() as HeroSettingsDocument;
    }

    return DEFAULT_HERO_SETTINGS;
  } catch (error) {
    console.warn('Could not fetch hero settings from Firestore, using default:', error);
    return DEFAULT_HERO_SETTINGS;
  }
}

/**
 * Update Hero settings in Firestore (Admin CMS)
 */
export async function saveHeroSettings(settings: Partial<HeroSettingsDocument>): Promise<void> {
  const status = getFirebaseConfigStatus();
  if (!status.isConfigured) {
    throw new Error('Firebase connection required. Please configure your Firebase environment variables.');
  }

  const db = getFirestoreDb();
  if (!db) {
    throw new Error('Firestore is unavailable.');
  }

  const path = `${COLLECTIONS.HERO_SETTINGS}/default`;
  const updatedData: HeroSettingsDocument = {
    ...DEFAULT_HERO_SETTINGS,
    ...settings,
    id: 'default',
    updatedAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, COLLECTIONS.HERO_SETTINGS, 'default');
    await setDoc(docRef, updatedData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
