import { useEffect, useState } from "react";
import {
  getOrders,
  approveOrder,
  rejectOrder,
} from "../services/orderService";
import { formatINR } from "../utils/formatters";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await getOrders();
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (Array.isArray(res.data?.data)) {
        setOrders(res.data.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveOrder(id);
      loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectOrder(id);
      loadOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-10 glass-panel rounded-3xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white font-heading">
            ðŸ›¡ï¸ Customer Purchase Orders
          </h2>
          <p className="text-xs text-slate-400">
            Review and approve customer vehicle reservation and purchase requests.
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800 transition-colors"
        >
          ðŸ”„ Refresh Orders
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/90 text-slate-400 uppercase tracking-wider font-semibold">
            <tr>
              <th className="p-3.5">Order ID</th>
              <th className="p-3.5">Customer</th>
              <th className="p-3.5">Vehicle Model</th>
              <th className="p-3.5">Price (â‚¹ INR)</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400">
                  Loading orders data...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400">
                  <div className="text-3xl mb-2">ðŸ“¦</div>
                  <p className="font-semibold text-white">No Purchase Orders Found</p>
                  <p className="text-xs text-slate-400 mt-1">Customer purchase requests will appear here for admin review.</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={(order.id || order._id)}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="p-3.5 font-mono-code text-slate-400">
                    #{(order.id || order._id)}
                  </td>

                  <td className="p-3.5 font-semibold text-white">
                    {order.user?.username || 'Customer'}
                    <span className="block text-[10px] font-normal text-slate-400">{order.user?.email}</span>
                  </td>

                  <td className="p-3.5 font-bold text-sky-300 font-heading">
                    {order.vehicle?.make} {order.vehicle?.model}
                    <span className="block text-[10px] font-normal text-slate-400">{order.vehicle?.category}</span>
                  </td>

                  <td className="p-3.5 font-mono-code text-white">
                    {order.vehicle?.price ? formatINR(order.vehicle.price) : 'â‚¹ INR'}
                  </td>

                  <td className="p-3.5">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        order.status === "PENDING"
                          ? "bg-amber-950/60 text-amber-300 border border-amber-500/30"
                          : order.status === "APPROVED"
                          ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-950/60 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {order.status === "PENDING" ? 'âŒ› PENDING' : order.status === "APPROVED" ? 'âœ“ APPROVED' : 'âœ• REJECTED'}
                    </span>
                  </td>

                  <td className="p-3.5 text-center">
                    {order.status === "PENDING" ? (
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleApprove((order.id || order._id))}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded-xl text-xs transition-all shadow-sm"
                        >
                          âœ“ Approve
                        </button>

                        <button
                          onClick={() => handleReject((order.id || order._id))}
                          className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1 rounded-xl text-xs transition-all shadow-sm"
                        >
                          âœ• Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-medium">Completed</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
