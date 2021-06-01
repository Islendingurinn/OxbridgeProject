import { addAuthHeaders } from '../../../../auth/authentication/mock';

// this import should be below authentication/mock to override for role validation to work
import { ADMIN_ACCESS_TOKEN } from '../../../../auth/authorization/mock';

import {
  EVENT_ID,
  EVENT_ID_STARTED,
  EVENT_ID_STOPPED,
  mockEventCreate,
  mockEventDelete,
  mockEventFindById,
  mockEventUpdate,
} from './mock';

import supertest from 'supertest';
import app from '../../../../../src/app';
import { Types } from 'mongoose';

describe('POST /v1/admin/events', () => {
  beforeEach(() => {
    mockEventCreate.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/admin/events';

  it('ERROR if not ADMIN', async () => {
    const response = await addAuthHeaders(request.post(endpoint));
    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/permission denied/i);
    expect(mockEventCreate).not.toBeCalled();
  });

  it('ERROR name missing', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        eventStart: '2021-05-21T20:00:00.000+00:00',
        eventEnd: '2021-05-23T20:00:00.000+00:00',
        city: 'Dummy City',
      }),
      ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/name/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockEventCreate).not.toBeCalled();
  });

  it('ERROR eventStart missing', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        name: 'Dummy Event',
        eventEnd: '2021-05-23T20:00:00.000+00:00',
        city: 'Dummy City',
      }),
      ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/eventStart/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockEventCreate).not.toBeCalled();
  });

  it('ERROR eventEnd missing', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        name: 'Dummy Event',
        eventStart: '2021-05-21T20:00:00.000+00:00',
        city: 'Dummy City',
      }),
      ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/eventEnd/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockEventCreate).not.toBeCalled();
  });

  it('ERROR city missing', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        name: 'Dummy Event',
        eventStart: '2021-05-21T20:00:00.000+00:00',
        eventEnd: '2021-05-23T20:00:00.000+00:00',
      }),
      ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/city/i);
    expect(response.body.message).toMatch(/required/i);
    expect(mockEventCreate).not.toBeCalled();
  });

  it('SUCCESS', async () => {
    const response = await addAuthHeaders(
      request.post(endpoint).send({
        name: 'Dummy Event',
        eventStart: '2021-05-21T20:00:00.000+00:00',
        eventEnd: '2021-05-23T20:00:00.000+00:00',
        city: 'Dummy City',
      }),
      ADMIN_ACCESS_TOKEN,
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/created success/i);
    expect(mockEventCreate).toBeCalledTimes(1);
    expect(response.body.data).toMatchObject({ _id: EVENT_ID.toHexString() });
  });
});

describe('PUT /v1/admin/events/id', () => {
  beforeEach(() => {
    mockEventFindById.mockClear();
    mockEventUpdate.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/admin/events/';

  it('ERROR invalid id', async () => {
    const response = await addAuthHeaders(request.put(endpoint + 'abc'), ADMIN_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/id/i);
    expect(response.body.message).toMatch(/invalid/i);
    expect(mockEventUpdate).not.toBeCalled();
  });

  it('ERROR event not exist', async () => {
    const response = await addAuthHeaders(request.put(endpoint + new Types.ObjectId()), ADMIN_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/not exist/i);
    expect(mockEventFindById).toBeCalledTimes(1);
    expect(mockEventUpdate).not.toBeCalled();
  });

  it('SUCCESS', async () => {
    const response = await addAuthHeaders(
      request.put(endpoint + EVENT_ID),
      ADMIN_ACCESS_TOKEN
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/updated success/i);
    expect(mockEventFindById).toBeCalledTimes(1);
    expect(mockEventUpdate).toBeCalledTimes(1);
  });
});

describe('PUT /v1/admin/events/start/id', () => {
  beforeEach(() => {
    mockEventFindById.mockClear();
    mockEventUpdate.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/admin/events/start/';

  it('ERROR invalid id', async () => {
    const response = await addAuthHeaders(request.put(endpoint + 'abc'), ADMIN_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/id/i);
    expect(response.body.message).toMatch(/invalid/i);
    expect(mockEventUpdate).not.toBeCalled();
  });

  it('ERROR event not exist', async () => {
    const response = await addAuthHeaders(request.put(endpoint + new Types.ObjectId()), ADMIN_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/not exist/i);
    expect(mockEventFindById).toBeCalledTimes(1);
    expect(mockEventUpdate).not.toBeCalled();
  });

  it('ERROR already live', async () => {
    const response = await addAuthHeaders(request.put(endpoint + EVENT_ID_STARTED), ADMIN_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/already live/i);
    expect(mockEventFindById).toBeCalledTimes(1);
    expect(mockEventUpdate).not.toBeCalled();
  });

  it('SUCCESS', async () => {
    const response = await addAuthHeaders(
      request.put(endpoint + EVENT_ID_STOPPED),
      ADMIN_ACCESS_TOKEN
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/been started/i);
    expect(mockEventFindById).toBeCalledTimes(1);
    expect(mockEventUpdate).toBeCalledTimes(1);
  });
});

describe('PUT /v1/admin/events/stop/id', () => {
  beforeEach(() => {
    mockEventFindById.mockClear();
    mockEventUpdate.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/admin/events/stop/';

  it('ERROR invalid id', async () => {
    const response = await addAuthHeaders(request.put(endpoint + 'abc'), ADMIN_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/id/i);
    expect(response.body.message).toMatch(/invalid/i);
    expect(mockEventUpdate).not.toBeCalled();
  });

  it('ERROR event not exist', async () => {
    const response = await addAuthHeaders(request.put(endpoint + new Types.ObjectId()), ADMIN_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/not exist/i);
    expect(mockEventFindById).toBeCalledTimes(1);
    expect(mockEventUpdate).not.toBeCalled();
  });

  it('ERROR already live', async () => {
    const response = await addAuthHeaders(request.put(endpoint + EVENT_ID_STOPPED), ADMIN_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/already not live/i);
    expect(mockEventFindById).toBeCalledTimes(1);
    expect(mockEventUpdate).not.toBeCalled();
  });

  it('SUCCESS', async () => {
    const response = await addAuthHeaders(
      request.put(endpoint + EVENT_ID_STARTED),
      ADMIN_ACCESS_TOKEN
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/been stopped/i);
    expect(mockEventFindById).toBeCalledTimes(1);
    expect(mockEventUpdate).toBeCalledTimes(1);
  });
});

describe('DELETE /v1/admin/events/id', () => {
  beforeEach(() => {
    mockEventFindById.mockClear();
    mockEventUpdate.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/admin/events/';

  it('ERROR invalid id', async () => {
    const response = await addAuthHeaders(request.delete(endpoint + 'abc'), ADMIN_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/id/i);
    expect(response.body.message).toMatch(/invalid/i);
    expect(mockEventDelete).not.toBeCalled();
  });

  it('ERROR event not exist', async () => {
    const response = await addAuthHeaders(request.delete(endpoint + new Types.ObjectId()), ADMIN_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/not exist/i);
    expect(mockEventFindById).toBeCalledTimes(1);
    expect(mockEventDelete).not.toBeCalled();
  });

  it('SUCCESS', async () => {
    const response = await addAuthHeaders(
      request.delete(endpoint + EVENT_ID),
      ADMIN_ACCESS_TOKEN
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/deleted success/i);
    expect(mockEventFindById).toBeCalledTimes(1);
    expect(mockEventDelete).toBeCalledTimes(1);
  });
});