import { useState } from 'react';
import { FaIndustry, FaArrowLeft } from 'react-icons/fa6';
import type { User } from '../types';
import { supabase } from '../lib/supabaseClient';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onCancel?: () => void;
}

const LoginPage = ({ onLogin, onCancel }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmed = username.trim();
    const email = trimmed.includes('@') ? trimmed : `${trimmed}@navbahor.local`;

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
      return;
    }

    const sbUser = data.user;
    const meta = sbUser?.user_metadata ?? {};
    const userObj: User = {
      id: sbUser?.id ?? '',
      username: (meta.username as string | undefined) ?? trimmed,
      role: (meta.role as 'admin' | 'user' | undefined) ?? 'user',
      name: (meta.name as string | undefined) ?? trimmed,
    };

    localStorage.setItem('currentUser', JSON.stringify(userObj));
    onLogin(userObj);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 select-none">
            <FaIndustry className="text-white text-3xl" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Navbahor Tekstil</h1>
            <p className="text-xs text-indigo-300 font-medium tracking-widest uppercase mt-0.5">
              Ombor boshqaruv tizimi
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                title="Orqaga"
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white/70 hover:text-white transition-all duration-200"
                aria-label="Orqaga qaytish"
              >
                <FaArrowLeft />
              </button>
            )}
            <h2 className="text-xl font-semibold text-white">Tizimga kirish</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-1.5" htmlFor="username">
                Foydalanuvchi nomi
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-400/50 transition"
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1.5" htmlFor="password">
                Parol
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-400/50 transition"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-400/20 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all duration-200 active:scale-[0.98] mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Kirish...' : 'Kirish'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;