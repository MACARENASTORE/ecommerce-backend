// src/routes/index.js
const express = require('express');
const authRoutes = require('./authRoutes');

const router = express.Router();

// Configurar las rutas de autenticación
router.use('/auth', authRoutes);

module.exports = router;
