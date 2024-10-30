// src/middlewares/imageUpload.js
const multer = require('multer');

// Configura multer para almacenar archivos temporalmente en la memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Exporta el middleware para cargar un solo archivo
module.exports = upload.single('imageUrl'); // Cambia 'image' por el nombre del campo que usarás para la imagen
