import { addAuthHeaders } from '../../../../auth/authentication/mock';

// this import should be below authentication/mock to override for role validation to work
import { USER_ACCESS_TOKEN } from '../../../../auth/authorization/mock';

import {
    EVENT_ID,
    SHIP_ID,
    mockEventRegistrationFindByEvent,
    mockShipCreate,
    mockShipDelete,
    mockShipFindAll,
    mockShipFindById,
    mockShipFindByUser,
    mockShipUpdate,
    mockUserFindById    
} from './mock';

import supertest from 'supertest';
import app from '../../../../../src/app';
import { Types } from 'mongoose';

describe('GET /v1/ships', () => {
    beforeEach(() => {
        mockShipFindAll.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/ships';
  
    it('SUCCESS', async () => {
      const response = await addAuthHeaders(request.get(endpoint), USER_ACCESS_TOKEN);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/success/);
      expect(response.body.data).toBeDefined();
      expect(mockShipFindAll).toBeCalledTimes(1);
    });
});

describe('GET /v1/ships/mine', () => {
    beforeEach(() => {
        mockUserFindById.mockClear();
        mockShipFindByUser.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/ships/mine';
  
    it('SUCCESS', async () => {
      const response = await addAuthHeaders(request.get(endpoint), USER_ACCESS_TOKEN);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/success/);
      expect(response.body.data).toBeDefined();
      expect(mockUserFindById).toBeCalledTimes(2);
      expect(mockShipFindByUser).toBeCalledTimes(1);
    });
});

describe('GET /v1/ships/fromEvent/id', () => {
    beforeEach(() => {
      mockEventRegistrationFindByEvent.mockClear();
      mockShipFindById.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/ships/fromEvent/';
  
    it('ERROR invalid id', async () => {
        const response = await addAuthHeaders(request.get(endpoint + 'abc'), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/invalid/);
        expect(mockEventRegistrationFindByEvent).not.toBeCalled();
        expect(mockShipFindById).not.toBeCalled();
    });

    it('ERROR does not exist', async () => {
        const response = await addAuthHeaders(request.get(endpoint + new Types.ObjectId().toHexString()), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/No event registrations/);
        expect(mockEventRegistrationFindByEvent).toBeCalledTimes(1);
        expect(mockShipFindById).not.toBeCalled();
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
  });
});

describe('GET /v1/ships/id', () => {
    beforeEach(() => {
      mockShipFindById.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/ships/';
  
    it('ERROR invalid id', async () => {
        const response = await addAuthHeaders(request.get(endpoint + 'abc'), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/invalid/);
        expect(mockShipFindById).not.toBeCalled();
    });

    it('ERROR does not exist', async () => {
        const response = await addAuthHeaders(request.get(endpoint + new Types.ObjectId().toHexString()), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/No ship/);
        expect(mockShipFindById).toBeCalledTimes(1);
    });

    it('SUCCESS', async () => {
      const response = await addAuthHeaders(request.get(endpoint + SHIP_ID.toHexString()), USER_ACCESS_TOKEN);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/success/);
      expect(response.body.data).toBeDefined();
      expect(mockShipFindById).toBeCalledTimes(1);
      expect(mockShipFindById).toBeCalledWith(SHIP_ID);
  });
});

describe('POST /v1/ships', () => {
    beforeEach(() => {
      mockShipCreate.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/ships';
  
    it('ERROR userId missing', async () => {
      const response = await addAuthHeaders(
        request.post(endpoint).send({
          name: 'Dummy Name',
        }),
        USER_ACCESS_TOKEN,
      );
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/userId/i);
      expect(response.body.message).toMatch(/required/i);
      expect(mockShipCreate).not.toBeCalled();
    });
  
    it('ERROR name missing', async () => {
      const response = await addAuthHeaders(
        request.post(endpoint).send({
            userId: new Types.ObjectId,
        }),
        USER_ACCESS_TOKEN,
      );
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/name/i);
      expect(response.body.message).toMatch(/required/i);
      expect(mockShipCreate).not.toBeCalled();
    });

  
    it('SUCCESS', async () => {
      const response = await addAuthHeaders(
        request.post(endpoint).send({
            userId: new Types.ObjectId,
            name: 'Dummy Name',
        }),
        USER_ACCESS_TOKEN,
      );
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/created success/i);
      expect(mockShipCreate).toBeCalledTimes(1);
      expect(response.body.data).toMatchObject({ _id: SHIP_ID.toHexString() });
    });
});

describe('PUT /v1/ships/id', () => {
    beforeEach(() => {
      mockShipFindById.mockClear();
      mockShipUpdate.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/ships/';
  
    it('ERROR invalid id', async () => {
        const response = await addAuthHeaders(request.put(endpoint + 'abc'), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/invalid/);
        expect(mockShipFindById).not.toBeCalled();
        expect(mockShipUpdate).not.toBeCalled();
    });

    it('ERROR does not exist', async () => {
        const response = await addAuthHeaders(request.put(endpoint + new Types.ObjectId().toHexString()), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/does not exist/);
        expect(mockShipFindById).toBeCalledTimes(1);
        expect(mockShipUpdate).not.toBeCalled();
    });

    it('SUCCESS', async () => {
      const response = await addAuthHeaders(request.put(endpoint + SHIP_ID.toHexString()), USER_ACCESS_TOKEN);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/success/);
      expect(response.body.data).toBeDefined();
      expect(mockShipFindById).toBeCalledTimes(1);
      expect(mockShipFindById).toBeCalledWith(SHIP_ID);
      expect(mockShipUpdate).toBeCalledTimes(1);
  });
});

describe('DELETE /v1/ships/id', () => {
    beforeEach(() => {
      mockShipFindById.mockClear();
      mockShipDelete.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/ships/';
  
    it('ERROR invalid id', async () => {
        const response = await addAuthHeaders(request.delete(endpoint + 'abc'), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/invalid/);
        expect(mockShipFindById).not.toBeCalled();
        expect(mockShipDelete).not.toBeCalled();
    });

    it('ERROR does not exist', async () => {
        const response = await addAuthHeaders(request.delete(endpoint + new Types.ObjectId().toHexString()), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/does not exist/);
        expect(mockShipFindById).toBeCalledTimes(1);
        expect(mockShipDelete).not.toBeCalled();
    });

    it('SUCCESS', async () => {
      const response = await addAuthHeaders(request.delete(endpoint + SHIP_ID.toHexString()), USER_ACCESS_TOKEN);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/success/);
      expect(mockShipFindById).toBeCalledTimes(1);
      expect(mockShipFindById).toBeCalledWith(SHIP_ID);
      expect(mockShipDelete).toBeCalledTimes(1);
  });
});