import type { Category } from '../types';

interface CategoryTabsProps {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
}

const CategoryTabs = ({ categories, activeId, onSelect }: CategoryTabsProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = cat.id === activeId;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`
              flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200
              ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-105'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/20'
              }
            `}
          >
            <span className="text-base">{cat.icon}</span>
            <span>{cat.name}</span>
            <span
              className={`
                px-2 py-0.5 rounded-full text-xs font-bold
                ${isActive ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'}
              `}
            >
              {cat.products.length}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
