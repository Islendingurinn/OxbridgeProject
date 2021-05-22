"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const validator_1 = require("../../../helpers/validator");
exports.default = {
    newLocationRegistration: joi_1.default.object().keys({
        eventRegId: validator_1.JoiObjectId().required(),
        racePointId: validator_1.JoiObjectId().required(),
        longtitude: joi_1.default.number().required(),
        latitude: joi_1.default.number().required(),
        raceScore: joi_1.default.number().required(),
        finishTime: joi_1.default.date().required(),
    }),
    updateLocationRegistration: joi_1.default.object().keys({
        eventRegId: validator_1.JoiObjectId().required(),
        racePointId: validator_1.JoiObjectId().required(),
        locationTime: joi_1.default.date().required(),
        longtitude: joi_1.default.number().required(),
        latitude: joi_1.default.number().required(),
        raceScore: joi_1.default.number().required(),
        finishTime: joi_1.default.date().required(),
    }),
    locationRegistrationId: joi_1.default.object().keys({
        id: validator_1.JoiObjectId().required(),
    }),
    eventId: joi_1.default.object().keys({
        id: validator_1.JoiObjectId().required(),
    }),
    eventRegistrationId: joi_1.default.object().keys({
        id: validator_1.JoiObjectId().required(),
    }),
};
//# sourceMappingURL=schema.js.map