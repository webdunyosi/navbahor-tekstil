import { FaMagnifyingGlass, FaTag, FaXmark, FaChevronDown } from 'react-icons/fa6';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentChange: (value: string) => void;
  departments: string[];
}

const SearchAndFilter = ({
  searchQuery,
  onSearchChange,
  departmentFilter,
  onDepartmentChange,
  departments,
}: SearchAndFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {/* Search input */}
      <div className="relative flex-1 min-w-0">
        <span className="absolute inset-y-0 left-3 flex items-center text-white/60 pointer-events-none z-10">
          <FaMagnifyingGlass className="text-base" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Qidirish..."
          className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-400/60 transition-all duration-200"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-2 flex items-center text-white/50 hover:text-white/80 transition-colors"
          >
            <FaXmark />
          </button>
        )}
      </div>

      {/* Department filter */}
      <div className="relative w-full sm:w-48 sm:shrink-0 overflow-hidden rounded-xl">
        <span className="absolute inset-y-0 left-3 flex items-center text-white/60 pointer-events-none z-10">
          <FaTag className="text-base" />
        </span>
        <select
          value={departmentFilter}
          onChange={(e) => onDepartmentChange(e.target.value)}
          title={departmentFilter || "Barcha bo'limlar"}
          className="w-full pl-9 pr-7 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-400/60 transition-all duration-200 appearance-none cursor-pointer"
        >
          <option value="" className="bg-gray-900">Barcha bo'limlar</option>
          {departments.map((dept) => (
            <option key={dept} value={dept} className="bg-gray-900">
              {dept}
            </option>
          ))}
        </select>
        <span className="absolute inset-y-0 right-2 flex items-center text-white/60 pointer-events-none text-xs z-10">
          <FaChevronDown />
        </span>
      </div>
    </div>
  );
};

export default SearchAndFilter;