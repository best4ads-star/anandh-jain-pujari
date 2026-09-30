import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Landmark,
  Scroll,
  Camera,
  FolderGit2,
  FileText,
  Sparkles,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../services/firebase/AuthContext';

interface AdminLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export function AdminLayout({ currentPath, onNavigate, children }: AdminLayoutProps) {
  const { user, adminProfile, isSuperAdmin, isFirebaseConfigured, configStatus, logout } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Blog Posts', path: '/admin/blog', icon: BookOpen },
    { label: 'Temples', path: '/admin/temples', icon: Landmark },
    { label: 'Heritage', path: '/admin/heritage', icon: Scroll },
    { label: 'Photography', path: '/admin/photography', icon: Camera },
    { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { label: 'Pages', path: '/admin/pages', icon: FileText },
    { label: 'Hero Settings', path: '/admin/hero', icon: Sparkles },
    { label: 'Media Storage', path: '/admin/media', icon: ImageIcon },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F4EFE6] dark:bg-[#0A111C] text-[#142033] dark:text-[#F8F5EE] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#EAE2D2] dark:bg-[#0E1724] border-r border-[#DACDB7] dark:border-[#1E2E44] flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-5 border-b border-[#DACDB7] dark:border-[#1E2E44]">
          <div className="font-playfair font-bold text-lg text-[#142033] dark:text-[#F8F5EE] leading-tight">
            Anandh Jain Pujari
          </div>
          <div className="text-[10px] font-mono tracking-widest uppercase text-[#B58A3C] font-semibold mt-0.5">
            CMS ADMIN PORTAL
          </div>
        </div>

        {/* Firebase Connection Status Banner */}
        <div className="p-3 mx-3 mt-3 rounded-xs border text-xs font-mono">
          {isFirebaseConfigured ? (
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-2xs border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <div className="truncate">
                <span className="font-bold">Firebase Active</span>
                <div className="text-[10px] truncate opacity-80">{configStatus.projectId}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-2xs border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Firebase connection required</span>
                <span className="text-[10px] opacity-80 leading-snug block">Local fallback active</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xs text-xs font-medium tracking-wide transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#142033] text-[#F8F5EE] dark:bg-[#B58A3C] dark:text-[#0B131E] font-semibold'
                    : 'text-[#5F6470] dark:text-[#CBD5E1] hover:bg-[#DDD2C0] dark:hover:bg-[#182638] hover:text-[#142033] dark:hover:text-[#F8F5EE]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Info & Actions */}
        <div className="p-4 border-t border-[#DACDB7] dark:border-[#1E2E44] space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#B58A3C] text-white flex items-center justify-center font-bold text-xs">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-semibold truncate text-[#142033] dark:text-[#F8F5EE]">
                {adminProfile?.displayName || user?.email || 'Admin User'}
              </div>
              <div className="text-[10px] font-mono text-[#B58A3C] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>{adminProfile?.role || (isSuperAdmin ? 'superadmin' : 'unassigned')}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xs border border-[#C5B8A2] dark:border-[#2C415C] text-[11px] font-medium text-[#5F6470] dark:text-[#CBD5E1] hover:text-[#142033] hover:bg-[#DDD2C0] transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Public Site</span>
            </button>
            <button
              onClick={async () => {
                await logout();
                onNavigate('/admin/login');
              }}
              className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-xs border border-red-200 dark:border-red-900/60 text-[11px] font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-[#EDE5D6] dark:bg-[#0E1724] border-b border-[#DACDB7] dark:border-[#1E2E44] px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#718096] dark:text-[#94A3B8]">
              Admin
            </span>
            <span className="text-xs text-[#A0AEC0]">/</span>
            <span className="text-xs font-semibold text-[#142033] dark:text-[#F8F5EE] capitalize">
              {currentPath.replace('/admin/', '').replace('/admin', 'Overview')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-[11px] font-mono text-[#718096] dark:text-[#94A3B8]">
              Role: <span className="text-[#B58A3C] font-semibold">{adminProfile?.role || (isSuperAdmin ? 'superadmin' : 'unassigned')}</span>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
