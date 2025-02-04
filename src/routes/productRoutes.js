import express from 'express';
import passport from 'passport';
import { authorize } from '../middlewares/auth.js';
import ProductRepository from '../repositories/ProductRepository.js';

const router = express.Router();
const productRepository = new ProductRepository();

router.post('/', passport.authenticate('current', { session: false }), authorize(['admin']), async (req, res) => {
    try {
        const product = await productRepository.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;