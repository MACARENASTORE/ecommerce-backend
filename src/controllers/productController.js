const Product = require('../models/Product');
const productService = require('../services/productService');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { initializeApp } = require('firebase/app');
const config = require('../config/firebase.config');

initializeApp(config.firebaseConfig);
const storage = getStorage();

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, category, ean, isFeatured } = req.body;
        const imageUrls = [];

        if (req.files) {
            for (const file of req.files) {
                const storageRef = ref(storage, `products/${Date.now()}_${file.originalname}`);
                await uploadBytes(storageRef, file.buffer);
                const url = await getDownloadURL(storageRef);
                imageUrls.push(url);
            }
        }

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            category,
            image: imageUrls,
            ean,
            isFeatured: isFeatured === 'true' || isFeatured === true,
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error creando el producto', error });
    }
};

/**
 * Actualizar un producto con imágenes nuevas opcionales
 */

exports.updateProduct = async (req, res) => {
    console.log(req.body); // Debug para revisar el contenido de req.body
    try {
        let imageUrls = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const storageRef = ref(storage, `products/${Date.now()}_${file.originalname}`);
                await uploadBytes(storageRef, file.buffer);
                const url = await getDownloadURL(storageRef);
                imageUrls.push(url);
            }
        }

        const { name, description, price, stock, category, ean, isFeatured } = req.body;

        const updatedData = {
            name,
            description,
            price,
            stock,
            category,
            ean,
            isFeatured,
            ...(imageUrls.length && { image: imageUrls }),
        };

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto actualizado con éxito', updatedProduct });
    } catch (error) {
        console.error('Error al actualizar el producto:', error.message);
        res.status(500).json({ message: 'Error al actualizar el producto' });
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

// Controlador para obtener productos destacados
exports.getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await Product.find({ isFeatured: true });
        res.status(200).json(featuredProducts);
    } catch (error) {
        console.error("Error al obtener productos destacados:", error.message);
        res.status(500).json({ message: "Error al obtener productos destacados" });
    }
};

exports.searchProducts = async (req, res) => {
    const query = req.query.query;
    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { ean: { $regex: query, $options: 'i' } }
            ]
        });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error al buscar productos:", error);
        res.status(500).json({ message: "Error al buscar productos" });
    }
};