import Event from '../../../src/database/model/Event';
import { Types } from 'mongoose';
import User from '../../../src/database/model/User';
import Ship from '../../../src/database/model/Ship';

export const SHIP_ID = new Types.ObjectId();
export const EVENT_ID = new Types.ObjectId();
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

export const mockEventFindById = jest.fn(
    async (id: Types.ObjectId): Promise<Event | null> => {
      if (id.equals(EVENT_ID))
        return {
          _id: EVENT_ID,
          name: 'Dummy Event',
          city: 'Dummy City',
          eventStart: new Date()
        } as Event;
      return null;
    },
)

jest.mock('../../../src/database/repository/UserRepo', () => ({
    get findByIdSecured() {
      return mockUserFindByIdSecured;
    },
}));

jest.mock('../../../src/database/repository/EventRepo', () => ({
    get findById() {
      return mockEventFindById;
    },
}));

jest.mock('../../../src/database/repository/ShipRepo', () => ({
    get findById() {
      return mockShipFindById;
    },
}));