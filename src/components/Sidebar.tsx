import { useState } from 'react';
import type { Category } from '../types';

interface SidebarProps {
  categories: Category[];
}

const Sidebar = ({ categories }: SidebarProps) => {
  const [imgErrors, setImgErrors] = useState<Set<number>>(new Set());

  const allProducts = categories.flatMap((c) => c.products);
  const totalProducts = allProducts.length;
  const totalQuantity = allProducts.reduce((sum, p) => sum + p.quantity, 0);
  const departmentsCount = new Set(allProducts.map((p) => p.department)).size;

  const galleryProducts = allProducts.filter((p) => p.image);

  const handleImgError = (id: number) => {
    setImgErrors((prev) => new Set(prev).add(id));
  };

  return (
    <aside className="hidden lg:flex flex-col gap-4 w-60 xl:w-72 shrink-0">
      {/* About */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4">
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <span>📊</span> About
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-white/50">Jami mahsulot</span>
            <span className="text-sm font-bold text-white">{totalProducts.toLocaleString()}</span>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-white/50">Jami miqdor</span>
            <span className="text-sm font-bold text-white">{totalQuantity.toLocaleString()}</span>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-white/50">Bo'limlar soni</span>
            <span className="text-sm font-bold text-white">{departmentsCount}</span>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-4 flex flex-col min-h-0 flex-1">
        <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3 flex items-center gap-1.5 shrink-0">
          <span>🖼️</span> Galereya
        </h3>
        <div className="grid grid-cols-3 gap-1.5 overflow-y-auto">
          {galleryProducts.map((product) =>
            imgErrors.has(product.id) ? (
              <div
                key={product.id}
                className="aspect-square rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/20 text-lg"
              >
                📦
              </div>
            ) : (
              <div
                key={product.id}
                className="aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-indigo-400/50 transition-colors"
                title={product.name}
              >
                <img
                  src={product.image!}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                  onError={() => handleImgError(product.id)}
                />
              </div>
            )
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
