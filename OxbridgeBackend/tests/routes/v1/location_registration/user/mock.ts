import { Types } from 'mongoose';
import { RoleCode } from '../../../../../src/database/model/Role';
import { USER_ROLE_ID } from '../../../../auth/authorization/mock';
import EventRegistration from '../../../../../src/database/model/EventRegistration';
import Role from '../../../../../src/database/model/Role';
import User from '../../../../../src/database/model/User';
import Ship from '../../../../../src/database/model/Ship';
import LocationRegistration from '../../../../../src/database/model/LocationRegistration';
import Logger from '../../../../../src/core/Logger';

jest.unmock('../../../../../src/database/repository/LocationRegistrationRepo');

export const LOCREG_ID = new Types.ObjectId();
export const EVENT_ID = new Types.ObjectId();
export const EVENTREG_ID = new Types.ObjectId();
export const SHIP_ID = new Types.ObjectId();

export const mockLocationRegistrationFindByEventRegistration = jest.fn(
    async (id: Types.ObjectId): Promise<LocationRegistration[] | null> => {
      if (id.equals(EVENTREG_ID))
        return [{
          _id: LOCREG_ID,
          raceScore: 10,
        } as LocationRegistration];
      return null;
    },
  );

export const mockLocationRegistrationFindAll = jest.fn(
    async (): Promise<LocationRegistration[]> => {
        return [{ _id: LOCREG_ID } as LocationRegistration];
    }
);

export const mockEventRegistrationFindByEvent = jest.fn(
    async (id: Types.ObjectId): Promise<EventRegistration[] | null> => {
        if (EVENT_ID.equals(id)) 
        return [{
             _id: EVENTREG_ID,
             shipId: SHIP_ID,
            } as EventRegistration];
        else return null;
});

export const mockLocationRegistrationCreate = jest.fn(
    async (locationRegistration: LocationRegistration): Promise<LocationRegistration> => {
        locationRegistration._id = LOCREG_ID;
        return locationRegistration;
    },
);

export const mockLocationRegistrationDeleteFromEventRegistration = jest.fn(
    async (id: Types.ObjectId): Promise<EventRegistration | null> => {
        if(EVENTREG_ID.equals(id))
            return null;
        else
            return { id: EVENTREG_ID } as EventRegistration;
});

export const mockUserFindById = jest.fn(async (id: Types.ObjectId) => {
    if (USER_ROLE_ID.equals(id))
     return { 
       _id: new Types.ObjectId(id),
       roles: [{ _id: USER_ROLE_ID, code: RoleCode.USER } as Role], 
      } as User;
    else return null;
});

export const mockUserFindByIdSecured = jest.fn(
    async (id: Types.ObjectId): Promise<User | null> => {
        if(USER_ROLE_ID.equals(id))
            return { _id: USER_ROLE_ID } as User;
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

export const mockEventRegistrationFindById = jest.fn(
    async (id: Types.ObjectId): Promise<EventRegistration | null> => {
        Logger.error("ID: " + id);
        Logger.error("EVENTREG_ID: " + EVENTREG_ID);
        if(EVENTREG_ID.equals(id))
            return { _id: EVENTREG_ID } as EventRegistration;
        else
            return null;
    }
)

jest.mock('../../../../../src/database/repository/LocationRegistrationRepo', () => ({
    get findAll(){
        return mockLocationRegistrationFindAll;
    },
    get findByEventRegistration(){
        return mockLocationRegistrationFindByEventRegistration;
    },
    get create(){
        return mockLocationRegistrationCreate;
    },
    get deleteFromEventRegistration(){
        return mockLocationRegistrationDeleteFromEventRegistration;
    }
}));

  jest.mock('../../../../../src/database/repository/EventRegistrationRepo', () => ({
    get findByEvent(){
        return mockEventRegistrationFindByEvent;
    },
    get findById(){
        return mockEventRegistrationFindById;
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

jest.mock('../../../../../src/database/repository/ShipRepo', () => ({
    get findById() {
      return mockShipFindById;
    },
}));