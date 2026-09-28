import React, { useState, useMemo, useEffect } from 'react';
import { BookOpen, Compass, Sparkles, ChevronRight, Home, Search } from 'lucide-react';
import { GoldLeafBranch } from '../components/Icons';
import { BlogFeaturedCard } from '../components/blog/BlogFeaturedCard';
import { BlogCard } from '../components/blog/BlogCard';
import { BlogFilters } from '../components/blog/BlogFilters';
import {
  getAllBlogPosts,
  getFeaturedBlogPost,
  filterBlogPosts,
} from '../data/blogPosts';
import { subscribeToBlogUpdates } from '../services/localBlogStorage';

interface BlogIndexPageProps {
  onNavigateHome: () => void;
  onSelectArticle: (slug: string) => void;
}

export function BlogIndexPage({ onNavigateHome, onSelectArticle }: BlogIndexPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updateTick, setUpdateTick] = useState<number>(0);

  useEffect(() => {
    return subscribeToBlogUpdates(() => setUpdateTick((t) => t + 1));
  }, []);

  const featuredPost = useMemo(() => getFeaturedBlogPost(), [updateTick]);

  // Filtered posts based on category and search query
  const filteredPosts = useMemo(() => {
    return filterBlogPosts({
      category: selectedCategory,
      searchQuery: searchQuery,
    });
  }, [selectedCategory, searchQuery, updateTick]);

  // SEO updates and Breadcrumb Schema.org structured data
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'Stories, Heritage & Ideas — Blog | Anandh Jain Pujari';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    const previousDesc = metaDesc.getAttribute('content') || '';
    metaDesc.setAttribute(
      'content',
      'Exploring Jain heritage, temple documentation, photography, design, technology and the stories behind my work by Anandh Jain Pujari.'
    );

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}/blog`);

    // Structured data: Breadcrumbs
    const schemaScriptId = 'blog-index-breadcrumb-schema';
    let script = document.getElementById(schemaScriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = schemaScriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    const breadcrumbData = {
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
          name: 'Blog — Stories, Heritage & Ideas',
          item: `${window.location.origin}/blog`,
        },
      ],
    };
    script.text = JSON.stringify(breadcrumbData);

    return () => {
      document.title = originalTitle;
      if (metaDesc) metaDesc.setAttribute('content', previousDesc);
      const existingScript = document.getElementById(schemaScriptId);
      if (existingScript) existingScript.remove();
    };
  }, []);

  return (
    <div className="bg-[#F8F5EE] dark:bg-[#0B131E] min-h-screen text-[#142033] dark:text-[#F8F5EE] transition-colors duration-300">
      {/* Top Editorial Breadcrumb Bar */}
      <div className="border-b border-[#E8E0D0] dark:border-[#1E2E42] bg-[#F2ECE0]/70 dark:bg-[#0E1826]/70 backdrop-blur-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs text-[#5F6470] dark:text-[#94A3B8]">
          <nav className="flex items-center space-x-2">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1 hover:text-[#B58A3C] transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#A0AEC0] dark:text-[#64748B]" />
            <span className="font-semibold text-[#142033] dark:text-[#F8F5EE]">
              Stories, Heritage & Ideas
            </span>
          </nav>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#718096] dark:text-[#94A3B8]">
            <BookOpen className="w-3.5 h-3.5 text-[#B58A3C]" />
            <span>Digital Archive & Field Notes</span>
          </div>
        </div>
      </div>

      {/* Hero Header Section */}
      <section className="pt-12 sm:pt-16 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xs bg-[#EAE2D2] dark:bg-[#182638] text-[#8C6219] dark:text-[#D8BD82] border border-[#DDD0B8] dark:border-[#2C3F58] mb-4 text-xs font-mono tracking-widest uppercase">
            <GoldLeafBranch className="w-3.5 h-3.5" />
            <span>JOURNAL & FIELD ARCHIVES</span>
          </div>

          {/* Heading */}
          <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight leading-[1.18] mb-4">
            Stories, Heritage & Ideas
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#5F6470] dark:text-[#94A3B8] font-normal leading-relaxed">
            Exploring Jain heritage, temple documentation, photography, design, technology and the
            stories behind my work.
          </p>

          <div className="h-0.5 w-24 bg-[#B58A3C] mt-6" />
        </div>
      </section>

      {/* Featured Article Section (Only show when not searching or on All) */}
      {!searchQuery && selectedCategory === 'All' && featuredPost && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-16">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B58A3C]" />
              <h2 className="text-xs font-mono font-bold tracking-[0.2em] uppercase text-[#718096] dark:text-[#94A3B8]">
                Featured Article
              </h2>
            </div>
            <span className="text-xs text-[#8C95A6] font-mono hidden sm:inline">
              Selected Field Study
            </span>
          </div>

          <BlogFeaturedCard post={featuredPost} onReadArticle={onSelectArticle} />
        </section>
      )}

      {/* Controls: Search and Categories */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-10">
        <div className="p-5 sm:p-6 rounded-sm bg-[#F3EDE2]/70 dark:bg-[#131F30]/70 border border-[#E4DBC8] dark:border-[#22334A]">
          <BlogFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
      </section>

      {/* Latest Articles Grid Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-24">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-[#E2D8C3] dark:border-[#203147]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B58A3C]" />
            <h2 className="font-playfair text-2xl font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight">
              {searchQuery || selectedCategory !== 'All' ? 'Filtered Articles' : 'Latest Articles'}
            </h2>
          </div>
          <span className="text-xs font-mono text-[#718096] dark:text-[#94A3B8]">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
          </span>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-7 sm:gap-8">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} onSelect={onSelectArticle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 rounded-sm border border-dashed border-[#DCD3BF] dark:border-[#26374F] bg-[#FAF7F0] dark:bg-[#111C2B]">
            <Search className="w-8 h-8 text-[#A0AEC0] mx-auto mb-3" />
            <h3 className="font-playfair text-xl font-bold text-[#142033] dark:text-[#F8F5EE] mb-2">
              No matching articles found
            </h3>
            <p className="text-sm text-[#718096] dark:text-[#94A3B8] max-w-md mx-auto mb-6">
              We couldn't find any articles matching "{searchQuery}". Try selecting another category
              or clearing your search filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-xs bg-[#142033] text-white dark:bg-[#F8F5EE] dark:text-[#142033]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
