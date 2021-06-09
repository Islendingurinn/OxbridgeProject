import { addAuthHeaders } from '../../../../auth/authentication/mock';

// this import should be below authentication/mock to override for role validation to work
import { USER_ACCESS_TOKEN, USER_ROLE_ID } from '../../../../auth/authorization/mock';

import {
    EVENTREG_ID,
    EVENT_ID,
    SHIP_ID,
    mockEventRegistrationCreate,    
    mockEventRegistrationFindAll,
    mockUserFindByIdSecured,
    mockShipFindById,
    mockEventRegistrationFindByEvent,
    mockShipFindByUser,
    mockEventRegistrationFindByShipAndEvent
} from './mock';

import supertest from 'supertest';
import app from '../../../../../src/app';
import { Types } from 'mongoose';

describe('GET /v1/events', () => {
    beforeEach(() => {
        mockEventRegistrationFindAll.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/eventregistrations';
  
    it('SUCCESS', async () => {
      const response = await addAuthHeaders(request.get(endpoint), USER_ACCESS_TOKEN);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/success/);
      expect(response.body.data).toBeDefined();
      expect(mockEventRegistrationFindAll).toBeCalledTimes(1);
    });
});

describe('POST /v1/eventregistrations', () => {
    beforeEach(() => {
      mockEventRegistrationCreate.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/eventregistrations';
  
    it('ERROR ship id missing', async () => {
      const response = await addAuthHeaders(
        request.post(endpoint).send({
          eventId: new Types.ObjectId,
          trackColor: 'Dummy Color',
          teamName: 'Dummy Name',
        }),
        USER_ACCESS_TOKEN,
      );
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/shipId/i);
      expect(response.body.message).toMatch(/required/i);
      expect(mockEventRegistrationCreate).not.toBeCalled();
    });
  
    it('ERROR event id missing', async () => {
      const response = await addAuthHeaders(
        request.post(endpoint).send({
            shipId: new Types.ObjectId,
            trackColor: 'Dummy Color',
            teamName: 'Dummy Name',
        }),
        USER_ACCESS_TOKEN,
      );
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/eventId/i);
      expect(response.body.message).toMatch(/required/i);
      expect(mockEventRegistrationCreate).not.toBeCalled();
    });
  
    it('ERROR track color missing', async () => {
      const response = await addAuthHeaders(
        request.post(endpoint).send({
            eventId: new Types.ObjectId,
            shipId: new Types.ObjectId,
            teamName: 'Dummy Name',
        }),
        USER_ACCESS_TOKEN,
      );
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/trackColor/i);
      expect(response.body.message).toMatch(/required/i);
      expect(mockEventRegistrationCreate).not.toBeCalled();
    });
  
    it('ERROR team name missing', async () => {
      const response = await addAuthHeaders(
        request.post(endpoint).send({
            eventId: new Types.ObjectId,
            shipId: new Types.ObjectId,
            trackColor: 'Dummy Color',
        }),
        USER_ACCESS_TOKEN,
      );
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/teamName/i);
      expect(response.body.message).toMatch(/required/i);
      expect(mockEventRegistrationCreate).not.toBeCalled();
    });
  
    it('SUCCESS', async () => {
      const response = await addAuthHeaders(
        request.post(endpoint).send({
            eventId: new Types.ObjectId,
            shipId: new Types.ObjectId,
            trackColor: 'Dummy Color',
            teamName: 'Dummy Name'
        }),
        USER_ACCESS_TOKEN,
      );
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/created success/i);
      expect(mockEventRegistrationCreate).toBeCalledTimes(1);
      expect(response.body.data).toMatchObject({ _id: EVENTREG_ID.toHexString() });
    });
});

describe('GET /v1/eventregistrations/participants/fromEvent/id', () => {
    beforeEach(() => {
      mockEventRegistrationFindByEvent.mockClear();
      mockShipFindById.mockClear();
      mockUserFindByIdSecured.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/eventregistrations/participants/fromEvent/';
  
    it('ERROR invalid id', async () => {
        const response = await addAuthHeaders(request.get(endpoint + 'abc'), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/invalid/);
        expect(mockEventRegistrationFindByEvent).not.toBeCalled();
        expect(mockShipFindById).not.toBeCalled();
        expect(mockUserFindByIdSecured).not.toBeCalled();
    });

    it('ERROR does not exist', async () => {
        const response = await addAuthHeaders(request.get(endpoint + new Types.ObjectId().toHexString()), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/does not have any registrations/);
        expect(mockEventRegistrationFindByEvent).toBeCalledTimes(1);
        expect(mockShipFindById).not.toBeCalled();
        expect(mockUserFindByIdSecured).not.toBeCalled();
    });

    it('SUCCESS', async () => {
      const response = await addAuthHeaders(request.get(endpoint + EVENT_ID.toHexString()), USER_ACCESS_TOKEN);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/success/);
      expect(response.body.data).toBeDefined();
      expect(mockEventRegistrationFindByEvent).toBeCalledTimes(1);
      expect(mockEventRegistrationFindByEvent).toBeCalledWith(EVENT_ID);
      expect(mockShipFindById).toBeCalledTimes(1);
      expect(mockShipFindById).toBeCalledWith(SHIP_ID);
      expect(mockUserFindByIdSecured).toBeCalledTimes(1);
      expect(mockUserFindByIdSecured).toBeCalledWith(USER_ROLE_ID);
  });
});

describe('GET /v1/eventregistrations/mine/fromEvent/id', () => {
    beforeEach(() => {
      mockShipFindByUser.mockClear();
      mockEventRegistrationFindByShipAndEvent.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/eventregistrations/mine/fromEvent/';
  
    it('SUCCESS', async () => {
      const response = await addAuthHeaders(request.get(endpoint + EVENT_ID), USER_ACCESS_TOKEN);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/success/);
      expect(response.body.data).toBeDefined();
      expect(mockShipFindByUser).toBeCalledTimes(1);
      expect(mockShipFindByUser).toBeCalledWith(USER_ROLE_ID);
      expect(mockEventRegistrationFindByShipAndEvent).toBeCalledTimes(1);
      expect(mockEventRegistrationFindByShipAndEvent).toBeCalledWith(SHIP_ID, EVENT_ID); 
    });
});