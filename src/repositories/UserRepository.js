import UserDao from "../dao/UserDao.js";
import UserDTO from "../dto/UserDTO.js";

export default class UserRepository {
    constructor() {
        this.userDao = new UserDao();
    }

    async getUserById(id) {
        const user = await this.userDao.findById(id);
        return user ? new UserDTO(user) : null;
    }

    async getUserByEmail(email) {
        const user = await this.userDao.findByEmail(email);
        return user ? new UserDTO(user) : null;
    }

    async createUser(userData) {
        return await this.userDao.createUser(userData);
    }
}
