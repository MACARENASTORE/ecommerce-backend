// src/controllers/orderController.js
const orderService = require('../services/orderService');
const Order = require('../models/Order');

/**
 * Crear una orden desde el carrito de compras.
 * Se deben proporcionar `shippingAddress` y `paymentMethod` en el cuerpo de la solicitud.
 */
exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        if (!shippingAddress || !paymentMethod) {
            return res.status(400).json({ message: 'Dirección de envío y método de pago son obligatorios.' });
        }

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
        const orders = await Order.find()
            .populate('userId', 'username') // Popula solo el campo 'username' del usuario
            .exec();
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

/**
 * Actualiza el estado de una orden específica.
 */
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json(order);
    } catch (error) {
        console.error('Error al actualizar el estado de la orden:', error);
        res.status(500).json({ message: 'Error al actualizar el estado de la orden', error: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ userId }); // Busca órdenes solo para el usuario autenticado
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error al obtener las órdenes del usuario:', error);
        res.status(500).json({ message: 'Error al obtener las órdenes del usuario' });
    }
};