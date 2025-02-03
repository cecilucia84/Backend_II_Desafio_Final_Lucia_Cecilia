import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as CustomStrategy } from 'passport-custom';
import jwt from 'jsonwebtoken';
import UserDao from '../dao/UserDao.js';
import UserDTO from '../dto/UserDTO.js';

const userDao = new UserDao();

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'your_secret_key',
};

// 🔹 Estrategia JWT para autenticación con Bearer Token
passport.use(
  new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      const user = await userDao.findById(jwtPayload.id);
      if (user) return done(null, new UserDTO(user));
      return done(null, false, { message: 'Usuario no encontrado' });
    } catch (error) {
      return done(error, false);
    }
  })
);

// 🔹 Estrategia personalizada para autenticación con cookies
passport.use(
  'current',
  new CustomStrategy(async (req, done) => {
    try {
      const token = req.cookies.token;
      if (!token) return done(null, false, { message: 'Token no encontrado' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
      const user = await userDao.findById(decoded.id);

      if (user) return done(null, new UserDTO(user));
      return done(null, false, { message: 'Usuario no encontrado' });
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;
