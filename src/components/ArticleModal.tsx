import React, { useEffect } from 'react';
import { X, Calendar, Clock, Share2, Tag, Bookmark } from 'lucide-react';
import { Article } from '../types';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export function ArticleModal({ article, onClose }: ArticleModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (article) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [article, onClose]);

  if (!article) return null;

  return (
    <div
      id="article-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="article-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-[#FAF7F0] dark:bg-[#142033] rounded-2xl shadow-2xl border border-[#E6DFD1] dark:border-[#263750] overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Modal Header & Hero Image */}
        <div className="relative aspect-[16/8] sm:aspect-[16/7] w-full overflow-hidden bg-[#EAE2D2] dark:bg-[#18253B]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            id="close-article-modal"
            onClick={onClose}
            aria-label="Close article"
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on Hero */}
          <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#B58A3C] text-white mb-2">
              {article.category}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight drop-shadow-xs">
              {article.title}
            </h2>
            <p className="text-sm text-white/90 font-serif italic mt-0.5">
              {article.subtitle}
            </p>
          </div>
        </div>

        {/* Article Meta Bar */}
        <div className="px-6 py-3 border-b border-[#E6DFD1] dark:border-[#23344D] bg-[#F1ECE0] dark:bg-[#0F1827] flex items-center justify-between text-xs text-[#718096] dark:text-[#94A3B8]">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: article.title,
                    text: article.excerpt,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="p-1.5 hover:text-[#B58A3C] transition-colors cursor-pointer rounded"
              title="Share article"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-5 text-[#2D3748] dark:text-[#CBD5E1] text-sm sm:text-base leading-relaxed">
          <p className="font-serif text-base sm:text-lg italic text-[#142033] dark:text-[#F8F5EE] border-l-3 border-[#B58A3C] pl-4 py-1">
            {article.excerpt}
          </p>

          {article.content.map((para, idx) => (
            <p key={idx} className="font-normal">
              {para}
            </p>
          ))}

          {/* Tags */}
          <div className="pt-6 border-t border-[#E6DFD1] dark:border-[#23344D] flex flex-wrap items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-[#B58A3C]" />
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-md bg-[#EBE4D5] dark:bg-[#1D2B40] text-[#142033] dark:text-[#CBD5E1]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E6DFD1] dark:border-[#23344D] bg-[#F4EFE5] dark:bg-[#0D1420] flex items-center justify-between">
          <span className="text-xs font-serif italic text-[#718096] dark:text-[#94A3B8]">
            Author: Anandh Jain Pujari • Heritage Archive
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#142033] hover:bg-[#B58A3C] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Article
          </button>
        </div>
      </div>
    </div>
  );
}
