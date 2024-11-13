// src/services/orderService.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { generateInvoicePDFBuffer } = require('../utils/invoiceGenerator');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { initializeApp } = require('firebase/app');
const config = require('../config/firebase.config');
const mongoose = require('mongoose');

// Inicializar Firebase
initializeApp(config.firebaseConfig);
const storage = getStorage();

/**
 * Crear una orden desde el carrito y generar una factura en Firebase.
 * @param {String} userId - ID del usuario.
 * @param {Object} shippingAddress - Dirección de envío.
 * @param {String} paymentMethod - Método de pago.
 * @returns {Object} La orden creada con la URL de la factura.
 */
async function createOrderFromCart(userId, shippingAddress, paymentMethod) {
    console.log("Payment Method:", paymentMethod);
    console.log("Shipping Address:", shippingAddress);

    if (!paymentMethod) throw new Error('Método de pago no proporcionado');
    if (!shippingAddress) throw new Error('Dirección de envío no proporcionada');

    const cart = await Cart.findOne({ userId }).populate('products.productId', 'name price');
    if (!cart || !cart.products || cart.products.length === 0) {
        throw new Error('El carrito está vacío o no existe.');
    }

    const totalAmount = cart.products.reduce((total, item) => total + item.price * item.quantity, 0);

    const session = await Order.startSession();
    session.startTransaction();

    try {
        const order = new Order({
            userId,
            products: cart.products.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount,
            status: 'pending',
            shippingAddress,
            paymentMethod,
            createdAt: new Date(),
        });
        await order.save({ session });

        for (const item of cart.products) {
            const product = await Product.findById(item.productId._id).session(session);
            if (!product) throw new Error(`Producto no encontrado para ID: ${item.productId._id}`);
            product.stock -= item.quantity;
            await product.save({ session });
        }

        await Cart.deleteOne({ userId }).session(session);
        await session.commitTransaction();
        session.endSession();

        const populatedOrder = await Order.findById(order._id)
            .populate({ path: 'userId', select: 'username email' })
            .populate({ path: 'products.productId', select: 'name price' });

        const invoiceBuffer = await generateInvoicePDFBuffer(populatedOrder);

        const fileName = `invoices/invoice_${order._id}.pdf`;
        const fileRef = ref(storage, fileName);
        await uploadBytes(fileRef, invoiceBuffer, { contentType: 'application/pdf' });

        const invoiceUrl = await getDownloadURL(fileRef);
        populatedOrder.invoiceUrl = invoiceUrl;
        await populatedOrder.save();

        return populatedOrder;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error en createOrderFromCart:", error);
        throw error;
    }
}

/**
 * Obtener todas las órdenes con detalles de usuario y productos.
 * @returns {Array} Lista de órdenes.
 */
async function getAllOrders() {
    try {
        return await Order.find()
            .populate('userId', 'name')
            .populate('products.productId', 'name');
    } catch (error) {
        throw new Error('Error al obtener órdenes: ' + error.message);
    }
}

/**
 * Obtener una orden por su ID con detalles de usuario y productos.
 * @param {String} orderId - ID de la orden.
 * @returns {Object} La orden encontrada o null si no se encuentra.
 */
async function getOrderById(orderId) {
    try {
        return await Order.findById(orderId)
            .populate('userId', 'name')
            .populate('products.productId', 'name');
    } catch (error) {
        throw new Error('Error al obtener la orden: ' + error.message);
    }
}

module.exports = {
    createOrderFromCart,
    getAllOrders,
    getOrderById,
};
