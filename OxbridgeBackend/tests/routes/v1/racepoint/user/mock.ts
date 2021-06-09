import { Types } from 'mongoose';
import Event from '../../../../../src/database/model/Event';
import RacePoint from '../../../../../src/database/model/RacePoint';

jest.unmock('../../../../../src/database/repository/RacePointRepo');

export const RACEPOINT_ID = new Types.ObjectId();
export const EVENT_ID = new Types.ObjectId();

export const mockRacePointFindByEvent = jest.fn(
    async (id: Types.ObjectId): Promise<RacePoint[] | null> => {
      if (id.equals(EVENT_ID))
        return [{
          _id: RACEPOINT_ID,
        } as RacePoint];
      return null;
    },
);

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
    get findByEvent() {
      return mockRacePointFindByEvent;
    },
    get findStartAndFinish(){
        return mockRacePointFindByEvent;
    }
}));

jest.mock('../../../../../src/database/repository/EventRepo', () => ({
    get findById() {
      return mockEventFindById;
    },
}));