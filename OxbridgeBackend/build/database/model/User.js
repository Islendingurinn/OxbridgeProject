"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = 'User';
exports.COLLECTION_NAME = 'users';
const UserSchema = new mongoose_1.Schema({
    firstname: String,
    lastname: String,
    emailUsername: String,
    password: String,
    roles: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Role',
            },
        ],
    }
});
exports.UserModel = mongoose_1.model(exports.DOCUMENT_NAME, UserSchema, exports.COLLECTION_NAME);
//# sourceMappingURL=User.js.map