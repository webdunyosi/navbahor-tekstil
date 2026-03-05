type SidebarPage = 'gallery' | 'about';

interface SidebarProps {
  activePage: SidebarPage;
  onPageChange: (page: SidebarPage) => void;
}

const NAV_ITEMS: { id: SidebarPage; icon: string; label: string }[] = [
  { id: 'gallery', icon: '🖼️', label: 'Galereya' },
  { id: 'about',   icon: 'ℹ️',  label: 'About'    },
];

const Sidebar = ({ activePage, onPageChange }: SidebarProps) => {
  return (
    <aside className="w-20 sm:w-56 shrink-0 min-h-[calc(100vh-72px)] bg-white/5 backdrop-blur-md border-r border-white/10 flex flex-col gap-2 py-6 px-2 sm:px-4">
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === activePage;
        return (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`flex items-center gap-3 px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 w-full text-left ${
              isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-xl shrink-0">{item.icon}</span>
            <span className="hidden sm:inline">{item.label}</span>
          </button>
        );
      })}
    </aside>
  );
};

export default Sidebar;
export type { SidebarPage };
