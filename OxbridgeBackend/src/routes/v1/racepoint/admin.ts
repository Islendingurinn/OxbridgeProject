import express from 'express';
import { SuccessMsgResponse, SuccessResponse } from '../../../core/ApiResponse';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import role from '../../../helpers/role';
import { RoleCode } from '../../../database/model/Role';
import RacePointRepo from '../../../database/repository/RacePointRepo';
import RacePoint from '../../../database/model/RacePoint';

const router = express.Router();

// Below all APIs are private APIs protected for Access Token and Admin's Role
router.use('/', authentication, role(RoleCode.ADMIN), authorization);
// ---------------------------------------------------------------------------

/**
  * Creates new racepoint based on an event
  * Route: POST /admin/racepoints/fromEvent/:id
  * Return: RacePoint
  */
router.post(
    '/fromEvent/:id',
    validator(schema.eventId, ValidationSource.PARAM),
    validator(schema.newRacepoint),
    asyncHandler(async (req: ProtectedRequest, res) => {

        const createdRacepoint = await RacePointRepo.create({
            type: req.body.type,
            firstLongtitude: req.body.firstLongtitude,
            firstLatitude: req.body.firstLatitude,
            secondLongtitude: req.body.secondLongtitude,
            secondLatitude: req.body.secondLatitude,
            eventId: req.body.eventId,
        } as RacePoint);

        new SuccessResponse('Racepoint created successfully', createdRacepoint).send(res);
    })
)

/**
  * Deletes a racepoint based on an event
  * Route: DELETE /admin/racepoints/fromEvent:id
  * Return: 
  */
router.delete(
    '/fromEvent/:id',
    validator(schema.eventId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        await RacePointRepo.deleteByEvent(req.body.id);
        return new SuccessMsgResponse('Racepoints deleted successfully').send(res);
    })
)

export default router;