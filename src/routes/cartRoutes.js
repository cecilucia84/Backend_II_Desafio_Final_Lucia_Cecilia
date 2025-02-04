import express from 'express'; 
import { authorize } from '../middlewares/auth.js';  
import Cart from '../models/Cart.js'; 
import Ticket from '../models/Ticket.js';

const router = express.Router();


router.post("/:cid/purchase", authorize(["user"]), async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate("products.product");
        if (!cart) return res.status(404).json({ message: "Carrito no encontrado" });

        let totalAmount = 0;
        const purchasedProducts = [];
        const notPurchasedProducts = [];

        for (const item of cart.products) {
            if (item.product.stock >= item.quantity) {
                item.product.stock -= item.quantity;
                await item.product.save();
                
                totalAmount += item.product.price * item.quantity;
                purchasedProducts.push(item.product._id);
            } else {
                notPurchasedProducts.push(item.product._id);
            }
        }

        if (purchasedProducts.length > 0) {
            const ticket = await Ticket.create({
                code: `TCK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                amount: totalAmount,
                purchaser: req.user.email,
            });

            cart.products = cart.products.filter(p => notPurchasedProducts.includes(p.product._id));
            await cart.save();

            return res.json({ ticket, notPurchasedProducts });
        }

        res.status(400).json({ message: "No se pudieron comprar productos", notPurchasedProducts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;