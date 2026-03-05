import type { Product } from '../types';

interface ProductTableProps {
  products: Product[];
}

const COLUMNS = ['No', 'Maxsulot nomi', 'Maxsulot modeli', 'Izoh', "O'lchov birligi", 'Soni', "Bo'limi"];

const ProductTable = ({ products }: ProductTableProps) => {
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
  );
};

export default ProductTable;
