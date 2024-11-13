// src/services/cartService.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * Añadir un producto al carrito del usuario.
 * @param {String} userId - ID del usuario.
 * @param {Object} product - Datos del producto a añadir.
 */
async function addToCart(userId, product) {
  const { productId, quantity } = product;
  
  // Verifica si el producto existe en la base de datos
  const productDetails = await Product.findById(productId);
  if (!productDetails) throw new Error('Producto no encontrado');

  // Busca el carrito del usuario o crea uno nuevo
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, products: [{ productId, quantity, price: productDetails.price }] });
  } else {
    const productInCart = cart.products.find(item => item.productId.equals(productId));
    if (productInCart) {
      productInCart.quantity += quantity; // Incrementa la cantidad si ya está en el carrito
    } else {
      cart.products.push({ productId, quantity, price: productDetails.price });
    }
  }
  
  return await cart.save();
}

/**
 * Eliminar un producto del carrito del usuario.
 * @param {String} userId - ID del usuario.
 * @param {String} productId - ID del producto a eliminar.
 */
async function removeFromCart(userId, productId) {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error('Carrito no encontrado');
  
  cart.products = cart.products.filter(item => !item.productId.equals(productId));
  return await cart.save();
}

/**
 * Obtener el carrito del usuario.
 * @param {String} userId - ID del usuario.
 * @returns {Object} - El carrito del usuario con los productos.
 */
async function getCart(userId) {
  return await Cart.findOne({ userId }).populate('products.productId', 'name price');
}

module.exports = { addToCart, removeFromCart, getCart };
