import React from 'react';
import { formatINR } from '../utils/formatters';

export const HeroBanner = ({ vehicles = [] }) => {
  const totalVehicles = vehicles.length;
  const totalStockCount = vehicles.reduce((sum, v) => sum + (v.quantity || 0), 0);
  const outOfStockCount = vehicles.filter((v) => (v.quantity || 0) === 0).length;
  const totalFleetValue = vehicles.reduce(
    (sum, v) => sum + (v.price ? parseFloat(v.price) * (v.quantity || 1) : 0),
    0
  );

  return (
    <div className="relative overflow-hidden rounded-3xl glass-panel p-8 md:p-10 mb-8 shadow-xl">
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 ambient-glow-sky rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 ambient-glow-indigo rounded-full pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Headline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20 text-xs font-semibold uppercase tracking-wider">
            <span>🛡️ phVault • Indian Automotive Platform</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-heading">
            Curated Indian &amp; Luxury <span className="gradient-text font-black">Automotive Vault</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
            Browse Mahindra, Tata, Toyota, BMW, and Luxury Vehicles in Indian Rupees (₹). Real-time inventory tracking, purchase orders, and secure access.
          </p>
          <div className="pt-1 flex flex-wrap gap-2.5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 bg-slate-900/70 px-3 py-1.5 rounded-xl border border-slate-800/80">
              <span className="text-sky-400">₹</span> Live INR Pricing
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/70 px-3 py-1.5 rounded-xl border border-slate-800/80">
              <span className="text-emerald-400">✓</span> Instant Reserve Orders
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/70 px-3 py-1.5 rounded-xl border border-slate-800/80">
              <span className="text-indigo-400">🔒</span> JWT Role Security
            </span>
          </div>
        </div>

        {/* Right Side: Key Metrics */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-sky-500/30 transition-colors">
            <span className="block text-slate-400 text-xs font-medium uppercase tracking-wider">Available Models</span>
            <span className="text-2xl md:text-3xl font-bold text-white mt-1 block font-heading">{totalVehicles}</span>
            <span className="text-[11px] text-sky-400 font-medium">In Showroom Catalog</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/30 transition-colors">
            <span className="block text-slate-400 text-xs font-medium uppercase tracking-wider">Showroom Units</span>
            <span className="text-2xl md:text-3xl font-bold text-emerald-400 mt-1 block font-heading">{totalStockCount}</span>
            <span className="text-[11px] text-emerald-400/80 font-medium">Ready for Delivery</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-rose-500/30 transition-colors">
            <span className="block text-slate-400 text-xs font-medium uppercase tracking-wider">Out of Stock</span>
            <span className="text-2xl md:text-3xl font-bold text-rose-400 mt-1 block font-heading">{outOfStockCount}</span>
            <span className="text-[11px] text-rose-400/80 font-medium">{outOfStockCount > 0 ? 'Requires Restock' : 'All Available'}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-sky-500/30 transition-colors">
            <span className="block text-slate-400 text-xs font-medium uppercase tracking-wider">Fleet Value</span>
            <span className="text-xl md:text-2xl font-bold text-sky-300 mt-1 block font-heading font-mono-code">
              {formatINR(totalFleetValue)}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Total INR Stock Value</span>
          </div>
        </div>
      </div>
    </div>
  );
};
