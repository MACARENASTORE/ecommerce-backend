const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const routes = require('./routes/routes');

const app = express(); // Inicializa la aplicación antes de configurar middlewares

app.use(cors());
app.use(express.json()); // Middleware para manejar JSON
app.use(express.urlencoded({ extended: true })); // Middleware para manejar datos URL-encoded

app.use('/api', routes); // Usa el enrutador para todas las rutas de la API

const PORT = process.env.PORT || 3009;

// Conectar a la base de datos
connectDB();

// Iniciar el servidor
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
