import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  ExternalLink,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  FileEdit,
  Trash2,
  Eye,
  Sparkles,
  AlertCircle,
  RotateCcw,
  Tag,
  Filter,
} from 'lucide-react';
import { BlogPost } from '../../types';
import {
  getBlogPosts,
  toggleArticlePublish,
  toggleArticleFeatured,
  deleteBlogPost,
} from '../../services/firestore/blogService';
import {
  resetLocalArticlesToSeed,
  subscribeToBlogUpdates,
} from '../../services/localBlogStorage';

interface AdminBlogPageProps {
  onNavigate: (path: string) => void;
}

export function AdminBlogPage({ onNavigate }: AdminBlogPageProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'featured'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const loadPosts = async () => {
    const all = await getBlogPosts({ includeDrafts: true });
    setPosts(all);
  };

  useEffect(() => {
    loadPosts();
    return subscribeToBlogUpdates(() => {
      loadPosts();
    });
  }, []);

  const handleTogglePublish = async (post: BlogPost) => {
    const isNowPublished = await toggleArticlePublish(post.id);
    const newStatus = isNowPublished ? 'Published' : 'Draft';
    setNotification(`"${post.title}" is now set to ${newStatus}.`);
    loadPosts();
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleFeatured = async (post: BlogPost) => {
    const newFeatured = await toggleArticleFeatured(post.id);
    setNotification(
      newFeatured
        ? `"${post.title}" marked as Featured!`
        : `"${post.title}" removed from Featured.`
    );
    loadPosts();
    setTimeout(() => setNotification(null), 3500);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteBlogPost(deleteTarget.id);
    setNotification(`"${deleteTarget.title}" deleted.`);
    setDeleteTarget(null);
    loadPosts();
    setTimeout(() => setNotification(null), 3500);
  };

  const handleResetToSeed = () => {
    if (window.confirm('Reset articles list to initial heritage articles? Any custom articles created locally will be replaced.')) {
      resetLocalArticlesToSeed();
      loadPosts();
      setNotification('Restored initial verified articles.');
      setTimeout(() => setNotification(null), 3500);
    }
  };

  // Filter posts
  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));

  const filteredPosts = posts.filter((p) => {
    // Search query
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status filter
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'published'
        ? p.status === 'published'
        : statusFilter === 'draft'
        ? p.status === 'draft'
        : statusFilter === 'featured'
        ? Boolean(p.featured)
        : true;

    // Category filter
    const matchesCategory =
      categoryFilter === 'All' ? true : p.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const publishedCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;
  const featuredCount = posts.filter((p) => p.featured).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DACDB7] dark:border-[#1E2E44] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-playfair text-2xl font-bold text-[#142033] dark:text-[#F8F5EE]">
              Articles CMS
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#EAE2D2] dark:bg-[#1E2E44] text-[#B58A3C] font-semibold">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'}
            </span>
          </div>
          <p className="text-xs font-serif text-[#5F6470] dark:text-[#94A3B8] mt-1">
            Manage, write, publish and organize heritage documentation, temple records, and essays.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('/blog')}
            className="px-3 py-2 border border-[#C5B8A2] dark:border-[#2C415C] rounded-xs text-xs font-medium hover:bg-[#EFE8DA] dark:hover:bg-[#182638] text-[#142033] dark:text-[#F8F5EE] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            title="Open Public Blog"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Public Blog</span>
          </button>

          <button
            onClick={handleResetToSeed}
            className="px-2.5 py-2 border border-[#DACDB7] dark:border-[#2C415C] rounded-xs text-xs font-medium hover:bg-[#EFE8DA] dark:hover:bg-[#182638] text-[#718096] dark:text-[#94A3B8] transition-colors cursor-pointer inline-flex items-center gap-1"
            title="Reset to default seed articles"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Defaults</span>
          </button>

          <button
            onClick={() => onNavigate('/admin/blog/new')}
            className="px-4 py-2 bg-[#B58A3C] hover:bg-[#9E752E] text-white rounded-xs text-xs font-semibold tracking-wide shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Article</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xs text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Status Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 bg-[#EAE2D2]/60 dark:bg-[#152336] p-1 rounded-xs border border-[#DACDB7] dark:border-[#1F3045] overflow-x-auto text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-[#0D1520] text-[#142033] dark:text-[#F8F5EE] shadow-xs font-semibold'
                : 'text-[#5F6470] dark:text-[#94A3B8] hover:text-[#142033]'
            }`}
          >
            All ({posts.length})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1 rounded-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'published'
                ? 'bg-white dark:bg-[#0D1520] text-emerald-700 dark:text-emerald-400 shadow-xs font-semibold'
                : 'text-[#5F6470] dark:text-[#94A3B8] hover:text-[#142033]'
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1 rounded-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
              statusFilter === 'draft'
                ? 'bg-white dark:bg-[#0D1520] text-amber-700 dark:text-amber-400 shadow-xs font-semibold'
                : 'text-[#5F6470] dark:text-[#94A3B8] hover:text-[#142033]'
            }`}
          >
            Drafts ({draftCount})
          </button>
          <button
            onClick={() => setStatusFilter('featured')}
            className={`px-3 py-1 rounded-xs font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              statusFilter === 'featured'
                ? 'bg-white dark:bg-[#0D1520] text-[#8C6219] dark:text-[#E4C381] shadow-xs font-semibold'
                : 'text-[#5F6470] dark:text-[#94A3B8] hover:text-[#142033]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#B58A3C]" />
            Featured ({featuredCount})
          </button>
        </div>

        {/* Category Filter & Search Bar */}
        <div className="flex items-center gap-2">
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs text-xs text-[#142033] dark:text-[#F8F5EE] focus:outline-none"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-2 bg-[#FCFAF6] dark:bg-[#121E2E] px-3 py-1.5 rounded-xs border border-[#DACDB7] dark:border-[#1F3045] flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-[#718096] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full bg-transparent text-xs text-[#142033] dark:text-[#F8F5EE] placeholder-[#718096] focus:outline-none font-sans"
            />
          </div>
        </div>
      </div>

      {/* Articles Table / List */}
      <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs overflow-hidden shadow-xs">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-[#718096] mx-auto opacity-60" />
            <div className="text-xs text-[#5F6470] dark:text-[#94A3B8]">
              No articles found matching the current filters.
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCategoryFilter('All');
              }}
              className="text-xs text-[#B58A3C] font-semibold underline hover:no-underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#EBE1D0] dark:divide-[#1F3045]">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-[#F9F5EC] dark:hover:bg-[#152336] transition-colors"
              >
                {/* Article Info & Thumbnail */}
                <div className="flex items-start gap-4 max-w-3xl">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xs overflow-hidden bg-[#EAE2D2] dark:bg-[#1A2636] shrink-0 border border-[#DACDB7] dark:border-[#24354D]">
                    <img
                      src={post.coverImage || post.image || '/images/blog/avalpoondurai/cover.jpg'}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/blog/avalpoondurai/cover.jpg';
                      }}
                    />
                  </div>

                  {/* Metadata & Title */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#F4ECD8] dark:bg-[#2C2415] text-[#8C6219] dark:text-[#E4C381] font-semibold border border-[#E4C381]/30">
                        {post.category}
                      </span>

                      {/* Status Badge */}
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(post)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-medium transition-colors cursor-pointer border ${
                          post.status === 'published'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300/40 hover:bg-emerald-200'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300/40 hover:bg-amber-200'
                        }`}
                        title="Click to toggle Published / Draft"
                      >
                        ● {post.status === 'published' ? 'Published' : 'Draft'}
                      </button>

                      {/* Featured Badge */}
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(post)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full transition-colors cursor-pointer border flex items-center gap-1 ${
                          post.featured
                            ? 'bg-[#F4ECD8] dark:bg-[#342816] text-[#8C6219] dark:text-[#E4C381] border-[#E4C381]/50 font-semibold'
                            : 'bg-transparent text-[#718096] border-dashed border-[#C5B8A2] dark:border-[#2C415C] hover:text-[#B58A3C]'
                        }`}
                        title="Click to toggle Featured on Blog Header"
                      >
                        <Sparkles className={`w-3 h-3 ${post.featured ? 'text-[#B58A3C]' : 'text-[#718096]'}`} />
                        {post.featured ? 'Featured' : 'Make Featured'}
                      </button>
                    </div>

                    <h2
                      onClick={() => onNavigate(`/admin/blog/edit/${post.id}`)}
                      className="font-serif font-bold text-base text-[#142033] dark:text-[#F8F5EE] hover:text-[#B58A3C] transition-colors cursor-pointer leading-snug"
                    >
                      {post.title}
                    </h2>

                    <p className="text-xs text-[#5F6470] dark:text-[#94A3B8] line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] font-mono text-[#718096] dark:text-[#94A3B8] pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.publishedDate || post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime || post.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author?.name || 'Anandh Jain Pujari'}
                      </span>
                      {post.tags && post.tags.length > 0 && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-[#B58A3C]">
                          <Tag className="w-2.5 h-2.5" />
                          {post.tags.slice(0, 2).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Row Actions */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#EBE1D0] dark:border-[#1F3045]">
                  <button
                    onClick={() => onNavigate(`/blog/${post.slug}`)}
                    className="p-2 rounded-xs border border-[#DACDB7] dark:border-[#2C415C] text-xs font-medium hover:bg-[#EFE8DA] dark:hover:bg-[#182638] transition-colors cursor-pointer text-[#5F6470] dark:text-[#CBD5E1]"
                    title="View on public blog"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onNavigate(`/admin/blog/edit/${post.id}`)}
                    className="px-3 py-1.5 rounded-xs bg-[#EAE2D2] dark:bg-[#1E2E44] text-[#142033] dark:text-[#F8F5EE] text-xs font-semibold hover:bg-[#DFD5C3] dark:hover:bg-[#2A3F5B] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <FileEdit className="w-3.5 h-3.5 text-[#B58A3C]" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteTarget(post)}
                    className="p-2 rounded-xs border border-red-200 dark:border-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    title="Delete article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-red-300 dark:border-red-900 rounded-xs max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-playfair text-lg font-bold text-[#142033] dark:text-[#F8F5EE]">
                Confirm Deletion
              </h3>
            </div>
            <p className="text-xs text-[#5F6470] dark:text-[#94A3B8] leading-relaxed">
              Are you sure you want to delete{' '}
              <strong className="text-[#142033] dark:text-[#F8F5EE]">"{deleteTarget.title}"</strong>?
              The article will be removed from your collection and public blog.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3 py-2 border border-[#DACDB7] dark:border-[#2C415C] rounded-xs text-xs font-medium hover:bg-[#EAE2D2] dark:hover:bg-[#182638] text-[#142033] dark:text-[#F8F5EE] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xs text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Delete Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
