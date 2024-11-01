const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Autenticación requerida' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        req.user = user; // Establece el usuario en la solicitud para que esté disponible en el siguiente middleware
        next();
    } catch (error) {
        console.error('Error en el middleware de autenticación:', error.message);
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

module.exports = authMiddleware;
