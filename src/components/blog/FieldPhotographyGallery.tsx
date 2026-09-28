import React, { useState } from 'react';
import { Camera, Eye, Info, Sparkles } from 'lucide-react';
import { ArticleImageBlock } from './ArticleImageBlock';

export interface GalleryPhotoItem {
  id: string;
  category: 'exterior' | 'interior' | 'architecture' | 'deity' | 'inscriptions' | 'details' | 'surroundings';
  categoryLabel: string;
  src: string;
  alt: string;
  caption: string;
  credit: string;
  status: 'placeholder' | 'verified';
  aspectRatio?: '4/3' | '16/9' | '3/2';
}

interface FieldPhotographyGalleryProps {
  templeName?: string;
}

export function FieldPhotographyGallery({
  templeName = 'Avalpoondurai Jain Temple',
}: FieldPhotographyGalleryProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedPreview, setSelectedPreview] = useState<GalleryPhotoItem | null>(null);

  // Field photography catalog for Avalpoondurai supporting 8 architectural categories
  const photos: GalleryPhotoItem[] = [
    {
      id: 'photo-exterior',
      category: 'exterior',
      categoryLabel: 'Temple Exterior',
      src: '/images/blog/avalpoondurai/temple-01.jpg',
      alt: 'Avalpoondurai Jain Temple Exterior Approach and Enclosure',
      caption: 'Avalpoondurai Jain Temple — [caption to be verified: Outer compound and entrance approach]',
      credit: 'Anandh Jain Pujari',
      status: 'placeholder',
    },
    {
      id: 'photo-architecture',
      category: 'architecture',
      categoryLabel: 'Architecture',
      src: '/images/blog/avalpoondurai/architecture-01.jpg',
      alt: 'Dravidian Granite Plinth Moldings and Adhisthana',
      caption: 'Avalpoondurai Jain Temple — [caption to be verified: Granite plinth moldings and base relief]',
      credit: 'Anandh Jain Pujari',
      status: 'placeholder',
    },
    {
      id: 'photo-interior',
      category: 'interior',
      categoryLabel: 'Interior Mandapa',
      src: '/images/blog/avalpoondurai/temple-02.jpg',
      alt: 'Mahamandapa Pillars and Vaulted Stone Ceiling',
      caption: 'Avalpoondurai Jain Temple — [caption to be verified: Interior assembly hall columnar layout]',
      credit: 'Anandh Jain Pujari',
      status: 'placeholder',
    },
    {
      id: 'photo-deity',
      category: 'deity',
      categoryLabel: 'Main Deity',
      src: '/images/blog/avalpoondurai/deity.jpg',
      alt: 'Garbhagriha Sanctum Idol of Bhagwan Parshwanatha',
      caption: 'Avalpoondurai Jain Temple — [caption to be verified: Bhagwan Parshwanatha in Padmasana posture]',
      credit: 'Anandh Jain Pujari',
      status: 'placeholder',
    },
    {
      id: 'photo-inscriptions',
      category: 'inscriptions',
      categoryLabel: 'Inscriptions',
      src: '/images/blog/avalpoondurai/architecture-01.jpg',
      alt: 'Stone Epigraphical Carvings & Epigraphy Wall',
      caption: 'Avalpoondurai Jain Temple — [caption to be verified: Basal inscription panel documentation]',
      credit: 'Anandh Jain Pujari',
      status: 'placeholder',
    },
    {
      id: 'photo-details',
      category: 'details',
      categoryLabel: 'Details & Reliefs',
      src: '/images/blog/avalpoondurai/temple-02.jpg',
      alt: 'Chiseled Pillar Motifs and Yaksha Niches',
      caption: 'Avalpoondurai Jain Temple — [caption to be verified: Architectural pillar medallions and relief detail]',
      credit: 'Anandh Jain Pujari',
      status: 'placeholder',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'exterior', label: 'Exterior' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'interior', label: 'Interior' },
    { id: 'deity', label: 'Main Deity' },
    { id: 'inscriptions', label: 'Inscriptions' },
    { id: 'details', label: 'Details' },
  ];

  const filteredPhotos =
    selectedFilter === 'all'
      ? photos
      : photos.filter((p) => p.category === selectedFilter);

  return (
    <div id="temple-photographs" className="mt-14 pt-10 border-t border-[#E8E0D0] dark:border-[#1E2E42] scroll-mt-24">
      {/* Editorial Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#B58A3C] shrink-0" />
          <h2 className="font-playfair text-2xl sm:text-[28px] font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight">
            Temple Photographs
          </h2>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8C6219] dark:text-[#D8BD82] bg-[#F7EFE1] dark:bg-[#1D2736] px-2.5 py-1 rounded-xs border border-[#E8DCC6] dark:border-[#2D3F58]">
          <Camera className="w-3.5 h-3.5" />
          <span>Documentation Archive ({photos.length} Assets)</span>
        </div>
      </div>
      <div className="h-[1.5px] bg-[#E8E0D2] dark:border-[#233348] w-full mb-5" />

      {/* Archival Research Statement */}
      <div className="mb-6 p-4 rounded-sm bg-[#FAF6EE] dark:bg-[#121E2E] border border-[#E6DBCA] dark:border-[#223348] text-xs text-[#5F6470] dark:text-[#94A3B8] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#B58A3C] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#142033] dark:text-[#F8F5EE]">Field Photography Notice:</strong>{' '}
          All gallery image blocks are configured for CMS media replacement. Current visual assets are architectural reference placeholders. Authentic field photography will be uploaded upon verified archival preservation surveys. Captions adhere strictly to non-fabricated heritage documentation protocols.
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 mb-6 pb-2 border-b border-[#EAE2D2] dark:border-[#1E2C3F]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedFilter(cat.id)}
            className={`px-3 py-1 text-xs font-mono rounded-xs transition-colors cursor-pointer ${
              selectedFilter === cat.id
                ? 'bg-[#142033] text-[#F8F5EE] dark:bg-[#B58A3C] dark:text-[#142033] font-semibold'
                : 'text-[#5F6470] dark:text-[#94A3B8] hover:bg-[#EAE2D2]/60 dark:hover:bg-[#182638]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Responsive Gallery Grid: 1 col on mobile, 2 on tablet, 2-3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="group rounded-sm overflow-hidden border border-[#E2D8C3] dark:border-[#223348] bg-[#FAF7F0] dark:bg-[#111C2B] flex flex-col justify-between hover:border-[#B58A3C] transition-all duration-300"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-[#ECE4D4] dark:bg-[#182434]">
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('unsplash')) {
                    target.src =
                      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80';
                  }
                }}
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-xs bg-[#142033]/80 backdrop-blur-xs text-[#E5D2A5] text-[9.5px] font-mono tracking-widest uppercase border border-[#B58A3C]/30">
                {photo.categoryLabel}
              </div>

              {photo.status === 'placeholder' && (
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-xs bg-[#B58A3C]/90 text-white text-[9px] font-mono uppercase tracking-wider">
                  Placeholder
                </div>
              )}

              {/* View Overlay Button */}
              <button
                onClick={() => setSelectedPreview(photo)}
                className="absolute inset-0 bg-[#142033]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                aria-label={`View photo: ${photo.alt}`}
              >
                <span className="px-3 py-1.5 rounded-xs bg-[#142033]/90 text-[#F8F5EE] text-xs font-mono flex items-center gap-1.5 shadow-md">
                  <Eye className="w-3.5 h-3.5 text-[#B58A3C]" />
                  <span>Inspect Asset</span>
                </span>
              </button>
            </div>

            {/* Structured Caption & Credit Strip */}
            <div className="p-3 text-xs flex flex-col justify-between flex-1 border-t border-[#E8E0D2] dark:border-[#1E2E42]">
              <p className="text-[#333C4E] dark:text-[#CBD5E1] font-sans leading-snug mb-2 line-clamp-2">
                {photo.caption}
              </p>
              <div className="pt-2 border-t border-[#F0E8DA] dark:border-[#1A283A] flex items-center justify-between text-[11px] font-mono text-[#8C95A6] dark:text-[#7A889B]">
                <span>Credit: {photo.credit}</span>
                <span className="text-[#B58A3C]">CMS Asset</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Asset Inspector Modal */}
      {selectedPreview && (
        <div
          className="fixed inset-0 z-50 bg-[#0B131E]/90 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedPreview(null)}
        >
          <div
            className="max-w-2xl w-full bg-[#FAF7F0] dark:bg-[#121D2C] rounded-sm overflow-hidden border border-[#E2D8C3] dark:border-[#2A3F58] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] bg-[#000]">
              <img
                src={selectedPreview.src}
                alt={selectedPreview.alt}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#B58A3C]">
                  {selectedPreview.categoryLabel}
                </span>
                <span className="text-xs font-mono text-[#718096] dark:text-[#94A3B8]">
                  Credit: {selectedPreview.credit}
                </span>
              </div>
              <h4 className="font-playfair text-lg font-bold text-[#142033] dark:text-[#F8F5EE] mb-2">
                {selectedPreview.alt}
              </h4>
              <p className="text-xs sm:text-sm text-[#5F6470] dark:text-[#94A3B8] leading-relaxed mb-4">
                {selectedPreview.caption}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-[#E8E0D0] dark:border-[#1E2E42]">
                <span className="text-[11px] font-mono text-[#8C95A6]">
                  Status: {selectedPreview.status === 'placeholder' ? 'Reference Field Placement (Replaceable)' : 'Verified Archive'}
                </span>
                <button
                  onClick={() => setSelectedPreview(null)}
                  className="px-4 py-1.5 rounded-xs bg-[#142033] dark:bg-[#B58A3C] text-[#F8F5EE] dark:text-[#142033] text-xs font-mono font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
