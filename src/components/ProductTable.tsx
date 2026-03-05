import { useState, useCallback } from 'react';
import type { Product } from '../types';
import ProductModal from './ProductModal';

interface ProductTableProps {
  products: Product[];
}

const COLUMNS = ['No', 'Rasm', 'Maxsulot nomi', 'Maxsulot modeli', 'Izoh', "O'lchov birligi", 'Soni', "Bo'limi"];

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
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full text-sm text-left border-separate border-spacing-0">
          <thead>
            <tr>
              {COLUMNS.map((col, i) => (
                <th
                  key={col}
                  className={`
                    px-4 py-3 text-xs font-semibold uppercase tracking-wider text-indigo-300
                    bg-indigo-950/60 border-b border-white/10
                    ${i === 0 ? 'rounded-tl-xl' : ''}
                    ${i === COLUMNS.length - 1 ? 'rounded-tr-xl' : ''}
                    whitespace-nowrap
                  `}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className="fade-in group hover:bg-indigo-500/10 transition-colors duration-150"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td className="px-4 py-3 text-white/50 font-mono text-xs border-b border-white/5 group-hover:border-indigo-400/20">
                  {index + 1}
                </td>
                <td className="px-4 py-3 border-b border-white/5 group-hover:border-indigo-400/20">
                  {product.image ? (
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="block w-12 h-12 rounded-lg overflow-hidden border border-white/10 hover:border-indigo-400/60 transition-all duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-transparent"
                      title={`${product.name} rasmini ko'rish`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/20 text-xl">
                      📦
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-white whitespace-nowrap border-b border-white/5 group-hover:border-indigo-400/20">
                  {product.name}
                </td>
                <td className="px-4 py-3 text-indigo-200 font-mono text-xs whitespace-nowrap border-b border-white/5 group-hover:border-indigo-400/20">
                  {product.model}
                </td>
                <td className="px-4 py-3 text-white/60 max-w-[200px] truncate border-b border-white/5 group-hover:border-indigo-400/20" title={product.note}>
                  {product.note || '—'}
                </td>
                <td className="px-4 py-3 text-white/80 whitespace-nowrap border-b border-white/5 group-hover:border-indigo-400/20">
                  <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-medium">{product.unit}</span>
                </td>
                <td className="px-4 py-3 font-bold text-emerald-300 whitespace-nowrap border-b border-white/5 group-hover:border-indigo-400/20">
                  {product.quantity.toLocaleString()}
                </td>
                <td className="px-4 py-3 border-b border-white/5 group-hover:border-indigo-400/20">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-200 border border-indigo-400/20 whitespace-nowrap">
                    {product.department}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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