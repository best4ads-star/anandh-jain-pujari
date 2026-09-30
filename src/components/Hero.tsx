import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { HERO_STATS } from '../data/content';

interface HeroProps {
  onExploreJourney: () => void;
  onReadBlog: () => void;
}

/**
 * Handcrafted Botanical Leaf Sprig illustration matching the heritage reference
 */
function BotanicalSprig({ className = "w-9 h-16 text-[#B58A3C]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 105"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Central curved stem */}
      <path
        d="M18,98 C26,62 38,34 50,8"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Botanical leaves branching symmetrically */}
      {/* Pair 1 - lower */}
      <path d="M20,84 C9,82 7,70 17,67 C21,72 22,79 20,84 Z" />
      <path d="M22,80 C32,76 36,64 28,60 C24,66 22,74 22,80 Z" />
      {/* Pair 2 - mid-low */}
      <path d="M25,66 C13,62 13,50 23,48 C26,54 26,62 25,66 Z" />
      <path d="M27,62 C38,56 40,44 31,41 C28,48 27,56 27,62 Z" />
      {/* Pair 3 - mid-high */}
      <path d="M30,48 C21,42 21,30 30,29 C33,35 32,43 30,48 Z" />
      <path d="M33,44 C43,36 44,25 35,23 C33,30 33,38 33,44 Z" />
      {/* Pair 4 - upper */}
      <path d="M37,30 C30,24 30,14 38,14 C40,19 39,26 37,30 Z" />
      <path d="M41,26 C49,19 48,9 41,9 C39,15 40,22 41,26 Z" />
      {/* Terminal tip leaf */}
      <path d="M50,8 C46,0 52,0 53,4 C53,8 51,9 50,8 Z" />
    </svg>
  );
}

/**
 * Silhouetted soaring birds over the temple spires
 */
function SoaringBirds({ className = "w-20 h-10 text-[#2C384A]/60" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 60"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12,28 C18,20 25,23 30,28 C26,27 22,29 18,31 C15,31 13,29 12,28 Z" />
      <path d="M42,16 C48,8 56,12 61,16 C57,15 52,17 49,19 C45,19 43,17 42,16 Z" />
      <path d="M72,22 C77,15 84,18 89,22 C85,21 81,23 78,25 C75,25 73,23 72,22 Z" />
      <path d="M28,38 C33,32 39,34 43,38 C40,37 36,39 34,41 C31,41 29,39 28,38 Z" />
      <path d="M88,32 C92,27 97,29 101,32 C98,31 95,33 93,34 C90,34 89,33 88,32 Z" />
    </svg>
  );
}

export function Hero({ onExploreJourney, onReadBlog }: HeroProps) {
  // Replaceable image assets architecture (/public/images/hero/...)
  const [artworkSrc, setArtworkSrc] = useState('/images/hero/hero-artwork.png?v=style-2');
  const [useComposite, setUseComposite] = useState(true);

  return (
    <section
      id="home"
      className="relative w-full bg-[#F8F5EE] dark:bg-[#0D1420] overflow-hidden pt-2 sm:pt-4 lg:pt-6 pb-8 sm:pb-12 lg:pb-0 transition-colors duration-300"
    >
      {/* Full-width container with responsive padding matching coffee-table book margins */}
      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 min-h-[560px] lg:h-[580px] xl:h-[620px] flex flex-col justify-between">
        
        {/* ========================================================
            DESKTOP BACKGROUND ARTWORK: Temple, Anandh & Birds
            Now featuring the Pujari at the historic Blue Temple
            on the left side of the current hero banner
            ======================================================== */}
        <div
          className="hidden lg:block absolute right-0 bottom-0 top-0 w-[60%] xl:w-[58%] pointer-events-none select-none z-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="relative w-full h-full flex items-end justify-end">
            {/* Soft watercolor / wash gradient edge masks on left, top and bottom */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to right, #F8F5EE 0%, rgba(248, 245, 238, 0.85) 6%, rgba(248, 245, 238, 0) 18%), linear-gradient(to top, #F8F5EE 0%, rgba(248, 245, 238, 0) 10%), linear-gradient(to bottom, #F8F5EE 0%, rgba(248, 245, 238, 0) 6%)',
              }}
            />
            {/* Dark mode blending gradient */}
            <div
              className="hidden dark:block absolute inset-0 z-10 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to right, #0D1420 0%, rgba(13, 20, 32, 0.9) 8%, rgba(13, 20, 32, 0) 20%), linear-gradient(to top, #0D1420 0%, rgba(13, 20, 32, 0) 12%), linear-gradient(to bottom, #0D1420 0%, rgba(13, 20, 32, 0) 6%)',
              }}
            />

            {/* Soaring birds in the sky over the temple spires */}
            <div className="absolute top-10 left-[34%] z-20 opacity-75">
              <SoaringBirds className="w-24 h-12 text-[#142033]/70 dark:text-[#CBD5E1]/60" />
            </div>

            {/* LEFT SIDE OF CURRENT HERO BANNER: Pujari at Historic Blue Shrine */}
            <div className="relative z-10 w-[47%] h-[94%] flex items-end justify-center -mr-10 mb-0 transition-transform duration-700 ease-out hover:scale-[1.01]">
              <img
                src="/images/hero/pujari-blue-temple.jpg"
                alt="Sri Anandh Jain Pujari standing before the blue heritage Jain shrine"
                className="w-full h-full object-contain object-bottom mix-blend-multiply dark:mix-blend-normal drop-shadow-sm filter contrast-[1.03]"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* RIGHT SIDE: Current Hero Banner Artwork (Temple & Carvings) */}
            <div className="relative z-0 w-[57%] h-full flex items-end justify-center">
              {useComposite ? (
                <img
                  src={artworkSrc}
                  alt="Anandh Jain Pujari in front of historic Jain temple"
                  className="w-full h-full object-contain object-bottom max-h-[580px] xl:max-h-[620px] transition-transform duration-700 ease-out hover:scale-[1.01]"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    // Fallback to layered temple + portrait if hero-artwork is unavailable
                    setUseComposite(false);
                  }}
                />
              ) : (
                <div className="relative w-full h-full flex items-end justify-center">
                  {/* Temple background layer */}
                  <img
                    src="/images/hero/temple.png"
                    alt="Historic carved Jain temple architecture"
                    className="absolute inset-0 w-full h-full object-contain object-bottom opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  {/* Center-Right Real Portrait cutout */}
                  <div className="relative z-10 w-[54%] h-[92%] flex items-end justify-center -ml-10">
                    <img
                      src="/images/hero/portrait.png"
                      alt="Anandh Jain Pujari in traditional saffron clothing"
                      className="w-full h-full object-contain object-bottom filter drop-shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================
            DESKTOP FAR-RIGHT EDITORIAL QUOTE & CALLIGRAPHY
            Floats cleanly to the right of Anandh
            ======================================================== */}
        <div className="hidden lg:flex flex-col items-start justify-center absolute right-4 xl:right-10 top-1/2 -translate-y-1/2 z-20 max-w-[190px] xl:max-w-[215px] pointer-events-auto select-none">
          {/* Large Gold Quotation Mark */}
          <span className="font-serif text-3xl xl:text-4xl text-[#B58A3C] dark:text-[#D8BD82] leading-none mb-1">
            “
          </span>
          {/* Quote Text in Serif Italic */}
          <p className="font-playfair italic text-base xl:text-lg text-[#142033] dark:text-[#F8F5EE] leading-snug">
            Preserve<br />
            the roots,<br />
            create the<br />
            future.
          </p>
          {/* Attribution */}
          <p className="text-[11px] xl:text-xs text-[#5F6470] dark:text-[#D8BD82] font-medium tracking-wide mt-2 font-sans">
            — Anandh Jain Pujari
          </p>

          {/* Handwritten Style Accent + Botanical Leaf Branch */}
          <div className="mt-8 flex items-center gap-3">
            <div className="font-script text-2xl xl:text-3xl text-[#B58A3C] dark:text-[#D8BD82] leading-[1.05] tracking-wide">
              Heritage<br />
              Design<br />
              Digital
            </div>
            <BotanicalSprig className="w-8 xl:w-9 h-14 xl:h-16 text-[#B58A3C] dark:text-[#D8BD82] -mt-1 shrink-0" />
          </div>
        </div>

        {/* ========================================================
            PRIMARY EDITORIAL CONTENT:
            - Desktop: Left column with headline, narrative, buttons & bottom stats
            - Mobile: Elegantly stacked 1 to 8 according to explicit specification
            ======================================================== */}
        <div className="relative z-10 flex flex-col justify-between h-full lg:max-w-[480px] xl:max-w-[540px]">
          
          {/* Upper text group */}
          <div className="pt-2 lg:pt-6">
            {/* 1. Uppercase Eyebrow with Pujari Heritage Icon */}
            <div className="inline-flex items-center gap-2 mb-3 lg:mb-4">
              <img
                src="/images/hero/pujari-blue-temple.jpg"
                alt="Sri Anandh Jain Pujari"
                className="w-5 h-5 rounded-full object-cover border border-[#B58A3C]/70 shadow-2xs"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] sm:text-[11px] lg:text-xs font-semibold tracking-[0.24em] uppercase text-[#142033]/85 dark:text-[#D8BD82]">
                JAIN PRIEST • DESIGNER • DIGITAL CREATOR •
              </span>
            </div>

            {/* 2. Large Serif Headline */}
            <h1 className="font-playfair text-5xl sm:text-6xl lg:text-[66px] xl:text-[74px] font-bold text-[#142033] dark:text-[#F8F5EE] leading-[1.02] tracking-tight mb-4 sm:mb-5">
              Tradition<br />
              Meets<br />
              Technology
            </h1>

            {/* 3. Supporting Narrative */}
            <p className="text-[#5F6470] dark:text-[#CBD5E1] text-base sm:text-lg leading-relaxed max-w-[430px] mb-6 sm:mb-7 font-normal">
              Documenting Jain heritage, creating meaningful designs and building digital solutions for a better tomorrow.
            </p>

            {/* 4. Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 mb-6 lg:mb-8">
              <button
                id="hero-explore-journey-btn"
                onClick={onExploreJourney}
                className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-[#142033] hover:bg-[#1F2E45] text-white text-sm sm:text-base font-medium shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <span>Explore My Journey</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                id="hero-read-blog-btn"
                onClick={onReadBlog}
                className="inline-flex items-center justify-center px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-white/80 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-[#142033]/25 dark:border-[#CBD5E1]/25 text-[#142033] dark:text-[#F8F5EE] text-sm sm:text-base font-medium transition-all duration-200 cursor-pointer shadow-2xs"
              >
                Read My Blog
              </button>
            </div>
          </div>

          {/* ========================================================
              MOBILE / TABLET ONLY: Stacking items 5, 6 & 7
              5. Portrait + Temple Composition
              6. Quote
              7. Heritage Design Digital with Botanical Sprig
              ======================================================== */}
          <div className="lg:hidden flex flex-col items-center my-6">
            {/* 5. Mobile Portrait + Temple Composition with Watercolor Edges */}
            <div className="relative w-full max-w-lg aspect-[16/10] sm:aspect-[16/9] flex items-end justify-center overflow-hidden mb-6">
              {/* Watercolor soft fade edges */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, #F8F5EE 0%, transparent 18%), linear-gradient(to bottom, #F8F5EE 0%, transparent 10%), linear-gradient(to right, #F8F5EE 0%, transparent 10%, transparent 90%, #F8F5EE 100%)',
                }}
              />
              <div
                className="hidden dark:block absolute inset-0 z-10 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, #0D1420 0%, transparent 18%), linear-gradient(to bottom, #0D1420 0%, transparent 10%), linear-gradient(to right, #0D1420 0%, transparent 10%, transparent 90%, #0D1420 100%)',
                }}
              />

              <div className="absolute top-4 left-[20%] z-20 opacity-60">
                <SoaringBirds className="w-16 h-8 text-[#142033]/60 dark:text-[#CBD5E1]/50" />
              </div>

              {/* Dual artwork: New image on the left side of current hero banner */}
              <div className="relative w-full h-full flex items-end justify-between">
                <div className="relative z-10 w-[50%] h-full flex items-end justify-center -mr-4">
                  <img
                    src="/images/hero/pujari-blue-temple.jpg"
                    alt="Sri Anandh Jain Pujari at blue heritage shrine"
                    className="w-full h-full object-contain object-bottom mix-blend-multiply dark:mix-blend-normal"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="relative z-0 w-[56%] h-full flex items-end justify-center">
                  <img
                    src={artworkSrc}
                    alt="Anandh Jain Pujari in front of historic Jain temple"
                    className="w-full h-full object-contain object-bottom"
                    referrerPolicy="no-referrer"
                    onError={() => {
                      setArtworkSrc('/images/hero/temple.png');
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 6 & 7. Mobile Quote & Script Accent */}
            <div className="w-full max-w-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F2ECE0]/60 dark:bg-[#162133]/60 border border-[#E3D8C1]/60 dark:border-[#253750] mb-6">
              <div>
                <span className="font-serif text-2xl text-[#B58A3C] dark:text-[#D8BD82] leading-none block -mb-1">
                  “
                </span>
                <p className="font-playfair italic text-base text-[#142033] dark:text-[#F8F5EE] leading-snug">
                  Preserve the roots, create the future.
                </p>
                <p className="text-[11px] text-[#5F6470] dark:text-[#D8BD82] font-medium tracking-wide mt-1">
                  — Anandh Jain Pujari
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="font-script text-2xl text-[#B58A3C] dark:text-[#D8BD82] leading-none">
                  Heritage • Design • Digital
                </span>
                <BotanicalSprig className="w-6 h-10 text-[#B58A3C] dark:text-[#D8BD82]" />
              </div>
            </div>
          </div>

          {/* ========================================================
              8. STATISTICS ROW:
              Positioned horizontally along the bottom, visually aligned
              ======================================================== */}
          <div
            id="hero-statistics"
            className="pb-4 sm:pb-6 lg:pb-8 pt-2"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 items-start">
              {HERO_STATS.map((stat, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    idx !== 0 ? 'sm:border-l sm:border-[#E2DAD0] dark:sm:border-[#253750] sm:pl-5' : ''
                  }`}
                >
                  <span className="font-playfair text-3xl sm:text-[34px] xl:text-[38px] font-bold text-[#142033] dark:text-[#F8F5EE] leading-none mb-1">
                    {stat.value}
                  </span>
                  <span className="text-[11px] sm:text-xs text-[#5F6470] dark:text-[#94A3B8] font-medium leading-snug">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
