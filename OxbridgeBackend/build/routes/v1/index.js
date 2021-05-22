"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apikey_1 = __importDefault(require("../../auth/apikey"));
const signup_1 = __importDefault(require("./access/signup"));
const login_1 = __importDefault(require("./access/login"));
const logout_1 = __importDefault(require("./access/logout"));
const token_1 = __importDefault(require("./access/token"));
const user_1 = __importDefault(require("./event/user"));
const admin_1 = __importDefault(require("./event/admin"));
const user_2 = __importDefault(require("./event_registration/user"));
const admin_2 = __importDefault(require("./event_registration/admin"));
const user_3 = __importDefault(require("./location_registration/user"));
const admin_3 = __importDefault(require("./location_registration/admin"));
const user_4 = __importDefault(require("./racepoint/user"));
const admin_4 = __importDefault(require("./racepoint/admin"));
const user_5 = __importDefault(require("./ship/user"));
const admin_5 = __importDefault(require("./ship/admin"));
const user_6 = __importDefault(require("./user/user"));
const admin_6 = __importDefault(require("./user/admin"));
const router = express_1.default.Router();
/**
  * Handles the routing of the application. The base route
  * is /v1/. Afterward, the routes can be seen below.
  */
// Below all APIs are public APIs protected by api-key
router.use('/', apikey_1.default);
// ---------------------------------------------------
// Access
router.use('/signup', signup_1.default);
router.use('/login', login_1.default);
router.use('/logout', logout_1.default);
router.use('/token', token_1.default);
// Event
router.use('/events', user_1.default);
router.use('/admin/events', admin_1.default);
// Event registration
router.use('/eventRegistrations', user_2.default);
router.use('/admin/eventRegistrations', admin_2.default);
// Location registration
router.use('/locationRegistrations', user_3.default);
router.use('/admin/locationRegistrations', admin_3.default);
// Race point
router.use('/racepoints', user_4.default);
router.use('/admin/racepoints', admin_4.default);
// Ship
router.use('/ships', user_5.default);
router.use('/admin/ships', admin_5.default);
// User
router.use('/users', user_6.default);
router.use('/admin/users', admin_6.default);
exports.default = router;
//# sourceMappingURL=index.js.map