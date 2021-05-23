"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const validator_1 = require("../../../helpers/validator");
exports.default = {
    newShip: joi_1.default.object().keys({
        userId: validator_1.JoiObjectId().required(),
        name: joi_1.default.string().required().min(3),
    }),
    updateShip: joi_1.default.object().keys({
        userId: validator_1.JoiObjectId().required(),
        name: joi_1.default.string().required().min(3),
    }),
    shipId: joi_1.default.object().keys({
        id: validator_1.JoiObjectId().required(),
    }),
    eventId: joi_1.default.object().keys({
        id: validator_1.JoiObjectId().required(),
    }),
};
//# sourceMappingURL=schema.js.map