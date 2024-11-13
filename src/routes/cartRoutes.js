const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * Rutas para el manejo del carrito de compras
 */

// Añadir un producto al carrito
router.post('/', authMiddleware, cartController.addToCart);

// Obtener el carrito del usuario
router.get('/', authMiddleware, cartController.getCart);

// Eliminar un producto específico del carrito por ID de producto
router.delete('/:productId', authMiddleware, cartController.removeFromCart);

// Procesar el checkout y crear una orden desde el carrito
router.post('/checkout', authMiddleware, cartController.checkout);

module.exports = router;

