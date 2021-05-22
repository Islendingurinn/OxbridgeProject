"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RacePoint_1 = require("../model/RacePoint");
class RacePointRepo {
    static async findByEvent(_id) {
        return RacePoint_1.RacePointModel.find({ eventId: _id })
            .sort({ '_id': -1 })
            .lean()
            .exec();
    }
    static async findStartAndFinish(_id) {
        return RacePoint_1.RacePointModel.find({ eventId: _id,
            $or: [{ type: 'startLine' }, { type: 'finishLine' }] })
            .sort({ '_id': -1 })
            .lean()
            .exec();
    }
    static async create(racePoint) {
        const createdRacePoint = await RacePoint_1.RacePointModel.create(racePoint);
        return createdRacePoint.toObject();
    }
    static async update(racePoint) {
        return RacePoint_1.RacePointModel.updateOne({ _id: racePoint._id }, { $set: { ...racePoint } })
            .lean()
            .exec();
    }
    static async delete(racePoint) {
        return RacePoint_1.RacePointModel.findOneAndDelete({ _id: racePoint._id })
            .lean()
            .exec();
    }
    static async deleteByEvent(_id) {
        return RacePoint_1.RacePointModel.deleteMany({ eventId: _id })
            .lean()
            .exec();
    }
}
exports.default = RacePointRepo;
//# sourceMappingURL=RacePointRepo.js.map