import React, { useState, useEffect, useCallback } from 'react';
import api from './services/api';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar } from './components/FilterBar';
import { VehicleGrid } from './components/VehicleGrid';
import { PurchaseModal } from './components/PurchaseModal';
import { AdminVehicleModal } from './components/AdminVehicleModal';
import { AdminRestockModal } from './components/AdminRestockModal';
import { AuthModal } from './components/AuthModal';
import AdminOrders from "./components/AdminOrders";

const INITIAL_CATEGORIES = ['All', 'SUV', 'Electric', 'Luxury', 'Sedan', 'Sports', 'Hatchback'];

const SAMPLE_VEHICLES = [
  {
    id: 1,
    make: 'Mahindra',
    model: 'Thar Roxx 4x4',
    category: 'SUV',
    price: '1699000.00',
    quantity: 5,
    year: 2024,
    vin: 'MA1THARROXX2024IN',
    imageUrl: '/images/mahindra_thar.jpg',
    description: '2.0L Turbo Petrol / 2.2L mHawk Diesel, 174 bhp, 4WD system, Dual Sunroof & ADAS.',
  },
  {
    id: 2,
    make: 'Tata',
    model: 'Nexon EV Long Range',
    category: 'Electric',
    price: '1449000.00',
    quantity: 8,
    year: 2024,
    vin: 'TATANEXONEV2024IN',
    imageUrl: '/images/tata_nexon_ev.jpg',
    description: '45 kWh Battery, 465 km ARAI certified range, V2L & V2V charging technology.',
  },
  {
    id: 3,
    make: 'Mahindra',
    model: 'XUV700 AX7 L',
    category: 'SUV',
    price: '2399000.00',
    quantity: 4,
    year: 2024,
    vin: 'MA1XUV700AX7L2024',
    imageUrl: '/images/mahindra_xuv700.jpg',
    description: '2.2L mHawk Diesel AWD, 200 PS power, Panoramic Skyroof & ADAS Level 2.',
  },
  {
    id: 4,
    make: 'Toyota',
    model: 'Fortuner Legender',
    category: 'SUV',
    price: '4360000.00',
    quantity: 3,
    year: 2024,
    vin: 'TOYFORTLEGEND2024',
    imageUrl: '/images/toyota_fortuner.jpg',
    description: '2.8L Diesel 4x4, 204 PS, 500 Nm torque, premium dual-tone interior.',
  },
  {
    id: 5,
    make: 'Hyundai',
    model: 'Creta N Line',
    category: 'SUV',
    price: '1688000.00',
    quantity: 6,
    year: 2024,
    vin: 'HYUCRETANLINE2024',
    imageUrl: '/images/hyundai_creta.jpg',
    description: '1.5L Turbo GDi, 160 PS power, 7-Speed DCT with paddle shifters & N Line tuning.',
  },
  {
    id: 6,
    make: 'Maruti Suzuki',
    model: 'Jimny Alpha 4WD',
    category: 'SUV',
    price: '1274000.00',
    quantity: 0,
    year: 2024,
    vin: 'MSJIMNYALPHA2024IN',
    imageUrl: '/images/maruti_jimny.jpg',
    description: 'ALLGRIP PRO 4WD system, rigid ladder frame, 1.5L K-series petrol engine.',
  },
  {
    id: 7,
    make: 'BMW',
    model: 'M340i xDrive',
    category: 'Luxury',
    price: '7290000.00',
    quantity: 2,
    year: 2024,
    vin: 'BMWM340IXDRIVE2024',
    imageUrl: '/images/bmw_m340i.jpg',
    description: '3.0L Straight-6 TwinPower Turbo, 374 bhp, 0-100 km/h in 4.4 seconds.',
  },
  {
    id: 8,
    make: 'Mercedes-Benz',
    model: 'G 63 AMG',
    category: 'Luxury',
    price: '33000000.00',
    quantity: 1,
    year: 2024,
    vin: 'MBG63AMGINDIA2024',
    imageUrl: '/images/mercedes_g63.jpg',
    description: 'Handcrafted AMG 4.0L V8 Biturbo, 585 hp, AMG Performance 4MATIC.',
  },
];

export function AppContent() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { addToast } = useToast();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState('50000000');
  const [sortBy, setSortBy] = useState('featured');

  // Modal States
  const [authModal, setAuthModal] = useState({ open: false, mode: 'login' });
  const [purchaseModal, setPurchaseModal] = useState({ open: false, vehicle: null });
  const [adminModal, setAdminModal] = useState({ open: false, vehicle: null });
  const [restockModal, setRestockModal] = useState({ open: false, vehicle: null });

  // Helper to ensure Indian car images and catalog consistency
  const normalizeVehicleList = (list) => {
    if (!list || list.length === 0) return SAMPLE_VEHICLES;

    return list.map((v) => {
      let img = v.imageUrl;
      const make = (v.make || '').toLowerCase();
      const model = (v.model || '').toLowerCase();

      // Replace any external/broken URLs with local images
      if (!img || img.includes('unsplash') || img.includes('aeplcdn') || img.startsWith('http')) {
        if (make.includes('mahindra') && model.includes('thar')) img = '/images/mahindra_thar.jpg';
        else if (make.includes('tata') && model.includes('nexon')) img = '/images/tata_nexon_ev.jpg';
        else if (make.includes('mahindra') && model.includes('xuv')) img = '/images/mahindra_xuv700.jpg';
        else if (make.includes('toyota') || model.includes('fortuner')) img = '/images/toyota_fortuner.jpg';
        else if (make.includes('hyundai') || model.includes('creta')) img = '/images/hyundai_creta.jpg';
        else if (make.includes('maruti') || model.includes('jimny')) img = '/images/maruti_jimny.jpg';
        else if (make.includes('bmw') || model.includes('m340') || model.includes('octavia') || make.includes('skoda')) img = '/images/bmw_m340i.jpg';
        else if (make.includes('mercedes') || model.includes('g 63') || model.includes('g-class')) img = '/images/mercedes_g63.jpg';
        else if (make.includes('kia') || make.includes('tata') || model.includes('safari') || model.includes('seltos')) img = '/images/mahindra_xuv700.jpg';
        else if (make.includes('honda') || model.includes('city')) img = '/images/hyundai_creta.jpg';
        else if (make.includes('audi') || model.includes('audi') || model.includes('e-tron')) img = '/images/mercedes_g63.jpg';
        else img = '/images/mahindra_thar.jpg';
      }

      return { ...v, imageUrl: img };
    });
  };

  // Fetch Vehicles from Backend API with sorting and fallback
  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/vehicles';
      const params = new URLSearchParams();
      if (searchQuery) params.append('make', searchQuery);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (maxPrice && maxPrice !== '50000000') params.append('maxPrice', maxPrice);

      if (params.toString()) {
        url = `/vehicles/search?${params.toString()}`;
      }

      const res = await api.get(url);
      let fetched = res.data.data || [];
      const normalized = normalizeVehicleList(fetched);
      setVehicles(applySorting(normalized, sortBy));
    } catch (err) {
      console.warn('Backend API connection failed, loading phVault Indian car stock.', err);
      // Fallback local filtering for standalone presentation
      let filtered = SAMPLE_VEHICLES;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (v) => v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q) || (v.vin && v.vin.toLowerCase().includes(q))
        );
      }
      if (selectedCategory !== 'All') {
        filtered = filtered.filter((v) => v.category === selectedCategory);
      }
      if (maxPrice) {
        filtered = filtered.filter((v) => parseFloat(v.price) <= parseFloat(maxPrice));
      }
      setVehicles(applySorting(filtered, sortBy));
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, maxPrice, sortBy]);

  const applySorting = (list, option) => {
    const listCopy = [...list];
    if (option === 'price-asc') {
      return listCopy.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (option === 'price-desc') {
      return listCopy.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (option === 'stock-desc') {
      return listCopy.sort((a, b) => (b.quantity || 0) - (a.quantity || 0));
    } else if (option === 'year-desc') {
      return listCopy.sort((a, b) => (b.year || 2024) - (a.year || 2024));
    }
    return listCopy;
  };

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles, isAuthenticated]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice('50000000');
    setSortBy('featured');
  };

  const handleVehiclePurchased = (updatedVehicle) => {
    if (updatedVehicle && updatedVehicle.id) {
      setVehicles((prev) =>
        prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v))
      );
    }
    fetchVehicles();
  };

  const handleVehicleUpdated = (updatedVehicle) => {
    setVehicles((prev) => {
      const exists = prev.some((v) => v.id === updatedVehicle.id);
      if (exists) {
        return prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v));
      } else {
        return [updatedVehicle, ...prev];
      }
    });
    fetchVehicles();
  };

  const handleDeleteVehicle = async (vehicle) => {
    if (window.confirm(`Are you sure you want to delete ${vehicle.make} ${vehicle.model} from phVault?`)) {
      try {
        await api.delete(`/vehicles/${(vehicle.id || vehicle._id)}`);
        addToast(`Deleted ${vehicle.make} ${vehicle.model} from phVault inventory.`, 'info');
        setVehicles((prev) => prev.filter((v) => v.id !== (vehicle.id || vehicle._id)));
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to delete vehicle.';
        addToast(msg, 'error');
        // Local state fallback
        setVehicles((prev) => prev.filter((v) => v.id !== (vehicle.id || vehicle._id)));
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        onOpenAuth={(mode) => setAuthModal({ open: true, mode })}
        onOpenAddVehicle={() => setAdminModal({ open: true, vehicle: null })}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Showcase & Real-time Metrics Banner */}
        <HeroBanner vehicles={vehicles} />

        {/* Search & Multi-Filter Control Panel */}
        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          categories={INITIAL_CATEGORIES}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onReset={handleResetFilters}
        />

        {/* Vehicles Grid Catalog */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white font-heading">
                phVault Indian Showroom Catalog ({vehicles.length})
              </h2>
              <p className="text-xs text-slate-400">
                Browse Mahindra, Tata, Toyota, BMW, and Luxury Supercars in Indian Rupees (₹).
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setAdminModal({ open: true, vehicle: null })}
                className="px-4 py-2.5 rounded-xl text-xs font-black gradient-bg text-slate-950 shadow-lg shadow-amber-500/20 transition-all font-heading"
              >
                + Add Vehicle Record
              </button>
            )}
          </div>

          <VehicleGrid
            vehicles={vehicles}
            loading={loading}
            onPurchase={(v) => setPurchaseModal({ open: true, vehicle: v })}
            onEdit={(v) => setAdminModal({ open: true, vehicle: v })}
            onRestock={(v) => setRestockModal({ open: true, vehicle: v })}
            onDelete={handleDeleteVehicle}
            isAdmin={isAdmin}
            isAuthenticated={isAuthenticated}
          />
          {isAdmin && <AdminOrders />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <p>© 2026 phVault Automotive • Premier Indian Luxury Vault • Built with Spring Boot, React &amp; Tailwind CSS</p>
      </footer>

      {/* Modals */}
      {authModal.open && (
        <AuthModal
          initialMode={authModal.mode}
          onClose={() => setAuthModal({ open: false, mode: 'login' })}
        />
      )}

      {purchaseModal.open && (
        <PurchaseModal
          vehicle={purchaseModal.vehicle}
          onClose={() => setPurchaseModal({ open: false, vehicle: null })}
          onSuccess={handleVehiclePurchased}
        />
      )}

      {adminModal.open && (
        <AdminVehicleModal
          vehicle={adminModal.vehicle}
          onClose={() => setAdminModal({ open: false, vehicle: null })}
          onSuccess={handleVehicleUpdated}
        />
      )}

      {restockModal.open && (
        <AdminRestockModal
          vehicle={restockModal.vehicle}
          onClose={() => setRestockModal({ open: false, vehicle: null })}
          onSuccess={handleVehicleUpdated}
        />
      )}
    </div>
  );
}
