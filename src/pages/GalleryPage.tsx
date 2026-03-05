import { useState, useCallback, useMemo } from 'react';
import type { Category } from '../types';
import ProductModal from '../components/ProductModal';
import type { Product } from '../types';
import CategoryTabs from '../components/CategoryTabs';
import SearchAndFilter from '../components/SearchAndFilter';

interface GalleryPageProps {
  categories: Category[];
}

const ALL_CATEGORIES_TAB_ID = '__all__';

const GalleryPage = ({ categories }: GalleryPageProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<string>(ALL_CATEGORIES_TAB_ID);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const handleModalClose = useCallback(() => setSelectedProduct(null), []);

  const allTab: Category = useMemo(() => ({
    id: ALL_CATEGORIES_TAB_ID,
    name: 'Barchasi',
    icon: '🗂️',
    products: categories.flatMap((c) => c.products),
  }), [categories]);

  const tabCategories = useMemo(() => [allTab, ...categories], [allTab, categories]);

  const activeCategory = useMemo(
    () => tabCategories.find((c) => c.id === activeTab) ?? allTab,
    [tabCategories, activeTab, allTab],
  );

  const departments = useMemo(() => {
    const set = new Set(activeCategory.products.map((p) => p.department).filter(Boolean));
    return Array.from(set).sort();
  }, [activeCategory.products]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return activeCategory.products.filter((p) => {
      const matchesSearch =
        !q || p.name.toLowerCase().includes(q) || p.model.toLowerCase().includes(q);
      const matchesDept = !departmentFilter || p.department === departmentFilter;
      return matchesSearch && matchesDept;
    });
  }, [activeCategory.products, searchQuery, departmentFilter]);

  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setDepartmentFilter('');
    setSearchQuery('');
  };

  if (allTab.products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/40">
        <span className="text-5xl mb-4">🖼️</span>
        <p className="text-lg font-medium">Rasmlar yo'q</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🖼️</span>
          <div>
            <h2 className="text-2xl font-bold text-white">Galereya</h2>
            <p className="text-sm text-white/50">{filteredProducts.length} ta mahsulot rasmlari</p>
          </div>
        </div>

        {/* Category tabs */}
        <CategoryTabs
          categories={tabCategories}
          activeId={activeTab}
          onSelect={handleTabChange}
        />

        {/* Search and filter */}
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          departmentFilter={departmentFilter}
          onDepartmentChange={setDepartmentFilter}
          departments={departments}
        />

        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl p-4">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/40">
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-base font-medium">Hech narsa topilmadi</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
              {filteredProducts.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="fade-in group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-indigo-400/60 hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-transparent bg-white/5"
                  style={{ animationDelay: `${index * 30}ms` }}
                  title={product.name}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-4xl">
                      📦
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
                    <p className="text-white text-xs font-medium truncate w-full text-center">{product.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={handleModalClose} />
      )}
    </>
  );
};

export default GalleryPage;