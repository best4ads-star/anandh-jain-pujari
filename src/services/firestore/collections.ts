/**
 * Firestore Collection Definitions & Content Document Schemas
 * 
 * Defines standard collection constants and typed document interfaces.
 * Every editable document supports: id, createdAt, updatedAt.
 */

export const COLLECTIONS = {
  USERS: 'users',
  ARTICLES: 'articles',
  BLOG_POSTS: 'articles',
  LEGACY_BLOG_POSTS: 'blogPosts',
  TEMPLES: 'temples',
  HERITAGE: 'heritage',
  PHOTOGRAPHY: 'photography',
  PROJECTS: 'projects',
  PAGES: 'pages',
  CATEGORIES: 'categories',
  HERO_SETTINGS: 'heroSettings',
  SITE_SETTINGS: 'siteSettings',
  SEO_SETTINGS: 'seoSettings',
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

// Base document interface with standard timestamps and ID
export interface BaseDocument {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// User Document (users/{uid})
export interface UserDocument extends BaseDocument {
  email: string;
  displayName: string;
  role: 'superadmin' | 'admin' | 'editor' | 'viewer';
  avatarUrl?: string;
}

// Article Document (articles/{id})
export interface ArticleDocument extends BaseDocument {
  title: string;
  slug: string;
  excerpt: string;
  content: string | string[];
  coverImage: string;
  category: string;
  categorySlug?: string;
  tags: string[];
  author: {
    name: string;
    role?: string;
    avatar?: string;
  } | string;
  authorBio?: string;
  published: boolean;
  featured: boolean;
  publishedAt: string;
  publishedDate?: string;
  readingTime: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: 'published' | 'draft' | 'archived';
}

// BlogPost Document alias for backward compatibility
export type BlogPostDocument = ArticleDocument;

// Temple Document (temples/{id})
export interface TempleDocument extends BaseDocument {
  name: string;
  slug: string;
  deity: string;
  location: string;
  era: string;
  description: string;
  status: 'published' | 'draft';
  images?: string[];
}

// Heritage Document (heritage/{id})
export interface HeritageDocument extends BaseDocument {
  title: string;
  slug: string;
  summary: string;
  details: string;
  status: 'published' | 'draft';
  media?: string[];
}

// Photography Document (photography/{id})
export interface PhotographyDocument extends BaseDocument {
  title: string;
  category: 'architecture' | 'sanctum' | 'inscriptions' | 'field';
  imageUrl: string;
  caption: string;
  location?: string;
  status: 'published' | 'draft';
}

// Project Document (projects/{id})
export interface ProjectDocument extends BaseDocument {
  title: string;
  slug: string;
  description: string;
  category: string;
  link?: string;
  status: 'published' | 'draft';
}

// Page Document (pages/{id})
export interface PageDocument extends BaseDocument {
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
}

// Category Document (categories/{id})
export interface CategoryDocument extends BaseDocument {
  name: string;
  slug: string;
  description?: string;
  type: 'blog' | 'temple' | 'heritage' | 'photography' | 'project';
}

// Hero Settings Document (heroSettings/default)
export interface HeroSettingsDocument {
  id: string;
  greeting: string;
  title: string;
  subtitle: string;
  quote: string;
  quoteAuthor: string;
  status: 'published' | 'draft';
  updatedAt: string;
}

// Site Settings Document (siteSettings/general)
export interface SiteSettingsDocument {
  id: string;
  siteName: string;
  tagline: string;
  contactEmail: string;
  socialLinks?: Record<string, string>;
  updatedAt: string;
}

// SEO Settings Document (seoSettings/global)
export interface SeoSettingsDocument {
  id: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultOgImage?: string;
  updatedAt: string;
}
