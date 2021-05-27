import express from 'express';
import { SuccessMsgResponse } from '../../../core/ApiResponse';
import { RoleRequest } from 'app-request';
import crypto from 'crypto';
import UserRepo from '../../../database/repository/UserRepo';
import { BadRequestError } from '../../../core/ApiError';
import validator from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import EmailPasswordReset from '../../../mail/EmailPasswordReset';

const router = express.Router();

/**
  * Resets the password on an 
  * existing user.
  * Route: POST /v1/reset
  * Return: 
  */

router.post(
    '/',
    validator(schema.email),
    asyncHandler(async (req: RoleRequest, res) => {
        const user = await UserRepo.findByEmail(req.body.email);
        if (!user) throw new BadRequestError('User does not exist');

        const password = crypto.randomBytes(16).toString('hex');
        const passwordHash = await bcrypt.hash(password, 10);

        user.password = passwordHash;
        await UserRepo.updateInfo(user);

        new EmailPasswordReset(user, password);
        new SuccessMsgResponse('Password reset successfully').send(res);
    }),
);

export default router;