// src/middlewares/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Acceso denegado: Solo administradores pueden realizar esta acción' });
};

module.exports = adminMiddleware;
