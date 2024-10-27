const express = require('express');
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const upload = require('../middlewares/imageUpload'); // Importa el middleware de carga de imágenes

const router = express.Router();

// Rutas protegidas para administradores
router.post('/', authMiddleware, adminMiddleware, upload, productController.createProduct); // Añade 'upload' aquí
router.put('/:id', authMiddleware, adminMiddleware, upload, productController.updateProduct); // Añade 'upload' aquí también
router.delete('/:id', authMiddleware, adminMiddleware, productController.deleteProduct);

// Obtener todos los productos
router.get('/', productController.getAllProducts);

// Obtener un producto por ID
router.get('/:id', productController.getProductById);

module.exports = router;
