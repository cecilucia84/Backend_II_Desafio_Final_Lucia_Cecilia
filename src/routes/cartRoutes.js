import express from 'express'; 
import { authorize } from '../middlewares/auth.js';  
import Cart from '../models/Cart.js'; 
import Ticket from '../models/Ticket.js';

const router = express.Router();

// Ruta para procesar la compra del carrito
router.post("/:cid/purchase", authorize(["user"]), async (req, res) => {
    try {
        // Buscar el carrito por ID y poblar los productos
        const cart = await Cart.findById(req.params.cid).populate("products.product");
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        let totalAmount = 0;
        const purchasedProducts = [];
        const notPurchasedProducts = [];

        // Procesar cada producto en el carrito
        for (const item of cart.products) {
            if (item.product.stock >= item.quantity) {
                // Actualizar el stock del producto
                item.product.stock -= item.quantity;
                await item.product.save();
                
                // Calcular el monto total
                totalAmount += item.product.price * item.quantity;
                purchasedProducts.push(item.product._id);
            } else {
                notPurchasedProducts.push(item.product._id);
            }
        }

        // Si se compraron productos, generar un ticket
        if (purchasedProducts.length > 0) {
            const ticket = await Ticket.create({
                code: `TCK-${Date.now()}`,  // Generar código de ticket único
                amount: totalAmount,
                purchaser: req.user.email,  // Usar el email del usuario logueado
            });

            // Eliminar los productos no comprados del carrito
            cart.products = cart.products.filter(p => notPurchasedProducts.includes(p.product._id));
            await cart.save();

            // Responder con el ticket y los productos no comprados
            return res.json({ ticket, notPurchasedProducts });
        }

        // Si no se pudieron comprar productos, responder con un mensaje
        res.status(400).json({ message: "No se pudieron comprar productos", notPurchasedProducts });
    } catch (error) {
    
        res.status(500).json({ error: error.message });
    }
});

export default router; 
