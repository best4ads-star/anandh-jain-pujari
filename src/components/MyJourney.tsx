import React from 'react';
import { ArrowRight } from 'lucide-react';
import { GoldLeafBranch } from './Icons';

interface MyJourneyProps {
  onReadStory: () => void;
}

export function MyJourney({ onReadStory }: MyJourneyProps) {
  // Real Anandh Jain Pujari photograph asset (/public/images/about/anandh-jain-pujari.jpg)
  const portraitSrc = '/images/about/anandh-jain-pujari.jpg';

  return (
    <section
      id="about"
      className="py-24 sm:py-28 lg:py-32 bg-[#F8F5EE] dark:bg-[#0D1420] transition-colors duration-300 border-t border-[#EAE3D5] dark:border-[#1E2D42]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two-Column Editorial Layout: Left ~45% Photograph, Right ~55% Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* LEFT COLUMN: Large Portrait (~45% width on desktop, 420-500px wide) */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[440px] sm:max-w-[460px] lg:max-w-[480px] xl:max-w-[500px]">
              {/* Subtle warm ivory / gold offset framing */}
              <div className="relative p-3 sm:p-3.5 bg-[#F1ECE2] dark:bg-[#162235] border border-[#E4DBCB] dark:border-[#23354E] rounded-md shadow-[0_8px_30px_rgba(20,32,51,0.06)]">
                {/* Large Portrait Image Container with 3:4 aspect ratio matching the 896x1200 photo */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#E9E1D2] dark:bg-[#1A283D]">
                  <img
                    src={portraitSrc}
                    alt="Anandh Jain Pujari — Priest, Designer & Heritage Documentarian"
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  {/* Subtle gentle bottom vignette for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Elegant understated gold corner accents */}
              <div className="hidden sm:block absolute -bottom-3 -right-3 w-24 h-24 border-r-2 border-b-2 border-[#B58A3C]/40 rounded-br-sm pointer-events-none" />
              <div className="hidden sm:block absolute -top-3 -left-3 w-16 h-16 border-l-2 border-t-2 border-[#B58A3C]/30 rounded-tl-sm pointer-events-none" />
            </div>
          </div>

          {/* RIGHT COLUMN: Editorial Content (~55% width on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center max-w-[640px]">
            {/* 4. My Journey Heading: Significantly larger with muted-gold horizontal line */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-4 sm:gap-6">
                <h2 className="font-playfair text-3xl sm:text-4xl lg:text-[42px] xl:text-[46px] font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight leading-tight">
                  My Journey
                </h2>
                {/* Short muted-gold horizontal line beside the heading */}
                <div className="h-[2px] bg-[#B58A3C] w-14 sm:w-20 lg:w-24 opacity-80 shrink-0" />
              </div>
            </div>

            {/* 5. Body Content: Readable body typography, increased line height, max width ~600px */}
            <div className="space-y-5 text-base sm:text-lg text-[#5F6470] dark:text-[#CBD5E1] font-normal leading-[1.8] max-w-[600px] mb-8 sm:mb-10">
              <p>
                I am <strong className="font-semibold text-[#142033] dark:text-white">Anandh Jain Pujari</strong>, a Jain temple priest, heritage documentation enthusiast, graphic designer and digital creator.
              </p>
              <p>
                Through this platform, I share my experiences, document our Jain heritage, showcase my creative work and explore how technology can help preserve and present our cultural history.
              </p>
            </div>

            {/* 6. Read My Story Button */}
            <div className="mb-10 sm:mb-12">
              <button
                id="journey-read-story-btn"
                type="button"
                onClick={onReadStory}
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-md bg-[#142033] hover:bg-[#B58A3C] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer group"
              >
                <span>Read My Story</span>
                <ArrowRight className="w-4 h-4 text-[#B58A3C] group-hover:text-white transition-all duration-200 group-hover:translate-x-1" />
              </button>
            </div>

            {/* 7. Featured Quote: Large editorial pull quote (not a tiny card) */}
            <div className="relative pt-8 sm:pt-10 border-t border-[#EAE3D5] dark:border-[#23354E] max-w-[600px]">
              <div className="flex items-start gap-5 sm:gap-6">
                {/* Delicate botanical / gold leaf detail */}
                <div className="shrink-0 mt-1">
                  <GoldLeafBranch className="w-10 h-10 sm:w-12 sm:h-12 text-[#B58A3C] dark:text-[#D8BD82]" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Pull quote with prominent italic serif typography and gold quote marks */}
                  <blockquote className="font-playfair italic text-xl sm:text-2xl lg:text-[26px] xl:text-[28px] font-semibold text-[#142033] dark:text-[#F8F5EE] leading-snug">
                    <span className="text-[#B58A3C] font-serif text-3xl sm:text-4xl mr-1 select-none">“</span>
                    Knowledge grows when it is shared.
                    <span className="text-[#B58A3C] font-serif text-3xl sm:text-4xl ml-1 select-none">”</span>
                  </blockquote>
                  <p className="mt-3 text-xs sm:text-sm font-medium tracking-[0.16em] uppercase text-[#B58A3C] dark:text-[#D8BD82]">
                    — Anandh Jain Pujari
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
