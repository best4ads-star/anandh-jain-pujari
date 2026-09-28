import React from 'react';
import { Landmark, Archive, Share2, Sparkles } from 'lucide-react';
import { GoldLeafBranch } from '../Icons';

export function AboutMission() {
  return (
    <section
      id="about-mission"
      className="py-16 sm:py-20 lg:py-24 bg-[#F1ECE2] dark:bg-[#0A111B] transition-colors duration-300 border-b border-[#E0D5C1] dark:border-[#1E2E44]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <GoldLeafBranch className="w-4 h-4 text-[#B58A3C] dark:text-[#D8BD82]" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-[#B58A3C] dark:text-[#D8BD82]">
              HERITAGE MISSION
            </span>
          </div>

          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight">
            Preserving Heritage for Future Generations
          </h2>
          <div className="h-[2px] bg-[#B58A3C] w-16 mx-auto mt-3 mb-4 opacity-80" />
        </div>

        {/* Narrative Box */}
        <div className="bg-[#FAF7F0] dark:bg-[#121B29] p-8 sm:p-10 lg:p-12 rounded-sm border border-[#E2D8C3] dark:border-[#22334A] shadow-xs mb-12">
          <p className="text-base sm:text-lg text-[#333C4E] dark:text-[#CBD5E1] font-normal leading-relaxed mb-6">
            This website is established as an enduring public archive intended to document, curate, and share Jain heritage, temple information, epigraphical inscriptions, sacred traditions, and cultural photographs in a structured, accessible digital format.
          </p>

          <p className="text-sm sm:text-base text-[#5F6470] dark:text-[#94A3B8] font-normal leading-relaxed">
            By documenting ancient pilgrimage sites across Erode, Coimbatore, Tirupur, and the wider Kongu Nadu landscape, the goal is to bridge classical knowledge systems with contemporary digital research—ensuring that the spiritual history and architectural genius of our forebears remain vivid, accessible, and respected by the generations to come.
          </p>

          {/* 3 Pillars of Documentation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 mt-8 border-t border-[#E8DFC9] dark:border-[#203046]">
            <div className="flex items-start gap-3">
              <Landmark className="w-5 h-5 text-[#B58A3C] shrink-0 mt-1" />
              <div>
                <h4 className="font-playfair text-sm font-bold text-[#142033] dark:text-[#F8F5EE]">
                  Temple Documentation
                </h4>
                <p className="text-xs text-[#5F6470] dark:text-[#94A3B8] mt-1">
                  Architectural records, presiding Tirthankaras, and village history.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Archive className="w-5 h-5 text-[#B58A3C] shrink-0 mt-1" />
              <div>
                <h4 className="font-playfair text-sm font-bold text-[#142033] dark:text-[#F8F5EE]">
                  Photographic Archives
                </h4>
                <p className="text-xs text-[#5F6470] dark:text-[#94A3B8] mt-1">
                  High-fidelity field captures of stone carvings and inscriptions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Share2 className="w-5 h-5 text-[#B58A3C] shrink-0 mt-1" />
              <div>
                <h4 className="font-playfair text-sm font-bold text-[#142033] dark:text-[#F8F5EE]">
                  Structured Digital Sharing
                </h4>
                <p className="text-xs text-[#5F6470] dark:text-[#94A3B8] mt-1">
                  Open, organized access for researchers, students, and pilgrims.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Large Pull Quote Panel */}
        <div className="relative p-8 sm:p-10 lg:p-12 rounded-sm bg-[#EDE4D0] dark:bg-[#162335] border border-[#DFD3BA] dark:border-[#253952] text-center">
          <div className="inline-flex justify-center mb-4">
            <GoldLeafBranch className="w-8 h-8 text-[#B58A3C] dark:text-[#D8BD82]" />
          </div>

          <blockquote className="font-playfair italic text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#142033] dark:text-[#F8F5EE] leading-tight max-w-2xl mx-auto">
            “Preserve the roots, create the future.”
          </blockquote>

          <p className="text-xs sm:text-sm font-bold tracking-[0.24em] uppercase text-[#B58A3C] dark:text-[#D8BD82] mt-4 font-sans">
            — Anandh Jain Pujari
          </p>
        </div>
      </div>
    </section>
  );
}
