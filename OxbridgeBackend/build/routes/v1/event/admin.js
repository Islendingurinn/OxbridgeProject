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
  * Creates new event
  * Route: POST /admin/events/
  * Return: Event
  */
router.post('/', validator_1.default(schema_1.default.newEvent), asyncHandler_1.default(async (req, res) => {
    const createdEvent = await EventRepo_1.default.create({
        name: req.body.name,
        eventStart: req.body.eventStart,
        eventEnd: req.body.eventEnd,
        city: req.body.city,
        isLive: false,
    });
    new ApiResponse_1.SuccessResponse('Event created successfully', createdEvent).send(res);
}));
/**
  * Updates an existing event
  * Route: PUT /admin/events/:id
  * Return: Event
  */
router.put('/:id', validator_1.default(schema_1.default.eventId, validator_1.ValidationSource.PARAM), validator_1.default(schema_1.default.updateEvent), asyncHandler_1.default(async (req, res) => {
    const event = await EventRepo_1.default.findById(new mongoose_1.Types.ObjectId(req.params.id));
    if (event == null)
        throw new ApiError_1.BadRequestError('Event does not exist');
    if (req.body.name)
        event.name = req.body.name;
    if (req.body.eventStart)
        event.eventStart = req.body.eventStart;
    if (req.body.eventEnd)
        event.eventEnd = req.body.eventEnd;
    if (req.body.city)
        event.city = req.body.eventEnd;
    await EventRepo_1.default.update(event);
    new ApiResponse_1.SuccessResponse('Event updated successfully', event).send(res);
}));
/**
  * Sets event status to live
  * Route: PUT /admin/events/start/:id
  * Return: Event
  */
router.put('/start/:id', validator_1.default(schema_1.default.eventId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const event = await EventRepo_1.default.findById(new mongoose_1.Types.ObjectId(req.params.id));
    if (event == null)
        throw new ApiError_1.BadRequestError('Event does not exist');
    if (event.isLive == true)
        throw new ApiError_1.BadRequestError('Event is already live');
    event.isLive = true;
    event.actualEventStart = new Date();
    await EventRepo_1.default.update(event);
    new ApiResponse_1.SuccessResponse('Event has successfully been started', event).send(res);
}));
/**
  * Sets event status to not live
  * Route: PUT /admin/events/stop/:id
  * Return: Event
  */
router.put('/stop/:id', validator_1.default(schema_1.default.eventId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const event = await EventRepo_1.default.findById(new mongoose_1.Types.ObjectId(req.params.id));
    if (event == null)
        throw new ApiError_1.BadRequestError('Event does not exist');
    if (event.isLive == false)
        throw new ApiError_1.BadRequestError('Event is already not live');
    event.isLive = false;
    await EventRepo_1.default.update(event);
    new ApiResponse_1.SuccessResponse('Event has successfully been stopped', event).send(res);
}));
/**
  * Deletes an event
  * Route: DELETE /admin/events/:id
  * Return:
  */
router.delete('/:id', validator_1.default(schema_1.default.eventId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const event = await EventRepo_1.default.findById(new mongoose_1.Types.ObjectId(req.params.id));
    if (event == null)
        throw new ApiError_1.BadRequestError('Event does not exist');
    await EventRepo_1.default.delete(event);
    return new ApiResponse_1.SuccessMsgResponse('Event deleted successfully').send(res);
}));
exports.default = router;
//# sourceMappingURL=admin.js.map