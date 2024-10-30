// src/routes/routes.js
const express = require('express');
const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const invoiceRoutes = require('./invoiceRoutes');
const supplierRoutes = require('./supplierRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/suppliers', supplierRoutes);

module.exports = router;
