// src/services/imageService.js
const { storage } = require('../firebase.config');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const uploadImage = async (file) => {
    const storageRef = ref(storage, `images/${Date.now()}_${file.originalname}`);
    await uploadBytes(storageRef, file.buffer);
    const url = await getDownloadURL(storageRef);
    return url; // Devuelve la URL de la imagen
};

module.exports = { uploadImage };
