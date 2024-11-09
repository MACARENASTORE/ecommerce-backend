// models/Invoice.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    supplierId: {
        type: Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true,
    },
    products: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
        },
    ],
    invoiceNumber: {
        type: String,
        unique: true,
        required: false, // Ahora es opcional
    },
    date: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true },
});

module.exports = mongoose.model('Invoice', invoiceSchema);
