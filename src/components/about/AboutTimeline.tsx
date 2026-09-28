import React from 'react';
import { Landmark, PenTool, Camera, Cpu } from 'lucide-react';
import { GoldLeafBranch } from '../Icons';

export function AboutTimeline() {
  const stages = [
    {
      number: '01',
      title: 'JAIN TEMPLE HERITAGE',
      description: 'A lifelong connection with Jain temple traditions, worship and heritage.',
      icon: Landmark,
      image: '/images/about/heritage.jpg',
      imageAlt: 'Jain temple heritage and traditional worship traditions',
    },
    {
      number: '02',
      title: 'DESIGN & CREATIVITY',
      description: 'More than 20 years of experience in graphic design and visual communication.',
      icon: PenTool,
      image: '/images/about/design.jpg',
      imageAlt: 'Graphic design and classical visual communication',
    },
    {
      number: '03',
      title: 'PHOTOGRAPHY & DOCUMENTATION',
      description: 'Documenting temples, heritage architecture, people, places and cultural memories.',
      icon: Camera,
      image: '/images/about/photography.jpg',
      imageAlt: 'Heritage architecture and field documentary photography',
    },
    {
      number: '04',
      title: 'DIGITAL & TECHNOLOGY',
      description: 'Exploring websites, applications, AI tools and digital platforms for practical creative and heritage projects.',
      icon: Cpu,
      image: '/images/about/journey.jpg',
      imageAlt: 'Web platforms and digital innovation',
    },
  ];

  return (
    <section
      id="about-journey-timeline"
      className="py-16 sm:py-20 lg:py-24 bg-[#F8F5EE] dark:bg-[#0D1420] transition-colors duration-300 border-b border-[#E6DFD1] dark:border-[#23344D]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-2.5">
            <GoldLeafBranch className="w-4 h-4 text-[#B58A3C] dark:text-[#D8BD82]" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-[#B58A3C] dark:text-[#D8BD82]">
              MILESTONES & EVOLUTION
            </span>
          </div>

          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight">
            The Arc of My Journey
          </h2>
          <div className="h-[2px] bg-[#B58A3C] w-16 mx-auto mt-3 mb-4 opacity-80" />

          <p className="text-sm sm:text-base text-[#5F6470] dark:text-[#94A3B8] font-normal leading-relaxed">
            Broad stages shaping my dedication to Jain temple rituals, creative arts, and technological innovation.
          </p>
        </div>

        {/* Editorial Timeline Container */}
        <div className="relative">
          {/* Central spine line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-[1px] bg-[#DDD3BF] dark:bg-[#23344D]" />

          <div className="space-y-10 sm:space-y-12">
            {stages.map((stage, idx) => {
              const isEven = idx % 2 === 1;
              const Icon = stage.icon;

              return (
                <div
                  key={stage.number}
                  className={`relative flex flex-col md:flex-row items-center gap-6 sm:gap-8 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Badge Point on Central Spine */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#F8F5EE] dark:bg-[#0D1420] border-2 border-[#B58A3C] items-center justify-center z-10 shadow-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#B58A3C]" />
                  </div>

                  {/* Stage Card Content (~50% width) */}
                  <div className="w-full md:w-1/2">
                    <div className="p-6 sm:p-7 rounded-sm bg-[#FCFAF6] dark:bg-[#131E2E] border border-[#E6DFD1] dark:border-[#23344D] shadow-[0_2px_8px_rgba(20,32,51,0.03)] hover:border-[#B58A3C]/60 transition-colors">
                      {/* Top Header of Card */}
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-sm bg-white dark:bg-[#1A283D] border border-[#E2D8C3] dark:border-[#2B3E58] flex items-center justify-center text-[#B58A3C] dark:text-[#D8BD82]">
                            <Icon className="w-4 h-4 stroke-[1.75]" />
                          </div>
                          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#B58A3C] dark:text-[#D8BD82]">
                            Stage {stage.number}
                          </span>
                        </div>
                        <span className="text-xs font-mono text-[#A0AEC0] dark:text-[#64748B]">
                          {stage.number} / 04
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight leading-snug mb-2.5">
                        {stage.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm sm:text-[14.5px] text-[#5F6470] dark:text-[#94A3B8] font-normal leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  {/* Empty side on desktop for spacing balance */}
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
