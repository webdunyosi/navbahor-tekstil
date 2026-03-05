import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaXmark } from 'react-icons/fa6';
import type { Product } from '../types';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
          aria-label="Yopish"
        >
          <FaXmark />
        </button>

        {/* Image */}
        {product.image && (
          <div className="w-full bg-indigo-950/50 flex items-center justify-center" style={{ minHeight: '240px' }}>
            <img
              src={product.image}
              alt={product.name}
              className="max-h-72 w-full object-contain p-4"
            />
          </div>
        )}

        {/* Details */}
        <div className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-white">{product.name}</h2>
            <p className="text-indigo-300 font-mono text-sm mt-1">{product.model}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Izoh</p>
              <p className="text-white/80">{product.note || '—'}</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">O'lchov birligi</p>
              <p className="text-white/80">{product.unit}</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Soni</p>
              <p className="text-emerald-300 font-bold text-lg">{product.quantity.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Bo'limi</p>
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-200 border border-indigo-400/20">
                {product.department}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProductModal;