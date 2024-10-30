// src/controllers/invoiceController.js
const invoiceService = require('../services/invoiceService');

/**
 * Controlador para crear una nueva factura y actualizar el stock de productos.
 * @param {Object} req - Objeto de solicitud, contiene los datos de la factura.
 * @param {Object} res - Objeto de respuesta.
 */
exports.createInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.createInvoice(req.body);
    res.status(201).json({ message: 'Factura creada y stock actualizado', invoice });
  } catch (error) {
    console.error('Error al crear la factura:', error);
    res.status(500).json({ message: 'Error al crear la factura', error });
  }
};

/**
 * Controlador para obtener todas las facturas.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    res.status(500).json({ message: 'Error al obtener facturas', error });
  }
};

/**
 * Controlador para obtener una factura por ID.
 * @param {Object} req - Objeto de solicitud, contiene el ID de la factura.
 * @param {Object} res - Objeto de respuesta.
 */
exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error al obtener la factura:', error);
    res.status(500).json({ message: 'Error al obtener la factura', error });
  }
};
