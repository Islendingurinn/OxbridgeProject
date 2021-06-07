import {
    EVENT_ID,
    SHIP_ID,
    USER_ID,
    mockShipFindById,
    mockUserFindByIdSecured,
    mockEventFindHasNotBeenNotified,
    mockEventRegistrationFindByEvent,
} from './mock';

import EmailNotificationJob from '../../../src/mail/EmailNotificationJob';

describe('EmailConfirmation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('SUCCESS', async () => {
        jest.useFakeTimers('modern');
        new EmailNotificationJob();
        jest.advanceTimersByTime(86400000);

        expect(mockEventFindHasNotBeenNotified).toBeCalledTimes(1);
        await Promise.resolve();
        expect(mockEventRegistrationFindByEvent).toBeCalledTimes(1);
        expect(mockEventRegistrationFindByEvent).toBeCalledWith(EVENT_ID);
        await Promise.resolve();
        expect(mockShipFindById).toBeCalledTimes(1);
        expect(mockShipFindById).toBeCalledWith(SHIP_ID);
        await Promise.resolve();
        expect(mockUserFindByIdSecured).toBeCalledTimes(1);
        expect(mockUserFindByIdSecured).toBeCalledWith(USER_ID);
        await Promise.resolve();
    });
});