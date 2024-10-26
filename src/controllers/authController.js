// src/controllers/authController.js
const bcrypt = require('bcryptjs'); // Asegúrate de usar bcryptjs
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El correo ya está registrado." });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error("Error en el registro:", error.message);
        res.status(500).json({ message: "Error en el registro" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar el usuario por correo electrónico
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Contraseña incorrecta" });
        }

        // Generar un token JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: "Inicio de sesión exitoso", token });
    } catch (error) {
        console.error("Error en el inicio de sesión:", error.message);
        res.status(500).json({ message: "Error en el inicio de sesión" });
    }
};

// Controlador para obtener los datos del perfil del usuario autenticado
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Este valor se obtiene del middleware de autenticación
        const user = await User.findById(userId).select('-password'); // Excluye el campo de la contraseña

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(user); // Devuelve los datos del usuario
    } catch (error) {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

module.exports = { register, login, getProfile };