// services/supplierService.js
const Supplier = require('../models/Supplier');

async function createSupplier(data) {
  const supplier = new Supplier(data);
  return await supplier.save();
}

async function getSuppliers() {
  return await Supplier.find();
}

module.exports = { createSupplier, getSuppliers };
