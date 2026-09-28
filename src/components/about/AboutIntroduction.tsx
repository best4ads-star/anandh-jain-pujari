import React from 'react';
import { BookOpen, Compass, ShieldCheck } from 'lucide-react';
import { GoldLeafBranch } from '../Icons';

export function AboutIntroduction() {
  return (
    <section
      id="about-introduction"
      className="py-16 sm:py-20 lg:py-24 bg-[#FCFAF6] dark:bg-[#0F1724] transition-colors duration-300 border-b border-[#E6DFD1] dark:border-[#23344D]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Eyebrow */}
        <div className="flex items-center gap-2 mb-3">
          <GoldLeafBranch className="w-4 h-4 text-[#B58A3C] dark:text-[#D8BD82]" />
          <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#B58A3C] dark:text-[#D8BD82]">
            Authentic Background & Voice
          </span>
        </div>

        {/* Section Heading */}
        <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight mb-8 leading-snug">
          An Authentic Confluence of Sacred Traditions & Digital Expression
        </h2>

        {/* Required Starting Content with Editorial Styling */}
        <div className="space-y-6 text-base sm:text-lg text-[#333C4E] dark:text-[#CBD5E1] leading-relaxed font-normal">
          <p className="first-letter:text-5xl first-letter:font-playfair first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#B58A3C] dark:first-letter:text-[#D8BD82] first-letter:leading-none">
            I am Anandh Jain Pujari, a Jain temple priest, heritage documentation enthusiast, graphic designer and digital creator.
          </p>

          <p>
            My work brings together traditional Jain heritage, visual storytelling, photography, design and modern digital technology.
          </p>

          <p>
            Through this platform, I document heritage, share knowledge, preserve photographs and explore new ways of presenting our cultural history for future generations.
          </p>
        </div>

        {/* Editorial Core Values Strip */}
        <div className="mt-12 pt-8 border-t border-[#EAE2D2] dark:border-[#203046] grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#F1ECE2] dark:bg-[#162234] border border-[#DDD2BC] dark:border-[#263750] flex items-center justify-center text-[#B58A3C] shrink-0 mt-0.5">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="font-playfair text-sm font-bold text-[#142033] dark:text-[#F8F5EE]">
                Field Grounded
              </div>
              <div className="text-xs text-[#5F6470] dark:text-[#94A3B8] mt-1 leading-normal">
                Direct engagement with ancient stone inscriptions, bas-reliefs, and living temple shrines.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#F1ECE2] dark:bg-[#162234] border border-[#DDD2BC] dark:border-[#263750] flex items-center justify-center text-[#B58A3C] shrink-0 mt-0.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="font-playfair text-sm font-bold text-[#142033] dark:text-[#F8F5EE]">
                Living Memory
              </div>
              <div className="text-xs text-[#5F6470] dark:text-[#94A3B8] mt-1 leading-normal">
                Preserving historical records, puja practices, and ancestral wisdom for community enrichment.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-sm bg-[#F1ECE2] dark:bg-[#162234] border border-[#DDD2BC] dark:border-[#263750] flex items-center justify-center text-[#B58A3C] shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-playfair text-sm font-bold text-[#142033] dark:text-[#F8F5EE]">
                Ethical Craft
              </div>
              <div className="text-xs text-[#5F6470] dark:text-[#94A3B8] mt-1 leading-normal">
                Accurate documentation without fictional exaggeration, grounded in honest field reality.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
