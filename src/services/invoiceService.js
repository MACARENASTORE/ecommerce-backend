// src/services/invoiceService.js
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

/**
 * Crea una nueva factura y actualiza el stock de productos.
 * @param {Object} data - Datos de la factura, incluyendo supplierId, invoiceNumber y productos.
 * @returns {Object} La factura creada.
 */
async function createInvoice({ supplierId, invoiceNumber, products }) {
  const totalAmount = products.reduce((acc, item) => acc + (item.purchasePrice * item.quantity), 0);
  const session = await Invoice.startSession();
  session.startTransaction();

  try {
    // Crear y guardar la factura
    const invoice = new Invoice({ supplierId, invoiceNumber, products, totalAmount });
    await invoice.save({ session });

    // Actualizar el stock de cada producto
    for (const item of products) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) throw new Error(`Producto no encontrado: ${item.productId}`);

      product.stock += item.quantity;
      await product.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    return invoice;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}

/**
 * Obtiene todas las facturas, incluyendo los datos del proveedor.
 * @returns {Array} Lista de facturas.
 */
async function getAllInvoices() {
  return await Invoice.find().populate('supplierId', 'name');
}

/**
 * Obtiene una factura específica por ID, incluyendo los datos del proveedor.
 * @param {String} invoiceId - ID de la factura.
 * @returns {Object} La factura encontrada.
 */
async function getInvoiceById(invoiceId) {
  return await Invoice.findById(invoiceId).populate('supplierId', 'name');
}

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
};
