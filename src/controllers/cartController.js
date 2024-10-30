// src/controllers/cartController.js
const cartService = require('../services/cartService');
const orderService = require('../services/orderService');

exports.addToCart = async (req, res) => {
  try {
    const cart = await cartService.addToCart(req.user.id, req.body);
    res.status(200).json({ message: 'Producto añadido al carrito', cart });
  } catch (error) {
    console.error('Error al añadir producto al carrito:', error);
    res.status(500).json({ message: 'Error al añadir producto al carrito', error });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    res.status(200).json(cart);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ message: 'Error al obtener el carrito', error });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await cartService.removeFromCart(req.user.id, req.params.productId);
    res.status(200).json({ message: 'Producto eliminado del carrito', cart });
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ message: 'Error al eliminar producto del carrito', error });
  }
};

exports.checkout = async (req, res) => {
  try {
    const order = await orderService.createOrderFromCart(req.user.id);
    res.status(201).json({ message: 'Orden creada con éxito', order });
  } catch (error) {
    console.error('Error al realizar el checkout:', error);
    res.status(500).json({ message: 'Error al realizar el checkout', error });
  }
};
