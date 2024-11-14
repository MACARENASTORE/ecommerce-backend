// src/routes/categoryRoutes.js
const express = require('express');
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware'); // Middleware de autenticación si es necesario
const adminMiddleware = require('../middlewares/adminMiddleware'); // Middleware de autorización para roles administrativos

const router = express.Router();

// Crear una nueva categoría (solo administradores)
router.post('/', authMiddleware, adminMiddleware, categoryController.createCategory);

// Obtener todas las categorías
router.get('/', categoryController.getAllCategories);

// Obtener una categoría por ID y sus productos asociados
router.get('/:id', categoryController.getCategoryById);

// Actualizar una categoría (solo administradores)
router.put('/:id', authMiddleware, adminMiddleware, categoryController.updateCategory);

// Eliminar una categoría (solo administradores)
router.delete('/:id', authMiddleware, adminMiddleware, categoryController.deleteCategory);

module.exports = router;
