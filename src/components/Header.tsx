import type { User } from '../types';

interface HeaderProps {
  currentUser?: User | null;
  onLogout?: () => void;
  appView?: 'main' | 'admin';
  onToggleAdminView?: () => void;
  onMenuToggle?: () => void;
}

const Header = ({ currentUser, onLogout, appView, onToggleAdminView, onMenuToggle }: HeaderProps) => {
  return (
    <header className="backdrop-blur-md bg-white/5 border-b border-white/10 shadow-lg">
      <div className="w-full mx-auto px-5">
        <div className="flex items-center gap-4 py-4">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              title="Menyu"
              className="flex flex-col justify-center items-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-200 gap-1.5 shrink-0"
              aria-label="Menyuni ochish/yopish"
            >
              <span className="block w-5 h-0.5 bg-white rounded-full"></span>
              <span className="block w-5 h-0.5 bg-white rounded-full"></span>
              <span className="block w-5 h-0.5 bg-white rounded-full"></span>
            </button>
          )}
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 text-2xl select-none">
            🏭
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight tracking-wide">
              Navbahor Tekstil
            </h1>
            <p className="text-xs text-indigo-300 font-medium tracking-widest uppercase">
              Ombor boshqaruv tizimi
            </p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-300 text-xs font-medium">Jonli</span>
            </div>

            {currentUser && onToggleAdminView && (
              <button
                onClick={onToggleAdminView}
                title={appView === 'admin' ? 'Asosiy sahifa' : 'Admin panel'}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-200 ${
                  appView === 'admin'
                    ? 'bg-indigo-600/30 border-indigo-400/40 text-indigo-200 hover:bg-indigo-600/50'
                    : 'bg-white/10 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-400/30 text-white/70 hover:text-indigo-300'
                }`}
              >
                <span>{appView === 'admin' ? '📋' : '🛠️'}</span>
                <span className="hidden sm:inline">{appView === 'admin' ? 'Asosiy sahifa' : 'Admin panel'}</span>
              </button>
            )}

            {currentUser && (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-white leading-tight">{currentUser.name}</span>
                  <span className="text-xs text-indigo-300 capitalize">{currentUser.role === 'admin' ? 'Admin' : 'Foydalanuvchi'}</span>
                </div>
                <button
                  onClick={onLogout}
                  title="Chiqish"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-red-500/20 border border-white/10 hover:border-red-400/30 text-white/70 hover:text-red-300 text-xs font-medium transition-all duration-200"
                >
                  <span>🚪</span>
                  <span className="hidden sm:inline">Chiqish</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;