import { useState } from 'react';
import initialCategories from './data/data.json';
import type { Category, User } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import type { SidebarPage } from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';

type AppView = 'main' | 'login' | 'admin';

const CATEGORIES_KEY = 'categories';

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('currentUser');
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

const getStoredCategories = (): Category[] => {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    return raw ? (JSON.parse(raw) as Category[]) : (initialCategories as Category[]);
  } catch {
    return initialCategories as Category[];
  }
};

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser);
  const [appView, setAppView] = useState<AppView>('main');
  const [sidebarPage, setSidebarPage] = useState<SidebarPage>('gallery');
  const [categories, setCategories] = useState<Category[]>(getStoredCategories);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setAppView('admin');
    } else {
      setAppView('main');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setAppView('main');
  };

  const handleAdminIconClick = () => {
    if (currentUser?.role === 'admin') {
      setAppView('admin');
    } else {
      setAppView('login');
    }
  };

  const handleUpdateCategories = (updated: Category[]) => {
    setCategories(updated);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
  };

  if (appView === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onCancel={() => setAppView('main')}
      />
    );
  }

  if (appView === 'admin' && currentUser?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white">
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          onGoToMain={() => setAppView('main')}
          paddingX="px-8"
        />
        <AdminPage categories={categories} onUpdateCategories={handleUpdateCategories} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white">
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        paddingX="px-2"
      />

      <div className="flex">
        <Sidebar
          activePage={sidebarPage}
          onPageChange={setSidebarPage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onToggleAdminView={handleAdminIconClick}
          onLogout={handleLogout}
          currentUser={currentUser}
        />

        <main className="flex-1 p-2 space-y-6 min-w-0">
          {sidebarPage === 'gallery' && (
            <GalleryPage categories={categories} />
          )}

          {sidebarPage === 'about' && (
            <AboutPage categories={categories} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;