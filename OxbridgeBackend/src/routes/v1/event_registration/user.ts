import express from 'express';
import { SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError } from '../../../core/ApiError';
import EventRegistrationRepo from '../../../database/repository/EventRegistrationRepo';
import EventRegistration from '../../../database/model/EventRegistration';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import { getAccessToken } from '../../../auth/authUtils';
import JWT from '../../../core/JWT';
import { AuthFailureError } from '../../../core/ApiError';
import ShipRepo from '../../../database/repository/ShipRepo';
import UserRepo from '../../../database/repository/UserRepo';
import EmailConfirmation from '../../../mail/EmailConfirmation';
import authentication from '../../../auth/authentication';
import authorization from '../../../auth/authorization';
import role from '../../../helpers/role';
import { RoleCode } from '../../../database/model/Role';

const router = express.Router();

// Below all APIs are private APIs protected for Access Token and Users Role
router.use('/', authentication, role(RoleCode.USER), authorization);
// ---------------------------------------------------------------------------

/**
  * Gets all event registrations
  * Route: GET /eventRegistrations/
  * Return: EventRegistration[]
  */
 router.get(
    '/',
    asyncHandler(async (req: ProtectedRequest, res) => {
        const registrations = await EventRegistrationRepo.findAll();
        return new SuccessResponse('success', registrations).send(res);
    })
)

/**
  * Gets all participants/event registrations of an event
  * Route: GET /eventRegistrations/participants/fromEvent/:id
  * Return: Participant[] (anonymous object with User, Ship fields)
  */
 router.get(
    '/participants/fromEvent/:id',
    validator(schema.eventId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const eventRegistrations = await EventRegistrationRepo.findByEvent(new Types.ObjectId(req.params.id));
        if(!eventRegistrations) throw new BadRequestError('Event does not have any registrations');

        let participants = [];
        for(const registration of eventRegistrations){
            const ship = await ShipRepo.findById(registration.shipId);
            if(!ship) continue;

            const user = await UserRepo.findByIdSecured(ship.userId);
            if(!user) continue;

            participants.push({ user, ship });
        }

        return new SuccessResponse('success', participants).send(res);
    })
)

/**
  * Gets all event registrations by event the
  * user is registered to.
  * Route: GET /eventRegistrations/mine/fromEvent/:id
  * Return: EventRegistration[]
  */
 router.get(
    '/mine/fromEvent/:id',
    validator(schema.eventId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        //Retrieve the payload from the authentication header
        req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase
        const payload = await JWT.validate(req.accessToken);

        //Retrieve the user from the user id in the payload
        const user = await UserRepo.findById(new Types.ObjectId(payload.sub));
        if (!user) throw new AuthFailureError('User not registered');
        req.user = user;

        //Retrieve the ships the user has registered
        const ships = await ShipRepo.findByUser(user._id);
        if(!ships) throw new BadRequestError('User does not have any ships registered');

        //Retreive the event registrations assosciated with the ships
        let eventRegistrations: EventRegistration[] = [];
        for(const ship of ships){
            const registrations = await EventRegistrationRepo.findByShipAndEvent(ship._id, new Types.ObjectId(req.params.id));
            eventRegistrations = eventRegistrations.concat(registrations);
        }
        if(!eventRegistrations) throw new BadRequestError('User is not associated with any event registrations');

        return new SuccessResponse('success', eventRegistrations).send(res);
    })
)

/**
  * Creates a new event registration
  * Route: POST /eventRegistrations/
  * Return: EventRegistration
  */
router.post(
    '/',
    validator(schema.newEventRegistration),
    asyncHandler(async (req: ProtectedRequest, res) => {

        const createdEventRegistration = await EventRegistrationRepo.create({
            shipId: req.body.shipId,
            eventId: req.body.eventId,
            trackColor: req.body.trackColor,
            teamName: req.body.teamName,
        } as EventRegistration);

        new EmailConfirmation(req.body.shipId, req.body.eventId);
        new SuccessResponse('Event registration created successfully', createdEventRegistration).send(res);
    })
)

export default router;