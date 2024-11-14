// src/routes/orderRoutes.js
const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

const router = express.Router();

// Rutas para usuarios autenticados
router.post('/', authMiddleware, orderController.createOrder); // Crear una orden
router.get('/', authMiddleware, orderController.getUserOrders); // Obtener órdenes solo del usuario autenticado
router.get('/:id', authMiddleware, orderController.getOrderById); // Obtener una orden específica por ID

// Rutas exclusivas para administradores
router.get('/admin/all', authMiddleware, adminMiddleware, orderController.getAllOrders); // Obtener todas las órdenes (solo administrador)
router.put('/:id/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus); // Actualizar estado de una orden

module.exports = router;

