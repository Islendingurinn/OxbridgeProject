import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError, NoDataError } from '../../../core/ApiError';
import EventRepo from '../../../database/repository/EventRepo';
import UserRepo from '../../../database/repository/UserRepo';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import RacePointRepo from '../../../database/repository/RacePointRepo';
import { getAccessToken } from '../../../auth/authUtils';
import JWT from '../../../core/JWT';
import { AuthFailureError } from '../../../core/ApiError';
import ShipRepo from '../../../database/repository/ShipRepo';
import EventRegistrationRepo from '../../../database/repository/EventRegistrationRepo';
import EventRegistration from '../../../database/model/EventRegistration';
import Event from '../../../database/model/Event';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import role from '../../../helpers/role';
import { RoleCode } from '../../../database/model/Role';

const router = express.Router();

// Below all APIs are private APIs protected for Access Token and Users Role
router.use('/', authentication, role(RoleCode.USER), authorization);
// ---------------------------------------------------------------------------

/**
  * Gets all events a user participates in
  * Route: GET /events/mine
  * Return: Event[]
  */
 router.get(
    '/mine',
    asyncHandler(async (req: ProtectedRequest, res) => {
        //Retrieve the payload from the current authentication tokens
        req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase
        const payload = await JWT.validate(req.accessToken);

        //Find the user from the user id in the payload
        const user = await UserRepo.findById(new Types.ObjectId(payload.sub));
        if (!user) throw new AuthFailureError('User not registered');
        req.user = user;

        //Find the ships the user has registered
        const ships = await ShipRepo.findByUser(user._id);
        if(!ships) throw new BadRequestError('User does not have any ships registered');

        //Find the event registrations the ships are participants of
        let eventRegistrations: EventRegistration[] = []; 
        for(const ship of ships){
            const registrations = await EventRegistrationRepo.findByShip(ship._id);
            eventRegistrations = eventRegistrations.concat(registrations);
        }
        if(!eventRegistrations) throw new BadRequestError('User does not have any event registrations');

        //Find the corresponding events from the event registrations
        let events: Event[] = [];
        for(const registration of eventRegistrations){
            const event = await EventRepo.findById(registration.eventId);
            if(event) events.push(event);
        }
        if(!events) throw new BadRequestError('User is not associated with any events');

        return new SuccessResponse('success', events).send(res);
    })
)

/**
  * Get an event by id
  * Route: GET /events/:id
  * Return: Event
  */
 router.get(
    '/:id',
    validator(schema.eventId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const event = await EventRepo.findById(
            new Types.ObjectId(req.params.id),
        );

        if (!event) throw new BadRequestError("Event does not exist");

        return new SuccessResponse('success', event).send(res);
    }),
);

/**
  * Sees if an event has a racepoint route
  * Route: GET /events/:id/hasRoute/
  * Return: Boolean
  */
 router.get(
    '/:id/hasRoute',
    validator(schema.eventId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const event = await EventRepo.findById(
            new Types.ObjectId(req.params.id)
        );
        if(!event) throw new BadRequestError("Event does not exist");

        const racepoints = await RacePointRepo.findByEvent(
            new Types.ObjectId(req.params.id)
        );
        
        let result = false;
        if(racepoints.length !== 0) result = true;

        return new SuccessResponse('success', result).send(res);
    })
)

/**
  * Gets all events
  * Route: GET /events/
  * Return: Event[]
  */
 router.get(
    '/',
    asyncHandler(async (req: ProtectedRequest, res) => {
        const events = await EventRepo.findAll();
        return new SuccessResponse('success', events).send(res);
    })
)

export default router;