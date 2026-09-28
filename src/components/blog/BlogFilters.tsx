import React from 'react';
import { Search, X } from 'lucide-react';
import { BLOG_CATEGORIES } from '../../data/blogPosts';

interface BlogFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function BlogFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
}: BlogFiltersProps) {
  return (
    <div className="space-y-5">
      {/* Search Bar */}
      <div className="relative max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718096] dark:text-[#94A3B8]">
          <Search className="w-4 h-4" />
        </div>
        <input
          id="blog-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search articles by title, topic, or keyword..."
          className="w-full pl-10 pr-10 py-2.5 rounded-sm bg-[#FCFAF6] dark:bg-[#121C2B] border border-[#DDD4C3] dark:border-[#263750] text-[#142033] dark:text-[#F8F5EE] placeholder-[#8C95A6] text-sm focus:outline-none focus:border-[#B58A3C] transition-colors shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#718096] hover:text-[#142033] dark:hover:text-white"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills Strip */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs font-mono uppercase tracking-wider text-[#718096] dark:text-[#94A3B8] mr-1 hidden sm:inline">
          Categories:
        </span>
        {BLOG_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`category-pill-${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xs text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#142033] text-[#F8F5EE] dark:bg-[#F8F5EE] dark:text-[#142033] font-semibold shadow-2xs'
                  : 'bg-[#F2ECE0] dark:bg-[#162335] text-[#5F6470] dark:text-[#CBD5E1] border border-[#DDD3BF] dark:border-[#23354C] hover:border-[#B58A3C] hover:text-[#142033] dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
