import User from "../models/User.js";

export default class UserDao {
    async findById(id) {
        return await User.findById(id);
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async createUser(userData) {
        return await User.create(userData);
    }
}
