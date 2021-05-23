"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ApiResponse_1 = require("../../../core/ApiResponse");
const crypto_1 = __importDefault(require("crypto"));
const UserRepo_1 = __importDefault(require("../../../database/repository/UserRepo"));
const ApiError_1 = require("../../../core/ApiError");
const authUtils_1 = require("../../../auth/authUtils");
const validator_1 = __importDefault(require("../../../helpers/validator"));
const schema_1 = __importDefault(require("./schema"));
const asyncHandler_1 = __importDefault(require("../../../helpers/asyncHandler"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const lodash_1 = __importDefault(require("lodash"));
const router = express_1.default.Router();
/**
  * Creates a new user
  * Route: POST /v1/signup
  * Return: User, Tokens
  */
router.post('/', validator_1.default(schema_1.default.signup), asyncHandler_1.default(async (req, res) => {
    const user = await UserRepo_1.default.findByEmailusername(req.body.emailUsername);
    if (user)
        throw new ApiError_1.BadRequestError('User already registered');
    const accessTokenKey = crypto_1.default.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto_1.default.randomBytes(64).toString('hex');
    const passwordHash = await bcrypt_1.default.hash(req.body.password, 10);
    const { user: createdUser, keystore } = await UserRepo_1.default.create({
        emailUsername: req.body.emailUsername,
        password: passwordHash,
    }, accessTokenKey, refreshTokenKey, "USER" /* USER */);
    const tokens = await authUtils_1.createTokens(createdUser, keystore.primaryKey, keystore.secondaryKey);
    new ApiResponse_1.SuccessResponse('Signup successful', {
        user: lodash_1.default.pick(createdUser, ['_id', 'emailUsername', 'roles']),
        tokens: tokens,
    }).send(res);
}));
exports.default = router;
//# sourceMappingURL=signup.js.map