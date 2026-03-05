import { useState } from 'react';
import initialCategories from './data/data.json';
import type { Category, User } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import type { SidebarPage } from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';

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
  const [sidebarPage, setSidebarPage] = useState<SidebarPage>('gallery');
  const categories = getStoredCategories();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (user: User) => setCurrentUser(user);
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white">
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onMenuToggle={() => setSidebarOpen((prev) => !prev)}
      />

      <div className="flex">
        <Sidebar
          activePage={sidebarPage}
          onPageChange={setSidebarPage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 space-y-6 min-w-0">
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