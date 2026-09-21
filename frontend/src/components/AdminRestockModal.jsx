import React, { useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const AdminRestockModal = ({ vehicle, onClose, onSuccess }) => {
  const [restockAmount, setRestockAmount] = useState(5);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  if (!vehicle) return null;

  const handleRestock = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post(`/vehicles/${(vehicle.id || vehicle._id)}/restock`, {
        quantity: parseInt(restockAmount),
      });
      addToast(
        `📦 Restocked ${vehicle.make} ${vehicle.model}! New stock level: ${response.data.data.quantity} units.`,
        'success'
      );
      onSuccess(response.data.data);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Restock failed.';
      addToast(msg, 'error');
    } finally {
      setLoading(false);
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

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xl border border-emerald-500/20">
            📦
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-heading">Restock Showroom Inventory</h3>
            <p className="text-xs text-slate-400">Admin Inventory Stock Adjustment</p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 mb-6 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Vehicle Model:</span>
            <span className="font-bold text-white">{vehicle.make} {vehicle.model}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Current Stock:</span>
            <span className="font-bold text-amber-400">{vehicle.quantity} units</span>
          </div>
        </div>

        <form onSubmit={handleRestock} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Units to Add:
            </label>
            <input
              type="number"
              min="1"
              required
              value={restockAmount}
              onChange={(e) => setRestockAmount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xl font-bold text-emerald-400 text-center focus:outline-none focus:border-emerald-500 font-mono-code"
            />
          </div>

          <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-center text-xs text-emerald-300">
            New Total Inventory Count will be: <strong>{vehicle.quantity + (parseInt(restockAmount) || 0)}</strong> units
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-110 rounded-xl text-xs font-bold shadow-md shadow-emerald-500/15 transition-all font-heading"
            >
              {loading ? 'Restocking...' : 'Confirm Restock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
