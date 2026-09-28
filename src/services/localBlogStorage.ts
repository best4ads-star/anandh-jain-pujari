/**
 * Local Blog Storage Service
 * 
 * Provides durable browser-persisted CRUD operations for blog posts.
 * Pre-seeded with the verified Anandh Jain Pujari heritage articles.
 * Allows full offline testing and administration of the Blog CMS
 * without requiring Firebase. Emits reactive events on mutations.
 */

import { BlogPost } from '../types';
import { BLOG_POSTS as INITIAL_SEED_POSTS } from '../data/blogPosts';

const STORAGE_KEY = 'anandh_blog_articles_v1';
const EVENT_NAME = 'anandh_blog_updated';

/**
 * Generates an SEO-friendly URL slug from a title
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start
    .replace(/-+$/, ''); // Trim - from end
}

/**
 * Calculates reading time from markdown/text content
 */
export function calculateReadingTime(content: string[] | string): string {
  const text = Array.isArray(content) ? content.join(' ') : content || '';
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Initializes and retrieves the local articles collection
 */
export function getLocalArticles(options?: { includeDrafts?: boolean }): BlogPost[] {
  if (typeof window === 'undefined') {
    return options?.includeDrafts ? INITIAL_SEED_POSTS : INITIAL_SEED_POSTS.filter((p) => p.status === 'published');
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial verified articles
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_POSTS));
      return options?.includeDrafts
        ? INITIAL_SEED_POSTS
        : INITIAL_SEED_POSTS.filter((p) => p.status === 'published');
    }

    const parsed: BlogPost[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_POSTS));
      return options?.includeDrafts
        ? INITIAL_SEED_POSTS
        : INITIAL_SEED_POSTS.filter((p) => p.status === 'published');
    }

    if (options?.includeDrafts) {
      return parsed;
    }
    return parsed.filter((p) => p.status === 'published');
  } catch (err) {
    console.warn('Failed to read blog posts from localStorage, falling back to seed:', err);
    return options?.includeDrafts
      ? INITIAL_SEED_POSTS
      : INITIAL_SEED_POSTS.filter((p) => p.status === 'published');
  }
}

/**
 * Retrieves a single article by its slug or ID
 */
export function getLocalArticleBySlugOrId(identifier: string): BlogPost | undefined {
  const articles = getLocalArticles({ includeDrafts: true });
  const cleanId = identifier.trim().toLowerCase();
  return articles.find(
    (a) => a.slug.toLowerCase() === cleanId || a.id.toLowerCase() === cleanId
  );
}

/**
 * Saves (Creates or Updates) an article in local storage
 */
export function saveLocalArticle(articleData: Partial<BlogPost> & { title: string }): BlogPost {
  const articles = getLocalArticles({ includeDrafts: true });
  const now = new Date().toISOString();
  const dateFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const slug = articleData.slug?.trim() ? slugify(articleData.slug) : slugify(articleData.title);
  const existingIndex = articles.findIndex(
    (a) => a.id === articleData.id || a.slug === slug || (articleData.id && a.id === articleData.id)
  );

  let updatedArticle: BlogPost;

  if (existingIndex >= 0) {
    // Update existing article
    const existing = articles[existingIndex];
    updatedArticle = {
      ...existing,
      ...articleData,
      id: existing.id || slug,
      slug: slug || existing.slug,
      title: articleData.title.trim(),
      subtitle: articleData.subtitle || articleData.excerpt || existing.subtitle,
      excerpt: articleData.excerpt || existing.excerpt,
      content: articleData.content ?? existing.content,
      coverImage: articleData.coverImage || existing.coverImage || '/images/blog/avalpoondurai/cover.jpg',
      image: articleData.coverImage || existing.image || '/images/blog/avalpoondurai/cover.jpg',
      category: articleData.category || existing.category || 'Jain Heritage',
      categorySlug: slugify(articleData.category || existing.category || 'Jain Heritage'),
      tags: Array.isArray(articleData.tags) ? articleData.tags : existing.tags,
      author: articleData.author || existing.author || {
        name: 'Anandh Jain Pujari',
        role: 'Jain Temple Priest & Heritage Documentarian',
        avatar: '/images/about/anandh-jain-pujari.jpg',
      },
      readingTime:
        articleData.readingTime ||
        (articleData.content ? calculateReadingTime(articleData.content) : existing.readingTime),
      readTime:
        articleData.readingTime ||
        (articleData.content ? calculateReadingTime(articleData.content) : existing.readingTime),
      status: articleData.status || existing.status || 'published',
      featured: articleData.featured !== undefined ? articleData.featured : existing.featured,
      seoTitle: articleData.seoTitle || `${articleData.title.trim()} | Anandh Jain Pujari`,
      seoDescription: articleData.seoDescription || articleData.excerpt || existing.seoDescription,
      ogImage: articleData.coverImage || existing.ogImage,
      publishedDate: articleData.publishedDate || existing.publishedDate || dateFormatted,
      date: articleData.publishedDate || existing.date || dateFormatted,
      updatedDate: dateFormatted,
      updatedAt: now,
    };
    articles[existingIndex] = updatedArticle;
  } else {
    // Create new article
    const newId = articleData.id || `post-${Date.now()}-${slug.slice(0, 20)}`;
    updatedArticle = {
      id: newId,
      slug: slug,
      title: articleData.title.trim(),
      subtitle: articleData.subtitle || articleData.excerpt || '',
      excerpt: articleData.excerpt || '',
      content: articleData.content || ['## Introduction\n\nEnter article content here...'],
      coverImage: articleData.coverImage || '/images/blog/avalpoondurai/cover.jpg',
      image: articleData.coverImage || '/images/blog/avalpoondurai/cover.jpg',
      category: articleData.category || 'Jain Heritage',
      categorySlug: slugify(articleData.category || 'Jain Heritage'),
      tags: Array.isArray(articleData.tags) && articleData.tags.length > 0 ? articleData.tags : ['Jain Heritage'],
      author: articleData.author || {
        name: 'Anandh Jain Pujari',
        role: 'Jain Temple Priest & Heritage Documentarian',
        avatar: '/images/about/anandh-jain-pujari.jpg',
      },
      readingTime: articleData.readingTime || calculateReadingTime(articleData.content || ''),
      readTime: articleData.readingTime || calculateReadingTime(articleData.content || ''),
      status: articleData.status || 'published',
      featured: Boolean(articleData.featured),
      seoTitle: articleData.seoTitle || `${articleData.title.trim()} | Anandh Jain Pujari`,
      seoDescription: articleData.seoDescription || articleData.excerpt || '',
      ogImage: articleData.coverImage || '/images/blog/avalpoondurai/cover.jpg',
      publishedDate: articleData.publishedDate || dateFormatted,
      date: articleData.publishedDate || dateFormatted,
      updatedDate: dateFormatted,
      createdAt: now,
      updatedAt: now,
    };
    articles.unshift(updatedArticle);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { article: updatedArticle } }));
    }
  } catch (e) {
    console.error('Failed to save article to localStorage:', e);
  }

  return updatedArticle;
}

/**
 * Deletes an article by ID
 */
export function deleteLocalArticle(id: string): boolean {
  const articles = getLocalArticles({ includeDrafts: true });
  const filtered = articles.filter((a) => a.id !== id && a.slug !== id);

  if (filtered.length === articles.length) {
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { deletedId: id } }));
    }
    return true;
  } catch (e) {
    console.error('Failed to delete article from localStorage:', e);
    return false;
  }
}

/**
 * Toggles an article's published status
 */
export function toggleLocalPublish(id: string): BlogPost | undefined {
  const article = getLocalArticleBySlugOrId(id);
  if (!article) return undefined;

  const newStatus = article.status === 'published' ? 'draft' : 'published';
  return saveLocalArticle({
    ...article,
    status: newStatus,
  });
}

/**
 * Toggles whether an article is featured
 */
export function toggleLocalFeatured(id: string): BlogPost | undefined {
  const article = getLocalArticleBySlugOrId(id);
  if (!article) return undefined;

  return saveLocalArticle({
    ...article,
    featured: !article.featured,
  });
}

/**
 * Restores the initial seed articles
 */
export function resetLocalArticlesToSeed(): BlogPost[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_POSTS));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    }
    return INITIAL_SEED_POSTS;
  } catch (e) {
    console.error('Failed to reset articles:', e);
    return INITIAL_SEED_POSTS;
  }
}

/**
 * Subscribes to article updates across components
 */
export function subscribeToBlogUpdates(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      callback();
    }
  });

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
  };
}
