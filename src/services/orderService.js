// src/services/orderService.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { generateInvoicePDFBuffer } = require('../utils/invoiceGenerator');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { initializeApp } = require('firebase/app');
const config = require('../config/firebase.config');

// Inicializar Firebase
initializeApp(config.firebaseConfig);
const storage = getStorage();

/**
 * Crear una orden desde el carrito y generar una factura en Firebase.
 * @param {String} userId - ID del usuario.
 * @returns {Object} La orden creada con la URL de la factura.
 */
async function createOrderFromCart(userId) {
    // Buscar el carrito del usuario y cargar detalles de productos
    const cart = await Cart.findOne({ userId }).populate('products.productId', 'name price');
    if (!cart) throw new Error('El carrito está vacío');

    // Calcular el monto total de la orden
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

        // Generar la factura en memoria
        const invoiceBuffer = await generateInvoicePDFBuffer(order);

        // Cargar el archivo de factura en Firebase Storage
        const fileName = `invoices/invoice_${order._id}.pdf`;
        const fileRef = ref(storage, fileName);
        await uploadBytes(fileRef, invoiceBuffer, { contentType: 'application/pdf' });

        // Obtener la URL de descarga pública
        const invoiceUrl = await getDownloadURL(fileRef);

        // Guardar la URL de la factura en la orden
        order.invoiceUrl = invoiceUrl;
        await order.save({ session });

        // Finalizar transacción
        await session.commitTransaction();
        session.endSession();

        return order;
    } catch (error) {
        // Abortar transacción en caso de error
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
}

/**
 * Obtener todas las órdenes con detalles de usuario y productos.
 * @returns {Array} Lista de órdenes
 */
async function getAllOrders() {
    try {
        return await Order.find()
            .populate('userId', 'name')              // Poblamos detalles de usuario (nombre)
            .populate('products.productId', 'name'); // Poblamos detalles de productos (nombre)
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
            .populate('userId', 'name')               // Poblamos detalles de usuario (nombre)
            .populate('products.productId', 'name');  // Poblamos detalles de productos (nombre)
    } catch (error) {
        throw new Error('Error al obtener la orden: ' + error.message);
    }
}

module.exports = {
    createOrderFromCart,
    getAllOrders,
    getOrderById,
};
