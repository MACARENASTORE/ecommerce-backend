const adminMiddleware = (req, res, next) => {
    // Verifica si el usuario autenticado tiene el rol de administrador
    if (req.user && req.user.role === 'admin') {
        return next(); // Permite que la solicitud continúe
    }

    // Si el usuario no es administrador, retorna un error de autorización
    return res.status(403).json({ message: 'Acceso denegado: Solo administradores pueden realizar esta acción' });
};

module.exports = adminMiddleware;
