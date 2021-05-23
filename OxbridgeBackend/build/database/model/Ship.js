"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = 'Ship';
exports.COLLECTION_NAME = 'ships';
const ShipSchema = new mongoose_1.Schema({
    userId: mongoose_1.Types.ObjectId,
    name: String
});
exports.ShipModel = mongoose_1.model(exports.DOCUMENT_NAME, ShipSchema, exports.COLLECTION_NAME);
//# sourceMappingURL=Ship.js.map