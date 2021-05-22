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
const validator_1 = __importStar(require("../../../helpers/validator"));
const schema_1 = __importDefault(require("./schema"));
const asyncHandler_1 = __importDefault(require("../../../helpers/asyncHandler"));
const authentication_1 = __importDefault(require("../../../auth/authentication"));
const authorization_1 = __importDefault(require("../../../auth/authorization"));
const role_1 = __importDefault(require("../../../helpers/role"));
const RacePointRepo_1 = __importDefault(require("../../../database/repository/RacePointRepo"));
const router = express_1.default.Router();
// Below all APIs are private APIs protected for Access Token and Admin's Role
router.use('/', authentication_1.default, role_1.default("ADMIN" /* ADMIN */), authorization_1.default);
// ---------------------------------------------------------------------------
/**
  * Creates new racepoint based on an event
  * Route: POST /admin/racepoints/fromEvent/:id
  * Return: RacePoint
  */
router.post('/fromEvent/:id', validator_1.default(schema_1.default.eventId, validator_1.ValidationSource.PARAM), validator_1.default(schema_1.default.newRacepoint), asyncHandler_1.default(async (req, res) => {
    const createdRacepoint = await RacePointRepo_1.default.create({
        type: req.body.type,
        firstLongtitude: req.body.firstLongtitude,
        firstLatitude: req.body.firstLatitude,
        secondLongtitude: req.body.secondLongtitude,
        secondLatitude: req.body.secondLatitude,
        eventId: req.body.eventId,
    });
    new ApiResponse_1.SuccessResponse('Racepoint created successfully', createdRacepoint).send(res);
}));
/**
  * Deletes a racepoint based on an event
  * Route: DELETE /admin/racepoints/fromEvent:id
  * Return:
  */
router.delete('/fromEvent/:id', validator_1.default(schema_1.default.eventId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    await RacePointRepo_1.default.deleteByEvent(req.body.id);
    return new ApiResponse_1.SuccessMsgResponse('Racepoints deleted successfully').send(res);
}));
exports.default = router;
//# sourceMappingURL=admin.js.map