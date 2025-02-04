import Product from '../models/Product.js';

export default class ProductDao {
    async findAll(query = {}) {
        return await Product.find(query);
    }

    async findById(id) {
        return await Product.findById(id);
    }

    async create(productData) {
        return await Product.create(productData);
    }

    async update(id, updateData) {
        return await Product.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }
}