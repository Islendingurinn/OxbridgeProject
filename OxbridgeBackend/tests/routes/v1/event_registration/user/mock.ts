import EventRegistration from '../../../../../src/database/model/EventRegistration';
import Ship from '../../../../../src/database/model/Ship';
import User from '../../../../../src/database/model/User';
import { Types } from 'mongoose';
import { USER_ROLE_ID } from '../../../../auth/authorization/mock';
import Role, { RoleCode } from '../../../../../src/database/model/Role';

jest.unmock('../../../../../src/database/repository/EventRegistrationRepo');

export const EVENTREG_ID = new Types.ObjectId();
export const EVENT_ID = new Types.ObjectId();
export const SHIP_ID = new Types.ObjectId();

export const mockEventRegistrationFindAll = jest.fn(
    async (): Promise<EventRegistration[]> => {
        return [{ _id: EVENTREG_ID } as EventRegistration];
    }
)

export const mockEventRegistrationFindByEvent = jest.fn(
    async (id: Types.ObjectId): Promise<EventRegistration[] | null> => {
        if(id.equals(EVENT_ID))
            return [{ _id: EVENTREG_ID, shipId: SHIP_ID } as EventRegistration];
        else
            return null;
    }
)

export const mockShipFindById = jest.fn(
    async (id: Types.ObjectId): Promise<Ship | null> => {
        if(SHIP_ID.equals(id))
            return { _id: SHIP_ID, userId: USER_ROLE_ID } as Ship;
        else
            return null;
    }
)

export const mockShipFindByUser = jest.fn(
    async (id: Types.ObjectId): Promise<Ship[] | null> => {
        if(USER_ROLE_ID.equals(id))
            return [{ _id: SHIP_ID, userId: USER_ROLE_ID } as Ship];
        else
            return null;
    }
)

export const mockEventRegistrationFindByShipAndEvent = jest.fn(
    async (shipId: Types.ObjectId, eventId: Types.ObjectId): Promise<EventRegistration[] | null> => {
        if(SHIP_ID.equals(shipId) && EVENT_ID.equals(eventId))
            return [{ _id: EVENTREG_ID } as EventRegistration];
        else
            return null;
    }
)

export const mockUserFindByIdSecured = jest.fn(
    async (id: Types.ObjectId): Promise<User | null> => {
        if(USER_ROLE_ID.equals(id))
            return { _id: USER_ROLE_ID } as User;
        else
            return null;
    }
)

export const mockEventRegistrationCreate = jest.fn(
    async (eventRegistration: EventRegistration): Promise<EventRegistration> => {
        eventRegistration._id = EVENTREG_ID;
        return eventRegistration;
    },
);

export const mockUserFindById = jest.fn(async (id: Types.ObjectId) => {
    if (USER_ROLE_ID.equals(id))
     return { 
       _id: new Types.ObjectId(id),
       roles: [{ _id: USER_ROLE_ID, code: RoleCode.USER } as Role], 
      } as User;
    else return null;
  });

jest.mock('../../../../../src/database/repository/EventRegistrationRepo', () => ({
    get findAll() {
      return mockEventRegistrationFindAll;
    },
    get create() {
        return mockEventRegistrationCreate;
    },
    get findByEvent() {
        return mockEventRegistrationFindByEvent;
    },
    get findByShipAndEvent() {
        return mockEventRegistrationFindByShipAndEvent;
    }
}));

jest.mock('../../../../../src/database/repository/ShipRepo', () => ({
    get findById() {
      return mockShipFindById;
    },
    get findByUser() {
        return mockShipFindByUser;
    }
}));

jest.mock('../../../../../src/database/repository/UserRepo', () => ({
    get findById() {
        return mockUserFindById;
      },
    get findByIdSecured() {
      return mockUserFindByIdSecured;
    },
}));
  