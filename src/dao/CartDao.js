import Cart from '../models/Cart.js';

export default class CartDao {
    async findById(id) {
        return await Cart.findById(id).populate("products.product");
    } catch (error) {
        console.error("Error al buscar el carrito:", error);
        throw new Error("No se pudo obtener el carrito");
    }

    async create(cartData) {
        return await Cart.create(cartData);
    }

    async update(id, updateData) {
        return await Cart.findByIdAndUpdate(id, updateData, { new: true });
    }
}