import { Types } from 'mongoose';
import EventRegistration, { EventRegistrationModel } from '../model/EventRegistration';

export default class EventRegistrationRepo {
    
    public static async findAll(): Promise<EventRegistration[]> {
        return EventRegistrationModel.find({})
        .lean<EventRegistration>()
        .exec();
    }

    public static async findById(_id: Types.ObjectId): Promise<EventRegistration | null> {
        return EventRegistrationModel.findOne({ _id: _id })
        .lean<EventRegistration>()
        .exec();
    }

    public static async findByShip(_id: Types.ObjectId): Promise<EventRegistration[]> {
        return EventRegistrationModel.find({ shipId: _id })
        .lean<EventRegistration>()
        .exec();
    }

    public static async findByEvent(_id: Types.ObjectId): Promise<EventRegistration[]> {
        return EventRegistrationModel.find({ eventId: _id })
        .lean<EventRegistration>()
        .exec();
    }

    public static async findByShipAndEvent(ship: Types.ObjectId, event: Types.ObjectId): Promise<EventRegistration[]> {
        return EventRegistrationModel.find({ shipId: ship, eventId: event })
        .lean<EventRegistration>()
        .exec();
    }

    public static async create(eventRegistration: EventRegistration): Promise<EventRegistration> {
        const createdEventRegistration = await EventRegistrationModel.create(eventRegistration);
        return createdEventRegistration.toObject();
    }

    public static async update(eventRegistration: EventRegistration): Promise<any> {
        return EventRegistrationModel.updateOne({ _id: eventRegistration._id }, { $set: { ...eventRegistration }})
        .lean<Event>()
        .exec();
    }

    public static async delete(eventRegistration: EventRegistration): Promise<any> {
        return EventRegistrationModel.findOneAndDelete({ _id: eventRegistration._id })
        .lean<Event>()
        .exec();
    }

    public static async deleteByEvent(_id: Types.ObjectId): Promise<any> {
        return EventRegistrationModel.deleteMany({ eventId: _id })
        .lean<EventRegistration>()
        .exec();
    }
}