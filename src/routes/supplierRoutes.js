// src/routes/supplierRoutes.js
const express = require('express');
const supplierController = require('../controllers/supplierController');
const authMiddleware = require('../middlewares/authMiddleware');     // Middleware de autenticación
const adminMiddleware = require('../middlewares/adminMiddleware');   // Middleware de autorización para administradores

const router = express.Router();

// Crear un nuevo proveedor (solo administradores)
router.post('/', authMiddleware, adminMiddleware, supplierController.createSupplier);

// Obtener todos los proveedores (solo administradores)
router.get('/', authMiddleware, adminMiddleware, supplierController.getSuppliers);

module.exports = router;
