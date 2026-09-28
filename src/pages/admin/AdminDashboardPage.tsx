import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Landmark,
  Scroll,
  Camera,
  FolderGit2,
  FileText,
  Sparkles,
  Image as ImageIcon,
  CheckCircle2,
  Plus,
  ArrowRight,
  Database,
  Calendar,
  Clock,
  User,
  Eye,
  FileEdit,
  CloudUpload,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../services/firebase/AuthContext';
import { COLLECTIONS } from '../../services/firestore/collections';
import { BlogPost } from '../../types';
import {
  getLocalArticles,
  subscribeToBlogUpdates,
} from '../../services/localBlogStorage';
import {
  syncLocalArticlesToFirestore,
  runRealFirestoreVerificationAndMigration,
  MigrationSummary,
  FullFirestoreVerificationReport,
  VerificationStepLog,
} from '../../services/migrationService';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const { adminProfile, isFirebaseConfigured, configStatus, user, isAuthenticated } = useAuth();
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationSummary, setMigrationSummary] = useState<MigrationSummary | null>(null);
  const [migrationError, setMigrationError] = useState<string | null>(null);

  const loadArticles = () => {
    const list = getLocalArticles({ includeDrafts: true });
    setArticles(list);
  };

  useEffect(() => {
    loadArticles();
    return subscribeToBlogUpdates(loadArticles);
  }, []);

  const [verificationReport, setVerificationReport] = useState<FullFirestoreVerificationReport | null>(null);
  const [activeSteps, setActiveSteps] = useState<VerificationStepLog[]>([]);

  const handleSyncToFirestore = async () => {
    if (isMigrating) return;
    setIsMigrating(true);
    setMigrationError(null);
    setMigrationSummary(null);
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
      setMigrationSummary({
        total: rep.articleDocIds.length,
        migrated: rep.migratedCount,
        failed: rep.failedCount,
        timestamp: rep.timestamp,
        results: rep.articleDocIds.map((id) => ({
          id,
          slug: id,
          title: id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          status: rep.allFourActuallyWritten ? 'success' : 'failed',
          message: rep.allFourActuallyWritten ? 'Synchronized to Cloud Firestore' : 'Failed writing to Firestore',
        })),
      });
    } catch (err: any) {
      setMigrationError(err.message || 'Synchronization failed. Ensure Firebase is configured.');
    } finally {
      setIsMigrating(false);
    }
  };

  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;
  const featuredCount = articles.filter((a) => a.featured).length;

  const collectionsList = [
    {
      id: COLLECTIONS.BLOG_POSTS,
      name: 'Blog Articles',
      path: '/admin/blog',
      desc: 'Articles, temple documentation, and heritage research',
      icon: BookOpen,
      count: articles.length,
      unit: 'articles',
      highlight: true,
    },
    {
      id: COLLECTIONS.TEMPLES,
      name: 'Temples',
      path: '/admin/temples',
      desc: 'Sacred Jain temples in Kongu Nadu and Tamil Nadu',
      icon: Landmark,
      count: 4,
      unit: 'temples',
    },
    {
      id: COLLECTIONS.HERITAGE,
      name: 'Heritage',
      path: '/admin/heritage',
      desc: 'Inscriptions, epigraphy, and cultural records',
      icon: Scroll,
      count: 3,
      unit: 'records',
    },
    {
      id: COLLECTIONS.PHOTOGRAPHY,
      name: 'Photography',
      path: '/admin/photography',
      desc: 'Field photography archive of sacred sculptures and vimanas',
      icon: Camera,
      count: 12,
      unit: 'photos',
    },
    {
      id: COLLECTIONS.PROJECTS,
      name: 'Projects',
      path: '/admin/projects',
      desc: 'Preservation initiatives, audio guides & monographs',
      icon: FolderGit2,
      count: 4,
      unit: 'projects',
    },
    {
      id: COLLECTIONS.PAGES,
      name: 'Pages',
      path: '/admin/pages',
      desc: 'Editable static content (About, Mission, Contact)',
      icon: FileText,
      count: 3,
      unit: 'pages',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#EDE5D6] dark:bg-[#121D2C] border border-[#DACDB7] dark:border-[#1E2E44] rounded-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B58A3C]/15 text-[#8C6219] dark:text-[#E4C381] text-[11px] font-mono font-semibold uppercase tracking-wider mb-2 border border-[#B58A3C]/20">
            Anandh Jain Pujari CMS
          </div>
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#142033] dark:text-[#F8F5EE]">
            Welcome back, {adminProfile?.displayName || 'Anandh Jain Pujari'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5F6470] dark:text-[#94A3B8] mt-1 max-w-2xl font-serif">
            Manage your articles, field photography, temple archives, and digital publications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onNavigate('/admin/blog/new')}
            className="px-4 py-2 bg-[#B58A3C] hover:bg-[#9E752E] text-white rounded-xs text-xs font-semibold tracking-wide shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </button>
          <button
            onClick={() => onNavigate('/blog')}
            className="px-3.5 py-2 border border-[#C5B8A2] dark:border-[#2C415C] rounded-xs text-xs font-medium hover:bg-[#EFE8DA] dark:hover:bg-[#182638] text-[#142033] dark:text-[#F8F5EE] transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#718096]" />
            <span>View Public Site</span>
          </button>
        </div>
      </div>

      {/* Blog CMS Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#718096] dark:text-[#94A3B8]">
            Total Articles
          </div>
          <div className="text-2xl font-serif font-bold text-[#142033] dark:text-[#F8F5EE]">
            {articles.length}
          </div>
          <div className="text-[11px] text-[#5F6470] dark:text-[#94A3B8]">
            In local storage
          </div>
        </div>

        <div className="p-4 bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Published
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-700 dark:text-emerald-400">
            {publishedCount}
          </div>
          <div className="text-[11px] text-[#5F6470] dark:text-[#94A3B8]">
            Live on public blog
          </div>
        </div>

        <div className="p-4 bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400">
            Drafts
          </div>
          <div className="text-2xl font-serif font-bold text-amber-700 dark:text-amber-400">
            {draftCount}
          </div>
          <div className="text-[11px] text-[#5F6470] dark:text-[#94A3B8]">
            Unpublished work
          </div>
        </div>

        <div className="p-4 bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#8C6219] dark:text-[#E4C381]">
            Featured
          </div>
          <div className="text-2xl font-serif font-bold text-[#8C6219] dark:text-[#E4C381] flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-[#B58A3C]" />
            {featuredCount}
          </div>
          <div className="text-[11px] text-[#5F6470] dark:text-[#94A3B8]">
            Highlighted articles
          </div>
        </div>
      </div>

      {/* Migration to Cloud Firestore Card */}
      <div className="p-5 rounded-xs bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EBE1D0] dark:border-[#1F3045]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xs bg-[#F4ECD8] dark:bg-[#1B283A] text-[#B58A3C] flex items-center justify-center shrink-0">
              <CloudUpload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-[#142033] dark:text-[#F8F5EE] flex items-center gap-2">
                <span>Sync Local Articles to Cloud Firestore</span>
                {isFirebaseConfigured ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    <ShieldCheck className="w-3 h-3" />
                    Firebase Ready
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                    <Database className="w-3 h-3" />
                    Local Storage Mode
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#5F6470] dark:text-[#94A3B8] font-serif">
                Migrate your verified articles into Cloud Firestore with exact ID and URL slug preservation.
              </p>
            </div>
          </div>

          <button
            onClick={handleSyncToFirestore}
            disabled={isMigrating || !isFirebaseConfigured}
            className={`px-4 py-2 rounded-xs text-xs font-semibold tracking-wide transition-all inline-flex items-center gap-2 cursor-pointer shrink-0 ${
              isFirebaseConfigured
                ? 'bg-[#B58A3C] hover:bg-[#9E752E] text-white shadow-xs'
                : 'bg-[#EAE2D2] dark:bg-[#1E2E44] text-[#8C7E6A] dark:text-[#64748B] cursor-not-allowed opacity-80'
            }`}
          >
            {isMigrating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Migrating Articles...</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-3.5 h-3.5" />
                <span>Sync {articles.length} Local Articles to Firestore</span>
              </>
            )}
          </button>
        </div>

        {/* Informational Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xs bg-[#F4ECD8]/40 dark:bg-[#152336] border border-[#DACDB7]/60 dark:border-[#24354D] space-y-1">
            <span className="font-mono font-semibold uppercase text-[10px] text-[#8C6219] dark:text-[#E4C381]">
              Local Archive
            </span>
            <p className="text-[#142033] dark:text-[#F8F5EE]">
              <strong>{articles.length} articles</strong> ready to be transferred to Firestore collection.
            </p>
          </div>
          <div className="p-3 rounded-xs bg-[#F4ECD8]/40 dark:bg-[#152336] border border-[#DACDB7]/60 dark:border-[#24354D] space-y-1">
            <span className="font-mono font-semibold uppercase text-[10px] text-[#8C6219] dark:text-[#E4C381]">
              Preserved Fields
            </span>
            <p className="text-[#142033] dark:text-[#F8F5EE]">
              Preserves IDs, slugs, tags, dates, cover images, reading times, and full Markdown text.
            </p>
          </div>
          <div className="p-3 rounded-xs bg-[#F4ECD8]/40 dark:bg-[#152336] border border-[#DACDB7]/60 dark:border-[#24354D] space-y-1">
            <span className="font-mono font-semibold uppercase text-[10px] text-[#8C6219] dark:text-[#E4C381]">
              Safe Rollback
            </span>
            <p className="text-[#142033] dark:text-[#F8F5EE]">
              Local storage is never deleted; serves as continuous fallback in offline/preview environments.
            </p>
          </div>
        </div>

        {!isFirebaseConfigured && (
          <div className="p-3 rounded-xs bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <strong>Firebase connection required:</strong> To execute synchronization, configure the Firebase environment variables (<code className="font-mono text-[11px]">VITE_FIREBASE_*</code>). Once connected, click the sync button to push all local articles to Firestore.
            </div>
          </div>
        )}

        {migrationError && (
          <div className="p-3 rounded-xs bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-900 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <div>
              <strong>Migration error:</strong> {migrationError}
            </div>
          </div>
        )}

        {/* Migration Success/Failure Results Table */}
        {migrationSummary && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>
                  Migration Complete: {migrationSummary.migrated} of {migrationSummary.total} articles synchronized to Cloud Firestore.
                </span>
              </div>
              <span className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
                {migrationSummary.timestamp}
              </span>
            </div>

            <div className="border border-[#EBE1D0] dark:border-[#1F3045] rounded-xs divide-y divide-[#EBE1D0] dark:divide-[#1F3045] overflow-hidden">
              {migrationSummary.results.map((res) => (
                <div
                  key={res.id}
                  className="p-3 flex items-center justify-between gap-4 text-xs hover:bg-[#F9F5EC] dark:hover:bg-[#152336]"
                >
                  <div className="min-w-0">
                    <div className="font-serif font-bold text-[#142033] dark:text-[#F8F5EE] truncate">
                      {res.title}
                    </div>
                    <div className="text-[11px] font-mono text-[#718096] dark:text-[#94A3B8]">
                      ID: {res.id} • Slug: /{res.slug}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {res.status === 'success' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Synchronized</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        <span>{res.message}</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {verificationReport && (
              <div className="p-3.5 rounded-xs border border-emerald-300 dark:border-emerald-800 bg-white/70 dark:bg-[#152336] space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono text-[11px] text-emerald-800 dark:text-emerald-300 font-bold uppercase">
                  <span>Verified Cloud Firestore Write Status</span>
                  <span>Database: {verificationReport.databaseId}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-xs bg-[#F8F5EE] dark:bg-[#101A28]">
                    <span className="text-[#718096] block text-[10px]">PROJECT & DATABASE</span>
                    <span className="font-bold text-[#142033] dark:text-[#F8F5EE]">{verificationReport.projectId} / {verificationReport.databaseId}</span>
                  </div>
                  <div className="p-2 rounded-xs bg-[#F8F5EE] dark:bg-[#101A28]">
                    <span className="text-[#718096] block text-[10px]">AUTHENTICATED ADMIN</span>
                    <span className="font-bold text-[#142033] dark:text-[#F8F5EE] truncate block">{verificationReport.authenticatedEmail} ({verificationReport.userDocRole})</span>
                  </div>
                  <div className="p-2 rounded-xs bg-[#F8F5EE] dark:bg-[#101A28]">
                    <span className="text-[#718096] block text-[10px]">PROBE WRITE/READ/DELETE</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">PASSED (/articles/migrationVerificationTest)</span>
                  </div>
                  <div className="p-2 rounded-xs bg-[#F8F5EE] dark:bg-[#101A28]">
                    <span className="text-[#718096] block text-[10px]">TOTAL IN FIRESTORE NOW</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{verificationReport.articlesCountAfter} articles confirmed</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Persistence & Database Mode Notice */}
      {isFirebaseConfigured && isAuthenticated ? (
        <div className="p-4 rounded-xs bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3">
          <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1 text-[#142033] dark:text-[#F8F5EE]">
            <div className="font-bold font-mono uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Cloud Firestore Connected (Production: anandh-jain-pujari)
            </div>
            <p className="text-[#5F6470] dark:text-[#94A3B8] leading-relaxed">
              Authenticated user: {user?.email || 'admin'}. Articles can be synchronized directly to Cloud Firestore collection <strong className="font-mono text-emerald-700 dark:text-emerald-400">/articles</strong> with seamless offline localStorage fallback for rapid authoring and local backups.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xs bg-[#F4ECD8]/70 dark:bg-[#1A2534] border border-[#DACDB7] dark:border-[#24354D] flex items-start gap-3">
          <Database className="w-5 h-5 text-[#B58A3C] shrink-0 mt-0.5" />
          <div className="text-xs space-y-1 text-[#142033] dark:text-[#F8F5EE]">
            <div className="font-bold font-mono uppercase tracking-wider text-[#8C6219] dark:text-[#E4C381]">
              Local Application State Mode Active
            </div>
            <p className="text-[#5F6470] dark:text-[#94A3B8] leading-relaxed">
              The Blog CMS is running in offline/local storage mode. You can create new articles, edit existing ones, toggle drafts/published status, and test SEO slugs with instant live updates on the public website.
            </p>
          </div>
        </div>
      )}

      {/* Recent Articles Table */}
      <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-[#EBE1D0] dark:border-[#1F3045] flex items-center justify-between">
          <div>
            <h2 className="font-playfair text-lg font-bold text-[#142033] dark:text-[#F8F5EE]">
              Recent Blog Articles
            </h2>
            <p className="text-xs text-[#5F6470] dark:text-[#94A3B8] mt-0.5 font-serif">
              Latest publications and drafts in your local library
            </p>
          </div>
          <button
            onClick={() => onNavigate('/admin/blog')}
            className="text-xs font-mono font-semibold text-[#B58A3C] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-[#EBE1D0] dark:divide-[#1F3045]">
          {articles.slice(0, 5).map((post) => (
            <div
              key={post.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F9F5EC] dark:hover:bg-[#152336] transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xs overflow-hidden bg-[#EAE2D2] dark:bg-[#1E2E44] shrink-0 border border-[#DACDB7] dark:border-[#24354D]">
                  <img
                    src={post.coverImage || post.image || '/images/blog/avalpoondurai/cover.jpg'}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/blog/avalpoondurai/cover.jpg';
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.2 rounded-full bg-[#F4ECD8] dark:bg-[#2C2415] text-[#8C6219] dark:text-[#E4C381] font-semibold">
                      {post.category}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.2 rounded-full font-medium ${
                        post.status === 'published'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    {post.featured && (
                      <span className="text-[10px] font-mono text-[#8C6219] dark:text-[#E4C381] flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-[#B58A3C]" />
                        Featured
                      </span>
                    )}
                  </div>
                  <h3
                    onClick={() => onNavigate(`/admin/blog/edit/${post.id}`)}
                    className="font-serif font-bold text-sm text-[#142033] dark:text-[#F8F5EE] hover:text-[#B58A3C] transition-colors cursor-pointer"
                  >
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-[#718096] dark:text-[#94A3B8]">
                    <span>{post.publishedDate || post.date}</span>
                    <span>•</span>
                    <span>{post.readingTime || post.readTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onNavigate(`/blog/${post.slug}`)}
                  className="p-1.5 rounded-xs border border-[#DACDB7] dark:border-[#2C415C] text-xs font-medium hover:bg-[#EFE8DA] dark:hover:bg-[#182638] text-[#5F6470] dark:text-[#CBD5E1] transition-colors cursor-pointer"
                  title="View on public site"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate(`/admin/blog/edit/${post.id}`)}
                  className="px-3 py-1.5 rounded-xs bg-[#EAE2D2] dark:bg-[#1E2E44] text-[#142033] dark:text-[#F8F5EE] text-xs font-semibold hover:bg-[#DFD5C3] dark:hover:bg-[#2A3F5B] transition-colors cursor-pointer inline-flex items-center gap-1"
                >
                  <FileEdit className="w-3.5 h-3.5 text-[#B58A3C]" />
                  <span>Edit</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Collections Grid */}
      <div className="space-y-4">
        <h2 className="font-playfair text-xl font-bold text-[#142033] dark:text-[#F8F5EE]">
          Site Collections & Architecture
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collectionsList.map((col) => {
            const Icon = col.icon;
            return (
              <div
                key={col.id}
                onClick={() => onNavigate(col.path)}
                className={`p-5 rounded-xs border transition-all duration-200 cursor-pointer group flex flex-col justify-between ${
                  col.highlight
                    ? 'bg-[#FCFAF6] dark:bg-[#132030] border-[#B58A3C]/40 hover:border-[#B58A3C] shadow-xs'
                    : 'bg-[#FCFAF6] dark:bg-[#121E2E] border-[#DACDB7] dark:border-[#1F3045] hover:border-[#B58A3C] dark:hover:border-[#B58A3C]'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-xs bg-[#F4ECD8] dark:bg-[#1B283A] text-[#B58A3C] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#EAE2D2] dark:bg-[#1A2738] text-[#142033] dark:text-[#CBD5E1] font-semibold">
                      {col.count} {col.unit}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#142033] dark:text-[#F8F5EE] group-hover:text-[#B58A3C] transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-xs text-[#5F6470] dark:text-[#94A3B8] mt-1 font-serif line-clamp-2">
                      {col.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#EBE1D0] dark:border-[#1F3045] flex items-center justify-between text-xs font-mono text-[#B58A3C] group-hover:translate-x-0.5 transition-transform">
                  <span>Manage Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
