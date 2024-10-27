const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Solo permite estos dos valores
        default: 'user'          // Rol predeterminado para nuevos usuarios
    }
});

module.exports = mongoose.model('User', userSchema);
