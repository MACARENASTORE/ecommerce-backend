const express = require('express');
const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes'); // Importa las rutas de categorías
const productRoutes = require('./productRoutes');   // Importa las rutas de productos si no lo has hecho aún

const router = express.Router();

// Configurar las rutas de autenticación
router.use('/auth', authRoutes);

// Configurar las rutas de categorías
router.use('/categories', categoryRoutes);

// Configurar las rutas de productos
router.use('/products', productRoutes);

module.exports = router;
