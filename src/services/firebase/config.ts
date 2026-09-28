/**
 * Firebase Client Configuration Loader
 * 
 * Safely reads Vite environment variables (VITE_FIREBASE_*).
 * Strictly enforces that no fake credentials or mock project IDs are used.
 * If configuration is missing or incomplete, marks Firebase as unconfigured
 * and provides diagnostic information for the Admin UI.
 */

import firebaseAppletConfig from '../../../firebase-applet-config.json';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  firestoreDatabaseId?: string;
}

export interface FirebaseConfigStatus {
  isConfigured: boolean;
  missingKeys: string[];
  projectId?: string;
  databaseId?: string;
  message: string;
}

/**
 * Validates if a measurement ID has a valid Google Analytics 4 format (e.g., G-XXXXXXXXXX).
 * Returns false if missing, empty, or a dummy placeholder.
 */
export function isValidMeasurementId(id?: string | null): boolean {
  if (!id || typeof id !== 'string') return false;
  const trimmed = id.trim();
  if (!trimmed || trimmed.includes('YOUR_') || trimmed.includes('XXXXXXXXXX')) {
    return false;
  }
  return trimmed.startsWith('G-') && trimmed.length > 2;
}

export function getFirebaseConfig(): FirebaseClientConfig | null {
  const apiKey = (import.meta.env.VITE_FIREBASE_API_KEY?.trim() || firebaseAppletConfig?.apiKey || '');
  const authDomain = (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || firebaseAppletConfig?.authDomain || '');
  const projectId = (import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() || firebaseAppletConfig?.projectId || '');
  const storageBucket = (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim() || firebaseAppletConfig?.storageBucket || '');
  const messagingSenderId = (import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() || firebaseAppletConfig?.messagingSenderId || '');
  const appId = (import.meta.env.VITE_FIREBASE_APP_ID?.trim() || firebaseAppletConfig?.appId || '');
  const rawMeasurementId = (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID?.trim() || firebaseAppletConfig?.measurementId || '');
  const measurementId = rawMeasurementId.length > 0 ? rawMeasurementId : undefined;
  const rawDbId = (import.meta.env.VITE_FIREBASE_DATABASE_ID?.trim() || '');
  // Treat absent, empty, or "(default)" as the default Cloud Firestore database.
  // Never default to non-default AI Studio database instances.
  const isDefaultDb = !rawDbId || rawDbId === '(default)' || rawDbId === 'default' || rawDbId.startsWith('ai-studio-');
  const firestoreDatabaseId = isDefaultDb ? undefined : rawDbId;

  // Validate required keys exist and are not empty placeholders
  if (
    !apiKey ||
    !authDomain ||
    !projectId ||
    !storageBucket ||
    !messagingSenderId ||
    !appId ||
    apiKey.includes('YOUR_') ||
    projectId.includes('YOUR_')
  ) {
    return null;
  }

  const clientConfig: FirebaseClientConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
  };

  // VITE_FIREBASE_MEASUREMENT_ID is strictly optional (Google Analytics is OFF)
  if (measurementId) {
    clientConfig.measurementId = measurementId;
  }

  if (firestoreDatabaseId) {
    clientConfig.firestoreDatabaseId = firestoreDatabaseId;
  }

  return clientConfig;
}

export function getFirebaseConfigStatus(): FirebaseConfigStatus {
  const config = getFirebaseConfig();

  if (!config) {
    const missingKeys: string[] = [];
    if (!import.meta.env.VITE_FIREBASE_API_KEY && !firebaseAppletConfig?.apiKey) missingKeys.push('VITE_FIREBASE_API_KEY');
    if (!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN && !firebaseAppletConfig?.authDomain) missingKeys.push('VITE_FIREBASE_AUTH_DOMAIN');
    if (!import.meta.env.VITE_FIREBASE_PROJECT_ID && !firebaseAppletConfig?.projectId) missingKeys.push('VITE_FIREBASE_PROJECT_ID');
    if (!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET && !firebaseAppletConfig?.storageBucket) missingKeys.push('VITE_FIREBASE_STORAGE_BUCKET');
    if (!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID && !firebaseAppletConfig?.messagingSenderId) missingKeys.push('VITE_FIREBASE_MESSAGING_SENDER_ID');
    if (!import.meta.env.VITE_FIREBASE_APP_ID && !firebaseAppletConfig?.appId) missingKeys.push('VITE_FIREBASE_APP_ID');

    const targetProject = import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() || firebaseAppletConfig?.projectId || 'anandh-jain-pujari';
    return {
      isConfigured: false,
      missingKeys,
      projectId: targetProject || undefined,
      message: targetProject
        ? `Target Project: ${targetProject} (Web App credentials pending)`
        : 'Firebase connection required',
    };
  }

  return {
    isConfigured: true,
    missingKeys: [],
    projectId: config.projectId,
    databaseId: config.firestoreDatabaseId || '(default)',
    message: `Connected to Firebase project: ${config.projectId}`,
  };
}
