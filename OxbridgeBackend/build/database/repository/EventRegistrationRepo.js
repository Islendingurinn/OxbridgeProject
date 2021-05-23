"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventRegistration_1 = require("../model/EventRegistration");
class EventRegistrationRepo {
    static async findAll() {
        return EventRegistration_1.EventRegistrationModel.find({})
            .lean()
            .exec();
    }
    static async findById(_id) {
        return EventRegistration_1.EventRegistrationModel.findOne({ _id: _id })
            .lean()
            .exec();
    }
    static async findByShip(_id) {
        return EventRegistration_1.EventRegistrationModel.find({ shipId: _id })
            .lean()
            .exec();
    }
    static async findByEvent(_id) {
        return EventRegistration_1.EventRegistrationModel.find({ eventId: _id })
            .lean()
            .exec();
    }
    static async findByShipAndEvent(ship, event) {
        return EventRegistration_1.EventRegistrationModel.find({ shipId: ship, eventId: event })
            .lean()
            .exec();
    }
    static async create(eventRegistration) {
        const createdEventRegistration = await EventRegistration_1.EventRegistrationModel.create(eventRegistration);
        return createdEventRegistration.toObject();
    }
    static async update(eventRegistration) {
        return EventRegistration_1.EventRegistrationModel.updateOne({ _id: eventRegistration._id }, { $set: { ...eventRegistration } })
            .lean()
            .exec();
    }
    static async delete(eventRegistration) {
        return EventRegistration_1.EventRegistrationModel.findOneAndDelete({ _id: eventRegistration._id })
            .lean()
            .exec();
    }
    static async deleteByEvent(_id) {
        return EventRegistration_1.EventRegistrationModel.deleteMany({ eventId: _id })
            .lean()
            .exec();
    }
}
exports.default = EventRegistrationRepo;
//# sourceMappingURL=EventRegistrationRepo.js.map