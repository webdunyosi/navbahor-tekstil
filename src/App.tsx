import { useState } from 'react';
import categories from './data/data.json';
import type { User } from './types';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import CategoryTabs from './components/CategoryTabs';
import SearchAndFilter from './components/SearchAndFilter';
import ProductTable from './components/ProductTable';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

type AuthView = 'login' | 'register';

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('currentUser');
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

const App = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [activeCategory, setActiveCategory] = useState('tayorlov');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const handleLogin = (user: User) => setCurrentUser(user);
  const handleRegister = (user: User) => setCurrentUser(user);
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setAuthView('login');
  };

  if (!currentUser) {
    return authView === 'login' ? (
      <LoginPage onLogin={handleLogin} onGoRegister={() => setAuthView('register')} />
    ) : (
      <RegisterPage onRegister={handleRegister} onGoLogin={() => setAuthView('login')} />
    );
  }

  const currentCategory = categories.find((c) => c.id === activeCategory)!;

  const departments = [...new Set(currentCategory.products.map((p) => p.department))].sort();

  const filteredProducts = (() => {
    const q = searchQuery.toLowerCase().trim();
    return currentCategory.products.filter((p) => {
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.model.toLowerCase().includes(q);
      const matchesDept = !departmentFilter || p.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  })();

  const totalQuantity = filteredProducts.reduce((sum, p) => sum + p.quantity, 0);
  const departmentsCount = new Set(filteredProducts.map((p) => p.department)).size;

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    setSearchQuery('');
    setDepartmentFilter('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white">
      <Header currentUser={currentUser} onLogout={handleLogout} />

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
              <span className="text-xl">{currentCategory.icon}</span>
              <h2 className="text-lg font-semibold text-white">{currentCategory.name}</h2>
            </div>
            <span className="text-sm text-white/50">
              {filteredProducts.length} ta mahsulot
            </span>
          </div>
          <ProductTable products={filteredProducts} />
        </div>
      </main>
    </div>
  );
};

export default App;