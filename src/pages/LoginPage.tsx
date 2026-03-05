import { useState } from 'react';
import type { User } from '../types';
import initialUsers from '../data/users.json';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onGoRegister: () => void;
}

const LoginPage = ({ onLogin, onGoRegister }: LoginPageProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const storedUsers: User[] = JSON.parse(
      localStorage.getItem('users') ?? JSON.stringify(initialUsers)
    );

    const found = storedUsers.find(
      (u) => u.username === username.trim() && u.password === password
    );

    if (found) {
      localStorage.setItem('currentUser', JSON.stringify(found));
      onLogin(found);
    } else {
      setError("Login yoki parol noto'g'ri. Qaytadan urinib ko'ring.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 text-3xl select-none">
            🏭
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
          <h2 className="text-xl font-semibold text-white mb-6">Tizimga kirish</h2>

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
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/20 transition-all duration-200 active:scale-[0.98] mt-2"
            >
              Kirish
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/50">
            Hisobingiz yo'qmi?{' '}
            <button
              onClick={onGoRegister}
              className="text-indigo-300 hover:text-indigo-200 font-medium transition-colors"
            >
              Ro'yhatdan o'ting
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;