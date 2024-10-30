// models/Invoice.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  invoiceNumber: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  products: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      purchasePrice: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
