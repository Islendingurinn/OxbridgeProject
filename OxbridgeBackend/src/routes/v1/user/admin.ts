import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import role from '../../../helpers/role';
import { RoleCode } from '../../../database/model/Role';
import UserRepo from '../../../database/repository/UserRepo';

const router = express.Router();

// Below all APIs are private APIs protected for Access Token and Admin's Role
router.use('/', authentication, role(RoleCode.ADMIN), authorization);
// ---------------------------------------------------------------------------

/**
  * Retrieves all users
  * Route: GET /admin/users
  * Return: User[]
  */
router.get(
    '/',
    asyncHandler(async (req: ProtectedRequest, res) => {
        const users = await UserRepo.findAll();
        return new SuccessResponse('success', users).send(res);
    })
)

export default router;