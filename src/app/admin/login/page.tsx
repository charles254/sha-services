'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-fill dev password hint
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') setPassword('sha-admin-2024');
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        const d = await res.json();
        setError(d.error || 'Incorrect password.');
      }
    } catch { setError('Connection error. Try again.'); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-sha-900 flex items-center justify-center px-4">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sha-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-500/5 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sha-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-sha-500/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">SHA Admin Portal</h1>
          <p className="text-sha-400 font-bold text-sm mt-1">Agent & Operations Dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-sha-300 mb-2 block">
                <Lock className="w-3.5 h-3.5 inline mr-2 text-sha-500" />Admin Password
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter admin password"
                  required
                  className="w-full px-5 py-4 pr-12 rounded-2xl bg-white/5 border border-white/10 text-white font-bold placeholder:text-white/20 outline-none focus:border-sha-500 focus:bg-white/8 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-bold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-sha-600 text-white font-black rounded-2xl hover:bg-sha-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-sha-900/30"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing in…</> : 'Sign in to Dashboard'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-[10px] text-sha-600 font-black uppercase tracking-widest">
          SHA Online Cyber Services · Agent Access Only
        </p>
      </div>
    </main>
  );
}
