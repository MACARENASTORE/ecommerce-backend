// src/middlewares/imageUpload.js
const multer = require('multer');

// Configuración de multer para almacenar los archivos en la memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
