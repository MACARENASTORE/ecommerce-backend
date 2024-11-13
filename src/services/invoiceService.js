// src/services/invoiceService.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');

async function createInvoice(data) {
    const { supplierId, products, invoiceNumber } = data;
    let totalAmount = 0;

    if (!supplierId || !mongoose.Types.ObjectId.isValid(supplierId)) {
        throw new Error('supplierId no es un ObjectId válido');
    }

    try {
        for (const item of products) {
            console.log("Procesando producto:", item);
            const product = await Product.findById(item.productId);

            if (!product) {
                throw new Error(`Producto con ID ${item.productId} no encontrado`);
            }

            totalAmount += item.price * item.quantity;
            product.stock += item.quantity;
            await product.save();
        }

        // Usar el número de factura proporcionado o generar uno automáticamente
        const generatedInvoiceNumber = invoiceNumber || `INV-${Date.now()}`;

        const invoice = new Invoice({
            supplierId,
            products,
            invoiceNumber: generatedInvoiceNumber,
            date: new Date(),
            totalAmount,
        });

        return await invoice.save();
    } catch (error) {
        console.error("Error en createInvoice:", error.message);
        throw error;
    }
}

async function getAllInvoices() {
    try {
        return await Invoice.find().populate('supplierId').populate('products.productId');
    } catch (error) {
        console.error("Error al obtener facturas:", error.message);
        throw error;
    }
}

async function getInvoiceById(id) {
    try {
        return await Invoice.findById(id).populate('supplierId').populate('products.productId');
    } catch (error) {
        console.error("Error al obtener la factura por ID:", error.message);
        throw error;
    }
}

module.exports = { createInvoice, getAllInvoices, getInvoiceById };

