"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
class UserModel {
    constructor() {
        this.users = new Map();
    }
    static getInstance() {
        if (!UserModel.instance) {
            UserModel.instance = new UserModel();
        }
        return UserModel.instance;
    }
    create(userData) {
        const user = {
            id: this.generateId(),
            ...userData,
            joinedAt: new Date(),
        };
        this.users.set(user.socketId, user);
        return user;
    }
    findBySocketId(socketId) {
        return this.users.get(socketId);
    }
    findById(id) {
        return Array.from(this.users.values()).find((user) => user.id === id);
    }
    getAll() {
        return Array.from(this.users.values());
    }
    delete(socketId) {
        return this.users.delete(socketId);
    }
    clear() {
        this.users.clear();
    }
    generateId() {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map