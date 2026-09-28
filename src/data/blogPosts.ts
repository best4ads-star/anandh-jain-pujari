import { BlogPost } from '../types';
import { getLocalArticles, getLocalArticleBySlugOrId } from '../services/localBlogStorage';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'avalpoondurai-jain-temple-spiritual-legacy',
    slug: 'avalpoondurai-jain-temple-spiritual-legacy',
    title: 'Avalpoondurai Jain Temple — A Spiritual Legacy',
    subtitle: 'A Spiritual Legacy in Kongu Nadu',
    category: 'Jain Heritage',
    categorySlug: 'jain-heritage',
    badgeBg: 'bg-[#F4ECD8] text-[#8C6219] dark:bg-[#342816] dark:text-[#E4C381]',
    badgeText: 'text-[#8C6219] dark:text-[#E4C381]',
    excerpt:
      "Exploring the history, architecture, traditions and living heritage of one of Erode's Jain temple heritage sites.",
    coverImage: '/images/blog/avalpoondurai/cover.jpg',
    image: '/images/blog/avalpoondurai/cover.jpg',
    tags: ['Jain Heritage', 'Avalpoondurai', 'Erode', 'Kongu Nadu', 'Temple Documentation', 'Parshwanatha'],
    author: {
      name: 'Anandh Jain Pujari',
      role: 'Jain Temple Priest & Heritage Documentarian',
      avatar: '/images/about/anandh-jain-pujari.jpg',
    },
    publishedDate: 'September 12, 2025',
    updatedDate: 'September 18, 2025',
    date: 'Sep 12, 2025',
    readTime: '7 min read',
    readingTime: '7 min read',
    featured: true,
    status: 'published',
    seoTitle: 'Avalpoondurai Jain Temple — A Spiritual Legacy | Anandh Jain Pujari',
    seoDescription:
      "Documentation of Avalpoondurai Jain Temple in Erode district by Anandh Jain Pujari. Explore temple architecture, traditions, photography and heritage significance.",
    ogImage: '/images/blog/avalpoondurai/cover.jpg',
    createdAt: '2025-09-12T08:00:00Z',
    updatedAt: '2025-09-18T10:30:00Z',
    content: [
      `## Introduction

Avalpoondurai is a historic village situated in the Erode district of Tamil Nadu, renowned among cultural historians and pilgrims for its sacred Jain heritage. As part of our ongoing digital documentation of sacred sites across the Kongu Nadu region, this record is established to systematically document the temple's architectural elements, worship traditions, and cultural importance.

The temple stands as an enduring sanctuary of prayer and Ahimsa (non-violence), serving as a spiritual anchor for local devotees and travellers tracing the ancient Jain pilgrimage route across western Tamil Nadu.`,

      `## About the Temple

The Avalpoondurai Jain Temple is dedicated to the revered 23rd Tirthankara, Bhagwan Parshwanatha. Surrounded by the pastoral calm of Kongu countryside, the temple serves as an active place of daily worship, reflection, and festive observances.

[VERIFIED CONTENT TO BE ADDED: Full local name of the trust/sanctum committee, daily pooja schedule, and administrative details will be updated upon physical verification.]`,

      `## Historical Background

The Kongu Nadu region—encompassing modern Erode, Coimbatore, Tirupur, and Salem—possesses a continuous Jain presence dating back to the early centuries of the Common Era, as attested by caverns, stone beds, and classical Tamil literature. Avalpoondurai forms a notable node along this sacred landscape.

[VERIFIED CONTENT TO BE ADDED: Verified historical establishment date, specific ruling dynasty patron records, and original consecration timeline remain under field study. Fictional dates and dynasties are strictly omitted until corroborated by epigraphical sources.]`,

      `## Temple Architecture

The shrine reflects traditional Dravidian temple architectural conventions adapted to Jain ritual requirements. The complex features an entrance gateway, an ardhamandapa, a mahamandapa, and the central garbhagriha (sanctum sanctorum).

The vimana above the sanctum showcases stone moldings with niches housing representations of Yakshas and Yakshis. The interior pillars carry modest geometric and floral motifs typical of regional stone craftsmanship.

[VERIFIED CONTENT TO BE ADDED: Detailed architectural dimension measurements, complete stone classification, and structural renovation history will be cataloged during the upcoming survey.]`,

      `## Tirthankara / Main Deity

The primary sanctum enshrines the serene granite idol of Bhagwan Parshwanatha seated in Padmasana posture. He is depicted with the characteristic seven-hooded serpent (Dharanendra Yaksha) sheltering his head in protective majesty. The countenance exhibits the meditative tranquility (Veetaraga bhava) that exemplifies Jain iconography.

Along with the main Tirthankara, the temple enshrines the attendant Yaksha Dharanendra and Yakshi Padmavati Devi, receiving dedicated worship and regular floral offerings.`,

      `## Inscriptions & Historical Evidence

Epigraphical records in Tamil Nadu provide indispensable chronological anchors for dating heritage temples and understanding land endowments or merchant guild contributions.

[VERIFIED CONTENT TO BE ADDED: Inscription texts, Vatteluttu or medieval Tamil transcriptions, government epigraphy report citations (ARE), and donor names are currently undergoing verification with heritage scholars and epigraphists.]`,

      `## Jain Traditions & Worship

Daily rituals at Avalpoondurai follow Digambara Jain traditions of sacred worship:
- **Morning Abhishekam**: Traditional ritual cleansing of the deities with pure water and sacred offerings.
- **Ashtavidha Archana**: The eightfold offerings symbolized by rice, flowers, incense, lamps, and fruits.
- **Namokar Mantra Chanting**: Communal recitation honoring the five supreme beings (Pancha Parameshti).
- **Annual Festivals**: Special observances during Mahavira Jayanti, Parshwanatha Moksha Kalyanak, and the holy period of Paryushan/Daslakshana Parva.`,

      `## Temple Photographs

Visual documentation is central to preserving this heritage for posterity. A dedicated field photography gallery is maintained below supporting verified architectural views, sanctum details, and stone inscriptions.`,

      `## Location & Visitor Information

[VERIFIED LOCATION INFORMATION TO BE ADDED: Specific street address, GPS geo-coordinates, sanctum contact records, daily pooja timings, and visitor guidelines are undergoing authentication. Detailed visitor information and Google Maps integration will be provided once physically surveyed.]`,

      `## Heritage Significance

Avalpoondurai serves as a living testimony to the spiritual and cultural values that have shaped Tamil Nadu's communal fabric for centuries. It stands alongside Vijayamangalam, Thingalur, Vellode, and Seenapuram as essential touchpoints of the Jain legacy in Kongu Nadu.

Digital preservation ensures that even if geographic distances prevent scholars or young community members from visiting immediately, the knowledge, aesthetic spirit, and ethical teachings of this temple remain accessible worldwide.`,

      `## Conclusion

Preserving living heritage requires both reverent devotion and modern dedication. Through structured digital documentation, field photography, and open research sharing, we strive to safeguard the sacred memory of Avalpoondurai for future generations.

As we continue our field research, this article will be progressively updated with authenticated inscriptions, historical documents, and archival photography.

*“Preserve the roots, create the future.”*`
    ]
  },
  {
    id: 'my-photography-journey-temples-and-beyond',
    slug: 'my-photography-journey-temples-and-beyond',
    title: 'My Photography Journey — Temples and Beyond',
    subtitle: 'Temples and Beyond: Visual Archiving in Tamil Nadu',
    category: 'Photography',
    categorySlug: 'photography',
    badgeBg: 'bg-[#E3EFF3] text-[#1E5F74] dark:bg-[#1A313C] dark:text-[#88C6DC]',
    badgeText: 'text-[#1E5F74] dark:text-[#88C6DC]',
    excerpt:
      'A visual journey documenting temples, heritage architecture, people, culture and places through photography.',
    coverImage: '/images/blog/photography-journey.jpg',
    image: '/images/blog/photography-journey.jpg',
    tags: ['Photography', 'Heritage', 'Temple Architecture', 'Field Work', 'Visual Archiving'],
    author: {
      name: 'Anandh Jain Pujari',
      role: 'Heritage Photographer & Visual Archivist',
      avatar: '/images/about/anandh-jain-pujari.jpg',
    },
    publishedDate: 'September 5, 2025',
    updatedDate: 'September 8, 2025',
    date: 'Sep 5, 2025',
    readTime: '6 min read',
    readingTime: '6 min read',
    featured: false,
    status: 'published',
    seoTitle: 'My Photography Journey — Temples and Beyond | Anandh Jain Pujari',
    seoDescription:
      'Explore how documentary photography and natural lighting capture the architectural dignity of ancient Jain stone temples and community heritage in Tamil Nadu.',
    ogImage: '/images/blog/photography-journey.jpg',
    createdAt: '2025-09-05T09:00:00Z',
    updatedAt: '2025-09-08T11:00:00Z',
    content: [
      `## The Language of Natural Light and Ancient Granite

Long before I began designing digital interfaces, photography was my way of listening to stone. When dawn breaks over the gopuram of a remote Jain shrine in rural Tamil Nadu, the early sunlight falls upon the granite carvings with quiet reverence.

Temple photography demands patience. You cannot rush the sun. A granite bas-relief carved hundreds of years ago reveals its subtle chisel marks and facial serenity only during a brief window when the sun aligns with the stone angles.`,

      `## Beyond Static Structures: Capturing Living Traditions

Through my lens, I strive to capture not just architectural facades, but the atmosphere of spiritual solitude:
- The curl of incense smoke rising past medieval pillars.
- The warm gleam of bronze lamps during evening aarti.
- The weathered patina of stone floorings polished by centuries of bare feet.
- The quiet devotion of village elders maintaining traditions passed down through unbroken family lines.`,

      `## The Archival Mission

High-resolution photography serves as an objective safeguard against the weathering of time. Every image captured during our field journeys is cataloged with exact GPS coordinates, metadata, lighting notes, and timestamp records. This ensures that art historians, researchers, and community custodians have an enduring visual baseline for future conservation.`
    ]
  },
  {
    id: 'building-digital-tools-for-heritage',
    slug: 'building-digital-tools-for-heritage',
    title: 'Building Digital Tools for Heritage',
    subtitle: 'Preserving Sacred Legacies with Modern Tech',
    category: 'Technology & AI',
    categorySlug: 'technology-ai',
    badgeBg: 'bg-[#F7EBDD] text-[#A25717] dark:bg-[#382618] dark:text-[#F3B67F]',
    badgeText: 'text-[#A25717] dark:text-[#F3B67F]',
    excerpt:
      "How modern digital tools can help document, preserve and share India's Jain heritage with future generations.",
    coverImage: '/images/blog/digital-heritage-tools.jpg',
    image: '/images/blog/digital-heritage-tools.jpg',
    tags: ['Technology & AI', 'Digital Archiving', 'UI Design', 'Web Platforms', 'Innovation'],
    author: {
      name: 'Anandh Jain Pujari',
      role: 'UI Designer & Digital Technologist',
      avatar: '/images/about/anandh-jain-pujari.jpg',
    },
    publishedDate: 'August 22, 2025',
    updatedDate: 'August 25, 2025',
    date: 'Aug 22, 2025',
    readTime: '7 min read',
    readingTime: '7 min read',
    featured: false,
    status: 'published',
    seoTitle: 'Building Digital Tools for Heritage | Anandh Jain Pujari',
    seoDescription:
      'Learn how web technology, structured databases, and AI assistance can bridge ancient cultural legacies with modern accessibility.',
    ogImage: '/images/blog/digital-heritage-tools.jpg',
    createdAt: '2025-08-22T08:00:00Z',
    updatedAt: '2025-08-25T14:00:00Z',
    content: [
      `## Modern Technology in Service of Sacred Memory

Can an ancient philosophy centered on simplicity and non-attachment thrive in an era dominated by hyper-speed digital streams? I firmly believe that technology is a sacred vessel when guided by clean intent.

For the past several years, I have leveraged my two decades in graphic design and web technology to build specialized digital portals for heritage temples. Many remote shrines have zero web presence; pilgrims cannot find contact numbers, puja timings, or historical context.`,

      `## Principles of Heritage Digital Platforms

When building platforms for sacred heritage:
1. **Dignified Typography & Palette**: Rejecting cluttered flashy layouts in favor of timeless editorial typography, soft natural ivory canvases, and calm navy accents that mirror temple stone and parchment.
2. **Accessible Mobile Design**: Ensuring village caretakers and urban pilgrims alike can access clear directions, maps, and high-fidelity photographs on any smartphone.
3. **Structured Searchable Data**: Structuring temple information into searchable schemas—Tirthankara names, historical eras, inscription transcriptions, and festival calendars.`,

      `## The Future of AI and Cultural Research

Modern artificial intelligence and optical character recognition (OCR) offer exciting possibilities for assisting with transcriptions of ancient inscriptions and translating classical commentaries into accessible formats for contemporary readers.`
    ]
  },
  {
    id: '24-tirthankaras-symbols-and-significance',
    slug: '24-tirthankaras-symbols-and-significance',
    title: '24 Tirthankaras — Symbols and Significance',
    subtitle: 'Cosmic Emblems and Philosophical Meaning in Jain Art',
    category: 'Jain Heritage',
    categorySlug: 'jain-heritage',
    badgeBg: 'bg-[#EFE8DC] text-[#715424] dark:bg-[#2F291F] dark:text-[#DAC095]',
    badgeText: 'text-[#715424] dark:text-[#DAC095]',
    excerpt:
      'Understanding the 24 Tirthankaras, their symbols and their significance in Jain tradition.',
    coverImage: '/images/blog/tirthankaras-symbols.jpg',
    image: '/images/blog/tirthankaras-symbols.jpg',
    tags: ['Jain Heritage', 'Tirthankaras', 'Iconography', 'Philosophy', 'Sacred Art'],
    author: {
      name: 'Anandh Jain Pujari',
      role: 'Jain Temple Priest & Iconography Scholar',
      avatar: '/images/about/anandh-jain-pujari.jpg',
    },
    publishedDate: 'August 10, 2025',
    updatedDate: 'August 14, 2025',
    date: 'Aug 10, 2025',
    readTime: '8 min read',
    readingTime: '8 min read',
    featured: false,
    status: 'published',
    seoTitle: '24 Tirthankaras — Symbols and Significance | Anandh Jain Pujari',
    seoDescription:
      'A deep dive into the Lanchhanas (emblems), meditative postures, and spiritual symbolism of the 24 Tirthankaras in Jain sculpture.',
    ogImage: '/images/blog/tirthankaras-symbols.jpg',
    createdAt: '2025-08-10T07:30:00Z',
    updatedAt: '2025-08-14T16:00:00Z',
    content: [
      `## The Serenity of Jain Iconography

In Jain sculpture, all Tirthankara icons share an identical supreme composure: either seated in profound Padmasana (lotus posture) or standing in unshakeable Kayotsarga (renunciation of bodily awareness). Their eyes gaze gently inwards; no weapons, crowns, or earthly ornamentation adores them.

How then does a worshipper distinguish Rishabhanatha from Neminatha, Parshwanatha, or Mahavira? The answer lies in the **Lanchhana**—the sacred emblem carved distinctly at the base of the pedestal.`,

      `## The Cosmic Emblems

Each of the 24 Tirthankaras is associated with a specific emblem that reflects philosophical and symbolic meaning:
- **Bhagwan Rishabhanatha (Adinatha)**: Bull (Vrshabha) — symbolizing steadfastness, strength, and the inaugurator of agricultural culture.
- **Bhagwan Ajitanatha**: Elephant (Gaja) — royal majesty and peaceful strength.
- **Bhagwan Sambhavanatha**: Horse (Ashva) — noble speed and disciplined mind.
- **Bhagwan Shantinatha**: Deer (Mriga) — supreme gentleness and universal peace.
- **Bhagwan Neminatha**: Conch (Shankha) — the clarion call of spiritual awakening.
- **Bhagwan Parshwanatha**: Serpent (Sarpa / Dharanendra) — protection and conquest of karmic illusion.
- **Bhagwan Mahavira**: Lion (Simha) — fearlessness, supreme valour, and victory over the inner passions.`,

      `## Iconography in Kongu Nadu Shrines

Across the ancient shrines of Vijayamangalam, Avalpoondurai, and Thingalur, stone carvers faithfully chiseled these symbols into granite bases. Studying these emblems unlocks a deeper appreciation of early medieval devotional art in Tamil Nadu.`
    ]
  },
];

// Data layer access methods (CMS abstraction layer with dynamic local persistence)
export function getAllBlogPosts(includeDrafts = false): BlogPost[] {
  if (typeof window !== 'undefined') {
    const local = getLocalArticles({ includeDrafts });
    if (local && local.length > 0) return local;
  }
  return includeDrafts ? BLOG_POSTS : BLOG_POSTS.filter((post) => post.status === 'published');
}

export function getFeaturedBlogPost(): BlogPost {
  const posts = getAllBlogPosts(false);
  const featured = posts.find((p) => p.featured);
  return featured || posts[0] || BLOG_POSTS[0];
}

export function getLatestBlogPosts(limit = 4): BlogPost[] {
  return getAllBlogPosts(false).slice(0, limit);
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  if (typeof window !== 'undefined') {
    const article = getLocalArticleBySlugOrId(slug);
    if (article) return article;
  }
  return BLOG_POSTS.find((p) => p.slug === slug || p.id === slug);
}

export function getRelatedBlogPosts(currentSlug: string, limit = 3): BlogPost[] {
  const posts = getAllBlogPosts(false);
  const current = getBlogPostBySlug(currentSlug);
  if (!current) return posts.slice(0, limit);

  const sameCategory = posts.filter(
    (p) => p.slug !== currentSlug && p.category === current.category
  );
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const remaining = posts.filter(
    (p) => p.slug !== currentSlug && p.category !== current.category
  );
  return [...sameCategory, ...remaining].slice(0, limit);
}

export function getAdjacentBlogPosts(currentSlug: string): { prev: BlogPost | null; next: BlogPost | null } {
  const posts = getAllBlogPosts(false);
  const index = posts.findIndex((p) => p.slug === currentSlug || p.id === currentSlug);
  if (index === -1) return { prev: null, next: null };

  const prev = index > 0 ? posts[index - 1] : null;
  const next = index < posts.length - 1 ? posts[index + 1] : null;
  return { prev, next };
}

export function filterBlogPosts(options: {
  category?: string | null;
  searchQuery?: string;
}): BlogPost[] {
  let posts = getAllBlogPosts();

  if (options.category && options.category !== 'All') {
    const targetCat = options.category.toLowerCase().trim();
    posts = posts.filter(
      (p) =>
        p.category.toLowerCase().trim() === targetCat ||
        p.categorySlug?.toLowerCase().trim() === targetCat
    );
  }

  if (options.searchQuery && options.searchQuery.trim() !== '') {
    const q = options.searchQuery.toLowerCase().trim();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }

  return posts;
}

export const BLOG_CATEGORIES = [
  'All',
  'Jain Heritage',
  'Photography',
  'Design & Creativity',
  'Technology & AI',
];
