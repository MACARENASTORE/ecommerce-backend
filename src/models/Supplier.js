// models/Supplier.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
  name: { type: String, required: true },
  nit: { type: String, unique: true, required: true },
  contactName: { type: String },
  contactPhone: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Supplier', supplierSchema);
