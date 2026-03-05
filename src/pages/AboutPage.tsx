import type { Category } from '../types';

interface AboutPageProps {
  categories: Category[];
}

interface StatItemProps {
  icon: string;
  label: string;
  value: number;
  color: string;
}

const StatItem = ({ icon, label, value, color }: StatItemProps) => (
  <div className={`flex items-center gap-5 px-6 py-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}>
    <div className={`flex items-center justify-center w-14 h-14 rounded-xl text-3xl ${color} shadow-lg`}>
      {icon}
    </div>
    <div>
      <p className="text-white/60 text-xs font-medium uppercase tracking-wider">{label}</p>
      <p className="text-white text-3xl font-bold mt-0.5">{value.toLocaleString()}</p>
    </div>
  </div>
);

const AboutPage = ({ categories }: AboutPageProps) => {
  const allProducts = categories.flatMap((c) => c.products);
  const totalProducts = allProducts.length;
  const totalQuantity = allProducts.reduce((sum, p) => sum + p.quantity, 0);
  const departmentsCount = new Set(allProducts.map((p) => p.department)).size;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">ℹ️</span>
        <div>
          <h2 className="text-2xl font-bold text-white">About</h2>
          <p className="text-sm text-white/50">Ombor umumiy ma'lumotlari</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatItem
          icon="📦"
          label="Jami mahsulot"
          value={totalProducts}
          color="bg-indigo-500/30"
        />
        <StatItem
          icon="🔢"
          label="Jami miqdor"
          value={totalQuantity}
          color="bg-purple-500/30"
        />
        <StatItem
          icon="🏷️"
          label="Bo'limlar soni"
          value={departmentsCount}
          color="bg-blue-500/30"
        />
      </div>

      <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Kategoriyalar bo'yicha</h3>
        </div>
        <div className="divide-y divide-white/5">
          {categories.map((cat) => {
            const qty = cat.products.reduce((sum, p) => sum + p.quantity, 0);
            const depts = new Set(cat.products.map((p) => p.department)).size;
            return (
              <div key={cat.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
                <span className="text-2xl">{cat.icon}</span>
                <div className="flex-1">
                  <p className="text-white font-medium">{cat.name}</p>
                  <p className="text-white/50 text-xs mt-0.5">{depts} ta bo'lim</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{cat.products.length} ta</p>
                  <p className="text-white/50 text-xs mt-0.5">miqdor: {qty.toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
