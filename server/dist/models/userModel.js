"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserModel = exports.createUserModel = void 0;
// Create a functional model using closure
const createUserModel = () => {
    const users = new Map();
    const generateId = () => {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };
    const create = (userData) => {
        const user = {
            id: generateId(),
            ...userData,
            joinedAt: new Date(),
        };
        users.set(user.socketId, user);
        return user;
    };
    const findBySocketId = (socketId) => {
        return users.get(socketId);
    };
    const findById = (id) => {
        return Array.from(users.values()).find((user) => user.id === id);
    };
    const getAll = () => {
        return Array.from(users.values());
    };
    const deleteUser = (socketId) => {
        return users.delete(socketId);
    };
    const clear = () => {
        users.clear();
    };
    return {
        create,
        findBySocketId,
        findById,
        getAll,
        delete: deleteUser,
        clear,
    };
};
exports.createUserModel = createUserModel;
// Singleton instance using functional approach
let userModelInstance = null;
const getUserModel = () => {
    if (!userModelInstance) {
        userModelInstance = (0, exports.createUserModel)();
    }
    return userModelInstance;
};
exports.getUserModel = getUserModel;
//# sourceMappingURL=userModel.js.map