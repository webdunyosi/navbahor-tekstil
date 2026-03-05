import { FaBox, FaCubes, FaTags } from 'react-icons/fa';
import type { IconType } from 'react-icons';

interface StatCardProps {
  icon: IconType;
  label: string;
  value: number;
  color: string;
  delay: string;
}

const StatCard = ({ icon: Icon, label, value, color, delay }: StatCardProps) => (
  <div
    className="fade-in flex items-center gap-4 px-6 py-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
    style={{ animationDelay: delay }}
  >
    <div className={`flex items-center justify-center w-12 h-12 rounded-xl text-2xl ${color} shadow-lg`}>
      <Icon className="text-2xl" />
    </div>
    <div>
      <p className="text-white/60 text-xs font-medium uppercase tracking-wider">{label}</p>
      <p className="text-white text-2xl font-bold mt-0.5">{value.toLocaleString()}</p>
    </div>
  </div>
);

interface StatsCardsProps {
  totalProducts: number;
  totalQuantity: number;
  departmentsCount: number;
}

const StatsCards = ({ totalProducts, totalQuantity, departmentsCount }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard icon={FaBox}   label="Jami mahsulotlar" value={totalProducts}    color="bg-indigo-500/30"  delay="0ms"   />
      <StatCard icon={FaCubes} label="Jami miqdor"       value={totalQuantity}   color="bg-purple-500/30"  delay="80ms"  />
      <StatCard icon={FaTags}  label="Bo'limlar soni"    value={departmentsCount} color="bg-blue-500/30"  delay="160ms" />
    </div>
  );
};

export default StatsCards;