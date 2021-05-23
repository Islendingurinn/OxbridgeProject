"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = 'Event';
exports.COLLECTION_NAME = 'events';
const EventSchema = new mongoose_1.Schema({
    name: String,
    eventStart: Date,
    eventEnd: Date,
    city: String,
    eventCode: String,
    actualEventStart: Date,
    isLive: Boolean
});
exports.EventModel = mongoose_1.model(exports.DOCUMENT_NAME, EventSchema, exports.COLLECTION_NAME);
//# sourceMappingURL=Event.js.map