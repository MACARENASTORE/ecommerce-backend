// src/services/invoiceService.js
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');
const { generateInvoicePDF } = require('../utils/invoiceGenerator');

async function generateInvoicePDFData(invoiceId) {
    // Busca la factura por ID y completa los detalles de cada producto
    const invoice = await Invoice.findById(invoiceId)
        .populate({
            path: 'products.productId',
            model: 'Product',
            select: 'name price', // Incluye el nombre y precio
        })
        .populate('supplierId', 'name'); // Opcional: para incluir el nombre del proveedor

    if (!invoice) {
        throw new Error('Factura no encontrada');
    }

    // Genera el PDF con detalles completos
    return generateInvoicePDF(invoice);
}

module.exports = { generateInvoicePDFData };
