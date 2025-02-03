import User from "../models/User.js"; 

export default class UserRepository {
    // Obtener un usuario por ID
    async getUserById(id) {
        const user = await User.findById(id); 
        return user ? user : null;      }

    // Obtener un usuario por correo electrónico
    async getUserByEmail(email) {
        const user = await User.findOne({ email }); 
        return user ? user : null;
    }

    // Crear un usuario
    async createUser(userData) {
        return await User.create(userData);
    }

    // Validar la contraseña del usuario
    async validatePassword(email, password) {
        const user = await this.getUserByEmail(email); 
        if (!user) {
            return false;  // Usuario no encontrado
        }
        return user.isValidPassword(password); 
    }
}
