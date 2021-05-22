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
const ShipRepo_1 = __importDefault(require("../../../database/repository/ShipRepo"));
const UserRepo_1 = __importDefault(require("../../../database/repository/UserRepo"));
const LocationRegistrationRepo_1 = __importDefault(require("../../../database/repository/LocationRegistrationRepo"));
const router = express_1.default.Router();
/**
  * Gets all location registrations
  * Route: GET /locationRegistrations/
  * Return: LocationRegistration[]
  */
router.get('/', asyncHandler_1.default(async (req, res) => {
    const locations = await LocationRegistrationRepo_1.default.findAll();
    return new ApiResponse_1.SuccessResponse('success', locations).send(res);
}));
/**
  * Retrieve location registrations from an event
  * Route: GET /locationRegistrations/fromEvent/:id
  * Return: ShipLocation[] (anonymous object with
  * LocationRegistration[] and EventRegistration fields)
  */
router.get('/fromEvent/:id', validator_1.default(schema_1.default.eventId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const eventRegistrations = await EventRegistrationRepo_1.default.findByEvent(new mongoose_1.Types.ObjectId(req.params.id));
    if (eventRegistrations.length == 0)
        throw new ApiError_1.NoDataError('Event does not have registrations');
    let shipLocations = [];
    for (const registration of eventRegistrations) {
        const locations = await LocationRegistrationRepo_1.default.findByEventRegistration(registration._id);
        shipLocations.push({
            "locationsRegistrations": locations,
            "color": registration.trackColor,
            "shipId": registration.shipId,
            "teamName": registration.teamName,
            "placement": -1,
        });
    }
    if (shipLocations[0].locationsRegistrations[0].raceScore != 0)
        shipLocations.sort((a, b) => (a.locationsRegistrations[0].raceScore >= b.locationsRegistrations[0].raceScore) ? -1 : 1);
    else
        shipLocations.sort((a, b) => (a.shipId > b.shipId) ? 1 : -1);
    for (var i = 0; i < shipLocations.length; i++)
        shipLocations[i].placement = i + 1;
    new ApiResponse_1.SuccessResponse('success', shipLocations).send(res);
}));
/**
  * Retrieve scoreboard from an event
  * Route: GET /locationRegistrations/scoreboard/fromEvent/:id
  * Return: Score[] (anonymous object with LocationRegistration[],
  * EventRegistration, Ship and User fields)
  */
router.get('/scoreboard/fromEvent/:id', validator_1.default(schema_1.default.eventId), asyncHandler_1.default(async (req, res) => {
    const eventRegistrations = await EventRegistrationRepo_1.default.findByEvent(new mongoose_1.Types.ObjectId(req.params.id));
    if (eventRegistrations.length == 0)
        throw new ApiError_1.NoDataError('Event does not have registrations');
    let scores = [];
    for (const registration of eventRegistrations) {
        const locationRegistrations = await LocationRegistrationRepo_1.default.findByEventRegistration(registration._id);
        const ship = await ShipRepo_1.default.findById(registration.shipId);
        if (!ship)
            continue;
        const user = await UserRepo_1.default.findById(ship.userId);
        if (!user)
            continue;
        scores.push({
            "locationsRegistrations": locationRegistrations,
            "color": registration.trackColor,
            "shipId": registration.shipId,
            "shipName": ship.name,
            "teamName": registration.teamName,
            "owner": user.firstname + " " + user.lastname,
            "placement": 0,
        });
    }
    if (scores[0].locationsRegistrations[0].raceScore != 0)
        scores.sort((a, b) => (a.locationsRegistrations[0].raceScore >= b.locationsRegistrations[0].raceScore) ? -1 : 1);
    else
        scores.sort((a, b) => (a.shipId > b.shipId) ? 1 : -1);
    for (var i = 0; i < scores.length; i++)
        scores[i].placement = i + 1;
    new ApiResponse_1.SuccessResponse('success', scores).send(res);
}));
/**
  * Creates a new location registration
  * Route: POST /locationRegistrations/
  * Return: LocationRegistration
  */
router.post('/', validator_1.default(schema_1.default.newLocationRegistration), asyncHandler_1.default(async (req, res) => {
    const createdLocationRegistration = await LocationRegistrationRepo_1.default.create({
        eventRegId: req.body.eventRegId,
        racePointId: req.body.racePointId,
        longtitude: req.body.longtitude,
        latitude: req.body.latitude,
        raceScore: req.body.raceScore,
        finishTime: req.body.finishTime,
    });
    new ApiResponse_1.SuccessResponse('Location registration created successfully', createdLocationRegistration).send(res);
}));
/**
  * Deletes location registrations from event registration id
  * Route: DELETE /locationRegistrations/fromEventRegistration/:id
  * Return:
  */
router.delete('/fromEventRegistration/:id', validator_1.default(schema_1.default.eventRegistrationId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const registration = await EventRegistrationRepo_1.default.findById(req.body.id);
    if (!registration)
        throw new ApiError_1.BadRequestError('Event registration does not exist');
    await LocationRegistrationRepo_1.default.deleteFromEventRegistration(req.body.id);
    return new ApiResponse_1.SuccessMsgResponse('Location registrations deleted successfully').send(res);
}));
exports.default = router;
//# sourceMappingURL=user.js.map