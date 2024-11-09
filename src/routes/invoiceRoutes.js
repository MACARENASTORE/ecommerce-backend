// src/routes/invoiceRoutes.js
const express = require('express');
const invoiceController = require('../controllers/invoiceController');
const authMiddleware = require('../middlewares/authMiddleware');     // Middleware de autenticación
const adminMiddleware = require('../middlewares/adminMiddleware');   // Middleware de autorización para administradores

const router = express.Router();

// Crear una nueva factura y actualizar el stock de productos (solo administradores)
router.post('/', authMiddleware, adminMiddleware, invoiceController.createInvoice);

// Obtener todas las facturas (solo administradores)
router.get('/', authMiddleware, adminMiddleware, invoiceController.getAllInvoices);

// Obtener una factura por ID (solo administradores)
router.get('/:id', authMiddleware, adminMiddleware, invoiceController.getInvoiceById);

module.exports = router;
