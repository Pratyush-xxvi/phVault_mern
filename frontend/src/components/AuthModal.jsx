import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ initialMode = 'login', onClose }) => {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_CUSTOMER');

  const { login, register, loginAsDemo, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    if (mode === 'login') {
      success = await login(username, password);
    } else {
      success = await register(username, email, password, role);
    }
    if (success) {
      onClose();
    }
  };

  const handleDemoLogin = async (demoRole) => {
    const success = await loginAsDemo(demoRole);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white text-sm"
        >
          ✕
        </button>

        {/* Tab Header */}
        <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold font-heading transition-all ${
              mode === 'login'
                ? 'bg-slate-800 text-sky-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold font-heading transition-all ${
              mode === 'register'
                ? 'bg-slate-800 text-sky-300 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Title */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white font-heading">
            {mode === 'login' ? 'Welcome to phVault' : 'Join phVault India'}
          </h3>
          <p className="text-xs text-slate-400">
            {mode === 'login'
              ? 'Access catalog features and vehicle reservations in ₹ INR'
              : 'Register customer or dealership admin account'}
          </p>
        </div>

        {/* Main Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Username *</label>
            <input
              type="text"
              required
              placeholder="e.g. admin or customer"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="driver@phvault.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-sky-500"
              >
                <option value="ROLE_CUSTOMER">Customer (Browse &amp; Purchase Vehicles in ₹)</option>
                <option value="ROLE_ADMIN">Admin (Inventory Management &amp; Restock)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 gradient-bg text-white hover:brightness-110 rounded-xl text-xs font-bold shadow-md shadow-sky-500/15 transition-all font-heading"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Log In to phVault' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
