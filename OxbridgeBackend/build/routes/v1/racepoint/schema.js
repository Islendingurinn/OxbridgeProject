"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const validator_1 = require("../../../helpers/validator");
exports.default = {
    newRacepoint: joi_1.default.object().keys({
        type: joi_1.default.string().required(),
        firstLongtitude: joi_1.default.number().required(),
        firstLatitude: joi_1.default.number().required(),
        secondLongtitude: joi_1.default.number().required(),
        secondLatitude: joi_1.default.number().required(),
        eventId: validator_1.JoiObjectId().required(),
    }),
    eventId: joi_1.default.object().keys({
        id: validator_1.JoiObjectId().required(),
    }),
};
//# sourceMappingURL=schema.js.map