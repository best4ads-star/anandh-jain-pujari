import React from 'react';
import { Facebook, Instagram, Youtube, Linkedin, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Blog', id: 'blog' },
    { label: 'Heritage', id: 'heritage' },
    { label: 'Temples', id: 'temples' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
    { label: 'Admin CMS', id: 'admin' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
    { name: 'Email', icon: Mail, href: 'mailto:bestanandh@gmail.com' },
  ];

  return (
    <footer
      id="main-footer"
      className="border-t border-[#E6DFD1] dark:border-[#23344D] bg-[#F4EFE5] dark:bg-[#0A101A] py-14 sm:py-18 lg:py-20 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10">
          {/* Left: Brand & Tagline */}
          <div className="text-center lg:text-left">
            <div className="font-playfair text-2xl font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight">
              Anandh Jain Pujari
            </div>
            <div className="text-xs tracking-[0.2em] uppercase text-[#B58A3C] dark:text-[#D8BD82] font-semibold mt-1">
              JAIN HERITAGE • CULTURE • DESIGN • DIGITAL
            </div>
          </div>

          {/* Center: Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 text-xs sm:text-[13px] font-medium text-[#4A5568] dark:text-[#CBD5E1]">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`footer-nav-${link.id}`}
                onClick={() => onNavigate(link.id)}
                className="hover:text-[#B58A3C] dark:hover:text-[#D8BD82] transition-colors focus:outline-none cursor-pointer py-1"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right: Social Links & Copyright */}
          <div className="flex flex-col items-center lg:items-end gap-3 text-center lg:text-right">
            <div className="flex items-center gap-3 text-[#5F6470] dark:text-[#94A3B8]">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow on ${item.name}`}
                    className="w-8 h-8 rounded-full border border-[#DCD3C1] dark:border-[#253952] flex items-center justify-center hover:text-[#B58A3C] hover:border-[#B58A3C] dark:hover:text-[#D8BD82] dark:hover:border-[#D8BD82] transition-colors duration-200"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>
            <div className="text-xs text-[#718096] dark:text-[#94A3B8]">
              © {new Date().getFullYear()} Anandh Jain Pujari. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
