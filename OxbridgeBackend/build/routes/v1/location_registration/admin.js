"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../../../auth/authentication"));
const authorization_1 = __importDefault(require("../../../auth/authorization"));
const role_1 = __importDefault(require("../../../helpers/role"));
const router = express_1.default.Router();
// Below all APIs are private APIs protected for Access Token and Admin's Role
router.use('/', authentication_1.default, role_1.default("ADMIN" /* ADMIN */), authorization_1.default);
// ---------------------------------------------------------------------------
exports.default = router;
//# sourceMappingURL=admin.js.map