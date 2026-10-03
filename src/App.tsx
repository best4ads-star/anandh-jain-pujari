/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { LatestBlog } from './components/LatestBlog';
import { ExploreCategory } from './components/ExploreCategory';
import { MyJourney } from './components/MyJourney';
import { TempleHeritage } from './components/TempleHeritage';
import { CreativeProjects } from './components/CreativeProjects';
import { BottomQuoteBanner } from './components/BottomQuoteBanner';
import { Footer } from './components/Footer';
import { AboutPage } from './pages/AboutPage';
import { BlogIndexPage } from './pages/BlogIndexPage';
import { BlogPostPage } from './pages/BlogPostPage';

import { ArticleModal } from './components/ArticleModal';
import { TempleModal } from './components/TempleModal';
import { ProjectModal } from './components/ProjectModal';
import { StoryModal } from './components/StoryModal';
import { SearchModal } from './components/SearchModal';
import { ContactModal } from './components/ContactModal';
import { AuthProvider } from './services/firebase/AuthContext';
import { AdminRouter } from './pages/admin/AdminRouter';

import { ARTICLES, TEMPLES, PROJECTS } from './data/content';
import { Article, Temple, Project, Category } from './types';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('anandh_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Modals state
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isStoryModalOpen, setIsStoryModalOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

  // Active section tracking
  const [activeSection, setActiveSection] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/about') return 'about';
      if (path === '/blog' || path.startsWith('/blog/')) return 'blog';
      if (path === '/temples' || path === '/heritage' || path.startsWith('/temples/') || path.startsWith('/heritage/')) return 'temples';
      if (path === '/photography') return 'photography';
      if (path === '/projects' || path.startsWith('/projects/')) return 'projects';
      if (path === '/contact') return 'contact';
      if (path.startsWith('/admin')) return 'admin';
    }
    return 'home';
  });

  // Active route tracking: default to window.location.pathname or '/'
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname && window.location.pathname !== ''
        ? window.location.pathname
        : '/';
    }
    return '/';
  });

  // Filtered articles (can be filtered by category)
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);

  // Handle URL route synchronization for clean URLs:
  // /, /about, /blog, /blog/:slug, /heritage, /temples, /temples/:slug, /heritage/:slug, /photography, /projects, /projects/:slug, /contact, /admin
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);

      if (path === '/about') {
        setActiveSection('about');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path === '/blog') {
        setActiveSection('blog');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path.startsWith('/blog/')) {
        setActiveSection('blog');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path.startsWith('/admin')) {
        setActiveSection('admin');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else if (path.startsWith('/temples/') || path.startsWith('/heritage/')) {
        setActiveSection('temples');
        const slug = path.replace(/^\/(temples|heritage)\//, '').replace(/\/$/, '');
        const matched = TEMPLES.find((t) => t.slug === slug || t.id === slug);
        if (matched) {
          setSelectedTemple(matched);
        }
      } else if (path === '/temples' || path === '/heritage') {
        setActiveSection('temples');
        setTimeout(() => {
          const el = document.getElementById('temples');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else if (path === '/photography') {
        setActiveSection('photography');
        setTimeout(() => {
          const el = document.getElementById('blog');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else if (path.startsWith('/projects/')) {
        setActiveSection('projects');
        const slug = path.replace('/projects/', '').replace(/\/$/, '');
        const matched = PROJECTS.find((p) => p.slug === slug || p.id === slug);
        if (matched) {
          setSelectedProject(matched);
        }
      } else if (path === '/projects') {
        setActiveSection('projects');
        setTimeout(() => {
          const el = document.getElementById('projects');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      } else if (path === '/contact') {
        setActiveSection('contact');
        setIsContactOpen(true);
      } else if (path === '/' || !path) {
        setActiveSection('home');
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  const handleOpenBlogSlug = (slug: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/blog/${slug}`);
    }
    setCurrentPath(`/blog/${slug}`);
    setActiveSection('blog');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenArticle = (article: Article) => {
    handleOpenBlogSlug(article.slug);
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/blog/')) {
      window.history.pushState({}, '', '/blog');
      setCurrentPath('/blog');
    }
  };

  const handleOpenTemple = (temple: Temple) => {
    setSelectedTemple(temple);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/temples/${temple.slug || temple.id}`);
    }
  };

  const handleCloseTemple = () => {
    setSelectedTemple(null);
    if (
      typeof window !== 'undefined' &&
      (window.location.pathname.startsWith('/temples/') || window.location.pathname.startsWith('/heritage/'))
    ) {
      window.history.pushState({}, '', '/temples');
    }
  };

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/projects/${project.slug || project.id}`);
    }
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/projects/')) {
      window.history.pushState({}, '', '/');
    }
  };

  // Handle dark mode side-effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('anandh_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('anandh_theme', 'light');
    }
  }, [darkMode]);

  // Navigation handler
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);

    if (sectionId === 'admin' || sectionId.startsWith('/admin')) {
      const target = sectionId === 'admin' ? '/admin' : sectionId;
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', target);
      }
      setCurrentPath(target);
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (sectionId.startsWith('/blog/')) {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', sectionId);
      }
      setCurrentPath(sectionId);
      setActiveSection('blog');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (sectionId === 'about') {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/about');
      }
      setCurrentPath('/about');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    if (sectionId === 'blog') {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/blog');
      }
      setCurrentPath('/blog');
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    // If navigating from /about, /blog, /blog/:slug or /admin to a homepage section
    if (
      currentPath === '/about' ||
      currentPath === '/blog' ||
      currentPath.startsWith('/blog/') ||
      currentPath.startsWith('/admin')
    ) {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/');
      }
      setCurrentPath('/');
      setTimeout(() => {
        if (sectionId === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (sectionId === 'heritage' || sectionId === 'temples') {
          if (typeof window !== 'undefined') {
            window.history.pushState({}, '', '/temples');
          }
          const el = document.getElementById('temples');
          el?.scrollIntoView({ behavior: 'smooth' });
        } else if (sectionId === 'photography') {
          const el = document.getElementById('blog');
          el?.scrollIntoView({ behavior: 'smooth' });
        } else if (sectionId === 'projects') {
          const el = document.getElementById('projects');
          el?.scrollIntoView({ behavior: 'smooth' });
        } else if (sectionId === 'contact') {
          setIsContactOpen(true);
        }
      }, 60);
      return;
    }

    // Already on homepage
    if (sectionId === 'home') {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/');
      }
      setCurrentPath('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'blog') {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/blog');
      }
      setCurrentPath('/blog');
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (sectionId === 'heritage' || sectionId === 'temples') {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/temples');
      }
      setCurrentPath('/temples');
      const el = document.getElementById('temples');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'photography') {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/photography');
      }
      setCurrentPath('/photography');
      const el = document.getElementById('blog');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'projects') {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/projects');
      }
      setCurrentPath('/projects');
      const el = document.getElementById('projects');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'contact') {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/contact');
      }
      setCurrentPath('/contact');
      setIsContactOpen(true);
    } else {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/');
      }
      setCurrentPath('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Category selection handler
  const handleSelectCategory = (category: Category) => {
    if (category.id === 'all-articles') {
      setActiveCategorySlug(null);
      const el = document.getElementById('blog');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveCategorySlug(category.id);
      const el = document.getElementById('blog');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const displayedArticles = activeCategorySlug
    ? ARTICLES.filter((a) => a.categorySlug === activeCategorySlug)
    : ARTICLES;

  // Render Admin CMS if route is in /admin namespace
  if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
    return (
      <AuthProvider>
        <AdminRouter currentPath={currentPath} onNavigate={handleNavigate} />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#F8F5EE] dark:bg-[#0D1420] text-[#142033] dark:text-[#F8F5EE] selection:bg-[#B58A3C]/25 selection:text-[#142033] dark:selection:text-white transition-colors duration-300">
      {/* 1. Header with brand, nav links, search & theme toggle */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenSearch={() => setIsSearchOpen(true)}
        activeSection={
          currentPath === '/about'
            ? 'about'
            : currentPath === '/blog' || currentPath.startsWith('/blog/')
            ? 'blog'
            : activeSection
        }
        onNavigate={handleNavigate}
      />

      {/* Main Content Area: /about Standalone Page OR /blog Index OR /blog/:slug Article Page OR Homepage */}
      {currentPath === '/about' ? (
        <main className="flex-1">
          <AboutPage
            onNavigateHome={() => handleNavigate('home')}
            onContactClick={() => setIsContactOpen(true)}
          />
        </main>
      ) : currentPath === '/blog' ? (
        <main className="flex-1">
          <BlogIndexPage
            onNavigateHome={() => handleNavigate('home')}
            onSelectArticle={(slug) => handleOpenBlogSlug(slug)}
          />
        </main>
      ) : currentPath.startsWith('/blog/') ? (
        <main className="flex-1">
          <BlogPostPage
            slug={currentPath.replace('/blog/', '').replace(/\/$/, '')}
            onNavigateHome={() => handleNavigate('home')}
            onNavigateBlog={() => handleNavigate('blog')}
            onSelectArticle={(slug) => handleOpenBlogSlug(slug)}
          />
        </main>
      ) : (
        <main className="flex-1">
          {/* 2. Hero section: "Tradition Meets Technology" + Portrait/Temple composition */}
          <Hero
            onExploreJourney={() => handleNavigate('about')}
            onReadBlog={() => handleNavigate('blog')}
          />

          {/* 3. Latest from the Blog: 4-card layout */}
          <LatestBlog
            articles={displayedArticles.length > 0 ? displayedArticles : ARTICLES}
            onSelectArticle={handleOpenArticle}
            onViewAll={() => {
              setActiveCategorySlug(null);
              const el = document.getElementById('blog');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* 4. Explore by Category: 5 category cards strip */}
          <ExploreCategory onSelectCategory={handleSelectCategory} />

          {/* 5. My Journey: Two-column editorial section with portrait, bio & quote card */}
          <MyJourney onReadStory={() => handleNavigate('about')} />

          {/* 6. Jain Heritage of Erode & Kongu Nadu: 5-card temple section */}
          <TempleHeritage
            temples={TEMPLES}
            onSelectTemple={handleOpenTemple}
            onExploreAll={() => {
              const el = document.getElementById('temples');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* 7. Digital & Creative Projects: 5 compact project blocks */}
          <CreativeProjects
            projects={PROJECTS}
            onSelectProject={handleOpenProject}
            onViewAllProjects={() => {
              const el = document.getElementById('projects');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* 8. Bottom Quote & Follow My Journey Banner */}
          <BottomQuoteBanner onContactClick={() => setIsContactOpen(true)} />
        </main>
      )}

      {/* 9. Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Interactive Modals */}
      <ArticleModal
        article={selectedArticle}
        onClose={handleCloseArticle}
      />

      <TempleModal
        temple={selectedTemple}
        onClose={handleCloseTemple}
      />

      <ProjectModal
        project={selectedProject}
        onClose={handleCloseProject}
        onContactClick={() => {
          handleCloseProject();
          setIsContactOpen(true);
        }}
      />

      <StoryModal
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectArticle={(article) => setSelectedArticle(article)}
        onSelectTemple={(temple) => setSelectedTemple(temple)}
        onSelectProject={(project) => setSelectedProject(project)}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => {
          setIsContactOpen(false);
          if (typeof window !== 'undefined' && window.location.pathname === '/contact') {
            window.history.pushState({}, '', '/');
            setCurrentPath('/');
            setActiveSection('home');
          }
        }}
      />
    </div>
    </AuthProvider>
  );
}
