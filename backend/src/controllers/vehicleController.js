const Vehicle = require('../models/Vehicle');

// GET /api/vehicles
const getVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json({ success: true, data: vehicles });
  } catch (err) { next(err); }
};

// GET /api/vehicles/search
const searchVehicles = async (req, res, next) => {
  try {
    const { make, category, maxPrice } = req.query;
    const query = {};
    if (make) query.$or = [
      { make: { $regex: make, $options: 'i' } },
      { model: { $regex: make, $options: 'i' } },
      { vin:  { $regex: make, $options: 'i' } },
    ];
    if (category && category !== 'All') query.category = { $regex: category, $options: 'i' };
    if (maxPrice) query.price = { $lte: parseFloat(maxPrice) };
    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: vehicles });
  } catch (err) { next(err); }
};

// POST /api/vehicles  (admin)
const createVehicle = async (req, res, next) => {
  try {
    const v = await Vehicle.create(req.body);
    res.status(201).json({ success: true, data: v });
  } catch (err) { next(err); }
};

// PUT /api/vehicles/:id  (admin)
const updateVehicle = async (req, res, next) => {
  try {
    const v = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!v) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.json({ success: true, data: v });
  } catch (err) { next(err); }
};

// DELETE /api/vehicles/:id  (admin)
const deleteVehicle = async (req, res, next) => {
  try {
    const v = await Vehicle.findByIdAndDelete(req.params.id);
    if (!v) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.json({ success: true, message: 'Vehicle deleted' });
  } catch (err) { next(err); }
};

// POST /api/vehicles/:id/restock  (admin)
const restockVehicle = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1)
      return res.status(400).json({ success: false, message: 'Quantity must be >= 1' });
    const v = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { $inc: { quantity: parseInt(quantity) } },
      { new: true }
    );
    if (!v) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    res.json({ success: true, data: v });
  } catch (err) { next(err); }
};

module.exports = { getVehicles, searchVehicles, createVehicle, updateVehicle, deleteVehicle, restockVehicle };
