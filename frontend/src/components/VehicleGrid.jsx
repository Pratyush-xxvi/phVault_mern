import React from 'react';
import { VehicleCard } from './VehicleCard';

export const VehicleGrid = ({
  vehicles,
  loading,
  onPurchase,
  onEdit,
  onRestock,
  onDelete,
  isAdmin,
  isAuthenticated
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-96 rounded-3xl glass-panel animate-pulse p-6 space-y-4">
            <div className="h-48 bg-slate-800/60 rounded-2xl"></div>
            <div className="h-5 bg-slate-800/60 rounded-xl w-3/4"></div>
            <div className="h-4 bg-slate-800/60 rounded-xl w-1/2"></div>
            <div className="h-10 bg-slate-800/60 rounded-xl mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-16 px-6 glass-panel rounded-3xl max-w-lg mx-auto">
        <div className="text-4xl mb-3 text-sky-400">🔍</div>
        <h3 className="text-lg font-bold text-white mb-2 font-heading">No Vehicles Found</h3>
        <p className="text-slate-400 text-xs leading-relaxed">
          No vehicles match your current search or filter criteria. Try resetting filters or searching for another vehicle model.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={(vehicle.id || vehicle._id)}
          vehicle={vehicle}
          onPurchase={onPurchase}
          onEdit={onEdit}
          onRestock={onRestock}
          onDelete={onDelete}
          isAdmin={isAdmin}
          isAuthenticated={isAuthenticated}
        />
      ))}
    </div>
  );
};
