import User from '../models/User.js'; 

export default class UserRepository {
    async getUserById(id) {
        const user = await User.findById(id); 
        return user ? user : null;
    }

    async getUserByEmail(email) {
        const user = await User.findOne({ email }); 
        return user ? user : null;
    }

    async createUser(userData) {
        return await User.create(userData);
    }  

    async validatePassword(email, password) {
        const user = await this.getUserByEmail(email); 
        if (!user) return false;
        return user.validatePassword(password); 
    }
}