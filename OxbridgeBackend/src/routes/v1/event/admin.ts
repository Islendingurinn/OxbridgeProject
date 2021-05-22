import express from 'express';
import { SuccessMsgResponse, SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError } from '../../../core/ApiError';
import Event from '../../../database/model/Event';
import EventRepo from '../../../database/repository/EventRepo';
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
  * Creates new event
  * Route: POST /admin/events/
  * Return: Event
  */
router.post(
    '/',
    validator(schema.newEvent),
    asyncHandler(async (req: ProtectedRequest, res) => {

        const createdEvent = await EventRepo.create({
            name: req.body.name,
            eventStart: req.body.eventStart,
            eventEnd: req.body.eventEnd,
            city: req.body.city,
            isLive: false,
        } as Event);

        new SuccessResponse('Event created successfully', createdEvent).send(res);
    })
)

/**
  * Updates an existing event
  * Route: PUT /admin/events/:id
  * Return: Event
  */
router.put(
    '/:id',
    validator(schema.eventId, ValidationSource.PARAM),
    validator(schema.updateEvent),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const event = await EventRepo.findById(new Types.ObjectId(req.params.id));
        if(event == null) throw new BadRequestError('Event does not exist');

        if(req.body.name) event.name = req.body.name;
        if(req.body.eventStart) event.eventStart = req.body.eventStart;
        if(req.body.eventEnd) event.eventEnd = req.body.eventEnd;
        if(req.body.city) event.city = req.body.eventEnd;

        await EventRepo.update(event);
        new SuccessResponse('Event updated successfully', event).send(res);
    })
)

/**
  * Sets event status to live
  * Route: PUT /admin/events/start/:id
  * Return: Event
  */
router.put(
    '/start/:id',
    validator(schema.eventId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const event = await EventRepo.findById(new Types.ObjectId(req.params.id));
        if(event == null) throw new BadRequestError('Event does not exist');
        if(event.isLive == true) throw new BadRequestError('Event is already live');

        event.isLive = true;
        event.actualEventStart = new Date();

        await EventRepo.update(event);
        new SuccessResponse('Event has successfully been started', event).send(res);
    })
)

/**
  * Sets event status to not live
  * Route: PUT /admin/events/stop/:id
  * Return: Event
  */
router.put(
    '/stop/:id',
    validator(schema.eventId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const event = await EventRepo.findById(new Types.ObjectId(req.params.id));
        if(event == null) throw new BadRequestError('Event does not exist');
        if(event.isLive == false) throw new BadRequestError('Event is already not live');

        event.isLive = false;

        await EventRepo.update(event);
        new SuccessResponse('Event has successfully been stopped', event).send(res);
    })
)

/**
  * Deletes an event
  * Route: DELETE /admin/events/:id
  * Return: 
  */
router.delete(
    '/:id',
    validator(schema.eventId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const event = await EventRepo.findById(new Types.ObjectId(req.params.id));
        if(event == null) throw new BadRequestError('Event does not exist');

        await EventRepo.delete(event);
        return new SuccessMsgResponse('Event deleted successfully').send(res);
    })
)

export default router;