"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ship_1 = require("../model/Ship");
class ShipRepo {
    static async findAll() {
        return Ship_1.ShipModel.find({})
            .lean()
            .exec();
    }
    static async findById(_id) {
        return Ship_1.ShipModel.findOne({ _id: _id })
            .lean()
            .exec();
    }
    static async findByUser(_id) {
        return Ship_1.ShipModel.find({ _id: _id })
            .lean()
            .exec();
    }
    static async findByUserAndPopulate(_id) {
        return Ship_1.ShipModel.find({ _id: _id })
            .lean()
            .exec();
    }
    static async create(ship) {
        const createdShip = await Ship_1.ShipModel.create(ship);
        return createdShip.toObject();
    }
    static async update(ship) {
        return Ship_1.ShipModel.updateOne({ _id: ship._id }, { $set: { ...ship } })
            .lean()
            .exec();
    }
    static async delete(ship) {
        return Ship_1.ShipModel.findOneAndDelete({ _id: ship._id })
            .lean()
            .exec();
    }
}
exports.default = ShipRepo;
//# sourceMappingURL=ShipRepo.js.map