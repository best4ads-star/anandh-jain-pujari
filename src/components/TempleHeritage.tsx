import React from 'react';
import { MapPin, ArrowRight, Landmark } from 'lucide-react';
import { Temple } from '../types';
import { GoldLeafBranch } from './Icons';

interface TempleHeritageProps {
  temples: Temple[];
  onSelectTemple: (temple: Temple) => void;
  onExploreAll: () => void;
}

// Prepared future alt text for authentic temple photography
const TEMPLE_ALT_TEXTS: Record<string, string> = {
  avalpoondurai: 'Avalpoondurai Shri Parshwanath Jain Temple — Erode District, Tamil Nadu',
  vellode: 'Vellode Jain Temple — Erode District, Tamil Nadu',
  seenapuram: 'Seenapuram Jain Temple — Erode District, Tamil Nadu',
  thingalur: 'Thingalur Jain Temple — Erode District, Tamil Nadu',
  vijayamangalam: 'Vijayamangalam Jain Temple — Erode District, Tamil Nadu',
};

export function TempleHeritage({
  temples,
  onSelectTemple,
  onExploreAll,
}: TempleHeritageProps) {
  // First card: slightly larger / featured; remaining four: balanced cards
  const featuredTemple = temples[0];
  const balancedTemples = temples.slice(1, 5);

  const handleTempleClick = (e: React.MouseEvent, temple: Temple) => {
    e.preventDefault();
    onSelectTemple(temple);
  };

  const handleExploreHeaderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onExploreAll();
  };

  return (
    <section
      id="temples"
      className="py-20 sm:py-24 lg:py-28 bg-[#F8F5EE] dark:bg-[#0D1420] transition-colors duration-300 border-t border-[#EAE3D5] dark:border-[#1E2D42]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ==================================================
            SECTION HEADER
            ================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-16 pb-6 border-b border-[#E6DFD1] dark:border-[#23344D]">
          <div>
            {/* Subtle botanical detail & eyebrow */}
            <div className="inline-flex items-center gap-2 mb-2.5">
              <GoldLeafBranch className="w-4 h-4 text-[#B58A3C] dark:text-[#D8BD82]" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#B58A3C] dark:text-[#D8BD82]">
                Regional Heritage Documentation
              </span>
            </div>

            {/* Main Heading & Gold Line */}
            <div className="flex items-center gap-4 sm:gap-6">
              <h2 className="font-playfair text-2xl sm:text-3xl lg:text-[38px] font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight leading-tight">
                Jain Heritage of Erode & Kongu Nadu
              </h2>
              {/* Subtle muted-gold decorative line */}
              <div className="hidden sm:block h-[2px] bg-[#B58A3C] w-12 sm:w-20 lg:w-24 opacity-80 shrink-0" />
            </div>

            {/* Supporting Text */}
            <p className="mt-3 text-sm sm:text-base text-[#5F6470] dark:text-[#94A3B8] max-w-2xl font-normal leading-relaxed">
              Explore the Jain temples, heritage places and cultural traditions documented across Erode and the Kongu Nadu region.
            </p>
          </div>

          {/* Right side: Explore Heritage → link to /heritage */}
          <a
            id="temples-explore-all-btn"
            href="/heritage"
            onClick={handleExploreHeaderClick}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#142033] dark:text-[#F8F5EE] hover:text-[#B58A3C] dark:hover:text-[#D8BD82] transition-colors duration-200 cursor-pointer group self-start md:self-end shrink-0 py-1"
          >
            <span>Explore Heritage</span>
            <ArrowRight className="w-4 h-4 text-[#B58A3C] transition-transform duration-200 group-hover:translate-x-1.5" />
          </a>
        </div>

        {/* ==================================================
            FIVE TEMPLE SHOWCASE (MAGAZINE/EDITORIAL RHYTHM)
            ================================================== */}
        <div className="space-y-8 lg:space-y-10">
          {/* 1. FEATURED TEMPLE CARD (Avalpoondurai - Slightly Larger) */}
          {featuredTemple && (
            <article
              id={`temple-card-${featuredTemple.slug || featuredTemple.id}`}
              onClick={(e) => handleTempleClick(e, featuredTemple)}
              className="group relative bg-white dark:bg-[#142033] rounded-md border border-[#E8E1D3] dark:border-[#23344D] shadow-[0_2px_12px_rgba(20,32,51,0.04)] hover:shadow-[0_8px_24px_rgba(20,32,51,0.08)] transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
                {/* Large Temple Photograph (Left ~60% on desktop) */}
                <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10.5] overflow-hidden bg-[#ECE5D8] dark:bg-[#1A263B]">
                  {featuredTemple.hasVerifiedPhoto && (featuredTemple.coverImage || featuredTemple.image) ? (
                    <>
                      <img
                        src={featuredTemple.coverImage || featuredTemple.image}
                        alt={TEMPLE_ALT_TEXTS[featuredTemple.slug || featuredTemple.id] || `${featuredTemple.name} — Erode District, Tamil Nadu`}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#F1EBE0] dark:bg-[#152336] text-center select-none">
                      <div className="w-14 h-14 rounded-full bg-[#E8E0D0] dark:bg-[#1E2E44] flex items-center justify-center mb-3 text-[#B58A3C] dark:text-[#D8BD82]">
                        <Landmark className="w-7 h-7 opacity-75" />
                      </div>
                      <span className="text-xs font-semibold text-[#8C6219] dark:text-[#D8BD82] uppercase tracking-wider">
                        {featuredTemple.town}
                      </span>
                      <span className="text-[11px] text-[#718096] dark:text-[#94A3B8] font-mono mt-1">
                        Field Photo Documentation Pending
                      </span>
                    </div>
                  )}

                  {/* Editorial Tag */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="inline-block text-[10px] font-bold tracking-[0.16em] uppercase px-3 py-1 rounded-sm bg-[#F8F5EE]/95 dark:bg-[#142033]/95 backdrop-blur-xs text-[#B58A3C] dark:text-[#D8BD82] border border-[#B58A3C]/20 shadow-xs">
                      Featured Heritage Site
                    </span>
                  </div>
                </div>

                {/* Content Area (Right ~40% on desktop) */}
                <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white dark:bg-[#142033]">
                  <div>
                    {/* Location with subtle icon */}
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#B58A3C] dark:text-[#D8BD82] uppercase tracking-[0.14em] mb-2.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{featuredTemple.location}</span>
                    </div>

                    {/* Temple Name */}
                    <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#142033] dark:text-[#F8F5EE] group-hover:text-[#B58A3C] dark:group-hover:text-[#D8BD82] transition-colors duration-200 leading-snug mb-3.5">
                      {featuredTemple.name}
                    </h3>

                    {/* Short introductory description */}
                    <p className="text-sm sm:text-[15px] text-[#5F6470] dark:text-[#94A3B8] font-normal leading-relaxed mb-6">
                      {featuredTemple.description}
                    </p>
                  </div>

                  {/* Explore Link with gold accent & arrow movement */}
                  <div className="pt-4 border-t border-[#F0EBE1] dark:border-[#1E2E44] flex items-center justify-between">
                    <a
                      href={`/heritage/${featuredTemple.slug || featuredTemple.id}`}
                      onClick={(e) => handleTempleClick(e, featuredTemple)}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#142033] dark:text-[#F8F5EE] group-hover:text-[#B58A3C] dark:group-hover:text-[#D8BD82] transition-colors duration-200"
                    >
                      <span>Explore Temple</span>
                      <ArrowRight className="w-4 h-4 text-[#B58A3C] transition-transform duration-200 group-hover:translate-x-1" />
                    </a>
                    <span className="text-[11px] font-mono tracking-wider text-[#94A3B8] dark:text-[#64748B]">
                      01 / 05
                    </span>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* 2. REMAINING FOUR BALANCED CARDS (Vellode, Seenapuram, Thingalur, Vijayamangalam) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-7">
            {balancedTemples.map((temple, idx) => (
              <article
                key={temple.id}
                id={`temple-card-${temple.slug || temple.id}`}
                onClick={(e) => handleTempleClick(e, temple)}
                className="group flex flex-col bg-white dark:bg-[#142033] rounded-md border border-[#E8E1D3] dark:border-[#23344D] shadow-[0_2px_8px_rgba(20,32,51,0.04)] hover:shadow-[0_8px_20px_rgba(20,32,51,0.08)] transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Temple photograph OR Clean Neutral Placeholder */}
                {temple.hasVerifiedPhoto && (temple.coverImage || temple.image) ? (
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#ECE5D8] dark:bg-[#1A263B]">
                    <img
                      src={temple.coverImage || temple.image}
                      alt={TEMPLE_ALT_TEXTS[temple.slug || temple.id] || `${temple.name} — Erode District, Tamil Nadu`}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                  </div>
                ) : (
                  <div className="relative aspect-[16/11] bg-[#F1EBE0] dark:bg-[#152336] border-b border-[#E6DFD1] dark:border-[#22334A] flex flex-col items-center justify-center p-4 text-center select-none overflow-hidden">
                    <div className="w-12 h-12 rounded-full bg-[#E8E0D0] dark:bg-[#1E2E44] border border-[#DCD3C0] dark:border-[#2B3F5C] flex items-center justify-center mb-2 text-[#B58A3C] dark:text-[#D8BD82]">
                      <Landmark className="w-5 h-5 opacity-75" />
                    </div>
                    <span className="text-xs font-semibold text-[#8C6219] dark:text-[#D8BD82] tracking-wider uppercase">
                      {temple.town}
                    </span>
                    <span className="text-[10px] text-[#718096] dark:text-[#94A3B8] font-mono mt-1">
                      Field Photo Documentation Pending
                    </span>
                    <div className="absolute bottom-2.5 right-2.5">
                      <span className="text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-xs bg-[#EAE2D4] dark:bg-[#1C2C40] text-[#718096] dark:text-[#94A3B8] border border-[#DDD3C2] dark:border-[#253952]">
                        Documentation Site
                      </span>
                    </div>
                  </div>
                )}

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#B58A3C] dark:text-[#D8BD82] uppercase tracking-[0.14em] mb-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{temple.location}</span>
                    </div>

                    {/* Temple Name */}
                    <h3 className="font-playfair text-lg sm:text-[19px] font-bold text-[#142033] dark:text-[#F8F5EE] group-hover:text-[#B58A3C] dark:group-hover:text-[#D8BD82] transition-colors duration-200 leading-snug mb-2.5">
                      {temple.name}
                    </h3>

                    {/* Short introductory description */}
                    <p className="text-[13px] sm:text-[14px] text-[#5F6470] dark:text-[#94A3B8] font-normal leading-relaxed line-clamp-3 mb-4">
                      {temple.description}
                    </p>
                  </div>

                  {/* Explore → Link */}
                  <div className="pt-3.5 border-t border-[#F0EBE1] dark:border-[#1E2E44] flex items-center justify-between text-xs sm:text-[13px] mt-auto">
                    <a
                      href={`/heritage/${temple.slug || temple.id}`}
                      onClick={(e) => handleTempleClick(e, temple)}
                      className="inline-flex items-center gap-1.5 font-semibold text-[#142033] dark:text-[#F8F5EE] group-hover:text-[#B58A3C] dark:group-hover:text-[#D8BD82] transition-colors duration-200"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#B58A3C] transition-transform duration-200 group-hover:translate-x-1" />
                    </a>
                    <span className="text-[10px] font-mono text-[#94A3B8] dark:text-[#64748B]">
                      0{idx + 2}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ==================================================
              3. JAIN TEMPLES OF ERODE DISTRICT — TEMPLE DIRECTORY
              Full directory with all 5 temples, rich cards, and View Temple buttons
              ================================================== */}
          <div className="pt-14 sm:pt-16 lg:pt-20 border-t border-[#E6DFD1] dark:border-[#23344D]">
            {/* Directory Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-12">
              <div>
                <div className="inline-flex items-center gap-2 mb-2.5">
                  <GoldLeafBranch className="w-4 h-4 text-[#B58A3C] dark:text-[#D8BD82]" />
                  <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#B58A3C] dark:text-[#D8BD82]">
                    Sacred Heritage Directory
                  </span>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <h3 className="font-playfair text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight leading-tight">
                    Jain Temples of Erode District
                  </h3>
                  <div className="hidden sm:block h-[2px] bg-[#B58A3C] w-12 sm:w-16 opacity-80 shrink-0" />
                </div>
                <p className="mt-2.5 text-sm sm:text-base text-[#5F6470] dark:text-[#94A3B8] max-w-2xl font-normal leading-relaxed">
                  Comprehensive directory of documented Jain temples, sacred shrines, and ancient epigraphical sites across Erode and Kongu Nadu.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F1ECE2] dark:bg-[#1A263B] border border-[#E0D5BE] dark:border-[#25364D] text-xs font-semibold text-[#8C6219] dark:text-[#D8BD82] self-start sm:self-auto shrink-0 shadow-2xs">
                <span>Temple Directory</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#B58A3C]" />
                <span>5 Documented Sites</span>
              </div>
            </div>

            {/* Directory Cards Grid (All 5 Temples) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 xl:gap-8">
              {temples.map((temple, idx) => (
                <article
                  key={`directory-${temple.id}`}
                  id={`directory-card-${temple.slug || temple.id}`}
                  onClick={(e) => handleTempleClick(e, temple)}
                  className="group flex flex-col bg-white dark:bg-[#142033] rounded-lg border border-[#E8E1D3] dark:border-[#23344D] shadow-[0_2px_10px_rgba(20,32,51,0.04)] hover:shadow-[0_12px_28px_rgba(20,32,51,0.09)] transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-0.5"
                >
                  {/* Card Image OR Neutral Placeholder */}
                  {temple.hasVerifiedPhoto && (temple.coverImage || temple.image) ? (
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#ECE5D8] dark:bg-[#1A263B]">
                      <img
                        src={temple.coverImage || temple.image}
                        alt={TEMPLE_ALT_TEXTS[temple.slug || temple.id] || `${temple.name} — Erode District, Tamil Nadu`}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

                      {/* Verified Photo Badge */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-block text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-sm bg-[#F8F5EE]/95 dark:bg-[#142033]/95 backdrop-blur-xs text-[#8C6219] dark:text-[#D8BD82] border border-[#B58A3C]/25 shadow-2xs">
                          Verified Field Photo
                        </span>
                      </div>

                      {/* Town badge bottom right */}
                      <div className="absolute bottom-3 right-3 z-10">
                        <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-xs bg-black/60 text-white backdrop-blur-xs">
                          {temple.town}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-[16/10] bg-[#F1EBE0] dark:bg-[#152336] border-b border-[#E6DFD1] dark:border-[#22334A] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
                      <div className="w-13 h-13 rounded-full bg-[#E8E0D0] dark:bg-[#1E2E44] border border-[#DCD3C0] dark:border-[#2B3F5C] flex items-center justify-center mb-3 text-[#B58A3C] dark:text-[#D8BD82] shadow-2xs">
                        <Landmark className="w-6 h-6 opacity-75" />
                      </div>
                      <span className="text-xs font-semibold text-[#8C6219] dark:text-[#D8BD82] tracking-wider uppercase mb-1">
                        {temple.town}
                      </span>
                      <span className="text-[11px] text-[#718096] dark:text-[#94A3B8] font-mono">
                        Field Photo Documentation Pending
                      </span>
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-block text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-xs bg-[#EAE2D4] dark:bg-[#1C2C40] text-[#718096] dark:text-[#94A3B8] border border-[#DDD3C2] dark:border-[#253952]">
                          Documentation Site
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 z-10">
                        <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-xs bg-[#EAE2D4] dark:bg-[#1C2C40] text-[#718096] dark:text-[#94A3B8]">
                          Erode District
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Card Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Location with Pin */}
                      <div className="flex items-center gap-1.5 text-xs font-medium text-[#B58A3C] dark:text-[#D8BD82] uppercase tracking-[0.14em] mb-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{temple.location}</span>
                      </div>

                      {/* Temple Name */}
                      <h4 className="font-playfair text-xl font-bold text-[#142033] dark:text-[#F8F5EE] group-hover:text-[#B58A3C] dark:group-hover:text-[#D8BD82] transition-colors duration-200 leading-snug mb-2.5">
                        {temple.name}
                      </h4>

                      {/* Short Description */}
                      <p className="text-[13px] sm:text-sm text-[#5F6470] dark:text-[#94A3B8] font-normal leading-relaxed line-clamp-3 mb-4">
                        {temple.description}
                      </p>
                    </div>

                    {/* Era & View Temple Button */}
                    <div className="pt-4 border-t border-[#F0EBE1] dark:border-[#1E2E44] flex items-center justify-between mt-auto">
                      <a
                        id={`view-temple-btn-${temple.slug || temple.id}`}
                        href={`/temples/${temple.slug || temple.id}`}
                        onClick={(e) => handleTempleClick(e, temple)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#142033] dark:bg-[#B58A3C] hover:bg-[#B58A3C] dark:hover:bg-[#C9A554] text-white dark:text-[#0D1420] text-xs font-semibold tracking-wide transition-all duration-200 shadow-2xs hover:shadow-xs group/btn cursor-pointer"
                      >
                        <span>View Temple</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </a>
                      <span className="text-[11px] font-mono text-[#94A3B8] dark:text-[#64748B]">
                        0{idx + 1} / 05
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
