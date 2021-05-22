"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RacePointModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = 'RacePoint';
exports.COLLECTION_NAME = 'race_points';
const racePointSchema = new mongoose_1.Schema({
    type: String,
    firstLongtitude: Number,
    firstLatitude: Number,
    secondLongtitude: Number,
    secondLatitude: Number,
    eventId: mongoose_1.Types.ObjectId,
});
exports.RacePointModel = mongoose_1.model(exports.DOCUMENT_NAME, racePointSchema, exports.COLLECTION_NAME);
//# sourceMappingURL=RacePoint.js.map