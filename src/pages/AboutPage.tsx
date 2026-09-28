import React, { useEffect } from 'react';
import { ArrowLeft, Mail, ChevronRight, Home } from 'lucide-react';
import { AboutHero } from '../components/about/AboutHero';
import { AboutIntroduction } from '../components/about/AboutIntroduction';
import { AboutTimeline } from '../components/about/AboutTimeline';
import { AboutMission } from '../components/about/AboutMission';
import { AboutAreasOfWork } from '../components/about/AboutAreasOfWork';
import { BottomQuoteBanner } from '../components/BottomQuoteBanner';

interface AboutPageProps {
  onNavigateHome: () => void;
  onContactClick: () => void;
}

export function AboutPage({ onNavigateHome, onContactClick }: AboutPageProps) {
  // Configure SEO metadata and Schema.org Person structured data
  useEffect(() => {
    // 1. Page Title
    const originalTitle = document.title;
    document.title = 'About Anandh Jain Pujari | Jain Heritage, Design & Digital';

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    const newDesc =
      'Learn about Anandh Jain Pujari, Jain temple priest, heritage documentation enthusiast, graphic designer, photographer and digital creator documenting Jain heritage and exploring technology.';
    if (metaDesc) {
      metaDesc.setAttribute('content', newDesc);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      metaDesc.setAttribute('content', newDesc);
      document.head.appendChild(metaDesc);
    }

    // 3. OpenGraph Title and Description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'About Anandh Jain Pujari | Jain Heritage, Design & Digital');

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', newDesc);

    // 4. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    const originalCanonical = canonical ? canonical.getAttribute('href') : null;
    const aboutUrl = typeof window !== 'undefined' ? `${window.location.origin}/about` : 'https://anandhjain.com/about';
    if (canonical) {
      canonical.setAttribute('href', aboutUrl);
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', aboutUrl);
      document.head.appendChild(canonical);
    }

    // 5. Schema.org Person Structured Data (JSON-LD)
    const personSchema = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Anandh Jain Pujari',
      jobTitle: 'Jain Temple Priest, Heritage Documentarian & Graphic Designer',
      description:
        'Jain temple priest, heritage documentation enthusiast, graphic designer, photographer and digital creator documenting Jain heritage and exploring technology.',
      url: aboutUrl,
      image: typeof window !== 'undefined' ? `${window.location.origin}/images/about/anandh-jain-pujari.jpg` : '',
      worksFor: {
        '@type': 'Organization',
        name: 'Jain Heritage of Erode & Kongu Nadu Archives',
      },
      knowsAbout: [
        'Jain Heritage',
        'Kongu Nadu History',
        'Temple Architecture',
        'Epigraphical Inscriptions',
        'Graphic Design',
        'Field Photography',
        'Digital Archiving',
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Erode',
        addressRegion: 'Tamil Nadu',
        addressCountry: 'India',
      },
    };

    const scriptId = 'person-structured-data';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(personSchema);

    // Scroll to top upon entering page
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Cleanup on unmount
    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) metaDesc.setAttribute('content', originalDesc);
      if (canonical && originalCanonical) canonical.setAttribute('href', originalCanonical);
      const existingScript = document.getElementById(scriptId);
      if (existingScript) existingScript.remove();
    };
  }, []);

  return (
    <article className="min-h-screen bg-[#F8F5EE] dark:bg-[#0D1420] text-[#142033] dark:text-[#F8F5EE] transition-colors duration-300">
      {/* Editorial Breadcrumb Navigation Bar */}
      <div className="border-b border-[#E8E1D3] dark:border-[#1E2D42] bg-[#F4EFE5] dark:bg-[#090E17]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#5F6470] dark:text-[#94A3B8]">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 hover:text-[#B58A3C] dark:hover:text-[#D8BD82] transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3 h-3 text-[#A0AEC0] dark:text-[#64748B]" />
            <span className="text-[#142033] dark:text-[#F8F5EE] font-semibold">About / My Story</span>
          </nav>

          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#142033] dark:text-[#F8F5EE] hover:text-[#B58A3C] dark:hover:text-[#D8BD82] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* 1. Smaller Editorial Page Hero */}
      <AboutHero />

      {/* 2. Personal & Authentic Introduction */}
      <AboutIntroduction />

      {/* 3. My Journey: 4 Broad Stages Timeline */}
      <AboutTimeline />

      {/* 4. Heritage Mission Section with Large Pull Quote */}
      <AboutMission />

      {/* 5. Four Elegant Areas of Work */}
      <AboutAreasOfWork />

      {/* 6. Quote Banner & Community Link */}
      <BottomQuoteBanner onContactClick={onContactClick} />
    </article>
  );
}
