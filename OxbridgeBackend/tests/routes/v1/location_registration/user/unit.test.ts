import { addAuthHeaders } from '../../../../auth/authentication/mock';

// this import should be below authentication/mock to override for role validation to work
import { USER_ACCESS_TOKEN, USER_ROLE_ID } from '../../../../auth/authorization/mock';

import {
    EVENTREG_ID,
    EVENT_ID,
    LOCREG_ID,
    mockLocationRegistrationCreate,    
    mockLocationRegistrationDeleteFromEventRegistration,
    mockLocationRegistrationFindAll,
    mockLocationRegistrationFindByEventRegistration,
    mockEventRegistrationFindByEvent,
    mockUserFindByIdSecured,
    mockShipFindById,
    SHIP_ID,
    mockEventRegistrationFindById,
} from './mock';

import supertest from 'supertest';
import app from '../../../../../src/app';
import { Types } from 'mongoose';

describe('GET /v1/locationregistrations', () => {
    beforeEach(() => {
        mockLocationRegistrationFindAll.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/locationregistrations';
  
    it('SUCCESS', async () => {
      const response = await addAuthHeaders(request.get(endpoint), USER_ACCESS_TOKEN);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/success/);
      expect(response.body.data).toBeDefined();
      expect(mockLocationRegistrationFindAll).toBeCalledTimes(1);
    });
});

describe('GET /v1/locationregistrations/fromEvent/id', () => {
    beforeEach(() => {
      mockEventRegistrationFindByEvent.mockClear();
      mockLocationRegistrationFindByEventRegistration.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/locationregistrations/fromEvent/';
  
    it('ERROR invalid id', async () => {
        const response = await addAuthHeaders(request.get(endpoint + 'abc'), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/invalid/);
        expect(mockEventRegistrationFindByEvent).not.toBeCalled();
        expect(mockLocationRegistrationFindByEventRegistration).not.toBeCalled();
    });

    it('ERROR does not exist', async () => {
        const response = await addAuthHeaders(request.get(endpoint + new Types.ObjectId().toHexString()), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/does not have registrations/);
        expect(mockEventRegistrationFindByEvent).toBeCalledTimes(1);
        expect(mockLocationRegistrationFindByEventRegistration).not.toBeCalled();
    });

    it('SUCCESS', async () => {
      const response = await addAuthHeaders(request.get(endpoint + EVENT_ID.toHexString()), USER_ACCESS_TOKEN);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/success/);
      expect(response.body.data).toBeDefined();
      expect(mockEventRegistrationFindByEvent).toBeCalledTimes(1);
      expect(mockEventRegistrationFindByEvent).toBeCalledWith(EVENT_ID);
      expect(mockLocationRegistrationFindByEventRegistration).toBeCalledTimes(1);
      expect(mockLocationRegistrationFindByEventRegistration).toBeCalledWith(EVENTREG_ID);
  });
});

describe('GET /v1/locationregistrations/scoreboard/fromEvent/id', () => {
    beforeEach(() => {
      mockEventRegistrationFindByEvent.mockClear();
      mockLocationRegistrationFindByEventRegistration.mockClear();
      mockUserFindByIdSecured.mockClear();
      mockShipFindById.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/locationregistrations/scoreboard/fromEvent/';
  
    it('ERROR invalid id', async () => {
        const response = await addAuthHeaders(request.get(endpoint + 'abc'), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/invalid/);
        expect(mockEventRegistrationFindByEvent).not.toBeCalled();
        expect(mockLocationRegistrationFindByEventRegistration).not.toBeCalled();
        expect(mockUserFindByIdSecured).not.toBeCalled();
        expect(mockShipFindById).not.toBeCalled();
    });

    it('ERROR does not exist', async () => {
        const response = await addAuthHeaders(request.get(endpoint + new Types.ObjectId().toHexString()), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/does not have registrations/);
        expect(mockEventRegistrationFindByEvent).toBeCalledTimes(1);
        expect(mockLocationRegistrationFindByEventRegistration).not.toBeCalled();
        expect(mockUserFindByIdSecured).not.toBeCalled();
        expect(mockShipFindById).not.toBeCalled();
    });

    it('SUCCESS', async () => {
      const response = await addAuthHeaders(request.get(endpoint + EVENT_ID.toHexString()), USER_ACCESS_TOKEN);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/success/);
      expect(response.body.data).toBeDefined();
      expect(mockEventRegistrationFindByEvent).toBeCalledTimes(1);
      expect(mockEventRegistrationFindByEvent).toBeCalledWith(EVENT_ID);
      expect(mockLocationRegistrationFindByEventRegistration).toBeCalledTimes(1);
      expect(mockLocationRegistrationFindByEventRegistration).toBeCalledWith(EVENTREG_ID);
      expect(mockUserFindByIdSecured).toBeCalledTimes(1);
      expect(mockUserFindByIdSecured).toBeCalledWith(USER_ROLE_ID);
      expect(mockShipFindById).toBeCalledTimes(1);
      expect(mockShipFindById).toBeCalledWith(SHIP_ID);
  });
});

describe('POST /v1/locationregistrations', () => {
    beforeEach(() => {
      mockLocationRegistrationCreate.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/locationregistrations';
  
    it('ERROR eventRegId missing', async () => {
      const response = await addAuthHeaders(
        request.post(endpoint).send({
          racePointId: new Types.ObjectId,
          longtitude: 100,
          latitude: 100,
          raceScore: 100,
          finishTime: new Date()
        }),
        USER_ACCESS_TOKEN,
      );
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/eventRegId/i);
      expect(response.body.message).toMatch(/required/i);
      expect(mockLocationRegistrationCreate).not.toBeCalled();
    });
  
    it('ERROR racePointId missing', async () => {
      const response = await addAuthHeaders(
        request.post(endpoint).send({
            eventRegId: new Types.ObjectId,
            longtitude: 100,
            latitude: 100,
            raceScore: 100,
            finishTime: new Date()
        }),
        USER_ACCESS_TOKEN,
      );
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/racePointId/i);
      expect(response.body.message).toMatch(/required/i);
      expect(mockLocationRegistrationCreate).not.toBeCalled();
    });
  
    it('ERROR longtitude missing', async () => {
      const response = await addAuthHeaders(
        request.post(endpoint).send({
            eventRegId: new Types.ObjectId,
            racePointId: new Types.ObjectId,
            latitude: 100,
            raceScore: 100,
            finishTime: new Date()
        }),
        USER_ACCESS_TOKEN,
      );
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/longtitude/i);
      expect(response.body.message).toMatch(/required/i);
      expect(mockLocationRegistrationCreate).not.toBeCalled();
    });
  
    it('ERROR latitude missing', async () => {
      const response = await addAuthHeaders(
        request.post(endpoint).send({
            eventRegId: new Types.ObjectId,
            racePointId: new Types.ObjectId,
            longtitude: 100,
            raceScore: 100,
            finishTime: new Date()
        }),
        USER_ACCESS_TOKEN,
      );
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/latitude/i);
      expect(response.body.message).toMatch(/required/i);
      expect(mockLocationRegistrationCreate).not.toBeCalled();
    });

    it('ERROR raceScore missing', async () => {
        const response = await addAuthHeaders(
          request.post(endpoint).send({
              eventRegId: new Types.ObjectId,
              racePointId: new Types.ObjectId,
              longtitude: 100,
              latitude: 100,
              finishTime: new Date()
          }),
          USER_ACCESS_TOKEN,
        );
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/raceScore/i);
        expect(response.body.message).toMatch(/required/i);
        expect(mockLocationRegistrationCreate).not.toBeCalled();
    });

    it('ERROR finishTime missing', async () => {
        const response = await addAuthHeaders(
          request.post(endpoint).send({
              eventRegId: new Types.ObjectId,
              racePointId: new Types.ObjectId,
              longtitude: 100,
              latitude: 100,
              raceScore: 100,
          }),
          USER_ACCESS_TOKEN,
        );
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/finishTime/i);
        expect(response.body.message).toMatch(/required/i);
        expect(mockLocationRegistrationCreate).not.toBeCalled();
    });
  
    it('SUCCESS', async () => {
      const response = await addAuthHeaders(
        request.post(endpoint).send({
            eventRegId: new Types.ObjectId,
              racePointId: new Types.ObjectId,
              longtitude: 100,
              latitude: 100,
              raceScore: 100,
              finishTime: new Date(),
        }),
        USER_ACCESS_TOKEN,
      );
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/created success/i);
      expect(mockLocationRegistrationCreate).toBeCalledTimes(1);
      expect(response.body.data).toMatchObject({ _id: LOCREG_ID.toHexString() });
    });
});

describe('DELETE /v1/locationregistrations/fromEventRegistration/id', () => {
    beforeEach(() => {
        mockEventRegistrationFindById.mockClear();
        mockLocationRegistrationDeleteFromEventRegistration.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/locationregistrations/fromEventRegistration/';
  
    it('ERROR invalid id', async () => {
      const response = await addAuthHeaders(request.delete(endpoint + 'abc'), USER_ACCESS_TOKEN);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/id/i);
      expect(response.body.message).toMatch(/invalid/i);
      expect(mockEventRegistrationFindById).not.toBeCalled();
      expect(mockLocationRegistrationDeleteFromEventRegistration).not.toBeCalled();
    });
  
    it('ERROR event not exist', async () => {
      const response = await addAuthHeaders(request.delete(endpoint + new Types.ObjectId()), USER_ACCESS_TOKEN);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/not exist/i);
      expect(mockEventRegistrationFindById).toBeCalledTimes(1);
      expect(mockLocationRegistrationDeleteFromEventRegistration).not.toBeCalled();
    });
  
    it('SUCCESS', async () => {
      const response = await addAuthHeaders(
        request.delete(endpoint + EVENTREG_ID),
        USER_ACCESS_TOKEN
      );
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/deleted success/i);
      expect(mockEventRegistrationFindById).toBeCalledTimes(1);
      expect(mockLocationRegistrationDeleteFromEventRegistration).toBeCalledTimes(1);
    });
});

