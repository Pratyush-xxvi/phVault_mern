const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle:      { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  quantity:     { type: Number, required: true, min: 1, default: 1 },
  totalPrice:   { type: Number, required: true },
  deliveryCity: { type: String, trim: true },
  buyerPhone:   { type: String, trim: true },
  status:       { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
}, { 
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      return ret;
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);
