import React from 'react';
import { formatINR, formatINRLong } from '../utils/formatters';

export const VehicleCard = ({
  vehicle,
  onPurchase,
  onEdit,
  onRestock,
  onDelete,
  isAdmin,
  isAuthenticated
}) => {
  const { id, make, model, category, price, quantity, year, imageUrl, description, vin } = vehicle;
  const isOutOfStock = quantity === 0;

  const defaultImage = "/images/mahindra_thar.jpg";

  return (
    <div className={`group relative rounded-3xl overflow-hidden glass-panel glass-card-hover flex flex-col justify-between ${
      isOutOfStock ? 'border-rose-950/40 bg-slate-950/90' : 'border-slate-800/80'
    }`}>
      <div>
        {/* Card Image Header */}
        <div className="relative h-56 w-full overflow-hidden bg-slate-950">
          <img
            src={imageUrl || defaultImage}
            alt={`${make} ${model}`}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              isOutOfStock ? 'grayscale opacity-50' : ''
            }`}
            onError={(e) => { e.target.src = defaultImage; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

          {/* Category Tag */}
          <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-950/80 text-sky-300 border border-sky-500/30 backdrop-blur-md">
            {category}
          </span>

          {/* Stock Level Badge */}
          <span
            className={`absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border backdrop-blur-md ${
              isOutOfStock
                ? 'bg-rose-950/90 text-rose-300 border-rose-500/40'
                : quantity <= 2
                ? 'bg-amber-950/90 text-amber-300 border-amber-500/40'
                : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {isOutOfStock ? '⚠️ Out of Stock' : `${quantity} in Stock`}
          </span>

          {/* Title & Price Header */}
          <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block drop-shadow">
                {year || 2024} Edition
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight drop-shadow font-heading">
                {make} <span className="font-light text-slate-300">{model}</span>
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-sky-300 drop-shadow font-heading block">
                {formatINR(price)}
              </span>
            </div>
          </div>
        </div>

        {/* Card Body Specs */}
        <div className="p-5 space-y-3">
          <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed">
            {description || `${year || 2024} ${make} ${model} high performance Indian vehicle.`}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 text-slate-400 text-[11px] border border-slate-800 flex items-center gap-1 font-mono-code">
              <span>🏷️</span> VIN: {vin || `IN-${id}0092`}
            </span>
            <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 text-slate-400 text-[11px] border border-slate-800 flex items-center gap-1">
              <span>⚡</span> Ex-Showroom India
            </span>
          </div>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="p-5 pt-0 space-y-3">
        {/* Exact Price Tooltip */}
        <div className="text-[11px] text-slate-400 flex justify-between items-center border-t border-slate-800/60 pt-2.5 px-1">
          <span>Ex-Showroom Price:</span>
          <span className="font-semibold text-slate-200 font-mono-code">{formatINRLong(price)}</span>
        </div>

        {/* Purchase / Reserve Button */}
        <button
          disabled={isOutOfStock || !isAuthenticated}
          onClick={() => onPurchase(vehicle)}
          className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md font-heading ${
            isOutOfStock
              ? 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-800'
              : !isAuthenticated
              ? 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700'
              : 'gradient-bg text-white hover:brightness-110 shadow-sky-500/20 active:scale-[0.98]'
          }`}
        >
          <span>🏎️</span>
          <span>
            {isOutOfStock
              ? 'OUT OF STOCK'
              : !isAuthenticated
              ? 'Log in to Reserve / Purchase'
              : `Purchase Vehicle (${formatINR(price)})`}
          </span>
        </button>

        {/* Admin Management Toolbar */}
        {isAdmin && (
          <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-slate-800/80">
            <button
              onClick={() => onRestock(vehicle)}
              className="flex-1 py-1.5 px-2 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-500/30 rounded-lg text-[11px] font-semibold transition-colors"
              title="Restock Inventory"
            >
              📦 Restock
            </button>
            <button
              onClick={() => onEdit(vehicle)}
              className="flex-1 py-1.5 px-2 bg-sky-950/40 text-sky-300 hover:bg-sky-900/60 border border-sky-500/30 rounded-lg text-[11px] font-semibold transition-colors"
              title="Edit Vehicle"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => onDelete(vehicle)}
              className="flex-1 py-1.5 px-2 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-500/30 rounded-lg text-[11px] font-semibold transition-colors"
              title="Delete Vehicle"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
