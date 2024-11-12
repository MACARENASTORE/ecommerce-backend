const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'El nombre es obligatorio'], trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: [true, 'El precio es obligatorio'], min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: [true, 'La categoría es obligatoria'] },
    stock: { type: Number, default: 0 },
    image: { type: [String], required: true },
    ean: { type: String, unique: true, trim: true },
    status: { type: String, enum: ['activo', 'inactivo', 'descontinuado', 'agotado'], default: 'activo' },
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
