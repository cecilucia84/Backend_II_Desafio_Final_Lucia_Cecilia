import ProductDao from "../dao/ProductDao.js";

export default class ProductRepository {
    constructor() {
        this.productDao = new ProductDao();
    }

    async getAllProducts() {
        return await this.productDao.findAll();
    }

    async getProductById(id) {
        return await this.productDao.findById(id);
    }

    async createProduct(data) {
        return await this.productDao.create(data);
    }

    async updateProduct(id, data) {
        return await this.productDao.update(id, data);
    }

    async deleteProduct(id) {
        return await this.productDao.delete(id);
    }
}
