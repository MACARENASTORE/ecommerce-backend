// src/routes/cartRoutes.js
const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, cartController.addToCart);
router.get('/', authMiddleware, cartController.getCart);
router.delete('/:productId', authMiddleware, cartController.removeFromCart);
router.post('/checkout', authMiddleware, cartController.checkout);

module.exports = router;
