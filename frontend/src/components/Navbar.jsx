import React from 'react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onOpenAuth, onOpenAddVehicle }) => {
  const { user, isAuthenticated, isAdmin, logout, loginAsDemo } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 shadow-lg backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-lg shadow-md shadow-sky-500/10 group-hover:scale-105 transition-all duration-300">
            🛡️
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight font-heading gradient-text">
                phVault
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
                INDIA
              </span>
            </div>
            <span className="block text-[11px] text-slate-400 font-medium tracking-wide -mt-0.5">
              Automotive Inventory Vault
            </span>
          </div>
        </div>

        {/* Action Controls & User Account */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              {/* Role Indicator Badge */}
              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-2 border ${
                isAdmin 
                  ? 'bg-indigo-950/50 text-indigo-300 border-indigo-500/30' 
                  : 'bg-sky-950/50 text-sky-300 border-sky-500/30'
              }`}>
                <span>{isAdmin ? '👑 ADMIN' : '👤 CUSTOMER'}</span>
                <span className="opacity-30">|</span>
                <span className="font-medium text-slate-200">{user.username}</span>
              </div>

              {/* Admin Add Vehicle Button */}
              {isAdmin && (
                <button
                  onClick={onOpenAddVehicle}
                  className="px-4 py-2 rounded-xl text-xs font-bold gradient-bg text-white hover:brightness-110 shadow-md shadow-sky-500/15 transition-all flex items-center space-x-1.5"
                >
                  <span className="text-sm leading-none">+</span>
                  <span>Add Vehicle</span>
                </button>
              )}

              {/* Logout Button */}
              <button
                onClick={logout}
                className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2.5">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 transition-all"
              >
                Log In
              </button>

              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 rounded-xl text-xs font-bold gradient-bg text-white hover:brightness-110 shadow-md shadow-sky-500/15 transition-all font-heading"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
