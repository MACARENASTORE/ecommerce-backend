// src/services/cartService.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

async function addToCart(userId, product) {
  const { productId, quantity } = product;
  const productDetails = await Product.findById(productId);
  if (!productDetails) throw new Error('Producto no encontrado');

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, products: [{ productId, quantity, price: productDetails.price }] });
  } else {
    const productInCart = cart.products.find(item => item.productId.equals(productId));
    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({ productId, quantity, price: productDetails.price });
    }
  }
  return await cart.save();
}

async function removeFromCart(userId, productId) {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw new Error('Carrito no encontrado');
  cart.products = cart.products.filter(item => !item.productId.equals(productId));
  return await cart.save();
}

async function getCart(userId) {
  return await Cart.findOne({ userId }).populate('products.productId', 'name price');
}

module.exports = { addToCart, removeFromCart, getCart };
