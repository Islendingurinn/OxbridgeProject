"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("../model/Event");
class EventRepo {
    static async findById(id) {
        return Event_1.EventModel.findOne({ _id: id })
            .lean()
            .exec();
    }
    static async findHasBeenNotified() {
        return Event_1.EventModel.find({ notified: false, isLive: false })
            .lean()
            .exec();
    }
    static async findAll() {
        return Event_1.EventModel.find({})
            .lean()
            .exec();
    }
    static async create(event) {
        event.notified = false;
        event.isLive = false;
        const createdEvent = await Event_1.EventModel.create(event);
        return createdEvent.toObject();
    }
    static async update(event) {
        return Event_1.EventModel.updateOne({ _id: event._id }, { $set: { ...event } })
            .lean()
            .exec();
    }
    static async delete(event) {
        return Event_1.EventModel.findOneAndDelete({ _id: event._id })
            .lean()
            .exec();
    }
}
exports.default = EventRepo;
//# sourceMappingURL=EventRepo.js.map