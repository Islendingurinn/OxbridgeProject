"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const validator_1 = require("../../../helpers/validator");
exports.default = {
    newEvent: joi_1.default.object().keys({
        name: joi_1.default.string().required().min(3),
        eventStart: joi_1.default.date().required(),
        eventEnd: joi_1.default.date().required(),
        city: joi_1.default.string().required().min(3),
    }),
    updateEvent: joi_1.default.object().keys({
        name: joi_1.default.string().required().min(3),
        eventStart: joi_1.default.date().required(),
        eventEnd: joi_1.default.date().required(),
        city: joi_1.default.string().required().min(3),
    }),
    eventId: joi_1.default.object().keys({
        id: validator_1.JoiObjectId().required(),
    }),
};
//# sourceMappingURL=schema.js.map