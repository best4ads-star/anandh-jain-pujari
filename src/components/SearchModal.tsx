import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { ARTICLES, TEMPLES, PROJECTS } from '../data/content';
import { Article, Temple, Project } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArticle: (article: Article) => void;
  onSelectTemple: (temple: Temple) => void;
  onSelectProject: (project: Project) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  onSelectArticle,
  onSelectTemple,
  onSelectProject,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 100);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const filteredArticles = normalizedQuery
    ? ARTICLES.filter(
        (a) =>
          a.title.toLowerCase().includes(normalizedQuery) ||
          (a.subtitle && a.subtitle.toLowerCase().includes(normalizedQuery)) ||
          a.category.toLowerCase().includes(normalizedQuery) ||
          a.tags.some((t) => t.toLowerCase().includes(normalizedQuery))
      )
    : [];

  const filteredTemples = normalizedQuery
    ? TEMPLES.filter(
        (t) =>
          t.name.toLowerCase().includes(normalizedQuery) ||
          t.town.toLowerCase().includes(normalizedQuery) ||
          t.deity.toLowerCase().includes(normalizedQuery) ||
          t.location.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const filteredProjects = normalizedQuery
    ? PROJECTS.filter(
        (p) =>
          p.title.toLowerCase().includes(normalizedQuery) ||
          p.subtitle?.toLowerCase().includes(normalizedQuery) ||
          p.description.toLowerCase().includes(normalizedQuery) ||
          p.tools?.some((tool) => tool.toLowerCase().includes(normalizedQuery)) ||
          p.tags?.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      )
    : [];

  const hasResults =
    filteredArticles.length > 0 ||
    filteredTemples.length > 0 ||
    filteredProjects.length > 0;

  return (
    <div
      id="search-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="search-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#FAF7F0] dark:bg-[#142033] rounded-2xl shadow-2xl border border-[#E6DFD1] dark:border-[#263750] overflow-hidden flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E6DFD1] dark:border-[#23344D] bg-white dark:bg-[#162234]">
          <Search className="w-5 h-5 text-[#B58A3C] flex-shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, temples, projects, heritage topics..."
            className="w-full bg-transparent text-[#142033] dark:text-[#F8F5EE] placeholder-[#718096] dark:placeholder-[#94A3B8] text-sm sm:text-base focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:text-black dark:hover:text-white mr-2 cursor-pointer"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold px-2.5 py-1 rounded bg-[#EAE2D2] dark:bg-[#1E2B40] text-[#142033] dark:text-slate-300 hover:bg-[#B58A3C] hover:text-white transition-colors cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {!query && (
            <div className="py-8 text-center text-[#718096] dark:text-[#94A3B8]">
              <p className="text-sm font-medium">Try searching for:</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                {['Avalpoondurai', 'Parshwanath', 'Kongu Nadu', 'Photography', 'Tirthankaras', 'AI'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs px-3 py-1 rounded-full bg-[#EAE2D2] dark:bg-[#1B273C] text-[#142033] dark:text-[#CBD5E1] hover:bg-[#B58A3C] hover:text-white transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && !hasResults && (
            <div className="py-10 text-center text-[#718096] dark:text-[#94A3B8]">
              <p className="text-sm font-medium">No results found for "{query}".</p>
              <p className="text-xs mt-1">Try another keyword or browse sections directly.</p>
            </div>
          )}

          {/* Articles Results */}
          {filteredArticles.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#B58A3C] dark:text-[#D8BD82] mb-2 px-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Articles ({filteredArticles.length})
              </div>
              <div className="space-y-1.5">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    onClick={() => {
                      onSelectArticle(article);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-white dark:bg-[#1A263B] border border-[#E6DFD1] dark:border-[#23344D] hover:border-[#B58A3C] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-serif font-bold text-sm text-[#142033] dark:text-[#F8F5EE]">
                        {article.title}
                      </div>
                      <div className="text-xs text-[#718096] dark:text-[#94A3B8] mt-0.5">
                        {article.subtitle} • {article.date}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#B58A3C]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Temples Results */}
          {filteredTemples.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#B58A3C] dark:text-[#D8BD82] mb-2 px-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Temples ({filteredTemples.length})
              </div>
              <div className="space-y-1.5">
                {filteredTemples.map((temple) => (
                  <div
                    key={temple.id}
                    onClick={() => {
                      onSelectTemple(temple);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-white dark:bg-[#1A263B] border border-[#E6DFD1] dark:border-[#23344D] hover:border-[#B58A3C] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-serif font-bold text-sm text-[#142033] dark:text-[#F8F5EE]">
                        {temple.town} — {temple.name}
                      </div>
                      <div className="text-xs text-[#718096] dark:text-[#94A3B8] mt-0.5">
                        📍 {temple.location} • {temple.deity}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#B58A3C]" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Results */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#B58A3C] dark:text-[#D8BD82] mb-2 px-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Projects ({filteredProjects.length})
              </div>
              <div className="space-y-1.5">
                {filteredProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-white dark:bg-[#1A263B] border border-[#E6DFD1] dark:border-[#23344D] hover:border-[#B58A3C] flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-serif font-bold text-sm text-[#142033] dark:text-[#F8F5EE]">
                        {proj.title}
                      </div>
                      <div className="text-xs text-[#718096] dark:text-[#94A3B8] mt-0.5">
                        {proj.subtitle}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#B58A3C]" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
