import { useState, useMemo } from 'react';
import type { Category, Product } from '../types';

interface AdminPageProps {
  categories: Category[];
  onUpdate: (categories: Category[]) => void;
}

interface ProductForm {
  categoryId: string;
  name: string;
  model: string;
  note: string;
  unit: string;
  quantity: string;
  department: string;
}

interface ConfirmState {
  show: boolean;
  catId: string;
  productId: number;
  productName: string;
}

const emptyForm = (categoryId: string): ProductForm => ({
  categoryId,
  name: '',
  model: '',
  note: '',
  unit: 'Dona',
  quantity: '',
  department: '',
});

const UNITS = ['Dona', 'Metr', 'Kg', 'Litr', 'Quti', 'Rulon', 'Juft', 'Katushka', 'Shisha'];

const AdminPage = ({ categories, onUpdate }: AdminPageProps) => {
  const [activeTab, setActiveTab] = useState<'products' | 'add'>('products');
  const [filterCatId, setFilterCatId] = useState(categories[0]?.id ?? '');
  const [searchQ, setSearchQ] = useState('');
  const [form, setForm] = useState<ProductForm>(emptyForm(categories[0]?.id ?? ''));
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuantity, setEditQuantity] = useState('');
  const [confirm, setConfirm] = useState<ConfirmState>({ show: false, catId: '', productId: 0, productName: '' });

  const currentCat = useMemo(
    () => categories.find((c) => c.id === filterCatId),
    [categories, filterCatId]
  );

  const filteredProducts = useMemo(() => {
    const q = searchQ.toLowerCase().trim();
    return (currentCat?.products ?? []).filter((p) =>
      !q || p.name.toLowerCase().includes(q) || p.model.toLowerCase().includes(q)
    );
  }, [currentCat, searchQ]);

  const totalProducts = useMemo(
    () => categories.reduce((s, c) => s + c.products.length, 0),
    [categories]
  );

  const totalQuantity = useMemo(
    () => categories.reduce((s, c) => s + c.products.reduce((ps, p) => ps + p.quantity, 0), 0),
    [categories]
  );

  const setField = (key: keyof ProductForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddProduct = () => {
    setFormError('');
    setFormSuccess('');
    if (!form.name.trim()) return setFormError('Mahsulot nomini kiriting');
    if (!form.model.trim()) return setFormError('Modelni kiriting');
    if (!form.department.trim()) return setFormError("Bo'limni kiriting");
    const qty = parseInt(form.quantity, 10);
    if (isNaN(qty) || qty < 0) return setFormError("To'g'ri miqdor kiriting");

    const cat = categories.find((c) => c.id === form.categoryId);
    if (!cat) return setFormError('Kategoriya topilmadi');

    const maxId = categories.reduce((m, c) => {
      const cMax = c.products.reduce((pm, p) => Math.max(pm, p.id), 0);
      return Math.max(m, cMax);
    }, 0);

    const newProduct: Product = {
      id: maxId + 1,
      name: form.name.trim(),
      model: form.model.trim(),
      note: form.note.trim(),
      unit: form.unit,
      quantity: qty,
      department: form.department.trim(),
    };

    const updated = categories.map((c) =>
      c.id === form.categoryId ? { ...c, products: [...c.products, newProduct] } : c
    );
    onUpdate(updated);
    setForm(emptyForm(form.categoryId));
    setFormSuccess(`"${newProduct.name}" mahsuloti muvaffaqiyatli qo'shildi!`);
    setTimeout(() => setFormSuccess(''), 3000);
  };

  const requestDelete = (catId: string, productId: number, productName: string) => {
    setConfirm({ show: true, catId, productId, productName });
  };

  const confirmDelete = () => {
    const updated = categories.map((c) =>
      c.id === confirm.catId ? { ...c, products: c.products.filter((p) => p.id !== confirm.productId) } : c
    );
    onUpdate(updated);
    setConfirm({ show: false, catId: '', productId: 0, productName: '' });
  };

  const cancelDelete = () => {
    setConfirm({ show: false, catId: '', productId: 0, productName: '' });
  };

  const handleSaveQuantity = (catId: string, productId: number) => {
    const qty = parseInt(editQuantity, 10);
    if (isNaN(qty) || qty < 0) return;
    const updated = categories.map((c) =>
      c.id === catId
        ? { ...c, products: c.products.map((p) => (p.id === productId ? { ...p, quantity: qty } : p)) }
        : c
    );
    onUpdate(updated);
    setEditingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: '📦', label: 'Jami mahsulotlar', value: totalProducts, color: 'bg-indigo-500/30' },
          { icon: '🔢', label: 'Jami miqdor', value: totalQuantity, color: 'bg-purple-500/30' },
          { icon: '🗂️', label: 'Kategoriyalar', value: categories.length, color: 'bg-blue-500/30' },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl"
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-2xl ${s.color} shadow-lg`}>
              {s.icon}
            </div>
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider">{s.label}</p>
              <p className="text-white text-2xl font-bold mt-0.5">{s.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['products', 'add'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === tab
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
            }`}
          >
            {tab === 'products' ? '📋 Mahsulotlar ro\'yxati' : "➕ Yangi mahsulot qo'shish"}
          </button>
        ))}
      </div>

      {/* Products tab */}
      {activeTab === 'products' && (
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row gap-3">
            {/* Category filter */}
            <div className="relative sm:w-56">
              <span className="absolute inset-y-0 left-4 flex items-center text-white/40 pointer-events-none">🗂️</span>
              <select
                value={filterCatId}
                onChange={(e) => { setFilterCatId(e.target.value); setSearchQ(''); }}
                className="w-full pl-11 pr-8 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 appearance-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-gray-900">{c.icon} {c.name}</option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-3 flex items-center text-white/40 pointer-events-none text-xs">▼</span>
            </div>
            {/* Search */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-4 flex items-center text-white/40 pointer-events-none">🔍</span>
              <input
                type="text"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Mahsulot qidirish..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 transition-all"
              />
              {searchQ && (
                <button onClick={() => setSearchQ('')} className="absolute inset-y-0 right-3 flex items-center text-white/40 hover:text-white/80">✕</button>
              )}
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/40">
              <span className="text-5xl mb-3">🔎</span>
              <p className="text-lg font-medium">Mahsulot topilmadi</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-separate border-spacing-0">
                <thead>
                  <tr>
                    {['No', 'Nomi', 'Modeli', 'Izoh', "O'lchov", 'Soni', "Bo'lim", 'Amallar'].map((col, i) => (
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
                  {filteredProducts.map((p, idx) => (
                    <tr key={p.id} className="group hover:bg-indigo-500/10 transition-colors">
                      <td className="px-4 py-3 text-white/50 font-mono text-xs border-b border-white/5">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-white whitespace-nowrap border-b border-white/5">{p.name}</td>
                      <td className="px-4 py-3 text-indigo-200 font-mono text-xs whitespace-nowrap border-b border-white/5">{p.model}</td>
                      <td className="px-4 py-3 text-white/60 max-w-[160px] truncate border-b border-white/5" title={p.note}>{p.note || '—'}</td>
                      <td className="px-4 py-3 border-b border-white/5">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-xs font-medium text-white/80">{p.unit}</span>
                      </td>
                      <td className="px-4 py-3 border-b border-white/5">
                        {editingId === p.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(e.target.value)}
                              className="w-20 px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              min="0"
                            />
                            <button
                              onClick={() => handleSaveQuantity(filterCatId, p.id)}
                              className="px-2 py-1 rounded-lg bg-emerald-500/30 hover:bg-emerald-500/50 text-emerald-300 text-xs transition-colors"
                            >✓</button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 text-xs transition-colors"
                            >✕</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setEditingId(p.id); setEditQuantity(String(p.quantity)); }}
                            className="font-bold text-emerald-300 hover:text-emerald-200 transition-colors"
                          >
                            {p.quantity.toLocaleString()}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 border-b border-white/5">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-200 border border-indigo-400/20 whitespace-nowrap">
                          {p.department}
                        </span>
                      </td>
                      <td className="px-4 py-3 border-b border-white/5 whitespace-nowrap">
                        <button
                          onClick={() => requestDelete(filterCatId, p.id, p.name)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs font-medium transition-colors"
                        >
                          🗑 O'chirish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add product tab */}
      {activeTab === 'add' && (
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Yangi mahsulot qo'shish</h3>

          {formError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/30 text-red-300 text-sm">
              ⚠️ {formError}
            </div>
          )}
          {formSuccess && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm">
              ✅ {formSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5 font-medium">Kategoriya</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-white/40 pointer-events-none">🗂️</span>
                <select
                  value={form.categoryId}
                  onChange={(e) => setField('categoryId', e.target.value)}
                  className="w-full pl-11 pr-8 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 appearance-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="bg-gray-900">{c.icon} {c.name}</option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center text-white/40 pointer-events-none text-xs">▼</span>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5 font-medium">Mahsulot nomi <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="masalan: Podshipnik"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 transition-all"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5 font-medium">Model <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={form.model}
                onChange={(e) => setField('model', e.target.value)}
                placeholder="masalan: 6205-2RS"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 transition-all"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5 font-medium">Bo'lim <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={form.department}
                onChange={(e) => setField('department', e.target.value)}
                placeholder="masalan: Mexanik"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 transition-all"
              />
            </div>

            {/* Unit */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5 font-medium">O'lchov birligi</label>
              <div className="relative">
                <select
                  value={form.unit}
                  onChange={(e) => setField('unit', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 appearance-none cursor-pointer"
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u} className="bg-gray-900">{u}</option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center text-white/40 pointer-events-none text-xs">▼</span>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-white/70 text-sm mb-1.5 font-medium">Miqdor <span className="text-red-400">*</span></label>
              <input
                type="number"
                value={form.quantity}
                onChange={(e) => setField('quantity', e.target.value)}
                placeholder="0"
                min="0"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 transition-all"
              />
            </div>

            {/* Note */}
            <div className="sm:col-span-2">
              <label className="block text-white/70 text-sm mb-1.5 font-medium">Izoh</label>
              <input
                type="text"
                value={form.note}
                onChange={(e) => setField('note', e.target.value)}
                placeholder="qo'shimcha ma'lumot (ixtiyoriy)"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 transition-all"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAddProduct}
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
            >
              ➕ Qo'shish
            </button>
            <button
              onClick={() => { setForm(emptyForm(form.categoryId)); setFormError(''); setFormSuccess(''); }}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 font-medium text-sm transition-all border border-white/10"
            >
              Tozalash
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-white/10 shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🗑️</span>
              <h3 className="text-lg font-semibold text-white">Mahsulotni o'chirish</h3>
            </div>
            <p className="text-white/70 text-sm mb-6">
              <span className="text-white font-medium">"{confirm.productName}"</span> mahsulotini o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-sm transition-all duration-200"
              >
                Ha, o'chirish
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 font-medium text-sm transition-all border border-white/10"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;