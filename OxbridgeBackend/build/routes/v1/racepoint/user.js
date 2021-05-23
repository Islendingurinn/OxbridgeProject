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
const mongoose_1 = require("mongoose");
const validator_1 = __importStar(require("../../../helpers/validator"));
const schema_1 = __importDefault(require("./schema"));
const asyncHandler_1 = __importDefault(require("../../../helpers/asyncHandler"));
const RacePointRepo_1 = __importDefault(require("../../../database/repository/RacePointRepo"));
const router = express_1.default.Router();
/**
  * Gets all racepoints in an event
  * Route: GET /racepoints/fromEvent/:id
  * Return: RacePoint[]
  */
router.get('/fromEvent/:id', validator_1.default(schema_1.default.eventId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const racepoints = await RacePointRepo_1.default.findByEvent(new mongoose_1.Types.ObjectId(req.params.id));
    if (!racepoints)
        throw new ApiError_1.NoDataError();
    return new ApiResponse_1.SuccessResponse('success', racepoints).send(res);
}));
/**
  * Gets start, finish racepoints in an event
  * Route: GET /racepoints/startAndFinish/fromEvent/:id
  * Return: RacePoint[]
  */
router.get('/startAndFinish/fromEvent/:id', validator_1.default(schema_1.default.eventId, validator_1.ValidationSource.PARAM), asyncHandler_1.default(async (req, res) => {
    const racepoints = await RacePointRepo_1.default.findStartAndFinish(new mongoose_1.Types.ObjectId(req.params.id));
    if (!racepoints)
        throw new ApiError_1.NoDataError();
    return new ApiResponse_1.SuccessResponse('success', racepoints).send(res);
}));
exports.default = router;
//# sourceMappingURL=user.js.map