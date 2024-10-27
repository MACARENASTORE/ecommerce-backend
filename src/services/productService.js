const Product = require('../models/Product');
const Category = require('../models/Category');
const { getStorage, ref, uploadBytesResumable, getDownloadURL } = require('firebase/storage');
const { initializeApp } = require('firebase/app');
const config = require('../config/firebase.config');

// Inicializar Firebase
initializeApp(config.firebaseConfig);
const storage = getStorage();

// Crear producto
exports.createProduct = async (req) => {
    try {
        const { name, description, price, category, stock } = req.body; // Obtener los datos del producto
        let imageUrl = []; // Inicializamos el array para almacenar las URLs de las imágenes

        // Definir límites de tamaño y tipos permitidos
        const fileSizeLimit = 2 * 1024 * 1024; // Límite de 2MB
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

        // Verificamos si se ha subido una imagen
        if (req.file) {
            // Validar tamaño de archivo
            if (req.file.size > fileSizeLimit) {
                throw new Error('El archivo es demasiado grande. Máximo 2MB.');
            }
            // Validar tipo de archivo
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                throw new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG y GIF.');
            }

            const file = req.file; // Obtenemos el archivo de la solicitud
            const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, "_")}`; // Creamos un nombre único para el archivo
            const fileRef = ref(storage, `products/${fileName}`); // Referencia a Firebase Storage
            const metadata = { contentType: file.mimetype }; // Metadatos del archivo

            // Subir la imagen a Firebase Storage
            const uploadTask = uploadBytesResumable(fileRef, file.buffer, metadata);

            // Esperar a que la imagen se suba y obtener la URL
            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed', null, (error) => reject(error), async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref); // Obtener URL de descarga
                        imageUrl.push(downloadURL); // Guardar la URL de la imagen en el array
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        }

        // Crear el producto con la información recibida
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            image: imageUrl // Guardar la(s) URL(s) de la imagen
        });

        // Guardar el producto en la base de datos
        await product.save();
        return product; // Devolver el producto creado
    } catch (error) {
        throw new Error("Error creando el producto: " + error.message);
    }
};
// Obtener todos los productos
exports.getAllProducts = async () => {
    try {
        return await Product.find().populate('category', 'name'); // Poblar la categoría
    } catch (error) {
        throw new Error('Error al obtener los productos: ' + error.message);
    }
};

// Obtener un producto por su ID
exports.getProductById = async (productId) => {
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
exports.updateProduct = async (productId, productData) => {
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
exports.deleteProduct = async (productId) => {
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
