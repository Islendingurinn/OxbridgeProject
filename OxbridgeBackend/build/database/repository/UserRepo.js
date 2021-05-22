"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../model/User");
const Role_1 = require("../model/Role");
const ApiError_1 = require("../../core/ApiError");
const KeystoreRepo_1 = __importDefault(require("./KeystoreRepo"));
class UserRepo {
    static async findAll() {
        return User_1.UserModel.find({})
            .select("-password")
            .lean()
            .exec();
    }
    // contains critical information of the user
    static async findById(id) {
        return User_1.UserModel.findOne({ _id: id })
            .populate({
            path: 'roles',
        })
            .lean()
            .exec();
    }
    static async findByIdSecured(id) {
        return User_1.UserModel.findOne({ _id: id })
            .select("-password")
            .populate({
            path: 'roles',
        })
            .lean()
            .exec();
    }
    static async findByEmailusername(emailUsername) {
        return User_1.UserModel.findOne({ emailUsername: emailUsername })
            .select("-password")
            .populate({
            path: 'roles',
        })
            .lean()
            .exec();
    }
    static async create(user, accessTokenKey, refreshTokenKey, roleCode) {
        const now = new Date();
        const role = await Role_1.RoleModel.findOne({ code: roleCode })
            .lean()
            .exec();
        if (!role)
            throw new ApiError_1.InternalError('Role must be defined');
        user.roles = [role._id];
        const createdUser = await User_1.UserModel.create(user);
        const keystore = await KeystoreRepo_1.default.create(createdUser._id, accessTokenKey, refreshTokenKey);
        return { user: createdUser.toObject(), keystore: keystore };
    }
    static async update(user, accessTokenKey, refreshTokenKey) {
        await User_1.UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
            .lean()
            .exec();
        const keystore = await KeystoreRepo_1.default.create(user._id, accessTokenKey, refreshTokenKey);
        return { user: user, keystore: keystore };
    }
    static async updateInfo(user) {
        return User_1.UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
            .lean()
            .exec();
    }
}
exports.default = UserRepo;
//# sourceMappingURL=UserRepo.js.map