const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make:        { type: String, required: true, trim: true },
  model:       { type: String, required: true, trim: true },
  category:    { type: String, required: true, trim: true },
  price:       { type: Number, required: true, min: 0 },
  quantity:    { type: Number, required: true, min: 0, default: 0 },
  year:        { type: Number, default: 2024 },
  vin:         { type: String, trim: true },
  imageUrl:    { type: String, trim: true },
  description: { type: String, trim: true },
}, { 
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      return ret;
    }
  }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
