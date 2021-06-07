import EventRegistration from '../../../../../src/database/model/EventRegistration';
import { Types } from 'mongoose';

jest.unmock('../../../../../src/database/repository/EventRegistrationRepo');

export const EVENTREG_ID = new Types.ObjectId();

export const mockEventRegistrationFindById = jest.fn(
    async (id: Types.ObjectId): Promise<EventRegistration | null> => {
      if (id.equals(EVENTREG_ID))
        return {
          _id: EVENTREG_ID,
        } as EventRegistration;
      return null;
    },
  );

export const mockEventRegistrationUpdate = jest.fn(
    async (eventRegistration: EventRegistration): Promise<EventRegistration> => {
      return eventRegistration;
});
  
export const mockEventRegistrationDelete = jest.fn(
    async (eventRegistration: EventRegistration): Promise<null> => {
        return null;
});

jest.mock('../../../../../src/database/repository/EventRegistrationRepo', () => ({
    get findById() {
        return mockEventRegistrationFindById;
    },
    get update() {
        return mockEventRegistrationUpdate;
    },
    get delete() {
        return mockEventRegistrationDelete;
    }
}));