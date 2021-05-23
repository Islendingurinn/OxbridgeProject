"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationRegistrationModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = 'LocationRegistration';
exports.COLLECTION_NAME = 'location_registration';
const LocationRegistrationSchema = new mongoose_1.Schema({
    eventRegId: mongoose_1.Types.ObjectId,
    racePointId: mongoose_1.Types.ObjectId,
    locationTime: Date,
    longtitude: Number,
    latitude: Number,
    raceScore: Number,
    finishTime: Date,
});
exports.LocationRegistrationModel = mongoose_1.model(exports.DOCUMENT_NAME, LocationRegistrationSchema, exports.COLLECTION_NAME);
//# sourceMappingURL=LocationRegistration.js.map