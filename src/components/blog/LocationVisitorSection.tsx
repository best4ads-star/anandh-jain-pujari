import React from 'react';
import { MapPin, Navigation, Clock, ShieldCheck, AlertCircle, ExternalLink } from 'lucide-react';

interface LocationSectionProps {
  templeName?: string;
  className?: string;
}

/**
 * Structured Location & Visitor Information component.
 * Adheres strictly to Verified Research Protection:
 * Shows [VERIFIED LOCATION INFORMATION TO BE ADDED] without fabricating
 * addresses, coordinates, opening hours, or phone numbers.
 * Prepared with clean architecture for a future Google Maps location embed.
 */
export function LocationVisitorSection({
  templeName = 'Avalpoondurai Jain Temple',
  className = '',
}: LocationSectionProps) {
  return (
    <div id="location-visitor-information" className={`mt-14 pt-10 border-t border-[#E8E0D0] dark:border-[#1E2E42] scroll-mt-24 ${className}`}>
      {/* Heading */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#B58A3C] shrink-0" />
        <h2 className="font-playfair text-2xl sm:text-[28px] font-bold text-[#142033] dark:text-[#F8F5EE] tracking-tight">
          Location & Visitor Information
        </h2>
      </div>
      <div className="h-[1.5px] bg-[#E8E0D2] dark:border-[#233348] w-full mb-6" />

      {/* Verified Notice Box */}
      <div className="p-5 sm:p-6 rounded-sm bg-[#FCFAF6] dark:bg-[#121E2E] border border-[#E6DBCA] dark:border-[#223348] shadow-2xs">
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-9 h-9 rounded-full bg-[#F5EBD7] dark:bg-[#342817] flex items-center justify-center text-[#B58A3C] shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold font-mono tracking-wider uppercase text-[#B58A3C] dark:text-[#D8BD82] mb-1">
              Field Documentation Notice
            </div>
            <p className="text-sm font-sans text-[#5F6470] dark:text-[#CBD5E1] leading-relaxed">
              <strong>[VERIFIED LOCATION INFORMATION TO BE ADDED]</strong> — To protect the factual integrity of this heritage documentation project, specific door addresses, cadastral survey coordinates, active contact numbers, daily pooja timings, and visitor guidelines are omitted until corroborated by the local temple management trust.
            </p>
          </div>
        </div>

        {/* Prepared Architecture for Future Google Maps & Survey Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#EFE8DC] dark:border-[#1D2B3D]">
          {/* Geolocation placeholder card */}
          <div className="p-4 rounded-xs bg-[#F5EFE3]/70 dark:bg-[#152336]/70 border border-[#E5DAC6] dark:border-[#24374D] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#142033] dark:text-[#F8F5EE] mb-2">
                <MapPin className="w-4 h-4 text-[#B58A3C]" />
                <span>Geographic Position & Cadastral Mapping</span>
              </div>
              <p className="text-xs text-[#718096] dark:text-[#94A3B8] leading-relaxed mb-3">
                Broad Region: Avalpoondurai, Erode District, Tamil Nadu, India. Precise GPS coordinates and survey demarcations will be mapped during the upcoming field expedition.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-[#B58A3C]">
              <span>[Geo-coordinates pending physical GPS calibration]</span>
            </div>
          </div>

          {/* Visitor Protocol card */}
          <div className="p-4 rounded-xs bg-[#F5EFE3]/70 dark:bg-[#152336]/70 border border-[#E5DAC6] dark:border-[#24374D] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#142033] dark:text-[#F8F5EE] mb-2">
                <ShieldCheck className="w-4 h-4 text-[#B58A3C]" />
                <span>Sanctum Etiquette & Protocol</span>
              </div>
              <p className="text-xs text-[#718096] dark:text-[#94A3B8] leading-relaxed mb-3">
                In accordance with Digambara Jain traditions, visitors are advised to remove footwear outside the enclosure, maintain contemplative silence, and respect sanctum sanctity.
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-[#718096] dark:text-[#94A3B8]">
              <span>[Verified Darshan hours to be published]</span>
            </div>
          </div>
        </div>

        {/* Google Maps Interactive Container Placeholder (CMS-Ready) */}
        <div className="mt-5 rounded-xs overflow-hidden border border-[#E0D4BE] dark:border-[#24364D] bg-[#EFE9DD] dark:bg-[#101A27] aspect-[21/9] flex flex-col items-center justify-center p-6 text-center">
          <MapPin className="w-6 h-6 text-[#B58A3C] mb-2 opacity-80" />
          <div className="font-playfair text-sm sm:text-base font-bold text-[#142033] dark:text-[#F8F5EE] mb-1">
            Google Maps Integration Container
          </div>
          <p className="text-xs font-mono text-[#718096] dark:text-[#94A3B8] max-w-md">
            Interactive map embed will activate upon verification of the official geographic pin for Avalpoondurai Jain Temple.
          </p>
        </div>
      </div>
    </div>
  );
}
