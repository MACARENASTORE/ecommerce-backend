// src/controllers/cartController.js
const cartService = require('../services/cartService');
const orderService = require('../services/orderService');

/**
 * Controlador para añadir un producto al carrito.
 */
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Producto y cantidad son requeridos' });
    }

    const cart = await cartService.addToCart(req.user.id, { productId, quantity });
    res.status(200).json({ message: 'Producto añadido al carrito', cart });
  } catch (error) {
    console.error('Error al añadir producto al carrito:', error);
    res.status(500).json({ message: 'Error al añadir producto al carrito', error: error.message });
  }
};

/**
 * Controlador para obtener el carrito de un usuario.
 */
exports.getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
  }
};

/**
 * Controlador para eliminar un producto del carrito.
 */
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!productId) {
      return res.status(400).json({ message: 'El ID del producto es requerido' });
    }

    const cart = await cartService.removeFromCart(req.user.id, productId);
    res.status(200).json({ message: 'Producto eliminado del carrito', cart });
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ message: 'Error al eliminar producto del carrito', error: error.message });
  }
};

/**
 * Controlador para realizar el checkout del carrito.
 */
exports.checkout = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Dirección de envío y método de pago son obligatorios' });
    }

    const order = await orderService.createOrderFromCart(req.user.id, shippingAddress, paymentMethod);
    res.status(201).json({ message: 'Orden creada con éxito', order });
  } catch (error) {
    console.error('Error al realizar el checkout:', error);
    res.status(500).json({ message: 'Error al realizar el checkout', error: error.message });
  }
};
