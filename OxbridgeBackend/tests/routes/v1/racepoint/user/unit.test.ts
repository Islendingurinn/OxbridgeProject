import { addAuthHeaders } from '../../../../auth/authentication/mock';

// this import should be below authentication/mock to override for role validation to work
import { USER_ACCESS_TOKEN } from '../../../../auth/authorization/mock';

import {
    EVENT_ID,
    mockEventFindById,
    mockRacePointFindByEvent,    
} from './mock';

import supertest from 'supertest';
import app from '../../../../../src/app';
import { Types } from 'mongoose';

describe('GET /v1/racepoints/fromEvent/id', () => {
    beforeEach(() => {
        mockEventFindById.mockClear();
        mockRacePointFindByEvent.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/racepoints/fromEvent/';
  
    it('ERROR invalid id', async () => {
        const response = await addAuthHeaders(request.get(endpoint + 'abc'), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/invalid/);
        expect(mockEventFindById).not.toBeCalled();
        expect(mockRacePointFindByEvent).not.toBeCalled();
    });

    it('ERROR does not exist', async () => {
        const response = await addAuthHeaders(request.get(endpoint + new Types.ObjectId().toHexString()), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/does not exist/);
        expect(mockEventFindById).toBeCalledTimes(1);
        expect(mockRacePointFindByEvent).not.toBeCalled();
    });

    it('SUCCESS', async () => {
      const response = await addAuthHeaders(request.get(endpoint + EVENT_ID.toHexString()), USER_ACCESS_TOKEN);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/success/);
      expect(response.body.data).toBeDefined();
      expect(mockEventFindById).toBeCalledTimes(1);
      expect(mockEventFindById).toBeCalledWith(EVENT_ID);
      expect(mockRacePointFindByEvent).toBeCalledTimes(1);
      expect(mockRacePointFindByEvent).toBeCalledWith(EVENT_ID);
  });
});

describe('GET /v1/racepoints/startAndFinish/fromEvent/id', () => {
    beforeEach(() => {
        mockEventFindById.mockClear();
        mockRacePointFindByEvent.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/racepoints/startAndFinish/fromEvent/';
  
    it('ERROR invalid id', async () => {
        const response = await addAuthHeaders(request.get(endpoint + 'abc'), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/invalid/);
        expect(mockEventFindById).not.toBeCalled();
        expect(mockRacePointFindByEvent).not.toBeCalled();
    });

    it('ERROR does not exist', async () => {
        const response = await addAuthHeaders(request.get(endpoint + new Types.ObjectId().toHexString()), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/does not exist/);
        expect(mockEventFindById).toBeCalledTimes(1);
        expect(mockRacePointFindByEvent).not.toBeCalled();
    });

    it('SUCCESS', async () => {
      const response = await addAuthHeaders(request.get(endpoint + EVENT_ID.toHexString()), USER_ACCESS_TOKEN);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/success/);
      expect(response.body.data).toBeDefined();
      expect(mockEventFindById).toBeCalledTimes(1);
      expect(mockEventFindById).toBeCalledWith(EVENT_ID);
      expect(mockRacePointFindByEvent).toBeCalledTimes(1);
      expect(mockRacePointFindByEvent).toBeCalledWith(EVENT_ID);
  });
});