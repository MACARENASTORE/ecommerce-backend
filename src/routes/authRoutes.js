// src/routes/authRoutes.js
const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile); // Ruta protegida para el perfil

module.exports = router;
