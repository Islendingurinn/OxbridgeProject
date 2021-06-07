import { Types } from 'mongoose';
import Event, { EventModel } from '../model/Event';

export default class EventRepo {

    public static async findById(id: Types.ObjectId): Promise<Event | null> {
        return EventModel.findOne({ _id: id })
        .lean<Event>()
        .exec();
    }

    public static async findHasNotBeenNotified(): Promise<Event[]> {
        return EventModel.find({ notified: false, isLive: false })
        .lean<Event>()
        .exec();
    }

    public static async findAll(): Promise<Event[]> {
        return EventModel.find({})
        .lean<Event>()
        .exec();
    }

    public static async create(event: Event): Promise<Event> {
        event.notified = false;
        event.isLive = false;
        const createdEvent = await EventModel.create(event);
        return createdEvent.toObject();
    }

    public static async update(event: Event): Promise<any> {
        return EventModel.updateOne({ _id: event._id }, { $set: { ...event }})
        .lean<Event>()
        .exec();
    }

    public static async delete(event: Event): Promise<any> {
        return EventModel.findOneAndDelete({ _id: event._id })
        .lean<Event>()
        .exec();
    }
}