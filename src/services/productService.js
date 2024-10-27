const Product = require('../models/Product');
const Category = require('../models/Category');

// Crear un nuevo producto
const createProduct = async (productData) => {
    try {
        const newProduct = new Product(productData);
        return await newProduct.save();
    } catch (error) {
        throw new Error('Error al crear el producto: ' + error.message);
    }
};

// Obtener todos los productos
const getAllProducts = async () => {
    try {
        return await Product.find().populate('category', 'name'); // Poblar la categoría
    } catch (error) {
        throw new Error('Error al obtener los productos: ' + error.message);
    }
};

// Obtener un producto por su ID
const getProductById = async (productId) => {
    try {
        const product = await Product.findById(productId).populate('category', 'name');
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    } catch (error) {
        throw new Error('Error al obtener el producto: ' + error.message);
    }
};

// Actualizar un producto
const updateProduct = async (productId, productData) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true });
        if (!updatedProduct) {
            throw new Error('Producto no encontrado');
        }
        return updatedProduct;
    } catch (error) {
        throw new Error('Error al actualizar el producto: ' + error.message);
    }
};

// Eliminar un producto
const deleteProduct = async (productId) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            throw new Error('Producto no encontrado');
        }
        return deletedProduct;
    } catch (error) {
        throw new Error('Error al eliminar el producto: ' + error.message);
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
