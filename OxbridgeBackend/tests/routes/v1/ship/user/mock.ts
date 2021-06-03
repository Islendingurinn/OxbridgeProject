import { Types } from 'mongoose';
import { RoleCode } from '../../../../../src/database/model/Role';
import { USER_ROLE_ID } from '../../../../auth/authorization/mock';
import EventRegistration from '../../../../../src/database/model/EventRegistration';
import Role from '../../../../../src/database/model/Role';
import User from '../../../../../src/database/model/User';
import Ship from '../../../../../src/database/model/Ship';

jest.unmock('../../../../../src/database/repository/ShipRepo');

export const EVENT_ID = new Types.ObjectId();
export const SHIP_ID = new Types.ObjectId();
export const EVENTREG_ID = new Types.ObjectId();

export const mockShipFindAll = jest.fn(
    async (): Promise<Ship[]> => {
        return [{ _id: SHIP_ID } as Ship];
    }
);

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

export const mockShipFindById = jest.fn(async (id: Types.ObjectId) => {
    if (SHIP_ID.equals(id)) return [{ _id: SHIP_ID } as Ship];
    else return null;
});

export const mockEventRegistrationFindByEvent = jest.fn(async (id: Types.ObjectId) => {
    if (EVENT_ID.equals(id)) return [{ _id: EVENTREG_ID, shipId: SHIP_ID } as EventRegistration ];
    else return null;
});

export const mockShipCreate = jest.fn(
    async (ship: Ship): Promise<Ship> => {
        ship._id = SHIP_ID;
        return ship;
    },
);

export const mockShipUpdate = jest.fn(
    async (ship: Ship): Promise<Ship> => {
        ship._id = SHIP_ID;
        return ship;
    },
);

export const mockShipDelete = jest.fn(
    async (ship: Ship): Promise<null> => {
        return null;
    },
);

jest.mock('../../../../../src/database/repository/ShipRepo', () => ({
    get findAll(){
        return mockShipFindAll;
    },
    get findByUser(){
        return mockShipFindByUser;
    },
    get findById(){
        return mockShipFindById;
    },
    get create(){
        return mockShipCreate;
    },
    get update(){
        return mockShipUpdate;
    },
    get delete(){
        return mockShipDelete;
    }
}));

jest.mock('../../../../../src/database/repository/UserRepo', () => ({
    get findById() {
      return mockUserFindById;
    },
}));

jest.mock('../../../../../src/database/repository/EventRegistrationRepo', () => ({
    get findByEvent() {
      return mockEventRegistrationFindByEvent;
    },
}));