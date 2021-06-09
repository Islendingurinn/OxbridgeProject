import {
    USER
} from './mock';

import EmailPasswordReset from '../../../src/mail/EmailPasswordReset';

describe('EmailConfirmation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('SUCCESS', async () => {
        new EmailPasswordReset(USER, "fakepassword");
    });
});