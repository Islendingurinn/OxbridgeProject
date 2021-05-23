"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRegistrationModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = 'EventRegistration';
exports.COLLECTION_NAME = 'event_registration';
const EventRegistrationSchema = new mongoose_1.Schema({
    shipId: mongoose_1.Types.ObjectId,
    eventId: mongoose_1.Types.ObjectId,
    trackColor: String,
    teamName: String
});
exports.EventRegistrationModel = mongoose_1.model(exports.DOCUMENT_NAME, EventRegistrationSchema, exports.COLLECTION_NAME);
//# sourceMappingURL=EventRegistration.js.map