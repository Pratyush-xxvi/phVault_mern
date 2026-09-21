const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, 'Username is required'], unique: true, trim: true },
  email:    { type: String, required: [true, 'Email is required'], unique: true, trim: true, lowercase: true },
  password: { type: String, required: [true, 'Password is required'], minlength: [6, 'Password must be at least 6 characters'] },
  role:     { type: String, enum: ['ROLE_ADMIN', 'ROLE_CUSTOMER'], default: 'ROLE_CUSTOMER' },
}, { 
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret.password;
      return ret;
    }
  }
});

// Modern Mongoose async pre-save (no next() parameter)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toSafeObject = function () {
  return { id: this._id.toString(), username: this.username, email: this.email, role: this.role };
};

module.exports = mongoose.model('User', userSchema);
