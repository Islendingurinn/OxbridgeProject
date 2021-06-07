import { addAuthHeaders } from '../../../../auth/authentication/mock';

// this import should be below authentication/mock to override for role validation to work
import { ADMIN_ACCESS_TOKEN } from '../../../../auth/authorization/mock';

import {
  EVENTREG_ID,
  mockEventRegistrationFindById,
  mockEventRegistrationDelete,
  mockEventRegistrationUpdate,
} from './mock';

import supertest from 'supertest';
import app from '../../../../../src/app';
import { Types } from 'mongoose';

describe('PUT /v1/admin/eventsregistrations/id', () => {
    beforeEach(() => {
        mockEventRegistrationFindById.mockClear();
        mockEventRegistrationUpdate.mockClear();
    });
  
    const request = supertest(app);
    const endpoint = '/v1/admin/eventregistrations/';
  
    it('ERROR invalid id', async () => {
      const response = await addAuthHeaders(request.put(endpoint + 'abc'), ADMIN_ACCESS_TOKEN);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/id/i);
      expect(response.body.message).toMatch(/invalid/i);
      expect(mockEventRegistrationFindById).not.toBeCalled();
      expect(mockEventRegistrationUpdate).not.toBeCalled();
    });
  
    it('ERROR event not exist', async () => {
      const response = await addAuthHeaders(request.put(endpoint + new Types.ObjectId()), ADMIN_ACCESS_TOKEN);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/not exist/i);
      expect(mockEventRegistrationFindById).toBeCalledTimes(1);
      expect(mockEventRegistrationUpdate).not.toBeCalled();
    });
  
    it('SUCCESS', async () => {
      const response = await addAuthHeaders(
        request.put(endpoint + EVENTREG_ID),
        ADMIN_ACCESS_TOKEN
      );
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/updated success/i);
      expect(mockEventRegistrationFindById).toBeCalledTimes(1);
      expect(mockEventRegistrationUpdate).toBeCalledTimes(1);
    });
  });

describe('DELETE /v1/admin/eventregistrations/id', () => {
  beforeEach(() => {
      mockEventRegistrationFindById.mockClear();
      mockEventRegistrationDelete.mockClear();
  });

  const request = supertest(app);
  const endpoint = '/v1/admin/eventregistrations/';

  it('ERROR invalid id', async () => {
    const response = await addAuthHeaders(request.delete(endpoint + 'abc'), ADMIN_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/id/i);
    expect(response.body.message).toMatch(/invalid/i);
    expect(mockEventRegistrationFindById).not.toBeCalled();
    expect(mockEventRegistrationDelete).not.toBeCalled();
  });

  it('ERROR event not exist', async () => {
    const response = await addAuthHeaders(request.delete(endpoint + new Types.ObjectId()), ADMIN_ACCESS_TOKEN);
    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/not exist/i);
    expect(mockEventRegistrationFindById).toBeCalledTimes(1);
    expect(mockEventRegistrationDelete).not.toBeCalled();
  });

  it('SUCCESS', async () => {
    const response = await addAuthHeaders(
      request.delete(endpoint + EVENTREG_ID),
      ADMIN_ACCESS_TOKEN
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toMatch(/deleted success/i);
    expect(mockEventRegistrationFindById).toBeCalledTimes(1);
    expect(mockEventRegistrationDelete).toBeCalledTimes(1);
  });
});