import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { NoDataError } from '../../../core/ApiError';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import UserRepo from '../../../database/repository/UserRepo';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import role from '../../../helpers/role';
import { RoleCode } from '../../../database/model/Role';

const router = express.Router();

// Below all APIs are private APIs protected for Access Token and Users Role
router.use('/', authentication, role(RoleCode.USER), authorization);
// ---------------------------------------------------------------------------

/**
  * Retrieves a user
  * Route: GET /users/:user
  * Return: User
  */
router.get(
    '/:user',
    validator(schema.email, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const user = await UserRepo.findByEmail(req.params.user);
        if (!user) throw new NoDataError();

        return new SuccessResponse('success', user).send(res);
    }),
);

export default router;