const productService = require('../services/productService');


// Crear un nuevo producto
const createProduct = async (req, res) => {
    try {
        const newProduct = await productService.createProduct(req.body);
        res.status(201).json({ message: 'Producto creado con éxito', newProduct });
    } catch (error) {
        console.error('Error al crear el producto:', error.message);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
};

// Obtener todos los productos
const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
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
const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
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
const deleteProduct = async (req, res) => {
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

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
