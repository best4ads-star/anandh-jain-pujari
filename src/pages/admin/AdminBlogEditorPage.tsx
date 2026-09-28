import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Trash2,
  Eye,
  Sparkles,
  Calendar,
  Clock,
  User,
  Tag,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  Link as LinkIcon,
  ExternalLink,
  HelpCircle,
  Upload,
  RefreshCw,
  Cloud,
} from 'lucide-react';
import { BlogPost } from '../../types';
import {
  calculateReadingTime,
  slugify,
} from '../../services/localBlogStorage';
import {
  saveBlogPost,
  deleteBlogPost,
  getBlogPostBySlug,
} from '../../services/firestore/blogService';
import {
  uploadCoverImage,
  uploadArticleImage,
} from '../../services/firebase/storage';
import { ArticleContentRenderer } from '../../components/blog/ArticleContentRenderer';

interface AdminBlogEditorPageProps {
  articleId?: string;
  isNew?: boolean;
  onNavigate: (path: string) => void;
}

const CATEGORY_OPTIONS = [
  'Jain Heritage',
  'Architecture & Temples',
  'Field Photography',
  'Design & Creativity',
  'Technology & AI',
  'Living Traditions',
];

const PRESET_IMAGES = [
  { label: 'Avalpoondurai Cover', url: '/images/blog/avalpoondurai/cover.jpg' },
  { label: 'Sanctum Parshwanatha', url: '/images/blog/avalpoondurai/parshwanatha-idol.jpg' },
  { label: 'Vimana & Shikara', url: '/images/blog/avalpoondurai/vimana-architecture.jpg' },
  { label: 'Pillared Mandapa', url: '/images/blog/avalpoondurai/mandapa-pillars.jpg' },
  { label: 'Vijayamangalam Temple', url: '/images/temples/vijayamangalam.jpg' },
  { label: 'Tingalur Temple', url: '/images/temples/tingalur.jpg' },
  { label: 'Jain Photography', url: '/images/blog/photography-journey.jpg' },
  { label: '24 Tirthankaras', url: '/images/blog/tirthankaras-emblems.jpg' },
];

export function AdminBlogEditorPage({
  articleId,
  isNew = false,
  onNavigate,
}: AdminBlogEditorPageProps) {
  // Form State
  const [id, setId] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [subtitle, setSubtitle] = useState<string>('');
  const [excerpt, setExcerpt] = useState<string>('');
  const [contentMarkdown, setContentMarkdown] = useState<string>('');
  const [category, setCategory] = useState<string>('Jain Heritage');
  const [tags, setTags] = useState<string[]>(['Jain Heritage']);
  const [tagInput, setTagInput] = useState<string>('');
  const [coverImage, setCoverImage] = useState<string>('/images/blog/avalpoondurai/cover.jpg');
  const [authorName, setAuthorName] = useState<string>('Anandh Jain Pujari');
  const [authorRole, setAuthorRole] = useState<string>('Jain Temple Priest & Heritage Documentarian');
  const [authorAvatar, setAuthorAvatar] = useState<string>('/images/about/anandh-jain-pujari.jpg');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [featured, setFeatured] = useState<boolean>(false);
  const [publishedDate, setPublishedDate] = useState<string>('');
  const [readingTime, setReadingTime] = useState<string>('');
  const [seoTitle, setSeoTitle] = useState<string>('');
  const [seoDescription, setSeoDescription] = useState<string>('');

  // UI state
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveNotification, setSaveNotification] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // Media upload state
  const [isUploadingCover, setIsUploadingCover] = useState<boolean>(false);
  const [coverUploadProgress, setCoverUploadProgress] = useState<number>(0);
  const [isUploadingArticleImage, setIsUploadingArticleImage] = useState<boolean>(false);
  const [articleImageProgress, setArticleImageProgress] = useState<number>(0);
  const coverFileInputRef = useRef<HTMLInputElement | null>(null);
  const articleFileInputRef = useRef<HTMLInputElement | null>(null);

  // Load article if editing
  useEffect(() => {
    let isMounted = true;
    if (!isNew && articleId) {
      getBlogPostBySlug(articleId).then((existing) => {
        if (!isMounted || !existing) return;
        setId(existing.id);
        setTitle(existing.title);
        setSlug(existing.slug);
        setSubtitle(existing.subtitle || '');
        setExcerpt(existing.excerpt || '');
        
        const rawContent = Array.isArray(existing.content)
          ? existing.content.join('\n\n')
          : existing.content || '';
        setContentMarkdown(rawContent);

        setCategory(existing.category || 'Jain Heritage');
        setTags(existing.tags || ['Jain Heritage']);
        setCoverImage(existing.coverImage || existing.image || '/images/blog/avalpoondurai/cover.jpg');
        setAuthorName(existing.author?.name || 'Anandh Jain Pujari');
        setAuthorRole(existing.author?.role || 'Jain Temple Priest & Heritage Documentarian');
        setAuthorAvatar(existing.author?.avatar || '/images/about/anandh-jain-pujari.jpg');
        setStatus(existing.status === 'draft' ? 'draft' : 'published');
        setFeatured(Boolean(existing.featured));
        setPublishedDate(existing.publishedDate || existing.date || '');
        setReadingTime(existing.readingTime || existing.readTime || '');
        setSeoTitle(existing.seoTitle || '');
        setSeoDescription(existing.seoDescription || existing.excerpt || '');
        setSlugManuallyEdited(true);
      });
    } else {
      // New article defaults
      const today = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date());
      setPublishedDate(today);
      setContentMarkdown(`## Introduction\n\nEnter article introduction here...\n\n## Historical Significance\n\nDocument details about the temple or heritage site...\n\n[VERIFIED CONTENT TO BE ADDED: Epigraphical and historical verification pending.]\n\n## Architecture and Sacred Art\n\nDescribe the Dravidian or regional stone carvings and sanctum iconography...`);
    }

    return () => {
      isMounted = false;
    };
  }, [articleId, isNew]);

  // Handle title changes & auto-slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setIsDirty(true);
    if (!slugManuallyEdited && isNew) {
      const autoSlug = slugify(val);
      setSlug(autoSlug);
    }
    if (!seoTitle || seoTitle.includes('| Anandh Jain Pujari')) {
      setSeoTitle(`${val} | Anandh Jain Pujari`);
    }
  };

  // Content change & auto calculate reading time
  const handleContentChange = (val: string) => {
    setContentMarkdown(val);
    setIsDirty(true);
    const calculated = calculateReadingTime(val);
    setReadingTime(calculated);
  };

  // Handle Cover Image Upload
  const handleCoverFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const currentSlug = slug.trim() ? slugify(slug) : (title.trim() ? slugify(title) : 'article');
    setIsUploadingCover(true);
    setCoverUploadProgress(0);

    try {
      const downloadUrl = await uploadCoverImage(file, currentSlug, (pct) => {
        setCoverUploadProgress(pct);
      });
      setCoverImage(downloadUrl);
      setIsDirty(true);
      setSaveNotification('Cover image uploaded successfully.');
      setTimeout(() => setSaveNotification(null), 3000);
    } catch (err: any) {
      console.error('Cover upload error:', err);
      alert(`Cover image upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploadingCover(false);
      if (coverFileInputRef.current) {
        coverFileInputRef.current.value = '';
      }
    }
  };

  // Handle Article Inline Image Upload
  const handleArticleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const currentSlug = slug.trim() ? slugify(slug) : (title.trim() ? slugify(title) : 'article');
    setIsUploadingArticleImage(true);
    setArticleImageProgress(0);

    try {
      const downloadUrl = await uploadArticleImage(file, currentSlug, (pct) => {
        setArticleImageProgress(pct);
      });
      // Insert into markdown
      const imageMarkdown = `\n\n![${file.name.replace(/\.[^/.]+$/, '')}](${downloadUrl})\n*Caption: Photo captured by Anandh Jain Pujari*\n\n`;
      insertMarkdown(imageMarkdown, '');
      setIsDirty(true);
      setSaveNotification('Article image uploaded and inserted into text.');
      setTimeout(() => setSaveNotification(null), 3000);
    } catch (err: any) {
      console.error('Article image upload error:', err);
      alert(`Image upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploadingArticleImage(false);
      if (articleFileInputRef.current) {
        articleFileInputRef.current.value = '';
      }
    }
  };

  // Handle adding tag
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const clean = tagInput.trim().replace(/^#/, '');
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
      setIsDirty(true);
    }
    setTagInput('');
  };

  // Handle removing tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    setIsDirty(true);
  };

  // Insert markdown shortcut
  const insertMarkdown = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('article-content-editor') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = contentMarkdown.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const newContent =
      contentMarkdown.substring(0, start) + replacement + contentMarkdown.substring(end);
    setContentMarkdown(newContent);
    setIsDirty(true);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4));
    }, 0);
  };

  // Save handler supporting full 18 article fields & dual storage
  const handleSave = async (targetStatus?: 'published' | 'draft') => {
    if (!title.trim()) {
      alert('Please provide an article title.');
      return;
    }

    const finalStatus = targetStatus || status;
    const finalSlug = slug.trim() ? slugify(slug) : slugify(title);
    const isPub = finalStatus === 'published';
    const nowIso = new Date().toISOString();

    setIsSaving(true);

    try {
      const contentBlocks = contentMarkdown
        .split('\n\n')
        .map((b) => b.trim())
        .filter(Boolean);

      const savedId = await saveBlogPost({
        id: id || undefined,
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim() || (contentBlocks[0] ? contentBlocks[0].slice(0, 160) : ''),
        content: contentBlocks.length > 0 ? contentBlocks : [contentMarkdown],
        coverImage: coverImage.trim() || '/images/blog/avalpoondurai/cover.jpg',
        category: category,
        categorySlug: slugify(category),
        tags: tags.length > 0 ? tags : ['Jain Heritage'],
        author: {
          name: authorName.trim() || 'Anandh Jain Pujari',
          role: authorRole.trim() || 'Jain Temple Priest & Heritage Documentarian',
          avatar: authorAvatar.trim() || '/images/about/anandh-jain-pujari.jpg',
        },
        authorBio: authorRole.trim() || 'Jain Temple Priest & Heritage Documentarian',
        published: isPub,
        featured: featured,
        publishedAt: publishedDate.trim() || nowIso.split('T')[0],
        updatedAt: nowIso,
        readingTime: readingTime || calculateReadingTime(contentMarkdown),
        seoTitle: seoTitle.trim() || `${title.trim()} | Anandh Jain Pujari`,
        seoDescription: seoDescription.trim() || excerpt.trim(),
        status: finalStatus,
        createdAt: nowIso,
      });

      setId(savedId);
      setSlug(finalSlug);
      setStatus(finalStatus);
      setIsDirty(false);

      setSaveNotification(
        isPub
          ? 'Article successfully published!'
          : 'Article draft saved!'
      );
      setTimeout(() => setSaveNotification(null), 4000);
    } catch (err) {
      console.error('Failed to save article:', err);
      alert('Failed to save article. Please check console for details.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      await deleteBlogPost(id);
      setShowDeleteModal(false);
      onNavigate('/admin/blog');
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete article.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top Bar: Back & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DACDB7] dark:border-[#1E2E44] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/admin/blog')}
            className="p-1.5 rounded-xs hover:bg-[#EAE2D2] dark:hover:bg-[#1E2E44] text-[#5F6470] dark:text-[#94A3B8] transition-colors cursor-pointer"
            title="Back to Blog Articles List"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-playfair text-xl sm:text-2xl font-bold text-[#142033] dark:text-[#F8F5EE]">
                {isNew ? 'Create New Article' : 'Edit Article'}
              </h1>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-medium ${
                  status === 'published'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/40'
                }`}
              >
                {status === 'published' ? 'Published' : 'Draft'}
              </span>
              {featured && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#F4ECD8] dark:bg-[#342816] text-[#8C6219] dark:text-[#E4C381] border border-[#E4C381]/40 flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3 h-3 text-[#B58A3C]" />
                  Featured
                </span>
              )}
            </div>
            {slug && (
              <p className="text-xs font-mono text-[#718096] dark:text-[#94A3B8] mt-0.5">
                Public URL: <span className="text-[#B58A3C] font-semibold">/blog/{slug}</span>
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {slug && (
            <button
              onClick={() => onNavigate(`/blog/${slug}`)}
              className="px-3 py-2 border border-[#DACDB7] dark:border-[#2C415C] rounded-xs text-xs font-medium hover:bg-[#EFE8DA] dark:hover:bg-[#182638] text-[#142033] dark:text-[#F8F5EE] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-[#718096]" />
              <span>Preview Live</span>
            </button>
          )}

          {!isNew && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-3 py-2 border border-red-300 dark:border-red-900/60 text-red-700 dark:text-red-400 rounded-xs text-xs font-medium hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}

          <button
            onClick={() => handleSave('draft')}
            disabled={isSaving}
            className="px-3.5 py-2 border border-[#C5B8A2] dark:border-[#2C415C] rounded-xs text-xs font-medium hover:bg-[#EFE8DA] dark:hover:bg-[#182638] text-[#142033] dark:text-[#F8F5EE] transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-[#B58A3C]" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => handleSave('published')}
            disabled={isSaving}
            className="px-4 py-2 bg-[#B58A3C] hover:bg-[#9E752E] text-white rounded-xs text-xs font-semibold tracking-wide shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{status === 'published' ? 'Update & Publish' : 'Publish Article'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveNotification && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xs text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveNotification}</span>
          </div>
          {slug && (
            <button
              onClick={() => onNavigate(`/blog/${slug}`)}
              className="text-xs font-semibold underline hover:no-underline text-emerald-800 dark:text-emerald-300 cursor-pointer"
            >
              View on live site →
            </button>
          )}
        </div>
      )}

      {/* Grid Layout: Editorial Main (8 cols) + Settings Sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Editorial Column */}
        <div className="lg:col-span-8 space-y-5">
          {/* Article Title */}
          <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs p-4 sm:p-5 space-y-4">
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#5F6470] dark:text-[#94A3B8] mb-1.5">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Avalpoondurai Jain Temple — A Spiritual Legacy"
                className="w-full px-3 py-2 text-base sm:text-lg font-serif font-bold text-[#142033] dark:text-[#F8F5EE] bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs focus:outline-none focus:border-[#B58A3C] transition-colors"
              />
            </div>

            {/* Subtitle / Excerpt */}
            <div>
              <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#5F6470] dark:text-[#94A3B8] mb-1.5">
                Subtitle & Lead Excerpt
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="A concise summary highlighting the historical, architectural, or spiritual aspects..."
                className="w-full px-3 py-2 text-xs sm:text-sm font-sans text-[#142033] dark:text-[#F8F5EE] bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs focus:outline-none focus:border-[#B58A3C] transition-colors"
              />
            </div>
          </div>

          {/* Content Editor with Write / Preview Tabs */}
          <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs overflow-hidden">
            {/* Toolbar Header */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#DACDB7] dark:border-[#1F3045] px-4 py-2.5 bg-[#F8F4EC] dark:bg-[#101A28] gap-2">
              <div className="flex items-center gap-1 border border-[#DACDB7] dark:border-[#24354D] p-0.5 rounded-xs bg-white dark:bg-[#0D1520]">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                    activeTab === 'write'
                      ? 'bg-[#B58A3C] text-white shadow-xs'
                      : 'text-[#5F6470] dark:text-[#CBD5E1] hover:text-[#142033]'
                  }`}
                >
                  Markdown Editor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-[#B58A3C] text-white shadow-xs'
                      : 'text-[#5F6470] dark:text-[#CBD5E1] hover:text-[#142033]'
                  }`}
                >
                  Live Visual Preview
                </button>
              </div>

              {/* Formatting Quick Actions */}
              {activeTab === 'write' && (
                <div className="flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => insertMarkdown('## ', '')}
                    className="px-2 py-1 bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs text-[11px] font-mono hover:bg-[#EAE2D2] dark:hover:bg-[#1E2E44] cursor-pointer"
                    title="Insert Heading 2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('### ', '')}
                    className="px-2 py-1 bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs text-[11px] font-mono hover:bg-[#EAE2D2] dark:hover:bg-[#1E2E44] cursor-pointer"
                    title="Insert Heading 3"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('**', '**')}
                    className="px-2 py-1 bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs text-[11px] font-mono font-bold hover:bg-[#EAE2D2] dark:hover:bg-[#1E2E44] cursor-pointer"
                    title="Bold"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('*', '*')}
                    className="px-2 py-1 bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs text-[11px] font-mono italic hover:bg-[#EAE2D2] dark:hover:bg-[#1E2E44] cursor-pointer"
                    title="Italic"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('> ', '')}
                    className="px-2 py-1 bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs text-[11px] font-mono hover:bg-[#EAE2D2] dark:hover:bg-[#1E2E44] cursor-pointer"
                    title="Blockquote"
                  >
                    Quote
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('- ', '')}
                    className="px-2 py-1 bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs text-[11px] font-mono hover:bg-[#EAE2D2] dark:hover:bg-[#1E2E44] cursor-pointer"
                    title="List Item"
                  >
                    List
                  </button>

                  <input
                    type="file"
                    ref={articleFileInputRef}
                    onChange={handleArticleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => articleFileInputRef.current?.click()}
                    disabled={isUploadingArticleImage}
                    className="px-2 py-1 bg-[#F4ECD8] dark:bg-[#1E2E44] border border-[#DACDB7] dark:border-[#24354D] text-[#8C6219] dark:text-[#E4C381] rounded-xs text-[11px] font-mono hover:bg-[#EAE2D2] dark:hover:bg-[#2A3F5B] cursor-pointer inline-flex items-center gap-1"
                    title="Upload image to Firebase Storage and insert markdown"
                  >
                    {isUploadingArticleImage ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>{articleImageProgress}%</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3 h-3" />
                        <span>Upload Photo</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => insertMarkdown('\n[VERIFIED CONTENT TO BE ADDED: ', ']\n')}
                    className="px-2 py-1 bg-[#FFF8EE] dark:bg-[#20180F] border border-[#E9C894] dark:border-[#523A1E] text-[#925C15] dark:text-[#E9B66F] rounded-xs text-[11px] font-mono hover:bg-[#F9ECCF] cursor-pointer"
                    title="Insert Verified Content Badge"
                  >
                    + Verified Badge
                  </button>
                </div>
              )}
            </div>

            {/* Editor Body */}
            {activeTab === 'write' ? (
              <div className="p-4">
                <textarea
                  id="article-content-editor"
                  rows={20}
                  value={contentMarkdown}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Write your article in Markdown..."
                  className="w-full font-mono text-xs sm:text-sm text-[#142033] dark:text-[#F8F5EE] bg-transparent focus:outline-none resize-y leading-relaxed"
                />
                <div className="pt-2 border-t border-[#EAE2D2] dark:border-[#1F3045] flex items-center justify-between text-[11px] font-mono text-[#718096]">
                  <span>Markdown format supported (## Headings, **bold**, *italic*, lists, images)</span>
                  <span>{contentMarkdown.split(/\s+/).filter(Boolean).length} words • {readingTime}</span>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-white dark:bg-[#0D1420] min-h-[400px]">
                <div className="prose dark:prose-invert max-w-none">
                  <ArticleContentRenderer content={contentMarkdown.split('\n\n').filter(Boolean)} />
                </div>
              </div>
            )}
          </div>

          {/* Preset Images Gallery Quick Insert */}
          <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#5F6470] dark:text-[#94A3B8] flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#B58A3C]" />
                Archive Photo Presets (Click to insert into Markdown)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => {
                    insertMarkdown(`\n![${img.label}](${img.url})\n`);
                  }}
                  className="p-2 bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs text-left group hover:border-[#B58A3C] transition-colors cursor-pointer"
                >
                  <div className="aspect-video w-full overflow-hidden rounded-xs bg-[#EAE2D2] mb-1.5">
                    <img
                      src={img.url}
                      alt={img.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="text-[11px] font-sans font-medium text-[#142033] dark:text-[#F8F5EE] truncate">
                    {img.label}
                  </div>
                  <div className="text-[10px] font-mono text-[#B58A3C]">
                    + Insert Photo
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Settings Column */}
        <div className="lg:col-span-4 space-y-5">
          {/* Publication Status & Featured */}
          <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs p-4 space-y-4">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#142033] dark:text-[#F8F5EE] border-b border-[#DACDB7] dark:border-[#1F3045] pb-2">
              Publication Settings
            </h2>

            {/* Status Radio */}
            <div>
              <label className="block text-xs font-sans text-[#5F6470] dark:text-[#94A3B8] mb-1.5">
                Article Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStatus('published');
                    setIsDirty(true);
                  }}
                  className={`p-2 text-xs font-semibold rounded-xs border text-center transition-colors cursor-pointer ${
                    status === 'published'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300'
                      : 'border-[#DACDB7] dark:border-[#24354D] text-[#5F6470]'
                  }`}
                >
                  ✓ Published
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatus('draft');
                    setIsDirty(true);
                  }}
                  className={`p-2 text-xs font-semibold rounded-xs border text-center transition-colors cursor-pointer ${
                    status === 'draft'
                      ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-800 dark:text-amber-300'
                      : 'border-[#DACDB7] dark:border-[#24354D] text-[#5F6470]'
                  }`}
                >
                  ✎ Draft
                </button>
              </div>
            </div>

            {/* Featured Checkbox */}
            <div className="pt-2 border-t border-[#DACDB7] dark:border-[#1F3045]">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => {
                    setFeatured(e.target.checked);
                    setIsDirty(true);
                  }}
                  className="mt-0.5 rounded-xs text-[#B58A3C] focus:ring-[#B58A3C]"
                />
                <div>
                  <span className="text-xs font-semibold text-[#142033] dark:text-[#F8F5EE] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#B58A3C]" />
                    Featured Article
                  </span>
                  <p className="text-[11px] text-[#718096] dark:text-[#94A3B8] mt-0.5">
                    Display prominently on the blog header hero and homepage.
                  </p>
                </div>
              </label>
            </div>

            {/* Publication Date */}
            <div>
              <label className="block text-xs font-sans text-[#5F6470] dark:text-[#94A3B8] mb-1">
                Publication Date
              </label>
              <div className="flex items-center gap-2 bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs px-2.5 py-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#718096]" />
                <input
                  type="text"
                  value={publishedDate}
                  onChange={(e) => {
                    setPublishedDate(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="e.g. Sep 12, 2025"
                  className="w-full text-xs font-mono text-[#142033] dark:text-[#F8F5EE] bg-transparent focus:outline-none"
                />
              </div>
            </div>

            {/* Reading Time */}
            <div>
              <label className="block text-xs font-sans text-[#5F6470] dark:text-[#94A3B8] mb-1">
                Estimated Reading Time
              </label>
              <div className="flex items-center gap-2 bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs px-2.5 py-1.5">
                <Clock className="w-3.5 h-3.5 text-[#718096]" />
                <input
                  type="text"
                  value={readingTime}
                  onChange={(e) => {
                    setReadingTime(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="e.g. 7 min read"
                  className="w-full text-xs font-mono text-[#142033] dark:text-[#F8F5EE] bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs p-4 space-y-4">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#142033] dark:text-[#F8F5EE] border-b border-[#DACDB7] dark:border-[#1F3045] pb-2">
              Classification
            </h2>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-sans text-[#5F6470] dark:text-[#94A3B8] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-3 py-1.5 text-xs font-sans text-[#142033] dark:text-[#F8F5EE] bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs focus:outline-none focus:border-[#B58A3C]"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Management */}
            <div>
              <label className="block text-xs font-sans text-[#5F6470] dark:text-[#94A3B8] mb-1">
                Tags (Heritage, Kongu Nadu, Temple, etc.)
              </label>
              <div className="flex gap-1.5 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tag and press Enter..."
                  className="flex-1 px-2.5 py-1 text-xs text-[#142033] dark:text-[#F8F5EE] bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs focus:outline-none focus:border-[#B58A3C]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-2.5 py-1 bg-[#EAE2D2] dark:bg-[#1E2E44] text-[#142033] dark:text-[#F8F5EE] text-xs font-medium rounded-xs hover:bg-[#DFD5C3] cursor-pointer"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-sans bg-[#F4ECD8] dark:bg-[#2A2214] text-[#8C6219] dark:text-[#E4C381] border border-[#E2D2B0]/50"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500 cursor-pointer ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Cover Image Settings */}
          <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#DACDB7] dark:border-[#1F3045] pb-2">
              <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#142033] dark:text-[#F8F5EE]">
                Cover Image
              </h2>
              <span className="text-[10px] font-mono text-[#8C6219] dark:text-[#E4C381]">
                Storage & URLs
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-sans text-[#5F6470] dark:text-[#94A3B8]">
                  Image URL or Upload File
                </label>
                <input
                  type="file"
                  ref={coverFileInputRef}
                  onChange={handleCoverFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => coverFileInputRef.current?.click()}
                  disabled={isUploadingCover}
                  className="text-[11px] font-mono font-semibold text-[#B58A3C] hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" />
                  <span>{isUploadingCover ? `Uploading (${coverUploadProgress}%)` : 'Upload File'}</span>
                </button>
              </div>

              <input
                type="text"
                value={coverImage}
                onChange={(e) => {
                  setCoverImage(e.target.value);
                  setIsDirty(true);
                }}
                placeholder="https://... or /images/blog/..."
                className="w-full px-2.5 py-1.5 text-xs font-mono text-[#142033] dark:text-[#F8F5EE] bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs focus:outline-none focus:border-[#B58A3C]"
              />

              {isUploadingCover && (
                <div className="mt-2 w-full bg-[#EAE2D2] dark:bg-[#1E2E44] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#B58A3C] h-full transition-all duration-200"
                    style={{ width: `${coverUploadProgress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Preview Box */}
            <div className="aspect-video w-full rounded-xs overflow-hidden border border-[#DACDB7] dark:border-[#24354D] bg-[#EAE2D2] relative">
              <img
                src={coverImage}
                alt="Cover Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image path fails
                  (e.target as HTMLImageElement).src = '/images/blog/avalpoondurai/cover.jpg';
                }}
              />
            </div>
          </div>

          {/* Author Details */}
          <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs p-4 space-y-3">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#142033] dark:text-[#F8F5EE] border-b border-[#DACDB7] dark:border-[#1F3045] pb-2">
              Author
            </h2>

            <div>
              <label className="block text-xs font-sans text-[#5F6470] dark:text-[#94A3B8] mb-1">
                Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => {
                  setAuthorName(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-2.5 py-1.5 text-xs font-sans text-[#142033] dark:text-[#F8F5EE] bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-[#5F6470] dark:text-[#94A3B8] mb-1">
                Role / Title
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => {
                  setAuthorRole(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-2.5 py-1.5 text-xs font-sans text-[#142033] dark:text-[#F8F5EE] bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Slug & SEO Metadata */}
          <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#DACDB7] dark:border-[#1F3045] rounded-xs p-4 space-y-3">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#142033] dark:text-[#F8F5EE] border-b border-[#DACDB7] dark:border-[#1F3045] pb-2">
              SEO & URL Slug
            </h2>

            <div>
              <label className="block text-xs font-sans text-[#5F6470] dark:text-[#94A3B8] mb-1">
                URL Slug
              </label>
              <div className="flex items-center bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs px-2.5 py-1.5">
                <span className="text-xs font-mono text-[#718096]">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugManuallyEdited(true);
                    setIsDirty(true);
                  }}
                  className="w-full text-xs font-mono text-[#142033] dark:text-[#F8F5EE] bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans text-[#5F6470] dark:text-[#94A3B8] mb-1">
                SEO Title Tag
              </label>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => {
                  setSeoTitle(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-2.5 py-1.5 text-xs font-sans text-[#142033] dark:text-[#F8F5EE] bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans text-[#5F6470] dark:text-[#94A3B8] mb-1">
                SEO Meta Description ({seoDescription.length}/160)
              </label>
              <textarea
                rows={2}
                value={seoDescription}
                onChange={(e) => {
                  setSeoDescription(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full px-2.5 py-1.5 text-xs font-sans text-[#142033] dark:text-[#F8F5EE] bg-white dark:bg-[#0D1520] border border-[#DACDB7] dark:border-[#24354D] rounded-xs focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FCFAF6] dark:bg-[#121E2E] border border-red-300 dark:border-red-900 rounded-xs max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-playfair text-lg font-bold text-[#142033] dark:text-[#F8F5EE]">
                Confirm Article Deletion
              </h3>
            </div>
            <p className="text-xs text-[#5F6470] dark:text-[#94A3B8] leading-relaxed">
              Are you sure you want to permanently delete{' '}
              <strong className="text-[#142033] dark:text-[#F8F5EE]">"{title}"</strong>?
              This action will remove the article from the local database and public blog index.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-2 border border-[#DACDB7] dark:border-[#2C415C] rounded-xs text-xs font-medium hover:bg-[#EAE2D2] dark:hover:bg-[#182638] text-[#142033] dark:text-[#F8F5EE] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
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
