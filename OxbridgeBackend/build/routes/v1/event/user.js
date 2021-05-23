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
const EventRepo_1 = __importDefault(require("../../../database/repository/EventRepo"));
const UserRepo_1 = __importDefault(require("../../../database/repository/UserRepo"));
const mongoose_1 = require("mongoose");
const validator_1 = __importStar(require("../../../helpers/validator"));
const schema_1 = __importDefault(require("./schema"));
const asyncHandler_1 = __importDefault(require("../../../helpers/asyncHandler"));
const RacePointRepo_1 = __importDefault(require("../../../database/repository/RacePointRepo"));
const authUtils_1 = require("../../../auth/authUtils");
const JWT_1 = __importDefault(require("../../../core/JWT"));
const ApiError_2 = require("../../../core/ApiError");
const ShipRepo_1 = __importDefault(require("../../../database/repository/ShipRepo"));
const EventRegistrationRepo_1 = __importDefault(require("../../../database/repository/EventRegistrationRepo"));
const router = express_1.default.Router();
/**
  * Gets all events
  * Route: GET /events/
  * Return: Event[]
  */
router.get('/', asyncHandler_1.default(async (req, res) => {
    const events = await EventRepo_1.default.findAll();
    return new ApiResponse_1.SuccessResponse('success', events).send(res);
}));
/**
  * Get an event by id
  * Route: GET /events/:id
  * Return: Event
  */
router.get('/:id', validator_1.default(schema_1.default.eventId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const event = await EventRepo_1.default.findById(new mongoose_1.Types.ObjectId(req.params.id));
    if (!event)
        throw new ApiError_1.NoDataError();
    return new ApiResponse_1.SuccessResponse('success', event).send(res);
}));
/**
  * Sees if an event has a racepoint route
  * Route: GET /events/:id/hasRoute/
  * Return: Boolean
  */
router.get('/:id/hasRoute', validator_1.default(schema_1.default.eventId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const event = await EventRepo_1.default.findById(new mongoose_1.Types.ObjectId(req.params.id));
    if (!event)
        throw new ApiError_1.NoDataError();
    const racepoints = await RacePointRepo_1.default.findByEvent(new mongoose_1.Types.ObjectId(req.params.id));
    let result = false;
    if (racepoints.length !== 0)
        result = true;
    return new ApiResponse_1.SuccessResponse('success', result).send(res);
}));
/**
  * Gets all events a user participates in
  * Route: GET /events/mine
  * Return: Event[]
  */
router.get('/mine', asyncHandler_1.default(async (req, res) => {
    //Retrieve the payload from the current authentication tokens
    req.accessToken = authUtils_1.getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase
    const payload = await JWT_1.default.validate(req.accessToken);
    //Find the user from the user id in the payload
    const user = await UserRepo_1.default.findById(new mongoose_1.Types.ObjectId(payload.sub));
    if (!user)
        throw new ApiError_2.AuthFailureError('User not registered');
    req.user = user;
    //Find the ships the user has registered
    const ships = await ShipRepo_1.default.findByUser(user._id);
    if (!ships)
        throw new ApiError_1.NoDataError('User does not have any ships registered');
    //Find the event registrations the ships are participants of
    let eventRegistrations = [];
    for (const ship of ships) {
        const registrations = await EventRegistrationRepo_1.default.findByShip(ship._id);
        eventRegistrations.concat(registrations);
    }
    if (!eventRegistrations)
        throw new ApiError_1.NoDataError('User does not have any event registrations');
    //Find the corresponding events from the event registrations
    let events = [];
    for (const registration of eventRegistrations) {
        const event = await EventRepo_1.default.findById(registration.eventId);
        if (event)
            events.push(event);
    }
    if (!events)
        throw new ApiError_1.NoDataError('User is not associated with any events');
    return new ApiResponse_1.SuccessResponse('success', events).send(res);
}));
exports.default = router;
//# sourceMappingURL=user.js.map