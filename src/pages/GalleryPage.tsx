import { useState, useCallback, useMemo } from 'react';
import { FaImages, FaMagnifyingGlass, FaBox } from 'react-icons/fa6';
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
    icon: 'FaFolderOpen',
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
        <FaImages className="text-5xl mb-4" />
        <p className="text-lg font-medium">Rasmlar yo'q</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Category tabs and search/filter side by side */}
        <div className="flex flex-col lg:flex-row gap-3 items-start">
          <div className="flex-1 min-w-0">
            <CategoryTabs
              categories={tabCategories}
              activeId={activeTab}
              onSelect={handleTabChange}
            />
          </div>
          <div className="w-full lg:w-auto lg:shrink-0">
            <SearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              departmentFilter={departmentFilter}
              onDepartmentChange={setDepartmentFilter}
              departments={departments}
            />
          </div>
        </div>

        <div className="rounded-sm overflow-hidden shadow-2xl">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/40 bg-white/5">
              <FaMagnifyingGlass className="text-4xl mb-3" />
              <p className="text-base font-medium">Hech narsa topilmadi</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-px bg-white/10">
              {filteredProducts.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="fade-in group relative aspect-square overflow-hidden bg-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-400"
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
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <FaBox className="text-4xl" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
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