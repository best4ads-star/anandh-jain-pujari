import React, { useState } from 'react';
import { Search, Sun, Moon, Menu, X } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenSearch: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function Header({
  darkMode,
  setDarkMode,
  onOpenSearch,
  activeSection,
  onNavigate,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Blog', id: 'blog' },
    { label: 'Heritage', id: 'heritage' },
    { label: 'Temples', id: 'temples' },
    { label: 'Photography', id: 'photography' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 w-full bg-[#F8F5EE]/95 dark:bg-[#0D1420]/95 backdrop-blur-md border-b border-[#E6DFD1]/60 dark:border-[#24354D]/60 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <button
          id="brand-logo-button"
          onClick={() => handleNavClick('home')}
          className="text-left group cursor-pointer focus:outline-none shrink-0"
        >
          <div className="font-serif text-xl sm:text-2xl lg:text-[26px] font-bold tracking-tight text-[#142033] dark:text-[#F8F5EE] group-hover:text-[#B58A3C] transition-colors leading-tight whitespace-nowrap">
            Anandh Jain Pujari
          </div>
          <div className="text-[9px] sm:text-[10px] font-semibold tracking-[0.16em] sm:tracking-[0.22em] uppercase text-[#B58A3C] dark:text-[#D8BD82] mt-0.5 whitespace-nowrap">
            Jain Heritage • Culture • Design • Digital
          </div>
        </button>

        {/* Center: Desktop Navigation */}
        <nav id="desktop-nav" className="hidden lg:flex items-center space-x-4 xl:space-x-7 shrink-0">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleNavClick(link.id)}
                className={`text-sm font-medium transition-colors relative py-1 focus:outline-none cursor-pointer ${
                  isActive
                    ? 'text-[#B58A3C] dark:text-[#D8BD82] font-semibold'
                    : 'text-[#4A5568] dark:text-[#CBD5E1] hover:text-[#142033] dark:hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-[#B58A3C] dark:bg-[#D8BD82] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Search & Light/Dark Mode Switcher */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Search Button */}
          <button
            id="header-search-btn"
            onClick={onOpenSearch}
            aria-label="Search articles, temples, and projects"
            className="p-2 text-[#4A5568] dark:text-[#CBD5E1] hover:text-[#142033] dark:hover:text-white hover:bg-[#EAE4D6] dark:hover:bg-[#1A263B] rounded-full transition-colors cursor-pointer"
          >
            <Search className="w-[18px] h-[18px]" />
          </button>

          {/* Theme Switcher Pill (Matching Reference: Sun on left, Moon in dark capsule on right) */}
          <button
            id="header-theme-toggle"
            onClick={() => setDarkMode((prev) => !prev)}
            aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="relative flex items-center p-1 rounded-full border border-[#D5CCBA] dark:border-[#2D415F] bg-[#EAE4D6] dark:bg-[#142033] transition-colors cursor-pointer w-[68px] h-[32px]"
          >
            <div className="w-full flex items-center justify-between px-1.5 z-10 text-[13px]">
              <Sun
                className={`w-3.5 h-3.5 transition-colors ${
                  !darkMode ? 'text-[#B58A3C]' : 'text-slate-400 opacity-60'
                }`}
              />
              <Moon
                className={`w-3.5 h-3.5 transition-colors ${
                  darkMode ? 'text-white' : 'text-slate-500 opacity-60'
                }`}
              />
            </div>
            {/* Sliding indicator */}
            <span
              className={`absolute top-[3px] w-[26px] h-[24px] rounded-full bg-[#142033] dark:bg-[#20324E] shadow-sm transition-transform duration-200 ${
                darkMode ? 'translate-x-[34px]' : 'translate-x-0 bg-white'
              }`}
            />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="p-2 lg:hidden text-[#4A5568] dark:text-[#CBD5E1] hover:text-[#142033] dark:hover:text-white rounded-md"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu-dropdown"
          className="lg:hidden border-t border-[#E6DFD1] dark:border-[#24354D] bg-[#F8F5EE] dark:bg-[#0D1420] px-4 pt-3 pb-6 space-y-1 shadow-lg"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left py-2.5 px-3 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EAE4D6] dark:bg-[#1A263B] text-[#B58A3C] dark:text-[#D8BD82] font-semibold'
                    : 'text-[#4A5568] dark:text-[#CBD5E1] hover:bg-[#EAE4D6]/50 dark:hover:bg-[#1A263B]/50'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
