export interface BlogPostAuthor {
  name: string;
  role: string;
  avatar?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[] | string;
  coverImage: string;
  category: string;
  categorySlug?: string;
  tags: string[];
  author: BlogPostAuthor;
  authorBio?: string;
  publishedDate: string;
  publishedAt?: string;
  updatedDate?: string;
  readingTime: string;
  featured: boolean;
  published?: boolean;
  status: 'published' | 'draft' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  createdAt: string;
  updatedAt: string;
  subtitle?: string;
  date?: string;
  readTime?: string;
  image?: string;
  badgeBg?: string;
  badgeText?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  categorySlug: string;
  badgeBg?: string;
  badgeText?: string;
  date: string;
  updated?: string;
  readTime: string;
  readingTime?: string;
  image: string;
  coverImage?: string;
  excerpt: string;
  content: string[];
  tags: string[];
  author?: {
    name: string;
    role: string;
    avatar?: string;
  };
  featured?: boolean;
  publishedDate?: string;
  updatedDate?: string;
  status?: 'published' | 'draft' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  subtext: string;
  iconName: string;
  bgColor: string;
  iconColor: string;
  borderColor: string;
  isSpecial?: boolean;
}

export interface Temple {
  id: string;
  name: string;
  slug: string;
  town: string;
  location: string;
  district: string;
  description: string;
  coverImage: string;
  image: string;
  gallery?: string[];
  history?: string;
  architecture?: string;
  deity: string;
  tradition?: string;
  inscriptions?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  contact?: string;
  featured?: boolean;
  era?: string;
  features?: string[];
  hasVerifiedPhoto?: boolean;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  icon: string;
  iconName?: string;
  coverImage?: string;
  tags?: string[];
  featured?: boolean;
  bgColor?: string;
  iconColor?: string;
  borderColor?: string;
  tools?: string[];
}

export interface StatItem {
  value: string;
  label: string;
}
