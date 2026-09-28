import React, { useEffect } from 'react';
import { X, MapPin, Compass, History, Sparkles, Navigation } from 'lucide-react';
import { Temple } from '../types';

interface TempleModalProps {
  temple: Temple | null;
  onClose: () => void;
}

export function TempleModal({ temple, onClose }: TempleModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (temple) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [temple, onClose]);

  if (!temple) return null;

  return (
    <div
      id="temple-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="temple-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#FAF7F0] dark:bg-[#142033] rounded-2xl shadow-2xl border border-[#E6DFD1] dark:border-[#263750] overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Temple Image Header */}
        <div className="relative aspect-[16/8] w-full overflow-hidden bg-[#EAE2D2] dark:bg-[#18253B]">
          <img
            src={temple.coverImage || temple.image}
            alt={`${temple.name} Jain Temple — Erode District, Tamil Nadu`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            id="close-temple-modal"
            onClick={onClose}
            aria-label="Close temple modal"
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#B58A3C] text-white mb-1.5">
              {temple.town} • Kongu Jain Heritage
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight drop-shadow-xs">
              {temple.name}
            </h2>
            <div className="flex items-center gap-3 text-xs text-white/90 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#D8BD82]" />
                {temple.location}
              </span>
              {temple.era && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-[#D8BD82]" />
                    {temple.era}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-[#2D3748] dark:text-[#CBD5E1] text-sm sm:text-base">
          {/* Main Deity and Overview */}
          <div className="bg-[#F1ECE0] dark:bg-[#1B273A] p-4 rounded-xl border border-[#E4DCBC] dark:border-[#263750] flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#718096] dark:text-[#94A3B8] font-bold block">
                Presiding Moolnayak Deity
              </span>
              <span className="font-serif text-lg font-bold text-[#142033] dark:text-[#F8F5EE]">
                {temple.deity}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] uppercase tracking-wider text-[#718096] dark:text-[#94A3B8] font-bold block">
                Region
              </span>
              <span className="font-medium text-xs text-[#B58A3C] dark:text-[#D8BD82]">
                Erode District, TN
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#142033] dark:text-[#F8F5EE] mb-2 flex items-center gap-2">
              <History className="w-4 h-4 text-[#B58A3C]" />
              Historical Background
            </h4>
            <p className="leading-relaxed font-normal">{temple.history}</p>
          </div>

          <div>
            <p className="leading-relaxed font-normal text-sm sm:text-base italic text-[#4A5568] dark:text-[#A0AEC0] border-l-2 border-[#B58A3C] pl-3 py-0.5">
              {temple.description}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#142033] dark:text-[#F8F5EE] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B58A3C]" />
              Key Architectural & Ritual Features
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {temple.features?.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white dark:bg-[#1A263B] border border-[#E6DFD1] dark:border-[#263750] text-xs sm:text-sm font-medium"
                >
                  <span className="w-2 h-2 rounded-full bg-[#B58A3C] flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#E6DFD1] dark:border-[#23344D] bg-[#F4EFE5] dark:bg-[#0D1420] flex items-center justify-between">
          <div className="text-xs text-[#718096] dark:text-[#94A3B8]">
            Curated by Anandh Jain Pujari
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#142033] hover:bg-[#B58A3C] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
