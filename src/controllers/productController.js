const Product = require('../models/Product');
const productService = require('../services/productService');
const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');
const config = require('../config/firebase.config');

// Inicializar Firebase
initializeApp(config.firebaseConfig);
const storage = getStorage();

// Crear producto
exports.createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req);
        res.status(201).json(product);
    } catch (error) {
        console.error('Error creando el producto:', error.message);
        res.status(500).json({ message: 'Error creando el producto', error });
    }
};

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error obteniendo los productos:', error.message);
        res.status(500).json({ message: 'Error obteniendo los productos' });
    }
};

// Obtener un producto por ID
exports.getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error al obtener el producto:', error.message);
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
};

// Actualizar un producto
exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado con éxito', updatedProduct });
    } catch (error) {
        console.error('Error al actualizar el producto:', error.message);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await productService.deleteProduct(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
};
