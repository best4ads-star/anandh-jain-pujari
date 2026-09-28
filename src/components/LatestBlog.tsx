import React from 'react';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import { Article } from '../types';

interface LatestBlogProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  onViewAll: () => void;
}

export function LatestBlog({ articles, onSelectArticle, onViewAll }: LatestBlogProps) {
  // Take the primary 4 articles for the clean 4-card editorial row
  const latestArticles = articles.slice(0, 4);

  return (
    <section id="blog" className="py-16 sm:py-20 bg-[#F8F5EE] dark:bg-[#0D1420] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER: Left heading + gold horizontal line | Right 'View All Articles →' */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 sm:mb-12">
          <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
            <h2 className="font-playfair text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight whitespace-nowrap">
              Latest from the Blog
            </h2>
            {/* Short elegant gold horizontal line beside heading */}
            <div className="h-[2px] bg-[#B58A3C] w-12 sm:w-20 lg:w-28 flex-shrink-0 opacity-80" />
          </div>

          <button
            id="blog-view-all-btn"
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#142033] dark:text-[#F8F5EE] hover:text-[#B58A3C] dark:hover:text-[#D8BD82] transition-colors duration-200 cursor-pointer group self-start sm:self-auto shrink-0"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4 text-[#B58A3C] transition-transform duration-200 group-hover:translate-x-1.5" />
          </button>
        </div>

        {/* 4-CARD EDITORIAL GRID: 4 cols on desktop, 2 cols on tablet, 1 col on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-7">
          {latestArticles.map((article) => (
            <article
              key={article.id}
              id={`blog-card-${article.slug || article.id}`}
              onClick={() => onSelectArticle(article)}
              className="group flex flex-col bg-white dark:bg-[#142033] rounded-md border border-[#E8E1D3] dark:border-[#23344D] shadow-[0_2px_8px_rgba(20,32,51,0.04)] hover:shadow-[0_8px_24px_rgba(20,32,51,0.08)] transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {/* 1. Large landscape image at top with subtle radius on container */}
              <div className="relative aspect-[16/10.5] overflow-hidden bg-[#ECE5D8] dark:bg-[#1A263B]">
                <img
                  src={article.coverImage || article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* 2. Category: Small uppercase gold text */}
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#B58A3C] dark:text-[#D8BD82] mb-2.5">
                    {article.category}
                  </div>

                  {/* 3. Article Title: Large serif navy text with subtle hover color transition */}
                  <h3 className="font-playfair text-lg sm:text-[19px] font-bold text-[#142033] dark:text-[#F8F5EE] group-hover:text-[#B58A3C] dark:group-hover:text-[#D8BD82] transition-colors duration-200 leading-[1.35] mb-2.5 line-clamp-2">
                    {article.title}
                  </h3>

                  {/* 4. Short excerpt: Clean readable text */}
                  <p className="text-[13px] sm:text-[14px] text-[#5F6470] dark:text-[#94A3B8] font-normal leading-relaxed line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                </div>

                {/* 5, 6, 7. Footer: Date on left, Reading time on right, Arrow on far right */}
                <div className="pt-3.5 border-t border-[#F0EBE1] dark:border-[#1E2E44] flex items-center justify-between text-xs sm:text-[12.5px] text-[#5F6470] dark:text-[#94A3B8] mt-auto">
                  {/* Date on left */}
                  <div className="flex items-center gap-1.5 font-medium text-[#5F6470] dark:text-[#94A3B8]">
                    <Calendar className="w-3.5 h-3.5 text-[#B58A3C] shrink-0" />
                    <span>{article.date}</span>
                  </div>

                  {/* Reading time & Arrow on right */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 font-medium text-[#5F6470] dark:text-[#94A3B8]">
                      <Clock className="w-3.5 h-3.5 text-[#B58A3C] shrink-0" />
                      <span>{article.readingTime || article.readTime}</span>
                    </div>
                    <span className="text-[#142033] dark:text-[#F8F5EE] group-hover:text-[#B58A3C] dark:group-hover:text-[#D8BD82] transition-colors duration-200">
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
