import React from 'react';
import { Camera, Palette, Cpu, BookOpen, ArrowRight } from 'lucide-react';
import { TempleIcon, GoldLeafBranch } from './Icons';
import { CATEGORIES } from '../data/content';
import { Category } from '../types';

interface ExploreCategoryProps {
  onSelectCategory: (category: Category) => void;
}

export function ExploreCategory({ onSelectCategory }: ExploreCategoryProps) {
  const getIcon = (name: string, colorClass: string) => {
    switch (name) {
      case 'Shrine':
        return <TempleIcon className={`w-5 h-5 ${colorClass}`} />;
      case 'Camera':
        return <Camera className={`w-5 h-5 ${colorClass}`} />;
      case 'Palette':
        return <Palette className={`w-5 h-5 ${colorClass}`} />;
      case 'Cpu':
        return <Cpu className={`w-5 h-5 ${colorClass}`} />;
      case 'BookOpen':
      default:
        return <BookOpen className="w-5 h-5 text-white" />;
    }
  };

  return (
    <section
      id="categories"
      className="py-16 sm:py-20 lg:py-22 bg-[#F8F5EE] dark:bg-[#0D1420] transition-colors duration-300 border-t border-[#EAE3D5] dark:border-[#1E2D42]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ==================================================
            SECTION HEADER
            ================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10 pb-5 border-b border-[#E6DFD1] dark:border-[#23344D]">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <GoldLeafBranch className="w-4 h-4 text-[#B58A3C] dark:text-[#D8BD82]" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#B58A3C] dark:text-[#D8BD82]">
                Curated Themes
              </span>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              <h2 className="font-playfair text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight whitespace-nowrap">
                Explore by Category
              </h2>
              <div className="hidden sm:block h-[2px] bg-[#B58A3C] w-12 sm:w-20 lg:w-24 opacity-80 shrink-0" />
            </div>

            <p className="mt-2 text-xs sm:text-sm text-[#5F6470] dark:text-[#94A3B8] font-normal leading-relaxed max-w-2xl">
              Browse temple archives, cultural essays, field photography, and technology projects by thematic focus.
            </p>
          </div>
        </div>

        {/* ==================================================
            5-CARD HORIZONTAL STRIP
            Desktop: 5 columns
            Tablet: 2 or 3 columns
            Mobile: 1 column
            ================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-4.5">
          {CATEGORIES.map((cat) => {
            const isMaroonCta = cat.isSpecial;

            return (
              <button
                key={cat.id}
                id={`category-pill-${cat.id}`}
                onClick={() => onSelectCategory(cat)}
                className={`group text-left p-4 sm:p-4.5 rounded-md border transition-all duration-200 flex items-center gap-3.5 cursor-pointer shadow-[0_2px_6px_rgba(20,32,51,0.03)] hover:shadow-[0_6px_16px_rgba(20,32,51,0.06)] ${
                  isMaroonCta
                    ? 'bg-[#7A1F1F] hover:bg-[#681919] border-[#7A1F1F] text-white'
                    : `${cat.bgColor} ${cat.borderColor} hover:border-[#B58A3C]/60`
                }`}
              >
                {/* Icon Container */}
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                    isMaroonCta
                      ? 'bg-white/15 text-white'
                      : 'bg-white dark:bg-[#142033]/70 border border-[#E8E1D3] dark:border-[#263750] shadow-2xs'
                  }`}
                >
                  {getIcon(cat.iconName, cat.iconColor)}
                </div>

                {/* Text Labels */}
                <div className="min-w-0 flex-1">
                  <div
                    className={`font-serif text-sm sm:text-[15.5px] font-bold truncate leading-tight ${
                      isMaroonCta
                        ? 'text-white'
                        : 'text-[#142033] dark:text-[#F8F5EE] group-hover:text-[#B58A3C] dark:group-hover:text-[#D8BD82]'
                    }`}
                  >
                    {cat.name}
                  </div>
                  <div
                    className={`text-xs sm:text-[12.5px] truncate mt-1 ${
                      isMaroonCta ? 'text-white/85' : 'text-[#5F6470] dark:text-[#94A3B8]'
                    }`}
                  >
                    {cat.subtext}
                  </div>
                </div>

                {/* Arrow if Special Maroon CTA */}
                {isMaroonCta && (
                  <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
