import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { placeOrder } from "../services/orderService";
import { formatINR, formatINRLong } from '../utils/formatters';

export const PurchaseModal = ({ vehicle, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [deliveryCity, setDeliveryCity] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  if (!vehicle) return null;

  const unitPrice = parseFloat(vehicle.price || 0);
  const totalPrice = unitPrice * quantity;

  const handlePurchase = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await placeOrder(vehicle.id || vehicle._id, quantity, deliveryCity, buyerPhone);
      
      const successMessage = `Purchase order placed for ${vehicle.make} ${vehicle.model}! Total: ${formatINRLong(totalPrice)}`;
      addToast(successMessage, 'success');
      
      onClose();

      if (onSuccess) {
        onSuccess(vehicle);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to send purchase request.";
      addToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white text-sm"
        >
          âœ•
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-sky-500/15 text-sky-400 flex items-center justify-center text-xl border border-sky-500/20">
            ðŸŽï¸
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-heading">Reserve Vehicle Order</h3>
            <p className="text-xs text-slate-400">phVault Purchase System</p>
          </div>
        </div>

        {/* Vehicle Preview Card */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 mb-6 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Vehicle Model:</span>
            <span className="font-bold text-white font-heading">{vehicle.make} {vehicle.model}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Category / Year:</span>
            <span className="font-medium text-slate-300">{vehicle.category} â€¢ {vehicle.year || 2024}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Ex-Showroom Price:</span>
            <span className="font-bold text-sky-400 font-mono-code">
              {formatINRLong(vehicle.price)}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Showroom Stock:</span>
            <span className="font-semibold text-emerald-400">{vehicle.quantity} units</span>
          </div>
        </div>

        <form onSubmit={handlePurchase} className="space-y-5">
          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Quantity:
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold hover:bg-slate-800 transition-colors"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={vehicle.quantity}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.min(vehicle.quantity, Math.max(1, parseInt(e.target.value) || 1)))
                }
                className="w-20 text-center py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-base font-bold text-white font-mono-code"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(vehicle.quantity, q + 1))}
                className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold hover:bg-slate-800 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">City</label>
              <input
                type="text"
                placeholder="e.g. Mumbai / Delhi"
                value={deliveryCity}
                onChange={(e) => setDeliveryCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91 9876543210"
                value={buyerPhone}
                onChange={(e) => setBuyerPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Total Price Banner */}
          <div className="p-4 bg-sky-950/30 border border-sky-500/20 rounded-2xl flex justify-between items-center">
            <div>
              <span className="text-xs font-bold uppercase text-sky-300 block">Total Price:</span>
              <span className="text-[11px] text-slate-400">Includes ex-showroom taxes</span>
            </div>
            <span className="text-2xl font-bold text-sky-300 font-heading">
              {formatINR(totalPrice)}
            </span>
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
              className="flex-1 py-2.5 gradient-bg text-white hover:brightness-110 rounded-xl text-xs font-bold shadow-md shadow-sky-500/15 transition-all font-heading"
            >
              {loading ? 'Processing...' : 'Confirm Order in â‚¹'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

