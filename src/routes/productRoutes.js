const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const upload = require('../middlewares/imageUpload');

const router = express.Router();

// Ruta para obtener productos destacados (DEBE ir antes de '/:id')
router.get('/featured', productController.getFeaturedProducts);

// Rutas públicas
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rutas protegidas para administradores
router.post('/', authMiddleware, adminMiddleware, upload.array('image'), productController.createProduct);
router.put('/:id', authMiddleware, adminMiddleware, upload.array('image'), productController.updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

module.exports = router;
