const Product = require('../models/Product');
const { getStorage, ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const Category = require('../models/Category');
const { initializeApp } = require('firebase/app');
const config = require('../config/firebase.config');

// Inicializar Firebase
initializeApp(config.firebaseConfig);
const storage = getStorage();

// Crear producto con imagen
exports.createProduct = async (req) => {
    const { name, description, price, stock, category } = req.body;
    let imageUrl = '';

    if (req.file) {
        const storageRef = ref(storage, `products/${Date.now()}_${req.file.originalname}`);
        const snapshot = await uploadBytes(storageRef, req.file.buffer);
        imageUrl = await getDownloadURL(snapshot.ref);
    }

    const product = new Product({
        name,
        description,
        price,
        stock,
        category,
        image: [imageUrl],
        createdAt: new Date(),
    });
    await product.save();
    return product;
};

// Obtener todos los productos
exports.getAllProducts = async () => {
    return await Product.find().populate('category', 'name');
};

// Obtener un producto por su ID
exports.getProductById = async (productId) => {
    const product = await Product.findById(productId).populate('category', 'name');
    if (!product) throw new Error('Producto no encontrado');
    return product;
};

// Actualizar producto con nueva imagen
exports.updateProduct = async (id, req) => {
    const { name, description, price, stock, category } = req.body;
    let imageUrl = '';

    if (req.file) {
        const storageRef = ref(storage, `products/${Date.now()}_${req.file.originalname}`);
        const snapshot = await uploadBytes(storageRef, req.file.buffer);
        imageUrl = await getDownloadURL(snapshot.ref);
    }

    const updatedData = {
        name,
        description,
        price,
        stock,
        category,
        ...(imageUrl && { image: [imageUrl] }),
    };

    return await Product.findByIdAndUpdate(id, updatedData, { new: true });
};

// Eliminar un producto
exports.deleteProduct = async (productId) => {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) throw new Error('Producto no encontrado');
    return deletedProduct;
};
