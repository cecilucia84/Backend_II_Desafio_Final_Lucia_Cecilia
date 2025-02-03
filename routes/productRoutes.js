import express from 'express';
import { authorize } from '../middlewares/auth.js';
import passport from 'passport';

const router = express.Router();

// 🔹 Solo un administrador puede crear un producto
router.post('/', passport.authenticate('current', { session: false }), authorize(['admin']), async (req, res) => {
    try {
        // Lógica para crear un producto...
        res.status(201).json({ message: 'Producto creado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
