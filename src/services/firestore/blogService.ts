/**
 * Blog Service (Firestore with Local Fallback)
 * 
 * Provides an asynchronous data layer for blog posts.
 * When Firebase is configured, synchronizes with the `blogPosts` collection.
 * When Firebase is unconfigured or during offline mode, seamlessly falls back
 * to the verified local archive in `src/data/blogPosts.ts`.
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import { getFirestoreDb } from '../firebase/app';
import { getFirebaseConfigStatus } from '../firebase/config';
import { COLLECTIONS, ArticleDocument } from './collections';
import { handleFirestoreError, OperationType } from './errorHandler';
import { BLOG_POSTS } from '../../data/blogPosts';
import {
  getLocalArticles,
  getLocalArticleBySlugOrId,
  saveLocalArticle,
  deleteLocalArticle,
  toggleLocalPublish,
  toggleLocalFeatured,
} from '../localBlogStorage';
import { BlogPost } from '../../types';

/**
 * Normalizes a Firestore document or local BlogPost into a unified BlogPost object
 */
function normalizePost(docData: any): BlogPost {
  const isPublished = docData.published !== undefined ? !!docData.published : (docData.status === 'published');
  return {
    id: docData.id || docData.slug,
    slug: docData.slug,
    title: docData.title,
    subtitle: docData.subtitle || docData.excerpt,
    category: docData.category || 'Jain Heritage',
    categorySlug: docData.categorySlug || 'jain-heritage',
    badgeBg: docData.badgeBg || 'bg-[#F4ECD8] text-[#8C6219] dark:bg-[#342816] dark:text-[#E4C381]',
    badgeText: docData.badgeText || 'text-[#8C6219] dark:text-[#E4C381]',
    excerpt: docData.excerpt || '',
    coverImage: docData.coverImage || docData.image || '/images/blog/avalpoondurai/cover.jpg',
    image: docData.image || docData.coverImage || '/images/blog/avalpoondurai/cover.jpg',
    tags: Array.isArray(docData.tags) ? docData.tags : [],
    author: typeof docData.author === 'object' && docData.author !== null
      ? docData.author
      : {
          name: typeof docData.author === 'string' ? docData.author : 'Anandh Jain Pujari',
          role: docData.authorBio || 'Jain Temple Priest & Heritage Documentarian',
          avatar: '/images/about/anandh-jain-pujari.jpg',
        },
    publishedDate: docData.publishedAt || docData.publishedDate || docData.date || 'Sep 12, 2025',
    updatedDate: docData.updatedAt || docData.updatedDate || 'Sep 18, 2025',
    date: docData.publishedAt || docData.publishedDate || docData.date || 'Sep 12, 2025',
    readTime: docData.readingTime || docData.readTime || '7 min read',
    readingTime: docData.readingTime || docData.readTime || '7 min read',
    featured: !!docData.featured,
    status: isPublished ? 'published' : 'draft',
    seoTitle: docData.seoTitle || `${docData.title} | Anandh Jain Pujari`,
    seoDescription: docData.seoDescription || docData.excerpt || '',
    ogImage: docData.coverImage || docData.ogImage,
    createdAt: docData.createdAt || new Date().toISOString(),
    updatedAt: docData.updatedAt || new Date().toISOString(),
    content: Array.isArray(docData.content) ? docData.content : [docData.content || ''],
  };
}

/**
 * Fetch all published blog posts (or all posts if includeDrafts is true)
 */
export async function getBlogPosts(options?: {
  includeDrafts?: boolean;
}): Promise<BlogPost[]> {
  const status = getFirebaseConfigStatus();

  // If Firebase is not configured, return local dataset
  if (!status.isConfigured) {
    return getLocalArticles(options);
  }

  const db = getFirestoreDb();
  if (!db) {
    return getLocalArticles(options);
  }

  try {
    // Primary query on 'articles' collection
    const articlesCol = collection(db, COLLECTIONS.ARTICLES);
    const snapshot = await getDocs(articlesCol);

    if (snapshot.empty) {
      // Check legacy collection
      const legacyCol = collection(db, COLLECTIONS.LEGACY_BLOG_POSTS);
      const legacySnap = await getDocs(legacyCol);
      if (!legacySnap.empty) {
        const posts = legacySnap.docs.map((docSnap) =>
          normalizePost({ id: docSnap.id, ...docSnap.data() })
        );
        return options?.includeDrafts ? posts : posts.filter((p) => p.status === 'published');
      }
      // If Firestore collection is empty, return local verified articles
      return getLocalArticles(options);
    }

    let posts = snapshot.docs.map((docSnap) =>
      normalizePost({ id: docSnap.id, ...docSnap.data() })
    );

    if (!options?.includeDrafts) {
      posts = posts.filter((p) => p.status === 'published');
    }

    return posts;
  } catch (error) {
    console.warn('Firestore blog fetch encountered an error. Falling back to local data:', error);
    return getLocalArticles(options);
  }
}

/**
 * Fetch a single blog post by its slug.
 * Guarantees that existing /blog/:slug URLs continue working seamlessly.
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const status = getFirebaseConfigStatus();

  // If not configured, immediately use local verified data
  if (!status.isConfigured) {
    return getLocalArticleBySlugOrId(slug);
  }

  const db = getFirestoreDb();
  if (!db) {
    return getLocalArticleBySlugOrId(slug);
  }

  try {
    const colRef = collection(db, COLLECTIONS.ARTICLES);
    const q = query(colRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      return normalizePost({ id: docSnap.id, ...docSnap.data() });
    }

    // Check by ID if not found by slug
    const docRef = doc(db, COLLECTIONS.ARTICLES, slug);
    const byIdSnap = await getDoc(docRef);
    if (byIdSnap.exists()) {
      return normalizePost({ id: byIdSnap.id, ...byIdSnap.data() });
    }

    // Check legacy collection
    const legacyDocRef = doc(db, COLLECTIONS.LEGACY_BLOG_POSTS, slug);
    const legacySnap = await getDoc(legacyDocRef);
    if (legacySnap.exists()) {
      return normalizePost({ id: legacySnap.id, ...legacySnap.data() });
    }

    // Fallback to local verified archive
    return getLocalArticleBySlugOrId(slug);
  } catch (error) {
    console.warn(`Firestore getBlogPostBySlug("${slug}") failed, using fallback:`, error);
    return getLocalArticleBySlugOrId(slug);
  }
}

/**
 * Create or update blog post in Firestore (admin operation)
 * Also updates local storage to keep local backup synchronized.
 */
export async function saveBlogPost(post: Partial<ArticleDocument> & { title: string; slug?: string }): Promise<string> {
  const id = post.id || post.slug || `post-${Date.now()}`;
  const now = new Date().toISOString();
  const isPublished = post.published !== undefined ? post.published : post.status === 'published';

  const normalizedAuthor = typeof post.author === 'object' && post.author !== null
    ? {
        name: post.author.name || 'Anandh Jain Pujari',
        role: post.author.role || post.authorBio || 'Jain Temple Priest & Heritage Documentarian',
        avatar: post.author.avatar || '/images/about/anandh-jain-pujari.jpg',
      }
    : {
        name: typeof post.author === 'string' ? post.author : 'Anandh Jain Pujari',
        role: post.authorBio || 'Jain Temple Priest & Heritage Documentarian',
        avatar: '/images/about/anandh-jain-pujari.jpg',
      };

  // Always keep local storage in sync as an offline/rollback backup
  saveLocalArticle({
    ...post,
    id,
    title: post.title,
    slug: post.slug || id,
    content: Array.isArray(post.content) ? post.content : [typeof post.content === 'string' ? post.content : ''],
    author: normalizedAuthor,
    status: isPublished ? 'published' : 'draft',
    published: isPublished,
  });

  const status = getFirebaseConfigStatus();
  if (!status.isConfigured) {
    return id;
  }

  const db = getFirestoreDb();
  if (!db) {
    return id;
  }

  const path = `${COLLECTIONS.ARTICLES}/${id}`;

  const data: ArticleDocument = {
    id,
    title: post.title,
    slug: post.slug || id,
    excerpt: post.excerpt || '',
    content: typeof post.content === 'string' ? post.content : (Array.isArray(post.content) ? post.content.join('\n\n') : ''),
    coverImage: post.coverImage || '/images/blog/avalpoondurai/cover.jpg',
    category: post.category || 'Jain Heritage',
    categorySlug: post.categorySlug || 'jain-heritage',
    tags: post.tags || [],
    author: post.author || {
      name: 'Anandh Jain Pujari',
      role: 'Jain Temple Priest & Heritage Documentarian',
      avatar: '/images/about/anandh-jain-pujari.jpg',
    },
    authorBio: post.authorBio || 'Jain Temple Priest & Heritage Documentarian',
    published: isPublished,
    featured: !!post.featured,
    publishedAt: post.publishedAt || post.publishedDate || now.split('T')[0],
    publishedDate: post.publishedDate || post.publishedAt || now.split('T')[0],
    updatedAt: now,
    readingTime: post.readingTime || '5 min read',
    seoTitle: post.seoTitle || `${post.title} | Anandh Jain Pujari`,
    seoDescription: post.seoDescription || post.excerpt || '',
    createdAt: post.createdAt || now,
    status: isPublished ? 'published' : 'draft',
  };

  try {
    const docRef = doc(db, COLLECTIONS.ARTICLES, id);
    await setDoc(docRef, data, { merge: true });

    // Also mirror to legacy collection
    const legacyDocRef = doc(db, COLLECTIONS.LEGACY_BLOG_POSTS, id);
    await setDoc(legacyDocRef, data, { merge: true });

    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return id;
  }
}

/**
 * Toggle publish status of an article
 */
export async function toggleArticlePublish(id: string): Promise<boolean> {
  const localArticle = toggleLocalPublish(id);
  const newStatus = localArticle ? localArticle.status === 'published' : true;

  const status = getFirebaseConfigStatus();
  if (!status.isConfigured) {
    return newStatus;
  }

  const db = getFirestoreDb();
  if (!db) return newStatus;

  try {
    const docRef = doc(db, COLLECTIONS.ARTICLES, id);
    await updateDoc(docRef, {
      published: newStatus,
      status: newStatus ? 'published' : 'draft',
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Could not update published state in Firestore:', e);
  }

  return newStatus;
}

/**
 * Toggle featured status of an article
 */
export async function toggleArticleFeatured(id: string): Promise<boolean> {
  const localArticle = toggleLocalFeatured(id);
  const newFeatured = localArticle ? !!localArticle.featured : false;

  const status = getFirebaseConfigStatus();
  if (!status.isConfigured) {
    return newFeatured;
  }

  const db = getFirestoreDb();
  if (!db) return newFeatured;

  try {
    const docRef = doc(db, COLLECTIONS.ARTICLES, id);
    await updateDoc(docRef, {
      featured: newFeatured,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Could not update featured state in Firestore:', e);
  }

  return newFeatured;
}

/**
 * Delete blog post from Firestore (admin operation)
 * Also removes from local storage.
 */
export async function deleteBlogPost(id: string): Promise<void> {
  deleteLocalArticle(id);

  const status = getFirebaseConfigStatus();
  if (!status.isConfigured) {
    return;
  }

  const db = getFirestoreDb();
  if (!db) {
    return;
  }

  const path = `${COLLECTIONS.ARTICLES}/${id}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.ARTICLES, id));
    await deleteDoc(doc(db, COLLECTIONS.LEGACY_BLOG_POSTS, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

