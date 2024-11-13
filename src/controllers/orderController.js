// src/controllers/orderController.js
const orderService = require('../services/orderService');

/**
 * Crear una orden desde el carrito de compras.
 * Se deben proporcionar `shippingAddress` y `paymentMethod` en el cuerpo de la solicitud.
 */
exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        // Verificar si ambos campos están presentes
        if (!shippingAddress || !paymentMethod) {
            return res.status(400).json({ message: 'Dirección de envío y método de pago son obligatorios.' });
        }

        // Llamada al servicio para crear la orden
        const order = await orderService.createOrderFromCart(req.user.id, shippingAddress, paymentMethod);
        res.status(201).json({ message: 'Orden creada exitosamente', order });
    } catch (error) {
        console.error('Error al crear la orden:', error.message);
        res.status(500).json({ message: 'Hubo un problema al procesar tu orden', error: error.message });
    }
};

/**
 * Obtener todas las órdenes del sistema.
 */
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error al obtener órdenes:', error);
        res.status(500).json({ message: 'Error al obtener órdenes' });
    }
};

/**
 * Obtener una orden específica por ID.
 */
exports.getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }
        res.json(order);
    } catch (error) {
        console.error('Error al obtener la orden:', error);
        res.status(500).json({ message: 'Error al obtener la orden' });
    }
};
