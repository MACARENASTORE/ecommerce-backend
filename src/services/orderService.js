// src/services/orderService.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Crear una orden desde el carrito de compras del usuario.
 * @param {String} userId - ID del usuario.
 * @returns {Object} La orden creada.
 */
async function createOrderFromCart(userId) {
    const cart = await Cart.findOne({ userId }).populate('products.productId', 'name price');
    if (!cart) throw new Error('El carrito está vacío');

    const totalAmount = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);

    const session = await Order.startSession();
    session.startTransaction();

    try {
        // Crear la orden
        const order = new Order({
            userId,
            products: cart.products.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount,
            status: 'pending',
            createdAt: new Date(),
        });
        await order.save({ session });

        // Actualizar el stock de productos
        for (const item of cart.products) {
            const product = await Product.findById(item.productId._id).session(session);
            if (!product) throw new Error(`Producto no encontrado: ${item.productId._id}`);
            product.stock -= item.quantity;
            if (product.stock < 0) throw new Error(`Stock insuficiente para el producto: ${product.name}`);
            await product.save({ session });
        }

        // Limpiar el carrito del usuario después de crear la orden
        await Cart.deleteOne({ userId }).session(session);

        await session.commitTransaction();
        session.endSession();
        return order;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

/**
 * Obtener todas las órdenes.
 * @returns {Array} Lista de órdenes.
 */
async function getAllOrders() {
    return await Order.find().populate('userId', 'name email');
}

/**
 * Obtener una orden por su ID.
 * @param {String} orderId - ID de la orden.
 * @returns {Object} La orden encontrada.
 */
async function getOrderById(orderId) {
    return await Order.findById(orderId).populate('userId', 'name email');
}

module.exports = {
    createOrderFromCart,
    getAllOrders,
    getOrderById
};
