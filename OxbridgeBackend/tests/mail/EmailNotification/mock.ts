import Event from '../../../src/database/model/Event';
import { Types } from 'mongoose';
import User from '../../../src/database/model/User';
import Ship from '../../../src/database/model/Ship';
import EventRegistration from '../../../src/database/model/EventRegistration';

export const SHIP_ID = new Types.ObjectId();
export const EVENT_ID = new Types.ObjectId();
export const EVENTREG_ID = new Types.ObjectId();
export const USER_ID = new Types.ObjectId();

export const mockShipFindById = jest.fn(
    async (id: Types.ObjectId): Promise<Ship | null> => {
      if (id.equals(SHIP_ID))
        return {
          _id: SHIP_ID,
          userId: USER_ID
        } as Ship;
      return null;
    },
)

export const mockUserFindByIdSecured = jest.fn(
    async (id: Types.ObjectId): Promise<User | null> => {
      if (id.equals(USER_ID))
        return {
          _id: USER_ID,
          email: 'dummy@test.xyz'
        } as User;
      return null;
    },
)

export const mockEventFindHasNotBeenNotified = jest.fn(
  async (): Promise<Event[]> => {
    let date: Date = new Date();
    date.setDate(date.getDate() - 1);
      return [{
        _id: EVENT_ID,
        eventStart: date
      } as Event];
  },
)

export const mockEventRegistrationFindByEvent = jest.fn(
  async (id: Types.ObjectId): Promise<EventRegistration[] | null> => {
    if(EVENT_ID.equals(id))
      return [{
        _id: EVENTREG_ID,
        shipId: SHIP_ID
      } as EventRegistration];
    else return null;
  }
)

export const mockEventUpdate = jest.fn(
  async (event: Event): Promise<Event | null> => {
    if(EVENT_ID.equals(event._id))
      return event;
    else return null;
  } 
)

jest.mock('../../../src/database/repository/UserRepo', () => ({
    get findByIdSecured() {
      return mockUserFindByIdSecured;
    },
}));

jest.mock('../../../src/database/repository/ShipRepo', () => ({
    get findById() {
      return mockShipFindById;
    },
}));

jest.mock('../../../src/database/repository/EventRepo', () => ({
  get findHasNotBeenNotified() {
    return mockEventFindHasNotBeenNotified;
  },
  get update() {
    return mockEventUpdate;
  }
}));

jest.mock('../../../src/database/repository/EventRegistrationRepo', () => ({
  get findByEvent() {
    return mockEventRegistrationFindByEvent;
  },
}));