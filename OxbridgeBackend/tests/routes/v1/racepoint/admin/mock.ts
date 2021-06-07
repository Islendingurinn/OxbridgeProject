import Event from '../../../../../src/database/model/Event';
import RacePoint from '../../../../../src/database/model/RacePoint';
import { Types } from 'mongoose';

jest.unmock('../../../../../src/database/repository/RacePointRepo');

export const RACEPOINT_ID = new Types.ObjectId();
export const EVENT_ID = new Types.ObjectId();

export const mockRacePointCreate = jest.fn(
    async (racePoint: RacePoint): Promise<RacePoint> => {
        racePoint._id = RACEPOINT_ID;
        return racePoint;
    },
);

export const mockRacePointDeleteByEvent = jest.fn(
    async (event: Event): Promise<null> => {
      return null;
});

export const mockEventFindById = jest.fn(
    async (id: Types.ObjectId): Promise<Event | null> => {
      if (id.equals(EVENT_ID))
        return {
          _id: EVENT_ID,
        } as Event;
      return null;
    },
);

jest.mock('../../../../../src/database/repository/RacePointRepo', () => ({
    get create() {
      return mockRacePointCreate;
    },
    get deleteByEvent() {
      return mockRacePointDeleteByEvent;
    },
}));

jest.mock('../../../../../src/database/repository/EventRepo', () => ({
    get findById() {
      return mockEventFindById;
    },
}));