import CartDao from "../dao/CartDao.js";

export default class CartRepository {
    constructor() {
        this.cartDao = new CartDao();
    }

    async getCartById(id) {
        return await this.cartDao.findById(id);
    }

    async createCart() {
        return await this.cartDao.create({});
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await this.cartDao.findById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        const existingProduct = cart.products.find(p => p.product.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        return await cart.save();
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await this.cartDao.findById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        return await cart.save();
    }

    async clearCart(cartId) {
        const cart = await this.cartDao.findById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        cart.products = [];
        return await cart.save();
    }
}
