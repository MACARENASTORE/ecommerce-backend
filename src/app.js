// src/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const routes = require('./routes/routes'); // Importa el archivo de rutas

const app = express();

app.use(cors());
app.use(express.json());

// Usa el enrutador central para todas las rutas
app.use('/api', routes);

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Conectar a la base de datos
connectDB();
