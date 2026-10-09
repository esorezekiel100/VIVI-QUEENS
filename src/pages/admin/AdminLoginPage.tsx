import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { navigate, setAdminUser, showToast } = useApp();

  const [email, setEmail] = useState('admin@viviqueens.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('vivi_admin_token', data.token);
        setAdminUser(data.admin);
        showToast(`Welcome back, ${data.admin.name}`);
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setError('Network failure connecting to atelier auth service.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1412] text-[#FAF8F5] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#241E1C] border border-[#C5A880]/30 p-8 sm:p-10 shadow-2xl relative">
        
        {/* Top Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#C5A880]/20 flex items-center justify-center text-[#C5A880] mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
            Atelier Portal
          </p>
          <h1 className="font-serif text-3xl tracking-wide uppercase text-white">
            VIVI QUEENS ADMIN
          </h1>
          <p className="text-xs text-[#FAF8F5]/60">
            Biogbolo, Yenagoa • Management System
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#FAF8F5]/70 mb-1.5 font-medium">
              Administrator Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@viviqueens.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#1A1412] border border-[#FAF8F5]/15 focus:border-[#C5A880] focus:outline-hidden text-sm text-white"
              />
              <Mail className="w-4 h-4 text-[#C5A880] absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#FAF8F5]/70 mb-1.5 font-medium">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-[#1A1412] border border-[#FAF8F5]/15 focus:border-[#C5A880] focus:outline-hidden text-sm text-white"
              />
              <Lock className="w-4 h-4 text-[#C5A880] absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-[#FAF8F5]/50 hover:text-white"
                aria-label="Toggle password view"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#C5A880] text-[#1A1412] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Authenticate & Enter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Demo Credentials Hint */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-[#C5A880]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pre-seeded Demo Access:</span>
          </div>
          <p className="font-mono text-xs text-[#FAF8F5]/80 mt-1">
            Email: <code className="text-white">admin@viviqueens.com</code>
          </p>
          <p className="font-mono text-xs text-[#FAF8F5]/80">
            Password: <code className="text-white">admin123</code>
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-[#FAF8F5]/50 hover:text-white uppercase tracking-wider underline cursor-pointer"
          >
            ← Return to Public Atelier
          </button>
        </div>

      </div>
    </div>
  );
};
