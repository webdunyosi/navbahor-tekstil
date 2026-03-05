import { useState, useMemo, useEffect } from 'react';
import initialCategories from './data/data.json';
import type { Category } from './types';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import CategoryTabs from './components/CategoryTabs';
import SearchAndFilter from './components/SearchAndFilter';
import ProductTable from './components/ProductTable';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';

const PRODUCTS_KEY = 'navbahor_products';

const loadCategories = (): Category[] => {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw) return JSON.parse(raw) as Category[];
  } catch {
    // ignore
  }
  const seed = initialCategories as Category[];
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seed));
  return seed;
};

type PublicPage = 'login' | 'register';
type AppPage = 'main' | 'admin';

const MainApp = () => {
  const { currentUser } = useAuth();
  const [appPage, setAppPage] = useState<AppPage>('main');
  const [categories, setCategories] = useState<Category[]>(loadCategories);
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? 'tayorlov');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Persist category changes to localStorage
  useEffect(() => {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(categories));
  }, [categories]);

  const isAdmin = currentUser?.role === 'admin';

  // Resolve the displayed page: non-admins cannot see admin page
  const effectiveAppPage: AppPage = appPage === 'admin' && !isAdmin ? 'main' : appPage;

  const handleNavigate = (page: AppPage) => {
    if (page === 'admin' && !isAdmin) return;
    setAppPage(page);
  };

  const handleCategoriesUpdate = (updated: Category[]) => {
    setCategories(updated);
    // If active category was removed, reset to first
    if (!updated.find((c) => c.id === activeCategory)) {
      setActiveCategory(updated[0]?.id ?? '');
    }
  };

  const currentCategory = useMemo(
    () => categories.find((c) => c.id === activeCategory) ?? categories[0],
    [activeCategory, categories]
  );

  const departments = useMemo(
    () => [...new Set((currentCategory?.products ?? []).map((p) => p.department))].sort(),
    [currentCategory]
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return (currentCategory?.products ?? []).filter((p) => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.model.toLowerCase().includes(q);
      const matchesDept = !departmentFilter || p.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [currentCategory, searchQuery, departmentFilter]);

  const totalQuantity = useMemo(
    () => filteredProducts.reduce((sum, p) => sum + p.quantity, 0),
    [filteredProducts]
  );

  const departmentsCount = useMemo(
    () => new Set(filteredProducts.map((p) => p.department)).size,
    [filteredProducts]
  );

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    setSearchQuery('');
    setDepartmentFilter('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white">
      <Header currentPage={effectiveAppPage} onNavigate={handleNavigate} />

      {effectiveAppPage === 'admin' && isAdmin ? (
        <AdminPage categories={categories} onUpdate={handleCategoriesUpdate} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Stats */}
          <StatsCards
            totalProducts={filteredProducts.length}
            totalQuantity={totalQuantity}
            departmentsCount={departmentsCount}
          />

          {/* Category tabs */}
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <CategoryTabs
              categories={categories}
              activeId={activeCategory}
              onSelect={handleCategorySelect}
            />
          </div>

          {/* Search & filter */}
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <SearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              departmentFilter={departmentFilter}
              onDepartmentChange={setDepartmentFilter}
              departments={departments}
            />
          </div>

          {/* Table panel */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-xl">{currentCategory?.icon}</span>
                <h2 className="text-lg font-semibold text-white">{currentCategory?.name}</h2>
              </div>
              <span className="text-sm text-white/50">
                {filteredProducts.length} ta mahsulot
              </span>
            </div>
            <ProductTable products={filteredProducts} />
          </div>
        </main>
      )}
    </div>
  );
};

const App = () => {
  const [publicPage, setPublicPage] = useState<PublicPage>('login');

  return (
    <AuthProvider>
      <AppRouter publicPage={publicPage} onPublicNavigate={setPublicPage} />
    </AuthProvider>
  );
};

interface AppRouterProps {
  publicPage: PublicPage;
  onPublicNavigate: (page: PublicPage) => void;
}

const AppRouter = ({ publicPage, onPublicNavigate }: AppRouterProps) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    if (publicPage === 'register') {
      return <RegisterPage onNavigate={onPublicNavigate} />;
    }
    return <LoginPage onNavigate={onPublicNavigate} />;
  }

  return <MainApp />;
};

export default App;