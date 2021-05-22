import express from 'express';
import { SuccessMsgResponse, SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError } from '../../../core/ApiError';
import EventRegistrationRepo from '../../../database/repository/EventRegistrationRepo';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import role from '../../../helpers/role';
import { RoleCode } from '../../../database/model/Role';

const router = express.Router();

// Below all APIs are private APIs protected for Access Token and Admin's Role
router.use('/', authentication, role(RoleCode.ADMIN), authorization);
// ---------------------------------------------------------------------------

/**
  * Update an event registration by id
  * Route: PUT /admin/eventRegistrations/:id
  * Return: EventRegistration
  */
router.put(
    '/:id',
    validator(schema.eventRegistrationId, ValidationSource.PARAM),
    validator(schema.updateEventRegistration),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const registration = await EventRegistrationRepo.findById(new Types.ObjectId(req.params.id));
        if(registration == null) throw new BadRequestError('Event registration does not exist');

        if(req.body.shipId) registration.shipId = req.body.shipId;
        if(req.body.eventId) registration.eventId = req.body.eventId;
        if(req.body.trackColor) registration.trackColor = req.body.trackColor;
        if(req.body.teamName) registration.teamName = req.body.teamName;

        await EventRegistrationRepo.update(registration);
        new SuccessResponse('Event registration updated successfully', registration).send(res);
    })
)

/**
  * Delete an event registration by id
  * Route: DELETE /admin/eventRegistrations/:id
  * Return: 
  */
router.delete(
    '/:id',
    validator(schema.eventRegistrationId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const eventRegistration = await EventRegistrationRepo.findById(new Types.ObjectId(req.params.id));
        if(eventRegistration == null) throw new BadRequestError('Event registration does not exist');

        await EventRegistrationRepo.delete(eventRegistration);
        return new SuccessMsgResponse('Event registration deleted successfully').send(res);
    })
)

export default router;