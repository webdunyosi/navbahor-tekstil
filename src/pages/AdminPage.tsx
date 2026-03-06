import { useState } from 'react';
import { FaScrewdriverWrench, FaBox, FaPlus, FaXmark, FaPencil } from 'react-icons/fa6';
import type { Category, Product } from '../types';
import CategoryIcon from '../components/CategoryIcon';

interface AdminPageProps {
  categories: Category[];
  onUpdateCategories: (updated: Category[]) => void;
}

const UNITS = ["Dona", "Kg", "Metr", "Litr", "Quti", "Katushka", "Paket", "Juft"];

const emptyForm = (): Omit<Product, 'id'> => ({
  name: '',
  model: '',
  note: '',
  unit: 'Dona',
  quantity: 0,
  department: '',
  image: '',
  bukum: undefined,
});

const productToForm = (p: Product): Omit<Product, 'id'> => ({
  name: p.name,
  model: p.model,
  note: p.note,
  unit: p.unit,
  quantity: p.quantity,
  department: p.department,
  image: p.image ?? '',
  bukum: p.bukum,
});

const ProductImage = ({ src, alt, size = 'table' }: { src: string; alt: string; size?: 'table' | 'preview' }) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const cls = size === 'preview' ? 'w-16 h-16' : 'w-12 h-12';
  if (error) {
    return (
      <div className={`${cls} rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/20 text-xl`}>
        <FaBox />
      </div>
    );
  }
  return (
    <div className={`relative ${cls} rounded-lg overflow-hidden border border-white/10`}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-white/10" />
      )}
      <img src={src} alt={alt} className="w-full h-full object-cover" onLoad={() => setLoaded(true)} onError={() => setError(true)} />
    </div>
  );
};

const AdminPage = ({ categories, onUpdateCategories }: AdminPageProps) => {
  const [activeCategoryId, setActiveCategoryId] = useState(categories[0]?.id ?? '');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyForm());
  const [formError, setFormError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editProductId, setEditProductId] = useState<number | null>(null);

  const activeCategory = categories.find((c) => c.id === activeCategoryId);

  const handleFormChange = (field: keyof Omit<Product, 'id'>, value: string | number | undefined) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError('');
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim()) { setFormError("Mahsulot nomi kiritilishi shart."); return; }
    if (!form.model.trim()) { setFormError("Mahsulot modeli kiritilishi shart."); return; }
    if (!form.department.trim()) { setFormError("Bo'lim nomi kiritilishi shart."); return; }
    if (form.quantity < 0) { setFormError("Soni manfiy bo'lishi mumkin emas."); return; }

    const allIds = categories.flatMap((c) => c.products.map((p) => p.id));
    const newId = allIds.length > 0 ? Math.max(...allIds) + 1 : 1;

    const newProduct: Product = { id: newId, ...form, name: form.name.trim(), model: form.model.trim(), note: form.note.trim(), department: form.department.trim() };

    const updated = categories.map((c) =>
      c.id === activeCategoryId ? { ...c, products: [...c.products, newProduct] } : c
    );
    onUpdateCategories(updated);
    setForm(emptyForm());
    setShowForm(false);
  };

  const handleEditStart = (product: Product) => {
    setEditProductId(product.id);
    setForm(productToForm(product));
    setShowForm(true);
    setFormError('');
    setDeleteConfirmId(null);
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim()) { setFormError("Mahsulot nomi kiritilishi shart."); return; }
    if (!form.model.trim()) { setFormError("Mahsulot modeli kiritilishi shart."); return; }
    if (!form.department.trim()) { setFormError("Bo'lim nomi kiritilishi shart."); return; }
    if (form.quantity < 0) { setFormError("Soni manfiy bo'lishi mumkin emas."); return; }

    const updated = categories.map((c) =>
      c.id === activeCategoryId
        ? {
            ...c,
            products: c.products.map((p) =>
              p.id === editProductId
                ? { ...p, ...form, name: form.name.trim(), model: form.model.trim(), note: form.note.trim(), department: form.department.trim() }
                : p
            ),
          }
        : c
    );
    onUpdateCategories(updated);
    setForm(emptyForm());
    setShowForm(false);
    setEditProductId(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setForm(emptyForm());
    setFormError('');
    setEditProductId(null);
  };

  const handleDeleteProduct = (productId: number) => {
    const updated = categories.map((c) =>
      c.id === activeCategoryId
        ? { ...c, products: c.products.filter((p) => p.id !== productId) }
        : c
    );
    onUpdateCategories(updated);
    setDeleteConfirmId(null);
    if (editProductId === productId) handleCancelForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white">
      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Page Title */}
        <div className="flex items-center gap-3">
          <FaScrewdriverWrench className="text-3xl text-white" />
          <div>
            <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
            <p className="text-sm text-white/50">Mahsulotlarni boshqarish</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategoryId(cat.id); setShowForm(false); setDeleteConfirmId(null); setForm(emptyForm()); setFormError(''); setEditProductId(null); }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-105'
                      : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                >
                  <CategoryIcon name={cat.icon} className="text-base" />
                  <span>{cat.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-white/20' : 'bg-white/10 text-white/50'}`}>
                    {cat.products.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {activeCategory && (
          <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <CategoryIcon name={activeCategory.icon} className="text-xl" />
                <h3 className="text-lg font-semibold text-white">{activeCategory.name}</h3>
                <span className="text-sm text-white/50">{activeCategory.products.length} ta mahsulot</span>
              </div>
              <button
                onClick={() => { if (showForm) { handleCancelForm(); } else { setEditProductId(null); setForm(emptyForm()); setFormError(''); setShowForm(true); } }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-indigo-500/30"
              >
                <span className="text-lg leading-none">{showForm ? <FaXmark /> : <FaPlus />}</span>
                <span>{showForm ? 'Bekor qilish' : 'Yangi mahsulot'}</span>
              </button>
            </div>

            {/* Add / Edit Product Form */}
            {showForm && (
              <div className="px-6 py-5 border-b border-white/10 bg-indigo-950/30">
                <h4 className="text-base font-semibold text-indigo-200 mb-4">
                  {editProductId !== null ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
                </h4>
                <form onSubmit={editProductId !== null ? handleUpdateProduct : handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Mahsulot nomi <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      placeholder="Masalan: Podshipnik"
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 text-sm"
                    />
                  </div>
                  {/* Model */}
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Model <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={form.model}
                      onChange={(e) => handleFormChange('model', e.target.value)}
                      placeholder="Masalan: 6205-2RS"
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 text-sm"
                    />
                  </div>
                  {/* Department */}
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Bo'lim <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      value={form.department}
                      onChange={(e) => handleFormChange('department', e.target.value)}
                      placeholder="Masalan: Mexanik"
                      required
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 text-sm"
                    />
                  </div>
                  {/* Unit */}
                  <div>
                    <label className="block text-xs text-white/60 mb-1">O'lchov birligi</label>
                    <select
                      value={form.unit}
                      onChange={(e) => handleFormChange('unit', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 text-sm"
                    >
                      {UNITS.map((u) => <option key={u} value={u} className="bg-slate-900">{u}</option>)}
                    </select>
                  </div>
                  {/* Quantity */}
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Soni</label>
                    <input
                      type="number"
                      min={0}
                      value={form.quantity}
                      onChange={(e) => handleFormChange('quantity', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/60 text-sm"
                    />
                  </div>
                  {/* Note */}
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Izoh</label>
                    <input
                      type="text"
                      value={form.note}
                      onChange={(e) => handleFormChange('note', e.target.value)}
                      placeholder="Qo'shimcha ma'lumot"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 text-sm"
                    />
                  </div>
                  {/* Image URL */}
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Rasm havolasi (URL)</label>
                    <input
                      type="url"
                      value={form.image ?? ''}
                      onChange={(e) => handleFormChange('image', e.target.value)}
                      placeholder="https://example.com/rasm.jpg"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 text-sm"
                    />
                    {form.image && (
                      <div className="mt-2">
                        <ProductImage src={form.image} alt="Preview" size="preview" />
                      </div>
                    )}
                  </div>

                  {/* Bukum */}
                  <div>
                    <label className="block text-xs text-white/60 mb-1">Bukum</label>
                    <input
                      type="number"
                      min={0}
                      value={form.bukum ?? ''}
                      onChange={(e) => handleFormChange('bukum', e.target.value === '' ? undefined : Number(e.target.value))}
                      placeholder="Masalan: 358"
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 text-sm"
                    />
                  </div>

                  {/* Error & Submit */}
                  {formError && (
                    <div className="sm:col-span-2 lg:col-span-3">
                      <p className="text-sm text-red-400 bg-red-500/10 border border-red-400/20 rounded-lg px-4 py-2">{formError}</p>
                    </div>
                  )}
                  <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCancelForm}
                      className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-sm font-medium transition-all"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all"
                    >
                      {editProductId !== null ? 'Saqlash' : "Qo'shish"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Products Table */}
            {activeCategory.products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-white/40">
                <FaBox className="text-5xl mb-4" />
                <p className="text-lg font-medium">Bu kategoriyadagi mahsulotlar yo'q</p>
                <p className="text-sm mt-1">Yangi mahsulot qo'shish uchun yuqoridagi tugmani bosing</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-separate border-spacing-0">
                  <thead>
                    <tr>
                      {['No', 'Rasm', 'Bukum', 'Nomi', 'Modeli', 'Izoh', "O'lchov", 'Soni', "Bo'lim", 'Amal'].map((col, i) => (
                        <th
                          key={col}
                          className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-950/60 border-b border-white/10 whitespace-nowrap ${i === 0 ? 'rounded-tl-xl' : ''}`}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activeCategory.products.map((product, index) => (
                      <tr key={product.id} className="group hover:bg-indigo-500/10 transition-colors duration-150">
                        <td className="px-4 py-3 text-white/50 font-mono text-xs border-b border-white/5">{index + 1}</td>
                        <td className="px-4 py-3 border-b border-white/5">
                          {product.image ? (
                            <ProductImage src={product.image} alt={product.name} />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/20 text-xl">
                              <FaBox />
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-white/70 whitespace-nowrap border-b border-white/5">{product.bukum ?? '—'}</td>
                        <td className="px-4 py-3 font-medium text-white whitespace-nowrap border-b border-white/5">{product.name}</td>
                        <td className="px-4 py-3 text-indigo-200 font-mono text-xs whitespace-nowrap border-b border-white/5">{product.model}</td>
                        <td className="px-4 py-3 text-white/60 max-w-[160px] truncate border-b border-white/5" title={product.note}>{product.note || '—'}</td>
                        <td className="px-4 py-3 border-b border-white/5">
                          <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-medium">{product.unit}</span>
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-300 whitespace-nowrap border-b border-white/5">{product.quantity.toLocaleString()}</td>
                        <td className="px-4 py-3 border-b border-white/5">
                          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-200 border border-indigo-400/20 whitespace-nowrap">{product.department}</span>
                        </td>
                        <td className="px-4 py-3 border-b border-white/5">
                          {deleteConfirmId === product.id ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-white/60">Ishonchingiz komilmi?</span>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="px-2 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-all"
                              >
                                Ha
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 text-xs transition-all"
                              >
                                Yo'q
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditStart(product)}
                                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 border border-amber-400/20 hover:border-amber-400/40 text-amber-300 hover:text-amber-200 text-xs font-medium transition-all"
                              >
                                <FaPencil className="text-[10px]" />
                                Tahrirlash
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(product.id)}
                                className="px-3 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/40 border border-red-400/20 hover:border-red-400/40 text-red-300 hover:text-red-200 text-xs font-medium transition-all"
                              >
                                O'chirish
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;