import React from 'react';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { BlogPost } from '../../types';

interface BlogCardProps {
  post: BlogPost;
  onSelect: (slug: string) => void;
}

export function BlogCard({ post, onSelect }: BlogCardProps) {
  return (
    <article
      id={`blog-card-${post.slug}`}
      onClick={() => onSelect(post.slug)}
      className="group flex flex-col justify-between rounded-sm overflow-hidden border border-[#E6DFD1] dark:border-[#23344D] bg-[#FCFAF6] dark:bg-[#121C2B] shadow-[0_2px_10px_rgba(20,32,51,0.03)] hover:border-[#B58A3C]/70 hover:shadow-[0_8px_24px_rgba(20,32,51,0.08)] transition-all duration-300 cursor-pointer"
    >
      <div>
        {/* Cover Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#ECE4D4] dark:bg-[#182434]">
          <img
            src={post.coverImage || post.image}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-600 ease-out"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('unsplash')) {
                target.src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80';
              }
            }}
          />

          {/* Category Pill Tag on Image */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-xs bg-[#142033]/90 text-[#F8F5EE] border border-[#B58A3C]/40 text-[10.5px] font-mono tracking-widest uppercase backdrop-blur-xs">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Metadata Row: Date & Reading Time */}
          <div className="flex items-center gap-3 text-xs text-[#718096] dark:text-[#94A3B8] mb-2.5">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#B58A3C]" />
              <span>{post.publishedDate || post.date}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-[#CBD5E1] dark:bg-[#475569]" />
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#B58A3C]" />
              <span>{post.readingTime || post.readTime}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight leading-snug group-hover:text-[#B58A3C] dark:group-hover:text-[#D8BD82] transition-colors mb-2.5 line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-xs sm:text-sm text-[#5F6470] dark:text-[#94A3B8] font-normal leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>
      </div>

      {/* Footer Read Link with Arrow */}
      <div className="px-6 pb-6 pt-2 border-t border-[#EFE8DA] dark:border-[#1E2E44] flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#142033] dark:text-[#E2E8F0] group-hover:text-[#B58A3C] dark:group-hover:text-[#D8BD82] transition-colors">
          Read Story
        </span>
        <div className="w-7 h-7 rounded-full bg-[#F4EFE5] dark:bg-[#19273A] border border-[#DDD3C0] dark:border-[#283C55] flex items-center justify-center text-[#142033] dark:text-[#E2E8F0] group-hover:bg-[#B58A3C] group-hover:text-white group-hover:border-[#B58A3C] transition-all duration-300">
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </article>
  );
}
