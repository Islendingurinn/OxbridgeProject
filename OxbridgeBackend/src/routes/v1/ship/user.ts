import express from 'express';
import { SuccessMsgResponse, SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError, NoDataError } from '../../../core/ApiError';
import EventRegistrationRepo from '../../../database/repository/EventRegistrationRepo';
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
import Ship from '../../../database/model/Ship';

const router = express.Router();

/**
  * Gets all registered ships
  * Route: GET /ships/
  * Return: Ship[]
  */
router.get(
    '/',
    asyncHandler(async (req: ProtectedRequest, res) => {
        const ships = await ShipRepo.findAll();
        return new SuccessResponse('success', ships).send(res);
    })
)

/**
  * Gets all ships of the user
  * Route: GET /ships/mine
  * Return: Ship[]
  */
 router.get(
    '/mine',
    asyncHandler(async (req: ProtectedRequest, res) => {
        //Retrieve the payload from the authorization header
        req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase
        const payload = await JWT.validate(req.accessToken);

        //Find the user from the user id in the payload
        const user = await UserRepo.findById(new Types.ObjectId(payload.sub));
        if (!user) throw new AuthFailureError('User not registered');
        req.user = user;

        //Find user ships from user id
        const ships = await ShipRepo.findByUser(user._id);
        if(!ships) throw new NoDataError('User does not have any ships registered');

        return new SuccessResponse('success', ships).send(res);
    })
)


/**
  * Gets a registered ship
  * Route: GET /ships/:id
  * Return: Ship
  */
router.get(
    '/:id',
    validator(schema.shipId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const ship = await ShipRepo.findById(req.body.id);
        if(!ship) throw new NoDataError('No ship with this id');

        return new SuccessResponse('success', ship).send(res);
    })
)

/**
  * Gets all registered ships in an event
  * Route: GET /ships/fromEvent/:id
  * Return: Ship[] (anonymous object with Ship fields 
  * and teamName from EventRegistration)
  */
router.get(
    '/fromEvent/:id',
    validator(schema.eventId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const registrations = await EventRegistrationRepo.findByEvent(req.body.id);
        if(!registrations) throw new NoDataError('No event registrations');

        let ships = [];
        for(const registration of registrations){
            const ship = await ShipRepo.findById(registration.shipId);
            if(!ship) continue;

            ships.push({
                "shipId": ship._id,
                "name": ship.name,
                "teamName": registration.teamName,
            });
        }

        return new SuccessResponse('success', ships).send(res);
    })
)

/**
  * Creates a new ship
  * Route: POST /ships/
  * Return: Ship
  */
router.post(
    '/',
    validator(schema.newShip),
    asyncHandler(async (req: ProtectedRequest, res) => {

        const createdShip = await ShipRepo.create({
            userId: req.body.userId,
            name: req.body.name,
        } as Ship);

        new SuccessResponse('Ship created successfully', createdShip).send(res);
    })
)

/**
  * Updates an existing ship
  * Route: PUT /ships/:id
  * Return: Ship
  */
router.put(
    '/:id',
    validator(schema.shipId, ValidationSource.PARAM),
    validator(schema.updateShip),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const ship = await ShipRepo.findById(new Types.ObjectId(req.params.id));
        if(ship == null) throw new BadRequestError('Ship does not exist');

        if(req.body.userId) ship.userId = req.body.userId;
        if(req.body.name) ship.name = req.body.name;

        await ShipRepo.update(ship);
        new SuccessResponse('Ship updated successfully', ship).send(res);
    })
)

/**
  * Deletes an existing ship
  * Route: DELETE /ships/:id
  * Return: 
  */
router.delete(
    '/:id',
    validator(schema.eventId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const ship = await ShipRepo.findById(new Types.ObjectId(req.params.id));
        if(ship == null) throw new BadRequestError('Ship does not exist');

        await ShipRepo.delete(ship);
        return new SuccessMsgResponse('Ship deleted successfully').send(res);
    })
)

export default router;