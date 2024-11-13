// src/routes/orderRoutes.js
const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, orderController.createOrder);   // Crear una orden desde el carrito
router.get('/', authMiddleware, orderController.getAllOrders);   // Obtener todas las órdenes
router.get('/:id', authMiddleware, orderController.getOrderById); // Obtener una orden por ID

router.get('/', authMiddleware, adminMiddleware, orderController.getAllOrders); // Obtener todas las órdenes
router.put('/:id/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus); // Actualizar estado de una orden


module.exports = router;
