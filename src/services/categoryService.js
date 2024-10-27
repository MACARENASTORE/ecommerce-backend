const Category = require('../models/Category');

// Crear una nueva categoría
const createCategory = async (categoryData) => {
    try {
        const newCategory = new Category(categoryData);
        return await newCategory.save();
    } catch (error) {
        throw new Error('Error al crear la categoría: ' + error.message);
    }
};

// Obtener todas las categorías
const getAllCategories = async () => {
    try {
        return await Category.find();
    } catch (error) {
        throw new Error('Error al obtener las categorías: ' + error.message);
    }
};

// Obtener una categoría por su ID
const getCategoryById = async (categoryId) => {
    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            throw new Error('Categoría no encontrada');
        }
        return category;
    } catch (error) {
        throw new Error('Error al obtener la categoría: ' + error.message);
    }
};

// Actualizar una categoría
const updateCategory = async (categoryId, categoryData) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, categoryData, { new: true });
        if (!updatedCategory) {
            throw new Error('Categoría no encontrada');
        }
        return updatedCategory;
    } catch (error) {
        throw new Error('Error al actualizar la categoría: ' + error.message);
    }
};

// Eliminar una categoría
const deleteCategory = async (categoryId) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if (!deletedCategory) {
            throw new Error('Categoría no encontrada');
        }
        return deletedCategory;
    } catch (error) {
        throw new Error('Error al eliminar la categoría: ' + error.message);
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
