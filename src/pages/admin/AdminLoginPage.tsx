import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, ArrowLeft, AlertTriangle, CheckCircle2, Key, Info, Send } from 'lucide-react';
import { useAuth } from '../../services/firebase/AuthContext';
import { sendAdminPasswordReset } from '../../services/firebase/auth';

interface AdminLoginPageProps {
  onNavigateHome: () => void;
  onNavigateAdmin: () => void;
}

export function AdminLoginPage({ onNavigateHome, onNavigateAdmin }: AdminLoginPageProps) {
  const { login, isFirebaseConfigured, configStatus, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('bestanandh@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfigHelp, setShowConfigHelp] = useState(false);

  // If already logged in, allow instant direct navigation
  if (isAuthenticated) {
    onNavigateAdmin();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResetSuccess(null);

    if (!isFirebaseConfigured) {
      setError('Firebase connection required. Please provide Firebase environment variables in .env before logging in.');
      return;
    }

    if (!email || !password) {
      setError('Please enter both your administrator email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      onNavigateAdmin();
    } catch (err: any) {
      console.error('Login error:', err);
      const code = err?.code || '';
      const msg = err?.message || '';

      if (
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential' ||
        msg.includes('invalid-credential')
      ) {
        setError('Invalid credentials. Please verify your administrator password or send a password reset link below.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please wait a moment and try again.');
      } else {
        setError(msg || 'Authentication failed. Please verify your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address to receive a password reset link.');
      return;
    }
    setIsResetting(true);
    setError(null);
    setResetSuccess(null);
    try {
      await sendAdminPasswordReset(email);
      setResetSuccess(`Password reset email sent to ${email}. Please check your inbox.`);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err?.message || 'Failed to send password reset email.');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] dark:bg-[#0B131E] text-[#142033] dark:text-[#F8F5EE] flex flex-col justify-center items-center p-4 sm:p-6 transition-colors">
      {/* Back to public site */}
      <button
        onClick={onNavigateHome}
        className="fixed top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5F6470] dark:text-[#94A3B8] hover:text-[#B58A3C] transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Website</span>
      </button>

      <div className="w-full max-w-md bg-[#FCFAF6] dark:bg-[#121D2C] border border-[#E0D4C0] dark:border-[#223348] rounded-sm p-6 sm:p-8 shadow-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#F5EBD7] dark:bg-[#2C2415] text-[#B58A3C] flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-[#142033] dark:text-[#F8F5EE]">
            Admin CMS Authentication
          </h1>
          <p className="text-xs font-serif text-[#5F6470] dark:text-[#94A3B8] mt-1">
            Anandh Jain Pujari • Sacred Heritage Content Platform
          </p>
        </div>

        {/* Firebase Connection Status Banner */}
        <div className="mb-6">
          {isFirebaseConfigured ? (
            <div className="p-3 rounded-xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-mono">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <div className="truncate">
                <span className="font-bold">Firebase Backend Connected</span>
                <div className="text-[10px] opacity-80 truncate">{configStatus.projectId}</div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xs bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <div className="font-bold font-mono uppercase tracking-wider text-[11px] text-amber-800 dark:text-amber-300">
                    Firebase connection required
                  </div>
                  <p className="text-[11px] font-sans mt-0.5 text-amber-800/90 dark:text-amber-300/90 leading-snug">
                    Backend credentials have not been configured yet. In accordance with security mandates, no fake API keys or hard-coded passwords exist.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowConfigHelp(!showConfigHelp)}
                className="mt-2 text-[11px] font-mono text-[#B58A3C] underline cursor-pointer flex items-center gap-1"
              >
                <Info className="w-3 h-3" />
                <span>{showConfigHelp ? 'Hide instructions' : 'How to configure Firebase?'}</span>
              </button>

              {showConfigHelp && (
                <div className="mt-2.5 pt-2.5 border-t border-amber-200 dark:border-amber-800 text-[10.5px] font-mono space-y-1 text-[#5F6470] dark:text-[#CBD5E1]">
                  <p>1. Open your Firebase Project Console</p>
                  <p>2. Enable Email/Password in Authentication</p>
                  <p>3. Create initial superadmin user</p>
                  <p>4. Add web app config to <code className="bg-[#EFE8DA] dark:bg-[#182436] px-1 py-0.5 rounded">.env</code> (see README_FIREBASE.md)</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Success / Info message */}
        {resetSuccess && (
          <div className="mb-4 p-3 rounded-xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
            <span>{resetSuccess}</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xs bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#5F6470] dark:text-[#94A3B8] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#718096]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xs border border-[#D8CCB8] dark:border-[#2C3F58] bg-[#F9F6F0] dark:bg-[#152234] text-[#142033] dark:text-[#F8F5EE] focus:outline-none focus:border-[#B58A3C]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-[#5F6470] dark:text-[#94A3B8]">
                Password
              </label>
              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={isResetting || !isFirebaseConfigured}
                className="text-[11px] font-mono text-[#B58A3C] hover:underline cursor-pointer disabled:opacity-50"
              >
                {isResetting ? 'Sending link...' : 'Forgot password?'}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#718096]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xs border border-[#D8CCB8] dark:border-[#2C3F58] bg-[#F9F6F0] dark:bg-[#152234] text-[#142033] dark:text-[#F8F5EE] focus:outline-none focus:border-[#B58A3C]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isFirebaseConfigured}
            className={`w-full py-2.5 px-4 rounded-xs text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              isFirebaseConfigured
                ? 'bg-[#142033] dark:bg-[#B58A3C] text-[#F8F5EE] dark:text-[#0B131E] hover:bg-[#1E2E44]'
                : 'bg-[#DCD3C3] dark:bg-[#1E2E44] text-[#8C8476] dark:text-[#64748B] cursor-not-allowed'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Admin CMS'}</span>
          </button>
        </form>

        {/* Notice for preview inspection */}
        {!isFirebaseConfigured && (
          <div className="mt-6 pt-4 border-t border-[#EAE0D0] dark:border-[#1F3045] text-center">
            <p className="text-[11px] text-[#718096] dark:text-[#94A3B8] mb-2">
              Preview Mode Notice: To test or inspect CMS layout before adding live Firebase credentials:
            </p>
            <button
              onClick={onNavigateAdmin}
              className="text-xs font-mono font-semibold text-[#B58A3C] hover:underline cursor-pointer inline-flex items-center gap-1"
            >
              <span>Explore Admin Interface (Offline Preview Mode)</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
