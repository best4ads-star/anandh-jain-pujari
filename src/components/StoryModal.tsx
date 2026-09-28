import React, { useEffect } from 'react';
import { X, Award, BookOpen, Compass, HeartHandshake } from 'lucide-react';
import { GoldLeafBranch } from './Icons';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StoryModal({ isOpen, onClose }: StoryModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="story-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="story-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#FAF7F0] dark:bg-[#142033] rounded-2xl shadow-2xl border border-[#E6DFD1] dark:border-[#263750] overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-r from-[#F2ECE0] via-[#E8DEC7] to-[#F2ECE0] dark:from-[#18263B] dark:via-[#1B293F] dark:to-[#18263B] border-b border-[#E3D8C1] dark:border-[#253750] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GoldLeafBranch className="w-10 h-10 text-[#B58A3C] dark:text-[#D8BD82]" />
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#B58A3C] dark:text-[#D8BD82]">
                Anandh Jain Pujari
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142033] dark:text-[#F8F5EE]">
                Tradition Meets Technology
              </h2>
            </div>
          </div>

          <button
            id="close-story-modal"
            onClick={onClose}
            aria-label="Close story"
            className="w-9 h-9 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 text-[#142033] dark:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Story */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-[#2D3748] dark:text-[#CBD5E1] text-sm sm:text-base leading-relaxed">
          {/* Key Quote */}
          <div className="bg-[#F3EDDC] dark:bg-[#1A2638] p-4 rounded-xl border border-[#E4DBC5] dark:border-[#2A3F5B] text-center">
            <blockquote className="font-serif italic text-lg sm:text-xl font-bold text-[#142033] dark:text-[#F8F5EE]">
              “Preserve the roots, create the future.”
            </blockquote>
            <p className="text-xs text-[#B58A3C] dark:text-[#D8BD82] mt-1 font-medium">
              — The Lifelong Mission
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#142033] dark:text-[#F8F5EE] mb-2 flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#B58A3C]" />
              Sacred Roots & Temple Heritage
            </h3>
            <p className="mb-3 font-normal">
              Born into the sacred heritage of Tamil Jainism in the Kongu region of Tamil Nadu,
              my life has been shaped by the quiet reverberation of stone bells, the fragrance of
              sandalwood paste, and the eternal teachings of the 24 Tirthankaras.
            </p>
            <p className="font-normal">
              Serving as a Jain temple priest in Avalpoondurai and surrounding shrines, I am
              entrusted with preserving daily rituals, scriptural recitation, and community
              gatherings that have continued uninterrupted for more than ten centuries.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#142033] dark:text-[#F8F5EE] mb-2 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#B58A3C]" />
              Two Decades in Design & Creativity
            </h3>
            <p className="mb-3 font-normal">
              Over the last 20+ years, I have actively worked as a graphic designer, visual artist,
              and creative consultant. I realized early that aesthetic mastery—clean typography,
              balanced negative space, and harmonious color theory—is deeply aligned with the
              Jain principles of clarity, precision, and inner order.
            </p>
            <p className="font-normal">
              From crafting published volumes on Kongu Jain inscriptions to branding educational
              institutions and non-profit trusts, my creative practice bridges classical Indian
              visual grammar with contemporary international design standards.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#142033] dark:text-[#F8F5EE] mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#B58A3C]" />
              Digital Preservation for Generations to Come
            </h3>
            <p className="font-normal">
              Ancient temples cannot speak unless we become their voice. By integrating photography,
              interactive web platforms, digital archiving, and emerging artificial intelligence tools,
              my mission is to make sacred Jain archaeological landmarks accessible to scholars,
              youth, and pilgrims across the globe.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E6DFD1] dark:border-[#23344D] bg-[#F4EFE5] dark:bg-[#0D1420] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#142033] hover:bg-[#B58A3C] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Story
          </button>
        </div>
      </div>
    </div>
  );
}
