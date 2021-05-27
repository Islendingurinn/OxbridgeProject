import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { AuthFailureError, NoDataError } from '../../../core/ApiError';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import UserRepo from '../../../database/repository/UserRepo';
import { Types } from 'mongoose';
import { getAccessToken } from '../../../auth/authUtils';
import JWT from '../../../core/JWT';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { createTokens } from '../../../auth/authUtils';
import _ from 'lodash';

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

router.put(
  '/',
  validator(schema.updateUser),
  asyncHandler(async (req: ProtectedRequest, res) => {
        //Retrieve the payload from the authentication header
        req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase
        const payload = await JWT.validate(req.accessToken);

        //Retrieve the user from the user id in the payload
        const user = await UserRepo.findById(new Types.ObjectId(payload.sub));
        if (!user) throw new AuthFailureError('User not registered');
        req.user = user;

        if(req.body.firstname) user.firstname = req.body.firstname;
        if(req.body.lastname) user.lastname = req.body.lastname;
        if(req.body.password) await bcrypt.hash(req.body.password, 10);

        await UserRepo.updateInfo(user);
        return new SuccessResponse('User details updated successfully', _.pick(user, ['_id', 'email', 'roles', 'firstname', 'lastname']));
  })
)

export default router;