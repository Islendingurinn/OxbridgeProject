"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const validator_1 = require("../../../helpers/validator");
exports.default = {
    newUser: joi_1.default.object().keys({
        firstname: joi_1.default.string().required().min(3),
        lastname: joi_1.default.string().required().min(3),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required().min(6),
    }),
    updateUser: joi_1.default.object().keys({
        firstname: joi_1.default.string().required().min(3),
        lastname: joi_1.default.string().required().min(3),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required().min(6),
    }),
    userId: joi_1.default.object().keys({
        id: validator_1.JoiObjectId().required(),
    }),
    email: joi_1.default.object().keys({
        email: joi_1.default.string().email().required(),
    }),
};
//# sourceMappingURL=schema.js.map