const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Autenticación requerida: No se encontró el token.' });
        }

        const token = authHeader.split(' ')[1]; // Obtén solo el token
        if (!token) {
            return res.status(401).json({ message: 'Autenticación requerida: Token inválido.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error en el middleware de autenticación:', error.message);
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

module.exports = authMiddleware;
