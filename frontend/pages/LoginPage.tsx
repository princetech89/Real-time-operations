import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { api } from '@/services/api';
import { Zap, Mail } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { setCurrentUser } = useApp();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email) {
      alert('Please enter email');
      return;
    }

    try {
      setLoading(true);
      const user = await api.login(email);
      setCurrentUser(user);
      window.location.hash = '#/dashboard';
    } catch (err) {
      alert('Invalid login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Zap className="w-10 h-10 text-blue-500 fill-blue-500 mb-3" />
          <h1 className="text-2xl font-bold tracking-tight">Sentinel Ops</h1>
          <p className="text-slate-400 text-sm mt-1">
            Secure Incident Management Platform
          </p>
        </div>

        {/* Email Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-slate-500" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sentinel.ops"
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold rounded-lg transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {/* Footer */}
        <p className="text-xs text-slate-500 text-center mt-6">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
};
