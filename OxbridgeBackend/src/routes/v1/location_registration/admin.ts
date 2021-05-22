import express from 'express';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import role from '../../../helpers/role';
import { RoleCode } from '../../../database/model/Role';

const router = express.Router();

// Below all APIs are private APIs protected for Access Token and Admin's Role
router.use('/', authentication, role(RoleCode.ADMIN), authorization);
// ---------------------------------------------------------------------------

export default router;