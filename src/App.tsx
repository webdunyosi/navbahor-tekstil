import { useState, useMemo } from 'react';
import categories from './data/data.json';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import CategoryTabs from './components/CategoryTabs';
import SearchAndFilter from './components/SearchAndFilter';
import ProductTable from './components/ProductTable';

const App = () => {
  const [activeCategory, setActiveCategory] = useState('tayorlov');
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const currentCategory = useMemo(
    () => categories.find((c) => c.id === activeCategory)!,
    [activeCategory]
  );

  const departments = useMemo(
    () => [...new Set(currentCategory.products.map((p) => p.department))].sort(),
    [currentCategory]
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return currentCategory.products.filter((p) => {
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
      <Header />

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