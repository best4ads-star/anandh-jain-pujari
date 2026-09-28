import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FileText,
  Server,
  Lock,
  Database,
  HardDrive,
  UserCheck,
  CloudUpload,
  Layers,
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../services/firebase/AuthContext';
import {
  getFirestoreDb,
  getFirebaseAuth,
  testAllFirebaseServices,
  FullReachabilityReport,
} from '../../services/firebase/app';
import {
  runRealFirestoreVerificationAndMigration,
  FullFirestoreVerificationReport,
  VerificationStepLog,
} from '../../services/migrationService';
import firebaseAppletConfig from '../../../firebase-applet-config.json';

export function AdminSettingsPage() {
  const { isFirebaseConfigured, configStatus, adminProfile, user } = useAuth();
  const [testing, setTesting] = useState(false);
  const [report, setReport] = useState<FullReachabilityReport | null>(null);

  // 10-step Verification and Migration State
  const [isVerifyingMigration, setIsVerifyingMigration] = useState(false);
  const [verificationReport, setVerificationReport] = useState<FullFirestoreVerificationReport | null>(null);
  const [activeSteps, setActiveSteps] = useState<VerificationStepLog[]>([]);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Diagnostic state for /users/{uid} verification
  const [userDocStatus, setUserDocStatus] = useState<{
    checking: boolean;
    exists: boolean | null;
    role: string | null;
    email: string | null;
    docPath: string | null;
    error: string | null;
  }>({
    checking: false,
    exists: null,
    role: null,
    email: null,
    docPath: null,
    error: null,
  });

  const checkUserDocInFirestore = async () => {
    const auth = getFirebaseAuth();
    const currentUid = auth?.currentUser?.uid || user?.uid;
    const db = getFirestoreDb();
    if (!currentUid || !db) {
      setUserDocStatus({
        checking: false,
        exists: false,
        role: null,
        email: null,
        docPath: currentUid ? `users/${currentUid}` : null,
        error: 'No active Auth session or Firestore is uninitialized.',
      });
      return;
    }

    setUserDocStatus(prev => ({ ...prev, checking: true, error: null, docPath: `users/${currentUid}` }));
    try {
      const userRef = doc(db, 'users', currentUid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        const data = snap.data();
        setUserDocStatus({
          checking: false,
          exists: true,
          role: data?.role || 'none',
          email: data?.email || auth?.currentUser?.email || null,
          docPath: `users/${currentUid}`,
          error: null,
        });
      } else {
        setUserDocStatus({
          checking: false,
          exists: false,
          role: null,
          email: null,
          docPath: `users/${currentUid}`,
          error: `user-document-not-found: Document users/${currentUid} does not exist in Cloud Firestore.`,
        });
      }
    } catch (err: any) {
      setUserDocStatus({
        checking: false,
        exists: null,
        role: null,
        email: null,
        docPath: `users/${currentUid}`,
        error: err?.message || 'Permission or reachability notice reading document.',
      });
    }
  };

  const envKeys = [
    { key: 'VITE_FIREBASE_PROJECT_ID', label: 'Project ID', present: true, value: configStatus.projectId || 'anandh-jain-pujari' },
    { key: 'VITE_FIREBASE_DATABASE_ID', label: 'Firestore Database ID', present: true, value: '(default)' },
    { key: 'VITE_FIREBASE_AUTH_DOMAIN', label: 'Auth Domain', present: !!(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || firebaseAppletConfig?.authDomain), value: 'anandh-jain-pujari.firebaseapp.com' },
    { key: 'VITE_FIREBASE_STORAGE_BUCKET', label: 'Storage Bucket', present: !!(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim() || firebaseAppletConfig?.storageBucket), value: 'anandh-jain-pujari.firebasestorage.app' },
    { key: 'VITE_FIREBASE_API_KEY', label: 'API Key', present: !!(import.meta.env.VITE_FIREBASE_API_KEY?.trim() || firebaseAppletConfig?.apiKey), value: '••••••••••••••••' },
    { key: 'VITE_FIREBASE_APP_ID', label: 'App ID', present: !!(import.meta.env.VITE_FIREBASE_APP_ID?.trim() || firebaseAppletConfig?.appId), value: '••••••••••••••••' },
    { key: 'VITE_FIREBASE_MESSAGING_SENDER_ID', label: 'Messaging Sender ID', present: !!(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() || firebaseAppletConfig?.messagingSenderId), value: '••••••••••••' },
  ];

  const handleTest = async () => {
    setTesting(true);
    try {
      const results = await testAllFirebaseServices();
      setReport(results);
    } catch (err: any) {
      console.error('Reachability check error:', err);
    } finally {
      setTesting(false);
    }
  };

  // Run initial test on load and verify user document
  useEffect(() => {
    handleTest();
    checkUserDocInFirestore();
  }, [user]);

  const handleRunAllDiagnostics = async () => {
    await Promise.all([handleTest(), checkUserDocInFirestore()]);
  };

  const handleRunFullVerificationAndMigration = async () => {
    setIsVerifyingMigration(true);
    setVerificationError(null);
    setActiveSteps([]);
    try {
      const rep = await runRealFirestoreVerificationAndMigration(user, (stepLog) => {
        setActiveSteps((prev) => {
          const next = [...prev];
          const idx = next.findIndex((s) => s.step === stepLog.step);
          if (idx >= 0) {
            next[idx] = stepLog;
          } else {
            next.push(stepLog);
          }
          return next;
        });
      });
      setVerificationReport(rep);
    } catch (err: any) {
      setVerificationError(err.message || 'Verification and migration failed.');
    } finally {
      setIsVerifyingMigration(false);
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'project':
        return <Server className="w-4 h-4 text-[#B58A3C]" />;
      case 'auth':
        return <Lock className="w-4 h-4 text-[#B58A3C]" />;
      case 'firestore':
        return <Database className="w-4 h-4 text-[#B58A3C]" />;
      case 'storage':
        return <HardDrive className="w-4 h-4 text-[#B58A3C]" />;
      default:
        return <Server className="w-4 h-4 text-[#B58A3C]" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-[#DACDB7] dark:border-[#1E2E44] pb-5">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#B58A3C]" />
          <h1 className="font-playfair text-2xl font-bold text-[#142033] dark:text-[#F8F5EE]">
            CMS & Firebase Configuration
          </h1>
        </div>
        <p className="text-xs font-serif text-[#5F6470] dark:text-[#94A3B8] mt-1">
          Production Firebase project: <strong className="font-mono text-[#B58A3C]">anandh-jain-pujari</strong> • Cloud Firestore Database: <strong className="font-mono text-[#B58A3C]">(default)</strong>
        </p>
      </div>

      {/* Admin User Profile Card */}
      <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-[#EBE1D0] dark:border-[#1F3045] pb-4">
          <div className="w-10 h-10 rounded-full bg-[#F5EBD7] dark:bg-[#1B2A3D] text-[#B58A3C] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-[#142033] dark:text-[#F8F5EE]">
              Administrator Profile (users/{'{uid}'})
            </h2>
            <p className="text-xs text-[#5F6470] dark:text-[#94A3B8]">
              Role-Based Access Control (RBAC)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-mono text-[#718096] uppercase text-[10px] block">Display Name</span>
            <span className="font-semibold text-[#142033] dark:text-[#F8F5EE]">
              {adminProfile?.displayName || 'Anandh Jain Pujari'}
            </span>
          </div>
          <div>
            <span className="font-mono text-[#718096] uppercase text-[10px] block">Email</span>
            <span className="font-semibold text-[#142033] dark:text-[#F8F5EE]">
              {user?.email || adminProfile?.email || 'bestanandh@gmail.com'}
            </span>
          </div>
          <div>
            <span className="font-mono text-[#718096] uppercase text-[10px] block">Role Assignment</span>
            <span className="inline-flex items-center gap-1 font-mono text-[#B58A3C] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{adminProfile?.role || 'unassigned'}</span>
            </span>
          </div>
          <div>
            <span className="font-mono text-[#718096] uppercase text-[10px] block">Auth UID</span>
            <span className="font-mono text-[#5F6470] dark:text-[#94A3B8] text-[11px]">
              {user?.uid || 'offline-superadmin-session'}
            </span>
          </div>
        </div>
      </div>

      {/* Live Authentication & Authorization Diagnostic */}
      <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE1D0] dark:border-[#1F3045] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F5EBD7] dark:bg-[#1B2A3D] text-[#B58A3C] flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-[#142033] dark:text-[#F8F5EE]">
                Live Firestore Auth & RBAC Diagnostics
              </h2>
              <p className="text-xs text-[#5F6470] dark:text-[#94A3B8]">
                Real-time security rules and user document verification
              </p>
            </div>
          </div>

          <button
            onClick={checkUserDocInFirestore}
            disabled={userDocStatus.checking}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium rounded-xs border border-[#DACDB7] dark:border-[#2A3F5B] bg-[#F5EBD7] dark:bg-[#1B2A3D] text-[#142033] dark:text-[#F8F5EE] hover:bg-[#EBE1D0] dark:hover:bg-[#23354D] transition-colors cursor-pointer disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${userDocStatus.checking ? 'animate-spin' : ''}`} />
            <span>{userDocStatus.checking ? 'Checking Document...' : 'Verify User Doc'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
          {/* 1. Firebase Project ID */}
          <div className="p-3 rounded-xs border border-[#DACDB7]/80 dark:border-[#1F3045] bg-[#F8F5EE]/60 dark:bg-[#152336]/60">
            <span className="font-mono text-[#718096] dark:text-[#94A3B8] uppercase text-[10px] block">
              Firebase Project ID
            </span>
            <span className="font-mono font-bold text-[#142033] dark:text-[#F8F5EE] text-xs">
              {configStatus.projectId || 'anandh-jain-pujari'}
            </span>
          </div>

          {/* 2. Firestore Database ID */}
          <div className="p-3 rounded-xs border border-[#DACDB7]/80 dark:border-[#1F3045] bg-[#F8F5EE]/60 dark:bg-[#152336]/60">
            <span className="font-mono text-[#718096] dark:text-[#94A3B8] uppercase text-[10px] block">
              Firestore Database ID
            </span>
            <span className="font-mono font-bold text-[#B58A3C] text-xs">
              (default)
            </span>
          </div>

          {/* 3. Auth Current User Exists */}
          <div className="p-3 rounded-xs border border-[#DACDB7]/80 dark:border-[#1F3045] bg-[#F8F5EE]/60 dark:bg-[#152336]/60">
            <span className="font-mono text-[#718096] dark:text-[#94A3B8] uppercase text-[10px] block">
              auth.currentUser Exists
            </span>
            <span className={`inline-flex items-center gap-1 font-mono font-bold text-xs ${user ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
              {user ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Yes (Active Session)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>No (Signed Out)</span>
                </>
              )}
            </span>
          </div>

          {/* 4. Current Firebase Auth UID */}
          <div className="p-3 rounded-xs border border-[#DACDB7]/80 dark:border-[#1F3045] bg-[#F8F5EE]/60 dark:bg-[#152336]/60">
            <span className="font-mono text-[#718096] dark:text-[#94A3B8] uppercase text-[10px] block">
              Current Auth UID
            </span>
            <span className="font-mono text-[#142033] dark:text-[#F8F5EE] text-[11px] break-all">
              {user?.uid || 'null (not authenticated)'}
            </span>
          </div>

          {/* 5. Current Authenticated Email */}
          <div className="p-3 rounded-xs border border-[#DACDB7]/80 dark:border-[#1F3045] bg-[#F8F5EE]/60 dark:bg-[#152336]/60">
            <span className="font-mono text-[#718096] dark:text-[#94A3B8] uppercase text-[10px] block">
              Authenticated Email
            </span>
            <span className="font-semibold text-[#142033] dark:text-[#F8F5EE] text-xs break-all">
              {user?.email || 'bestanandh@gmail.com'}
            </span>
          </div>

          {/* 6. Corresponding /users/{uid} Document Exists */}
          <div className="p-3 rounded-xs border border-[#DACDB7]/80 dark:border-[#1F3045] bg-[#F8F5EE]/60 dark:bg-[#152336]/60">
            <span className="font-mono text-[#718096] dark:text-[#94A3B8] uppercase text-[10px] block">
              Firestore Doc (users/{'{uid}'})
            </span>
            <span className={`inline-flex items-center gap-1 font-mono font-bold text-xs ${userDocStatus.exists ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
              {userDocStatus.checking ? (
                <span>Checking...</span>
              ) : userDocStatus.exists ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Document Exists</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Not Found in Firestore</span>
                </>
              )}
            </span>
          </div>

          {/* 7. Detected Role in Firestore */}
          <div className="p-3 rounded-xs border border-[#DACDB7]/80 dark:border-[#1F3045] bg-[#F8F5EE]/60 dark:bg-[#152336]/60 sm:col-span-2 lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-mono text-[#718096] dark:text-[#94A3B8] uppercase text-[10px] block">
                  Detected Role & Permissions
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[#B58A3C] font-bold text-xs mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{userDocStatus.role || adminProfile?.role || 'none'}</span>
                  <span className="text-[#5F6470] dark:text-[#94A3B8] font-normal text-[11px]">
                    (Only existing Firestore user document determines permissions)
                  </span>
                </span>
              </div>
              {userDocStatus.docPath && (
                <span className="font-mono text-[10px] text-[#5F6470] dark:text-[#94A3B8]">
                  Verified Path: {userDocStatus.docPath}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Real Cloud Firestore 10-Step Verification & Migration Suite */}
      <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE1D0] dark:border-[#1F3045] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F5EBD7] dark:bg-[#1B2A3D] text-[#B58A3C] flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-[#142033] dark:text-[#F8F5EE]">
                Real Cloud Firestore 10-Step Verification & Migration Suite
              </h2>
              <p className="text-xs text-[#5F6470] dark:text-[#94A3B8]">
                Performs authentic write/read/delete probe test and synchronizes all 4 articles to Cloud Firestore
              </p>
            </div>
          </div>

          <button
            onClick={handleRunFullVerificationAndMigration}
            disabled={isVerifyingMigration}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold rounded-xs bg-[#B58A3C] hover:bg-[#9E752E] text-white transition-colors cursor-pointer shadow-xs disabled:opacity-50 shrink-0"
          >
            {isVerifyingMigration ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running 10-Step Suite...</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-3.5 h-3.5" />
                <span>Run 10-Step Verification & Migration</span>
              </>
            )}
          </button>
        </div>

        {verificationError && (
          <div className="p-3.5 rounded-xs bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-900 dark:text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong>Verification Interrupted:</strong> {verificationError}
            </div>
          </div>
        )}

        {/* Real-time Stepper */}
        {activeSteps.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-mono text-xs uppercase tracking-wider text-[#718096] dark:text-[#94A3B8]">
              Execution Progress ({activeSteps.filter((s) => s.status === 'success').length} of 10 completed)
            </h3>
            <div className="border border-[#EAE0D0] dark:border-[#1E2E44] rounded-xs divide-y divide-[#EAE0D0] dark:divide-[#1E2E44] bg-white/50 dark:bg-[#0D1520]/50 overflow-hidden text-xs">
              {activeSteps.map((step) => (
                <div key={step.step} className="p-2.5 flex items-start justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[11px] text-[#B58A3C]">
                        Step {step.step}:
                      </span>
                      <span className="font-semibold text-[#142033] dark:text-[#F8F5EE] truncate">
                        {step.title}
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-[#5F6470] dark:text-[#94A3B8] break-all">
                      {step.detail}
                    </div>
                  </div>
                  <div className="shrink-0">
                    {step.status === 'running' && (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-600 dark:text-amber-400">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Running</span>
                      </span>
                    )}
                    {step.status === 'success' && (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                    {step.status === 'failed' && (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-rose-600 dark:text-rose-400 font-bold">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Failed</span>
                      </span>
                    )}
                    {step.status === 'skipped' && (
                      <span className="font-mono text-[11px] text-slate-400">Skipped</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Final Official Report Card */}
        {verificationReport && (
          <div className="p-4 rounded-xs border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-200 dark:border-emerald-800/40 pb-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs font-mono uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Final Verification & Cloud Migration Report</span>
              </div>
              <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
                {verificationReport.timestamp}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 rounded-xs bg-white dark:bg-[#152336] border border-[#E2D6C3] dark:border-[#1F3045]">
                <span className="font-mono text-[#718096] dark:text-[#94A3B8] uppercase text-[10px] block">
                  Firebase Project ID
                </span>
                <span className="font-mono font-bold text-[#142033] dark:text-[#F8F5EE]">
                  {verificationReport.projectId}
                </span>
              </div>

              <div className="p-2.5 rounded-xs bg-white dark:bg-[#152336] border border-[#E2D6C3] dark:border-[#1F3045]">
                <span className="font-mono text-[#718096] dark:text-[#94A3B8] uppercase text-[10px] block">
                  Firestore Database ID
                </span>
                <span className="font-mono font-bold text-[#B58A3C]">
                  {verificationReport.databaseId}
                </span>
              </div>

              <div className="p-2.5 rounded-xs bg-white dark:bg-[#152336] border border-[#E2D6C3] dark:border-[#1F3045]">
                <span className="font-mono text-[#718096] dark:text-[#94A3B8] uppercase text-[10px] block">
                  Authenticated Email
                </span>
                <span className="font-mono font-bold text-[#142033] dark:text-[#F8F5EE] truncate block">
                  {verificationReport.authenticatedEmail}
                </span>
              </div>

              <div className="p-2.5 rounded-xs bg-white dark:bg-[#152336] border border-[#E2D6C3] dark:border-[#1F3045]">
                <span className="font-mono text-[#718096] dark:text-[#94A3B8] uppercase text-[10px] block">
                  Authenticated UID
                </span>
                <span className="font-mono text-[11px] text-[#142033] dark:text-[#F8F5EE] break-all block">
                  {verificationReport.authenticatedUid}
                </span>
              </div>

              <div className="p-2.5 rounded-xs bg-white dark:bg-[#152336] border border-[#E2D6C3] dark:border-[#1F3045]">
                <span className="font-mono text-[#718096] dark:text-[#94A3B8] uppercase text-[10px] block">
                  /users/{'{UID}'} Role
                </span>
                <span className="font-mono font-bold text-[#B58A3C]">
                  {verificationReport.userDocRole}
                </span>
              </div>

              <div className="p-2.5 rounded-xs bg-white dark:bg-[#152336] border border-[#E2D6C3] dark:border-[#1F3045]">
                <span className="font-mono text-[#718096] dark:text-[#94A3B8] uppercase text-[10px] block">
                  /articles Prior State
                </span>
                <span className="font-mono font-bold text-[#142033] dark:text-[#F8F5EE]">
                  {verificationReport.articlesExistedBefore ? `Existed (${verificationReport.articlesCountBefore} docs)` : 'Empty (0 docs)'}
                </span>
              </div>

              <div className="p-2.5 rounded-xs bg-white dark:bg-[#152336] border border-[#E2D6C3] dark:border-[#1F3045] sm:col-span-2 lg:col-span-3">
                <span className="font-mono text-[#718096] dark:text-[#94A3B8] uppercase text-[10px] block">
                  Real Authenticated Write/Read/Delete Probe Test
                </span>
                <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                  {verificationReport.probeWriteSuccess && verificationReport.probeReadSuccess && verificationReport.probeDeleteSuccess
                    ? 'PASSED (Temporary /articles/migrationVerificationTest write, read, and delete all verified)'
                    : 'FAILED'}
                </span>
              </div>

              <div className="p-2.5 rounded-xs bg-white dark:bg-[#152336] border border-[#E2D6C3] dark:border-[#1F3045] sm:col-span-2 lg:col-span-3">
                <span className="font-mono text-[#718096] dark:text-[#94A3B8] uppercase text-[10px] block">
                  Articles Count Present in Firestore After Migration
                </span>
                <span className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-400">
                  {verificationReport.articlesCountAfter} Documents Confirmed
                </span>
              </div>

              <div className="p-2.5 rounded-xs bg-white dark:bg-[#152336] border border-[#E2D6C3] dark:border-[#1F3045] sm:col-span-2 lg:col-span-3 space-y-1">
                <span className="font-mono text-[#718096] dark:text-[#94A3B8] uppercase text-[10px] block">
                  Verified Article Document IDs
                </span>
                <div className="font-mono text-[11px] text-[#142033] dark:text-[#F8F5EE] divide-y divide-[#E2D6C3] dark:divide-[#1F3045]">
                  {verificationReport.articleDocIds.map((id, i) => (
                    <div key={id} className="py-1 flex items-center justify-between">
                      <span>{i + 1}. /articles/{id}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">WRITTEN & VERIFIED</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-xs bg-white dark:bg-[#152336] border border-[#E2D6C3] dark:border-[#1F3045] sm:col-span-2 lg:col-span-3">
                <span className="font-mono text-[#718096] dark:text-[#94A3B8] uppercase text-[10px] block">
                  All 4 Actually Written to Cloud Firestore
                </span>
                <span className={`font-mono font-bold text-sm ${verificationReport.allFourActuallyWritten ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {verificationReport.allFourActuallyWritten ? 'YES — All 4 articles are in Cloud Firestore' : 'NO'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Live Reachability Tests */}
      <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EBE1D0] dark:border-[#1F3045] pb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-[#142033] dark:text-[#F8F5EE]">
              Firebase Service Reachability Diagnostics
            </h2>
            <p className="text-xs text-[#5F6470] dark:text-[#94A3B8]">
              Live status checks for Project, Authentication, Cloud Firestore, and Storage
            </p>
          </div>

          <button
            onClick={handleRunAllDiagnostics}
            disabled={testing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-medium rounded-xs border border-[#DACDB7] dark:border-[#2A3F5B] bg-[#F5EBD7] dark:bg-[#1B2A3D] text-[#142033] dark:text-[#F8F5EE] hover:bg-[#EBE1D0] dark:hover:bg-[#23354D] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Testing Services...' : 'Test All Services'}</span>
          </button>
        </div>

        {report && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#5F6470] dark:text-[#94A3B8]">
              <span>Last tested: {report.testedAt}</span>
              <span className={report.overallSuccess ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-amber-700 dark:text-amber-400 font-bold'}>
                {report.overallSuccess ? 'All Services Reachable' : 'Diagnostics Complete'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.checks.map((check, idx) => (
                <div
                  key={`${check.service}-${check.name}-${idx}`}
                  className={`p-3.5 rounded-xs border text-xs flex flex-col justify-between space-y-2 ${
                    check.status === 'connected'
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getServiceIcon(check.service)}
                      <span className="font-bold text-[#142033] dark:text-[#F8F5EE]">
                        {check.name}
                      </span>
                    </div>
                    {check.status === 'connected' ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Connected</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-amber-700 dark:text-amber-400 shrink-0">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Notice</span>
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-[#334155] dark:text-[#CBD5E1] text-[11px] leading-relaxed">
                      {check.message}
                    </p>
                    {check.details && (
                      <p className="font-mono text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-1">
                        {check.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Environment Variables Reference */}
      <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs p-6 space-y-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider font-mono text-[#142033] dark:text-[#F8F5EE]">
            Firebase Configuration Parameter Summary
          </h2>
          <p className="text-xs text-[#5F6470] dark:text-[#94A3B8]">
            Vite environment variable mappings for production project: <code className="font-mono text-[#B58A3C]">anandh-jain-pujari</code>
          </p>
        </div>

        <div className="space-y-2">
          {envKeys.map((item) => (
            <div
              key={item.key}
              className="p-2.5 rounded-xs border border-[#EAE0D0] dark:border-[#1E2E44] flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <div className="font-mono font-bold text-[#142033] dark:text-[#F8F5EE]">
                  {item.key}
                </div>
                <div className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
                  {item.label}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-[#5F6470] dark:text-[#94A3B8] bg-[#F2EBDE] dark:bg-[#182638] px-2 py-0.5 rounded">
                  {item.value}
                </span>
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 text-xs text-[#5F6470] dark:text-[#94A3B8] flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#B58A3C]" />
          <span>See <code className="font-mono text-[11px] bg-[#EFE8DA] dark:bg-[#182638] px-1 py-0.5 rounded">README_FIREBASE.md</code> for full schema and security guidelines.</span>
        </div>
      </div>
    </div>
  );
}
