import { addAuthHeaders } from '../../../../auth/authentication/mock';

// this import should be below authentication/mock to override for role validation to work
import { ADMIN_ACCESS_TOKEN } from '../../../../auth/authorization/mock';

import {
  EVENT_ID,
  RACEPOINT_ID,
  mockRacePointCreate,
  mockRacePointDeleteByEvent,
  mockEventFindById,
} from './mock';

import supertest from 'supertest';
import app from '../../../../../src/app';
import { Types } from 'mongoose';

describe('POST /v1/admin/racepoints/fromEvent/id', () => {
  beforeEach(() => {
    mockRacePointCreate.mockClear();
    mockEventFindById.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/admin/racepoints/fromEvent/';

  it('ERROR if not ADMIN', async () => {
    const response = await addAuthHeaders(request.post(endpoint));
    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/permission denied/i);
    expect(mockEventFindById).not.toBeCalled();
    expect(mockRacePointCreate).not.toBeCalled();
  });

  it('ERROR invalid id', async () => {
    const response = await addAuthHeaders(request.post(endpoint + 'abc').send({
        type: 'Dummy Type',
        firstLongtitude: 100,
        firstLatitude: 100,
        secondLongtitude: 200,
        secondLatitude: 200,
        eventId: EVENT_ID,
        }),
        ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/invalid/);
    expect(mockEventFindById).not.toBeCalled();
    expect(mockRacePointCreate).not.toBeCalled();
});

it('ERROR does not exist', async () => {
    const response = await addAuthHeaders(request.post(endpoint + new Types.ObjectId().toHexString()).send({
        type: 'Dummy Type',
        firstLongtitude: 100,
        firstLatitude: 100,
        secondLongtitude: 200,
        secondLatitude: 200,
        eventId: EVENT_ID,
        }),
        ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/does not exist/);
    expect(mockEventFindById).toBeCalledTimes(1);
    expect(mockRacePointCreate).not.toBeCalled();
});

it('ERROR type missing', async () => {
    const response = await addAuthHeaders(
        request.post(endpoint + EVENT_ID).send({
        firstLongtitude: 100,
        firstLatitude: 100,
        secondLongtitude: 200,
        secondLatitude: 200,
        eventId: EVENT_ID,
        }),
        ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/type/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockEventFindById).not.toBeCalled();
    expect(mockRacePointCreate).not.toBeCalled();
});

it('ERROR firstLongtitude missing', async () => {
    const response = await addAuthHeaders(
        request.post(endpoint + EVENT_ID).send({
        type: 'Dummy Type',
        firstLatitude: 100,
        secondLongtitude: 200,
        secondLatitude: 200,
        eventId: EVENT_ID,
        }),
        ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/firstLongtitude/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockEventFindById).not.toBeCalled();
    expect(mockRacePointCreate).not.toBeCalled();
});

it('ERROR firstLatitude missing', async () => {
    const response = await addAuthHeaders(
        request.post(endpoint + EVENT_ID).send({
        type: 'Dummy Type',
        firstLongtitude: 100,
        secondLongtitude: 200,
        secondLatitude: 200,
        eventId: EVENT_ID,
        }),
        ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/firstLatitude/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockEventFindById).not.toBeCalled();
    expect(mockRacePointCreate).not.toBeCalled();
});

it('ERROR secondLongtitude missing', async () => {
    const response = await addAuthHeaders(
        request.post(endpoint + EVENT_ID).send({
        type: 'Dummy Type',
        firstLongtitude: 100,
        firstLatitude: 100,
        secondLatitude: 200,
        eventId: EVENT_ID,
        }),
        ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/secondLongtitude/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockEventFindById).not.toBeCalled();
    expect(mockRacePointCreate).not.toBeCalled();
});

it('ERROR secondLatitude missing', async () => {
    const response = await addAuthHeaders(
        request.post(endpoint + EVENT_ID).send({
        type: 'Dummy Type',
        firstLongtitude: 100,
        firstLatitude: 100,
        secondLongtitude: 200,
        eventId: EVENT_ID,
        }),
        ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/secondLatitude/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockEventFindById).not.toBeCalled();
    expect(mockRacePointCreate).not.toBeCalled();
});

it('SUCCESS', async () => {
    const response = await addAuthHeaders(
        request.post(endpoint + EVENT_ID).send({
        type: 'Dummy Type',
        firstLongtitude: 100,
        firstLatitude: 100,
        secondLongtitude: 200,
        secondLatitude: 200,
        eventId: EVENT_ID,
        }),
        ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/created success/i);
    expect(mockEventFindById).toBeCalledTimes(1);
    expect(mockRacePointCreate).toBeCalledTimes(1);
    expect(response.body.data).toMatchObject({ _id: RACEPOINT_ID.toHexString() });
  });
});

describe('DELETE /v1/admin/racepoints/fromEvent/id', () => {
    beforeEach(() => {
        mockEventFindById.mockClear();
        mockRacePointDeleteByEvent.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/admin/racepoints/fromEvent/';
  
    it('ERROR invalid id', async () => {
      const response = await addAuthHeaders(request.delete(endpoint + 'abc'), ADMIN_ACCESS_TOKEN);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/id/i);
      expect(response.body.message).toMatch(/invalid/i);
      expect(mockEventFindById).not.toBeCalled();
      expect(mockRacePointDeleteByEvent).not.toBeCalled();
    });
  
    it('ERROR event not exist', async () => {
      const response = await addAuthHeaders(request.delete(endpoint + new Types.ObjectId()), ADMIN_ACCESS_TOKEN);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/not exist/i);
      expect(mockEventFindById).toBeCalledTimes(1);
      expect(mockRacePointDeleteByEvent).not.toBeCalled();
    });
  
    it('SUCCESS', async () => {
      const response = await addAuthHeaders(
        request.delete(endpoint + EVENT_ID),
        ADMIN_ACCESS_TOKEN
      );
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/deleted success/i);
      expect(mockEventFindById).toBeCalledTimes(1);
      expect(mockRacePointDeleteByEvent).toBeCalledTimes(1);
    });
});