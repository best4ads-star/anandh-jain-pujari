import React, { useEffect } from 'react';
import { X, CheckCircle2, Wrench, ArrowRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onContactClick: () => void;
}

export function ProjectModal({ project, onClose, onContactClick }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      id="project-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        id="project-modal-content"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-[#FAF7F0] dark:bg-[#142033] rounded-2xl shadow-2xl border border-[#E6DFD1] dark:border-[#263750] overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#F2ECE0] via-[#E8DEC7] to-[#F2ECE0] dark:from-[#18263B] dark:via-[#1B293F] dark:to-[#18263B] border-b border-[#E3D8C1] dark:border-[#253750] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#B58A3C] dark:text-[#D8BD82]">
              Digital & Creative Initiative
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142033] dark:text-[#F8F5EE]">
              {project.title}
            </h2>
            <p className="text-xs text-[#718096] dark:text-[#94A3B8] font-medium mt-0.5">
              {project.subtitle}
            </p>
          </div>

          <button
            id="close-project-modal"
            onClick={onClose}
            aria-label="Close project modal"
            className="w-9 h-9 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 text-[#142033] dark:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-[#2D3748] dark:text-[#CBD5E1] text-sm sm:text-base leading-relaxed">
          <div>
            <h4 className="font-serif text-lg font-bold text-[#142033] dark:text-[#F8F5EE] mb-2">
              Overview & Mission
            </h4>
            <p className="leading-relaxed font-normal">{project.description}</p>
          </div>

          {/* Tools & Methodologies */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#142033] dark:text-[#F8F5EE] mb-3 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#B58A3C]" />
              Core Competencies & Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {(project.tools || project.tags || []).map((tool, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1A263B] border border-[#E6DFD1] dark:border-[#263750] text-xs font-semibold text-[#142033] dark:text-[#E2E8F0] shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B58A3C]" />
                  {tool}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#F1ECE0] dark:bg-[#1B273A] p-4 rounded-xl border border-[#E4DCBC] dark:border-[#263750]">
            <p className="text-xs text-[#718096] dark:text-[#94A3B8] leading-normal">
              Interested in collaborating on a heritage digital platform, temple archiving, or creative design initiative? Get in touch directly with Anandh.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E6DFD1] dark:border-[#23344D] bg-[#F4EFE5] dark:bg-[#0D1420] flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onContactClick();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B58A3C] dark:text-[#D8BD82] hover:text-[#142033] dark:hover:text-white cursor-pointer"
          >
            <span>Collaborate on this</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#142033] hover:bg-[#B58A3C] text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
