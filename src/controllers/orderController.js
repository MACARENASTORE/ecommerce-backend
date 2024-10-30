// src/controllers/orderController.js
const orderService = require('../services/orderService');

/**
 * Crear una orden desde el carrito de compras.
 */
exports.createOrder = async (req, res) => {
    try {
        const order = await orderService.createOrderFromCart(req.user.id);
        res.status(201).json({ message: 'Orden creada exitosamente', order });
    } catch (error) {
        console.error('Error al crear la orden:', error);
        res.status(500).json({ message: 'Error al crear la orden', error });
    }
};

/**
 * Obtener todas las órdenes.
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
