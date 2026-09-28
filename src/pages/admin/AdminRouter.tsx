import React from 'react';
import { useAuth } from '../../services/firebase/AuthContext';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminDashboardPage } from './AdminDashboardPage';
import { AdminBlogPage } from './AdminBlogPage';
import { AdminBlogEditorPage } from './AdminBlogEditorPage';
import { AdminHeroPage } from './AdminHeroPage';
import { AdminMediaPage } from './AdminMediaPage';
import { AdminSettingsPage } from './AdminSettingsPage';
import { AdminGenericPage } from './AdminGenericPage';
import { COLLECTIONS } from '../../services/firestore/collections';

interface AdminRouterProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function AdminRouter({ currentPath, onNavigate }: AdminRouterProps) {
  const { isAuthenticated, isFirebaseConfigured, isLoading } = useAuth();

  // If on login route
  if (currentPath === '/admin/login') {
    return (
      <AdminLoginPage
        onNavigateHome={() => onNavigate('/')}
        onNavigateAdmin={() => onNavigate('/admin')}
      />
    );
  }

  // Route Protection:
  // If Firebase is configured and user is not authenticated, redirect to /admin/login
  if (isFirebaseConfigured && !isAuthenticated && !isLoading) {
    return (
      <AdminLoginPage
        onNavigateHome={() => onNavigate('/')}
        onNavigateAdmin={() => onNavigate('/admin')}
      />
    );
  }

  // Render Protected Admin Content inside AdminLayout
  let content = <AdminDashboardPage onNavigate={onNavigate} />;

  if (currentPath === '/admin/blog/new') {
    content = <AdminBlogEditorPage isNew onNavigate={onNavigate} />;
  } else if (currentPath.startsWith('/admin/blog/edit/')) {
    const editId = currentPath.replace('/admin/blog/edit/', '').replace(/\/$/, '');
    content = <AdminBlogEditorPage articleId={editId} onNavigate={onNavigate} />;
  } else {
    switch (currentPath) {
      case '/admin':
        content = <AdminDashboardPage onNavigate={onNavigate} />;
        break;

      case '/admin/blog':
        content = <AdminBlogPage onNavigate={onNavigate} />;
        break;

    case '/admin/temples':
      content = (
        <AdminGenericPage
          collectionName={COLLECTIONS.TEMPLES}
          title="Temples"
          description="Documentation of sacred Kongu Nadu and Tamil Jain temples, architectural styles, and deities."
          sampleItems={[
            { id: 'avalpoondurai', title: 'Avalpoondurai Jain Temple', status: 'published', subtitle: 'Presiding: Bhagwan Parshwanatha' },
            { id: 'vijayamangalam', title: 'Vijayamangalam Chandraprabha Temple', status: 'published', subtitle: 'Historical Western Ganga foundation' },
            { id: 'tingalur', title: 'Tingalur Chandranatha Swamy Temple', status: 'published', subtitle: 'Sacred Kongu heritage site' },
            { id: 'arachalur', title: 'Arachalur Jain Beds & Inscriptions', status: 'published', subtitle: '2nd century CE epigraphical rock shelter' },
          ]}
        />
      );
      break;

    case '/admin/heritage':
      content = (
        <AdminGenericPage
          collectionName={COLLECTIONS.HERITAGE}
          title="Heritage"
          description="Epigraphical inscriptions, sacred literature, and cultural preservation archives."
          sampleItems={[
            { id: 'kongu-epigraphy', title: 'Tamil-Brahmi & Vatteluttu Epigraphy', status: 'published', subtitle: 'Kongu region rock inscriptions' },
            { id: 'jain-traditions', title: 'Living Digambara Traditions of Tamil Nadu', status: 'published', subtitle: 'Ritual and daily pooja traditions' },
            { id: 'ancient-monasteries', title: 'Ancient Jain Monasteries of Western Tamil Nadu', status: 'published', subtitle: 'Historical research archive' },
          ]}
        />
      );
      break;

    case '/admin/photography':
      content = (
        <AdminGenericPage
          collectionName={COLLECTIONS.PHOTOGRAPHY}
          title="Photography Archive"
          description="Field photography records of sanctum sculptures, pillars, mandapas, and vimanas."
          sampleItems={[
            { id: 'photo-1', title: 'Parshwanatha Sanctum Iconography', status: 'published', subtitle: 'Avalpoondurai Sanctum' },
            { id: 'photo-2', title: 'Carved Granite Pillars of Mandapa', status: 'published', subtitle: 'Vijayamangalam' },
            { id: 'photo-3', title: 'Tingalur Vatteluttu Inscription Plaque', status: 'published', subtitle: 'Epigraphical record' },
          ]}
        />
      );
      break;

    case '/admin/projects':
      content = (
        <AdminGenericPage
          collectionName={COLLECTIONS.PROJECTS}
          title="Projects"
          description="Heritage preservation initiatives, digital mapping, and publications."
          sampleItems={[
            { id: 'proj-1', title: 'Tamil Jain Epigraphical Documentation Project', status: 'published', subtitle: 'Digital inscription translation' },
            { id: 'proj-2', title: 'Kongu Nadu Jain Temple Audio Guide Series', status: 'published', subtitle: 'Audio preservation initiative' },
            { id: 'proj-3', title: 'Sacred Temples of Erode Monograph', status: 'published', subtitle: 'Printed research archive' },
          ]}
        />
      );
      break;

    case '/admin/pages':
      content = (
        <AdminGenericPage
          collectionName={COLLECTIONS.PAGES}
          title="Pages"
          description="Static content pages: About, Mission, Contact, and Legal."
          sampleItems={[
            { id: 'about', title: 'About Anandh Jain Pujari', status: 'published', subtitle: 'Biography and mission' },
            { id: 'mission', title: 'Cultural Mission & Vision', status: 'published', subtitle: 'Heritage conservation ethos' },
            { id: 'contact', title: 'Contact & Consultation', status: 'published', subtitle: 'Public inquiry coordinates' },
          ]}
        />
      );
      break;

    case '/admin/hero':
      content = <AdminHeroPage />;
      break;

    case '/admin/media':
      content = <AdminMediaPage />;
      break;

    case '/admin/settings':
      content = <AdminSettingsPage />;
      break;

    default:
      content = <AdminDashboardPage onNavigate={onNavigate} />;
      break;
    }
  }

  return (
    <AdminLayout currentPath={currentPath} onNavigate={onNavigate}>
      {content}
    </AdminLayout>
  );
}
