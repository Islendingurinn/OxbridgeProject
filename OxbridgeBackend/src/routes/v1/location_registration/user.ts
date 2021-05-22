import express from 'express';
import { SuccessMsgResponse, SuccessResponse } from '../../../core/ApiResponse';
import { BadRequestError, NoDataError } from '../../../core/ApiError';
import EventRegistrationRepo from '../../../database/repository/EventRegistrationRepo';
import { Types } from 'mongoose';
import validator, { ValidationSource } from '../../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../../helpers/asyncHandler';
import { ProtectedRequest } from 'app-request';
import ShipRepo from '../../../database/repository/ShipRepo';
import UserRepo from '../../../database/repository/UserRepo';
import LocationRegistrationRepo from '../../../database/repository/LocationRegistrationRepo';
import LocationRegistration from '../../../database/model/LocationRegistration';

const router = express.Router();

/**
  * Gets all location registrations
  * Route: GET /locationRegistrations/
  * Return: LocationRegistration[]
  */
 router.get(
    '/',
    asyncHandler(async (req: ProtectedRequest, res) => {
        const locations = await LocationRegistrationRepo.findAll();
        return new SuccessResponse('success', locations).send(res);
    })
)

/**
  * Retrieve location registrations from an event
  * Route: GET /locationRegistrations/fromEvent/:id
  * Return: ShipLocation[] (anonymous object with 
  * LocationRegistration[] and EventRegistration fields)
  */
 router.get(
    '/fromEvent/:id',
    validator(schema.eventId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const eventRegistrations = await EventRegistrationRepo.findByEvent(
            new Types.ObjectId(req.params.id)
            );
        if(eventRegistrations.length == 0) throw new NoDataError('Event does not have registrations');

        let shipLocations = [];
        for(const registration of eventRegistrations){
            const locations = await LocationRegistrationRepo.findByEventRegistration(registration._id);
            shipLocations.push({
                "locationsRegistrations": locations,
                "color": registration.trackColor,
                "shipId": registration.shipId,
                "teamName": registration.teamName,
                "placement": -1,
            })          
        }

        if(shipLocations[0].locationsRegistrations[0].raceScore != 0)
            shipLocations.sort((a, b) => (a.locationsRegistrations[0].raceScore >= b.locationsRegistrations[0].raceScore) ? -1 : 1);
        else
            shipLocations.sort((a, b) => (a.shipId > b.shipId) ? 1 : -1);

        for (var i = 0; i < shipLocations.length; i++) 
            shipLocations[i].placement = i + 1;

        new SuccessResponse('success', shipLocations).send(res);
    })
)

/**
  * Retrieve scoreboard from an event
  * Route: GET /locationRegistrations/scoreboard/fromEvent/:id
  * Return: Score[] (anonymous object with LocationRegistration[], 
  * EventRegistration, Ship and User fields)
  */
 router.get(
    '/scoreboard/fromEvent/:id',
    validator(schema.eventId),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const eventRegistrations = await EventRegistrationRepo.findByEvent(
            new Types.ObjectId(req.params.id)
            );
        if(eventRegistrations.length == 0) throw new NoDataError('Event does not have registrations');

        let scores = [];
        for(const registration of eventRegistrations){
            
            const locationRegistrations = await LocationRegistrationRepo.findByEventRegistration(registration._id);
            
            const ship = await ShipRepo.findById(registration.shipId);
            if(!ship) continue;

            const user = await UserRepo.findById(ship.userId);
            if(!user) continue;

            scores.push({
                "locationsRegistrations": locationRegistrations, 
                "color": registration.trackColor, 
                "shipId": registration.shipId, 
                "shipName": ship.name, 
                "teamName": registration.teamName, 
                "owner": user.firstname + " " + user.lastname,
                "placement": 0,
            });
        }

        if(scores[0].locationsRegistrations[0].raceScore != 0)
            scores.sort((a, b) => (a.locationsRegistrations[0].raceScore >= b.locationsRegistrations[0].raceScore) ? -1 : 1);
        else
            scores.sort((a, b) => (a.shipId > b.shipId) ? 1 : -1);

        for (var i = 0; i < scores.length; i++) 
            scores[i].placement = i + 1;

        new SuccessResponse('success', scores).send(res);
    })
)

/**
  * Creates a new location registration
  * Route: POST /locationRegistrations/
  * Return: LocationRegistration
  */
router.post(
    '/',
    validator(schema.newLocationRegistration),
    asyncHandler(async (req: ProtectedRequest, res) => {

        const createdLocationRegistration = await LocationRegistrationRepo.create({
            eventRegId: req.body.eventRegId,
            racePointId: req.body.racePointId,
            longtitude: req.body.longtitude,
            latitude: req.body.latitude,
            raceScore: req.body.raceScore,
            finishTime: req.body.finishTime,
        } as LocationRegistration);

        new SuccessResponse('Location registration created successfully', createdLocationRegistration).send(res);
    })
)

/**
  * Deletes location registrations from event registration id
  * Route: DELETE /locationRegistrations/fromEventRegistration/:id
  * Return: 
  */
router.delete(
    '/fromEventRegistration/:id',
    validator(schema.eventRegistrationId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const registration = await EventRegistrationRepo.findById(req.body.id);
        if(!registration) throw new BadRequestError('Event registration does not exist');

        await LocationRegistrationRepo.deleteFromEventRegistration(req.body.id);
        return new SuccessMsgResponse('Location registrations deleted successfully').send(res);
    })
)

export default router;