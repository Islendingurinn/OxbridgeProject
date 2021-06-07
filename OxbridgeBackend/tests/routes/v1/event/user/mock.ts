import Event from '../../../../../src/database/model/Event';
import { Types } from 'mongoose';
import { USER_ROLE_ID } from '../../../../auth/authorization/mock';
import User from '../../../../../src/database/model/User';
import Ship from '../../../../../src/database/model/Ship';
import RacePoint from '../../../../../src/database/model/RacePoint';
import EventRegistration from '../../../../../src/database/model/EventRegistration';
import Role, { RoleCode } from '../../../../../src/database/model/Role';

jest.unmock('../../../../../src/database/repository/EventRepo');

export const EVENT_ID = new Types.ObjectId();
export const SHIP_ID = new Types.ObjectId();
export const EVENTREG_ID = new Types.ObjectId();

export const mockEventFindById = jest.fn(
  async (id: Types.ObjectId): Promise<Event | null> => {
    if (id.equals(EVENT_ID))
      return {
        _id: EVENT_ID,
      } as Event;
    return null;
  },
);

export const mockEventFindAll = jest.fn(
    async (): Promise<Event[]> => {
        return [{ _id: EVENT_ID } as Event];
    }
)

export const mockUserFindById = jest.fn(async (id: Types.ObjectId) => {
  if (USER_ROLE_ID.equals(id))
   return { 
     _id: new Types.ObjectId(id),
     roles: [{ _id: USER_ROLE_ID, code: RoleCode.USER } as Role], 
    } as User;
  else return null;
});

export const mockShipFindByUser = jest.fn(async (id: Types.ObjectId) => {
  if (USER_ROLE_ID.equals(id)) return [{ _id: SHIP_ID } as Ship];
  else return null;
});

export const mockEventRegistrationFindByShip = jest.fn(async (id: Types.ObjectId) => {
  if (SHIP_ID.equals(id)) return [{ _id: EVENTREG_ID, eventId: EVENT_ID } as EventRegistration ];
  else return null;
});

export const mockRacePointFindByEvent = jest.fn(async (id: Types.ObjectId) => {
  if (EVENT_ID.equals(id)) return [{ _id: new Types.ObjectId() } as RacePoint];
  else return null;
});

jest.mock('../../../../../src/database/repository/UserRepo', () => ({
  get findById() {
    return mockUserFindById;
  },
}));

jest.mock('../../../../../src/database/repository/ShipRepo', () => ({
  get findByUser() {
    return mockShipFindByUser;
  },
}));

jest.mock('../../../../../src/database/repository/EventRegistrationRepo', () => ({
  get findByShip() {
    return mockEventRegistrationFindByShip;
  },
}));

jest.mock('../../../../../src/database/repository/RacePointRepo', () => ({
  get findByEvent() {
    return mockRacePointFindByEvent;
  },
}));

jest.mock('../../../../../src/database/repository/EventRepo', () => ({
  get findById() {
    return mockEventFindById;
  },
  get findAll(){
      return mockEventFindAll;
  },
}));