import type { Category } from '../types';
import CategoryIcon from './CategoryIcon';

interface CategoryTabsProps {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
}

const CategoryTabs = ({ categories, activeId, onSelect }: CategoryTabsProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1.5 sm:gap-2">
      {categories.map((cat) => {
        const isActive = cat.id === activeId;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            title={cat.name}
            className={`
              w-full sm:w-auto flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-medium text-sm transition-all duration-200
              ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 scale-105'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10 hover:border-white/20'
              }
            `}
          >
            <CategoryIcon name={cat.icon} className="text-base shrink-0" />
            <span>{cat.name}</span>
            <span
              className={`
                px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold shrink-0
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