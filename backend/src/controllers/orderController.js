const Order = require('../models/Order');
const Vehicle = require('../models/Vehicle');

// POST /api/orders  (customer)
const placeOrder = async (req, res, next) => {
  try {
    const { vehicleId, quantity = 1, deliveryCity, buyerPhone } = req.body;
    if (!vehicleId) return res.status(400).json({ success: false, message: 'vehicleId required' });

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).json({ success: false, message: 'Vehicle not found' });
    if (vehicle.quantity < quantity)
      return res.status(400).json({ success: false, message: 'Insufficient stock' });

    vehicle.quantity -= quantity;
    await vehicle.save();

    const order = await Order.create({
      user: req.user._id,
      vehicle: vehicle._id,
      quantity,
      totalPrice: vehicle.price * quantity,
      deliveryCity,
      buyerPhone,
    });

    const populated = await order.populate([{ path: 'user', select: 'username email' }, { path: 'vehicle' }]);
    res.status(201).json({ success: true, data: populated });
  } catch (err) { next(err); }
};

// GET /api/orders  (admin)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'username email')
      .populate('vehicle')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
};

// GET /api/orders/my  (customer)
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('vehicle')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
};

// PATCH /api/orders/:id/approve  (admin)
const approveOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'APPROVED' }, { new: true })
      .populate('user', 'username email').populate('vehicle');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};

// PATCH /api/orders/:id/reject  (admin)
const rejectOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    // Restore stock
    await Vehicle.findByIdAndUpdate(order.vehicle, { $inc: { quantity: order.quantity } });
    order.status = 'REJECTED';
    await order.save();
    const populated = await order.populate([{ path: 'user', select: 'username email' }, { path: 'vehicle' }]);
    res.json({ success: true, data: populated });
  } catch (err) { next(err); }
};

module.exports = { placeOrder, getAllOrders, getMyOrders, approveOrder, rejectOrder };
