import Event from '../../../../../src/database/model/Event';
import { Types } from 'mongoose';

jest.unmock('../../../../../src/database/repository/EventRepo');

export const EVENT_ID = new Types.ObjectId();
export const EVENT_ID_STARTED = new Types.ObjectId();
export const EVENT_ID_STOPPED = new Types.ObjectId();

export const mockEventFindById = jest.fn(
  async (id: Types.ObjectId): Promise<Event | null> => {
    if (id.equals(EVENT_ID))
      return {
        _id: EVENT_ID,
      } as Event;
    else if (id.equals(EVENT_ID_STARTED))
      return {
        _id: EVENT_ID_STARTED,
        isLive: true,
      } as Event;
    else if (id.equals(EVENT_ID_STOPPED))
      return {
        _id: EVENT_ID_STOPPED,
        isLive: false,
      } as Event;
    return null;
  },
);

export const mockEventCreate = jest.fn(
  async (event: Event): Promise<Event> => {
    event._id = EVENT_ID;
    return event;
  },
);

export const mockEventUpdate = jest.fn(
  async (event: Event): Promise<Event> => {
    return event;
});

export const mockEventDelete = jest.fn(
  async (event: Event): Promise<null> => {
    return null;
});

jest.mock('../../../../../src/database/repository/EventRepo', () => ({
  get findById() {
    return mockEventFindById;
  },
  get create() {
    return mockEventCreate;
  },
  get update() {
    return mockEventUpdate;
  },
  get delete() {
    return mockEventDelete;
  }
}));