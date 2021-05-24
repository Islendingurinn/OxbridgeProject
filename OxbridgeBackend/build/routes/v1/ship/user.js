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
const router = express_1.default.Router();
/**
  * Gets all registered ships
  * Route: GET /ships/
  * Return: Ship[]
  */
router.get('/', asyncHandler_1.default(async (req, res) => {
    const ships = await ShipRepo_1.default.findAll();
    return new ApiResponse_1.SuccessResponse('success', ships).send(res);
}));
/**
  * Gets a registered ship
  * Route: GET /ships/:id
  * Return: Ship
  */
router.get('/:id', validator_1.default(schema_1.default.shipId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const ship = await ShipRepo_1.default.findById(req.body.id);
    if (!ship)
        throw new ApiError_1.NoDataError('No ship with this id');
    return new ApiResponse_1.SuccessResponse('success', ship).send(res);
}));
/**
  * Gets all ships of the user
  * Route: GET /ships/mine
  * Return: Ship[]
  */
router.get('/mine', asyncHandler_1.default(async (req, res) => {
    //Retrieve the payload from the authorization header
    req.accessToken = authUtils_1.getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase
    const payload = await JWT_1.default.validate(req.accessToken);
    //Find the user from the user id in the payload
    const user = await UserRepo_1.default.findById(new mongoose_1.Types.ObjectId(payload.sub));
    if (!user)
        throw new ApiError_2.AuthFailureError('User not registered');
    req.user = user;
    //Find user ships from user id
    const ships = await ShipRepo_1.default.findByUser(user._id);
    if (!ships)
        throw new ApiError_1.NoDataError('User does not have any ships registered');
    return new ApiResponse_1.SuccessResponse('success', ships).send(res);
}));
/**
  * Gets all registered ships in an event
  * Route: GET /ships/fromEvent/:id
  * Return: Ship[] (anonymous object with Ship fields
  * and teamName from EventRegistration)
  */
router.get('/fromEvent/:id', validator_1.default(schema_1.default.eventId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const registrations = await EventRegistrationRepo_1.default.findByEvent(req.body.id);
    if (!registrations)
        throw new ApiError_1.NoDataError('No event registrations');
    let ships = [];
    for (const registration of registrations) {
        const ship = await ShipRepo_1.default.findById(registration.shipId);
        if (!ship)
            continue;
        ships.push({
            "shipId": ship._id,
            "name": ship.name,
            "teamName": registration.teamName,
        });
    }
    return new ApiResponse_1.SuccessResponse('success', ships).send(res);
}));
/**
  * Creates a new ship
  * Route: POST /ships/
  * Return: Ship
  */
router.post('/', validator_1.default(schema_1.default.newShip), asyncHandler_1.default(async (req, res) => {
    const createdShip = await ShipRepo_1.default.create({
        userId: req.body.userId,
        name: req.body.name,
    });
    new ApiResponse_1.SuccessResponse('Ship created successfully', createdShip).send(res);
}));
/**
  * Updates an existing ship
  * Route: PUT /ships/:id
  * Return: Ship
  */
router.put('/:id', validator_1.default(schema_1.default.shipId, validator_1.ValidationSource.PARAM), validator_1.default(schema_1.default.updateShip), asyncHandler_1.default(async (req, res) => {
    const ship = await ShipRepo_1.default.findById(new mongoose_1.Types.ObjectId(req.params.id));
    if (ship == null)
        throw new ApiError_1.BadRequestError('Ship does not exist');
    if (req.body.userId)
        ship.userId = req.body.userId;
    if (req.body.name)
        ship.name = req.body.name;
    await ShipRepo_1.default.update(ship);
    new ApiResponse_1.SuccessResponse('Ship updated successfully', ship).send(res);
}));
/**
  * Deletes an existing ship
  * Route: DELETE /ships/:id
  * Return:
  */
router.delete('/:id', validator_1.default(schema_1.default.eventId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const ship = await ShipRepo_1.default.findById(new mongoose_1.Types.ObjectId(req.params.id));
    if (ship == null)
        throw new ApiError_1.BadRequestError('Ship does not exist');
    await ShipRepo_1.default.delete(ship);
    return new ApiResponse_1.SuccessMsgResponse('Ship deleted successfully').send(res);
}));
exports.default = router;
//# sourceMappingURL=user.js.map