import React, { useState } from 'react';
import { Facebook, Instagram, Youtube, Linkedin, Mail, Check } from 'lucide-react';
import { GoldLeafBranch } from './Icons';

interface BottomQuoteBannerProps {
  onContactClick: () => void;
}

export function BottomQuoteBanner({ onContactClick }: BottomQuoteBannerProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleEmailClick = () => {
    navigator.clipboard?.writeText('bestanandh@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
    onContactClick();
  };

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      href: 'https://facebook.com',
      id: 'social-facebook',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      href: 'https://instagram.com',
      id: 'social-instagram',
    },
    {
      name: 'YouTube',
      icon: Youtube,
      href: 'https://youtube.com',
      id: 'social-youtube',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com',
      id: 'social-linkedin',
    },
  ];

  return (
    <section id="quote-banner" className="py-12 sm:py-16 lg:py-20 bg-[#F8F5EE] dark:bg-[#0D1420] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#EDE5D3] dark:bg-[#162234] rounded-md p-7 sm:p-10 lg:p-12 border border-[#DFD5BF] dark:border-[#253952] shadow-sm flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left: Botanical Motif & Centered Quote */}
          <div className="flex items-center gap-6 sm:gap-8 text-center md:text-left flex-1">
            <div className="hidden sm:block flex-shrink-0">
              <GoldLeafBranch className="w-12 h-12 sm:w-14 sm:h-14 text-[#B58A3C] dark:text-[#D8BD82]" />
            </div>

            <div>
              <blockquote className="font-playfair italic text-xl sm:text-2xl md:text-[26px] lg:text-[28px] font-bold text-[#142033] dark:text-[#F8F5EE] leading-snug">
                “Preserve the roots, create the future.”
              </blockquote>
              <p className="text-xs sm:text-[13px] font-bold tracking-[0.22em] uppercase text-[#B58A3C] dark:text-[#D8BD82] mt-2.5 font-sans">
                — Anandh Jain Pujari
              </p>
            </div>
          </div>

          {/* Right: Social Follow Links */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 flex-shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[#DFD5BF] dark:border-[#253952] w-full md:w-auto justify-center">
            <span className="text-xs sm:text-[13px] font-semibold text-[#4A5568] dark:text-[#CBD5E1] whitespace-nowrap">
              Follow My Journey
            </span>

            <div className="flex items-center gap-2.5">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    id={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow on ${item.name}`}
                    className="w-9 h-9 rounded-full bg-[#142033] hover:bg-[#B58A3C] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-2xs"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}

              <button
                id="social-email"
                onClick={handleEmailClick}
                aria-label="Send email"
                title="bestanandh@gmail.com"
                className="w-9 h-9 rounded-full bg-[#142033] hover:bg-[#B58A3C] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-2xs cursor-pointer"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-300" /> : <Mail className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
