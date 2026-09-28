import React from 'react';
import { ArrowRight, Calendar, Clock, BookOpen } from 'lucide-react';
import { BlogPost } from '../../types';
import { GoldLeafBranch } from '../Icons';

interface BlogFeaturedCardProps {
  post: BlogPost;
  onReadArticle: (slug: string) => void;
}

export function BlogFeaturedCard({ post, onReadArticle }: BlogFeaturedCardProps) {
  return (
    <div
      id="featured-article"
      className="relative rounded-sm overflow-hidden border border-[#E2D8C3] dark:border-[#24354B] bg-[#FCFAF6] dark:bg-[#111B28] shadow-[0_4px_20px_rgba(20,32,51,0.04)] transition-all duration-300 hover:border-[#B58A3C]/70"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Visual Cover Image with Archival Aspect */}
        <div className="lg:col-span-7 relative overflow-hidden group min-h-[280px] sm:min-h-[340px] lg:min-h-[420px] bg-[#EFE8DC] dark:bg-[#182434]">
          <img
            src={post.coverImage || post.image}
            alt={post.title}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out"
            loading="eager"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('unsplash')) {
                target.src = 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80';
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />

          {/* Featured Eyebrow Tag on Image */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-xs bg-[#142033]/90 text-[#F8F5EE] border border-[#B58A3C]/40 backdrop-blur-xs text-[11px] font-mono tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B58A3C]" />
            FEATURED EDITORIAL
          </div>
        </div>

        {/* Right: Editorial Narrative Content */}
        <div className="lg:col-span-5 p-7 sm:p-9 lg:p-10 flex flex-col justify-between">
          <div>
            {/* Category & Badge */}
            <div className="flex items-center gap-2 mb-3">
              <GoldLeafBranch className="w-3.5 h-3.5 text-[#B58A3C] dark:text-[#D8BD82]" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#B58A3C] dark:text-[#D8BD82]">
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h2
              onClick={() => onReadArticle(post.slug)}
              className="font-playfair text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight leading-snug cursor-pointer hover:text-[#B58A3C] dark:hover:text-[#D8BD82] transition-colors mb-4"
            >
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-sm sm:text-base text-[#5F6470] dark:text-[#94A3B8] font-normal leading-relaxed mb-6">
              {post.excerpt}
            </p>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#718096] dark:text-[#94A3B8] pt-2 pb-6 border-t border-[#EDE4D0] dark:border-[#1F2F44]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B58A3C]" />
                <span>{post.publishedDate || post.date}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-[#CBD5E1] dark:bg-[#475569]" />
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#B58A3C]" />
                <span>{post.readingTime || post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div>
            <button
              id="read-featured-article-btn"
              onClick={() => onReadArticle(post.slug)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xs bg-[#142033] hover:bg-[#1e2f47] text-[#F8F5EE] dark:bg-[#F8F5EE] dark:hover:bg-white dark:text-[#142033] text-xs font-semibold tracking-wider uppercase transition-all shadow-xs group cursor-pointer"
            >
              <span>Read Article</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
