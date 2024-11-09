// src/middlewares/imageUpload.js
const multer = require('multer');

// Configuración de almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Exporta el middleware para cargar un solo archivo de imagen
module.exports = upload.single('image'); // Asegúrate de que el nombre 'image' coincida en el frontend
