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
const authUtils_1 = require("../../../auth/authUtils");
const JWT_1 = __importDefault(require("../../../core/JWT"));
const ApiError_2 = require("../../../core/ApiError");
const ShipRepo_1 = __importDefault(require("../../../database/repository/ShipRepo"));
const UserRepo_1 = __importDefault(require("../../../database/repository/UserRepo"));
const EmailConfirmation_1 = __importDefault(require("../../../mail/EmailConfirmation"));
const router = express_1.default.Router();
/**
  * Gets all event registrations
  * Route: GET /eventRegistrations/
  * Return: EventRegistration[]
  */
router.get('/', asyncHandler_1.default(async (req, res) => {
    const registrations = await EventRegistrationRepo_1.default.findAll();
    return new ApiResponse_1.SuccessResponse('success', registrations).send(res);
}));
/**
  * Gets all participants/event registrations of an event
  * Route: GET /eventRegistrations/participants/fromEvent/:id
  * Return: Participant[] (anonymous object with User, Ship fields)
  */
router.get('/participants/fromEvent/:id', validator_1.default(schema_1.default.eventId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const eventRegistrations = await EventRegistrationRepo_1.default.findByEvent(new mongoose_1.Types.ObjectId(req.params.id));
    if (!eventRegistrations)
        throw new ApiError_1.NoDataError('Event does not have any registrations');
    let participants = [];
    for (const registration of eventRegistrations) {
        const ship = await ShipRepo_1.default.findById(registration.shipId);
        if (!ship)
            continue;
        const user = await UserRepo_1.default.findByIdSecured(ship.userId);
        if (!user)
            continue;
        participants.push({ user, ship });
    }
    return new ApiResponse_1.SuccessResponse('success', participants).send(res);
}));
/**
  * Gets all event registrations by event the
  * user is registered to.
  * Route: GET /eventRegistrations/mine/fromEvent/:id
  * Return: EventRegistration[]
  */
router.get('/mine/fromEvent/:id', validator_1.default(schema_1.default.eventId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    //Retrieve the payload from the authentication header
    req.accessToken = authUtils_1.getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase
    const payload = await JWT_1.default.validate(req.accessToken);
    //Retrieve the user from the user id in the payload
    const user = await UserRepo_1.default.findById(new mongoose_1.Types.ObjectId(payload.sub));
    if (!user)
        throw new ApiError_2.AuthFailureError('User not registered');
    req.user = user;
    //Retrieve the ships the user has registered
    const ships = await ShipRepo_1.default.findByUser(user._id);
    if (!ships)
        throw new ApiError_1.NoDataError('User does not have any ships registered');
    //Retreive the event registrations assosciated with the ships
    let eventRegistrations = [];
    for (const ship of ships) {
        const registrations = await EventRegistrationRepo_1.default.findByShipAndEvent(ship._id, new mongoose_1.Types.ObjectId(req.params.id));
        eventRegistrations.concat(registrations);
    }
    if (eventRegistrations)
        throw new ApiError_1.NoDataError('User is not associated with any event registrations');
    return new ApiResponse_1.SuccessResponse('success', eventRegistrations).send(res);
}));
/**
  * Creates a new event registration
  * Route: POST /eventRegistrations/
  * Return: EventRegistration
  */
router.post('/', validator_1.default(schema_1.default.newEventRegistration), asyncHandler_1.default(async (req, res) => {
    const createdEventRegistration = await EventRegistrationRepo_1.default.create({
        shipId: req.body.shipId,
        eventId: req.body.eventId,
        trackColor: req.body.trackColor,
        teamName: req.body.teamName,
    });
    new EmailConfirmation_1.default(req.body.shipId, req.body.eventId);
    new ApiResponse_1.SuccessResponse('Event registration created successfully', createdEventRegistration).send(res);
}));
exports.default = router;
//# sourceMappingURL=user.js.map