import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Check,
  Mail,
  ChevronLeft,
  ChevronRight,
  List,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { BlogPost } from '../types';
import { GoldLeafBranch } from '../components/Icons';
import { ArticleContentRenderer } from '../components/blog/ArticleContentRenderer';
import { FieldPhotographyGallery } from '../components/blog/FieldPhotographyGallery';
import { LocationVisitorSection } from '../components/blog/LocationVisitorSection';
import {
  getBlogPostBySlug,
  getRelatedBlogPosts,
  getAdjacentBlogPosts,
} from '../data/blogPosts';
import { subscribeToBlogUpdates } from '../services/localBlogStorage';

interface BlogPostPageProps {
  slug: string;
  onNavigateHome: () => void;
  onNavigateBlog: () => void;
  onSelectArticle: (slug: string) => void;
}

export function BlogPostPage({
  slug,
  onNavigateHome,
  onNavigateBlog,
  onSelectArticle,
}: BlogPostPageProps) {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState<boolean>(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [updateTick, setUpdateTick] = useState<number>(0);

  useEffect(() => {
    return subscribeToBlogUpdates(() => setUpdateTick((t) => t + 1));
  }, []);

  // Fetch post from CMS data layer
  const post = useMemo(() => getBlogPostBySlug(slug), [slug, updateTick]);
  const relatedPosts = useMemo(() => getRelatedBlogPosts(slug, 3), [slug, updateTick]);
  const { prev, next } = useMemo(() => getAdjacentBlogPosts(slug), [slug, updateTick]);

  // Is this the Avalpoondurai article?
  const isAvalpoondurai = post?.slug === 'avalpoondurai-jain-temple-spiritual-legacy';

  // Extract table of contents items
  const tableOfContents = useMemo(() => {
    if (!post) return [];

    // Specific Table of Contents architecture requested for Avalpoondurai
    if (isAvalpoondurai) {
      return [
        { id: 'introduction', title: 'Introduction' },
        { id: 'about-the-temple', title: 'About the Temple' },
        { id: 'historical-background', title: 'Historical Background' },
        { id: 'temple-architecture', title: 'Temple Architecture' },
        { id: 'tirthankara-main-deity', title: 'Tirthankara / Main Deity' },
        { id: 'inscriptions-historical-evidence', title: 'Inscriptions & Historical Evidence' },
        { id: 'jain-traditions-worship', title: 'Jain Traditions & Worship' },
        { id: 'temple-photographs', title: 'Temple Photographs' },
        { id: 'location-visitor-information', title: 'Location & Visitor Information' },
        { id: 'heritage-significance', title: 'Heritage Significance' },
        { id: 'conclusion', title: 'Conclusion' },
      ];
    }

    const blocks = Array.isArray(post.content) ? post.content : [post.content];
    const headings: { id: string; title: string }[] = [];

    blocks.forEach((block) => {
      const lines = block.split('\n');
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('## ')) {
          const title = trimmed.replace('## ', '');
          const id = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
          headings.push({ id, title });
        }
      });
    });

    return headings;
  }, [post, isAvalpoondurai]);

  // Scroll listener for reading progress bar and active TOC heading
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }

      // Track active heading
      if (tableOfContents.length > 0) {
        const scrollPosition = window.scrollY + 140;
        for (let i = tableOfContents.length - 1; i >= 0; i--) {
          const element = document.getElementById(tableOfContents[i].id);
          if (element && element.offsetTop <= scrollPosition) {
            setActiveHeadingId(tableOfContents[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  // SEO & Structured Data updates (preserving canonical, breadcrumb, and schema)
  useEffect(() => {
    if (!post) return;

    const originalTitle = document.title;
    document.title = `${post.title} | Anandh Jain Pujari`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const previousDesc = metaDesc.getAttribute('content') || '';
    metaDesc.setAttribute('content', post.seoDescription || post.excerpt);

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}/blog/${post.slug}`);

    // Structured Data: Article (BlogPosting) & Breadcrumb
    const articleScriptId = `schema-article-${post.slug}`;
    let articleScript = document.getElementById(articleScriptId) as HTMLScriptElement | null;
    if (!articleScript) {
      articleScript = document.createElement('script');
      articleScript.id = articleScriptId;
      articleScript.type = 'application/ld+json';
      document.head.appendChild(articleScript);
    }

    const articleSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.seoDescription || post.excerpt,
      image: post.coverImage.startsWith('http')
        ? post.coverImage
        : `${window.location.origin}${post.coverImage}`,
      datePublished: post.createdAt || '2025-09-12',
      dateModified: post.updatedAt || post.createdAt || '2025-09-18',
      author: {
        '@type': 'Person',
        name: post.author.name,
        jobTitle: post.author.role,
        url: `${window.location.origin}/about`,
      },
      publisher: {
        '@type': 'Person',
        name: 'Anandh Jain Pujari',
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${window.location.origin}/blog/${post.slug}`,
      },
    };
    articleScript.text = JSON.stringify(articleSchemaData);

    // Breadcrumb Schema
    const breadcrumbScriptId = `schema-breadcrumb-${post.slug}`;
    let breadcrumbScript = document.getElementById(breadcrumbScriptId) as HTMLScriptElement | null;
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement('script');
      breadcrumbScript.id = breadcrumbScriptId;
      breadcrumbScript.type = 'application/ld+json';
      document.head.appendChild(breadcrumbScript);
    }

    const breadcrumbSchemaData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${window.location.origin}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: `${window.location.origin}/blog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: `${window.location.origin}/blog/${post.slug}`,
        },
      ],
    };
    breadcrumbScript.text = JSON.stringify(breadcrumbSchemaData);

    return () => {
      document.title = originalTitle;
      if (metaDesc) metaDesc.setAttribute('content', previousDesc);
      const s1 = document.getElementById(articleScriptId);
      if (s1) s1.remove();
      const s2 = document.getElementById(breadcrumbScriptId);
      if (s2) s2.remove();
    };
  }, [post]);

  // Smooth scroll handler with reduced-motion support
  const handleScrollToHeading = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const yOffset = -90; // offset for sticky nav
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
    });

    setIsMobileTocOpen(false);
  };

  // Compact sharing actions: Copy Link, WhatsApp, Facebook, Email
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    if (typeof window !== 'undefined' && post) {
      const text = encodeURIComponent(`${post.title}\n${window.location.href}`);
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    }
  };

  const handleShareFacebook = () => {
    if (typeof window !== 'undefined') {
      const url = encodeURIComponent(window.location.href);
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    }
  };

  const handleShareEmail = () => {
    if (typeof window !== 'undefined' && post) {
      const subject = encodeURIComponent(post.title);
      const body = encodeURIComponent(
        `I thought you might appreciate this article by Anandh Jain Pujari:\n\n${post.title}\n\nRead here: ${window.location.href}`
      );
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F8F5EE] dark:bg-[#0B131E] text-[#142033] dark:text-[#F8F5EE] flex flex-col items-center justify-center p-8 text-center">
        <h1 className="font-playfair text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-[#5F6470] dark:text-[#94A3B8] max-w-md mb-8">
          The requested article could not be located in the heritage archives.
        </p>
        <button
          onClick={onNavigateBlog}
          className="px-6 py-3 rounded-xs bg-[#142033] text-[#F8F5EE] text-xs font-semibold tracking-wider uppercase hover:bg-[#1E2F48] transition-colors"
        >
          Return to Blog
        </button>
      </div>
    );
  }

  return (
    <article className="bg-[#F8F5EE] dark:bg-[#0B131E] min-h-screen text-[#142033] dark:text-[#F8F5EE] transition-colors duration-300">
      {/* 1. Sticky Top Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 pointer-events-none"
        style={{ width: '100%' }}
      >
        <div
          className="h-full bg-[#B58A3C] transition-all duration-150 ease-out shadow-[0_0_8px_rgba(181,138,60,0.6)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Top Navigation Bar with Breadcrumbs & Back to Blog */}
      <nav
        aria-label="Breadcrumb"
        className="border-b border-[#E8E0D0] dark:border-[#1E2E42] bg-[#F2ECE0]/85 dark:bg-[#0E1826]/85 backdrop-blur-xs sticky top-0 z-40"
      >
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            id="back-to-blog-btn"
            onClick={onNavigateBlog}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#142033] dark:text-[#E2E8F0] hover:text-[#B58A3C] dark:hover:text-[#D8BD82] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Blog</span>
          </button>

          {/* Breadcrumbs */}
          <div className="hidden sm:flex items-center space-x-2 text-xs text-[#718096] dark:text-[#94A3B8]">
            <button
              onClick={onNavigateHome}
              className="hover:text-[#B58A3C] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-[#A0AEC0]">/</span>
            <button
              onClick={onNavigateBlog}
              className="hover:text-[#B58A3C] transition-colors cursor-pointer"
            >
              Blog
            </button>
            <span className="text-[#A0AEC0]">/</span>
            <span className="text-[#142033] dark:text-[#F8F5EE] font-medium truncate max-w-[220px]">
              {post.category}
            </span>
          </div>

          {/* Reading progress indicator label */}
          <span className="text-[11px] font-mono text-[#718096] dark:text-[#94A3B8]">
            {Math.round(scrollProgress)}% Read
          </span>
        </div>
      </nav>

      {/* 3. Elegant Editorial Article Header */}
      <header className="pt-8 sm:pt-12 pb-6 sm:pb-8 px-4 sm:px-6 max-w-[960px] mx-auto text-center">
        {/* Category Label */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xs bg-[#EAE2D2] dark:bg-[#182638] text-[#8C6219] dark:text-[#D8BD82] border border-[#DDD0B8] dark:border-[#2C3F58] mb-4 text-xs font-mono tracking-widest uppercase">
          <GoldLeafBranch className="w-3.5 h-3.5" />
          <span>{post.category}</span>
        </div>

        {/* Title */}
        <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight leading-[1.25] mb-4 max-w-[840px] mx-auto">
          {post.title}
        </h1>

        {/* Subtitle / Excerpt */}
        <p className="font-serif text-base sm:text-lg md:text-[19px] text-[#5F6470] dark:text-[#94A3B8] italic leading-relaxed max-w-[760px] mx-auto mb-6">
          {post.excerpt}
        </p>

        {/* Author, Date, Reading Time Metadata Row */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-[#718096] dark:text-[#94A3B8] pt-3.5 border-t border-[#E8E0D0] dark:border-[#1E2E42] max-w-[680px] mx-auto">
          {/* Author attribution */}
          <div className="flex items-center gap-2.5">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-8 h-8 rounded-full object-cover border border-[#B58A3C]/40"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#B58A3C] text-white flex items-center justify-center font-bold text-xs">
                {post.author.name.charAt(0)}
              </div>
            )}
            <div className="text-left">
              <div className="font-semibold text-[#142033] dark:text-[#F8F5EE] text-xs">
                {post.author.name}
              </div>
              <div className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
                {post.author.role}
              </div>
            </div>
          </div>

          <span className="hidden sm:inline w-1 h-1 rounded-full bg-[#CBD5E1] dark:bg-[#475569]" />

          {/* Published date */}
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#B58A3C]" />
            <span>{post.publishedDate || post.date}</span>
          </div>

          <span className="w-1 h-1 rounded-full bg-[#CBD5E1] dark:bg-[#475569]" />

          {/* Reading time */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#B58A3C]" />
            <span>{post.readingTime || post.readTime}</span>
          </div>
        </div>
      </header>

      {/* 4. Replaceable Cover Image Block (900–960px max width, full width on mobile) */}
      <div className="max-w-[960px] mx-auto px-0 sm:px-6 mb-10">
        <figure className="relative rounded-none sm:rounded-sm overflow-hidden border-y sm:border border-[#E2D8C3] dark:border-[#24354B] bg-[#EFE8DC] dark:bg-[#182434] shadow-[0_6px_25px_rgba(20,32,51,0.05)]">
          <img
            src={post.coverImage || '/images/blog/avalpoondurai/cover.jpg'}
            alt={post.title}
            className="w-full h-auto max-h-[480px] object-cover object-center"
            loading="eager"
            onError={(e) => {
              const target = e.currentTarget;
              target.src = '/images/blog/avalpoondurai/cover.jpg';
            }}
          />

          {/* Replaceable Field Placeholder Caption */}
          <figcaption className="p-3 bg-[#F2ECE0]/95 dark:bg-[#121E2E]/95 border-t border-[#E2D8C3] dark:border-[#203147] flex flex-col sm:flex-row items-center justify-between gap-1.5 text-xs text-[#5F6470] dark:text-[#94A3B8] font-sans px-4">
            <div className="italic text-center sm:text-left">
              "Cover photograph — to be replaced with verified field photography."
            </div>
            <div className="text-[11px] font-mono text-[#8C95A6] dark:text-[#7A889B] shrink-0">
              Asset: <span className="text-[#B58A3C]">/images/blog/avalpoondurai/cover.jpg</span>
            </div>
          </figcaption>
        </figure>
      </div>

      {/* 5. Main Article Editorial Layout (Max container 960px, Main text column ~720–760px) */}
      <div className="max-w-[960px] mx-auto px-4 sm:px-6 pb-16">
        {/* Mobile Collapsible Table of Contents (< lg screens) */}
        {tableOfContents.length > 0 && (
          <div className="lg:hidden mb-8 rounded-sm bg-[#F5EFE4] dark:bg-[#121D2C] border border-[#E4D9C4] dark:border-[#24364D] overflow-hidden">
            <button
              onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
              className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-[#EFE8DC] dark:hover:bg-[#162436] transition-colors"
              aria-expanded={isMobileTocOpen}
            >
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-[#B58A3C]" />
                <span className="font-playfair text-base font-bold text-[#142033] dark:text-[#F8F5EE]">
                  Table of Contents
                </span>
                <span className="text-xs font-mono text-[#8C6219] dark:text-[#D8BD82] ml-1">
                  ({tableOfContents.length} sections)
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-mono text-[#B58A3C]">
                <span>{isMobileTocOpen ? 'Hide' : 'Show'}</span>
                {isMobileTocOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            </button>

            {isMobileTocOpen && (
              <div className="p-4 pt-1 border-t border-[#E6DDCA] dark:border-[#1F3045]">
                <ol className="space-y-2 text-xs sm:text-sm text-[#5F6470] dark:text-[#94A3B8]">
                  {tableOfContents.map((item, idx) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => handleScrollToHeading(e, item.id)}
                        className={`block py-1 hover:text-[#B58A3C] transition-colors ${
                          activeHeadingId === item.id
                            ? 'text-[#B58A3C] dark:text-[#D8BD82] font-semibold pl-1 border-l-2 border-[#B58A3C]'
                            : ''
                        }`}
                      >
                        <span className="font-mono text-[#B58A3C] mr-2">{idx + 1}.</span>
                        <span>{item.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Desktop Editorial Layout: Clean Main Column (720–760px) + Clean Editorial TOC Panel */}
        <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
          {/* Main Reading Column (720–760px width centered) */}
          <div className="w-full max-w-[740px] shrink-0 mx-auto">
            {/* Desktop Table of Contents: Clean editorial panel at top of article body */}
            {tableOfContents.length > 0 && (
              <aside
                aria-label="Table of contents"
                className="hidden lg:block mb-10 p-6 rounded-sm bg-[#F5EFE4] dark:bg-[#121D2C] border border-[#E4D9C4] dark:border-[#24364D]"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#E6DDCA] dark:border-[#1F3045] mb-4">
                  <div className="flex items-center gap-2">
                    <List className="w-4 h-4 text-[#B58A3C]" />
                    <h3 className="font-playfair text-lg font-bold text-[#142033] dark:text-[#F8F5EE]">
                      Table of Contents
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-[#8C6219] dark:text-[#D8BD82]">
                    Field Documentation Sequence
                  </span>
                </div>

                <ol className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-[#5F6470] dark:text-[#94A3B8]">
                  {tableOfContents.map((item, idx) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => handleScrollToHeading(e, item.id)}
                        className={`hover:text-[#B58A3C] dark:hover:text-[#D8BD82] transition-colors block py-0.5 leading-snug ${
                          activeHeadingId === item.id
                            ? 'text-[#B58A3C] dark:text-[#D8BD82] font-semibold'
                            : ''
                        }`}
                      >
                        <span className="font-mono text-[#B58A3C] mr-1.5">{idx + 1}.</span>
                        <span>{item.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </aside>
            )}

            {/* Main Editorial Text Content */}
            <ArticleContentRenderer content={post.content} />

            {/* Field Photography Gallery Module (Avalpoondurai Dedicated Section) */}
            {isAvalpoondurai && <FieldPhotographyGallery templeName={post.title} />}

            {/* Location & Visitor Information Section (Verified Protection) */}
            {isAvalpoondurai && <LocationVisitorSection templeName={post.title} />}

            {/* Tags Strip */}
            <div className="mt-12 pt-6 border-t border-[#E8E0D0] dark:border-[#1E2E42]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#94A3B8] mr-2">
                  Archival Tags:
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-xs bg-[#EFE8DA] dark:bg-[#182638] text-xs text-[#5F6470] dark:text-[#CBD5E1] border border-[#DDD3C0] dark:border-[#25374E]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Compact Editorial Sharing Row: Copy Link, WhatsApp, Facebook, Email */}
            <div className="mt-8 p-4 sm:p-5 rounded-sm bg-[#F4EFE5]/70 dark:bg-[#121D2C]/70 border border-[#E4D9C4] dark:border-[#22334A] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[#B58A3C]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#142033] dark:text-[#F8F5EE]">
                  Share this article:
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  id="copy-article-link-btn"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#FCFAF6] dark:bg-[#1A283B] border border-[#D5CABB] dark:border-[#2C415C] text-xs font-medium text-[#142033] dark:text-[#F8F5EE] hover:border-[#B58A3C] transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                      <span className="text-green-600 dark:text-green-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <span>Copy Link</span>
                  )}
                </button>

                {/* WhatsApp */}
                <button
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#FCFAF6] dark:bg-[#1A283B] border border-[#D5CABB] dark:border-[#2C415C] text-xs text-[#142033] dark:text-[#F8F5EE] hover:border-[#25D366] hover:text-[#25D366] transition-colors cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={handleShareFacebook}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#FCFAF6] dark:bg-[#1A283B] border border-[#D5CABB] dark:border-[#2C415C] text-xs text-[#142033] dark:text-[#F8F5EE] hover:border-[#1877F2] hover:text-[#1877F2] transition-colors cursor-pointer"
                  title="Share on Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="hidden sm:inline">Facebook</span>
                </button>

                {/* Email */}
                <button
                  onClick={handleShareEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#FCFAF6] dark:bg-[#1A283B] border border-[#D5CABB] dark:border-[#2C415C] text-xs text-[#142033] dark:text-[#F8F5EE] hover:border-[#B58A3C] transition-colors cursor-pointer"
                  title="Share via Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Email</span>
                </button>
              </div>
            </div>

            {/* Previous / Next Navigation Buttons (Only shown when corresponding articles exist) */}
            {(prev || next) && (
              <nav aria-label="Adjacent Articles" className="mt-12 pt-8 border-t border-[#E8E0D0] dark:border-[#1E2E42] grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prev ? (
                  <button
                    onClick={() => {
                      onSelectArticle(prev.slug);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-left p-4 rounded-sm border border-[#E0D7C4] dark:border-[#203147] bg-[#FAF7F0] dark:bg-[#111C2B] hover:border-[#B58A3C] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#718096] dark:text-[#94A3B8] mb-1">
                      <ChevronLeft className="w-3.5 h-3.5 text-[#B58A3C] group-hover:-translate-x-1 transition-transform" />
                      <span>← Previous Article</span>
                    </div>
                    <div className="font-playfair text-sm sm:text-base font-bold text-[#142033] dark:text-[#F8F5EE] line-clamp-1 group-hover:text-[#B58A3C] transition-colors">
                      {prev.title}
                    </div>
                  </button>
                ) : (
                  <div className="hidden sm:block" />
                )}

                {next ? (
                  <button
                    onClick={() => {
                      onSelectArticle(next.slug);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-right p-4 rounded-sm border border-[#E0D7C4] dark:border-[#203147] bg-[#FAF7F0] dark:bg-[#111C2B] hover:border-[#B58A3C] transition-colors group cursor-pointer sm:col-start-2"
                  >
                    <div className="flex items-center justify-end gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#718096] dark:text-[#94A3B8] mb-1">
                      <span>Next Article →</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#B58A3C] group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="font-playfair text-sm sm:text-base font-bold text-[#142033] dark:text-[#F8F5EE] line-clamp-1 group-hover:text-[#B58A3C] transition-colors">
                      {next.title}
                    </div>
                  </button>
                ) : null}
              </nav>
            )}
          </div>
        </div>
      </div>

      {/* 6. Related Articles Section (Display 3 relevant articles using existing card design) */}
      {relatedPosts.length > 0 && (
        <section className="bg-[#F2ECE0]/60 dark:bg-[#0E1724]/60 border-t border-[#E8E0D0] dark:border-[#1E2E42] py-16 px-4 sm:px-6">
          <div className="max-w-[960px] mx-auto">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E2D8C3] dark:border-[#203147]">
              <div>
                <div className="text-xs font-mono font-bold tracking-widest uppercase text-[#B58A3C] dark:text-[#D8BD82] mb-1">
                  CONTINUE READING
                </div>
                <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#142033] dark:text-[#F8F5EE]">
                  Related Articles
                </h3>
              </div>
              <button
                onClick={onNavigateBlog}
                className="text-xs font-semibold tracking-wider uppercase text-[#142033] dark:text-[#F8F5EE] hover:text-[#B58A3C] transition-colors cursor-pointer"
              >
                View All Articles →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <div
                  key={related.id}
                  onClick={() => {
                    onSelectArticle(related.slug);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group rounded-sm overflow-hidden border border-[#E2D8C3] dark:border-[#223348] bg-[#FCFAF6] dark:bg-[#121C2B] hover:border-[#B58A3C] transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="aspect-[16/10] overflow-hidden bg-[#ECE4D4] dark:bg-[#182434]">
                      <img
                        src={related.coverImage || related.image}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.src = '/images/blog/avalpoondurai/cover.jpg';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="text-[10px] font-mono tracking-widest uppercase text-[#B58A3C] mb-1.5">
                        {related.category}
                      </div>
                      <h4 className="font-playfair text-base font-bold text-[#142033] dark:text-[#F8F5EE] group-hover:text-[#B58A3C] transition-colors line-clamp-2 mb-2 leading-snug">
                        {related.title}
                      </h4>
                      <p className="text-xs text-[#718096] dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
                        {related.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 pt-0 text-[11px] font-mono text-[#8C95A6] flex items-center justify-between border-t border-[#F0E9DC] dark:border-[#1E2E44] mt-2 pt-2">
                    <span>{related.readingTime || related.readTime}</span>
                    <span className="text-[#B58A3C] font-sans font-semibold group-hover:translate-x-0.5 transition-transform">
                      Read →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
