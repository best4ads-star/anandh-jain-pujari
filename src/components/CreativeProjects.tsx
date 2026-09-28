import React from 'react';
import { Landmark, Laptop, PenTool, Cpu, BarChart3, ArrowRight } from 'lucide-react';
import { Project } from '../types';
import { GoldLeafBranch } from './Icons';

interface CreativeProjectsProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onViewAllProjects: () => void;
}

// Five very subtle tone shifts within warm heritage neutrals
const SUBTLE_BG_TONES = [
  'bg-[#FCFAF6] dark:bg-[#131E2E]',
  'bg-[#F9F6F0] dark:bg-[#142032]',
  'bg-[#FAF7F1] dark:bg-[#131E2E]',
  'bg-[#F8F5ED] dark:bg-[#142032]',
  'bg-[#FBF8F2] dark:bg-[#131E2E]',
];

export function CreativeProjects({
  projects,
  onSelectProject,
  onViewAllProjects,
}: CreativeProjectsProps) {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Landmark':
        return <Landmark className="w-4 h-4 stroke-[1.75]" />;
      case 'Laptop':
        return <Laptop className="w-4 h-4 stroke-[1.75]" />;
      case 'PenTool':
        return <PenTool className="w-4 h-4 stroke-[1.75]" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4 stroke-[1.75]" />;
      case 'BarChart3':
      default:
        return <BarChart3 className="w-4 h-4 stroke-[1.75]" />;
    }
  };

  const handleCardClick = (e: React.MouseEvent, project: Project) => {
    e.preventDefault();
    onSelectProject(project);
  };

  return (
    <section
      id="projects"
      className="py-20 sm:py-24 lg:py-28 bg-[#F8F5EE] dark:bg-[#0D1420] transition-colors duration-300 border-t border-[#EAE3D5] dark:border-[#1E2D42]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ==================================================
            SECTION HEADER
            ================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 lg:mb-14 pb-6 border-b border-[#E6DFD1] dark:border-[#23344D]">
          <div>
            {/* Subtle botanical eyebrow */}
            <div className="inline-flex items-center gap-2 mb-2.5">
              <GoldLeafBranch className="w-4 h-4 text-[#B58A3C] dark:text-[#D8BD82]" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#B58A3C] dark:text-[#D8BD82]">
                Portfolio & Digital Initiatives
              </span>
            </div>

            {/* Heading & Short Muted-Gold Horizontal Line */}
            <div className="flex items-center gap-4 sm:gap-6">
              <h2 className="font-playfair text-2xl sm:text-3xl lg:text-[38px] font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight leading-tight">
                Digital & Creative Projects
              </h2>
              <div className="hidden sm:block h-[2px] bg-[#B58A3C] w-12 sm:w-20 lg:w-24 opacity-80 shrink-0" />
            </div>

            {/* Supporting description */}
            <p className="mt-3 text-sm sm:text-base text-[#5F6470] dark:text-[#94A3B8] max-w-2xl font-normal leading-relaxed">
              Cross-disciplinary initiatives spanning Jain heritage documentation, temple technology, graphic design, and digital innovation.
            </p>
          </div>

          {/* Right: View All Projects → */}
          <a
            id="projects-view-all-btn"
            href="/projects"
            onClick={(e) => {
              e.preventDefault();
              onViewAllProjects();
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#142033] dark:text-[#F8F5EE] hover:text-[#B58A3C] dark:hover:text-[#D8BD82] transition-colors duration-200 cursor-pointer group self-start md:self-end shrink-0 py-1"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4 text-[#B58A3C] transition-transform duration-200 group-hover:translate-x-1.5" />
          </a>
        </div>

        {/* ==================================================
            FIVE COMPACT PROJECT BLOCKS
            Desktop: 5 in one row
            Tablet: 3 + 2
            Mobile: 1 or 2 columns
            ================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-4.5 xl:gap-5">
          {projects.map((proj, index) => {
            const bgTone = SUBTLE_BG_TONES[index % SUBTLE_BG_TONES.length];
            return (
              <a
                key={proj.id}
                id={`project-card-${proj.slug || proj.id}`}
                href={`/projects/${proj.slug || proj.id}`}
                onClick={(e) => handleCardClick(e, proj)}
                className={`group relative flex flex-col justify-between p-5.5 sm:p-6 rounded-md border border-[#E8E1D3] dark:border-[#23344D] ${bgTone} hover:border-[#B58A3C]/70 hover:bg-[#F5EFE4] dark:hover:bg-[#1A283D] shadow-[0_2px_8px_rgba(20,32,51,0.03)] hover:shadow-[0_8px_20px_rgba(20,32,51,0.06)] transition-all duration-300 cursor-pointer text-left`}
              >
                {/* Top Row: Refined Line Icon & Order Index */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-9 h-9 rounded-sm bg-white dark:bg-[#1B2940] border border-[#E8E1D3] dark:border-[#2A3C56] flex items-center justify-center text-[#B58A3C] dark:text-[#D8BD82] group-hover:text-[#142033] dark:group-hover:text-white group-hover:border-[#B58A3C]/40 transition-colors shadow-2xs">
                    {getIcon(proj.icon || proj.iconName || '')}
                  </div>
                  <span className="text-[11px] font-mono tracking-wider text-[#A0AEC0] dark:text-[#64748B]">
                    0{index + 1}
                  </span>
                </div>

                {/* Middle Content: Project Category & Description */}
                <div className="flex-1">
                  <h3 className="font-playfair text-[16.5px] sm:text-[17.5px] font-bold text-[#142033] dark:text-[#F8F5EE] group-hover:text-[#B58A3C] dark:group-hover:text-[#D8BD82] transition-colors leading-snug mb-2">
                    {proj.title}
                  </h3>
                  <p className="text-[13px] sm:text-[13.5px] text-[#5F6470] dark:text-[#94A3B8] font-normal leading-relaxed">
                    {proj.subtitle || proj.category}
                  </p>
                </div>

                {/* Bottom Row: Subtle Action & Arrow Movement */}
                <div className="pt-4 mt-5 border-t border-[#EAE3D5] dark:border-[#1E2E44] flex items-center justify-between text-xs">
                  <span className="text-xs font-semibold text-[#142033] dark:text-[#F8F5EE] group-hover:text-[#B58A3C] dark:group-hover:text-[#D8BD82] transition-colors">
                    Explore
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B58A3C] transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
