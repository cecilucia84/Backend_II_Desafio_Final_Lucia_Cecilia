import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import UserRepository from '../repositories/UserRepository.js';

const router = express.Router();
const userRepository = new UserRepository();

// 🔹 Registro de usuario
router.post('/register', async (req, res) => {
    try {
        await userRepository.createUser(req.body);
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 🔹 Login de usuario
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) return res.status(401).json({ message: 'Email o contraseña inválidos' });

        const isValidPassword = await userRepository.validatePassword(email, password);
        if (!isValidPassword) return res.status(401).json({ message: 'Email o contraseña inválidos' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 Obtener usuario actual 
router.get('/current', passport.authenticate('current', { session: false }), (req, res) => {
    res.json({ user: req.user });
});

// 🔹 Cerrar sesión
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Sesión cerrada correctamente' });
});

export default router;
