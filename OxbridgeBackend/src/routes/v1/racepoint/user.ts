import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError } from '../../../core/ApiError';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import RacePointRepo from '../../../database/repository/RacePointRepo';
import EventRepo from '../../../database/repository/EventRepo';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import role from '../../../helpers/role';
import { RoleCode } from '../../../database/model/Role';

const router = express.Router();

// Below all APIs are private APIs protected for Access Token and Users Role
router.use('/', authentication, role(RoleCode.USER), authorization);
// ---------------------------------------------------------------------------

/**
  * Gets all racepoints in an event
  * Route: GET /racepoints/fromEvent/:id
  * Return: RacePoint[]
  */
router.get(
    '/fromEvent/:id',
    validator(schema.eventId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const event = await EventRepo.findById(new Types.ObjectId(req.params.id));
        if(!event) throw new BadRequestError('Event does not exist');

        const racepoints = await RacePointRepo.findByEvent(
            new Types.ObjectId(req.params.id),
        );
        if (!racepoints) throw new BadRequestError('The event does not have any racepoints');

        return new SuccessResponse('success', racepoints).send(res);
    })
)

/**
  * Gets start, finish racepoints in an event
  * Route: GET /racepoints/startAndFinish/fromEvent/:id
  * Return: RacePoint[]
  */
router.get(
    '/startAndFinish/fromEvent/:id',
    validator(schema.eventId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const event = await EventRepo.findById(new Types.ObjectId(req.params.id));
        if(!event) throw new BadRequestError('Event does not exist');

        const racepoints = await RacePointRepo.findStartAndFinish(
            new Types.ObjectId(req.params.id),
        );
        if (!racepoints) throw new BadRequestError('The event does not have any racepoints');

        return new SuccessResponse('success', racepoints).send(res);
    })
)

export default router;