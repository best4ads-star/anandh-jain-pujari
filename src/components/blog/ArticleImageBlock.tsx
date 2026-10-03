import React from 'react';
import { Camera } from 'lucide-react';

export interface ArticleImageBlockProps {
  src: string;
  alt: string;
  caption: string;
  credit?: string;
  location?: string;
  isPlaceholder?: boolean;
  aspectRatio?: '4/3' | '16/9' | '3/2' | 'auto';
  className?: string;
}

/**
 * Reusable Article Image Block supporting:
 * - Image (with error fallback)
 * - Caption
 * - Alt text
 * - Credit
 * - Optional location
 * - CMS readiness & verified field placeholder indicator
 */
export function ArticleImageBlock({
  src,
  alt,
  caption,
  credit = 'Anandh Jain Pujari',
  location,
  isPlaceholder = false,
  aspectRatio = '4/3',
  className = '',
}: ArticleImageBlockProps) {
  const aspectClass =
    aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : aspectRatio === '16/9'
      ? 'aspect-[16/9]'
      : aspectRatio === '3/2'
      ? 'aspect-[3/2]'
      : 'aspect-auto';

  return (
    <figure className={`my-8 group ${className}`}>
      <div className="relative rounded-sm overflow-hidden border border-[#E2D8C3] dark:border-[#223348] bg-[#F2ECE0] dark:bg-[#131F30] shadow-[0_4px_20px_rgba(20,32,51,0.04)]">
        <img
          src={src}
          alt={alt}
          className={`w-full ${aspectClass} object-cover object-center transition-transform duration-500 group-hover:scale-[1.015]`}
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = '/images/blog/avalpoondurai/cover.jpg';
          }}
        />

        {isPlaceholder && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-xs bg-[#142033]/80 backdrop-blur-xs text-[#E5D2A5] text-[10px] font-mono tracking-widest uppercase border border-[#B58A3C]/40 flex items-center gap-1.5">
            <Camera className="w-3 h-3 text-[#B58A3C]" />
            <span>Field Placeholder</span>
          </div>
        )}
      </div>

      {/* Editorial Caption, Credit & Location Metadata Bar */}
      <figcaption className="mt-2.5 px-1 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 text-xs text-[#5F6470] dark:text-[#94A3B8] font-sans">
        <div className="leading-snug">
          <span className="text-[#142033] dark:text-[#F8F5EE] font-medium">{caption}</span>
          {location && (
            <span className="text-[#8C95A6] dark:text-[#7A889B] ml-1.5">
              • {location}
            </span>
          )}
        </div>
        {credit && (
          <div className="text-[11px] font-mono text-[#8C95A6] dark:text-[#7A889B] shrink-0">
            Credit: <span className="text-[#142033] dark:text-[#E2E8F0] font-medium">{credit}</span>
          </div>
        )}
      </figcaption>
    </figure>
  );
}
