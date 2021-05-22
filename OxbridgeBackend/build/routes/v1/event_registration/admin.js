"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ApiResponse_1 = require("../../../core/ApiResponse");
const ApiError_1 = require("../../../core/ApiError");
const EventRegistrationRepo_1 = __importDefault(require("../../../database/repository/EventRegistrationRepo"));
const mongoose_1 = require("mongoose");
const validator_1 = __importStar(require("../../../helpers/validator"));
const schema_1 = __importDefault(require("./schema"));
const asyncHandler_1 = __importDefault(require("../../../helpers/asyncHandler"));
const authentication_1 = __importDefault(require("../../../auth/authentication"));
const authorization_1 = __importDefault(require("../../../auth/authorization"));
const role_1 = __importDefault(require("../../../helpers/role"));
const router = express_1.default.Router();
// Below all APIs are private APIs protected for Access Token and Admin's Role
router.use('/', authentication_1.default, role_1.default("ADMIN" /* ADMIN */), authorization_1.default);
// ---------------------------------------------------------------------------
/**
  * Update an event registration by id
  * Route: PUT /admin/eventRegistrations/:id
  * Return: EventRegistration
  */
router.put('/:id', validator_1.default(schema_1.default.eventRegistrationId, validator_1.ValidationSource.PARAM), validator_1.default(schema_1.default.updateEventRegistration), asyncHandler_1.default(async (req, res) => {
    const registration = await EventRegistrationRepo_1.default.findById(new mongoose_1.Types.ObjectId(req.params.id));
    if (registration == null)
        throw new ApiError_1.BadRequestError('Event registration does not exist');
    if (req.body.shipId)
        registration.shipId = req.body.shipId;
    if (req.body.eventId)
        registration.eventId = req.body.eventId;
    if (req.body.trackColor)
        registration.trackColor = req.body.trackColor;
    if (req.body.teamName)
        registration.teamName = req.body.teamName;
    await EventRegistrationRepo_1.default.update(registration);
    new ApiResponse_1.SuccessResponse('Event registration updated successfully', registration).send(res);
}));
/**
  * Delete an event registration by id
  * Route: DELETE /admin/eventRegistrations/:id
  * Return:
  */
router.delete('/:id', validator_1.default(schema_1.default.eventRegistrationId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const eventRegistration = await EventRegistrationRepo_1.default.findById(new mongoose_1.Types.ObjectId(req.params.id));
    if (eventRegistration == null)
        throw new ApiError_1.BadRequestError('Event registration does not exist');
    await EventRegistrationRepo_1.default.delete(eventRegistration);
    return new ApiResponse_1.SuccessMsgResponse('Event registration deleted successfully').send(res);
}));
exports.default = router;
//# sourceMappingURL=admin.js.map