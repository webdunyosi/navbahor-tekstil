import { useState, useCallback } from 'react';
import type { Product } from '../types';
import ProductModal from './ProductModal';

interface ProductTableProps {
  products: Product[];
}

const ProductTable = ({ products }: ProductTableProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const handleModalClose = useCallback(() => setSelectedProduct(null), []);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/40">
        <span className="text-5xl mb-4">🔎</span>
        <p className="text-lg font-medium">Mahsulot topilmadi</p>
        <p className="text-sm mt-1">Qidiruv yoki filtrni o'zgartiring</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-2">
        {products.map((product, index) => (
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

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default ProductTable;