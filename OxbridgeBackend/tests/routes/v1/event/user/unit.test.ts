import { addAuthHeaders } from '../../../../auth/authentication/mock';

// this import should be below authentication/mock to override for role validation to work
import { USER_ACCESS_TOKEN } from '../../../../auth/authorization/mock';

import {
  EVENT_ID,
  mockEventFindAll,
  mockEventFindById,
  mockEventRegistrationFindByShip,
  mockRacePointFindByEvent,
  mockShipFindByUser,
  mockUserFindById,
} from './mock';

import supertest from 'supertest';
import app from '../../../../../src/app';
import { Types } from 'mongoose';

describe('GET /v1/events', () => {
    beforeEach(() => {
      mockEventFindAll.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/events';
  
    it('SUCCESS', async () => {
      const response = await addAuthHeaders(request.get(endpoint), USER_ACCESS_TOKEN);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/success/);
      expect(response.body.data).toBeDefined();
      expect(mockEventFindAll).toBeCalledTimes(1);
    });
});

describe('GET /v1/events/id', () => {
    beforeEach(() => {
      mockEventFindById.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/events/';
  
    it('ERROR invalid id', async () => {
        const response = await addAuthHeaders(request.get(endpoint + 'abc'), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/invalid/);
        expect(mockEventFindById).not.toBeCalled();
    });

    it('ERROR does not exist', async () => {
        const response = await addAuthHeaders(request.get(endpoint + new Types.ObjectId().toHexString()), USER_ACCESS_TOKEN);
        expect(response.status).toBe(400);
        expect(response.body.message).toMatch(/does not exist/);
        expect(mockEventFindById).toBeCalledTimes(1);
    });

    it('SUCCESS', async () => {
      const response = await addAuthHeaders(request.get(endpoint + EVENT_ID), USER_ACCESS_TOKEN);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/success/);
      expect(response.body.data).toBeDefined();
      expect(mockEventFindById).toBeCalledTimes(1);
      expect(mockEventFindById).toBeCalledWith(EVENT_ID);
  });
});

describe('GET /v1/events/mine', () => {
  beforeEach(() => {
    mockEventFindById.mockClear();
    mockShipFindByUser.mockClear();
    mockEventRegistrationFindByShip.mockClear();
    mockUserFindById.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/events/mine';

  it('SUCCESS', async () => {
    const response = await addAuthHeaders(request.get(endpoint), USER_ACCESS_TOKEN);
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/success/);
    expect(response.body.data).toBeDefined();
    expect(mockShipFindByUser).toBeCalledTimes(1);
    expect(mockEventRegistrationFindByShip).toBeCalledTimes(1);
    expect(mockEventFindById).toBeCalledTimes(1);
    expect(mockEventFindById).toBeCalledWith(EVENT_ID);
  });
});

describe('GET /v1/events/id/hasRoute', () => {
  beforeEach(() => {
    mockEventFindById.mockClear();
    mockRacePointFindByEvent.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/events/';

  it('ERROR invalid id', async () => {
    const response = await addAuthHeaders(request.get(endpoint + 'abc' + '/hasRoute'), USER_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/invalid/);
    expect(mockEventFindById).not.toBeCalled();
});

it('ERROR does not exist', async () => {
    const response = await addAuthHeaders(request.get(endpoint + new Types.ObjectId().toHexString() + '/hasRoute'), USER_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/does not exist/);
    expect(mockEventFindById).toBeCalledTimes(1);
});

  it('SUCCESS', async () => {
    const response = await addAuthHeaders(request.get(endpoint + EVENT_ID + '/hasRoute'), USER_ACCESS_TOKEN);
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/success/);
    expect(response.body.data).toBeDefined();
    expect(mockEventFindById).toBeCalledTimes(1);
    expect(mockEventFindById).toBeCalledWith(EVENT_ID);
    expect(mockRacePointFindByEvent).toBeCalledTimes(1);
    expect(mockEventFindById).toBeCalledWith(EVENT_ID);
  });
});