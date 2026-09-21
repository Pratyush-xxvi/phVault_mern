import React from 'react';
import { formatINR } from '../utils/formatters';

export const FilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  categories,
  sortBy,
  setSortBy,
  onReset
}) => {
  return (
    <div className="glass-panel rounded-3xl p-5 md:p-6 mb-8 space-y-4 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            🔍
          </div>
          <input
            type="text"
            placeholder="Search Mahindra, Tata, Fortuner, BMW, VIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort By Dropdown */}
        <div className="md:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-sm text-slate-200 focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            <option value="featured">Sort: Featured Cars</option>
            <option value="price-asc">Price: Low to High (₹)</option>
            <option value="price-desc">Price: High to Low (₹)</option>
            <option value="stock-desc">Highest Stock First</option>
            <option value="year-desc">Newest Model First</option>
          </select>
        </div>

        {/* Max Price Range Slider */}
        <div className="md:col-span-4 space-y-1">
          <div className="flex justify-between text-xs font-semibold text-slate-400">
            <span>Max Budget</span>
            <span className="text-sky-400 font-bold font-mono-code">
              {formatINR(maxPrice)}
            </span>
          </div>
          <input
            type="range"
            min="500000"
            max="50000000"
            step="500000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full accent-sky-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Category Pills & Reset Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/60">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 uppercase tracking-wider">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'gradient-bg text-white shadow-md shadow-sky-500/20 font-bold scale-105'
                  : 'bg-slate-950/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
              }`}
            >
              {cat === 'All' ? '🚗 All Vehicles' : cat}
            </button>
          ))}
        </div>

        <button
          onClick={onReset}
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-950/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors border border-slate-800"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};
