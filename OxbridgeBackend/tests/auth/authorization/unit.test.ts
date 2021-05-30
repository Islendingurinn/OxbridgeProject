import { addAuthHeaders } from '../authentication/mock';

// import the mock for the current test after all other mock imports
// this will prevent the different implementations by the other mock
import { mockRoleRepoFindByCode, mockUserFindById, ADMIN_ACCESS_TOKEN } from './mock';

import app from '../../../src/app';
import supertest from 'supertest';
import { RoleCode } from '../../../src/database/model/Role';

describe('authentication validation for user', () => {
  const endpoint = '/v1/admin/events/test';
  const request = supertest(app);

  beforeEach(() => {
    mockRoleRepoFindByCode.mockClear();
    mockUserFindById.mockClear();
  });

  it('Should response with 401 if user do not have admin role', async () => {
    const response = await addAuthHeaders(request.get(endpoint));
    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/denied/);
    expect(mockRoleRepoFindByCode).toBeCalledTimes(1);
    expect(mockUserFindById).toBeCalledTimes(1);
    expect(mockRoleRepoFindByCode).toBeCalledWith(RoleCode.ADMIN);
  });
});

describe('authentication validation for admin', () => {
  const endpoint = '/v1/admin/events/test';
  const request = supertest(app);

  beforeEach(() => {
    mockRoleRepoFindByCode.mockClear();
    mockUserFindById.mockClear();
  });

  it('Should response with 404 if user have admin role', async () => {
    const response = await addAuthHeaders(request.get(endpoint), ADMIN_ACCESS_TOKEN);
    expect(response.status).toBe(404);
    expect(mockRoleRepoFindByCode).toBeCalledTimes(1);
    expect(mockUserFindById).toBeCalledTimes(1);
    expect(mockRoleRepoFindByCode).toBeCalledWith(RoleCode.ADMIN);
  });
});