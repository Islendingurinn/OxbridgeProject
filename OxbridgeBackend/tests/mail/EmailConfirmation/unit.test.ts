import {
    EVENT_ID,
    SHIP_ID,
    USER_ID,
    mockShipFindById,
    mockUserFindByIdSecured,
    mockEventFindById
} from './mock';

import EmailConfirmation from '../../../src/mail/EmailConfirmation';

describe('EmailConfirmation', () => {
    beforeEach(() => {
        mockShipFindById.mockClear();
        mockUserFindByIdSecured.mockClear();
        mockEventFindById.mockClear();
    });
  
    it('SUCCESS', async () => {
        new EmailConfirmation(SHIP_ID, EVENT_ID);
        expect(mockShipFindById).toBeCalledTimes(1);
        expect(mockShipFindById).toBeCalledWith(SHIP_ID);
        await Promise.resolve();
        expect(mockUserFindByIdSecured).toBeCalledTimes(1);
        expect(mockUserFindByIdSecured).toBeCalledWith(USER_ID);
        await Promise.resolve();
        expect(mockEventFindById).toBeCalledTimes(1);
        expect(mockEventFindById).toBeCalledWith(EVENT_ID);
    });
});