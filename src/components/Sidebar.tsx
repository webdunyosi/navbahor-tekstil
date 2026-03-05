import { FaImages, FaInfoCircle, FaTimes } from 'react-icons/fa';
import type { IconType } from 'react-icons';

type SidebarPage = 'gallery' | 'about';

interface SidebarProps {
  activePage: SidebarPage;
  onPageChange: (page: SidebarPage) => void;
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS: { id: SidebarPage; icon: IconType; label: string }[] = [
  { id: 'gallery', icon: FaImages,     label: 'Galereya' },
  { id: 'about',   icon: FaInfoCircle, label: 'About'    },
];

const Sidebar = ({ activePage, onPageChange, isOpen, onClose }: SidebarProps) => {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 sm:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed sm:static top-0 left-0 z-40 sm:z-auto
          h-full sm:h-auto sm:min-h-[calc(100vh-72px)]
          w-64 sm:w-56 shrink-0
          bg-slate-900 sm:bg-white/5 backdrop-blur-md
          border-r border-white/10
          flex flex-col gap-2 py-6 px-4
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${!isOpen ? 'sm:hidden' : ''}
        `}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between mb-4 sm:hidden">
          <span className="text-white font-semibold text-sm">Menyu</span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activePage;
          return (
            <button
              key={item.id}
              onClick={() => { onPageChange(item.id); onClose(); }}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 w-full text-left ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="text-xl shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </aside>
    </>
  );
};

export default Sidebar;
export type { SidebarPage };