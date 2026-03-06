import { FaIndustry, FaRightFromBracket, FaHouse } from "react-icons/fa6"
import type { User } from "../types"

interface HeaderProps {
  currentUser?: User | null
  onLogout?: () => void
  onMenuToggle?: () => void
  onGoToMain?: () => void
}

const Header = ({ currentUser, onLogout, onMenuToggle, onGoToMain }: HeaderProps) => {
  return (
    <header className="backdrop-blur-md bg-white/5 border-b border-white/10 shadow-lg">
      <div className="w-full mx-auto px-5">
        <div className="flex justify-between items-center gap-4 py-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 select-none">
              <FaIndustry className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white leading-tight tracking-wide">
                Navbahor Tekstil
              </h1>
              <p className="text-xs text-indigo-300 font-medium tracking-widest uppercase">
                Ombor boshqaruv tizimi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onGoToMain && (
              <button
                onClick={onGoToMain}
                title="Asosiy sahifaga o'tish"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-200 text-white text-sm font-medium shrink-0"
                aria-label="Asosiy sahifaga o'tish"
              >
                <FaHouse className="text-base" />
                <span className="hidden sm:inline">Asosiy sahifa</span>
              </button>
            )}
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
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
