// src/controllers/invoiceController.js
const invoiceService = require('../services/invoiceService');

exports.createInvoice = async (req, res) => {
  try {
    console.log("Datos de la solicitud:", req.body);
    const invoice = await invoiceService.createInvoice(req.body);
    res.status(201).json({ message: 'Factura creada y stock actualizado', invoice });
  } catch (error) {
    console.error('Error al crear la factura:', error);
    res.status(500).json({ message: 'Error al crear la factura', error });
  }
};


// Controladores adicionales para obtener facturas
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener facturas', error });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error('Error al obtener la factura:', error.message);
    res.status(500).json({ message: 'Error al obtener la factura', error });
  }
};
