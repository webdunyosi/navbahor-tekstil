import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/useAuth';

interface RegisterPageProps {
  onNavigate: (page: 'login') => void;
}

const RegisterPage = ({ onNavigate }: RegisterPageProps) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError("Login va parolni to'ldiring");
      return;
    }
    if (password.length < 8) {
      setError("Parol kamida 8 ta belgidan iborat bo'lishi kerak");
      return;
    }
    if (password !== confirm) {
      setError("Parollar mos kelmadi");
      return;
    }
    setLoading(true);
    const result = register(username, password, name);
    setLoading(false);
    if (!result.ok) setError(result.error ?? 'Xatolik yuz berdi');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/40 text-3xl mb-4">
            🏭
          </div>
          <h1 className="text-2xl font-bold text-white">Navbahor Tekstil</h1>
          <p className="text-indigo-300 text-sm mt-1">Ombor boshqaruv tizimi</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Ro'yxatdan o'tish</h2>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/20 border border-red-400/30 text-red-300 text-sm">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-1.5 font-medium">Ism familiya</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-white/40 pointer-events-none">
                  🪪
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="to'liq ismingizni kiriting"
                  autoComplete="name"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-400/60 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-1.5 font-medium">Foydalanuvchi nomi</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-white/40 pointer-events-none">
                  👤
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="loginni kiriting"
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-400/60 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-1.5 font-medium">Parol</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-white/40 pointer-events-none">
                  🔒
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="parol kiriting (min 8 belgi)"
                  autoComplete="new-password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-400/60 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm mb-1.5 font-medium">Parolni tasdiqlang</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-white/40 pointer-events-none">
                  🔐
                </span>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="parolni qayta kiriting"
                  autoComplete="new-password"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-400/60 transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 mt-2"
            >
              {loading ? 'Kutilmoqda...' : "Ro'yxatdan o'tish"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-white/50 text-sm">
              Allaqachon akkauntingiz bormi?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                Kirish
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;