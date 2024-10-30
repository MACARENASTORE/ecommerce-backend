// controllers/supplierController.js
const supplierService = require('../services/supplierService');

exports.createSupplier = async (req, res) => {
  try {
    const supplier = await supplierService.createSupplier(req.body);
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el proveedor', error });
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierService.getSuppliers();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los proveedores', error });
  }
};
