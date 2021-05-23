import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { NoDataError } from '../../../core/ApiError';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import UserRepo from '../../../database/repository/UserRepo';

const router = express.Router();

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