"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LocationRegistration_1 = require("../model/LocationRegistration");
class LocationRegistrationRepo {
    static async findAll() {
        return LocationRegistration_1.LocationRegistrationModel.find({})
            .lean()
            .exec();
    }
    static async findByEventRegistration(_id) {
        return LocationRegistration_1.LocationRegistrationModel.find({ eventRegId: _id })
            .lean()
            .exec();
    }
    static async create(locationRegistration) {
        const createdLocationRegistration = await LocationRegistration_1.LocationRegistrationModel.create(locationRegistration);
        return createdLocationRegistration.toObject();
    }
    static async update(locationRegistration) {
        return LocationRegistration_1.LocationRegistrationModel.updateOne({ _id: locationRegistration._id }, { $set: { ...locationRegistration } })
            .lean()
            .exec();
    }
    static async delete(locationRegistration) {
        return LocationRegistration_1.LocationRegistrationModel.findOneAndDelete({ _id: locationRegistration._id })
            .lean()
            .exec();
    }
    static async deleteFromEventRegistration(_id) {
        return LocationRegistration_1.LocationRegistrationModel.deleteMany({ eventRegId: _id })
            .lean()
            .exec();
    }
}
exports.default = LocationRegistrationRepo;
//# sourceMappingURL=LocationRegistrationRepo.js.map