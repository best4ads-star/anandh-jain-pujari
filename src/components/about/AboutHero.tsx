import React from 'react';
import { GoldLeafBranch } from '../Icons';

export function AboutHero() {
  return (
    <section
      id="about-hero"
      className="pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24 border-b border-[#E6DFD1] dark:border-[#23344D] bg-[#F8F5EE] dark:bg-[#0D1420] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Identity & Heading */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Eyebrow with gold botanical accent */}
            <div className="inline-flex items-center gap-2 mb-3">
              <GoldLeafBranch className="w-4 h-4 text-[#B58A3C] dark:text-[#D8BD82]" />
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.24em] uppercase text-[#B58A3C] dark:text-[#D8BD82]">
                ABOUT ANANDH JAIN PUJARI
              </span>
            </div>

            {/* Main Title */}
            <div className="flex items-center gap-4 sm:gap-6 mb-4">
              <h1 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight leading-tight">
                My Journey
              </h1>
              <div className="h-[2px] bg-[#B58A3C] w-12 sm:w-20 opacity-80 shrink-0" />
            </div>

            {/* Main Introduction / Tagline */}
            <p className="font-playfair italic text-lg sm:text-xl lg:text-2xl text-[#142033] dark:text-[#E2E8F0] font-semibold leading-relaxed mb-6">
              Tradition, heritage, creativity and technology.
            </p>

            {/* Sub-introductory narrative framing */}
            <p className="text-base sm:text-[17px] text-[#5F6470] dark:text-[#94A3B8] font-normal leading-relaxed max-w-2xl mb-6">
              A personal exploration of Jain temple traditions, ancient inscriptions, visual arts, and digital archives dedicated to keeping sacred cultural memory alive for coming generations.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <span className="px-3 py-1.5 rounded-sm bg-[#F1ECE2] dark:bg-[#162234] border border-[#E0D5BE] dark:border-[#253952] text-xs font-medium text-[#142033] dark:text-[#E2E8F0]">
                Temple Priest
              </span>
              <span className="px-3 py-1.5 rounded-sm bg-[#F1ECE2] dark:bg-[#162234] border border-[#E0D5BE] dark:border-[#253952] text-xs font-medium text-[#142033] dark:text-[#E2E8F0]">
                Heritage Documentarian
              </span>
              <span className="px-3 py-1.5 rounded-sm bg-[#F1ECE2] dark:bg-[#162234] border border-[#E0D5BE] dark:border-[#253952] text-xs font-medium text-[#142033] dark:text-[#E2E8F0]">
                Graphic Designer (20+ Yrs)
              </span>
              <span className="px-3 py-1.5 rounded-sm bg-[#F1ECE2] dark:bg-[#162234] border border-[#E0D5BE] dark:border-[#253952] text-xs font-medium text-[#142033] dark:text-[#E2E8F0]">
                Digital Creator
              </span>
            </div>
          </div>

          {/* Right Column: Real Portrait Asset */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Outer decorative border frame */}
              <div className="absolute -inset-2.5 rounded-sm border border-[#E6DFD1] dark:border-[#263750] pointer-events-none" />
              <div className="absolute -top-3 -right-3 w-7 h-7 border-t-2 border-r-2 border-[#B58A3C] pointer-events-none" />
              <div className="absolute -bottom-3 -left-3 w-7 h-7 border-b-2 border-l-2 border-[#B58A3C] pointer-events-none" />

              {/* Main Image Container */}
              <div className="relative overflow-hidden rounded-sm bg-[#F1ECE2] dark:bg-[#1A263B] border border-[#DDD3BF] dark:border-[#2A3C56] shadow-[0_8px_30px_rgba(20,32,51,0.08)]">
                <img
                  src="/images/about/anandh-jain-pujari.jpg"
                  alt="Anandh Jain Pujari - Jain temple priest, heritage documentation enthusiast, graphic designer and digital creator"
                  loading="eager"
                  className="w-full h-auto aspect-[4/5] object-cover object-center"
                  onError={(e) => {
                    // Fallback to high quality documentary photo if file missing
                    const target = e.currentTarget;
                    if (!target.src.includes('unsplash')) {
                      target.src = 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80';
                    }
                  }}
                />

                {/* Subtitle Caption Strip */}
                <div className="p-3.5 bg-[#F8F5EE] dark:bg-[#131E2E] border-t border-[#E6DFD1] dark:border-[#23344D] flex items-center justify-between">
                  <div>
                    <div className="font-playfair text-sm font-bold text-[#142033] dark:text-[#F8F5EE]">
                      Anandh Jain Pujari
                    </div>
                    <div className="text-[11px] text-[#718096] dark:text-[#94A3B8]">
                      Erode & Kongu Nadu, Tamil Nadu
                    </div>
                  </div>
                  <div className="text-[10.5px] font-mono uppercase tracking-wider text-[#B58A3C] dark:text-[#D8BD82]">
                    Field Archives
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
