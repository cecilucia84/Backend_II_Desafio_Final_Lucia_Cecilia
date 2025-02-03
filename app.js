import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import path from 'path';
import sessionRoutes from './src/routes/sessionRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import './src/config/passport.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_NAME;

// Configuración de Handlebars
app.engine(
  'handlebars',
  engine({
    defaultLayout: 'main',
    layoutsDir: path.resolve('views/layouts'),
    partialsDir: path.resolve('views/partials'),
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.resolve('views'));

// Middlewares
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(passport.initialize());

// Conexión a MongoDB
mongoose.connect(uri, { dbName })
  .then(() => console.log('Conectado correctamente a MongoDB'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Rutas de API
app.use('/api/sessions', sessionRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.render('home', { title: 'Inicio', user: req.user || null }); 
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
