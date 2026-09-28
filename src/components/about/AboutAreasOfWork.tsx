import React from 'react';
import { Landmark, PenTool, Camera, Cpu } from 'lucide-react';
import { GoldLeafBranch } from '../Icons';

export function AboutAreasOfWork() {
  const areas = [
    {
      id: 'jain-heritage',
      title: 'Jain Heritage',
      description: 'Temple documentation, history, photography and cultural preservation.',
      icon: Landmark,
      number: '01',
      bgTone: 'bg-[#FCFAF6] dark:bg-[#131E2E]',
    },
    {
      id: 'graphic-design',
      title: 'Graphic Design',
      description: 'Branding, posters, visual communication and creative design.',
      icon: PenTool,
      number: '02',
      bgTone: 'bg-[#F9F6F0] dark:bg-[#142032]',
    },
    {
      id: 'photography',
      title: 'Photography',
      description: 'Temple, heritage, architecture and documentary photography.',
      icon: Camera,
      number: '03',
      bgTone: 'bg-[#FAF7F1] dark:bg-[#131E2E]',
    },
    {
      id: 'technology-ai',
      title: 'Technology & AI',
      description: 'Web applications, digital tools, AI-assisted creativity and technology projects.',
      icon: Cpu,
      number: '04',
      bgTone: 'bg-[#F8F5ED] dark:bg-[#142032]',
    },
  ];

  return (
    <section
      id="about-areas-of-work"
      className="py-16 sm:py-20 lg:py-24 bg-[#F8F5EE] dark:bg-[#0D1420] transition-colors duration-300 border-b border-[#E6DFD1] dark:border-[#23344D]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <GoldLeafBranch className="w-4 h-4 text-[#B58A3C] dark:text-[#D8BD82]" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-[#B58A3C] dark:text-[#D8BD82]">
              PILLARS OF PRACTICE
            </span>
          </div>

          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight">
            Areas of Work
          </h2>
          <div className="h-[2px] bg-[#B58A3C] w-16 mx-auto mt-3 mb-4 opacity-80" />

          <p className="text-sm sm:text-base text-[#5F6470] dark:text-[#94A3B8] font-normal leading-relaxed">
            The core creative and cultural domains through which I serve heritage preservation and modern digital storytelling.
          </p>
        </div>

        {/* Four Elegant Editorial Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {areas.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`p-6 sm:p-7 rounded-sm border border-[#E8E1D3] dark:border-[#23344D] ${item.bgTone} shadow-[0_2px_8px_rgba(20,32,51,0.03)] hover:border-[#B58A3C]/60 transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-sm bg-white dark:bg-[#1B2940] border border-[#E8E1D3] dark:border-[#2A3C56] flex items-center justify-center text-[#B58A3C] dark:text-[#D8BD82] shadow-2xs">
                      <Icon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <span className="text-xs font-mono tracking-wider text-[#A0AEC0] dark:text-[#64748B]">
                      {item.number}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#142033] dark:text-[#F8F5EE] mb-2 leading-snug">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-[13.5px] text-[#5F6470] dark:text-[#94A3B8] font-normal leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#EAE3D5] dark:border-[#1E2E44]">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-[#B58A3C] dark:text-[#D8BD82]">
                    Focus Domain
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
