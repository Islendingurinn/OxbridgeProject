import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { NoDataError } from '../../../core/ApiError';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import RacePointRepo from '../../../database/repository/RacePointRepo';

const router = express.Router();

/**
  * Gets all racepoints in an event
  * Route: GET /racepoints/fromEvent/:id
  * Return: RacePoint[]
  */
router.get(
    '/fromEvent/:id',
    validator(schema.eventId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const racepoints = await RacePointRepo.findByEvent(
            new Types.ObjectId(req.params.id),
        );

        if (!racepoints) throw new NoDataError();

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
        const racepoints = await RacePointRepo.findStartAndFinish(
            new Types.ObjectId(req.params.id),
        );

        if (!racepoints) throw new NoDataError();

        return new SuccessResponse('success', racepoints).send(res);
    })
)

export default router;